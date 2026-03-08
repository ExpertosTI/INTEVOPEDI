import { prisma } from '@/lib/db';
import { courseModuleSeed, featuredCourseSeed } from '@/lib/site';

let bootstrapPromise;

export async function bootstrapAppData() {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const course = await prisma.course.upsert({
      where: { slug: featuredCourseSeed.slug },
      update: {
        ...featuredCourseSeed,
        startDate: new Date(featuredCourseSeed.startDate),
        endDate: new Date(featuredCourseSeed.endDate)
      },
      create: {
        ...featuredCourseSeed,
        startDate: new Date(featuredCourseSeed.startDate),
        endDate: new Date(featuredCourseSeed.endDate)
      }
    });

    for (const moduleData of courseModuleSeed) {
      await prisma.module.upsert({
        where: {
          courseId_order: {
            courseId: course.id,
            order: moduleData.order
          }
        },
        update: moduleData,
        create: {
          ...moduleData,
          courseId: course.id
        }
      });
    }

    return course;
  })().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
}
