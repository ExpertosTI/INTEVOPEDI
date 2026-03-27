'use server';

import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
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
import { isValidPhone, normalizeEmail, normalizePhone, sanitizeText, normalizeLoginIdentifier, detectIdentifierType } from '@/lib/validation';
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

const participantRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(120).optional()
});

const participantVerifySchema = z.object({
  email: z.string().email(),
  token: z.string().min(10)
});

const participantPasswordLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const studentIdentifierLoginSchema = z.object({
  identifier: z.string().min(8),
  password: z.string().min(8).max(128)
});

const studentFirstTimeSchema = z.object({
  identifier: z.string().min(8),
  password: z.string().min(8).max(128)
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
  resources: z.array(
    z.object({
      title: z.string().min(3),
      description: z.string().optional(),
      url: z.string().url()
    })
  ).max(12).optional(),
  modules: z.array(
    z.object({
      title: z.string().min(4),
      description: z.string().min(10),
      durationMinutes: z.coerce.number().min(10).max(300).optional()
    })
  ).min(1).max(12)
});

const adminCourseResourceLinkSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().max(400).optional(),
  resourceUrl: z.string().url().max(1000)
});

const adminCourseResourceFileSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().max(400).optional()
});

const manualCourseSchema = z.object({
  title: z.string().min(5).max(200),
  summary: z.string().min(10).max(500),
  description: z.string().min(20).max(2000),
  modality: z.string().min(2).max(60),
  priceCents: z.coerce.number().min(0),
  priceLabel: z.string().min(1).max(60),
  seats: z.coerce.number().min(0).optional(),
  startDate: z.string().min(8),
  endDate: z.string().min(8).optional(),
  duration: z.string().min(2).max(120),
  location: z.string().min(2).max(200),
  instructor: z.string().min(2).max(120),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional()
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

export async function registerParticipantAccount(formData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = participantRegisterSchema.safeParse({
    email: normalizeEmail(raw.email),
    password: String(raw.password || ''),
    fullName: sanitizeText(raw.fullName || '')
  });

  if (!parsed.success) {
    return { error: 'Completa un correo válido y una contraseña de al menos 8 caracteres.' };
  }

  const existing = await prisma.participant.findUnique({ where: { email: parsed.data.email } });
  const now = Date.now();
  const token = generateToken(24);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(now + PARTICIPANT_VERIFICATION_TTL_MS);
  const passwordHash = await hashParticipantPassword(parsed.data.password);

  await prisma.participant.upsert({
    where: { email: parsed.data.email },
    update: {
      fullName: parsed.data.fullName || existing?.fullName || parsed.data.email,
      passwordHash,
      emailVerified: false,
      verificationToken: tokenHash,
      verificationExpiresAt: expiresAt
    },
    create: {
      fullName: parsed.data.fullName || parsed.data.email,
      email: parsed.data.email,
      phone: '',
      passwordHash,
      emailVerified: false,
      verificationToken: tokenHash,
      verificationExpiresAt: expiresAt
    }
  });

  await sendParticipantVerificationEmail(parsed.data.email, token);
  return { success: true, email: parsed.data.email };
}

export async function resendParticipantVerification(formData) {
  const email = normalizeEmail(formData.get('email'));
  if (!email) return { error: 'Introduce un correo válido.' };

  const participant = await prisma.participant.findUnique({ where: { email } });
  if (!participant) return { error: 'No encontramos una cuenta con ese correo.' };
  if (participant.emailVerified) return { error: 'Esta cuenta ya está verificada.' };

  const token = generateToken(24);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + PARTICIPANT_VERIFICATION_TTL_MS);

  await prisma.participant.update({
    where: { email },
    data: { verificationToken: tokenHash, verificationExpiresAt: expiresAt }
  });

  await sendParticipantVerificationEmail(email, token);
  return { success: true };
}

export async function verifyParticipantAccount(searchParams) {
  const parsed = participantVerifySchema.safeParse({
    email: normalizeEmail(searchParams?.email),
    token: String(searchParams?.token || '')
  });

  if (!parsed.success) {
    redirect('/participantes?error=' + encodeURIComponent('Enlace de verificación inválido.'));
  }

  const participant = await prisma.participant.findUnique({ where: { email: parsed.data.email } });
  if (!participant || !participant.verificationToken || !participant.verificationExpiresAt) {
    redirect('/participantes?error=' + encodeURIComponent('Enlace de verificación no válido.'));
  }

  if (participant.verificationExpiresAt.getTime() < Date.now()) {
    redirect('/participantes?error=' + encodeURIComponent('El enlace de verificación expiró. Solicita uno nuevo.'));
  }

  const hashed = hashToken(parsed.data.token);
  if (participant.verificationToken !== hashed) {
    redirect('/participantes?error=' + encodeURIComponent('El enlace no coincide.'));
  }

  const updatedParticipant = await prisma.participant.update({
    where: { email: parsed.data.email },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpiresAt: null
    }
  });

  const referenceCode = await getLatestParticipantReferenceCode(participant.id);
  await createParticipantSession({ participantId: participant.id, referenceCode });
  const destination = getParticipantPostLoginRedirect(updatedParticipant);
  redirect(destination === '/campus' ? '/campus?verified=1' : `${destination}&verified=1`);
}

