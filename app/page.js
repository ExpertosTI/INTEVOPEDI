import Link from 'next/link';
import { getFeaturedCourse } from '@/lib/data';
import { aboutUs, mission, siteConfig } from '@/lib/site';
import { formatDateTime } from '@/lib/formatters';

export default async function HomePage() {
  const featuredCourse = await getFeaturedCourse();

  return (
    <>
      <section id="inicio" className="hero">
        <div className="shell hero-card">
          <div className="panel panel-dark stack">
            <h1>{siteConfig.fullName}</h1>
            <p>{siteConfig.description}</p>
            <div className="hero-actions">
              <Link href="/#curso" className="button button-primary">
                Ver curso
              </Link>
              <a href={siteConfig.contactPhoneHref} className="button button-secondary button-dark">
                {siteConfig.contactPhone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="curso" className="section">
        <div className="shell">
          <div className="section-heading">
            <h2>Curso</h2>
          </div>
          <article className="panel stack">
            <h3>{featuredCourse.title}</h3>
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
            </dl>
            <div className="inline-actions">
              <Link href={`/cursos/${featuredCourse.slug}`} className="button button-primary">
                Inscribirme
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section id="sobre-nosotros" className="section">
        <div className="shell">
          <article className="panel stack">
            <h2>{aboutUs.title}</h2>
            <p>{aboutUs.body}</p>
          </article>
        </div>
      </section>

      <section id="mision" className="section">
        <div className="shell">
          <article className="panel stack">
            <h2>{mission.title}</h2>
            <p>{mission.body}</p>
            <p>
              Contacto:{' '}
              <a href={siteConfig.contactPhoneHref}>{siteConfig.contactPhone}</a>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
