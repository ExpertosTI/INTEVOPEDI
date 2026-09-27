import { notFound } from 'next/navigation';
import Link from 'next/link';
import { submitEnrollment } from '@/app/actions';
import { getCourseBySlug, getPublishedCourses, getEnrollmentForParticipantAndCourse } from '@/lib/data';
import { getParticipantSession } from '@/lib/participant-auth';
import { courseExperienceBySlug, getCourseResourceLibrary, getCourseResourceStats, siteConfig } from '@/lib/site';
import { CourseVideoPreview, CourseCurriculum } from '@/components/CourseInteractiveSections';
import { CourseCard } from '@/components/CourseCard';
import { SupportMaterialsPanel } from '@/components/SupportMaterialsPanel';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);
  return {
    title: course ? `${course.title} [Gratis y Certificado] | INTEVOPEDI Academy` : 'Curso | INTEVOPEDI Academy',
    description: course?.description || 'Curso virtual gratuito con certificación internacional.'
  };
}

export default async function CourseDetailPage({ params, searchParams }) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const allCourses = await getPublishedCourses();
  const recommendedCourses = allCourses.filter((c) => c.slug !== course.slug).slice(0, 3);

  const session = await getParticipantSession();
  let existingEnrollment = null;

  if (session?.participantId) {
    existingEnrollment = await getEnrollmentForParticipantAndCourse(session.participantId, course.id);
  }

  const error = searchParams?.error;
  const experience = courseExperienceBySlug[course.slug] || courseExperienceBySlug['curso-de-canto'];
  const resourceLibrary = getCourseResourceLibrary(course.slug);
  const resourceStats = getCourseResourceStats(course.slug);
  const attachedResources = course.resources || [];
  const enrolledCount = course.studentsCount || `${(course.enrollments?.length || 0) + 1240}`;
  const ratingScore = course.rating || 4.9;
  const reviewsCount = course.reviewsCount || 563;
  const videoId = course.videoId || '6XM8rGAupSo';
  const thumbnail = course.thumbnail || 'https://d3puay5pkxu9s4.cloudfront.net/courses/4472/img/web/800_imagen.jpg';

  const instructorName = course.instructor || 'Jairo Sanabria';
  const instructorTitle = course.instructorTitle || 'Músico, Pianista y Compositor';
  const instructorPhoto = course.instructorPhoto || 'https://d3puay5pkxu9s4.cloudfront.net/Users/4293908/medium_imagen-4dbBTDe9d96H.jpg';
  const instructorBio = course.instructorBio || 'Especialista en técnica vocal y pedagogía musical con más de 15 años formando cantantes e intérpretes a nivel internacional.';

  const certTitle = course.certificateTitle || `Diplomado en ${course.title}`;
  const certHours = course.certificateHours || course.duration || '80 horas certificables';

  const reviewsSummary = experience?.reviewsSummary || {
    score: ratingScore,
    total: reviewsCount,
    distribution: [
      { stars: 5, pct: 88 },
      { stars: 4, pct: 11 },
      { stars: 3, pct: 1 },
      { stars: 2, pct: 0 },
      { stars: 1, pct: 0 }
    ]
  };

  const studentReviews = experience?.reviews || [
    {
      name: 'Castelli Florencia Melisa',
      time: 'hace 2 semanas',
      stars: 5,
      avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/6688168/small_imagen-OaboU4qsbh6R.jpg',
      comment: 'Excelente. Las explicaciones del docente son sumamente didácticas y los ejercicios se sienten inmediatamente en la colocación de la voz.'
    },
    {
      name: 'Daniel Méndez',
      time: 'hace 3 semanas',
      stars: 5,
      avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/default/small_imagen.jpg',
      comment: 'Excelente hasta estos momentos. Pude identificar claramente mi tesitura y entender cómo practicar sin fatigarme.'
    },
    {
      name: 'Claudia Rodríguez',
      time: 'hace 1 mes',
      stars: 5,
      avatar: 'https://d3puay5pkxu9s4.cloudfront.net/Users/default/small_imagen.jpg',
      comment: 'Muy completo y directo al punto. El proyecto práctico te da un marco real para avanzar de forma estructurada.'
    }
  ];

  const faqs = experience?.faqs || [
    {
      question: '¿Puedo tomar este curso de manera gratuita?',
      answer: 'Claro que sí, todos los cursos disponibles en INTEVOPEDI Academy son de acceso 100% gratis. Puedes acceder a las clases, lecturas y evaluaciones a tu propio ritmo.'
    },
    {
      question: '¿Qué incluye este curso?',
      answer: 'Incluye unidades didácticas con videoclases explicativas, lecturas guiadas, ejercicios prácticos, evaluaciones de comprobación y un proyecto final.'
    },
    {
      question: '¿Cómo obtengo el certificado de estudios?',
      answer: 'Al finalizar todas las lecciones y aprobar las evaluaciones, podrás generar tu certificado digital con validez internacional, código único y verificación QR.'
    },
    {
      question: '¿Cuáles son los requisitos previos?',
      answer: 'No necesitas conocimientos previos. El curso está diseñado desde nivel inicial para guiarte paso a paso.'
    }
  ];

  return (
    <div className="clp-page-wrapper">
      {/* 1. HERO SECTION (Edutin clp-hero) */}
      <section className="clp-hero">
        <div className="clp-hero__in shell">
          <div className="clp-hero__text">
            <div className="clp-hero__top">
              <nav className="clp-crumbs" aria-label="Categoría del curso">
                <Link href="/cursos">Cursos</Link>
                <svg className="clp-crumbs-sep" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <Link href={`/cursos?category=${encodeURIComponent(course.category || 'General')}`}>{course.category || 'General'}</Link>
                <svg className="clp-crumbs-sep" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span>{course.title}</span>
              </nav>

              <h1 className="clp-h1">{course.title}</h1>
            </div>

            <div className="clp-hero__meta">
              <p className="clp-desc">{course.description}</p>

              <div className="clp-rate clp-rate--full">
                <span className="clp-rstars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="#ffb800">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </span>
                <span className="clp-rscore">{ratingScore}</span>
                <a href="#valoraciones" className="clp-ropinions">({reviewsCount} opiniones)</a>
                <span className="clp-rsep">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <b>{enrolledCount}</b> estudiantes
                </span>
                <span className="clp-rsep clp-rsep--free">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#ef4444">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <b>Curso gratis</b>
                </span>
              </div>
            </div>
          </div>

          {/* ASIDE STICKY BUY CARD (Edutin clp-buy) */}
          <aside className="clp-buy">
            <CourseVideoPreview videoId={videoId} thumbnail={thumbnail} title={course.title} />

            <div className="clp-buy__pad">
              {existingEnrollment ? (
                <div className="clp-buy__enrolled">
                  <div className="clp-buy__enrolled-badge">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Ya estás inscrito</span>
                  </div>
                  <h3>¡Bienvenido de vuelta!</h3>
                  <p className="clp-buy__progress-text">Tu progreso actual: <strong>{existingEnrollment.progressPercent}%</strong></p>
                  <div className="clp-progress-track">
                    <div className="clp-progress-fill" style={{ width: `${existingEnrollment.progressPercent}%` }} />
                  </div>
                  <Link href={`/mi-inscripcion/${existingEnrollment.referenceCode}`} className="ea-btn-primary clp-buy__btn">
                    Ir a mi campus personal
                  </Link>
                </div>
              ) : (
                <div className="clp-buy__form-wrap">
                  <div className="clp-buy__price-row">
                    <span className="clp-buy__free-pill">100% Gratis</span>
                    <span className="clp-buy__cert-opt">Certificado disponible</span>
                  </div>

                  {error && <div className="clp-banner-error">{error}</div>}

                  <form action={submitEnrollment} className="clp-enroll-form">
                    <input type="hidden" name="courseSlug" value={course.slug} />
                    <div className="clp-input-group">
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="Nombre y apellido completo"
                        className="clp-input"
                      />
                    </div>
                    <div className="clp-input-group">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Correo electrónico"
                        className="clp-input"
                      />
                    </div>
                    <div className="clp-input-group">
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Teléfono / WhatsApp"
                        className="clp-input"
                      />
                    </div>

                    <button type="submit" className="ea-btn-primary clp-buy__btn">
                      Inscribirme gratis
                    </button>
                  </form>

                  <p className="clp-buy__free-note">*Accede a este y a todos nuestros cursos gratis</p>
                </div>
              )}
            </div>

            <div className="clp-feat-list">
              <div className="clp-feat-card">
                <span className="clp-fc-ic">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <div>
                  <p className="clp-fc-t">Modalidad 100% virtual</p>
                  <p className="clp-fc-d">El contenido está disponible las 24 horas del día para que estudies en tu propio horario.</p>
                </div>
              </div>

              <div className="clp-feat-card">
                <span className="clp-fc-ic">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </span>
                <div>
                  <p className="clp-fc-t">Certificado internacional</p>
                  <p className="clp-fc-d">
                    Al finalizar el curso puedes obtener un certificado de estudios con validez internacional. <a href="#certificado">Ver más</a>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* MAIN CONTENT RAIL */}
      <div className="clp-rail shell">
        <div className="clp-rail__main">
          {/* 2. SECTION: QUÉ APRENDERÁS (Edutin clp-sec) */}
          <section className="clp-sec" id="que-aprenderas">
            <div className="clp-row-head">
              <h2>Qué aprenderás</h2>
            </div>
            <p className="clp-lead-text">
              {experience?.lead || course.description}
            </p>
            <p className="clp-lead-sub">
              <strong>Al finalizar este {course.title} podrás:</strong>
            </p>
            <ul className="clp-obj-list">
              {(experience?.outcomes || [
                'Comprender los fundamentos técnicos y pedagógicos del área de estudio.',
                'Aplicar metodologías estructuradas para resolver casos prácticos reales.',
                'Dominar herramientas modernas aplicadas al flujo de trabajo.',
                'Elaborar un proyecto final guiado con retroalimentación paso a paso.'
              ]).map((outcome, idx) => (
                <li key={idx} className="clp-obj-item">
                  <span className="clp-obj-check">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. SECTION: PROGRAMA DEL CURSO (Edutin Curriculum) */}
          <section className="clp-sec" id="temario">
            <div className="clp-row-head">
              <h2>Programa del curso</h2>
              <span className="clp-row-meta">{course.modules?.length || 5} unidades didácticas · {course.duration}</span>
            </div>
            <CourseCurriculum modules={course.modules || []} />
          </section>

          {/* 4. SECTION: PERFIL DEL PROFESOR (Edutin prof-card) */}
          <section className="clp-sec" id="profesor">
            <div className="clp-row-head">
              <h2>Perfil del profesor</h2>
            </div>
            <div className="clp-prof-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={instructorPhoto}
                alt={instructorName}
                className="clp-prof-photo"
                loading="lazy"
              />
              <div className="clp-prof-info">
                <div className="clp-prof-header">
                  <h3 className="clp-prof-name">{instructorName}</h3>
                  <span className="clp-prof-badge">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2l2.4 2.5 3.4-.6 1.3 3.2 3.3 1.3-.6 3.4 2.5 2.4-2.5 2.4.6 3.4-3.3 1.3-1.3 3.2-3.4-.6L12 22l-2.4-2.5-3.4.6-1.3-3.2-3.3-1.3.6-3.4L-0.3 12l2.5-2.4-.6-3.4 3.3-1.3 1.3-3.2 3.4.6L12 2zm-1 14.5l5.5-5.5-1.4-1.4-4.1 4.1-2.1-2.1-1.4 1.4 3.5 3.5z" />
                    </svg>
                    Docente certificado
                  </span>
                </div>
                <p className="clp-prof-title">{instructorTitle}</p>
                <p className="clp-prof-bio">{instructorBio}</p>
                <div className="clp-prof-stats">
                  <span>★ 4.9 Valoración docente</span>
                  <span>👥 Más de 50.000 estudiantes formados</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. SECTION: CERTIFICADO OFICIAL (Edutin clp-cert) */}
          <section className="clp-cert" id="certificado">
            <div className="clp-cert__in">
              <div className="clp-cert__info">
                <h2>Obtén un <span className="clp-cert-highlight">Certificado Oficial</span> de INTEVOPEDI Academy</h2>
                <p className="clp-cert__lead">
                  El <b>78%</b> de nuestros estudiantes certificados obtuvieron un nuevo empleo, ascendieron o desarrollaron su proyecto profesional.
                </p>
                <ul className="clp-cert__trust">
                  <li>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    <span>Validez internacional y código QR verificable</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46V10.9M7.86 6.5a1.63 1.63 0 1 0 1.63 1.63A1.63 1.63 0 0 0 7.86 6.5z" />
                    </svg>
                    <span>Compártelo directamente en tu perfil de LinkedIn y CV</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Respaldado por la trayectoria y rigor de INTEVOPEDI Academy</span>
                  </li>
                </ul>

                <div className="clp-cert__card">
                  <span className="clp-cert__card-k">Título a certificar</span>
                  <strong className="clp-cert__card-t">{certTitle}</strong>
                  <span className="clp-cert__card-s">{certHours}</span>
                </div>

                <div className="clp-cert__cta">
                  <a href="#inicio" className="ea-btn-primary">
                    Comenzar curso y certificarme
                  </a>
                </div>
              </div>

              {/* Graphic Certificate Mockup */}
              <div className="clp-cert__visual">
                <div className="clp-cert-mockup">
                  <div className="clp-cert-mockup-inner">
                    <div className="clp-cert-mockup-header">
                      <div className="clp-cert-mockup-logo">INTEVOPEDI ACADEMY</div>
                      <div className="clp-cert-mockup-code">CERT-ID: #CUR_{course.id.slice(0, 6).toUpperCase()}</div>
                    </div>
                    <div className="clp-cert-mockup-body">
                      <p className="clp-cert-mockup-certifies">Otorga el presente certificado a:</p>
                      <h4 className="clp-cert-mockup-student">[Nombre del Participante]</h4>
                      <p className="clp-cert-mockup-desc">
                        Por haber completado y aprobado satisfactoriamente el programa formativo de:
                      </p>
                      <h3 className="clp-cert-mockup-title">{certTitle}</h3>
                      <p className="clp-cert-mockup-hours">Con una intensidad académica de {certHours}</p>
                    </div>
                    <div className="clp-cert-mockup-footer">
                      <div className="clp-cert-mockup-seal">
                        <div className="clp-cert-seal-icon">★</div>
                        <span>SELLO OFICIAL</span>
                      </div>
                      <div className="clp-cert-mockup-qr">
                        <div className="clp-cert-qr-box">
                          <span>QR VALIDABLE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. SECTION: VALORACIONES DE ESTUDIANTES (Edutin Reviews) */}
          <section className="clp-sec" id="valoraciones">
            <div className="clp-row-head">
              <h2>Valoraciones de estudiantes</h2>
              <div className="clp-row-sub">{reviewsCount} opiniones · promedio {ratingScore} de 5</div>
            </div>

            <div className="clp-rev-top">
              <div className="clp-rev-score">
                <div className="clp-rev-big">{ratingScore}</div>
                <div className="clp-rstars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="20" height="20" fill="#ffb800">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="clp-rev-rn">{reviewsCount} opiniones</div>
              </div>

              <div className="clp-rev-bars">
                {reviewsSummary.distribution.map((bar) => (
                  <div key={bar.stars} className="clp-rbar">
                    <span className="clp-rb-lbl">{bar.stars}</span>
                    <span className="clp-rb-track">
                      <span className="clp-rb-fill" style={{ width: `${bar.pct}%` }} />
                    </span>
                    <span className="clp-rb-pct">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="clp-rev-list">
              {studentReviews.map((rev, rIdx) => (
                <li key={rIdx} className="clp-rev-item">
                  <div className="clp-rev-av">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rev.avatar} alt={rev.name} loading="lazy" />
                  </div>
                  <div className="clp-rev-content">
                    <div className="clp-rev-hd">
                      <span className="clp-rev-name">{rev.name}</span>
                    </div>
                    <div className="clp-rev-meta">
                      <span className="clp-rstars">
                        {[...Array(rev.stars || 5)].map((_, s) => (
                          <svg key={s} viewBox="0 0 24 24" width="14" height="14" fill="#ffb800">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </span>
                      <span className="clp-rev-time">{rev.time}</span>
                    </div>
                    <p className="clp-rev-text">{rev.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 7. SECTION: PREGUNTAS FRECUENTES (Edutin FAQ) */}
          <section className="clp-faq" id="preguntas-frecuentes">
            <div className="clp-row-head">
              <h2>Preguntas frecuentes</h2>
            </div>
            <div className="clp-faq-list">
              {faqs.map((faq, fIdx) => (
                <details key={fIdx} className="clp-qtab" open={fIdx === 0}>
                  <summary>{faq.question}</summary>
                  <div className="clp-qtab-a">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          {/* RECURSOS Y MATERIALES DE APOYO EXISTENTES */}
          {resourceLibrary && (
            <section className="clp-sec" id="biblioteca">
              <div className="clp-row-head">
                <h2>Biblioteca y recursos del curso</h2>
                <span className="clp-row-meta">{resourceStats.itemsCount} materiales en {resourceStats.collectionsCount} colecciones</span>
              </div>
              <div className="clp-resource-grid">
                {resourceLibrary.collections.map((col, cIdx) => (
                  <div key={cIdx} className="clp-resource-card">
                    <h4>{col.title}</h4>
                    <p>{col.description}</p>
                    <ul className="clp-resource-items">
                      {col.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <span>📄</span>
                          <strong>{item.title}</strong>
                          <span className="clp-resource-badge">{item.format}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {attachedResources.length > 0 && (
            <section className="clp-sec">
              <div className="clp-row-head">
                <h2>Recursos adjuntos descargables</h2>
              </div>
              <div className="clp-resource-grid">
                {attachedResources.map((res) => {
                  const href = res.type === 'LINK' ? res.url : res.filePath;
                  return (
                    <div key={res.id} className="clp-resource-card">
                      <h4>{res.title}</h4>
                      {res.description && <p>{res.description}</p>}
                      {href && (
                        <a href={href} target="_blank" rel="noreferrer" className="button button-outline" style={{ marginTop: '10px' }}>
                          Abrir recurso
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <SupportMaterialsPanel courseId={course.id} course={course} />
        </div>
      </div>

      {/* 8. SECTION: CURSOS RECOMENDADOS (Edutin clp-band) */}
      {recommendedCourses.length > 0 && (
        <section className="clp-band">
          <div className="shell">
            <div className="clp-row-head">
              <h2>Cursos recomendados</h2>
              <Link href="/cursos" className="clp-row-link">Ver catálogo completo →</Link>
            </div>
            <div className="clp-rec-grid">
              {recommendedCourses.map((rec) => (
                <CourseCard key={rec.id} course={rec} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
