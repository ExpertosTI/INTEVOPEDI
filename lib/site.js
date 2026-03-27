const productionBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intevopedi.org';

export const siteConfig = {
  name: 'INTEVOPEDI',
  fullName: 'Instituto Técnico Vocacional para Personas con Discapacidad',
  tagline: 'Educación inclusiva, accesible y orientada al empleo',
  description: 'Plataforma moderna de cursos accesibles, certificación verificable y gestión académica para programas de formación inclusiva.',
  domain: productionBaseUrl,
  baseUrl: productionBaseUrl,
  contactEmail: 'info@intevopedi.org',
  contactPhone: '829 954 8273',
  contactPhoneHref: 'https://wa.me/18299548273',
  address: 'Calle José Spight Rodríguez, No. 03, Ensanche El Portal, Santo Domingo, D.N.'
};

export const featuredCourseSeed = {
  slug: 'ia-apoyo-discapacidad-visual',
  title: 'IA y Accesibilidad Digital Aplicada',
  summary: 'Domina el uso de inteligencia artificial para la creación de entornos y materiales 100% accesibles.',
  description: 'Un programa técnico avanzado diseñado para profesionales, docentes y familiares. Aprende a integrar modelos de lenguaje y visión artificial para automatizar la generación de descripciones, adaptar currículos educativos de forma masiva y optimizar la comunicación para personas con discapacidad visual con un enfoque en la inserción laboral.',
  modality: 'Virtual (Zoom)',
  priceCents: 50000,
  priceLabel: 'RD$ 500',
  seats: 80,
  startDate: '2026-04-15T14:00:00.000Z',
  endDate: '2026-04-15T18:00:00.000Z',
  duration: '4 horas en vivo + certificación certificable',
  location: 'Zoom Premium',
  instructor: 'Equipo Técnico INTEVOPEDI',
  status: 'PUBLISHED'
};

export const courseModuleSeed = [
  {
    order: 1,
    title: 'Ecosistema de IA y Discapacidad',
    description: 'Panorama actual de herramientas y cómo la IA está rompiendo barreras de acceso en el entorno laboral.',
    durationMinutes: 45
  },
  {
    order: 2,
    title: 'Prompts para Adaptación Curricular',
    description: 'Ingeniería de prompts avanzada para convertir materiales convencionales en formatos accesibles de alta fidelidad.',
    durationMinutes: 50
  },
  {
    order: 3,
    title: 'Visión Artificial en la Práctica',
    description: 'Uso de GPT-4o y Claude para la descripción detallada de gráficos, mapas complejos y diagramas técnicos.',
    durationMinutes: 45
  },
  {
    order: 4,
    title: 'Flujo de Trabajo del Asistente Digital',
    description: 'Configuración de herramientas de apoyo y automatización de tareas administrativas con enfoque inclusivo.',
    durationMinutes: 40
  }
];

export const heroMetrics = [
  { label: 'Curso destacado', value: '1' },
  { label: 'Formato', value: 'Zoom en vivo' },
  { label: 'Certificación', value: 'PDF + QR' },
  { label: 'Costo', value: 'RD$ 500' }
];

export const programHighlights = [
  {
    title: 'Cursos accesibles',
    description: 'Experiencias formativas con enfoque en inclusión, claridad didáctica y recursos de apoyo.'
  },
  {
    title: 'Registro y seguimiento',
    description: 'Inscripciones persistentes, panel de participante y control administrativo.'
  },
  {
    title: 'Certificación validable',
    description: 'Cada certificado incluye código único y verificación pública mediante QR.'
  },
  {
    title: 'Experiencia tipo plataforma',
    description: 'Rutas claras para participantes, panel de seguimiento y navegación más cercana a un LMS moderno.'
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
    title: 'Capacitación técnica',
    description: 'Programas orientados al desarrollo académico, profesional y laboral con enfoque inclusivo.'
  },
  {
    title: 'Herramientas tecnológicas',
    description: 'Uso de recursos digitales accesibles para responder a necesidades diferenciadas.'
  },
  {
    title: 'Inclusión laboral',
    description: 'Acompañamiento para fortalecer competencias y oportunidades de inserción.'
  },
  {
    title: 'Apoyo educativo',
    description: 'Acompañamiento a docentes, familias y participantes con recursos de fácil adopción.'
  }
];

