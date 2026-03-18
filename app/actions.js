'use server';

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { bootstrapAppData } from '@/lib/bootstrap';
import { createAdminSession, destroyAdminSession, requireAdmin } from '@/lib/admin-auth';
import { createParticipantSession, destroyParticipantSession, getParticipantSession } from '@/lib/participant-auth';
import { ensureCertificate, generateReferenceCode, syncEnrollmentProgress } from '@/lib/certificates';
import { getGeminiApiKey, saveGeminiApiKey } from '@/lib/admin-settings';
import { getParticipantAccessEnrollment } from '@/lib/data';
import { isValidPhone, normalizeEmail, normalizePhone, sanitizeText } from '@/lib/validation';
import { sendEmail } from '@/lib/email';

const enrollmentSchema = z.object({
  courseSlug: z.string().min(1),
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(7),
  city: z.string().optional(),
  organization: z.string().optional(),
  visualProfile: z.string().optional(),
  notes: z.string().optional()
});

const adminUpdateSchema = z.object({
  enrollmentId: z.string().min(1),
  status: z.enum(['PENDING_PAYMENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED']),
  paymentStatus: z.enum(['PENDING', 'VERIFIED', 'WAIVED']),
  attendancePercent: z.coerce.number().min(0).max(100),
  zoomConfirmed: z.string().optional()
});

const participantAccessSchema = z.object({
  email: z.string().email(),
  referenceCode: z.string().min(5)
});

const assistantRequestSchema = z.object({
  prompt: z.string().min(12).max(6000),
  actionType: z.enum(['general', 'create-course', 'create-content']),
  courseId: z.string().optional()
});

const assistantCourseSchema = z.object({
  title: z.string().min(5),
  summary: z.string().min(10),
  description: z.string().min(20),
  modality: z.string().min(3),
  priceCents: z.coerce.number().min(0),
  priceLabel: z.string().min(1),
  seats: z.coerce.number().min(0).optional(),
  startDate: z.string().min(8),
  endDate: z.string().min(8),
  duration: z.string().min(2),
  location: z.string().min(2),
  instructor: z.string().min(2),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
  modules: z.array(
    z.object({
      title: z.string().min(4),
      description: z.string().min(10),
      durationMinutes: z.coerce.number().min(10).max(300).optional()
    })
  ).min(1).max(12)
});

// Simple in-memory rate limiting for admin login (per instance)
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LOGIN_MAX_ATTEMPTS = 5;

function getRateLimitKey(formData) {
  // Fall back to user-agent when IP is unavailable in server actions
  const ip = formData.get('ip') || '';
  const ua = formData.get('userAgent') || '';
  return `${ip}|${ua}`.trim() || 'unknown';
}

function isRateLimited(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key) || [];
  const recent = entry.filter((ts) => now - ts < LOGIN_WINDOW_MS);
  loginAttempts.set(key, recent);
  return recent.length >= LOGIN_MAX_ATTEMPTS;
}

function recordAttempt(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key) || [];
  entry.push(now);
  loginAttempts.set(key, entry);
}

