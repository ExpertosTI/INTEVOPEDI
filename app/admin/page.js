import Link from 'next/link';
import { getAdminDashboardData } from '@/lib/data';
import { requireAdmin } from '@/lib/admin-auth';
import {
  updateEnrollmentAdmin,
  createCourseManualAction,
  updateCourseAction,
  deleteCourseAction,
  issueCertificateAction,
  addCourseResourceAdminAction
} from '@/app/actions';
import { formatDateTime } from '@/lib/formatters';
import { AdminFloatingAssistant } from '@/components/AdminFloatingAssistant';
import { AdminExportButton } from '@/components/AdminExportButton';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: 'Panel admin | INTEVOPEDI',
  robots: { index: false, follow: false }
};

export default async function AdminPage({ searchParams }) {
  await requireAdmin();
  const { courses, enrollments, certificates } = await getAdminDashboardData();

  const totalEnrollments = enrollments.length;
  const totalCertificates = certificates.length;
  const pendingPayments = enrollments.filter((e) => e.paymentStatus === 'PENDING_PAYMENT').length;
  const confirmedPayments = enrollments.filter((e) => ['CONFIRMED', 'COMPLETED'].includes(e.paymentStatus)).length;
  const avgProgress = totalEnrollments > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / totalEnrollments)
    : 0;

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <Breadcrumb items={[{ label: 'Panel admin', href: '/admin' }]} />

        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Administración</span>
            <h1>Panel admin INTEVOPEDI</h1>
            <p>Gestiona cursos, inscripciones, certificados y recursos.</p>
          </div>
          <div className="inline-actions">
            <Link href="/admin/ajustes" className="button button-secondary">
              IA y ajustes
            </Link>
          </div>
        </div>

        {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}
        {searchParams?.saved ? <div className="banner banner-success" role="status">{searchParams.saved}</div> : null}

        <div className="admin-stats">
          <div className="panel stat-card stack">
            <span className="eyebrow">Cursos</span>
            <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{courses.length}</strong>
            <p className="helper">Cursos creados</p>
          </div>
          <div className="panel stat-card stack">
            <span className="eyebrow">Inscripciones</span>
            <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{totalEnrollments}</strong>
            <p className="helper">{pendingPayments} pendientes de pago</p>
          </div>
          <div className="panel stat-card stack">
            <span className="eyebrow">Certificados</span>
            <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{totalCertificates}</strong>
            <p className="helper">Emitidos</p>
          </div>
          <div className="panel stat-card stack">
            <span className="eyebrow">Progreso</span>
            <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{avgProgress}%</strong>
            <p className="helper">Promedio general</p>
          </div>
        </div>

        {/* --- Crear Curso Manual --- */}
        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Crear curso</span>
            <h2>Formulario de creación manual</h2>
            <p>Crea un nuevo curso sin necesidad del asistente IA. Todos los campos marcados son obligatorios.</p>
          </div>
          <form action={createCourseManualAction} className="admin-create-form">
            <div className="form-row">
              <label>
                Título *
                <input type="text" name="title" required placeholder="Ej. IA y Accesibilidad Visual" />
              </label>
              <label>
                Instructor *
                <input type="text" name="instructor" required placeholder="Nombre del facilitador" />
              </label>
            </div>
            <label>
              Resumen *
              <input type="text" name="summary" required placeholder="Descripción breve del curso (máx 500 caracteres)" />
            </label>
            <label>
              Descripción completa *
              <textarea name="description" required rows={3} placeholder="Descripción detallada del curso (mín 20 caracteres)" />
            </label>
            <div className="form-row">
              <label>
                Modalidad *
                <select name="modality" required>
                  <option value="Zoom">Zoom</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Virtual">Virtual (asíncrono)</option>
                </select>
              </label>
              <label>
                Ubicación *
                <input type="text" name="location" required placeholder="Zoom / Dirección física" />
              </label>
              <label>
                Duración *
                <input type="text" name="duration" required placeholder="Ej. 4 horas en vivo" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Precio (centavos)
                <input type="number" name="priceCents" defaultValue="0" min="0" />
              </label>
              <label>
                Etiqueta de precio *
                <input type="text" name="priceLabel" required placeholder="Ej. RD$ 500 o Gratis" />
              </label>
              <label>
                Cupos
                <input type="number" name="seats" placeholder="Dejar vacío = ilimitado" min="0" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Fecha de inicio *
                <input type="datetime-local" name="startDate" required />
              </label>
              <label>
                Fecha de fin
                <input type="datetime-local" name="endDate" />
              </label>
              <label>
                Estado
                <select name="status">
                  <option value="DRAFT">Borrador</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="CLOSED">Cerrado</option>
                </select>
              </label>
            </div>
            <button type="submit" className="button button-primary">
              Crear curso
            </button>
          </form>
        </article>

        {/* --- Salud de Cursos --- */}
        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Gestión</span>
            <h2>Cursos registrados</h2>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Estado</th>
                  <th>Inscritos</th>
                  <th>Módulos</th>
                  <th>Recursos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong>{course.title}</strong>
                      <br />
                      <span className="helper">{course.slug}</span>
                    </td>
                    <td>
                      <form action={updateCourseAction} className="inline-form">
                        <input type="hidden" name="courseId" value={course.id} />
                        <select name="status" defaultValue={course.status} onChange={(e) => e.target.form.requestSubmit()}>
                          <option value="DRAFT">Borrador</option>
                          <option value="PUBLISHED">Publicado</option>
                          <option value="CLOSED">Cerrado</option>
                        </select>
                      </form>
                    </td>
                    <td>{course.enrollments?.length || 0}{course.seats ? ` / ${course.seats}` : ''}</td>
                    <td>{course.modules?.length || 0}</td>
                    <td>{course.resources?.length || 0}</td>
                    <td>
                      <div className="inline-actions" style={{ gap: '4px' }}>
                        <Link href={`/cursos/${course.slug}`} className="button button-ghost" style={{ padding: '0 8px', height: '32px', fontSize: '0.78rem' }}>
                          Ver
                        </Link>
                        <form action={deleteCourseAction} className="inline-form">
                          <input type="hidden" name="courseId" value={course.id} />
                          <button type="submit" className="button button-ghost" style={{ padding: '0 8px', height: '32px', fontSize: '0.78rem', color: 'var(--accent-red)' }}>
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* --- Inscripciones --- */}
        <article className="panel stack">
          <div className="row-between">
            <div className="section-heading">
              <span className="eyebrow">Inscripciones</span>
              <h2>Todos los inscritos</h2>
            </div>
            <AdminExportButton />
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Participante</th>
                  <th>Curso</th>
                  <th>Estado</th>
                  <th>Pago</th>
                  <th>Progreso</th>
                  <th>Código</th>
                  <th>Certificado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>
                      <strong>{enrollment.participant.fullName}</strong>
                      <br />
                      <span className="helper">{enrollment.participant.email}</span>
                    </td>
                    <td>{enrollment.course.title}</td>
                    <td>
                      <span className={`badge badge-${enrollment.status.toLowerCase()}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${enrollment.paymentStatus.toLowerCase()}`}>
                        {enrollment.paymentStatus}
                      </span>
                    </td>
                    <td>{enrollment.progressPercent}%</td>
                    <td><code>{enrollment.referenceCode}</code></td>
                    <td>
                      {enrollment.certificate ? (
                        <Link href={`/certificados/${enrollment.certificate.certificateCode}`} className="badge badge-completed">
                          Ver
                        </Link>
                      ) : '—'}
                    </td>
                    <td>
                      <form action={updateEnrollmentAdmin} className="admin-row-form">
                        <input type="hidden" name="enrollmentId" value={enrollment.id} />
                        <div className="admin-row-fields">
                          <select name="status" defaultValue={enrollment.status}>
                            <option value="PENDING">Pendiente</option>
                            <option value="CONFIRMED">Confirmado</option>
                            <option value="IN_PROGRESS">En progreso</option>
                            <option value="COMPLETED">Completado</option>
                          </select>
                          <select name="paymentStatus" defaultValue={enrollment.paymentStatus}>
                            <option value="PENDING_PAYMENT">Pendiente</option>
                            <option value="CONFIRMED">Confirmado</option>
                            <option value="WAIVED">Exonerado</option>
                          </select>
                          <select name="attended" defaultValue={String(enrollment.attended)}>
                            <option value="false">No asistió</option>
                            <option value="true">Asistió</option>
                          </select>
                          <button type="submit" className="button button-primary" style={{ height: '36px', fontSize: '0.8rem' }}>
                            Guardar
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* --- Recursos --- */}
        {courses.map((course) => (
          <article key={course.id} className="panel stack">
            <span className="eyebrow">Recursos de {course.title}</span>
            <h3>Agregar recurso</h3>
            <div className="dashboard-grid">
              <form action={addCourseResourceAdminAction} className="stack">
                <input type="hidden" name="courseId" value={course.id} />
                <label>
                  Título del enlace
                  <input type="text" name="title" required placeholder="Nombre del recurso" />
                </label>
                <label>
                  URL
                  <input type="url" name="resourceUrl" required placeholder="https://..." />
                </label>
                <label>
                  Descripción
                  <input type="text" name="description" placeholder="Opcional" />
                </label>
                <button type="submit" className="button button-secondary">Agregar enlace</button>
              </form>
              <form action={addCourseResourceAdminAction} className="stack" encType="multipart/form-data">
                <input type="hidden" name="courseId" value={course.id} />
                <label>
                  Título del archivo
                  <input type="text" name="title" required placeholder="Nombre del archivo" />
                </label>
                <label>
                  Archivo
                  <input type="file" name="resourceFile" required />
                </label>
                <label>
                  Descripción
                  <input type="text" name="description" placeholder="Opcional" />
                </label>
                <button type="submit" className="button button-secondary">Subir archivo</button>
              </form>
            </div>
            {course.resources?.length ? (
              <ul className="list compact-list">
                {course.resources.map((r) => (
                  <li key={r.id}>
                    <strong>{r.title}</strong> — {r.type === 'LINK' ? (
                      <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
                    ) : r.filePath || 'Archivo adjunto'}
                  </li>
                ))}
              </ul>
            ) : <p className="helper">Sin recursos aún.</p>}
          </article>
        ))}

        <AdminFloatingAssistant courses={courses} />
      </div>
    </section>
  );
}