export const testimonials = [
  {
    quote: 'La estructura del curso es clara y el enfoque de accesibilidad se nota desde el primer minuto.',
    author: 'Docente participante'
  },
  {
    quote: 'El proceso de inscripción y seguimiento ahora sí se siente profesional y ordenado.',
    author: 'Coordinación académica'
  },
  {
    quote: 'La validación del certificado con QR nos da confianza y trazabilidad.',
    author: 'Aliado institucional'
  }
];

export const faqItems = [
  {
    question: '¿El curso es totalmente en línea?',
    answer: 'Sí. La sesión es por Zoom y el panel conserva tus datos de inscripción y el estado del certificado.'
  },
  {
    question: '¿Qué necesito para obtener el certificado?',
    answer: 'Completar el curso y cumplir con el criterio definido por administración o por el progreso del plan formativo.'
  },
  {
    question: '¿Cómo se valida el certificado?',
    answer: 'Cada certificado incluye un QR y un código único que abre una página pública de verificación.'
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
  'Panel administrativo',
  'Control de cupos',
  'Confirmaciones por correo',
  'Gestión de pagos',
  'Materiales del curso',
  'Progreso por módulos',
  'Evaluación final',
  'Certificado PDF automático',
  'QR validable',
  'Página pública de validación',
  'Testimonios y casos de éxito',
  'Blog y recursos',
  'Analítica básica',
  'Documentación de despliegue',
  'Modo oscuro automático',
  'Notificaciones push',
  'Chat con soporte IA',
  'Foros de discusión',
  'Calendario de eventos',
  'Integración con LinkedIn',
  'Insignias digitales',
  'Rutas de aprendizaje',
  'Mentorías personalizadas',
  'Recursos offline',
  'Accesibilidad WCAG AAA',
  'API pública',
  'App móvil nativa (PWA)',
  'Pagos con tarjeta',
  'Panel de docentes',
  'Biblioteca de recursos adaptados',
  'Encuestas de satisfacción',
  'Seguimiento de empleabilidad',
  'Integración con WhatsApp',
  'Agenda de talleres',
  'Repositorio de plantillas accesibles',
  'Soporte multicanal',
  'Gamificación con niveles',
  'Sistema de becas',
  'Certificaciones por especialidad',
  'Aulas híbridas en vivo'
];

export const grupoAtreveteProfile = {
  name: 'Grupo Atrévete',
  slug: 'grupo-atrevete',
  tagline: 'Proyecto musical inclusivo integrado por personas con discapacidad visual en República Dominicana.',
  summary: 'Mini portafolio oficial dentro de INTEVOPEDI para presentar su propuesta artística, presencia digital y vías de contacto.',
  description: 'Grupo Atrévete representa una expresión artística inclusiva con enfoque en talento, visibilidad, participación cultural y oportunidades para presentaciones en actividades institucionales, educativas y comunitarias.',
  location: 'República Dominicana',
  bookingPhone: '829 954 8273',
  bookingHref: 'https://wa.me/18299548273?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20Grupo%20Atr%C3%A9vete',
  heroImage: '/Logosolid.jpg',
  stats: [
    { label: 'Proyecto', value: 'Musical inclusivo' },
    { label: 'Base', value: 'República Dominicana' },
    { label: 'Canal validado', value: 'YouTube oficial' },
    { label: 'Contacto', value: '829 954 8273' }
  ]
};

export const grupoAtreveteLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/p/Grupo-Atr%C3%A9vete-100064654453284/',
    note: 'Se usa una URL canónica de Facebook más estable que el enlace compartido temporal.'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/grupoatreveterd/',
    note: 'El perfil aparece indexado públicamente como @grupoatreveterd.'
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@grupoatreveterd5840',
    note: 'Validado: canal oficial con descripción pública del grupo.'
  },
  {
    label: 'TikTok @grupoatreveterd',
    href: 'https://www.tiktok.com/@grupoatreveterd',
    note: 'Hay videos públicos indexados asociados a esta cuenta.'
  },
  {
    label: 'TikTok @grupoatreveteoficial',
    href: 'https://www.tiktok.com/@grupoatreveteoficial',
    note: 'No apareció perfil claro en resultados públicos; conviene confirmarlo manualmente antes de destacarlo como principal.'
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
  'ia-apoyo-discapacidad-visual': {
    audience: [
      'Docentes que trabajan con estudiantes con discapacidad visual.',
      'Familias y cuidadores que necesitan apoyo práctico para acompañar el aprendizaje.',
      'Facilitadores, terapeutas y coordinadores académicos.',
      'Profesionales que desean producir recursos educativos más accesibles.'
    ],
    outcomes: [
      'Diseñar materiales educativos con mejor estructura y legibilidad.',
      'Aplicar prompts y flujos de IA con criterio inclusivo.',
      'Adaptar actividades, guías y evaluaciones para mayor accesibilidad.',
      'Implementar un flujo de trabajo replicable para aulas y programas inclusivos.'
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
    ]
  }
};

