const productionBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intevopedi.org';

export const siteConfig = {
  name: 'INTEVOPEDI Academy',
  fullName: 'Instituto Técnico Vocacional para Personas con Discapacidad',
  tagline: 'Aprende gratis con cursos certificados de alta calidad',
  description: 'Plataforma de formación inclusiva y accesible con cursos virtuales gratis, materiales de apoyo y certificación con validez internacional.',
  domain: productionBaseUrl,
  baseUrl: productionBaseUrl,
  contactEmail: 'info@intevopedi.org',
  contactPhone: '829-954-8373',
  contactPhoneHref: 'https://wa.me/18299548373?text=%2AHola%21%2A%20Me%20gustar%C3%ADa%20recibir%20asesor%C3%ADa%20sobre%20los%20cursos',
  address: 'Calle José Spight Rodríguez, No. 03, Ensanche El Portal, Santo Domingo, D.N.'
};

export const aboutUs = {
  title: 'Sobre nosotros',
  body: 'INTEVOPEDI Academy es una academia de formación técnica, tecnológica y vocacional inclusiva. Impulsamos el aprendizaje accesible para que cualquier persona pueda desarrollar habilidades reales, estudiar a su propio ritmo y obtener certificaciones verificables.'
};

export const mission = {
  title: 'Misión',
  body: 'Democratizar la educación técnica, tecnológica y laboral de alta calidad a través de entornos 100% accesibles, acompañando a los estudiantes hacia su autonomía e inserción productiva.',
  values: ['Compromiso', 'Inclusión', 'Excelencia académica', 'Innovación', 'Transparencia']
};

export const mainNavigation = [
  { href: '/cursos', label: 'Cursos gratis' },
  { href: '/#sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/verificar', label: 'Certificados' },
  { href: '/grupo-atrevete', label: 'Grupo Atrévete' }
];

