import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toggleModuleProgress } from '@/app/actions';
import { StatusPill } from '@/components/StatusPill';
import { getEnrollmentByReference } from '@/lib/data';
import { formatDateTime, formatPercent } from '@/lib/formatters';
import { courseExperienceBySlug, getCourseResourceLibrary } from '@/lib/site';

export const metadata = {
  title: 'Mi inscripción | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default async function EnrollmentPage({ params, searchParams }) {
  const enrollment = await getEnrollmentByReference(params.code);

  if (!enrollment) {
    notFound();
  }

  const experience = courseExperienceBySlug[enrollment.course.slug];
  const resourceLibrary = getCourseResourceLibrary(enrollment.course.slug);

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        {searchParams?.created ? (
          <div className="banner banner-success" role="status" aria-live="polite">
            Tu inscripción fue registrada correctamente. Guarda este enlace o tu código <strong>{enrollment.referenceCode}</strong> para volver a tu panel.
          </div>
        ) : null}

        <div className="hero-card">
          <article className="panel panel-dark stack">
            <span className="eyebrow">Panel del participante</span>
            <h1>{enrollment.participant.fullName}</h1>
            <p>{enrollment.course.title}</p>
            <dl className="details-grid">
              <div>
                <dt>Código</dt>
                <dd>{enrollment.referenceCode}</dd>
              </div>
              <div>
                <dt>Inscrito el</dt>
                <dd>{formatDateTime(enrollment.createdAt)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd><StatusPill value={enrollment.status} /></dd>
              </div>
              <div>
                <dt>Pago</dt>
                <dd><StatusPill value={enrollment.paymentStatus} /></dd>
              </div>
              <div>
                <dt>Asistencia</dt>
                <dd>{formatPercent(enrollment.attendancePercent)}</dd>
              </div>
              <div>
                <dt>Progreso</dt>
                <dd>{formatPercent(enrollment.progressPercent)}</dd>
              </div>
            </dl>
            <div className="progress-line" aria-label={`Progreso actual ${enrollment.progressPercent}%`}>
              <span style={{ width: `${enrollment.progressPercent}%` }} />
            </div>
          </article>

          <aside className="panel stack">
            <span className="eyebrow">Certificación</span>
            <h2>Estado del certificado</h2>
            {enrollment.certificate ? (
              <>
                <p>Tu certificado ya está emitido y disponible para descarga y validación.</p>
                <div className="inline-actions">
                  <a href={`/api/certificados/${enrollment.certificate.certificateCode}/pdf`} className="button button-primary" target="_blank" rel="noreferrer">
                    Descargar PDF
                  </a>
                  <Link href={`/certificados/${enrollment.certificate.certificateCode}`} className="button button-secondary">
                    Ver validación
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p>
                  Completa los módulos del curso o espera la validación administrativa para que se emita tu certificado con QR.
                </p>
                <p className="helper">Cuando tu progreso llegue a 100%, el sistema generará el certificado automáticamente.</p>
              </>
            )}
            <div className="inline-actions">
              <Link href="/campus" className="button button-secondary">
                Volver a mi campus
              </Link>
            </div>
          </aside>
        </div>

        <article className="panel stack">
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">Progreso por módulos</span>
              <h2>Marca lo que ya completaste</h2>
            </div>
            <Link href={`/cursos/${enrollment.course.slug}`} className="button button-secondary">
              Ver curso
            </Link>
          </div>

          <div className="modules-grid">
            {enrollment.progress.map((item) => (
              <article key={item.id} className="panel module-card stack">
                <strong>Módulo {item.module.order}</strong>
                <h3>{item.module.title}</h3>
                <p>{item.module.description}</p>
                <p className="helper">Estado actual: {item.completed ? 'Completado' : 'Pendiente'}</p>
                <form action={toggleModuleProgress}>
                  <input type="hidden" name="enrollmentId" value={enrollment.id} />
                  <input type="hidden" name="moduleId" value={item.moduleId} />
                  <input type="hidden" name="referenceCode" value={enrollment.referenceCode} />
                  <input type="hidden" name="completed" value={item.completed ? 'false' : 'true'} />
                  <button type="submit" className={`button ${item.completed ? 'button-secondary' : 'button-primary'}`}>
                    {item.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                  </button>
                </form>
              </article>
            ))}
          </div>
        </article>

        {experience ? (
          <div className="dashboard-grid">
            <article className="panel stack">
              <span className="eyebrow">Materiales sugeridos</span>
              <h2>Recursos incluidos en este recorrido</h2>
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

            <article className="panel stack">
              <span className="eyebrow">Objetivos</span>
              <h2>Resultados de aprendizaje</h2>
              <ul className="list">
                {experience.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        ) : null}

        {resourceLibrary ? (
          <article className="panel stack">
            <div className="section-heading">
              <span className="eyebrow">Biblioteca del campus</span>
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
                        <strong>{item.title}</strong> · {item.access}
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
