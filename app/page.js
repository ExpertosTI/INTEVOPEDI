import Link from 'next/link';
import { getFeaturedCourse, getPublishedCourses } from '@/lib/data';
import { CourseCard } from '@/components/CourseCard';
import { CourseVideoPreview } from '@/components/CourseInteractiveSections';
import {
  aboutUs,
  faqItems,
  heroMetrics,
  institutionalSections,
  siteConfig,
  testimonials
} from '@/lib/site';

export default async function HomePage() {
  const featuredCourse = await getFeaturedCourse();
  const allCourses = await getPublishedCourses();

  return (
    <div className="ea-home">
      {/* 1. HERO SECTION (Edutin Academy Style) */}
      <section className="ea-hero-section">
        <div className="shell ea-hero-inner">
          <div className="ea-hero-content">
            <span className="ea-hero-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2l2.4 2.5 3.4-.6 1.3 3.2 3.3 1.3-.6 3.4 2.5 2.4-2.5 2.4.6 3.4-3.3 1.3-1.3 3.2-3.4-.6L12 22l-2.4-2.5-3.4.6-1.3-3.2-3.3-1.3.6-3.4L-0.3 12l2.5-2.4-.6-3.4 3.3-1.3 1.3-3.2 3.4.6L12 2zm-1 14.5l5.5-5.5-1.4-1.4-4.1 4.1-2.1-2.1-1.4 1.4 3.5 3.5z" />
              </svg>
              Educación virtual gratuita, inclusiva y accesible
            </span>

            <h1 className="ea-hero-title">
              Aprende tecnología y competencias laborales con cursos gratis
            </h1>

            <p className="ea-hero-subtitle">
              Desarrolla habilidades en accesibilidad digital, inteligencia artificial, herramientas ofimáticas y competencias para el empleo a tu propio ritmo con proyectos prácticos y certificación oficial.
            </p>

            <form action="/cursos" method="GET" className="ea-hero-search">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" className="ea-hero-search-icon">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                name="search"
                placeholder="¿Qué quieres aprender hoy? Ej: Inteligencia Artificial, Accesibilidad, Lectores de pantalla..."
                aria-label="Buscar cursos"
              />
              <button type="submit" className="ea-btn-primary">
                Buscar curso
              </button>
            </form>

            <div className="ea-hero-chips">
              <span className="ea-chips-label">Popular:</span>
              <Link href="/cursos/ia-accesibilidad-digital" className="ea-chip">Inteligencia Artificial</Link>
              <Link href="/cursos/servicio-al-cliente-lectores" className="ea-chip">Lectores de pantalla</Link>
              <Link href="/cursos/qa-tester-accesibilidad" className="ea-chip">Accesibilidad Web</Link>
              <Link href="/cursos/ofimatica-profesional-ia" className="ea-chip">Ofimática con IA</Link>
              <Link href="/cursos?category=Empleabilidad" className="ea-chip">Empleabilidad</Link>
            </div>

            <div className="ea-hero-metrics">
              {heroMetrics.map((m) => (
                <div key={m.label} className="ea-metric-item">
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURED COURSE SPOTLIGHT (IA y Accesibilidad Digital) */}
          <div className="ea-hero-spotlight">
            <div className="ea-spotlight-card">
              <div className="ea-spotlight-badge">★ CURSO DESTACADO</div>
              <CourseVideoPreview
                videoId={featuredCourse.videoId}
                thumbnail={featuredCourse.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                title={featuredCourse.title}
              />
              <div className="ea-spotlight-body">
                <div className="ea-spotlight-meta">
                  <span className="ea-spotlight-rate">★ {featuredCourse.rating || 4.9}</span>
                  <span className="ea-spotlight-students">👥 {featuredCourse.studentsCount || '2.450'} alumnos</span>
                  <span className="ea-spotlight-free">Gratis</span>
                </div>
                <h3>{featuredCourse.title}</h3>
                <p>{featuredCourse.summary}</p>
                <div className="ea-spotlight-action">
                  <Link href={`/cursos/${featuredCourse.slug}`} className="ea-btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                    Inscribirme gratis al curso
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATÁLOGO DESTACADO DE CURSOS (Edutin ccard Grid) */}
      <section className="ea-catalog-section" id="cursos">
        <div className="shell">
          <div className="clp-row-head">
            <div>
              <h2>Explora nuestros cursos gratis</h2>
              <p className="clp-row-sub">Formación 100% online diseñada por expertos para que alcances tu máximo potencial.</p>
            </div>
            <Link href="/cursos" className="clp-row-link">
              Ver todos los cursos ({allCourses.length}) →
            </Link>
          </div>

          <div className="ea-courses-grid">
            {allCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. CERTIFICACIÓN OFICIAL BANNER */}
      <section className="ea-cert-banner-section">
        <div className="shell ea-cert-banner-inner">
          <div className="ea-cert-banner-text">
            <span className="ea-cert-pill">Certificación Oficial</span>
            <h2>Impulsa tu carrera con certificados reconocidos</h2>
            <p>
              Todos nuestros cursos incluyen la posibilidad de obtener un certificado de estudios con validez internacional, código único de registro y código QR validable en línea.
            </p>
            <ul className="ea-cert-benefits-list">
              <li>✓ Añádelo directamente a tu perfil de LinkedIn y CV impreso.</li>
              <li>✓ Verifica la autenticidad al instante desde cualquier lugar del mundo.</li>
              <li>✓ Avalado por horas académicas y proyectos prácticos verificados.</li>
            </ul>
            <div className="ea-cert-banner-actions">
              <Link href="/cursos" className="ea-btn-primary">
                Comenzar a aprender gratis
              </Link>
              <Link href="/verificar" className="button button-outline" style={{ background: '#fff' }}>
                Verificar un certificado
              </Link>
            </div>
          </div>

          <div className="ea-cert-banner-visual">
            <div className="clp-cert-mockup" style={{ maxWidth: '420px', margin: '0 auto' }}>
              <div className="clp-cert-mockup-inner" style={{ padding: '24px' }}>
                <div className="clp-cert-mockup-header">
                  <div className="clp-cert-mockup-logo">INTEVOPEDI ACADEMY</div>
                  <div className="clp-cert-mockup-code">CERTIFICADO OFICIAL</div>
                </div>
                <div className="clp-cert-mockup-body" style={{ margin: '18px 0' }}>
                  <p className="clp-cert-mockup-certifies">Certifica haber completado con honores:</p>
                  <h3 className="clp-cert-mockup-title" style={{ fontSize: '1.2rem' }}>Certificación en IA y Accesibilidad Digital</h3>
                  <p className="clp-cert-mockup-hours">40 horas certificables con validación QR</p>
                </div>
                <div className="clp-cert-mockup-footer">
                  <div className="clp-cert-mockup-seal">
                    <div className="clp-cert-seal-icon">★</div>
                    <span>VALIDEZ OFICIAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOBRE NOSOTROS & ÁREAS */}
      <section className="ea-about-section" id="sobre-nosotros">
        <div className="shell">
          <div className="clp-row-head text-center" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2>{aboutUs.title}</h2>
            <p className="clp-row-sub" style={{ maxWidth: '750px', margin: '0 auto' }}>{aboutUs.body}</p>
          </div>

          <div className="ea-areas-grid">
            {institutionalSections.map((sec) => (
              <div key={sec.title} className="ea-area-card">
                <h3>{sec.title}</h3>
                <p>{sec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
      <section className="ea-testimonials-section">
        <div className="shell">
          <div className="clp-row-head text-center" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2>Lo que dicen nuestros estudiantes</h2>
            <p className="clp-row-sub">Miles de personas han transformado su pasión y carrera con nuestros cursos.</p>
          </div>

          <div className="ea-testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="ea-testimonial-card">
                <div className="ea-testimonial-stars">★★★★★</div>
                <p className="ea-testimonial-quote">"{t.quote}"</p>
                <div className="ea-testimonial-author">
                  <strong>{t.author}</strong>
                  {t.course && <span>Estudiante de {t.course}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PREGUNTAS FRECUENTES */}
      <section className="clp-faq" style={{ padding: '60px 0' }}>
        <div className="shell">
          <div className="clp-row-head">
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="clp-faq-list">
            {faqItems.map((faq, idx) => (
              <details key={idx} className="clp-qtab" open={idx === 0}>
                <summary>{faq.question}</summary>
                <div className="clp-qtab-a">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
