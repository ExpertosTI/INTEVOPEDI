import Link from 'next/link';
import { courseResourceLibraryBySlug, getCourseResourceStats, resourceCards } from '@/lib/site';

export const metadata = {
  title: 'Recursos | INTEVOPEDI'
};

export default function ResourcesPage() {
  const libraries = Object.entries(courseResourceLibraryBySlug);

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="section-heading">
          <span className="eyebrow">Centro de recursos</span>
          <h1>Accesos clave del ecosistema INTEVOPEDI</h1>
          <p>
            Una capa de navegación más completa para que la plataforma se sienta más madura, estructurada y fácil de usar.
          </p>
        </div>

        <div className="card-grid">
          {resourceCards.map((item) => (
            <article key={item.href} className="panel stack stat-card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <Link href={item.href} className="button button-primary">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Biblioteca académica</span>
            <h2>Recursos por curso</h2>
            <p>Base inicial de materiales y activos de aprendizaje para hacer el campus más útil y continuo.</p>
          </div>

          <div className="card-grid">
            {libraries.map(([slug, library]) => {
              const stats = getCourseResourceStats(slug);

              return (
                <article key={slug} className="panel stack stat-card">
                  <div className="row-between">
                    <div className="stack">
                      <h3>{library.title}</h3>
                      <p className="helper">{stats.collectionsCount} colecciones · {stats.itemsCount} recursos</p>
                    </div>
                    <Link href={`/cursos/${slug}`} className="button button-secondary">
                      Ver curso
                    </Link>
                  </div>
                  <p>{library.summary}</p>
                  <div className="card-grid compact-grid">
                    {library.collections.map((collection) => (
                      <article key={collection.title} className="panel stack stat-card">
                        <h4>{collection.title}</h4>
                        <p>{collection.description}</p>
                        <p className="helper">{collection.items.length} recurso(s)</p>
                      </article>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
