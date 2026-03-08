import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db';

function buildCode(prefix) {
  return `${prefix}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export function buildPublicUrl(pathname = '') {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return new URL(pathname, baseUrl).toString();
}

export function generateReferenceCode() {
  return buildCode('INT');
}

export function generateCertificateCode() {
  return buildCode('CERT');
}

export async function syncEnrollmentProgress(enrollmentId) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      progress: true,
      course: {
        include: {
          modules: true
        }
      },
      participant: true,
      certificate: true
    }
  });

  if (!enrollment) {
    return null;
  }

  const totalModules = enrollment.course.modules.length;
  const completedModules = enrollment.progress.filter((item) => item.completed).length;
  const progressPercent = totalModules ? Math.round((completedModules / totalModules) * 100) : 0;
  const nextStatus = progressPercent === 100 ? 'COMPLETED' : progressPercent > 0 ? 'IN_PROGRESS' : enrollment.status;

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent,
      status: nextStatus,
      completedAt: progressPercent === 100 ? enrollment.completedAt || new Date() : null
    },
    include: {
      participant: true,
      course: true,
      certificate: true
    }
  });

  if (progressPercent === 100) {
    await ensureCertificate(updatedEnrollment.id);
  }

  return updatedEnrollment;
}

export async function ensureCertificate(enrollmentId) {
  const existing = await prisma.certificate.findUnique({
    where: { enrollmentId },
    include: {
      enrollment: {
        include: {
          course: true,
          participant: true
        }
      }
    }
  });

  if (existing) {
    return existing;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      participant: true,
      course: true
    }
  });

  if (!enrollment) {
    return null;
  }

  let certificateCode = generateCertificateCode();

  while (await prisma.certificate.findUnique({ where: { certificateCode } })) {
    certificateCode = generateCertificateCode();
  }

  return prisma.certificate.create({
    data: {
      certificateCode,
      enrollmentId: enrollment.id,
      participantId: enrollment.participantId,
      verificationUrl: buildPublicUrl(`/certificados/${certificateCode}`)
    },
    include: {
      enrollment: {
        include: {
          participant: true,
          course: true
        }
      },
      participant: true
    }
  });
}