export async function studentIdentifierCheck(formData) {
  const identifier = String(formData.get('identifier') || '').trim();
  if (!identifier || identifier.length < 8) {
    return { error: 'Ingresa una cédula o teléfono válido (mínimo 8 dígitos).' };
  }

  const normalized = normalizeLoginIdentifier(identifier);
  
  // 1. Intentar buscar por loginIdentifier ya normalizado
  let participant = await prisma.participant.findUnique({
    where: { loginIdentifier: normalized }
  });

  // 2. Si no se encuentra, buscar por cédula o teléfono normalizados (Migración)
  if (!participant) {
    participant = await prisma.participant.findFirst({
      where: {
        OR: [
          { cedula: normalized },
          { phone: normalized },
          { email: identifier.toLowerCase() }
        ]
      }
    });

    // Si lo encontramos por otro medio, le asignamos el loginIdentifier para el futuro
    if (participant) {
      await prisma.participant.update({
        where: { id: participant.id },
        data: { loginIdentifier: normalized }
      });
    }
  }

  if (!participant) {
    return { status: 'not_found' };
  }

  if (participant.mustSetPassword || !participant.passwordHash) {
    return { status: 'first_time', participantName: participant.fullName };
  }

  return { status: 'login' };
}

export async function studentFirstTimeSetPassword(formData) {
  const identifier = String(formData.get('identifier') || '');
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' };
  }
  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  const normalized = normalizeLoginIdentifier(identifier);
  const participant = await prisma.participant.findUnique({
    where: { loginIdentifier: normalized }
  });

  if (!participant) {
    return { error: 'Participante no encontrado.' };
  }

  if (!participant.mustSetPassword) {
    return { error: 'Este usuario ya tiene una contraseña configurada.' };
  }

  const passwordHash = await hashParticipantPassword(password);
  
  await prisma.participant.update({
    where: { id: participant.id },
    data: {
      passwordHash,
      mustSetPassword: false,
      passwordSetAt: new Date(),
      emailVerified: true
    }
  });

  const referenceCode = await getLatestParticipantReferenceCode(participant.id);
  await createParticipantSession({ participantId: participant.id, referenceCode });
  redirect('/campus?profileUpdated=1');
}