function normalizeSlug(rawValue) {
  return String(rawValue || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

async function resolveUniqueCourseSlug(baseSlug) {
  let slug = baseSlug || `curso-${Date.now()}`;
  let index = 2;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }
  return slug;
}

function extractJsonObject(rawText) {
  const raw = String(rawText || '').trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('No se encontró un JSON válido en la respuesta.');
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function readGeminiTextResponse(payload) {
  const candidates = Array.isArray(payload?.candidates) ? payload.candidates : [];
  const parts = candidates[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }
  return parts.map((part) => part?.text || '').join('\n').trim();
}

const ASSISTANT_ENABLED = process.env.ADMIN_ASSISTANT_DISABLED !== '1';
const ADMIN_RESET_EMAIL = process.env.ADMIN_RESET_EMAIL || 'expertostird@gmail.com';
const ADMIN_RESET_TTL_MS = 1000 * 60 * 20; // 20 minutos
const ADMIN_RESET_MAX_ATTEMPTS = 3;
const ADMIN_PASSWORD_HASH_KEY = 'admin_password_hash';
const ADMIN_RESET_TOKEN_KEY = 'admin_reset_token';

function logAssistantEvent(event) {
  // Placeholder for structured logging; replace with real logger/DB audit
  console.info('[assistant]', JSON.stringify(event));
}

function generateToken(size = 32) {
  return randomBytes(size).toString('hex');
}

function getPasswordSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_ACCESS_PASSWORD || 'intevopedi-local-admin';
}

function hashAdminPassword(raw) {
  return createHmac('sha256', getPasswordSecret()).update(raw).digest('hex');
}

async function getStoredAdminPasswordHash() {
  const setting = await prisma.adminSetting.findUnique({ where: { key: ADMIN_PASSWORD_HASH_KEY }, select: { value: true } });
  return setting?.value || '';
}

async function setStoredAdminPasswordHash(rawPassword) {
  const hashed = hashAdminPassword(rawPassword);
  await prisma.adminSetting.upsert({
    where: { key: ADMIN_PASSWORD_HASH_KEY },
    update: { value: hashed },
    create: { key: ADMIN_PASSWORD_HASH_KEY, value: hashed }
  });
  return hashed;
}

async function saveResetToken(token, expiresAt) {
  await prisma.adminSetting.upsert({
    where: { key: ADMIN_RESET_TOKEN_KEY },
    update: { value: JSON.stringify({ token, expiresAt }) },
    create: { key: ADMIN_RESET_TOKEN_KEY, value: JSON.stringify({ token, expiresAt }) }
  });
}

async function readResetToken() {
  const setting = await prisma.adminSetting.findUnique({ where: { key: ADMIN_RESET_TOKEN_KEY }, select: { value: true } });
  if (!setting?.value) return null;
  try {
    return JSON.parse(setting.value);
  } catch (error) {
    return null;
  }
}

async function clearResetToken() {
  try {
    await prisma.adminSetting.delete({ where: { key: ADMIN_RESET_TOKEN_KEY } });
  } catch (error) {}
}

export async function updateParticipantProfile(formData) {
  const session = await getParticipantSession();
  if (!session) redirect('/participantes');

  const rawValues = Object.fromEntries(formData.entries());
  
  const data = {
    fullName: sanitizeText(rawValues.fullName || ''),
    phone: normalizePhone(rawValues.phone || ''),
    city: sanitizeText(rawValues.city || ''),
    organization: sanitizeText(rawValues.organization || ''),
    visualProfile: sanitizeText(rawValues.visualProfile || ''),
    notes: sanitizeText(rawValues.notes || '')
  };

  await prisma.participant.update({
    where: { id: session.participantId },
    data
  });

  revalidatePath('/campus');
  revalidatePath('/perfil');
  redirect('/campus?profileUpdated=1');
}

export async function claimCourseCertificate(formData) {
  const session = await getParticipantSession();
  if (!session) redirect('/participantes');

  const enrollmentId = String(formData.get('enrollmentId') || '');
  
  if (!enrollmentId) return;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true }
  });

  if (!enrollment || enrollment.participantId !== session.participantId) {
    redirect('/campus?error=' + encodeURIComponent('No tienes permiso para esta acción.'));
  }

  // Permitir generación automática SOLO para el curso específico ya impartido
  if (enrollment.course.slug === 'ia-apoyo-discapacidad-visual') {
    // Marcar como completado si no lo estaba
    if (enrollment.status !== 'COMPLETED') {
      await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'COMPLETED',
          progressPercent: 100,
          completedAt: new Date()
        }
      });
    }

    // Generar el certificado
    await ensureCertificate(enrollmentId);
    
    revalidatePath('/campus');
    redirect('/campus?certificateIssued=1');
  } else {
    redirect('/campus?error=' + encodeURIComponent('Este curso requiere completar todos los módulos manualmente.'));
  }
}

