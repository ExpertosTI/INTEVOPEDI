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
  body: 'INTEVOPEDI Academy es una academia de formación técnica, artística y vocacional inclusiva. Impulsamos el aprendizaje accesible para que cualquier persona pueda desarrollar habilidades reales, estudiar a su propio ritmo y obtener certificaciones verificables.'
};

export const mission = {
  title: 'Misión',
  body: 'Democratizar la educación técnica, musical y tecnológica de alta calidad a través de entornos 100% accesibles, acompañando a los estudiantes hacia su desarrollo personal, artístico y laboral.',
  values: ['Compromiso', 'Inclusión', 'Excelencia académica', 'Innovación', 'Transparencia']
};

export const mainNavigation = [
  { href: '/cursos', label: 'Cursos gratis' },
  { href: '/#sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/verificar', label: 'Certificados' },
  { href: '/grupo-atrevete', label: 'Grupo Atrévete' }
];

export const cursoDeCantoData = {
  id: 'curso-de-canto',
  slug: 'curso-de-canto',
  title: 'Curso de canto',
  summary: 'Desarrolla habilidades vocales, respiración costo-diafragmática, afinación y preparación técnica de canciones sin depender de medios electrónicos.',
  description: 'Este curso de Canto está dirigido a personas que deseen iniciar o avanzar en su camino como cantante, desarrollarás habilidades para interpretar canciones sin depender de medios electrónicos, reconociendo tu voz como una extensión de ti mismo. Este curso de Canto incluye un proyecto práctico donde prepararás una canción de acuerdo a las etapas del canto.',
  modality: '100% Virtual a tu propio ritmo',
  priceCents: 0,
  priceLabel: 'Gratis',
  seats: 5000,
  startDate: new Date('2026-01-01T00:00:00.000Z'),
  endDate: new Date('2026-12-31T23:59:59.000Z'),
  duration: '80 horas certificables',
  location: 'Campus Virtual INTEVOPEDI',
  instructor: 'Jairo Sanabria',
  instructorTitle: 'Músico, Pianista y Compositor',
  instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
  instructorBio: 'Músico profesional, pianista y compositor con amplia experiencia en técnica vocal, formación coral y producción pedagógica. Ha capacitado a miles de cantantes en Latinoamérica y el mundo.',
  category: 'Arte',
  level: 'BEGINNER',
  status: 'PUBLISHED',
  rating: 4.9,
  reviewsCount: 563,
  studentsCount: '61.731',
  videoId: '6XM8rGAupSo',
  thumbnail: 'https://d3puay5pkxu9s4.cloudfront.net/courses/4472/img/web/800_imagen.jpg',
  certificateTitle: 'Diplomado en Canto y Técnica Vocal',
  certificateHours: '80 horas certificables',
  modules: [
    {
      id: 'canto-mod-1',
      order: 1,
      title: 'Unidad 1. Fundamentos del canto y teoría musical',
      description: 'Bases teóricas de la voz humana, nociones esenciales de técnica vocal y lectura de notación musical.',
      durationMinutes: 90,
      lessonsCount: 4,
      lessons: [
        { title: 'Introducción al curso de canto', type: 'video', duration: '12 min' },
        { title: 'Comprender la técnica vocal', type: 'video', duration: '18 min' },
        { title: 'Conceptos sobre técnica vocal', type: 'reading', duration: '15 min' },
        { title: 'Fundamentos de la notación musical', type: 'quiz', duration: '20 min' }
      ]
    },
    {
      id: 'canto-mod-2',
      order: 2,
      title: 'Unidad 2. Clasificación y sonoridad de la voz humana',
      description: 'Descubrimiento y reconocimiento del rango vocal, registros vocales, tesitura y selección de repertorio según tu tipo de voz.',
      durationMinutes: 140,
      lessonsCount: 8,
      lessons: [
        { title: 'Introducción a la unidad 2', type: 'video', duration: '10 min' },
        { title: 'El rango vocal', type: 'video', duration: '15 min' },
        { title: 'Reconociendo el rango vocal', type: 'practice', duration: '25 min' },
        { title: 'El registro vocal', type: 'video', duration: '16 min' },
        { title: 'Usar los registros vocales', type: 'video', duration: '20 min' },
        { title: 'La tesitura vocal', type: 'reading', duration: '14 min' },
        { title: 'Reconociendo la tesitura vocal', type: 'practice', duration: '20 min' },
        { title: 'Canciones para tu tipo de voz', type: 'video', duration: '20 min' }
      ]
    },
    {
      id: 'canto-mod-3',
      order: 3,
      title: 'Unidad 3. Preparación técnica de una canción',
      description: 'Desglose paso a paso de la estructura, interpretación, articulación y dinámica musical de una pieza.',
      durationMinutes: 95,
      lessonsCount: 3,
      lessons: [
        { title: 'Introducción a la unidad 3', type: 'video', duration: '12 min' },
        { title: 'Estructura de una canción', type: 'video', duration: '22 min' },
        { title: 'Preparación técnica de una canción', type: 'practice', duration: '35 min' }
      ]
    },
    {
      id: 'canto-mod-4',
      order: 4,
      title: 'Unidad 4. La respiración en el canto',
      description: 'Importancia de la postura física, respiración costo-diafragmática profunda y dosificación del aire.',
      durationMinutes: 110,
      lessonsCount: 4,
      lessons: [
        { title: 'Introducción a la unidad 4', type: 'video', duration: '10 min' },
        { title: 'La postura corporal en el canto', type: 'video', duration: '18 min' },
        { title: 'La respiración humana', type: 'reading', duration: '15 min' },
        { title: 'Respirando al cantar', type: 'practice', duration: '30 min' }
      ]
    },
    {
      id: 'canto-mod-5',
      order: 5,
      title: 'Unidad 5. La afinación',
      description: 'Desarrollo de la precisión auditiva, dominio de la escala mayor y afinación sin fatiga vocal.',
      durationMinutes: 85,
      lessonsCount: 3,
      lessons: [
        { title: 'Introducción a la unidad 5', type: 'video', duration: '10 min' },
        { title: 'Fundamentos de la afinación', type: 'video', duration: '20 min' },
        { title: 'Afinar mi voz', type: 'practice', duration: '30 min' }
      ]
    }
  ],
  enrollments: [],
  resources: []
};

