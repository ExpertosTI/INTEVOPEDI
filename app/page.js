import Link from 'next/link';
import { CourseCard } from '@/components/CourseCard';
import { ProgressBar } from '@/components/ProgressBar';
import { getFeaturedCourse, getPublishedCourses } from '@/lib/data';
import {
  accessibilityFeatures,
  faqItems,
  grupoAtreveteProfile,
  heroMetrics,
  institutionalSections,
  programHighlights,
  roadmapImprovements,
  siteConfig,
  testimonials
} from '@/lib/site';
import { formatDateTime } from '@/lib/formatters';

export default async function HomePage() {
  const [featuredCourse, courses] = await Promise.all([getFeaturedCourse(), getPublishedCourses()]);

  return (
    <>
      <section className="hero">
        <div className="shell hero-card">
          <div className="panel panel-dark stack">
            <span className="eyebrow">Educación inclusiva en acción</span>
            <h1>Formación accesible con seguimiento académico y certificación verificable.</h1>
            <p>
              Inscríbete, avanza por módulos y obtén tu certificado con validación pública por código y QR, en una experiencia clara desde móvil y escritorio.
            </p>
            <div className="hero-actions">
              <Link href={`/cursos/${featuredCourse.slug}`} className="button button-primary">
                Inscribirme al curso destacado
              </Link>
              <Link href="/verificar" className="button button-secondary button-dark">
                Verificar certificado
              </Link>
            </div>
            <div className="metric-grid">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel stack">
            <span className="eyebrow">Curso destacado</span>
            <h2>{featuredCourse.title}</h2>
            <p>{featuredCourse.summary}</p>
            <dl className="details-grid">
              <div>
                <dt>Fecha</dt>
                <dd>{formatDateTime(featuredCourse.startDate)}</dd>
              </div>
              <div>
                <dt>Modalidad</dt>
                <dd>{featuredCourse.modality}</dd>
              </div>
              <div>
                <dt>Costo</dt>
                <dd>{featuredCourse.priceLabel}</dd>
              </div>
              <div>
                <dt>Duración</dt>
                <dd>{featuredCourse.duration}</dd>
              </div>
              <div>
                <dt>Facilitación</dt>
                <dd>{featuredCourse.instructor}</dd>
              </div>
              <div>
                <dt>Cupos</dt>
                <dd>{featuredCourse.seats}</dd>
              </div>
            </dl>
            <ProgressBar
              current={featuredCourse.enrollments?.length || 0}
              total={featuredCourse.seats}
              label="Inscritos actuales"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Catálogo de formación 2026</span>
            <h2>Cursos diseñados para el impacto real.</h2>
            <p>
              Oferta académica actualizada con enfoque en competencias digitales, accesibilidad y empleabilidad.
            </p>
          </div>
          <div className="card-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Evolución tecnológica continua</span>
            <h2>Una plataforma viva que crece contigo.</h2>
            <p>
              Hemos integrado nuevas capacidades para ofrecer una experiencia educativa de clase mundial.
            </p>
          </div>
          <div className="improvements-grid">
            {roadmapImprovements.map((item) => (
              <article key={item} className="panel improvement-card">
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell card-grid">
          {testimonials.map((item) => (
            <article key={item.author} className="panel quote-card">
              <blockquote>“{item.quote}”</blockquote>
              <strong>{item.author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell dashboard-grid">
          <article className="panel panel-dark stack">
            <span className="eyebrow">Proyecto destacado</span>
            <h2>{grupoAtreveteProfile.name}</h2>
            <p>{grupoAtreveteProfile.tagline}</p>
            <p>{grupoAtreveteProfile.summary}</p>
            <div className="inline-actions">
              <Link href="/grupo-atrevete" className="button button-primary">
                Ver mini página
              </Link>
              <a href={grupoAtreveteProfile.bookingHref} className="button button-secondary" target="_blank" rel="noreferrer">
                Contactar proyecto
              </a>
            </div>
          </article>

          <article className="panel stack">
            <span className="eyebrow">Por qué incluirlo</span>
            <h2>Arte, inclusión y visibilidad dentro del mismo ecosistema digital.</h2>
            <ul className="list">
              <li>Concentra la presencia artística del grupo sin salir del portal institucional.</li>
              <li>Facilita difusión, contacto y contratación desde una ruta propia.</li>
              <li>Refuerza la identidad inclusiva del instituto con un caso visible y vivo.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell dashboard-grid">
          <div className="panel stack verify-card">
            <span className="eyebrow">Verificación</span>
            <h2>Certificados con QR y validación pública.</h2>
            <p>
              Al completar el curso, el participante obtiene un PDF descargable con código único y verificación en línea.
            </p>
            <div className="inline-actions">
              <Link href="/verificar" className="button button-primary">
                Verificar certificado
              </Link>
              <a href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer" className="button button-secondary">
                Ver repositorio
              </a>
            </div>
          </div>
          <div className="panel stack">
            <span className="eyebrow">Preguntas frecuentes</span>
            {faqItems.map((item) => (
              <article key={item.question} className="faq-item stack">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