export async function submitEnrollment(formData) {
  const rawValues = Object.fromEntries(formData.entries());
  const normalizedValues = {
    courseSlug: sanitizeText(rawValues.courseSlug),
    fullName: sanitizeText(rawValues.fullName),
    email: normalizeEmail(rawValues.email),
    phone: normalizePhone(rawValues.phone),
    city: sanitizeText(rawValues.city),
    organization: sanitizeText(rawValues.organization),
    visualProfile: sanitizeText(rawValues.visualProfile),
    notes: sanitizeText(rawValues.notes)
  };
  const parsed = enrollmentSchema.safeParse(normalizedValues);
  const courseSlug = rawValues.courseSlug;

  if (!parsed.success) {
    redirect(`/cursos/${courseSlug}?error=${encodeURIComponent('Completa correctamente el formulario de inscripción.')}`);
  }

  if (!isValidPhone(parsed.data.phone)) {
    redirect(`/cursos/${courseSlug}?error=${encodeURIComponent('Introduce un teléfono válido de 10 dígitos.')}`);
  }

  let destination = `/cursos/${courseSlug}?error=${encodeURIComponent('No se pudo completar la inscripción en este momento.')}`;

  try {
    await bootstrapAppData();

    const course = await prisma.course.findUnique({
      where: { slug: parsed.data.courseSlug },
      include: { modules: true }
    });

    if (!course) {
      destination = `/cursos/${courseSlug}?error=${encodeURIComponent('El curso solicitado no está disponible.')}`;
    } else {
      const participant = await prisma.participant.upsert({
        where: { email: parsed.data.email },
        update: {
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          city: parsed.data.city,
          organization: parsed.data.organization,
          visualProfile: parsed.data.visualProfile,
          notes: parsed.data.notes
        },
        create: {
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone,
          city: parsed.data.city,
          organization: parsed.data.organization,
          visualProfile: parsed.data.visualProfile,
          notes: parsed.data.notes
        }
      });

      let referenceCode = generateReferenceCode();

      while (await prisma.enrollment.findUnique({ where: { referenceCode } })) {
        referenceCode = generateReferenceCode();
      }

      const enrollment = await prisma.enrollment.upsert({
        where: {
          courseId_participantId: {
            courseId: course.id,
            participantId: participant.id
          }
        },
        update: {
          status: 'CONFIRMED',
          paymentStatus: 'PENDING'
        },
        create: {
          referenceCode,
          courseId: course.id,
          participantId: participant.id,
          status: 'CONFIRMED',
          paymentStatus: 'PENDING'
        }
      });

      await prisma.progress.createMany({
        data: course.modules.map((moduleData) => ({
          enrollmentId: enrollment.id,
          moduleId: moduleData.id
        })),
        skipDuplicates: true
      });

      // Send Welcome / Confirmation Email
      await sendEmail({
        to: participant.email,
        subject: `Inscripción Confirmada: ${course.title}`,
        html: `
          <h1>¡Hola ${participant.fullName}!</h1>
          <p>Tu inscripción al curso <strong>${course.title}</strong> ha sido exitosa.</p>
          <p>Tu código de acceso es: <strong>${enrollment.referenceCode}</strong></p>
          <p>Puedes acceder al campus entrando aquí e ingresando tu correo junto con tu código:</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/participantes?email=${encodeURIComponent(participant.email)}">Ir al Campus</a>
        `
      });

      revalidatePath('/');
      revalidatePath('/cursos');
      revalidatePath(`/cursos/${course.slug}`);
      destination = `/participantes?registered=1&email=${encodeURIComponent(participant.email)}`;
    }
  } catch (error) {
    destination = `/cursos/${courseSlug}?error=${encodeURIComponent('No se pudo completar la inscripción. Revisa la conexión a la base de datos.')}`;
  }

  redirect(destination);
}

