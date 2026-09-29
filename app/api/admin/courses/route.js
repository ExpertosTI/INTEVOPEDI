import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { allCatalogCourses, cursoDeCantoData } from '@/lib/site';

export async function GET() {
  try {
    let dbCourses = [];
    try {
      dbCourses = await prisma.course.findMany({
        include: {
          modules: { orderBy: { order: 'asc' } },
          resources: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      // Prisma offline or unconfigured
    }

    if (dbCourses && dbCourses.length > 0) {
      const existingSlugs = new Set(dbCourses.map((c) => c.slug));
      const missing = allCatalogCourses.filter((c) => !existingSlugs.has(c.slug));
      return NextResponse.json([...missing, ...dbCourses]);
    }

    return NextResponse.json(allCatalogCourses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, courseData } = body;

    if (action === 'SAVE_COURSE') {
      const {
        id,
        slug,
        title,
        summary,
        description,
        modality,
        duration,
        instructor,
        instructorTitle,
        instructorPhoto,
        instructorBio,
        category,
        videoId,
        thumbnail,
        certificateTitle,
        certificateHours,
        priceLabel,
        modules,
        resources
      } = courseData;

      // Update in-memory catalog
      const existingIndex = allCatalogCourses.findIndex((c) => c.slug === slug || c.id === id);
      const updatedCourse = {
        id: id || slug,
        slug,
        title,
        summary,
        description,
        modality: modality || '100% Virtual a tu propio ritmo',
        priceCents: 0,
        priceLabel: priceLabel || 'Gratis',
        seats: 5000,
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-12-31T23:59:59.000Z'),
        duration: duration || '60 horas certificables',
        location: 'Campus Virtual INTEVOPEDI',
        instructor: instructor || 'Facilitador INTEVOPEDI',
        instructorTitle,
        instructorPhoto,
        instructorBio,
        category: category || 'Tecnología',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        rating: 4.9,
        reviewsCount: 180,
        studentsCount: '1.450',
        videoId: videoId || null,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        certificateTitle: certificateTitle || `Certificación en ${title}`,
        certificateHours: certificateHours || duration,
        modules: modules || [],
        resources: resources || []
      };

      if (existingIndex >= 0) {
        allCatalogCourses[existingIndex] = updatedCourse;
      } else {
        allCatalogCourses.unshift(updatedCourse);
      }

      // Try updating Prisma if DB is available
      try {
        await prisma.course.upsert({
          where: { slug },
          update: {
            title,
            summary,
            description,
            modality: updatedCourse.modality,
            duration: updatedCourse.duration,
            instructor: updatedCourse.instructor,
            category: updatedCourse.category
          },
          create: {
            slug,
            title,
            summary,
            description,
            modality: updatedCourse.modality,
            priceCents: 0,
            priceLabel: 'Gratis',
            startDate: new Date(),
            duration: updatedCourse.duration,
            location: 'Campus Virtual',
            instructor: updatedCourse.instructor,
            category: updatedCourse.category
          }
        });
      } catch (err) {
        // DB update optional if running serverless/dev
      }

      return NextResponse.json({ success: true, course: updatedCourse });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
