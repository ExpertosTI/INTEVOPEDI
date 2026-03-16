'use server';

import { timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { bootstrapAppData } from '@/lib/bootstrap';
import { createAdminSession, destroyAdminSession, requireAdmin } from '@/lib/admin-auth';
import { createParticipantSession, destroyParticipantSession, getParticipantSession } from '@/lib/participant-auth';
import { ensureCertificate, generateReferenceCode, syncEnrollmentProgress } from '@/lib/certificates';
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
  const password = sanitizeText(formData.get('password'));
  const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD || '';

  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expectedPassword);

  if (!password || !expectedPassword || passwordBuffer.length !== expectedBuffer.length || !timingSafeEqual(passwordBuffer, expectedBuffer)) {
    redirect(`/admin/login?error=${encodeURIComponent('Credenciales inválidas.')}`);
  }

  await createAdminSession();
  redirect('/admin');
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect('/');
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