export const iaAccesibilidadData = {
  id: 'ia-accesibilidad-digital',
  slug: 'ia-accesibilidad-digital',
  title: 'IA y Accesibilidad Digital Aplicada',
  summary: 'Domina el uso de herramientas de inteligencia artificial para la inclusión digital, adaptación de contenidos y tecnologías asistivas.',
  description: 'Capacitación técnica y práctica para integrar modelos de inteligencia artificial en la creación de contenidos accesibles, descripciones de imágenes, subtitulación automática y adaptación curricular inclusiva.',
  modality: '100% Virtual a tu propio ritmo',
  priceCents: 0,
  priceLabel: 'Gratis',
  seats: 3000,
  startDate: new Date('2026-01-01T00:00:00.000Z'),
  endDate: new Date('2026-12-31T23:59:59.000Z'),
  duration: '40 horas certificables',
  location: 'Campus Virtual INTEVOPEDI',
  instructor: 'Equipo Técnico INTEVOPEDI',
  instructorTitle: 'Especialistas en Accesibilidad & IA',
  instructorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  instructorBio: 'Especialistas multidisciplinarios en tecnologías asistivas, diseño universal e implementación de herramientas de inteligencia artificial aplicadas a la inclusión.',
  category: 'Tecnología',
  level: 'INTERMEDIATE',
  status: 'PUBLISHED',
  rating: 4.9,
  reviewsCount: 384,
  studentsCount: '2.450',
  videoId: null,
  thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  certificateTitle: 'Certificación en IA y Accesibilidad Digital',
  certificateHours: '40 horas certificables',
  modules: [
    {
      id: 'ia-mod-1',
      order: 1,
      title: 'Unidad 1. Ecosistema de IA y Tecnologías Asistivas',
      description: 'Panorama general de cómo los modelos de IA rompen barreras de accesibilidad y mejoran la interacción digital.',
      durationMinutes: 60,
      lessonsCount: 4,
      lessons: [
        { title: 'Introducción a la IA para la inclusión', type: 'video', duration: '12 min' },
        { title: 'Modelos multimodales y visión artificial', type: 'video', duration: '18 min' },
        { title: 'Lectores de pantalla y agentes inteligentes', type: 'reading', duration: '15 min' },
        { title: 'Evaluación de conceptos fundamentales', type: 'quiz', duration: '15 min' }
      ]
    },
    {
      id: 'ia-mod-2',
      order: 2,
      title: 'Unidad 2. Prompts para Adaptación Curricular y Contenidos',
      description: 'Ingeniería de prompts estructurados para transformar materiales complejos en formatos accesibles y de lectura fácil.',
      durationMinutes: 80,
      lessonsCount: 5,
      lessons: [
        { title: 'Estructuración de textos con lenguaje claro', type: 'video', duration: '15 min' },
        { title: 'Generación de descripciones alternativas (Alt Text)', type: 'video', duration: '20 min' },
        { title: 'Adaptación de guías y exámenes con IA', type: 'practice', duration: '25 min' },
        { title: 'Buenas prácticas y sesgos en modelos de lenguaje', type: 'reading', duration: '10 min' },
        { title: 'Taller práctico de adaptación', type: 'practice', duration: '10 min' }
      ]
    },
    {
      id: 'ia-mod-3',
      order: 3,
      title: 'Unidad 3. Visión Artificial y Descripción de Diagramas',
      description: 'Uso de modelos multimodales para describir mapas, infografías, ecuaciones y diagramas con precisión.',
      durationMinutes: 90,
      lessonsCount: 4,
      lessons: [
        { title: 'Cómo interpretar diagramas complejos con IA', type: 'video', duration: '20 min' },
        { title: 'Extracción de tablas y documentos inaccesibles', type: 'video', duration: '25 min' },
        { title: 'Revisión humana y control de calidad', type: 'reading', duration: '20 min' },
        { title: 'Proyecto práctico de descripción visual', type: 'practice', duration: '25 min' }
      ]
    },
    {
      id: 'ia-mod-4',
      order: 4,
      title: 'Unidad 4. Flujos de Trabajo Accesibles en el Día a Día',
      description: 'Integración en el flujo laboral y académico diario para potenciar la productividad y autonomía.',
      durationMinutes: 90,
      lessonsCount: 4,
      lessons: [
        { title: 'Automatización de resúmenes y notas de voz', type: 'video', duration: '18 min' },
        { title: 'Herramientas de síntesis de voz natural', type: 'video', duration: '22 min' },
        { title: 'Checklist de accesibilidad previa a publicación', type: 'reading', duration: '20 min' },
        { title: 'Evaluación final de certificación', type: 'quiz', duration: '30 min' }
      ]
    }
  ],
  enrollments: [],
  resources: []
};

// Aliases for compatibility
export const cursoDeCantoData = iaAccesibilidadData;

export const featuredCourseSeed = {
  slug: 'ia-accesibilidad-digital',
  title: 'IA y Accesibilidad Digital Aplicada',
  summary: 'Domina el uso de inteligencia artificial para la inclusión digital, adaptación de contenidos y tecnologías asistivas.',
  description: 'Capacitación práctica y técnica para integrar modelos de inteligencia artificial en la creación de contenidos accesibles, descripciones de imágenes y adaptación curricular inclusiva.',
  modality: '100% Virtual a tu ritmo',
  priceCents: 0,
  priceLabel: 'Gratis',
  seats: 3000,
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-12-31T23:59:59.000Z',
  duration: '40 horas certificables',
  location: 'Campus Virtual INTEVOPEDI',
  instructor: 'Equipo Técnico INTEVOPEDI',
  category: 'Tecnología',
  level: 'INTERMEDIATE',
  status: 'PUBLISHED'
};

export const courseModuleSeed = iaAccesibilidadData.modules.map(m => ({
  order: m.order,
  title: m.title,
  description: m.description,
  durationMinutes: m.durationMinutes
}));

