import Link from 'next/link';
import { redirect } from 'next/navigation';
import { participantLogout } from '@/app/actions';
import { StatusPill } from '@/components/StatusPill';
import { getParticipantSession, requireParticipantAuth } from '@/lib/participant-auth';
import { getParticipantCampusData } from '@/lib/data';
import { courseExperienceBySlug, getCourseResourceLibrary, getCourseResourceStats, participantCampusSections } from '@/lib/site';

export const metadata = {
  title: 'Campus del participante | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default async function CampusPage({ searchParams }) {
  const session = await requireParticipantAuth();
  const participant = await getParticipantCampusData(session.participantId);

  if (!participant) {
    redirect('/participantes?error=' + encodeURIComponent('Tu sesión ya no está disponible. Vuelve a iniciar acceso.'));
  }

  const totalEnrollments = participant.enrollments.length;
  const completedEnrollments = participant.enrollments.filter((item) => item.status === 'COMPLETED').length;
  const averageProgress = totalEnrollments
    ? Math.round(participant.enrollments.reduce((sum, item) => sum + item.progressPercent, 0) / totalEnrollments)
    : 0;
  const created = searchParams?.created;
  const latestSession = await getParticipantSession();

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        {created ? (
          <div className="banner banner-success" role="status" aria-live="polite">
            Tu inscripción quedó registrada y tu campus ya está listo. Guarda tu código <strong>{searchParams?.code || latestSession?.referenceCode}</strong>.
          </div>
        ) : null}

        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Campus privado</span>
            <h1>{participant.fullName}</h1>
            <p>Desde aquí puedes retomar tus cursos, revisar progreso y acceder a tus certificados cuando correspondan.</p>
          </div>
          <div className="inline-actions">
            <Link href="/perfil" className="button button-secondary">
              Actualizar datos para certificado
            </Link>
            <form action={participantLogout} className="inline-form">
              <button type="submit" className="button button-secondary">
                Cerrar acceso
              </button>
            </form>
          </div>
        </div>

        {searchParams?.profileUpdated ? (
          <div className="banner banner-success" role="status" aria-live="polite">
            Tus datos han sido actualizados correctamente.
          </div>
        ) : null}

        <div className="admin-stats">
          <article className="panel stack">
            <span className="eyebrow">Cursos</span>
            <h2>{totalEnrollments}</h2>
            <p>Inscripciones vinculadas a tu perfil.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Completados</span>
            <h2>{completedEnrollments}</h2>
            <p>Recorridos ya cerrados.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Progreso promedio</span>
            <h2>{averageProgress}%</h2>
            <p>Avance global de tu campus.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Correo</span>
            <h2>{participant.email}</h2>
            <p>Cuenta usada para este acceso.</p>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="panel stack">
            <span className="eyebrow">Experiencia Fase 2</span>
            <h2>Qué puedes hacer en tu campus</h2>
            <ul className="list">
              {participantCampusSections.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Siguiente paso</span>
            <h2>Continúa tu formación</h2>
            <p>Abre cualquiera de tus inscripciones para marcar módulos, revisar materiales y validar tu estado.</p>
            <div className="inline-actions">
              <Link href="/cursos" className="button button-secondary">
                Explorar cursos
              </Link>
              <Link href="/verificar" className="button button-secondary">
                Verificar certificado
              </Link>
            </div>
          </article>
        </div>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Mis cursos</span>
            <h2>Inscripciones activas y finalizadas</h2>
          </div>
          <div className="card-grid">
            {participant.enrollments.map((enrollment) => {
              const experience = courseExperienceBySlug[enrollment.course.slug];
              const resourceLibrary = getCourseResourceLibrary(enrollment.course.slug);
              const resourceStats = getCourseResourceStats(enrollment.course.slug);
              const completedModules = enrollment.progress.filter((item) => item.completed).length;

              return (
                <article key={enrollment.id} className="panel stack stat-card">
                  <div className="row-between">
                    <div className="stack">
                      <h3>{enrollment.course.title}</h3>
                      <p className="helper">Código: {enrollment.referenceCode}</p>
                    </div>
                    <StatusPill value={enrollment.status} />
                  </div>
                  <p>{enrollment.course.summary}</p>
                  <div className="progress-line" aria-hidden="true">
                    <span style={{ width: `${enrollment.progressPercent}%` }} />
                  </div>
                  <p className="helper">{completedModules} de {enrollment.course.modules.length} módulos completados.</p>
                  {resourceLibrary ? <p className="helper">{resourceStats.itemsCount} recursos organizados en {resourceStats.collectionsCount} colecciones.</p> : null}
                  {experience ? (
                    <ul className="list compact-list">
                      {experience.materials.slice(0, 2).map((item) => (
                        <li key={item.title}>{item.title}</li>
                      ))}
                    </ul>
                  ) : null}
                  {resourceLibrary ? (
                    <div className="card-grid compact-grid">
                      {resourceLibrary.collections.slice(0, 2).map((collection) => (
                        <article key={collection.title} className="panel stack stat-card">
                          <h4>{collection.title}</h4>
                          <p className="helper">{collection.items.length} recurso(s)</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                  <div className="inline-actions">
                    <Link href={`/mi-inscripcion/${enrollment.referenceCode}`} className="button button-primary">
                      Abrir panel
                    </Link>
                    <Link href={`/cursos/${enrollment.course.slug}`} className="button button-secondary">
                      Ver curso
                    </Link>
                    {enrollment.certificate ? (
                      <a href={`/api/certificados/${enrollment.certificate.certificateCode}/pdf`} target="_blank" rel="noreferrer" className="button button-secondary">
                        Certificado
                      </a>
                    ) : null}
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
