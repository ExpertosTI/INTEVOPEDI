import Link from 'next/link';
import { ProgressBar } from '@/components/ProgressBar';
import { getFeaturedCourse } from '@/lib/data';
import {
  aboutUs,
  faqItems,
  heroMetrics,
  institutionalSections,
  mission,
  programHighlights,
  siteConfig,
  testimonials
} from '@/lib/site';
import { formatDateTime } from '@/lib/formatters';

export default async function HomePage() {
  const featuredCourse = await getFeaturedCourse();
  const enrolled = featuredCourse.enrollments?.length || 0;

  return (
    <>
      <section id="inicio" className="hero">
        <div className="shell hero-card hero-card-split">
          <div className="panel hero-main stack">
            <span className="eyebrow">Educación inclusiva en acción</span>
            <h1>Formación accesible con seguimiento académico y certificación verificable.</h1>
            <p>
              Inscríbete, avanza por módulos y obtén tu certificado con validación pública por código y QR.
            </p>
            <div className="hero-actions">
              <Link href={`/cursos/${featuredCourse.slug}`} className="button button-primary">
                Inscribirme ahora
              </Link>
              <Link href="/#curso" className="button button-secondary">
                Ver curso
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

          <div className="panel panel-contact stack">
            <span className="eyebrow">Contáctanos</span>
            <h2>¿Listo para empezar?</h2>
            <p>Escríbenos por WhatsApp para inscripciones, información del curso o apoyo del instituto.</p>
            <a href={siteConfig.contactPhoneHref} className="button button-whatsapp">
              WhatsApp {siteConfig.contactPhone}
            </a>
            <p className="helper">{siteConfig.address}</p>
          </div>
        </div>
      </section>

      <section id="curso" className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Curso destacado</span>
            <h2>{featuredCourse.title}</h2>
            <p>{featuredCourse.summary}</p>
          </div>

          <div className="hero-card hero-card-split">
            <article className="panel stack">
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
              <ProgressBar current={enrolled} total={featuredCourse.seats} label="Inscritos actuales" />
              <div className="inline-actions">
                <Link href={`/cursos/${featuredCourse.slug}`} className="button button-primary">
                  Inscribirme al curso
                </Link>
                <Link href="/verificar" className="button button-secondary">
                  Verificar certificado
                </Link>
              </div>
            </article>

            <article className="panel stack">
              <span className="eyebrow">Qué obtienes</span>
              <h3>Todo incluido en la experiencia</h3>
              <ul className="list">
                {programHighlights.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}.</strong> {item.description}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="sobre-nosotros" className="section">
        <div className="shell stack">
          <div className="section-heading">
            <h2>{aboutUs.title}</h2>
            <p>{aboutUs.body}</p>
          </div>
          <div className="card-grid">
            {institutionalSections.map((item) => (
              <article key={item.title} className="panel stack">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mision" className="section">
        <div className="shell stack">
          <article className="panel stack">
            <span className="eyebrow">Nuestra misión</span>
            <h2>{mission.title}</h2>
            <p>{mission.body}</p>
            <ul className="tag-list" aria-label="Valores institucionales">
              {mission.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </article>

          <div className="card-grid">
            {testimonials.map((item) => (
              <article key={item.author} className="panel quote-card">
                <blockquote>“{item.quote}”</blockquote>
                <strong>{item.author}</strong>
              </article>
            ))}
          </div>

          <div className="dashboard-grid">
            <article className="panel stack">
              <span className="eyebrow">Preguntas frecuentes</span>
              {faqItems.map((item) => (
                <div key={item.question} className="faq-item stack">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </article>

            <article className="panel panel-accent stack contact-cta">
              <span className="eyebrow">Hablemos</span>
              <h2>Da el siguiente paso hoy</h2>
              <p>Inscripciones abiertas. Contáctanos y te orientamos en minutos.</p>
              <div className="inline-actions">
                <a href={siteConfig.contactPhoneHref} className="button button-whatsapp">
                  WhatsApp {siteConfig.contactPhone}
                </a>
                <Link href={`/cursos/${featuredCourse.slug}`} className="button button-secondary">
                  Inscribirme
                </Link>
              </div>
              <p className="helper">
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
