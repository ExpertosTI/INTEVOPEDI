import { notFound } from 'next/navigation';
import { submitEnrollment } from '@/app/actions';
import { getCourseBySlug } from '@/lib/data';
import { formatDateTime } from '@/lib/formatters';
import { courseExperienceBySlug, getCourseResourceLibrary, getCourseResourceStats } from '@/lib/site';

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);

  return {
    title: course ? `${course.title} | INTEVOPEDI` : 'Curso | INTEVOPEDI'
  };
}

export default async function CourseDetailPage({ params, searchParams }) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const error = searchParams?.error;
  const experience = courseExperienceBySlug[course.slug];
  const resourceLibrary = getCourseResourceLibrary(course.slug);
  const resourceStats = getCourseResourceStats(course.slug);

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="hero-card">
          <article className="panel panel-dark stack">
            <span className="eyebrow">Curso en inscripción</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <dl className="details-grid">
              <div>
                <dt>Inicio</dt>
                <dd>{formatDateTime(course.startDate)}</dd>
              </div>
              <div>
                <dt>Modalidad</dt>
                <dd>{course.modality}</dd>
              </div>
              <div>
                <dt>Costo</dt>
                <dd>{course.priceLabel}</dd>
              </div>
              <div>
                <dt>Duración</dt>
                <dd>{course.duration}</dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>{course.location}</dd>
              </div>
              <div>
                <dt>Facilitación</dt>
                <dd>{course.instructor}</dd>
              </div>
            </dl>
            <div className="progress-line" aria-hidden="true">
              <span style={{ width: `${Math.min(100, Math.round(((course.enrollments?.length || 0) / (course.seats || 1)) * 100))}%` }} />
            </div>
            <p className="helper">
              {course.enrollments?.length || 0} persona(s) inscritas de {course.seats || 'cupos abiertos'}.
            </p>
            {resourceLibrary ? <p className="helper">Incluye {resourceStats.itemsCount} recursos organizados en {resourceStats.collectionsCount} colecciones.</p> : null}
          </article>

          <aside className="panel form-card stack">
            <span className="eyebrow">Inscripción inmediata</span>
            <h2>Reserva tu participación</h2>
            <p>
              Completa el formulario y recibirás un código de inscripción para entrar a tu campus, revisar avance, materiales y descargar tu certificado cuando corresponda.
            </p>
            {error ? <div className="banner banner-error">{error}</div> : null}
            <form action={submitEnrollment}>
              <input type="hidden" name="courseSlug" value={course.slug} />
              <div className="form-grid">
                <label>
                  Nombre completo
                  <input type="text" name="fullName" required placeholder="Tu nombre y apellido" />
                </label>
                <label>
                  Correo electrónico
                  <input type="email" name="email" required placeholder="nombre@correo.com" />
                </label>
                <label>
                  Teléfono
                  <input type="tel" name="phone" required placeholder="829 954 8873" />
                </label>
                <label>
                  Ciudad
                  <input type="text" name="city" placeholder="Santo Domingo" />
                </label>
                <label>
                  Organización o centro educativo
                  <input type="text" name="organization" placeholder="Institución, escuela o proyecto" />
                </label>
                <label>
                  Perfil o contexto de discapacidad visual
                  <input type="text" name="visualProfile" placeholder="Docente, familia, terapeuta, estudiante..." />
                </label>
              </div>
              <label>
                Necesidades o comentarios
                <textarea name="notes" placeholder="Comparte si necesitas apoyo adicional o ajustes de accesibilidad." />
              </label>
              <button type="submit" className="button button-primary">
                Inscribirme al curso
              </button>
            </form>
          </aside>
        </div>

        <div className="dashboard-grid">
          <article className="panel stack">
            <span className="eyebrow">Contenido</span>
            <h2>Ruta de aprendizaje</h2>
            <div className="modules-grid">
              {course.modules.map((moduleItem) => (
                <article key={moduleItem.id} className="panel module-card stack">
                  <strong>Módulo {moduleItem.order}</strong>
                  <h3>{moduleItem.title}</h3>
                  <p>{moduleItem.description}</p>
                  <p className="helper">Duración estimada: {moduleItem.durationMinutes} min</p>
                </article>
              ))}
            </div>
          </article>

          <article className="panel stack">
            <span className="eyebrow">Qué obtienes</span>
            <h2>Resultados esperados</h2>
            <ul className="list">
              {(experience?.outcomes || [
                'Metodología práctica para crear materiales educativos accesibles con IA.',
                'Framework simple para adaptar documentos, evaluaciones y guías de estudio.',
                'Seguimiento por módulos y panel de progreso.',
                'Certificado PDF con validación por QR al completar el proceso.',
                'Base lista para crecer con más cursos, pagos y analítica.'
              ]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        {experience ? (
          <div className="dashboard-grid">
            <article className="panel stack">
              <span className="eyebrow">Ideal para</span>
              <h2>Perfil de participantes</h2>
              <ul className="list">
                {experience.audience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="panel stack">
              <span className="eyebrow">Materiales incluidos</span>
              <h2>Recursos del recorrido</h2>
              <div className="card-grid compact-grid">
                {experience.materials.map((item) => (
                  <article key={item.title} className="panel stack stat-card">
                    <strong>{item.format}</strong>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        ) : null}

        {experience ? (
          <article className="panel stack">
            <span className="eyebrow">Hitos del campus</span>
            <h2>Cómo avanzar hasta tu certificación</h2>
            <ul className="list">
              {experience.milestones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ) : null}

        {resourceLibrary ? (
          <article className="panel stack">
            <div className="section-heading">
              <span className="eyebrow">Biblioteca del curso</span>
              <h2>{resourceLibrary.title}</h2>
              <p>{resourceLibrary.summary}</p>
            </div>
            <div className="card-grid">
              {resourceLibrary.collections.map((collection) => (
                <article key={collection.title} className="panel stack stat-card">
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <ul className="list compact-list">
                    {collection.items.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong> · {item.format}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
