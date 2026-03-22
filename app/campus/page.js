import Link from 'next/link';
import { redirect } from 'next/navigation';
import { participantLogout, claimCourseCertificate } from '@/app/actions';
import { StatusPill } from '@/components/StatusPill';
import { ProgressRing } from '@/components/ProgressRing';
import { Breadcrumb } from '@/components/Breadcrumb';
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
  const certificateIssued = searchParams?.certificateIssued;
  const latestSession = await getParticipantSession();

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <Breadcrumb items={[{ label: 'Campus', href: '/campus' }]} />

        {created ? (
          <div className="banner banner-success" role="status" aria-live="polite">
            Tu inscripción quedó registrada y tu campus ya está listo. Guarda tu código <strong>{searchParams?.code || latestSession?.referenceCode}</strong>.
          </div>
        ) : null}

        {certificateIssued ? (
          <div className="banner banner-success" role="status" aria-live="polite">
            🎉 ¡Certificado generado exitosamente! Descárgalo desde tu inscripción.
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
            <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{totalEnrollments}</strong>
            <p className="helper">Inscripciones vinculadas a tu perfil.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Completados</span>
            <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{completedEnrollments}</strong>
            <p className="helper">Recorridos ya cerrados.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Progreso promedio</span>
            <div className="progress-ring-wrap">
              <ProgressRing percent={averageProgress} />
              <div>
                <strong>{averageProgress}%</strong>
                <p className="helper">Avance global</p>
              </div>
            </div>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Correo</span>
            <strong style={{ fontSize: '0.95rem', fontWeight: 700, wordBreak: 'break-all' }}>{participant.email}</strong>
            <p className="helper">Cuenta usada para este acceso.</p>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="panel stack">
            <span className="eyebrow">Tu campus</span>
            <h2>Qué puedes hacer aquí</h2>
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
              const attachedResources = enrollment.course.resources || [];
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
                  <div className="progress-ring-wrap">
                    <ProgressRing percent={enrollment.progressPercent} size={48} />
                    <div>
                      <strong>{enrollment.progressPercent}%</strong>
                      <p className="helper">{completedModules} de {enrollment.course.modules.length} módulos</p>
                    </div>
                  </div>
                  {resourceLibrary ? <p className="helper">{resourceStats.itemsCount} recursos en {resourceStats.collectionsCount} colecciones.</p> : null}
                  {attachedResources.length ? <p className="helper">Recursos adjuntos: {attachedResources.length}.</p> : null}
                  {experience ? (
                    <ul className="list compact-list">
                      {experience.materials.slice(0, 2).map((item) => (
                        <li key={item.title}>{item.title}</li>
                      ))}
                    </ul>
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
                        📄 Certificado
                      </a>
                    ) : (
                      <form action={claimCourseCertificate}>
                        <input type="hidden" name="enrollmentId" value={enrollment.id} />
                        <button type="submit" className="button button-primary">
                          🎓 Obtener Certificado
                        </button>
                      </form>
                    )}
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
