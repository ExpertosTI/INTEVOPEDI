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
    category: 'Tecnología',
    level: 'INTERMEDIATE',
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
    category: 'Empleabilidad',
    level: 'INTERMEDIATE',
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
    category: 'Tecnología',
    level: 'ADVANCED',
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
    category: 'Tecnología',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED'
  },
  {
    slug: 'ia-apoyo-discapacidad-visual',
    title: 'IA y Accesibilidad Digital Aplicada (Especializado)',
    summary: 'Herramientas avanzadas para discapacidad visual.',
    description: 'Enfoque práctico en GPT-4o, Claude y herramientas de visión artificial para la vida diaria y el estudio.',
    modality: 'Virtual',
    priceCents: 50000,
    priceLabel: 'RD$ 500',
    seats: 100,
    startDate: new Date('2026-04-20T14:00:00.000Z'),
    duration: '4 horas',
    location: 'Zoom',
    instructor: 'Equipo INTEVOPEDI',
    category: 'Inclusión',
    level: 'ADVANCED',
    status: 'PUBLISHED'
  },
  { slug: 'accesibilidad-digital-basica', title: 'Accesibilidad Digital Básica', summary: 'Cimientos del diseño inclusivo.', description: 'Principios WCAG y buenas prácticas.', modality: 'Virtual', priceCents: 0, priceLabel: 'Gratuito', startDate: new Date(), duration: '2 horas', location: 'Online', instructor: 'INTEVOPEDI', category: 'Inclusión', level: 'BEGINNER', status: 'PUBLISHED' },
  { slug: 'inclusion-laboral-tecnologica', title: 'Inclusión Laboral Tecnológica', summary: 'Prepárate para el mercado de tecnología.', description: 'Habilidades técnicas y blandas para el empleo.', modality: 'Presencial', priceCents: 0, priceLabel: 'Becado', startDate: new Date(), duration: '40 horas', location: 'Sede Central', instructor: 'ExpertosTI', category: 'Empleabilidad', level: 'BEGINNER', status: 'PUBLISHED' },
  { slug: 'accesibilidad-digital-avanzada', title: 'Accesibilidad Digital Avanzada', summary: 'Dominio técnico de WAI-ARIA y auditorías.', description: 'Para desarrolladores y diseñadores UX.', modality: 'Virtual', priceCents: 200000, priceLabel: 'RD$ 2,000', startDate: new Date(), duration: '20 horas', location: 'Campus', instructor: 'Renace Tech', category: 'Inclusión', level: 'ADVANCED', status: 'PUBLISHED' },
  { slug: 'tecnologias-asistencia-educacion', title: 'Tecnologías de Asistencia en Educación', summary: 'Recursos para docentes inclusivos.', description: 'Uso de JAWS, NVDA y hardware especializado.', modality: 'Híbrido', priceCents: 80000, priceLabel: 'RD$ 800', startDate: new Date(), duration: '15 horas', location: 'Sede', instructor: 'INTEVOPEDI', category: 'Inclusión', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'contenido-inclusivo-rrss', title: 'Creación de Contenido Inclusivo para RRSS', summary: 'Marketing digital para todos.', description: 'Alt Text, subtitulación y diseño accesible.', modality: 'Virtual', priceCents: 30000, priceLabel: 'RD$ 300', startDate: new Date(), duration: '3 horas', location: 'Zoom', instructor: 'INTEVOPEDI', category: 'Comunidad', level: 'BEGINNER', status: 'PUBLISHED' },
  { slug: 'alfabetizacion-digital-mayores', title: 'Alfabetización Digital para Adultos Mayores', summary: 'Tecnología sin barreras de edad.', description: 'Uso de smartphones y seguridad básica.', modality: 'Presencial', priceCents: 0, priceLabel: 'Gratuito', startDate: new Date(), duration: '10 horas', location: 'Comunidad', instructor: 'Voluntarios INTEVOPEDI', category: 'Comunidad', level: 'BEGINNER', status: 'PUBLISHED' },
  { slug: 'neurodiversidad-entorno-digital', title: 'Neurodiversidad en el Entorno Digital', summary: 'Diseñando para la variabilidad cognitiva.', description: 'Estrategias para TDAH, Autismo y más.', modality: 'Virtual', priceCents: 45000, priceLabel: 'RD$ 450', startDate: new Date(), duration: '4 horas', location: 'Zoom', instructor: 'Psicopedagogos INTEVOPEDI', category: 'Comunidad', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'braille-digital-productividad', title: 'Braille Digital y Productividad', summary: 'Dominio de líneas Braille y toma de notas.', description: 'Herramientas de hardware para la autonomía.', modality: 'Presencial', priceCents: 100000, priceLabel: 'RD$ 1,000', startDate: new Date(), duration: '12 horas', location: 'Sede', instructor: 'Técnicos Tiflo', category: 'Inclusión', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'empleabilidad-ia', title: 'Empleabilidad con Apoyo de IA', summary: 'Tu carrera impulsada por inteligencia artificial.', description: 'CV, portafolio y entrevistas asistidas.', modality: 'Híbrido', priceCents: 50000, priceLabel: 'RD$ 500', startDate: new Date(), duration: '6 horas', location: 'Campus', instructor: 'Orientadores Laborales', category: 'Empleabilidad', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'emprendimiento-inclusivo', title: 'Emprendimiento Inclusivo', summary: 'Crea tu propio negocio accesible.', description: 'Modelos de negocio, finanzas y ventas.', modality: 'Virtual', priceCents: 60000, priceLabel: 'RD$ 600', startDate: new Date(), duration: '20 horas', location: 'Online', instructor: 'Consultores PyME', category: 'Empleabilidad', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'soporte-tecnico-accesible', title: 'Soporte Técnico y Atención Inclusiva', summary: 'Excelencia en el servicio para todos.', description: 'Protocolos de atención para discapacidad.', modality: 'Virtual', priceCents: 40000, priceLabel: 'RD$ 400', startDate: new Date(), duration: '5 horas', location: 'Zoom', instructor: 'Expertos Servicio', category: 'Empleabilidad', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'diseno-universal-productos', title: 'Diseño Universal de Productos', summary: 'Crea para el 100% de la población.', description: 'Metodologías de diseño centrado en el humano.', modality: 'Híbrido', priceCents: 120000, priceLabel: 'RD$ 1,200', startDate: new Date(), duration: '15 horas', location: 'Sede', instructor: 'Product Designers', category: 'Tecnología', level: 'INTERMEDIATE', status: 'PUBLISHED' },
  { slug: 'productividad-ofimatica-accesible', title: 'Productividad y Ofimática Accesible', summary: 'Office y Google Workspace sin barreras.', description: 'Dominio de herramientas de oficina.', modality: 'Virtual', priceCents: 70000, priceLabel: 'RD$ 700', startDate: new Date(), duration: '10 horas', location: 'Campus', instructor: 'INTEVOPEDI', category: 'Tecnología', level: 'BEGINNER', status: 'PUBLISHED' },
  { slug: 'seguridad-digital-basica', title: 'Seguridad Digital Básica', summary: 'Protege tu identidad y tus datos.', description: 'Prevención de fraudes y privacidad.', modality: 'Virtual', priceCents: 0, priceLabel: 'Becado', startDate: new Date(), duration: '3 horas', location: 'Online', instructor: 'Cybersecurity Team', category: 'Tecnología', level: 'BEGINNER', status: 'PUBLISHED' }
];

