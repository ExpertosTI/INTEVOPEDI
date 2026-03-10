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
  },
  {
    slug: 'accesibilidad-digital-avanzada',
    title: 'Accesibilidad Digital Avanzada (WCAG 2.2)',
    summary: 'Domina los criterios de conformidad nivel AA y AAA para desarrollo web accesible.',
    description: 'Curso técnico para desarrolladores frontend y diseñadores UI/UX que buscan implementar accesibilidad robusta, pruebas con lectores de pantalla y cumplimiento legal.',
    modality: 'Híbrido',
    priceCents: 75000,
    priceLabel: 'RD$ 750',
    seats: 40,
    startDate: new Date('2026-06-15T18:00:00.000Z'),
    endDate: new Date('2026-06-25T20:00:00.000Z'),
    duration: '20 horas (5 sesiones)',
    location: 'Zoom + Campus Virtual',
    instructor: 'ExpertosTI Accesibilidad',
    status: 'PUBLISHED'
  },
  {
    slug: 'tecnologias-asistencia-educacion',
    title: 'Tecnologías de Asistencia para la Educación',
    summary: 'Uso práctico de lectores de pantalla, magnificadores y hardware adaptado en el aula.',
    description: 'Capacitación esencial para docentes que reciben estudiantes con discapacidad visual. Aprende a configurar y utilizar NVDA, JAWS, lupas electrónicas y líneas Braille.',
    modality: 'Presencial',
    priceCents: 150000,
    priceLabel: 'RD$ 1,500',
    seats: 25,
    startDate: new Date('2026-07-10T09:00:00.000Z'),
    endDate: new Date('2026-07-12T16:00:00.000Z'),
    duration: '3 días intensivos',
    location: 'Laboratorio INTEVOPEDI',
    instructor: 'Equipo Técnico INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'contenido-inclusivo-rrss',
    title: 'Creación de Contenido Inclusivo',
    summary: 'Estrategias para redes sociales accesibles: texto alternativo, subtitulado y contraste.',
    description: 'Taller para community managers y creadores de contenido. Aprende a hacer tus posts accesibles para personas ciegas y sordas, ampliando tu alcance y cumplimiento ético.',
    modality: 'Zoom',
    priceCents: 30000,
    priceLabel: 'RD$ 300',
    seats: 150,
    startDate: new Date('2026-05-20T19:00:00.000Z'),
    endDate: new Date('2026-05-20T21:00:00.000Z'),
    duration: '2 horas',
    location: 'Zoom',
    instructor: 'Comunicación Inclusiva RD',
    status: 'PUBLISHED'
  },
  {
    slug: 'alfabetizacion-digital-mayores',
    title: 'Alfabetización Digital para Adultos Mayores',
    summary: 'Inclusión tecnológica básica para personas mayores con o sin discapacidad visual.',
    description: 'Curso paciente y paso a paso para perder el miedo a la tecnología. Uso de smartphones, WhatsApp, llamadas y seguridad básica en internet.',
    modality: 'Presencial',
    priceCents: 50000,
    priceLabel: 'RD$ 500',
    seats: 30,
    startDate: new Date('2026-08-05T10:00:00.000Z'),
    endDate: new Date('2026-08-26T12:00:00.000Z'),
    duration: '4 sábados consecutivos',
    location: 'Sede INTEVOPEDI',
    instructor: 'Voluntarios INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'neurodiversidad-entorno-digital',
    title: 'Neurodiversidad en el Entorno Digital',
    summary: 'Estrategias de inclusión laboral y educativa para perfiles neurodivergentes.',
    description: 'Taller práctico para líderes, docentes y equipos de RR.HH. enfocado en ajustes razonables, comunicación clara y diseño de procesos inclusivos.',
    modality: 'Zoom',
    priceCents: 60000,
    priceLabel: 'RD$ 600',
    seats: 60,
    startDate: new Date('2026-06-05T18:00:00.000Z'),
    endDate: new Date('2026-06-12T20:00:00.000Z'),
    duration: '8 horas (2 sesiones)',
    location: 'Zoom',
    instructor: 'Equipo Neuroinclusión RD',
    status: 'PUBLISHED'
  },
  {
    slug: 'braille-digital-productividad',
    title: 'Braille Digital y Productividad',
    summary: 'Uso de líneas Braille y atajos para estudio y trabajo remoto.',
    description: 'Curso diseñado para participantes con discapacidad visual que desean dominar la escritura Braille digital y herramientas de productividad.',
    modality: 'Híbrido',
    priceCents: 90000,
    priceLabel: 'RD$ 900',
    seats: 20,
    startDate: new Date('2026-09-10T14:00:00.000Z'),
    endDate: new Date('2026-09-24T16:00:00.000Z'),
    duration: '12 horas (3 sesiones)',
    location: 'Laboratorio INTEVOPEDI + Zoom',
    instructor: 'Centro Braille INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'empleabilidad-ia',
    title: 'Empleabilidad con IA',
    summary: 'Optimiza tu CV, portafolio y entrevistas con apoyo de IA.',
    description: 'Aprende a usar herramientas de IA para mejorar tu perfil profesional, preparar entrevistas y crear cartas de presentación inclusivas.',
    modality: 'Zoom',
    priceCents: 45000,
    priceLabel: 'RD$ 450',
    seats: 80,
    startDate: new Date('2026-07-22T18:00:00.000Z'),
    endDate: new Date('2026-07-29T20:00:00.000Z'),
    duration: '6 horas (2 sesiones)',
    location: 'Zoom',
    instructor: 'ExpertosTI Talento',
    status: 'PUBLISHED'
  },
  {
    slug: 'emprendimiento-inclusivo',
    title: 'Emprendimiento Inclusivo',
    summary: 'Plan de negocio, finanzas básicas y presencia digital accesible.',
    description: 'Programa para emprendedores con discapacidad visual que buscan estructurar su oferta y lanzar servicios accesibles.',
    modality: 'Presencial',
    priceCents: 0,
    priceLabel: 'Gratuito',
    seats: 35,
    startDate: new Date('2026-10-03T09:00:00.000Z'),
    endDate: new Date('2026-10-24T13:00:00.000Z'),
    duration: '4 sábados',
    location: 'Sede INTEVOPEDI',
    instructor: 'Mentores INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'soporte-tecnico-accesible',
    title: 'Soporte Técnico Accesible',
    summary: 'Buenas prácticas de atención para usuarios con discapacidad visual.',
    description: 'Capacitación para equipos de helpdesk y soporte, con protocolos, guiones y accesibilidad en canales digitales.',
    modality: 'Zoom',
    priceCents: 35000,
    priceLabel: 'RD$ 350',
    seats: 100,
    startDate: new Date('2026-08-18T18:00:00.000Z'),
    endDate: new Date('2026-08-18T21:00:00.000Z'),
    duration: '3 horas',
    location: 'Zoom',
    instructor: 'Renace Tech Soporte',
    status: 'PUBLISHED'
  },
  {
    slug: 'diseno-universal-productos',
    title: 'Diseño Universal de Productos',
    summary: 'Metodologías para crear productos inclusivos desde el inicio.',
    description: 'Curso para equipos de diseño y producto con enfoque en investigación inclusiva, prototipado accesible y validación.',
    modality: 'Zoom',
    priceCents: 65000,
    priceLabel: 'RD$ 650',
    seats: 50,
    startDate: new Date('2026-09-02T18:00:00.000Z'),
    endDate: new Date('2026-09-16T20:00:00.000Z'),
    duration: '8 horas (3 sesiones)',
    location: 'Zoom',
    instructor: 'Equipo UX Inclusivo',
    status: 'PUBLISHED'
  },
  {
    slug: 'productividad-ofimatica-accesible',
    title: 'Productividad Ofimática Accesible',
    summary: 'Word, Excel y presentaciones accesibles con lectores de pantalla.',
    description: 'Guías prácticas para crear documentos, hojas de cálculo y presentaciones accesibles, optimizadas para trabajo y estudio.',
    modality: 'Híbrido',
    priceCents: 55000,
    priceLabel: 'RD$ 550',
    seats: 40,
    startDate: new Date('2026-11-05T14:00:00.000Z'),
    endDate: new Date('2026-11-19T16:00:00.000Z'),
    duration: '9 horas (3 sesiones)',
    location: 'Zoom + Laboratorio',
    instructor: 'Equipo INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'seguridad-digital-basica',
    title: 'Seguridad Digital Básica',
    summary: 'Protege tu información con prácticas simples y efectivas.',
    description: 'Aprende a identificar estafas, gestionar contraseñas y usar autenticación en dos pasos con herramientas accesibles.',
    modality: 'Zoom',
    priceCents: 30000,
    priceLabel: 'RD$ 300',
    seats: 120,
    startDate: new Date('2026-06-28T17:00:00.000Z'),
    endDate: new Date('2026-06-28T19:00:00.000Z'),
    duration: '2 horas',
    location: 'Zoom',
    instructor: 'Equipo Seguridad Digital',
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
  ],
  'accesibilidad-digital-avanzada': [
    { order: 1, title: 'Estructura semántica avanzada', description: 'Landmarks, headings y navegación por teclado.', durationMinutes: 120 },
    { order: 2, title: 'WAI-ARIA a fondo', description: 'Roles, estados y propiedades dinámicas.', durationMinutes: 120 },
    { order: 3, title: 'Accesibilidad en formularios', description: 'Validación, etiquetas y manejo de errores.', durationMinutes: 120 },
    { order: 4, title: 'Pruebas con Screen Readers', description: 'NVDA y VoiceOver en la práctica.', durationMinutes: 120 },
    { order: 5, title: 'Auditoría y remediación', description: 'Cómo arreglar sitios existentes.', durationMinutes: 120 }
  ],
  'tecnologias-asistencia-educacion': [
    { order: 1, title: 'Introducción a Tiflotecnología', description: 'Panorama de herramientas disponibles.', durationMinutes: 60 },
    { order: 2, title: 'Lectores de pantalla en PC', description: 'Configuración y uso básico de NVDA.', durationMinutes: 180 },
    { order: 3, title: 'Dispositivos móviles accesibles', description: 'TalkBack y VoiceOver.', durationMinutes: 180 },
    { order: 4, title: 'Hardware especializado', description: 'Líneas Braille y magnificadores.', durationMinutes: 120 }
  ],
  'contenido-inclusivo-rrss': [
    { order: 1, title: 'Texto alternativo (Alt Text)', description: 'Cómo describir imágenes correctamente.', durationMinutes: 40 },
    { order: 2, title: 'Subtitulado y Transcripción', description: 'Herramientas automáticas y corrección.', durationMinutes: 40 },
    { order: 3, title: 'Emojis y Hashtags', description: 'Uso accesible (CamelCase y moderación).', durationMinutes: 40 }
  ],
  'alfabetizacion-digital-mayores': [
    { order: 1, title: 'Perdiendo el miedo', description: 'Encendido, apagado y conceptos básicos.', durationMinutes: 120 },
    { order: 2, title: 'El mundo táctil', description: 'Gestos, toques y navegación.', durationMinutes: 120 },
    { order: 3, title: 'Comunicación', description: 'WhatsApp, llamadas y videollamadas.', durationMinutes: 120 },
    { order: 4, title: 'Seguridad básica', description: 'Estafas comunes y cómo protegerse.', durationMinutes: 120 }
  ],
  'neurodiversidad-entorno-digital': [
    { order: 1, title: 'Panorama neurodiverso', description: 'Autismo, TDAH y variabilidad cognitiva.', durationMinutes: 90 },
    { order: 2, title: 'Comunicación clara', description: 'Lenguaje simple y acuerdos explícitos.', durationMinutes: 90 },
    { order: 3, title: 'Ajustes razonables', description: 'Herramientas, tiempos y entornos.', durationMinutes: 90 }
  ],
  'braille-digital-productividad': [
    { order: 1, title: 'Braille digital hoy', description: 'Dispositivos y configuración inicial.', durationMinutes: 90 },
    { order: 2, title: 'Escritura y navegación', description: 'Atajos y comandos en entornos comunes.', durationMinutes: 120 },
    { order: 3, title: 'Productividad avanzada', description: 'Notas, documentos y trabajo remoto.', durationMinutes: 120 }
  ],
  'empleabilidad-ia': [
    { order: 1, title: 'CV y perfil profesional', description: 'Optimización con IA responsable.', durationMinutes: 90 },
    { order: 2, title: 'Portafolio y proyectos', description: 'Evidencias accesibles y bien descritas.', durationMinutes: 90 },
    { order: 3, title: 'Entrevistas y simulación', description: 'Preguntas clave y práctica asistida.', durationMinutes: 90 }
  ],
  'emprendimiento-inclusivo': [
    { order: 1, title: 'Modelo de negocio', description: 'Propuesta de valor inclusiva.', durationMinutes: 120 },
    { order: 2, title: 'Finanzas básicas', description: 'Costos, precios y proyecciones.', durationMinutes: 120 },
    { order: 3, title: 'Presencia digital accesible', description: 'Redes, catálogos y WhatsApp Business.', durationMinutes: 120 },
    { order: 4, title: 'Ventas y alianzas', description: 'Estrategias para crecer con aliados.', durationMinutes: 120 }
  ],
  'soporte-tecnico-accesible': [
    { order: 1, title: 'Protocolos de atención', description: 'Guiones y estándares accesibles.', durationMinutes: 60 },
    { order: 2, title: 'Canales inclusivos', description: 'Teléfono, chat y correo accesibles.', durationMinutes: 60 },
    { order: 3, title: 'Resolución de incidencias', description: 'Casos reales y buenas prácticas.', durationMinutes: 60 }
  ],
  'diseno-universal-productos': [
    { order: 1, title: 'Principios de diseño universal', description: 'Base metodológica para equipos.', durationMinutes: 90 },
    { order: 2, title: 'Investigación inclusiva', description: 'Usuarios reales y pruebas moderadas.', durationMinutes: 90 },
    { order: 3, title: 'Prototipado accesible', description: 'Desde wireframes hasta pruebas.', durationMinutes: 90 }
  ],
  'productividad-ofimatica-accesible': [
    { order: 1, title: 'Documentos accesibles', description: 'Estilos, tablas y lectura fluida.', durationMinutes: 90 },
    { order: 2, title: 'Hojas de cálculo claras', description: 'Orden, fórmulas y navegación.', durationMinutes: 90 },
    { order: 3, title: 'Presentaciones inclusivas', description: 'Contraste, texto alternativo y guías.', durationMinutes: 90 }
  ],
  'seguridad-digital-basica': [
    { order: 1, title: 'Riesgos comunes', description: 'Phishing y señales de alerta.', durationMinutes: 60 },
    { order: 2, title: 'Contraseñas seguras', description: 'Gestores y autenticación en dos pasos.', durationMinutes: 60 },
    { order: 3, title: 'Privacidad y respaldo', description: 'Buenas prácticas para el día a día.', durationMinutes: 60 }
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
