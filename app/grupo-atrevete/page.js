import Image from 'next/image';
import Link from 'next/link';
import { grupoAtreveteHighlights, grupoAtreveteLinks, grupoAtreveteProfile, grupoAtreveteServices } from '@/lib/site';

export const metadata = {
  title: 'Grupo Atrévete | INTEVOPEDI'
};

export default function GrupoAtrevetePage() {
  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="hero-card">
          <article className="panel panel-dark stack">
            <span className="eyebrow">Portafolio artístico</span>
            <h1>{grupoAtreveteProfile.name}</h1>
            <p>{grupoAtreveteProfile.tagline}</p>
            <p>{grupoAtreveteProfile.description}</p>
            <div className="hero-actions">
              <a href={grupoAtreveteProfile.bookingHref} className="button button-primary" target="_blank" rel="noreferrer">
                Contactar por WhatsApp
              </a>
              <Link href="/" className="button button-secondary">
                Volver al instituto
              </Link>
            </div>
            <div className="metric-grid">
              {grupoAtreveteProfile.stats.map((item) => (
                <div key={item.label} className="metric-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="panel stack portfolio-hero-media">
            <Image
              src={grupoAtreveteProfile.heroImage}
              alt="Grupo Atrévete"
              width={900}
              height={700}
              className="portfolio-image"
              priority
            />
            <p className="helper">Mini página integrada dentro del ecosistema de INTEVOPEDI para visibilizar el proyecto artístico.</p>
          </aside>
        </div>

        <div className="dashboard-grid">
          <article className="panel stack">
            <span className="eyebrow">Propuesta</span>
            <h2>Qué presenta este portafolio</h2>
            <ul className="list">
              {grupoAtreveteHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="panel stack">
            <span className="eyebrow">Contacto</span>
            <h2>Contrataciones y difusión</h2>
            <p>
              Teléfono principal: <strong>{grupoAtreveteProfile.bookingPhone}</strong>
            </p>
            <p>
              Ubicación base: <strong>{grupoAtreveteProfile.location}</strong>
            </p>
            <a href={grupoAtreveteProfile.bookingHref} className="button button-secondary" target="_blank" rel="noreferrer">
              Solicitar información
            </a>
          </article>
        </div>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Servicios y participación</span>
            <h2>Cómo puede sumarse a tus actividades</h2>
          </div>
          <div className="card-grid">
            {grupoAtreveteServices.map((item) => (
              <article key={item.title} className="panel stack stat-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Redes y canales</span>
            <h2>Enlaces compartidos por el equipo</h2>
            <p>Se listan aquí para concentrar la presencia digital del grupo dentro de la página del instituto.</p>
          </div>
          <div className="social-grid">
            {grupoAtreveteLinks.map((item) => (
              <article key={item.href} className="panel stack social-card">
                <h3>{item.label}</h3>
                <p>{item.note}</p>
                <a href={item.href} target="_blank" rel="noreferrer" className="button button-primary">
                  Abrir enlace
                </a>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
