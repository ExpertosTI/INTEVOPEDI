const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courses = [
  {
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
    instructor: 'Equipo INTEVOPEDI + ExpertosTI',
    status: 'PUBLISHED'
  },
  {
    slug: 'accesibilidad-digital-basica',
    title: 'Accesibilidad Digital Básica',
    summary: 'Principios fundamentales para crear contenido web accesible para todos.',
    description: 'Aprende los estándares WCAG, estructura semántica y mejores prácticas de accesibilidad digital desde cero.',
    modality: 'Zoom',
    priceCents: 45000,
    priceLabel: 'RD$ 450',
    seats: 100,
    startDate: new Date('2026-04-10T15:00:00.000Z'),
    endDate: new Date('2026-04-10T17:00:00.000Z'),
    duration: '2 horas en vivo',
    location: 'Zoom',
    instructor: 'Equipo INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'inclusion-laboral-tecnologica',
    title: 'Inclusión Laboral Tecnológica',
    summary: 'Herramientas y estrategias para la inserción laboral en el sector IT.',
    description: 'Taller práctico sobre herramientas colaborativas, perfiles profesionales y búsqueda de empleo inclusiva.',
    modality: 'Presencial',
    priceCents: 0,
    priceLabel: 'Gratuito',
    seats: 50,
    startDate: new Date('2026-05-05T09:00:00.000Z'),
    endDate: new Date('2026-05-05T13:00:00.000Z'),
    duration: '4 horas presenciales',
    location: 'Sede INTEVOPEDI',
    instructor: 'Renace Tech + INTEVOPEDI',
    status: 'PUBLISHED'
  }
];

const modulesMap = {
  'ia-apoyo-discapacidad-visual': [
    { order: 1, title: 'Fundamentos de accesibilidad visual', description: 'Barreras frecuentes y diseño universal.', durationMinutes: 35 },
    { order: 2, title: 'IA aplicada al aula inclusiva', description: 'Casos prácticos de uso educativo.', durationMinutes: 40 },
    { order: 3, title: 'Prompts para materiales accesibles', description: 'Instrucciones eficaces para IA.', durationMinutes: 45 },
    { order: 4, title: 'Conversión de documentos', description: 'Adaptación de guías y tareas.', durationMinutes: 45 },
    { order: 5, title: 'Herramientas y flujo', description: 'Combinación de IA y revisión humana.', durationMinutes: 35 },
    { order: 6, title: 'Proyecto final', description: 'Checklist y activación de certificado.', durationMinutes: 20 }
  ],
  'accesibilidad-digital-basica': [
    { order: 1, title: '¿Qué es la accesibilidad?', description: 'Conceptos y marco legal.', durationMinutes: 30 },
    { order: 2, title: 'WCAG 2.2', description: 'Los 4 principios del diseño accesible.', durationMinutes: 60 },
    { order: 3, title: 'Herramientas de validación', description: 'Lectores de pantalla y validadores automáticos.', durationMinutes: 30 }
  ],
  'inclusion-laboral-tecnologica': [
    { order: 1, title: 'Perfil profesional IT', description: 'Habilidades blandas y técnicas.', durationMinutes: 60 },
    { order: 2, title: 'Herramientas colaborativas', description: 'Slack, Teams y Git para todos.', durationMinutes: 120 },
    { order: 3, title: 'Estrategias de búsqueda', description: 'LinkedIn y plataformas inclusivas.', durationMinutes: 60 }
  ]
};

async function main() {
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseData,
      create: courseData
    });

    const modules = modulesMap[course.slug] || [];
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