const modulesMap = {
  'ia-accesibilidad-digital': [
    { order: 1, title: 'IA y Discapacidad: Panorama Actual', description: 'Cómo la IA rompe barreras.', durationMinutes: 45 },
    { order: 2, title: 'Visión Artificial en la Práctica', description: 'Uso de GPT-4o para descripciones.', durationMinutes: 45 },
    { order: 3, title: 'Adaptación Curricular Asistida', description: 'Materiales accesibles con Claude.', durationMinutes: 60 },
    { order: 4, title: 'Ética y Futuro Inclusivo', description: 'Sesgos en IA y su mitigación.', durationMinutes: 30 }
  ],
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
    { order: 3, title: 'Herramientas de validación', description: 'Lectores de pantalla y validadores automáticos.', durationMinutes: 120 }
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
  ],
  'servicio-al-cliente-lectores': [
     { order: 1, title: 'Lectura veloz con JAWS/NVDA', description: 'Técnicas de escaneo auditivo para velocidad.', durationMinutes: 120 },
     { order: 2, title: 'Manejo de CRM Accesible', description: 'Navegación por formularios y registros.', durationMinutes: 180 },
     { order: 3, title: 'Telemarketing e Inclusión', description: 'Guiones y resolución de objeciones.', durationMinutes: 120 }
  ],
  'qa-tester-accesibilidad': [
    { order: 1, title: 'Fundamentos de QA', description: 'Ciclo de vida del bug y reporte.', durationMinutes: 120 },
    { order: 2, title: 'Auditoría WCAG', description: 'Uso de checklists de conformidad.', durationMinutes: 240 },
    { order: 3, title: 'Pruebas Automatizadas', description: 'Axe, Lighthouse y Wave.', durationMinutes: 120 }
  ]
};

