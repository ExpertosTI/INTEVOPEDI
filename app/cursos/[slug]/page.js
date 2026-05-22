import { notFound } from 'next/navigation';
import { submitEnrollment } from '@/app/actions';
import { getCourseBySlug, getEnrollmentForParticipantAndCourse } from '@/lib/data';
import { getParticipantSession } from '@/lib/participant-auth';
import { formatDateTime } from '@/lib/formatters';
import { courseExperienceBySlug, getCourseResourceLibrary, getCourseResourceStats } from '@/lib/site';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LearningPath } from '@/components/LearningPath';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);

  return {
    title: course ? `${course.title} | INTEVOPEDI` : 'Curso | INTEVOPEDI'
  };
}

export default async function CourseDetailPage({ params, searchParams }) {
  const course = await getCourseBySlug(params.slug);
  const session = await getParticipantSession();
  let existingEnrollment = null;

  if (course && session?.participantId) {
    existingEnrollment = await getEnrollmentForParticipantAndCourse(session.participantId, course.id);
    console.log(`[DEBUG] CourseDetailPage: session found for ${session.participantId}, enrollment: ${existingEnrollment ? 'FOUND' : 'NOT FOUND'} for course ${course.id}`);
  } else {
    console.log(`[DEBUG] CourseDetailPage: no session or course found. Session: ${!!session}, Course: ${!!course}`);
  }

  if (!course) {
    notFound();
  }

  const error = searchParams?.error;
  const experience = courseExperienceBySlug[course.slug];
  const resourceLibrary = getCourseResourceLibrary(course.slug);
  const resourceStats = getCourseResourceStats(course.slug);
  const attachedResources = course.resources || [];
  const enrolledCount = course.enrollments?.length || 0;
  const hasSeatLimit = course.seats && course.seats > 0;
  const isFull = hasSeatLimit && enrolledCount >= course.seats;
  const fillPercent = hasSeatLimit ? Math.min(100, Math.round((enrolledCount / course.seats) * 100)) : 0;

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <Breadcrumb items={[
          { label: 'Cursos', href: '/cursos' },
          { label: course.title, href: `/cursos/${course.slug}` }
        ]} />

        <div className="hero-card">
          <article className="panel panel-dark stack">
            <span className="eyebrow">{isFull ? 'Cupos agotados' : 'Curso en inscripción'}</span>
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
              <span style={{ width: `${fillPercent}%` }} />
            </div>
            <p className="helper">
              {enrolledCount} persona(s) inscritas de {course.seats || 'cupos abiertos'}.
            </p>
            {resourceLibrary ? <p className="helper">Incluye {resourceStats.itemsCount} recursos organizados en {resourceStats.collectionsCount} colecciones.</p> : null}
            {attachedResources.length ? <p className="helper">Además tiene {attachedResources.length} recurso(s) adjunto(s).</p> : null}
          </article>

          <aside className="panel form-card stack" style={{ position: 'sticky', top: '84px', alignSelf: 'start' }}>
            {existingEnrollment ? (
              <div className="stack" style={{ gap: '1.5rem' }}>
                <div className="section-heading">
                  <span className="eyebrow" style={{ color: 'var(--accent-green)' }}>✓ Ya estás inscrito</span>
                  <h2>¡Bienvenido de vuelta!</h2>
                  <p>
                    Tienes todo listo para continuar tu formación en <strong>{course.title}</strong>.
                  </p>
                </div>
                
                <div className="panel panel-dark stack" style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div className="row-between">
                    <span className="helper">Tu progreso actual</span>
                    <strong style={{ color: 'var(--accent-green)' }}>{existingEnrollment.progressPercent}%</strong>
                  </div>
                  <div className="progress-line" style={{ margin: '8px 0' }}>
                    <span style={{ width: `${existingEnrollment.progressPercent}%`, backgroundColor: 'var(--accent-green)' }} />
                  </div>
                  <p className="helper">Sigue avanzando para obtener tu certificado.</p>
                </div>

                <div className="stack" style={{ gap: '12px' }}>
                  <a href={`/mi-inscripcion/${existingEnrollment.referenceCode}`} className="button button-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Ir a mi campus personal
                  </a>
                  <p className="helper text-center">
                    Accede a tus módulos, recursos y descarga tu certificado cuando finalices.
                  </p>
                </div>

                <div className="banner banner-info" style={{ fontSize: '0.85rem' }}>
                  💡 <strong>Tip:</strong> Revisa la pestaña de "Recursos" en tu campus para descargar materiales exclusivos de este curso.
                </div>
              </div>
            ) : (
              <>
                <span className="eyebrow">Inscripción inmediata</span>
                <h2>Reserva tu participación</h2>
                <p>
                  Completa el formulario y recibirás un código de inscripción para entrar a tu campus, revisar avance, materiales y descargar tu certificado cuando corresponda.
                </p>
                {error ? <div className="banner banner-error">{error}</div> : null}
                {isFull ? (
                  <div className="banner banner-error">Los cupos están agotados para este curso.</div>
                ) : (
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
                        <input type="tel" name="phone" required placeholder="829 954 8273" />
                      </label>
                    </div>
                    <button type="submit" className="button button-primary" style={{ marginTop: '1rem' }}>
                      Inscribirme y recibir código
                    </button>
                  </form>
                )}
              </>
            )}
          </aside>
        </div>

        <div className="dashboard-grid">
          <article className="panel stack">
            <span className="eyebrow">Contenido</span>
            <h2>Ruta de aprendizaje</h2>
            <LearningPath modulesProgress={course.modules} isPreview={true} />
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

        {attachedResources.length ? (
          <article className="panel stack">
            <div className="section-heading">
              <span className="eyebrow">Adjuntos del curso</span>
              <h2>Recursos publicados por administración</h2>
              <p>Estos recursos se cargan en el panel admin y quedan disponibles para participantes.</p>
            </div>
            <div className="card-grid compact-grid">
              {attachedResources.map((resource) => {
                const href = resource.type === 'LINK' ? resource.url : resource.filePath;
                return (
                  <article key={resource.id} className="panel stack stat-card">
                    <strong>{resource.type === 'FILE' ? '📁 Archivo' : '🔗 Enlace'}</strong>
                    <h3>{resource.title}</h3>
                    {resource.description ? <p>{resource.description}</p> : null}
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="button button-secondary">
                        Abrir recurso
                      </a>
                    ) : (
                      <p className="helper">Este recurso no tiene URL disponible.</p>
                    )}
                  </article>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
