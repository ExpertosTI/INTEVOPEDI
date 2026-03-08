import { adminLogout, issueCertificateAction, updateEnrollmentAdmin } from '@/app/actions';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminDashboardData } from '@/lib/data';
import { formatDateTime } from '@/lib/formatters';
import { getCourseResourceLibrary, getCourseResourceStats } from '@/lib/site';

export const metadata = {
  title: 'Panel admin | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage({ searchParams }) {
  await requireAdmin();
  const data = await getAdminDashboardData();

  const totalEnrollments = data.enrollments.length;
  const completed = data.enrollments.filter((item) => item.status === 'COMPLETED').length;
  const pending = data.enrollments.filter((item) => item.paymentStatus === 'PENDING').length;
  const verifiedPayments = data.enrollments.filter((item) => item.paymentStatus === 'VERIFIED').length;
  const zoomConfirmed = data.enrollments.filter((item) => item.zoomConfirmed).length;
  const averageProgress = totalEnrollments
    ? Math.round(data.enrollments.reduce((sum, item) => sum + item.progressPercent, 0) / totalEnrollments)
    : 0;
  const completionRate = totalEnrollments ? Math.round((completed / totalEnrollments) * 100) : 0;
  const courseHealth = data.courses.map((course) => {
    const courseEnrollments = data.enrollments.filter((item) => item.courseId === course.id);
    const courseCompleted = courseEnrollments.filter((item) => item.status === 'COMPLETED').length;
    const courseAverageProgress = courseEnrollments.length
      ? Math.round(courseEnrollments.reduce((sum, item) => sum + item.progressPercent, 0) / courseEnrollments.length)
      : 0;
    const resourceLibrary = getCourseResourceLibrary(course.slug);
    const resourceStats = getCourseResourceStats(course.slug);

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      enrollments: courseEnrollments.length,
      completed: courseCompleted,
      seats: course.seats,
      averageProgress: courseAverageProgress,
      resourceLibrary,
      resourceStats
    };
  });

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Backoffice</span>
            <h1>Panel administrativo</h1>
            <p>Gestiona cursos, inscripciones, pagos y certificados sin salir de la plataforma.</p>
          </div>
          <form action={adminLogout} className="inline-form">
            <button type="submit" className="button button-secondary">
              Cerrar sesión
            </button>
          </form>
        </div>

        {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}

        <div className="admin-stats">
          <article className="panel stack">
            <span className="eyebrow">Cursos</span>
            <h2>{data.courses.length}</h2>
            <p>Publicados actualmente en la plataforma.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Inscripciones</span>
            <h2>{totalEnrollments}</h2>
            <p>Registros acumulados.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Pendientes</span>
            <h2>{pending}</h2>
            <p>Con pago todavía no verificado.</p>
          </article>
          <article className="panel stack">
            <span className="eyebrow">Certificados</span>
            <h2>{data.certificates.length}</h2>
            <p>{completed} inscripción(es) marcadas como completadas.</p>
          </article>
        </div>

        <div className="card-grid compact-grid">
          <article className="panel stack stat-card">
            <span className="eyebrow">Conversión</span>
            <h2>{completionRate}%</h2>
            <p>Proporción de inscripciones completadas.</p>
          </article>
          <article className="panel stack stat-card">
            <span className="eyebrow">Pagos verificados</span>
            <h2>{verifiedPayments}</h2>
            <p>Inscripciones con pago ya validado.</p>
          </article>
          <article className="panel stack stat-card">
            <span className="eyebrow">Zoom confirmado</span>
            <h2>{zoomConfirmed}</h2>
            <p>Participantes listos para la sesión en vivo.</p>
          </article>
          <article className="panel stack stat-card">
            <span className="eyebrow">Progreso promedio</span>
            <h2>{averageProgress}%</h2>
            <p>Avance global del campus académico.</p>
          </article>
        </div>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Salud de cursos</span>
            <h2>Lectura rápida de la operación</h2>
            <p>Vista resumida por curso para decidir seguimiento, cupos y certificación.</p>
          </div>
          <div className="card-grid compact-grid">
            {courseHealth.map((course) => (
              <article key={course.id} className="panel stack stat-card">
                <h3>{course.title}</h3>
                <p><strong>Inscritos:</strong> {course.enrollments}</p>
                <p><strong>Completados:</strong> {course.completed}</p>
                <p><strong>Progreso promedio:</strong> {course.averageProgress}%</p>
                <p><strong>Cupos:</strong> {course.seats || 'Abiertos'}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Biblioteca académica</span>
            <h2>Inventario de recursos por curso</h2>
            <p>Control visual de la base de materiales para hacer el campus más útil y escalable.</p>
          </div>
          <div className="card-grid compact-grid">
            {courseHealth.map((course) => (
              <article key={`${course.id}-resources`} className="panel stack stat-card">
                <h3>{course.title}</h3>
                {course.resourceLibrary ? (
                  <>
                    <p><strong>Colecciones:</strong> {course.resourceStats.collectionsCount}</p>
                    <p><strong>Recursos:</strong> {course.resourceStats.itemsCount}</p>
                    <ul className="list compact-list">
                      {course.resourceLibrary.collections.map((collection) => (
                        <li key={collection.title}>{collection.title}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="helper">Este curso todavía no tiene biblioteca configurada.</p>
                )}
              </article>
            ))}
          </div>
        </article>

        <article className="panel stack admin-card">
          <div className="section-heading">
            <span className="eyebrow">Inscripciones</span>
            <h2>Operación académica</h2>
            <p>Actualiza estados, asistencia y emisión de certificados.</p>
          </div>
          {data.enrollments.length === 0 ? (
            <div className="banner banner-error">Aún no hay inscripciones registradas en la base de datos.</div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <caption className="sr-only">Listado de inscripciones con controles administrativos para estado, pago, asistencia y certificación.</caption>
                <thead>
                  <tr>
                    <th scope="col">Participante</th>
                    <th scope="col">Curso</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Pago</th>
                    <th scope="col">Progreso</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.enrollments.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.participant.fullName}</strong>
                        <p>{item.participant.email}</p>
                        <p>{item.referenceCode}</p>
                      </td>
                      <td>
                        <strong>{item.course.title}</strong>
                        <p>{formatDateTime(item.createdAt)}</p>
                      </td>
                      <td colSpan={4}>
                        <div className="admin-row-form">
                          <form action={updateEnrollmentAdmin}>
                            <input type="hidden" name="enrollmentId" value={item.id} />
                            <div className="admin-row-fields">
                              <label>
                                Estado
                                <select name="status" defaultValue={item.status}>
                                  <option value="PENDING_PAYMENT">Pendiente de pago</option>
                                  <option value="CONFIRMED">Confirmado</option>
                                  <option value="IN_PROGRESS">En progreso</option>
                                  <option value="COMPLETED">Completado</option>
                                </select>
                              </label>
                              <label>
                                Pago
                                <select name="paymentStatus" defaultValue={item.paymentStatus}>
                                  <option value="PENDING">Pendiente</option>
                                  <option value="VERIFIED">Verificado</option>
                                  <option value="WAIVED">Exonerado</option>
                                </select>
                              </label>
                              <label>
                                Asistencia
                                <input type="number" name="attendancePercent" min="0" max="100" defaultValue={item.attendancePercent} />
                              </label>
                              <label>
                                Zoom confirmado
                                <input type="checkbox" name="zoomConfirmed" defaultChecked={item.zoomConfirmed} />
                              </label>
                            </div>
                            <div className="inline-actions">
                              <button type="submit" className="button button-primary">
                                Guardar cambios
                              </button>
                              {!item.certificate ? (
                                <button type="submit" formAction={issueCertificateAction} name="enrollmentId" value={item.id} className="button button-secondary">
                                  Emitir certificado
                                </button>
                              ) : (
                                <a href={`/api/certificados/${item.certificate.certificateCode}/pdf`} target="_blank" rel="noreferrer" className="button button-secondary">
                                  Descargar certificado
                                </a>
                              )}
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Certificados recientes</span>
            <h2>Historial emitido</h2>
          </div>
          {data.certificates.length === 0 ? (
            <p className="helper">Todavía no se han emitido certificados.</p>
          ) : (
            <div className="card-grid">
              {data.certificates.slice(0, 6).map((item) => (
                <article key={item.id} className="panel stack">
                  <h3>{item.participant.fullName}</h3>
                  <p>{item.enrollment.course.title}</p>
                  <p className="helper">{item.certificateCode}</p>
                  <div className="inline-actions">
                    <a href={`/api/certificados/${item.certificateCode}/pdf`} target="_blank" rel="noreferrer" className="button button-primary">
                      PDF
                    </a>
                    <a href={`/certificados/${item.certificateCode}`} className="button button-secondary">
                      Validación
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