function generateModuleExtras(courseTitle, moduleTitle) {
  const content = `
# ${moduleTitle}
En este módulo de **${courseTitle}**, aprenderás conceptos fundamentales y prácticos para dominar esta área. 

### Objetivos de aprendizaje
- Comprender el impacto de las herramientas digitales en la inclusión.
- Aplicar flujos de trabajo eficientes y accesibles.
- Validar resultados con criterios de calidad profesional.

### Lección Interactiva
La accesibilidad no es solo una característica, es un derecho fundamental que garantiza que todos, independientemente de sus capacidades, puedan participar plenamente en la sociedad digital. 

Al usar herramientas como lectores de pantalla o inteligencia artificial, estamos habilitando nuevas formas de independencia y productividad profesional. Recuerda siempre que el diseño simple suele ser el más accesible.

### Consejos prácticos
1. **Atajos de teclado**: Son tus mejores aliados para la velocidad.
2. **Semántica**: Usa encabezados y etiquetas correctas.
3. **Contraste**: La claridad visual beneficia a todos los usuarios.

---
*Completa la lección y realiza la evaluación a continuación para registrar tu progreso.*
  `.trim();

  const quizData = [
    {
      question: "¿Cuál es el enfoque principal de este módulo?",
      options: [
        "Aumentar costos operativos",
        "Mejorar la inclusión y productividad",
        "Ignorar los estándares WCAG",
        "Diseño exclusivamente visual"
      ],
      answerIndex: 1
    },
    {
      question: "¿Qué herramienta es fundamental para la navegación accesible mencionada?",
      options: [
        "Solo el ratón (mouse)",
        "Atajos de teclado",
        "Pantallas sin contraste",
        "Imágenes sin descripción"
      ],
      answerIndex: 1
    },
    {
      question: "¿La accesibilidad digital es un beneficio exclusivo para personas con discapacidad?",
      options: [
        "Sí, solo para ellos",
        "No, beneficia a todos (diseño universal)",
        "Es opcional en entornos profesionales",
        "Solo es para sitios gubernamentales"
      ],
      answerIndex: 1
    }
  ];

  return { content, quizData };
}

async function main() {
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseData,
      create: courseData
    });

    const modules = modulesMap[course.slug] || [];
    for (const moduleData of modules) {
      const { content, quizData } = generateModuleExtras(course.title, moduleData.title);
      
      await prisma.module.upsert({
        where: {
          courseId_order: {
            courseId: course.id,
            order: moduleData.order
          }
        },
        update: { ...moduleData, content, quizData },
        create: {
          ...moduleData,
          content,
          quizData,
          courseId: course.id
        }
      });
    }
  }
  console.log('✅ Base de datos actualizada con 15 cursos, lecciones y quices.');
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