export async function studentPasswordLogin(formData) {
  const parsed = studentIdentifierLoginSchema.safeParse({
    identifier: String(formData.get('identifier') || ''),
    password: String(formData.get('password') || '')
  });

  if (!parsed.success) {
    return { error: 'Revisa tu identificador y contraseña.' };
  }

  const normalized = normalizeLoginIdentifier(parsed.data.identifier);
  const participant = await prisma.participant.findUnique({
    where: { loginIdentifier: normalized }
  });

  if (!participant || !participant.passwordHash || participant.mustSetPassword) {
    return { error: 'No encontramos una cuenta validada con este dato.' };
  }

  const ok = await verifyParticipantPassword(parsed.data.password, participant.passwordHash);
  if (!ok) {
    return { error: 'Contraseña incorrecta.' };
  }

  const referenceCode = await getLatestParticipantReferenceCode(participant.id);
  await createParticipantSession({ participantId: participant.id, referenceCode });
  redirect(getParticipantPostLoginRedirect(participant));
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

function sanitizeFileName(rawValue) {
  return String(rawValue || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
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
  const raw = String(rawText || '');
  const cleaned = raw.replace(/```json/gi, '```').replace(/```/g, '').trim();
  if (!cleaned) {
    throw new Error('La respuesta llegó vacía.');
  }

  const directCandidates = [cleaned];
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    directCandidates.push(cleaned.slice(start, end + 1));
  }

  for (const candidate of directCandidates) {
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  for (let i = 0; i < cleaned.length; i += 1) {
    if (cleaned[i] !== '{') continue;

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let j = i; j < cleaned.length; j += 1) {
      const char = cleaned[j];
      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }
      if (char === '{') depth += 1;
      if (char === '}') depth -= 1;

      if (depth === 0) {
        const candidate = cleaned.slice(i, j + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          break;
        }
      }
    }
  }

  throw new Error('No se encontró un JSON válido en la respuesta.');
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
const ADMIN_RESET_EMAIL = process.env.ADMIN_RESET_EMAIL || process.env.ADMIN_EMAIL || 'expertostird@gmail.com';
const ADMIN_RESET_TTL_MS = 1000 * 60 * 20; // 20 minutos
const ADMIN_RESET_MAX_ATTEMPTS = 3;
const ADMIN_PASSWORD_HASH_KEY = 'admin_password_hash';
const ADMIN_RESET_TOKEN_KEY = 'admin_reset_token';
const PARTICIPANT_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 72; // 72 horas

const scryptAsync = promisify(scrypt);

function logAssistantEvent(event) {
  // Placeholder for structured logging; replace with real logger/DB audit
  console.info('[assistant]', JSON.stringify(event));
}

function generateToken(size = 32) {
  return randomBytes(size).toString('hex');
}

function hashToken(token) {
  return createHmac('sha256', getPasswordSecret()).update(token).digest('hex');
}

async function hashParticipantPassword(rawPassword) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(rawPassword, salt, 64);
  return `${salt}:${Buffer.from(derivedKey).toString('hex')}`;
}

async function verifyParticipantPassword(rawPassword, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const derivedKey = await scryptAsync(rawPassword, salt, 64);
  const candidate = Buffer.from(derivedKey).toString('hex');
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

async function sendParticipantVerificationEmail(email, token) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const link = `${baseUrl}/participantes/validar?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: email,
    subject: 'Verifica tu cuenta en INTEVOPEDI',
    html: `
      <h2>Confirma tu correo</h2>
      <p>Activa tu cuenta de participante haciendo clic en el enlace (expira en 72 horas):</p>
      <p><a href="${link}">${link}</a></p>
      <p>Si no solicitaste esta cuenta, ignora este mensaje.</p>
    `
  });
}

async function getLatestParticipantReferenceCode(participantId) {
  const enrollment = await prisma.enrollment.findFirst({
    where: { participantId },
    orderBy: { createdAt: 'desc' },
    select: { referenceCode: true }
  });
  return enrollment?.referenceCode || '';
}

function isParticipantSetupRequired(participant) {
  if (!participant) return true;
  const fullName = String(participant.fullName || '').trim();
  const phone = String(participant.phone || '').trim();
  return fullName.length < 3 || phone.length < 7 || !participant.passwordHash;
}

function getParticipantPostLoginRedirect(participant) {
  return isParticipantSetupRequired(participant) ? '/perfil?required=1' : '/campus';
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
  const password = String(formData.get('password') || '');
  const forceRequired = String(rawValues.required || '') === '1';
  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
    select: { id: true, passwordHash: true }
  });
  if (!participant) {
    redirect('/participantes?error=' + encodeURIComponent('Tu sesión ya no está disponible.'));
  }
  
  const data = {
    fullName: sanitizeText(rawValues.fullName || ''),
    phone: normalizePhone(rawValues.phone || ''),
    city: sanitizeText(rawValues.city || ''),
    organization: sanitizeText(rawValues.organization || ''),
    visualProfile: sanitizeText(rawValues.visualProfile || ''),
    notes: sanitizeText(rawValues.notes || '')
  };

  if (data.fullName.length < 3 || !isValidPhone(data.phone)) {
    redirect('/perfil?error=' + encodeURIComponent('Completa un nombre válido y un teléfono correcto.'));
  }

  const mustSetPassword = !participant.passwordHash || forceRequired;
  if (mustSetPassword && !password) {
    redirect('/perfil?required=1&error=' + encodeURIComponent('Debes crear una contraseña para entrar.'));
  }
  if (password && password.length < 8) {
    redirect('/perfil?required=1&error=' + encodeURIComponent('La contraseña debe tener al menos 8 caracteres.'));
  }

  const nextData = {
    ...data,
    ...(password ? { passwordHash: await hashParticipantPassword(password), emailVerified: true } : {})
  };

  await prisma.participant.update({
    where: { id: session.participantId },
    data: nextData
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

  redirect(getParticipantPostLoginRedirect(enrollment.participant));
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

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const models = Array.from(new Set([configuredModel, 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-flash', 'gemini-pro']));
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
    "resources": [{"title":"","description":"","url":"https://..."}],
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
    let data = null;
    let modelUsed = '';
    let lastApiError = '';
    for (const model of models) {
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
            maxOutputTokens: 3000
          }
        })
      });

      if (!response.ok) {
        let apiMessage = `HTTP ${response.status}`;
        try {
          const errorPayload = await response.json();
          apiMessage = String(errorPayload?.error?.message || apiMessage);
        } catch {
          try {
            const errorText = await response.text();
            if (errorText.trim()) apiMessage = errorText.trim().slice(0, 240);
          } catch {}
        }
        lastApiError = `Modelo ${model}: ${apiMessage}`;
        continue;
      }

      const payload = await response.json();
      const text = readGeminiTextResponse(payload);
      if (!text) {
        lastApiError = `Modelo ${model}: respuesta vacía del proveedor.`;
        continue;
      }

      try {
        data = extractJsonObject(text);
        modelUsed = model;
        break;
      } catch (parseError) {
        lastApiError = `Modelo ${model}: ${String(parseError?.message || 'JSON inválido en respuesta.')}`;
      }
    }

    if (!data) {
      const detail = lastApiError ? ` ${lastApiError}` : '';
      return { ok: false, error: `Gemini no respondió correctamente.${detail}` };
    }

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
      modelUsed,
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
        status: draft.status && draft.status !== 'DRAFT' ? draft.status : 'PUBLISHED'
      }
    });

    if (draft.resources?.length) {
      await prisma.courseResource.createMany({
        data: draft.resources.map((resource) => ({
          courseId: course.id,
          title: resource.title,
          description: resource.description || null,
          type: 'LINK',
          url: resource.url
        }))
      });
    }

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
    revalidatePath('/cursos');
    revalidatePath(`/cursos/${slug}`);
    revalidatePath('/campus');

    logAssistantEvent({ type: 'assistant.createCourse', courseId: course.id, title: draft.title });
    return { ok: true, message: `Curso creado correctamente con estado ${draft.status || 'PUBLISHED'}.` };
  } catch (error) {
    logAssistantEvent({ type: 'assistant.createCourse.error', message: String(error?.message || error) });
    return { ok: false, error: 'No se pudo crear el curso.' };
  }
}

export async function addCourseResourceAdminAction(formData) {
  await requireAdmin();

  const rawValues = Object.fromEntries(formData.entries());
  const linkInput = sanitizeText(rawValues.resourceUrl);
  const fileInput = formData.get('resourceFile');
  const hasFile = fileInput instanceof File && fileInput.size > 0;
  const hasLink = Boolean(linkInput);

  if (!hasFile && !hasLink) {
    redirect('/admin?error=' + encodeURIComponent('Debes adjuntar un archivo o indicar una URL del recurso.'));
  }

  if (hasLink) {
    const parsedLink = adminCourseResourceLinkSchema.safeParse({
      courseId: sanitizeText(rawValues.courseId),
      title: sanitizeText(rawValues.title),
      description: sanitizeText(rawValues.description),
      resourceUrl: linkInput
    });

    if (!parsedLink.success) {
      redirect('/admin?error=' + encodeURIComponent('Revisa el título y el enlace del recurso.'));
    }

    const course = await prisma.course.findUnique({ where: { id: parsedLink.data.courseId }, select: { id: true, slug: true } });
    if (!course) {
      redirect('/admin?error=' + encodeURIComponent('El curso indicado no existe.'));
    }

    await prisma.courseResource.create({
      data: {
        courseId: parsedLink.data.courseId,
        title: parsedLink.data.title,
        description: parsedLink.data.description || null,
        type: 'LINK',
        url: parsedLink.data.resourceUrl
      }
    });

    revalidatePath('/admin');
    revalidatePath(`/cursos/${course.slug}`);
    revalidatePath('/campus');
    redirect('/admin?saved=' + encodeURIComponent('Recurso enlazado correctamente.'));
  }

  const parsedFile = adminCourseResourceFileSchema.safeParse({
    courseId: sanitizeText(rawValues.courseId),
    title: sanitizeText(rawValues.title),
    description: sanitizeText(rawValues.description)
  });

  if (!parsedFile.success || !(fileInput instanceof File)) {
    redirect('/admin?error=' + encodeURIComponent('Revisa los datos del recurso y vuelve a intentarlo.'));
  }

  const course = await prisma.course.findUnique({ where: { id: parsedFile.data.courseId }, select: { id: true, slug: true } });
  if (!course) {
    redirect('/admin?error=' + encodeURIComponent('El curso indicado no existe.'));
  }

  const maxBytes = 25 * 1024 * 1024;
  if (fileInput.size > maxBytes) {
    redirect('/admin?error=' + encodeURIComponent('El archivo supera el límite de 25MB.'));
  }

  const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads', 'course-resources', course.id);
  await mkdir(uploadsDirectory, { recursive: true });

  const now = Date.now();
  const baseName = sanitizeFileName(fileInput.name) || `recurso-${now}`;
  const fileName = `${now}-${baseName}`;
  const targetPath = path.join(uploadsDirectory, fileName);
  const arrayBuffer = await fileInput.arrayBuffer();
  await writeFile(targetPath, Buffer.from(arrayBuffer));

  const publicPath = `/uploads/course-resources/${course.id}/${fileName}`;
  await prisma.courseResource.create({
    data: {
      courseId: course.id,
      title: parsedFile.data.title,
      description: parsedFile.data.description || null,
      type: 'FILE',
      filePath: publicPath,
      mimeType: fileInput.type || null,
      sizeBytes: fileInput.size || null
    }
  });

  revalidatePath('/admin');
  revalidatePath(`/cursos/${course.slug}`);
  revalidatePath('/campus');
  redirect('/admin?saved=' + encodeURIComponent('Archivo adjuntado correctamente.'));
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

export async function createCourseManualAction(formData) {
  await requireAdmin();
  const rawValues = Object.fromEntries(formData.entries());
  const parsed = manualCourseSchema.safeParse({
    title: sanitizeText(rawValues.title),
    summary: sanitizeText(rawValues.summary),
    description: sanitizeText(rawValues.description),
    modality: sanitizeText(rawValues.modality),
    priceCents: rawValues.priceCents,
    priceLabel: sanitizeText(rawValues.priceLabel),
    seats: rawValues.seats || undefined,
    startDate: rawValues.startDate,
    endDate: rawValues.endDate || undefined,
    duration: sanitizeText(rawValues.duration),
    location: sanitizeText(rawValues.location),
    instructor: sanitizeText(rawValues.instructor),
    status: rawValues.status || 'DRAFT'
  });

  if (!parsed.success) {
    redirect('/admin?error=' + encodeURIComponent('Completa todos los campos obligatorios del curso.'));
  }

  const baseSlug = normalizeSlug(parsed.data.title);
  const slug = await resolveUniqueCourseSlug(baseSlug);

  await prisma.course.create({
    data: {
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      description: parsed.data.description,
      modality: parsed.data.modality,
      priceCents: parsed.data.priceCents,
      priceLabel: parsed.data.priceLabel,
      seats: typeof parsed.data.seats === 'number' ? parsed.data.seats : null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : new Date(parsed.data.startDate),
      duration: parsed.data.duration,
      location: parsed.data.location,
      instructor: parsed.data.instructor,
      status: parsed.data.status || 'DRAFT'
    }
  });

  revalidatePath('/admin');
  revalidatePath('/cursos');
  redirect('/admin?saved=' + encodeURIComponent('Curso creado correctamente.'));
}

export async function updateCourseAction(formData) {
  await requireAdmin();
  const courseId = String(formData.get('courseId') || '');
  if (!courseId) redirect('/admin?error=' + encodeURIComponent('Curso no identificado.'));

  const rawValues = Object.fromEntries(formData.entries());
  const data = {};

  if (rawValues.title) data.title = sanitizeText(rawValues.title);
  if (rawValues.summary) data.summary = sanitizeText(rawValues.summary);
  if (rawValues.description) data.description = sanitizeText(rawValues.description);
  if (rawValues.modality) data.modality = sanitizeText(rawValues.modality);
  if (rawValues.priceCents !== undefined && rawValues.priceCents !== '') data.priceCents = Number(rawValues.priceCents);
  if (rawValues.priceLabel) data.priceLabel = sanitizeText(rawValues.priceLabel);
  if (rawValues.seats !== undefined && rawValues.seats !== '') data.seats = Number(rawValues.seats) || null;
  if (rawValues.startDate) data.startDate = new Date(rawValues.startDate);
  if (rawValues.endDate) data.endDate = new Date(rawValues.endDate);
  if (rawValues.duration) data.duration = sanitizeText(rawValues.duration);
  if (rawValues.location) data.location = sanitizeText(rawValues.location);
  if (rawValues.instructor) data.instructor = sanitizeText(rawValues.instructor);
  if (rawValues.status) data.status = rawValues.status;

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });
  if (!course) redirect('/admin?error=' + encodeURIComponent('Curso no encontrado.'));

  await prisma.course.update({ where: { id: courseId }, data });

  revalidatePath('/admin');
  revalidatePath('/cursos');
  revalidatePath(`/cursos/${course.slug}`);
  redirect('/admin?saved=' + encodeURIComponent('Curso actualizado correctamente.'));
}

export async function deleteCourseAction(formData) {
  await requireAdmin();
  const courseId = String(formData.get('courseId') || '');
  if (!courseId) redirect('/admin?error=' + encodeURIComponent('Curso no identificado.'));

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { enrollments: { select: { id: true } } }
  });

  if (!course) redirect('/admin?error=' + encodeURIComponent('Curso no encontrado.'));

  if (course.enrollments.length > 0) {
    redirect('/admin?error=' + encodeURIComponent(`No se puede eliminar: tiene ${course.enrollments.length} inscripción(es). Cambia el estado a CLOSED.`));
  }

  await prisma.course.delete({ where: { id: courseId } });

  revalidatePath('/admin');
  revalidatePath('/cursos');
  redirect('/admin?saved=' + encodeURIComponent('Curso eliminado correctamente.'));
}

export async function exportEnrollmentsCsv() {
  await requireAdmin();

  const enrollments = await prisma.enrollment.findMany({
    include: {
      participant: true,
      course: { select: { title: true } },
      certificate: { select: { certificateCode: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const header = 'Nombre,Correo,Curso,Estado,Pago,Progreso,Código,Certificado,Fecha';
  const rows = enrollments.map((e) => {
    return [
      `"${e.participant.fullName}"`,
      e.participant.email,
      `"${e.course.title}"`,
      e.status,
      e.paymentStatus,
      `${e.progressPercent}%`,
      e.referenceCode,
      e.certificate?.certificateCode || '',
      e.createdAt.toISOString().split('T')[0]
    ].join(',');
  });

  return { ok: true, csv: [header, ...rows].join('\n') };
}

export async function adminEnrollStudentAction(formData) {
  await requireAdmin();
  
  const rawIdentifier = String(formData.get('identifier') || '');
  const rawFullName = String(formData.get('fullName') || '');
  const courseId = String(formData.get('courseId') || '');
  const paymentStatus = String(formData.get('paymentStatus') || 'PENDING');
  
  if (!rawIdentifier || rawIdentifier.length < 8) {
    return { error: 'Identificador (cédula o teléfono) inválido.' };
  }
  
  if (!courseId) {
    return { error: 'Debe seleccionar un curso.' };
  }

  const normalizedIdentifier = normalizeLoginIdentifier(rawIdentifier);
  const type = detectIdentifierType(rawIdentifier);
  
  let participant = await prisma.participant.findUnique({
    where: { loginIdentifier: normalizedIdentifier }
  });
  
  if (!participant) {
    if (!rawFullName || rawFullName.length < 3) {
      return { error: 'El nombre completo es requerido para estudiantes nuevos.' };
    }
    
    const isCedula = type === 'cedula';
    participant = await prisma.participant.create({
      data: {
        loginIdentifier: normalizedIdentifier,
        cedula: isCedula ? normalizedIdentifier : null,
        phone: !isCedula ? normalizedIdentifier : '',
        fullName: sanitizeText(rawFullName),
        mustSetPassword: true
      }
    });
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_participantId: {
        courseId,
        participantId: participant.id
      }
    }
  });

  if (existingEnrollment) {
    return { error: 'El estudiante ya está inscrito en este curso.' };
  }

  let referenceCode = generateReferenceCode();
  while (await prisma.enrollment.findUnique({ where: { referenceCode } })) {
    referenceCode = generateReferenceCode();
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      referenceCode,
      courseId,
      participantId: participant.id,
      status: 'CONFIRMED',
      paymentStatus,
      enrolledByAdmin: true
    }
  });

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: true }
  });

  if (course && course.modules.length > 0) {
    await prisma.progress.createMany({
      data: course.modules.map((moduleData) => ({
        enrollmentId: enrollment.id,
        moduleId: moduleData.id
      })),
      skipDuplicates: true
    });
  }

  revalidatePath('/admin');
  return { success: true, message: `Estudiante ${participant.fullName} inscrito correctamente.` };
}
