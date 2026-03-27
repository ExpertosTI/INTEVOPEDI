const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courses = [
  {
    slug: 'ia-accesibilidad-digital',
    title: 'IA y Accesibilidad Digital Aplicada',
    summary: 'Domina el uso de inteligencia artificial para la inclusión digital.',
    description: 'Capacitación técnica para integrar modelos de IA en la creación de contenidos accesibles, descripciones automáticas y adaptación curricular.',
    modality: 'Virtual (Zoom)',
    priceCents: 50000,
    priceLabel: 'RD$ 500',
    seats: 80,
    startDate: new Date('2026-04-15T14:00:00.000Z'),
    endDate: new Date('2026-04-15T18:00:00.000Z'),
    duration: '4 horas en vivo',
    location: 'Zoom Premium',
    instructor: 'Equipo Técnico INTEVOPEDI',
    status: 'PUBLISHED'
  },
  {
    slug: 'servicio-al-cliente-lectores',
    title: 'Soporte y Telemarketing con Lectores de Pantalla',
    summary: 'Herramientas de productividad para el empleo en Call Centers.',
    description: 'Aprende a gestionar CRMs, hojas de cálculo y herramientas de comunicación usando NVDA o JAWS para desempeñarte en áreas de servicio al cliente.',
    modality: 'Híbrido',
    priceCents: 120000,
    priceLabel: 'RD$ 1,200',
    seats: 30,
    startDate: new Date('2026-05-10T15:00:00.000Z'),
    endDate: new Date('2026-05-30T17:00:00.000Z'),
    duration: '20 horas intensivas',
    location: 'Laboratorio INTEVOPEDI / Zoom',
    instructor: 'ExpertosTI Formación',
    status: 'PUBLISHED'
  },
  {
    slug: 'qa-tester-accesibilidad',
    title: 'QA Tester: Especialista en Accesibilidad',
    summary: 'Conviértete en un probador de software enfocado en inclusión.',
    description: 'Curso profesional para auditar sitios web y aplicaciones bajo el estándar WCAG. Incluye uso de lectores de pantalla para pruebas de usuario.',
    modality: 'Virtual',
    priceCents: 150000,
    priceLabel: 'RD$ 1,500',
    seats: 40,
    startDate: new Date('2026-06-05T18:00:00.000Z'),
    endDate: new Date('2026-07-05T20:00:00.000Z'),
    duration: '40 horas (8 semanas)',
    location: 'Campus Virtual',
    instructor: 'Renace Tech Engineering',
    status: 'PUBLISHED'
  },
  {
    slug: 'ofimatica-profesional-ia',
    title: 'Ofimática Profesional con Apoyo de IA',
    summary: 'Productividad avanzada en Word, Excel y Outlook.',
    description: 'Optimiza tu flujo de trabajo profesional usando herramientas de oficina con atajos de teclado y el apoyo de copilotos de inteligencia artificial.',
    modality: 'Híbrido',
    priceCents: 75000,
    priceLabel: 'RD$ 750',
    seats: 50,
    startDate: new Date('2026-08-15T18:00:00.000Z'),
    endDate: new Date('2026-08-25T20:00:00.000Z'),
    duration: '12 horas',
    location: 'Sede INTEVOPEDI / Online',
    instructor: 'Formadores INTEVOPEDI',
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