export async function toggleModuleProgress(formData) {
  const rawValues = Object.fromEntries(formData.entries());
  const enrollmentId = String(rawValues.enrollmentId || '');
  const moduleId = String(rawValues.moduleId || '');
  const referenceCode = String(rawValues.referenceCode || '');
  const completed = rawValues.completed === 'true';

  if (!enrollmentId || !moduleId || !referenceCode) {
    redirect('/cursos');
  }

  const session = await getParticipantSession();
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: {
      id: true,
      participantId: true,
      referenceCode: true
    }
  });

  if (!session || !enrollment || session.participantId !== enrollment.participantId || enrollment.referenceCode !== referenceCode) {
    redirect('/participantes?error=' + encodeURIComponent('Tu sesión no autoriza cambios sobre esta inscripción.'));
  }

  await prisma.progress.upsert({
    where: {
      enrollmentId_moduleId: {
        enrollmentId,
        moduleId
      }
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null
    },
    create: {
      enrollmentId,
      moduleId,
      completed,
      completedAt: completed ? new Date() : null
    }
  });

  await syncEnrollmentProgress(enrollmentId);
  revalidatePath(`/mi-inscripcion/${referenceCode}`);
  revalidatePath('/campus');
  redirect(`/mi-inscripcion/${referenceCode}`);
}

export async function requestParticipantAccessCode(formData) {
  const email = normalizeEmail(formData.get('email'));
  
  if (!email) {
    return { error: 'Introduce un correo electrónico válido.' };
  }

  // Find any active enrollment for this email
  const enrollment = await prisma.enrollment.findFirst({
    where: { participant: { email } },
    orderBy: { createdAt: 'desc' },
    select: { referenceCode: true }
  });

  if (!enrollment) {
    return { error: 'No encontramos ninguna inscripción con este correo.' };
  }

  // Send Access Code Email
  await sendEmail({
    to: email,
    subject: 'Tu Código de Acceso - INTEVOPEDI',
    html: `
      <h2>Aquí tienes tu código de acceso</h2>
      <p>Has solicitado tu código de acceso para entrar a los cursos de INTEVOPEDI.</p>
      <p>Tu código es: <strong>${enrollment.referenceCode}</strong></p>
      <p>Puedes acceder a tu campus ingresando a este enlace:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/participantes?code=${enrollment.referenceCode}">Acceder al Campus</a>
    `
  });

  return { success: true };
}

export async function participantAccessLogin(formData) {
  const normalizedValues = {
    email: normalizeEmail(formData.get('email')),
    referenceCode: sanitizeText(formData.get('referenceCode')).toUpperCase()
  };

  const parsed = participantAccessSchema.safeParse(normalizedValues);

  if (!parsed.success) {
    redirect(`/participantes?error=${encodeURIComponent('Introduce tu correo y tu código de inscripción correctamente.')}`);
  }

  const enrollment = await getParticipantAccessEnrollment(parsed.data.referenceCode, parsed.data.email);

  if (!enrollment) {
    redirect(`/participantes?error=${encodeURIComponent('No encontramos una inscripción que coincida con ese correo y código.')}`);
  }

  await createParticipantSession({
    participantId: enrollment.participantId,
    referenceCode: enrollment.referenceCode
  });

  redirect('/campus');
}

export async function participantLogout() {
  await destroyParticipantSession();
  redirect('/participantes');
}

export async function adminLogin(formData) {
  const hdrs = headers();
  const key = getRateLimitKey({
    get(name) {
      if (name === 'ip') return hdrs.get('x-forwarded-for') || hdrs.get('x-real-ip') || '';
      if (name === 'userAgent') return hdrs.get('user-agent') || '';
      return '';
    }
  });

  if (isRateLimited(key)) {
    redirect(`/admin/login?error=${encodeURIComponent('Demasiados intentos. Inténtalo en unos minutos.')}`);
  }

  const password = sanitizeText(formData.get('password'));
  const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD || '';
  const storedHash = await getStoredAdminPasswordHash();

  if (!password || password.length < 12) {
    recordAttempt(key);
    redirect(`/admin/login?error=${encodeURIComponent('Contraseña inválida o demasiado corta.')}`);
  }

  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expectedPassword);
  const computedHash = hashAdminPassword(password);
  const storedHashBuffer = storedHash ? Buffer.from(storedHash) : null;

  const matchesEnv = expectedPassword && passwordBuffer.length === expectedBuffer.length && timingSafeEqual(passwordBuffer, expectedBuffer);
  const matchesStored = storedHashBuffer && storedHashBuffer.length === Buffer.from(computedHash).length && timingSafeEqual(storedHashBuffer, Buffer.from(computedHash));

  if (!matchesEnv && !matchesStored) {
    recordAttempt(key);
    redirect(`/admin/login?error=${encodeURIComponent('Credenciales inválidas.')}`);
  }

  // Successful auth: reset attempts for key
  loginAttempts.delete(key);
  await createAdminSession();
  redirect('/admin');
}

