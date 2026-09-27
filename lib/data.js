import { prisma } from '@/lib/db';
import { bootstrapAppData } from '@/lib/bootstrap';
import { courseModuleSeed, featuredCourseSeed, allCatalogCourses } from '@/lib/site';
import { isValidCertificateCode, normalizeCertificateCode, normalizeEmail, sanitizeText, normalizeLoginIdentifier } from '@/lib/validation';

function mapFallbackCourse() {
  const primary = allCatalogCourses[0];
  return {
    ...primary,
    startDate: new Date(primary.startDate),
    endDate: primary.endDate ? new Date(primary.endDate) : null,
    modules: primary.modules.map((m) => ({
      id: m.id || `module-${m.order}`,
      courseId: primary.id,
      required: true,
      ...m
    })),
    enrollments: [],
    resources: []
  };
}

export async function getPublishedCourses() {
  try {
    await bootstrapAppData();
    const dbCourses = await prisma.course.findMany({
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

    if (dbCourses && dbCourses.length > 0) {
      const existingSlugs = new Set(dbCourses.map(c => c.slug));
      const missing = allCatalogCourses.filter(c => !existingSlugs.has(c.slug));
      return [...missing, ...dbCourses];
    }
  } catch (error) {
    // Fallback directly to catalog
  }
  return allCatalogCourses;
}

export async function getFeaturedCourse() {
  const courses = await getPublishedCourses();
  const canto = courses.find((c) => c.slug === 'curso-de-canto');
  return canto || courses[0] || mapFallbackCourse();
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

    if (course) {
      return course;
    }
  } catch (error) {
    // Continue to catalog lookup
  }

  const catalogCourse = allCatalogCourses.find((c) => c.slug === slug);
  if (catalogCourse) {
    return {
      ...catalogCourse,
      startDate: new Date(catalogCourse.startDate),
      endDate: catalogCourse.endDate ? new Date(catalogCourse.endDate) : null,
      modules: catalogCourse.modules.map((moduleData) => ({
        id: moduleData.id || `module-${moduleData.order}`,
        courseId: catalogCourse.id,
        required: true,
        ...moduleData
      })),
      enrollments: catalogCourse.enrollments || [],
      resources: catalogCourse.resources || []
    };
  }

  const fallback = mapFallbackCourse();
  return fallback.slug === slug ? fallback : null;
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
