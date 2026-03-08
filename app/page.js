import Link from 'next/link';
import { CourseCard } from '@/components/CourseCard';
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
            <span className="eyebrow">Nueva plataforma de formación</span>
            <h1>INTEVOPEDI ahora funciona como una app moderna de cursos accesibles.</h1>
            <p>
              Registra participantes, organiza la formación, sigue el avance del curso y emite certificados PDF con verificación pública por QR.
            </p>
            <div className="hero-actions">
              <Link href={`/cursos/${featuredCourse.slug}`} className="button button-primary">
                Inscribirme al curso destacado
              </Link>
              <Link href="/verificar" className="button button-secondary">
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
            <div className="progress-line" aria-hidden="true">
              <span style={{ width: `${Math.min(100, Math.round(((featuredCourse.enrollments?.length || 0) / (featuredCourse.seats || 1)) * 100))}%` }} />
            </div>
            <p className="helper">
              Inscritos actuales: <strong>{featuredCourse.enrollments?.length || 0}</strong> de {featuredCourse.seats || 'cupos abiertos'}.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Qué resuelve esta app</span>
            <h2>Una experiencia más fluida, profesional y útil para la operación académica.</h2>
            <p>
              Partimos de la web institucional y la convertimos en una plataforma lista para Git, despliegue por Portainer, control de inscripciones y trazabilidad del certificado.
            </p>
          </div>
          <div className="card-grid">
            {programHighlights.map((item) => (
              <article key={item.title} className="panel stat-card stack">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Curso inicial</span>
            <h2>IA como Apoyo a la Discapacidad Visual</h2>
            <p>
              Un curso práctico para docentes, familias, facilitadores y profesionales que quieren crear materiales educativos más accesibles con apoyo de IA.
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
        <div className="shell dashboard-grid">
          <div className="panel stack">
            <span className="eyebrow">Accesibilidad primero</span>
            <h2>Características pensadas para personas, no solo para pantallas.</h2>
            <ul className="list">
              {accessibilityFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="panel stack">
            <span className="eyebrow">Áreas institucionales</span>
            <h2>Secciones reforzadas para crecer el proyecto.</h2>
            <div className="stack">
              {institutionalSections.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">22 mejoras incluidas en el roadmap</span>
            <h2>La app queda preparada para seguir creciendo.</h2>
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