const resetRequests = new Map();

function recordResetAttempt(key) {
  const now = Date.now();
  const entry = resetRequests.get(key) || [];
  const recent = entry.filter((ts) => now - ts < ADMIN_RESET_TTL_MS);
  recent.push(now);
  resetRequests.set(key, recent);
  return recent.length;
}

export async function requestAdminPasswordReset() {
  const hdrs = headers();
  const key = getRateLimitKey({
    get(name) {
      if (name === 'ip') return hdrs.get('x-forwarded-for') || hdrs.get('x-real-ip') || '';
      if (name === 'userAgent') return hdrs.get('user-agent') || '';
      return '';
    }
  });

  const attempts = recordResetAttempt(key);
  if (attempts > ADMIN_RESET_MAX_ATTEMPTS) {
    redirect(`/admin/login?error=${encodeURIComponent('Demasiadas solicitudes. Intenta más tarde.')}`);
  }

  const active = await readResetToken();
  if (active?.expiresAt && active.expiresAt > Date.now()) {
    redirect(`/admin/login?saved=${encodeURIComponent('Ya se envió un enlace de restablecimiento vigente.')}`);
  }

  const token = generateToken(24);
  const expiresAt = Date.now() + ADMIN_RESET_TTL_MS;
  await saveResetToken(token, expiresAt);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/admin/reset?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: ADMIN_RESET_EMAIL,
    subject: 'Restablecer contraseña de administrador - INTEVOPEDI',
    html: `
      <p>Recibimos una solicitud para restablecer la contraseña de administración.</p>
      <p>Haz clic en el siguiente enlace para definir una nueva contraseña (expira en 20 minutos):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `
  });

  redirect(`/admin/login?saved=${encodeURIComponent('Enviamos un enlace de restablecimiento al correo del administrador.')}`);
}

export async function completeAdminPasswordReset(formData) {
  const token = sanitizeText(formData.get('token'));
  const newPassword = sanitizeText(formData.get('password'));

  if (!token || !newPassword || newPassword.length < 12) {
    redirect(`/admin/reset?error=${encodeURIComponent('Token inválido o contraseña demasiado corta.')}`);
  }

  const stored = await readResetToken();
  if (!stored?.token || !stored?.expiresAt || stored.expiresAt < Date.now()) {
    redirect(`/admin/reset?error=${encodeURIComponent('El enlace ha expirado o no es válido.')}`);
  }

  if (stored.token !== token) {
    redirect(`/admin/reset?error=${encodeURIComponent('Token incorrecto.')}`);
  }

  await setStoredAdminPasswordHash(newPassword);
  await clearResetToken();
  loginAttempts.clear();

  redirect(`/admin/login?saved=${encodeURIComponent('Contraseña actualizada. Inicia sesión con la nueva clave.')}`);
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect('/');
}

export async function updateGeminiApiKeyAction(formData) {
  await requireAdmin();
  const rawApiKey = String(formData.get('geminiApiKey') || '').trim();

  if (rawApiKey && rawApiKey.length < 20) {
    redirect('/admin/ajustes?error=' + encodeURIComponent('La API key parece incompleta.'));
  }

  await saveGeminiApiKey(rawApiKey);
  revalidatePath('/admin/ajustes');
  redirect('/admin/ajustes?saved=1');
}

