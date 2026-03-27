import { prisma } from '@/lib/db';
import { bootstrapAppData } from '@/lib/bootstrap';
import { courseModuleSeed, featuredCourseSeed } from '@/lib/site';
import { isValidCertificateCode, normalizeCertificateCode, normalizeEmail, sanitizeText, normalizeLoginIdentifier } from '@/lib/validation';

function mapFallbackCourse() {
  return {
    id: 'fallback-course',
    ...featuredCourseSeed,
    startDate: new Date(featuredCourseSeed.startDate),
    endDate: new Date(featuredCourseSeed.endDate),
    modules: courseModuleSeed.map((moduleData) => ({
      id: `module-${moduleData.order}`,
      courseId: 'fallback-course',
      required: true,
      ...moduleData
    })),
    enrollments: [],
    resources: []
  };
}

export async function getPublishedCourses() {
  try {
    await bootstrapAppData();
    return await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        },
        enrollments: true,
        resources: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { startDate: 'asc' }
    });
  } catch (error) {
    return [mapFallbackCourse()];
  }
}

export async function getFeaturedCourse() {
  const courses = await getPublishedCourses();
  return courses[0] || mapFallbackCourse();
}

export async function getCourseBySlug(slug) {
  try {
    await bootstrapAppData();
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        },
        enrollments: true,
        resources: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return course;
  } catch (error) {
    const fallback = mapFallbackCourse();
    return fallback.slug === slug ? fallback : null;
  }
}

export async function getEnrollmentByReference(referenceCode) {
  try {
    return await prisma.enrollment.findUnique({
      where: { referenceCode },
      include: {
        participant: true,
        course: {
          include: {
            modules: {
              orderBy: { order: 'asc' }
            },
            resources: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        progress: {
          include: {
            module: true
          },
          orderBy: {
            module: {
              order: 'asc'
            }
          }
        },
        certificate: true
      }
    });
  } catch (error) {
    return null;
  }
}

export async function getParticipantCampusData(participantId) {
  try {
    await bootstrapAppData();

    return await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  orderBy: { order: 'asc' }
                },
                resources: {
                  orderBy: { createdAt: 'desc' }
                }
              }
            },
            progress: {
              include: {
                module: true
              },
              orderBy: {
                module: {
                  order: 'asc'
                }
              }
            },
            certificate: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  } catch (error) {
    return null;
  }
}

export async function getEnrollmentForParticipantAndCourse(participantId, courseId) {
  try {
    return await prisma.enrollment.findFirst({
      where: {
        participantId,
        courseId
      },
      include: {
        course: true,
        certificate: true
      }
    });
  } catch (error) {
    return null;
  }
}

export async function getParticipantByIdentifier(identifier) {
  try {
    const normalized = normalizeLoginIdentifier(identifier);
    return await prisma.participant.findUnique({
      where: { loginIdentifier: normalized }
    });
  } catch (error) {
    return null;
  }
}

export async function getCertificateByCode(certificateCode) {
  const normalizedCode = normalizeCertificateCode(certificateCode);

  if (!isValidCertificateCode(normalizedCode)) {
    return null;
  }

  try {
    return await prisma.certificate.findUnique({
      where: { certificateCode: normalizedCode },
      include: {
        enrollment: {
          include: {
            course: true,
            participant: true
          }
        },
        participant: true
      }
    });
  } catch (error) {
    return null;
  }
}

export async function getAdminDashboardData() {
  try {
    await bootstrapAppData();

    const [courses, enrollments, certificates] = await Promise.all([
      prisma.course.findMany({
        include: {
          modules: true,
          enrollments: true,
          resources: {
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.enrollment.findMany({
        include: {
          course: true,
          participant: true,
          certificate: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.certificate.findMany({
        include: {
          enrollment: {
            include: {
              course: true
            }
          },
          participant: true
        },
        orderBy: { issuedAt: 'desc' }
      })
    ]);

    return {
      courses,
      enrollments,
      certificates
    };
  } catch (error) {
    return {
      courses: [],
      enrollments: [],
      certificates: []
    };
  }
}