export const courseResourceLibraryBySlug = {
  'ia-apoyo-discapacidad-visual': {
    title: 'Biblioteca de recursos del curso',
    summary: 'Colección inicial de activos de aprendizaje y apoyo para usar la IA con enfoque accesible antes, durante y después de la sesión.',
    collections: [
      {
        title: 'Preparación previa',
        description: 'Materiales para llegar con contexto, criterios de accesibilidad y objetivos claros.',
        items: [
          {
            title: 'Ruta de preparación del participante',
            format: 'Guía',
            access: 'Disponible al iniciar el campus',
            description: 'Resumen del recorrido, expectativas y recomendaciones para aprovechar la experiencia formativa.'
          },
          {
            title: 'Checklist de accesibilidad antes de crear contenido',
            format: 'Checklist',
            access: 'Disponible durante el curso',
            description: 'Lista rápida para validar claridad, contraste, estructura y usabilidad de materiales educativos.'
          }
        ]
      },
      {
        title: 'Plantillas prácticas',
        description: 'Recursos accionables para adaptar clases, guías, evaluaciones y dinámicas formativas.',
        items: [
          {
            title: 'Prompts base para materiales accesibles',
            format: 'Plantilla',
            access: 'Disponible en campus',
            description: 'Prompts curados para generar materiales más claros, estructurados y útiles con IA.'
          },
          {
            title: 'Modelo de adaptación de guía didáctica',
            format: 'Documento',
            access: 'Disponible en campus',
            description: 'Ejemplo de cómo convertir una guía convencional en una experiencia más accesible.'
          },
          {
            title: 'Marco de revisión humana',
            format: 'Framework',
            access: 'Disponible para seguimiento',
            description: 'Criterios para revisar resultados de IA antes de entregarlos a participantes o estudiantes.'
          }
        ]
      },
      {
        title: 'Continuidad y certificación',
        description: 'Activos para cerrar el aprendizaje, consolidar evidencias y activar la certificación.',
        items: [
          {
            title: 'Hoja de evidencias finales',
            format: 'Formulario',
            access: 'Disponible al completar módulos',
            description: 'Formato sugerido para documentar el uso aplicado de las herramientas vistas en el curso.'
          },
          {
            title: 'Ruta de cierre y certificación',
            format: 'Mapa',
            access: 'Disponible al 100% de progreso',
            description: 'Explica qué revisar antes de solicitar o descargar el certificado verificable.'
          }
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