export const featuredCourseSeed = {
  slug: 'curso-de-canto',
  title: 'Curso de canto',
  summary: 'Aprende técnica vocal, afinación, respiración y proyección de la voz a tu propio ritmo.',
  description: 'Este curso de Canto está dirigido a personas que deseen iniciar o avanzar en su camino como cantante, desarrollarás habilidades para interpretar canciones sin depender de medios electrónicos, reconociendo tu voz como una extensión de ti mismo. Incluye un proyecto práctico donde prepararás una canción de acuerdo a las etapas del canto.',
  modality: '100% Virtual a tu ritmo',
  priceCents: 0,
  priceLabel: 'Gratis',
  seats: 5000,
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-12-31T23:59:59.000Z',
  duration: '80 horas certificables',
  location: 'Campus Virtual Edutin Academy',
  instructor: 'Jairo Sanabria (Músico, Pianista y Compositor)',
  category: 'Arte',
  level: 'BEGINNER',
  status: 'PUBLISHED'
};

export const courseModuleSeed = cursoDeCantoData.modules.map(m => ({
  order: m.order,
  title: m.title,
  description: m.description,
  durationMinutes: m.durationMinutes
}));

export const allCatalogCourses = [
  cursoDeCantoData,
  {
    id: 'curso-de-bajo',
    slug: 'curso-de-bajo-1760',
    title: 'Curso de bajo',
    summary: 'Aprende a interpretar el bajo eléctrico, lectura de tablaturas, escalas y ritmos musicales.',
    description: 'Domina los fundamentos del bajo eléctrico, técnicas de digitación, ritmo, armonía aplicada y acompañamiento en diversos géneros musicales.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 3000,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '65 horas certificables',
    location: 'Campus Virtual',
    instructor: 'Edutin Academy Music School',
    instructorTitle: 'Especialista en Instrumentos de Cuerda',
    instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
    category: 'Arte',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 312,
    studentsCount: '10.2K',
    videoId: '6XM8rGAupSo',
    thumbnail: 'https://d3puay5pkxu9s4.cloudfront.net/curso/1760/card_imagen.jpg',
    certificateTitle: 'Certificación en Bajo Eléctrico Moderno',
    certificateHours: '65 horas certificables',
    modules: [
      { id: 'b-1', order: 1, title: 'Unidad 1. Introducción al bajo eléctrico y anatomía', description: 'Partes del bajo, afinación y postura ergonómica.', durationMinutes: 60, lessonsCount: 4 },
      { id: 'b-2', order: 2, title: 'Unidad 2. Técnica de digitación y escalas fundamentales', description: 'Escalas mayores, menores y técnica de dos dedos.', durationMinutes: 90, lessonsCount: 6 },
      { id: 'b-3', order: 3, title: 'Unidad 3. Creación de líneas de bajo y grooves', description: 'Acompañamiento rítmico sobre batería y armonía.', durationMinutes: 120, lessonsCount: 6 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'curso-de-musica',
    slug: 'curso-de-musica',
    title: 'Curso de música y teoría musical',
    summary: 'Aprende los principios del lenguaje musical, solfeo, entrenamiento rítmico y armonía.',
    description: 'Comprende el lenguaje universal de la música. Aprende lectura de partituras, intervalos, acordes y teoría práctica para todo tipo de instrumentos.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 4000,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z'),
    duration: '70 horas certificables',
    location: 'Campus Virtual',
    instructor: 'Maestro Carlos Restrepo',
    instructorTitle: 'Compositor y Educador Musical',
    instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
    category: 'Arte',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 780,
    studentsCount: '42.1K',
    videoId: '6XM8rGAupSo',
    thumbnail: 'https://d3puay5pkxu9s4.cloudfront.net/courses/4472/img/web/800_imagen.jpg',
    certificateTitle: 'Diplomado en Teoría y Lenguaje Musical',
    certificateHours: '70 horas certificables',
    modules: [
      { id: 'm-1', order: 1, title: 'Unidad 1. El sonido y sus cualidades', description: 'Altura, duración, timbre e intensidad.', durationMinutes: 70, lessonsCount: 5 },
      { id: 'm-2', order: 2, title: 'Unidad 2. Lectura y notación musical', description: 'Claves de Sol y Fa, figuras rítmicas y compases.', durationMinutes: 100, lessonsCount: 6 },
      { id: 'm-3', order: 3, title: 'Unidad 3. Armonía y formación de acordes', description: 'Tríadas, tétradas y progresiones comunes.', durationMinutes: 110, lessonsCount: 6 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'ia-accesibilidad-digital',
    slug: 'ia-accesibilidad-digital',
    title: 'IA y Accesibilidad Digital Aplicada',
    summary: 'Domina el uso de inteligencia artificial para crear entornos y materiales inclusivos accesibles.',
    description: 'Capacitación técnica para integrar modelos de IA en la creación de contenidos accesibles, descripciones automáticas y adaptación curricular inclusiva.',
    modality: 'Virtual y a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 2500,
    startDate: new Date('2026-04-15T14:00:00.000Z'),
    endDate: new Date('2026-12-31T18:00:00.000Z'),
    duration: '40 horas certificables',
    location: 'Campus Virtual INTEVOPEDI',
    instructor: 'Equipo Técnico INTEVOPEDI',
    instructorTitle: 'Especialistas en Accesibilidad & IA',
    instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
    category: 'Tecnología',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 245,
    studentsCount: '15.4K',
    videoId: '6XM8rGAupSo',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en IA y Accesibilidad Digital',
    certificateHours: '40 horas certificables',
    modules: [
      { id: 'ia-1', order: 1, title: 'Unidad 1. Ecosistema de IA y Discapacidad', description: 'Panorama actual de herramientas y cómo la IA rompe barreras.', durationMinutes: 60, lessonsCount: 4 },
      { id: 'ia-2', order: 2, title: 'Unidad 2. Prompts para Adaptación Curricular', description: 'Ingeniería de prompts para formatos accesibles.', durationMinutes: 80, lessonsCount: 5 },
      { id: 'ia-3', order: 3, title: 'Unidad 3. Visión Artificial y Descripción de Contenido', description: 'Descripción de gráficos, mapas e interfaces con modelos multimodales.', durationMinutes: 90, lessonsCount: 5 }
    ],
    enrollments: [],
    resources: []
  },
  {
    id: 'servicio-al-cliente-lectores',
    slug: 'servicio-al-cliente-lectores',
    title: 'Soporte y Telemarketing con Lectores de Pantalla',
    summary: 'Herramientas de productividad y atención telefónica usando NVDA o JAWS.',
    description: 'Aprende a gestionar CRMs, hojas de cálculo y herramientas de comunicación usando NVDA o JAWS para desempeñarte con soltura en áreas de servicio al cliente.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 1500,
    startDate: new Date('2026-05-10T15:00:00.000Z'),
    endDate: new Date('2026-12-31T17:00:00.000Z'),
    duration: '45 horas certificables',
    location: 'Laboratorio INTEVOPEDI',
    instructor: 'ExpertosTI Formación',
    instructorTitle: 'Instructores en Tecnología Asistiva',
    instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
    category: 'Empleabilidad',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 189,
    studentsCount: '8.7K',
    videoId: '6XM8rGAupSo',
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
    summary: 'Audita sitios web y aplicaciones bajo el estándar internacional WCAG.',
    description: 'Curso profesional para auditar plataformas web bajo el estándar WCAG 2.2 nivel AA. Incluye pruebas automatizadas y validación manual con lectores de pantalla.',
    modality: '100% Virtual a tu ritmo',
    priceCents: 0,
    priceLabel: 'Gratis',
    seats: 1200,
    startDate: new Date('2026-06-01T15:00:00.000Z'),
    endDate: new Date('2026-12-31T17:00:00.000Z'),
    duration: '60 horas certificables',
    location: 'Campus Virtual',
    instructor: 'Auditoría Accesible Pro',
    instructorTitle: 'Consultor WCAG Senior',
    instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
    category: 'Tecnología',
    level: 'ADVANCED',
    status: 'PUBLISHED',
    rating: 5.0,
    reviewsCount: 142,
    studentsCount: '6.3K',
    videoId: '6XM8rGAupSo',
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
    startDate: new Date('2026-06-15T15:00:00.000Z'),
    endDate: new Date('2026-12-31T17:00:00.000Z'),
    duration: '50 horas certificables',
    location: 'Campus Virtual',
    instructor: 'Equipo INTEVOPEDI',
    instructorTitle: 'Especialista en Productividad Digital',
    instructorPhoto: 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg',
    category: 'Empleabilidad',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 304,
    studentsCount: '19.8K',
    videoId: '6XM8rGAupSo',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación en Ofimática e IA Productiva',
    certificateHours: '50 horas certificables',
    modules: [
      { id: 'of-1', order: 1, title: 'Unidad 1. Procesamiento de texto inteligente', description: 'Estructuración, estilos y redacción asistida.', durationMinutes: 70, lessonsCount: 4 },
      { id: 'of-2', order: 2, title: 'Unidad 2. Fórmulas y análisis de datos en hojas de cálculo', description: 'Fórmulas complejas asistidas y visualización.', durationMinutes: 90, lessonsCount: 5 }
    ],
    enrollments: [],
    resources: []
  }
];

export const heroMetrics = [
  { label: 'Cursos gratis', value: '+50' },
  { label: 'Estudiantes', value: '+60.000' },
  { label: 'Valoración media', value: '4.9 ★' },
  { label: 'Certificación', value: 'Internacional' }
];

export const programHighlights = [
  {
    title: 'Aprende a tu propio ritmo',
    description: 'Contenido 100% online disponible las 24 horas del día desde cualquier dispositivo.'
  },
  {
    title: 'Profesores expertos',
    description: 'Clases estructuradas por profesionales de la industria con proyectos prácticos reales.'
  },
  {
    title: 'Certificado de estudios oficial',
    description: 'Evidencia tu conocimiento con un certificado digital con código QR de verificación pública.'
  },
  {
    title: 'Acceso gratuito y abierto',
    description: 'Inscríbete sin costo a todos los cursos de nuestra biblioteca académica.'
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
    title: 'Cursos de música y arte',
    description: 'Desarrolla habilidades en canto, instrumentos musicales y apreciación artística con docentes especializados.'
  },
  {
    title: 'Tecnología y accesibilidad',
    description: 'Domina herramientas de inteligencia artificial, desarrollo web inclusivo y auditorías de software WCAG.'
  },
  {
    title: 'Empleabilidad y productividad',
    description: 'Fortalece competencias para el trabajo moderno, atención al cliente y manejo ágil de oficinas digitales.'
  },
  {
    title: 'Certificación internacional',
    description: 'Respalda tus conocimientos con certificados oficiales listos para compartir en tu CV y perfil de LinkedIn.'
  }
];

export const testimonials = [
  {
    quote: 'La técnica vocal explicada en el curso de canto me ayudó a comprender mi rango y cuidar mi voz. ¡Increíble calidad!',
    author: 'Castelli Florencia',
    course: 'Curso de canto'
  },
  {
    quote: 'Las explicaciones sobre el registro y rango vocal son insuperables. Es el mejor curso que he tomado en internet.',
    author: 'Daniel Méndez',
    course: 'Curso de canto'
  },
  {
    quote: 'Pude certificarme y agregar el código de verificación en mi perfil laboral. 100% recomendado.',
    author: 'Andrea Villalobos',
    course: 'IA y Accesibilidad Digital'
  }
];

export const faqItems = [
  {
    question: '¿Puedo tomar los cursos de manera gratuita?',
    answer: 'Claro que sí, todos los cursos disponibles en INTEVOPEDI Academy son de acceso 100% gratis. Puedes ver las clases, lecturas y evaluaciones a tu propio ritmo.'
  },
  {
    question: '¿Qué incluyen los cursos?',
    answer: 'Los cursos incluyen videoclases en alta definición, lecturas didácticas, evaluaciones de comprobación, actividades prácticas y proyectos basados en situaciones reales.'
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
  'curso-de-canto': {
    lead: 'En este curso de Canto obtendrás las habilidades necesarias para manejar uno de los instrumentos más complejos estudiados por la humanidad: La voz. Aprenderás los fundamentos de la técnica vocal, aplicarás procedimientos para reconocer tu tipo de voz y seleccionar la canción que te favorece, prepararás técnicamente tu pieza, y aplicarás técnicas de respiración y afinación al cantar.',
    outcomes: [
      'Objetivo 1. Comprender los fundamentos del canto y la teoría musical.',
      'Objetivo 2. Seleccionar canciones que se adapten a su tipo de voz o la de otra persona.',
      'Objetivo 3. Preparar una canción para su interpretación técnica y artística.',
      'Objetivo 4. Emplear una respiración costo-diafragmática para cantar de forma saludable.',
      'Objetivo 5. Afinar la voz utilizando la escala mayor y ejercicios auditivos.'
    ],
    audience: [
      'Personas que deseen iniciar o avanzar en su camino como cantante profesional o aficionado.',
      'Músicos, pianistas, guitarristas y compositores que busquen dominar su propia voz.',
      'Directores vocales, docentes de música y creadores de contenido.',
      'Cualquier persona apasionada por el arte del canto sin necesidad de experiencia previa.'
    ],
    materials: [
      {
        title: 'Guía de ejercicios de calentamiento vocal',
        format: 'PDF / Audio',
        description: 'Rutina de 15 minutos para acondicionar las cuerdas vocales antes de cantar.'
      },
      {
        title: 'Plantilla de análisis y preparación de canciones',
        format: 'Documento',
        description: 'Estructuración compás a compás de tono, dinámica, respiración y articulación.'
      },
      {
        title: 'Pistas y escalas para afinación auditiva',
        format: 'Audio MP3',
        description: 'Ejercicios guiados con piano en escala mayor para afinar de oído.'
      }
    ],
    milestones: [
      'Unidad 1: Fundamentos de la técnica vocal y notación.',
      'Unidad 2: Descubrimiento de rango, registro y tesitura vocal.',
      'Unidad 3: Preparación técnica y estructura de una canción.',
      'Unidad 4: Dominio de la respiración costo-diafragmática.',
      'Unidad 5: Afinación precisa y proyecto final de interpretación.'
    ],
    reviewsSummary: {
      score: 4.9,
      total: 563,
      distribution: [
        { stars: 5, pct: 88 },
        { stars: 4, pct: 11 },
        { stars: 3, pct: 1 },
        { stars: 2, pct: 0 },
        { stars: 1, pct: 0 }
      ]
    },
    reviews: [
      {
        name: 'Castelli Florencia Melisa',
        time: 'hace 2 semanas',
        stars: 5,
        avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/6688168/small_imagen-OaboU4qsbh6R.jpg',
        comment: 'Excelente. Las explicaciones del maestro Jairo son sumamente didácticas y los ejercicios se sienten inmediatamente en la colocación de la voz.'
      },
      {
        name: 'Daniel Méndez',
        time: 'hace 3 semanas',
        stars: 5,
        avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/default/small_imagen.jpg',
        comment: 'Excelente hasta estos momentos. Pude identificar claramente mi tesitura y entender por qué me costaba alcanzar ciertas notas sin fatigarme.'
      },
      {
        name: 'Claudia Rodríguez',
        time: 'hace 1 mes',
        stars: 5,
        avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/default/small_imagen.jpg',
        comment: 'Muy completo y directo al punto. El proyecto práctico de preparar una canción te da un marco real para salir cantando con técnica.'
      },
      {
        name: 'Carlos Alberto S.',
        time: 'hace 1 mes',
        stars: 5,
        avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/default/small_imagen.jpg',
        comment: 'La unidad de respiración costo-diafragmática cambió por completo mi forma de cantar. Totalmente recomendado.'
      }
    ],
    faqs: [
      {
        question: '¿Puedo tomar este curso de manera gratuita?',
        answer: 'Claro que sí, todos los cursos disponibles en INTEVOPEDI Academy son de acceso 100% gratis. Puedes acceder a las clases, lecturas y ejercicios a tu propio ritmo. Si deseas evidenciar tu aprendizaje ante empleadores o instituciones, puedes optar por el certificado oficial.'
      },
      {
        question: '¿Qué incluye este curso de canto?',
        answer: 'Incluye 5 unidades pedagógicas con videoclases explicativas, lecturas sobre anatomía y técnica de la voz, ejercicios de práctica vocal auditiva, evaluaciones interactivas y un proyecto final guiado.'
      },
      {
        question: '¿Cómo obtengo el certificado de estudios?',
        answer: 'Al finalizar todas las lecciones y completar el proyecto práctico, podrás generar tu certificado digital con validez internacional, código único de registro y QR de verificación inmediata.'
      },
      {
        question: '¿Necesito conocimientos previos de música?',
        answer: 'No. El curso comienza desde los conceptos más básicos y te guía paso a paso para que reconozcas tu voz, afines y cantes con soltura técnica.'
      }
    ]
  },
  'ia-apoyo-discapacidad-visual': {
    lead: 'Domina las herramientas de inteligencia artificial para adaptar contenidos educativos, crear descripciones automáticas y diseñar experiencias formativas accesibles.',
    outcomes: [
      'Diseñar materiales educativos con mejor estructura y legibilidad.',
      'Aplicar prompts y flujos de IA con criterio inclusivo.',
      'Adaptar actividades, guías y evaluaciones para mayor accesibilidad.',
      'Implementar un flujo de trabajo replicable para aulas y programas inclusivos.'
    ],
    audience: [
      'Docentes que trabajan con estudiantes con discapacidad visual.',
      'Familias y cuidadores que necesitan apoyo práctico para acompañar el aprendizaje.',
      'Facilitadores, terapeutas y coordinadores académicos.',
      'Profesionales que desean producir recursos educativos más accesibles.'
    ],
    materials: [
      {
        title: 'Guía rápida de prompts accesibles',
        format: 'PDF',
        description: 'Plantillas iniciales para pedir a la IA materiales más claros y útiles.'
      },
      {
        title: 'Checklist de accesibilidad visual',
        format: 'Checklist',
        description: 'Lista de verificación para revisar documentos, clases y recursos antes de compartirlos.'
      },
      {
        title: 'Repositorio de herramientas recomendadas',
        format: 'Recursos',
        description: 'Selección de herramientas, lectores y flujos de apoyo para docentes y participantes.'
      }
    ],
    milestones: [
      'Completar los módulos troncales del curso.',
      'Aplicar al menos un caso práctico de adaptación accesible.',
      'Cerrar el recorrido con progreso completo para activar certificación.'
    ],
    reviewsSummary: {
      score: 4.9,
      total: 245,
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
        name: 'Lic. Mariana Soto',
        time: 'hace 3 semanas',
        stars: 5,
        avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/default/small_imagen.jpg',
        comment: 'Excelente enfoque pedagógico. La integración de IA para describir imágenes y diagramas técnicos es revolucionaria para mis clases.'
      }
    ],
    faqs: [
      {
        question: '¿Qué herramientas de IA se enseñan?',
        answer: 'Modelos de lenguaje como ChatGPT y Claude, herramientas de visión artificial y sintetizadores de voz para accesibilidad.'
      }
    ]
  }
};

export const courseResourceLibraryBySlug = {
  'curso-de-canto': {
    title: 'Materiales y recursos de técnica vocal',
    summary: 'Colección de partituras, audios de afinación, guías de respiración y proyecto práctico final.',
    collections: [
      {
        title: 'Guías de calentamiento y técnica',
        description: 'Rutinas guiadas para cuidar y ejercitar tu voz diariamente.',
        items: [
          { title: 'Rutina de calentamiento en 15 minutos', format: 'Audio MP3' },
          { title: 'Ejercicios de resonancia y colocación', format: 'Guía PDF' },
          { title: 'Guía de salud e higiene vocal', format: 'Documento' }
        ]
      },
      {
        title: 'Pistas y escalas de entrenamiento',
        description: 'Acompañamientos al piano para practicar afinación y rango.',
        items: [
          { title: 'Escalas mayores en piano (registro medio)', format: 'Audio MP3' },
          { title: 'Arpegios para agilidad vocal', format: 'Audio MP3' },
          { title: 'Pistas de práctica para el proyecto final', format: 'Pack WAV/MP3' }
        ]
      }
    ]
  },
  'ia-apoyo-discapacidad-visual': {
    title: 'Biblioteca de recursos del curso',
    summary: 'Colección inicial de activos de aprendizaje y apoyo para usar la IA con enfoque accesible.',
    collections: [
      {
        title: 'Preparación previa',
        description: 'Materiales para llegar con contexto, criterios de accesibilidad y objetivos claros.',
        items: [
          { title: 'Ruta de preparación del participante', format: 'Guía' },
          { title: 'Checklist de accesibilidad antes de crear contenido', format: 'Checklist' }
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