export async function runAdminAssistantAction(formData) {
  await requireAdmin();
  if (!ASSISTANT_ENABLED) {
    return { ok: false, error: 'El asistente está deshabilitado por configuración.' };
  }
  const parsed = assistantRequestSchema.safeParse({
    prompt: String(formData.get('prompt') || '').trim(),
    actionType: String(formData.get('actionType') || 'general'),
    courseId: String(formData.get('courseId') || '')
  });

  if (!parsed.success) {
    return { ok: false, error: 'Escribe una solicitud más completa para el asistente.' };
  }

  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    return { ok: false, error: 'Configura tu API key de Gemini en Ajustes antes de usar el asistente.' };
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const selectedCourse = parsed.data.courseId
    ? await prisma.course.findUnique({
        where: { id: parsed.data.courseId },
        include: {
          modules: {
            orderBy: { order: 'asc' }
          }
        }
      })
    : null;

  const courseContext = selectedCourse
    ? `Curso seleccionado: ${selectedCourse.title}\nResumen: ${selectedCourse.summary}\nMódulos: ${selectedCourse.modules.map((m) => `${m.order}. ${m.title}`).join(' | ')}`
    : 'No hay curso seleccionado.';

  const modeGuide = parsed.data.actionType === 'create-course'
    ? 'Debes devolver un objeto JSON con courseDraft completo y modules.'
    : parsed.data.actionType === 'create-content'
      ? 'Debes devolver un objeto JSON con courseContentDraft y newModules sugeridos.'
      : 'Debes devolver orientación operativa y accesible para administración.';

  const systemPrompt = `
Eres un asistente experto en gestión académica inclusiva para discapacidad visual.
Responde SIEMPRE en español.
Responde SOLO en JSON con esta estructura:
{
  "summary": "texto breve",
  "audioBrief": "texto corto apto para lectura por voz",
  "suggestedButtons": ["acción 1", "acción 2", "acción 3"],
  "courseDraft": null o {
    "title": "",
    "summary": "",
    "description": "",
    "modality": "",
    "priceCents": 0,
    "priceLabel": "",
    "seats": 0,
    "startDate": "2026-05-01T15:00:00.000Z",
    "endDate": "2026-05-01T18:00:00.000Z",
    "duration": "",
    "location": "",
    "instructor": "",
    "status": "DRAFT",
    "modules": [{"title":"","description":"","durationMinutes":60}]
  },
  "courseContentDraft": null o {
    "courseObjective": "",
    "accessibleMaterials": ["", ""],
    "assessmentIdeas": ["", ""],
    "newModules": [{"title":"","description":"","durationMinutes":60}]
  }
}
No uses markdown.
${modeGuide}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nContexto actual:\n${courseContext}\n\nSolicitud del admin:\n${parsed.data.prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1800
        }
      })
    });

    if (!response.ok) {
      return { ok: false, error: 'Gemini no respondió correctamente. Verifica API key y modelo.' };
    }

    const payload = await response.json();
    const text = readGeminiTextResponse(payload);
    const data = extractJsonObject(text);

    const sanitized = {
      summary: String(data.summary || ''),
      audioBrief: String(data.audioBrief || ''),
      suggestedButtons: Array.isArray(data.suggestedButtons) ? data.suggestedButtons.slice(0, 4) : [],
      courseDraft: data.courseDraft || null,
      courseContentDraft: data.courseContentDraft || null
    };

    logAssistantEvent({
      type: 'assistant.response',
      prompt: parsed.data.prompt.slice(0, 300),
      actionType: parsed.data.actionType,
      courseId: parsed.data.courseId || null,
      hasCourseDraft: Boolean(sanitized.courseDraft),
      hasContentDraft: Boolean(sanitized.courseContentDraft)
    });

    return { ok: true, data: sanitized };
  } catch (error) {
    logAssistantEvent({ type: 'assistant.error', message: String(error?.message || error) });
    return { ok: false, error: 'No se pudo procesar la respuesta del asistente.' };
  }
}

export async function createCourseFromAssistantAction(formData) {
  await requireAdmin();
  if (!ASSISTANT_ENABLED) {
    return { ok: false, error: 'El asistente está deshabilitado por configuración.' };
  }
  const payload = String(formData.get('courseDraft') || '');
  if (!payload) {
    return { ok: false, error: 'No se recibió borrador de curso.' };
  }

  try {
    const draft = assistantCourseSchema.parse(JSON.parse(payload));
    const baseSlug = normalizeSlug(draft.title);
    const slug = await resolveUniqueCourseSlug(baseSlug);

    const course = await prisma.course.create({
      data: {
        slug,
        title: draft.title,
        summary: draft.summary,
        description: draft.description,
        modality: draft.modality,
        priceCents: draft.priceCents,
        priceLabel: draft.priceLabel,
        seats: typeof draft.seats === 'number' ? draft.seats : null,
        startDate: new Date(draft.startDate),
        endDate: new Date(draft.endDate),
        duration: draft.duration,
        location: draft.location,
        instructor: draft.instructor,
        status: 'DRAFT'
      }
    });

    await prisma.module.createMany({
      data: draft.modules.map((moduleItem, index) => ({
        courseId: course.id,
        order: index + 1,
        title: moduleItem.title,
        description: moduleItem.description,
        durationMinutes: moduleItem.durationMinutes || null
      }))
    });

    revalidatePath('/admin');
    revalidatePath('/admin/ajustes');

    logAssistantEvent({ type: 'assistant.createCourse', courseId: course.id, title: draft.title });
    return { ok: true, message: 'Curso creado como borrador.' };
  } catch (error) {
    logAssistantEvent({ type: 'assistant.createCourse.error', message: String(error?.message || error) });
    return { ok: false, error: 'No se pudo crear el curso.' };
  }
}

export async function appendModulesFromAssistantAction(formData) {
  await requireAdmin();
  if (!ASSISTANT_ENABLED) {
    return { ok: false, error: 'El asistente está deshabilitado por configuración.' };
  }
  const courseId = String(formData.get('courseId') || '');
  const rawModules = String(formData.get('newModules') || '');

  if (!courseId || !rawModules) {
    return { ok: false, error: 'Faltan datos para agregar contenido.' };
  }

  try {
    const parsed = JSON.parse(rawModules);
    const modules = z.array(
      z.object({
        title: z.string().min(4),
        description: z.string().min(10),
        durationMinutes: z.coerce.number().min(10).max(300).optional()
      })
    ).min(1).max(8).parse(parsed);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { select: { id: true } } }
    });
    if (!course) {
      return { ok: false, error: 'Curso no encontrado.' };
    }
    const currentModulesCount = course.modules.length;
    if (currentModulesCount + modules.length > 20) {
      return { ok: false, error: 'No se pueden agregar más de 20 módulos.' };
    }

    await prisma.module.createMany({
      data: modules.map((moduleItem, index) => ({
        courseId,
        order: currentModulesCount + index + 1,
        title: moduleItem.title,
        description: moduleItem.description,
        durationMinutes: moduleItem.durationMinutes || null
      }))
    });

    revalidatePath('/admin');
    revalidatePath('/cursos');
    logAssistantEvent({ type: 'assistant.appendModules', courseId, added: modules.length });
    return { ok: true, message: 'Módulos agregados correctamente al curso seleccionado.' };
  } catch (error) {
    logAssistantEvent({ type: 'assistant.appendModules.error', courseId, message: String(error?.message || error) });
    return { ok: false, error: 'No se pudo agregar contenido.' };
  }
}

export async function updateEnrollmentAdmin(formData) {
  await requireAdmin();

  const rawValues = Object.fromEntries(formData.entries());
  const parsed = adminUpdateSchema.safeParse(rawValues);

  if (!parsed.success) {
    redirect(`/admin?error=${encodeURIComponent('No se pudo guardar el estado de la inscripción.')}`);
  }

  const updated = await prisma.enrollment.update({
    where: { id: parsed.data.enrollmentId },
    data: {
      status: parsed.data.status,
      paymentStatus: parsed.data.paymentStatus,
      attendancePercent: parsed.data.attendancePercent,
      progressPercent: parsed.data.status === 'COMPLETED' ? 100 : undefined,
      zoomConfirmed: parsed.data.zoomConfirmed === 'on',
      completedAt: parsed.data.status === 'COMPLETED' ? new Date() : null
    }
  });

  if (parsed.data.status === 'COMPLETED') {
    await ensureCertificate(updated.id);
  }

  revalidatePath('/admin');
  redirect('/admin');
}

export async function issueCertificateAction(formData) {
  await requireAdmin();

  const enrollmentId = String(formData.get('enrollmentId') || '');

  if (enrollmentId) {
    await ensureCertificate(enrollmentId);
    revalidatePath('/admin');
  }

  redirect('/admin');
}
