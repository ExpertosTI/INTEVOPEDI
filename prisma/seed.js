const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courseData = {
  slug: 'ia-apoyo-discapacidad-visual',
  title: 'IA como Apoyo a la Discapacidad Visual',
  summary: 'Aprende a usar inteligencia artificial para crear materiales educativos accesibles para estudiantes con discapacidad visual.',
  description: 'Curso intensivo en vivo para docentes, familias, terapeutas y profesionales de apoyo que quieren transformar materiales educativos con ayuda de la inteligencia artificial y un enfoque inclusivo.',
  modality: 'Zoom',
  priceCents: 50000,
  priceLabel: 'RD$ 500',
  seats: 80,
  startDate: new Date('2026-03-14T14:00:00.000Z'),
  endDate: new Date('2026-03-14T18:00:00.000Z'),
  duration: '4 horas en vivo + materiales descargables',
  location: 'Zoom',
  instructor: 'Equipo INTEVOPEDI + ExpertosTI'
};

const modules = [
  {
    order: 1,
    title: 'Fundamentos de accesibilidad visual',
    description: 'Barreras frecuentes, diseño universal y ajustes razonables para materiales educativos.',
    durationMinutes: 35
  },
  {
    order: 2,
    title: 'IA aplicada al aula inclusiva',
    description: 'Casos de uso concretos para crear resúmenes, descripciones y apoyos pedagógicos accesibles.',
    durationMinutes: 40
  },
  {
    order: 3,
    title: 'Prompts para materiales accesibles',
    description: 'Cómo redactar instrucciones eficaces para generar contenido claro, estructurado y útil.',
    durationMinutes: 45
  },
  {
    order: 4,
    title: 'Conversión de documentos y evaluaciones',
    description: 'Adaptación de guías, tareas y exámenes a formatos más accesibles.',
    durationMinutes: 45
  },
  {
    order: 5,
    title: 'Herramientas y flujo de trabajo',
    description: 'Selección de herramientas, revisión humana y control de calidad de accesibilidad.',
    durationMinutes: 35
  },
  {
    order: 6,
    title: 'Proyecto final y cierre',
    description: 'Checklist de finalización, evidencias y preparación para emisión de certificado.',
    durationMinutes: 20
  }
];

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    update: courseData,
    create: courseData
  });

  for (const moduleData of modules) {
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