export const allCatalogCourses = [
  iaAccesibilidadData,
  {
    id: 'servicio-al-cliente-lectores',
    slug: 'servicio-al-cliente-lectores',
    title: 'Soporte y Telemarketing con Lectores de Pantalla',
    summary: 'Herramientas de productividad y atención profesional en Contact Centers usando NVDA o JAWS.',
    description: 'Aprende a gestionar CRMs, hojas de cálculo, correo electrónico y sistemas de tickets telefónicos con lectores de pantalla para desempeñarte en puestos de atención al cliente y soporte.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 1500,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '45 horas certificables',
    location: 'Laboratorio INTEVOPEDI',
    instructor: 'ExpertosTI Formación',
    instructorTitle: 'Instructores en Tecnología Asistiva',
    instructorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Empleabilidad',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 189,
    studentsCount: '1.280',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Teleoperación Accesible',
    certificateHours: '45 horas certificables',
    modules: [
      { id: 's-1', order: 1, title: 'Unidad 1. Introducción al entorno de Contact Center', description: 'Flujos de llamada, protocolos y etiqueta profesional.', durationMinutes: 60, lessonsCount: 4 },
      { id: 's-2', order: 2, title: 'Unidad 2. Operación de CRMs con lectores de pantalla', description: 'Atajos de teclado, navegación en tablas y registro ágil.', durationMinutes: 90, lessonsCount: 6 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'qa-tester-accesibilidad',
    slug: 'qa-tester-accesibilidad',
    title: 'QA Tester: Especialista en Accesibilidad Web',
    summary: 'Audita sitios web y aplicaciones bajo el estándar internacional WCAG 2.2 nivel AA.',
    description: 'Curso profesional para auditar plataformas digitales bajo el estándar WCAG 2.2. Incluye pruebas automáticas y validación manual con lectores de pantalla y teclado.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 1200,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '60 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Renace Tech Engineering',
    instructorTitle: 'Consultoría en Auditoría WCAG',
    instructorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    category: 'Tecnología',
    level: 'ADVANCED',
    status: 'PUBLISHED',
    rating: 5.0,
    reviewsCount: 142,
    studentsCount: '980',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Especialista Certificado en Auditoría WCAG',
    certificateHours: '60 horas certificables',
    modules: [
      { id: 'qa-1', order: 1, title: 'Unidad 1. Principios fundamentales de WCAG 2.2', description: 'Perceptible, Operable, Comprensible y Robusto.', durationMinutes: 90, lessonsCount: 5 },
      { id: 'qa-2', order: 2, title: 'Unidad 2. Herramientas de auditoría automática', description: 'Uso de Axe, Lighthouse y WAVE.', durationMinutes: 100, lessonsCount: 6 },
      { id: 'qa-3', order: 3, title: 'Unidad 3. Auditoría manual con teclado y lectores', description: 'Navegación secuencial, trampas de foco y testing real.', durationMinutes: 120, lessonsCount: 6 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'ofimatica-profesional-ia',
    slug: 'ofimatica-profesional-ia',
    title: 'Ofimática Profesional Asistida por IA',
    summary: 'Potencia tu manejo de documentos, hojas de cálculo y presentaciones con asistentes de IA.',
    description: 'Automatiza reportes, análisis de datos en Excel y redacción de minutas profesionales utilizando inteligencia artificial integrada en tu suite de oficina.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 2000,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '50 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Formadores INTEVOPEDI',
    instructorTitle: 'Especialista en Productividad Digital',
    instructorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Empleabilidad',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 304,
    studentsCount: '1.920',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Ofimática e IA Productiva',
    certificateHours: '50 horas certificables',
    modules: [
      { id: 'of-1', order: 1, title: 'Unidad 1. Procesamiento de texto inteligente', description: 'Estructuración, estilos y redacción asistida.', durationMinutes: 70, lessonsCount: 4 },
      { id: 'of-2', order: 2, title: 'Unidad 2. Fórmulas y análisis de datos en hojas de cálculo', description: 'Fórmulas complejas asistidas y visualización.', durationMinutes: 90, lessonsCount: 5 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'braille-digital-productividad',
    slug: 'braille-digital-productividad',
    title: 'Braille Digital y Productividad',
    summary: 'Dominio de líneas Braille, toma de notas y herramientas de hardware para la autonomía.',
    description: 'Aprende a conectar y configurar pantallas y terminales Braille con smartphones y computadoras para el estudio, lectura veloz y trabajo remoto profesional.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 800,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '35 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Técnicos Tiflo INTEVOPEDI',
    instructorTitle: 'Especialistas en Tiflotecnología',
    instructorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    category: 'Inclusión',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 95,
    studentsCount: '620',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Braille Digital y Hardware Tiflo',
    certificateHours: '35 horas certificables',
    modules: [
      { id: 'br-1', order: 1, title: 'Unidad 1. Introducción al Braille efímero', description: 'Principios de funcionamiento de líneas Braille.', durationMinutes: 60, lessonsCount: 4 },
      { id: 'br-2', order: 2, title: 'Unidad 2. Conectividad y atajos de teclado', description: 'Comandos universales de navegación y lectura.', durationMinutes: 80, lessonsCount: 5 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'neurodiversidad-entorno-digital',
    slug: 'neurodiversidad-entorno-digital',
    title: 'Neurodiversidad en el Entorno Digital',
    summary: 'Diseñando y colaborando para la variabilidad cognitiva: TDAH, espectro autista y más.',
    description: 'Estrategias pedagógicas y laborales para adaptar entornos de trabajo, comunicación asíncrona y plataformas digitales para personas neurodivergentes.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 1500,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '30 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Psicopedagogos INTEVOPEDI',
    instructorTitle: 'Especialistas en Inclusión Cognitiva',
    instructorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Inclusión',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 160,
    studentsCount: '1.140',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Diseño y Entornos Neurodivergentes',
    certificateHours: '30 horas certificables',
    modules: [
      { id: 'nd-1', order: 1, title: 'Unidad 1. Panorama de la neurodiversidad', description: 'Conceptos, perfiles cognitivos y mitos.', durationMinutes: 60, lessonsCount: 4 },
      { id: 'nd-2', order: 2, title: 'Unidad 2. Ajustes razonables y herramientas', description: 'Herramientas de enfoque, organización y lectura limpia.', durationMinutes: 75, lessonsCount: 4 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'empleabilidad-ia',
    slug: 'empleabilidad-ia',
    title: 'Empleabilidad con Apoyo de IA',
    summary: 'Impulsa tu carrera: CV accesible, preparación de entrevistas y optimización de perfil laboral.',
    description: 'Aprende a redactar un currículum atractivo, simular entrevistas de trabajo asistidas por IA y destacar proyectos y portafolios en plataformas profesionales.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 2500,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '35 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Orientadores Laborales INTEVOPEDI',
    instructorTitle: 'Consultoría en Inserción Laboral',
    instructorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    category: 'Empleabilidad',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 220,
    studentsCount: '1.670',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Empleabilidad y Habilidades Digitales',
    certificateHours: '35 horas certificables',
    modules: [
      { id: 'emp-1', order: 1, title: 'Unidad 1. Construcción de perfil profesional', description: 'Redacción de CV de impacto con apoyo de IA.', durationMinutes: 60, lessonsCount: 4 },
      { id: 'emp-2', order: 2, title: 'Unidad 2. Simulación de entrevistas y networking', description: 'Práctica guiada para entrevistas presenciales y remotas.', durationMinutes: 70, lessonsCount: 4 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'emprendimiento-inclusivo',
    slug: 'emprendimiento-inclusivo',
    title: 'Emprendimiento Inclusivo',
    summary: 'Crea tu propio negocio accesible: propuesta de valor, finanzas básicas, ventas y alianzas.',
    description: 'Guía paso a paso para idear, validar y poner en marcha iniciativas de negocio accesibles y sostenibles con herramientas digitales de bajo costo.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 1800,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '40 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Consultores PyME INTEVOPEDI',
    instructorTitle: 'Asesores de Emprendimiento',
    instructorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Empleabilidad',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 175,
    studentsCount: '1.050',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Emprendimiento Inclusivo',
    certificateHours: '40 horas certificables',
    modules: [
      { id: 'empr-1', order: 1, title: 'Unidad 1. Modelo de negocio y propuesta de valor', description: 'Identificación de oportunidades y clientes.', durationMinutes: 70, lessonsCount: 4 },
      { id: 'empr-2', order: 2, title: 'Unidad 2. Canales digitales y ventas por WhatsApp', description: 'Catálogos, pagos y atención cercana.', durationMinutes: 80, lessonsCount: 5 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'accesibilidad-digital-basica',
    slug: 'accesibilidad-digital-basica',
    title: 'Accesibilidad Digital Básica',
    summary: 'Cimientos del diseño inclusivo: principios WCAG, contraste, navegación y semántica web.',
    description: 'Aprende los fundamentos para que cualquier persona pueda usar un sitio web, documento o aplicación sin barreras físicas, sensoriales o cognitivas.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 3500,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '25 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Equipo Técnico INTEVOPEDI',
    instructorTitle: 'Instructores de Accesibilidad Web',
    instructorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    category: 'Inclusión',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 290,
    studentsCount: '2.100',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Fundamentos de Accesibilidad Digital',
    certificateHours: '25 horas certificables',
    modules: [
      { id: 'acc-1', order: 1, title: 'Unidad 1. ¿Por qué importa la accesibilidad?', description: 'Conceptos clave, marco de derechos y diseño universal.', durationMinutes: 60, lessonsCount: 4 },
      { id: 'acc-2', order: 2, title: 'Unidad 2. Contraste, fuentes y estructura semántica', description: 'Buenas prácticas aplicadas de inmediato.', durationMinutes: 65, lessonsCount: 4 }
    ],
    enrollments: [],
    resources: []
  }
];

export const heroMetrics = [
  { label: 'Cursos gratis', value: '+15' },
  { label: 'Estudiantes', value: '+2.500' },
  { label: 'Valoración media', value: '4.9 ★' },
  { label: 'Certificación', value: 'Oficial' }
];

export const programHighlights = [
  {
    title: 'Aprende a tu propio ritmo',
    description: 'Contenido 100% online disponible las 24 horas del día desde cualquier dispositivo accesible.'
  },
  {
    title: 'Docentes especialistas',
    description: 'Clases estructuradas por expertos en accesibilidad digital, tiflotecnología e inserción laboral.'
  },
  {
    title: 'Certificado de estudios oficial',
    description: 'Evidencia tu conocimiento con un certificado digital con código QR de verificación pública.'
  },
  {
    title: 'Acceso gratuito y abierto',
    description: 'Inscríbete sin costo a todos los cursos de nuestra biblioteca académica inclusiva.'
  }
];

export const accessibilityFeatures = [
  'Navegación clara y alto contraste',
  'Contenido estructurado para lector de pantalla',
  'Panel de progreso simple y orientado a tareas',
  'Certificados verificables sin fricción',
  'Información clave visible desde móvil'
];

export const institutionalSections = [
  {
    title: 'Tecnología y accesibilidad',
    description: 'Domina herramientas de inteligencia artificial, desarrollo web inclusivo y auditorías de software WCAG.'
  },
  {
    title: 'Empleabilidad y productividad',
    description: 'Fortalece competencias para el trabajo moderno, atención al cliente y manejo ágil de oficinas digitales.'
  },
  {
    title: 'Inclusión y tecnologías asistivas',
    description: 'Aprende el manejo de lectores de pantalla, líneas Braille y adaptaciones para entornos educativos y laborales.'
  },
  {
    title: 'Certificación oficial verificable',
    description: 'Respalda tus conocimientos con certificados oficiales listos para compartir en tu CV y perfil de LinkedIn.'
  }
];

export const testimonials = [
  {
    quote: 'La formación en lectores de pantalla y CRM me dio las herramientas técnicas para ingresar a trabajar en atención al cliente. Una oportunidad invaluable.',
    author: 'Daniel Méndez',
    course: 'Soporte y Telemarketing con Lectores de Pantalla'
  },
  {
    quote: 'El curso de IA y Accesibilidad Digital me permitió adaptar todas mis clases para mis estudiantes con baja visión en tiempo récord.',
    author: 'Mariana Soto',
    course: 'IA y Accesibilidad Digital Aplicada'
  },
  {
    quote: 'Pude certificarme en auditoría WCAG y agregar la credencial verificable con QR a mi portafolio profesional.',
    author: 'Andrea Villalobos',
    course: 'QA Tester: Especialista en Accesibilidad Web'
  }
];

export const faqItems = [
  {
    question: '¿Puedo tomar los cursos de manera gratuita?',
    answer: 'Claro que sí, todos los cursos disponibles en INTEVOPEDI Academy son de acceso 100% gratis. Puedes ver las clases, lecturas y evaluaciones a tu propio ritmo.'
  },
  {
    question: '¿Qué incluyen los cursos?',
    answer: 'Los cursos incluyen videoclases en alta definición, lecturas didácticas, evaluaciones de comprobación, actividades prácticas y recursos complementarios descargables.'
  },
  {
    question: '¿Cómo obtengo el certificado de estudios?',
    answer: 'Al completar los módulos y evaluaciones del curso, podrás solicitar tu certificado oficial con código de verificación QR y validez internacional para tu currículum o perfil de LinkedIn.'
  },
  {
    question: '¿Los cursos tienen horarios fijos?',
    answer: 'No. Todos los cursos son 100% virtuales y asincrónicos. El contenido está disponible las 24 horas del día para que estudies en el horario que mejor te convenga.'
  }
];

export const roadmapImprovements = [
  'Landing institucional modernizada',
  'Diseño mobile-first',
  'Accesibilidad reforzada',
  'Catálogo de cursos',
  'Página de detalle por curso',
  'Registro de usuarios',
  'Inscripción persistente',
  'Panel del participante',
  'Panel administrativo'
];

export const grupoAtreveteProfile = {
  name: 'Grupo Atrévete',
  slug: 'grupo-atrevete',
  tagline: 'Proyecto musical inclusivo integrado por personas con discapacidad visual en República Dominicana.',
  summary: 'Mini portafolio oficial dentro de INTEVOPEDI para presentar su propuesta artística, presencia digital y vías de contacto.',
  description: 'Grupo Atrévete representa una expresión artística inclusiva con enfoque en talento, visibilidad, participación cultural y oportunidades para presentaciones en actividades institucionales, educativas y comunitarias.',
  location: 'República Dominicana',
  bookingPhone: '829-954-8373',
  bookingHref: 'https://wa.me/18299548373?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20Grupo%20Atr%C3%A9vete',
  heroImage: '/Logosolid.jpg',
  stats: [
    { label: 'Proyecto', value: 'Musical inclusivo' },
    { label: 'Base', value: 'República Dominicana' },
    { label: 'Canal validado', value: 'YouTube oficial' },
    { label: 'Contacto', value: '829-954-8373' }
  ]
};

export const grupoAtreveteLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/p/Grupo-Atr%C3%A9vete-100064654453284/',
    note: 'Página oficial en Facebook.'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/grupoatreveterd/',
    note: 'Perfil oficial en Instagram @grupoatreveterd.'
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@grupoatreveterd5840',
    note: 'Canal oficial en YouTube.'
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@grupoatreveterd',
    note: 'Videos y presentaciones en TikTok.'
  }
];

export const grupoAtreveteHighlights = [
  'Presentaciones con enfoque inclusivo y representación artística.',
  'Participación en actividades culturales, comunitarias e institucionales.',
  'Propuesta ideal para eventos de sensibilización, inclusión y celebración.',
  'Canales sociales unificados dentro del ecosistema digital del instituto.'
];

export const grupoAtreveteServices = [
  {
    title: 'Presentaciones en vivo',
    description: 'Participación en actos institucionales, ferias, encuentros culturales y eventos comunitarios.'
  },
  {
    title: 'Activaciones inclusivas',
    description: 'Acompañamiento artístico para jornadas de sensibilización sobre discapacidad e inclusión.'
  },
  {
    title: 'Portafolio digital',
    description: 'Presencia organizada con acceso directo a redes y canales de difusión del proyecto.'
  }
];

export const participantHubBenefits = [
  'Entrar con tu código de inscripción sin fricción.',
  'Consultar progreso, estado de pago y certificado en un solo lugar.',
  'Retomar rápidamente tus actividades y recursos del curso.',
  'Experiencia más cercana a una plataforma educativa moderna.'
];

export const participantCampusSections = [
  'Vista consolidada de todas tus inscripciones activas.',
  'Progreso por curso con accesos directos al panel detallado.',
  'Materiales y recursos recomendados por cada experiencia formativa.',
  'Seguimiento claro del estado de pago, asistencia y certificación.'
];

export const courseExperienceBySlug = {
  'ia-accesibilidad-digital': {
    lead: 'En este curso aprenderás a usar modelos de inteligencia artificial multimodal para generar descripciones automáticas, adaptar materiales educativos y diseñar experiencias 100% accesibles.',
    outcomes: [
      'Objetivo 1. Dominar los fundamentos de la IA multimodal aplicada a la inclusión.',
      'Objetivo 2. Crear prompts especializados para adaptación de materiales y lenguaje claro.',
      'Objetivo 3. Generar descripciones textuales precisas para gráficos, diagramas e imágenes.',
      'Objetivo 4. Implementar flujos de trabajo eficientes para instituciones educativas y empresas.'
    ],
    audience: [
      'Docentes y facilitadores que trabajan en aulas y programas inclusivos.',
      'Profesionales de tecnología y diseño web interesados en accesibilidad.',
      'Personas con discapacidad interesadas en potenciar su autonomía con herramientas de IA.',
      'Equipos de comunicación, recursos humanos y responsabilidad social.'
    ],
    materials: [
      {
        title: 'Guía rápida de prompts accesibles',
        format: 'PDF',
        description: 'Plantillas para solicitar adaptaciones y descripciones estructuradas a modelos de IA.'
      },
      {
        title: 'Checklist de accesibilidad digital',
        format: 'Checklist',
        description: 'Lista de verificación previa a la publicación de documentos e infografías.'
      },
      {
        title: 'Repositorio de herramientas recomendadas',
        format: 'Recursos',
        description: 'Directorio de sintetizadores de voz, OCRs y agentes multimodales.'
      }
    ],
    milestones: [
      'Unidad 1: Panorama de la IA y tecnologías asistivas.',
      'Unidad 2: Adaptación curricular y textos claros con prompts.',
      'Unidad 3: Visión artificial y descripción de diagramas.',
      'Unidad 4: Flujos de trabajo y proyecto final de certificación.'
    ],
    reviewsSummary: {
      score: 4.9,
      total: 384,
      distribution: [
        { stars: 5, pct: 92 },
        { stars: 4, pct: 7 },
        { stars: 3, pct: 1 },
        { stars: 2, pct: 0 },
        { stars: 1, pct: 0 }
      ]
    },
    reviews: [
      {
        name: 'Lic. Mariana Soto',
        time: 'hace 2 semanas',
        stars: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        comment: 'Excelente enfoque pedagógico. La integración de IA para describir imágenes y diagramas técnicos es revolucionaria para mis clases.'
      },
      {
        name: 'Carlos Alberto Santos',
        time: 'hace 3 semanas',
        stars: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        comment: 'Las explicaciones son claras, prácticas y totalmente orientadas a la inclusión real. Muy recomendado.'
      },
      {
        name: 'Claudia Rodríguez',
        time: 'hace 1 mes',
        stars: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
        comment: 'Pude aplicar los prompts inmediatamente en la preparación de evaluaciones accesibles en mi centro educativo.'
      }
    ],
    faqs: [
      {
        question: '¿Puedo tomar este curso de manera gratuita?',
        answer: 'Claro que sí, el acceso a todas las unidades didácticas y ejercicios prácticos es 100% gratis en INTEVOPEDI Academy.'
      },
      {
        question: '¿Qué herramientas de IA se enseñan?',
        answer: 'Modelos multimodales de lenguaje y visión artificial, herramientas de síntesis de voz y copilotos de productividad.'
      },
      {
        question: '¿Cómo obtengo el certificado?',
        answer: 'Al completar los módulos y la evaluación final, podrás activar tu certificado oficial con validación QR.'
      }
    ]
  },
  'servicio-al-cliente-lectores': {
    lead: 'Prepárate para desempeñarte como agente de atención al cliente y soporte telefónico utilizando lectores de pantalla NVDA y JAWS en entornos de Contact Center.',
    outcomes: [
      'Dominar atajos y flujos rápidos de navegación en CRMs con lector de pantalla.',
      'Gestionar llamadas, tipificaciones y notas simultáneas con agilidad auditiva.',
      'Aplicar protocolos de servicio y comunicación profesional efectiva.'
    ],
    audience: [
      'Personas con discapacidad visual interesadas en empleo en Contact Centers.',
      'Empresas y reclutadores que buscan capacitar agentes en herramientas inclusivas.'
    ],
    materials: [
      { title: 'Guía de atajos de teclado para CRMs', format: 'PDF', description: 'Referencia rápida para navegación ágil.' },
      { title: 'Guiones de llamadas y resolución de objeciones', format: 'Documento', description: 'Modelos de interacción profesional.' }
    ],
    milestones: [
      'Unidad 1: Entorno de Contact Center y etiqueta profesional.',
      'Unidad 2: Operación de CRM con teclado y lector de pantalla.'
    ],
    reviewsSummary: {
      score: 4.9,
      total: 189,
      distribution: [
        { stars: 5, pct: 90 },
        { stars: 4, pct: 9 },
        { stars: 3, pct: 1 },
        { stars: 2, pct: 0 },
        { stars: 1, pct: 0 }
      ]
    },
    reviews: [
      {
        name: 'Daniel Méndez',
        time: 'hace 3 semanas',
        stars: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        comment: 'Excelente entrenamiento. Me ayudó a ganar confianza en la navegación rápida con JAWS durante llamadas simuladas.'
      }
    ],
    faqs: [
      {
        question: '¿Qué lector de pantalla se utiliza?',
        answer: 'El curso cubre tanto NVDA (gratuito) como JAWS, enfocándose en comandos universales aplicables a cualquier software de Contact Center.'
      }
    ]
  }
};

export const courseResourceLibraryBySlug = {
  'ia-accesibilidad-digital': {
    title: 'Biblioteca de recursos del curso',
    summary: 'Colección de activos de aprendizaje y apoyo para usar la IA con enfoque accesible antes, durante y después del curso.',
    collections: [
      {
        title: 'Preparación y fundamentos',
        description: 'Materiales para comprender los criterios de accesibilidad y objetivos del curso.',
        items: [
          { title: 'Ruta de aprendizaje del participante', format: 'Guía' },
          { title: 'Checklist de accesibilidad digital', format: 'Checklist' }
        ]
      },
      {
        title: 'Plantillas y Prompts',
        description: 'Herramientas prácticas para adaptar contenidos y generar descripciones.',
        items: [
          { title: 'Banco de prompts para lenguaje claro', format: 'Plantilla' },
          { title: 'Modelo de adaptación curricular', format: 'Documento' }
        ]
      }
    ]
  }
};

export function getCourseResourceLibrary(courseSlug) {
  return courseResourceLibraryBySlug[courseSlug] || null;
}

export function getCourseResourceStats(courseSlug) {
  const library = getCourseResourceLibrary(courseSlug);

  if (!library) {
    return {
      collectionsCount: 0,
      itemsCount: 0
    };
  }

  return {
    collectionsCount: library.collections.length,
    itemsCount: library.collections.reduce((sum, collection) => sum + collection.items.length, 0)
  };
}

export const resourceCards = [
  {
    title: 'Acceso para participantes',
    description: 'Entrar al panel del curso con tu código de inscripción y revisar tu avance.',
    href: '/participantes',
    cta: 'Ir al acceso'
  },
  {
    title: 'Verificación de certificados',
    description: 'Validar certificados emitidos con código único y descarga en PDF.',
    href: '/verificar',
    cta: 'Verificar certificado'
  },
  {
    title: 'Portafolio Grupo Atrévete',
    description: 'Conoce la propuesta artística inclusiva integrada al ecosistema del instituto.',
    href: '/grupo-atrevete',
    cta: 'Abrir portafolio'
  },
  {
    title: 'Oferta de cursos',
    description: 'Consulta el catálogo de cursos accesibles y la información de inscripción.',
    href: '/cursos',
    cta: 'Ver cursos'
  }
];
