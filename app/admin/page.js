import Link from 'next/link';
import { getAdminDashboardData } from '@/lib/data';
import { requireAdmin } from '@/lib/admin-auth';
import {
  updateEnrollmentAdmin,
  createCourseManualAction,
  updateCourseAction,
  deleteCourseAction,
  issueCertificateAction,
  addCourseResourceAdminAction,
  adminEnrollStudentAction
} from '@/app/actions';
import { formatDateTime } from '@/lib/formatters';
import { AdminFloatingAssistant } from '@/components/AdminFloatingAssistant';
import { AdminExportButton } from '@/components/AdminExportButton';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdminDashboardTabs } from '@/components/AdminDashboardTabs';
import { BookOpen, Users, Award, TrendingUp, Settings } from '@/components/Icons';

export const metadata = {
  title: 'Panel admin | INTEVOPEDI Academy',
  robots: { index: false, follow: false }
};

export default async function AdminPage({ searchParams }) {
  await requireAdmin();
  const { courses, enrollments, certificates } = await getAdminDashboardData();

  const totalEnrollments = enrollments.length;
  const totalCertificates = certificates.length;
  const pendingPayments = enrollments.filter((e) => e.paymentStatus === 'PENDING').length;
  const avgProgress = totalEnrollments > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / totalEnrollments)
    : 0;

  // Enrollment content panel for tabs
  const enrollmentsContent = (
    <div className="stack" style={{ gap: '20px' }}>
      {/* Inscribir Estudiante */}
      <article className="panel stack">
        <div className="section-heading">
          <span className="eyebrow">Asignar estudiante a curso</span>
          <h2>Inscribir estudiante manualmente</h2>
          <p>Registra a un estudiante por teléfono o cédula y asígnalo a cualquier curso activo.</p>
        </div>
        <form action={adminEnrollStudentAction} className="admin-create-form">
          <div className="form-row">
            <label>
              Identificador * (Teléfono o Cédula)
              <input type="text" name="identifier" required placeholder="Ej. 8299548373 o 40220649281" />
            </label>
            <label>
              Nombre completo
              <input type="text" name="fullName" placeholder="Requerido si es estudiante nuevo" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Curso *
              <select name="courseId" required>
                <option value="">-- Selecciona el curso --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Estado de pago
              <select name="paymentStatus" defaultValue="PENDING">
                <option value="PENDING">Pendiente</option>
                <option value="VERIFIED">Verificado / Beca</option>
                <option value="WAIVED">Exonerado</option>
              </select>
            </label>
          </div>
          <button type="submit" className="button button-primary">
            Inscribir estudiante
          </button>
        </form>
      </article>

      {/* Tabla de Inscripciones */}
      <article className="panel stack">
        <div className="row-between">
          <div className="section-heading">
            <span className="eyebrow">Inscripciones</span>
            <h2>Todos los estudiantes inscritos ({enrollments.length})</h2>
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
                    <span className="helper">{enrollment.participant.phone || enrollment.participant.email}</span>
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
                        Ver Certificado
                      </Link>
                    ) : '—'}
                  </td>
                  <td>
                    <form action={updateEnrollmentAdmin} className="admin-row-form">
                      <input type="hidden" name="enrollmentId" value={enrollment.id} />
                      <div className="admin-row-fields">
                        <select name="status" defaultValue={enrollment.status}>
                          <option value="PENDING_PAYMENT">Pendiente de pago</option>
                          <option value="CONFIRMED">Confirmado</option>
                          <option value="IN_PROGRESS">En progreso</option>
                          <option value="COMPLETED">Completado</option>
                        </select>
                        <select name="paymentStatus" defaultValue={enrollment.paymentStatus}>
                          <option value="PENDING">Pendiente</option>
                          <option value="VERIFIED">Verificado</option>
                          <option value="WAIVED">Exonerado</option>
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
    </div>
  );

  // Certificates content panel for tabs
  const certificatesContent = (
    <article className="panel stack">
      <div className="section-heading">
        <span className="eyebrow">Certificación Oficial</span>
        <h2>Certificados Emitidos ({certificates.length})</h2>
        <p>Certificados emitidos con código de verificación QR único y validez internacional.</p>
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Estudiante</th>
              <th>Fecha de Emisión</th>
              <th>Estado</th>
              <th>Verificación</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td><code>{cert.certificateCode}</code></td>
                <td><strong>{cert.participant?.fullName}</strong></td>
                <td>{formatDateTime(cert.issuedAt)}</td>
                <td>
                  <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>
                    ✓ Válido
                  </span>
                </td>
                <td>
                  <Link href={`/certificados/${cert.certificateCode}`} target="_blank" className="button button-secondary button-sm">
                    Ver diploma online
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );

  // Manual course form panel for tabs
  const manualFormContent = (
    <div className="stack" style={{ gap: '20px' }}>
      <article className="panel stack">
        <div className="section-heading">
          <span className="eyebrow">Crear curso</span>
          <h2>Formulario de creación rápida</h2>
          <p>Crea un nuevo curso en la base de datos.</p>
        </div>
        <form action={createCourseManualAction} className="admin-create-form">
          <div className="form-row">
            <label>
              Título *
              <input type="text" name="title" required placeholder="Ej. Curso de técnica vocal avanzada" />
            </label>
            <label>
              Instructor *
              <input type="text" name="instructor" required placeholder="Nombre del facilitador" />
            </label>
          </div>
          <label>
            Resumen *
            <input type="text" name="summary" required placeholder="Descripción breve del curso" />
          </label>
          <label>
            Descripción completa *
            <textarea name="description" required rows={3} placeholder="Descripción detallada del curso" />
          </label>
          <div className="form-row">
            <label>
              Modalidad *
              <select name="modality" required>
                <option value="Virtual">100% Virtual (asíncrono)</option>
                <option value="Zoom">Zoom en vivo</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </label>
            <label>
              Ubicación *
              <input type="text" name="location" required defaultValue="Campus Virtual INTEVOPEDI" />
            </label>
            <label>
              Duración *
              <input type="text" name="duration" required placeholder="Ej. 80 horas certificables" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Etiqueta de precio *
              <input type="text" name="priceLabel" required defaultValue="Gratis" />
            </label>
            <label>
              Fecha de inicio *
              <input type="datetime-local" name="startDate" required />
            </label>
            <label>
              Estado
              <select name="status">
                <option value="PUBLISHED">Publicado</option>
                <option value="DRAFT">Borrador</option>
                <option value="CLOSED">Cerrado</option>
              </select>
            </label>
          </div>
          <button type="submit" className="button button-primary">
            Crear curso
          </button>
        </form>
      </article>

      {/* Subida de recursos y archivos adjuntos */}
      {courses.map((course) => (
        <article key={course.id} id={`recursos-${course.id}`} className="panel stack">
          <span className="eyebrow">Recursos y descargas de {course.title}</span>
          <h3>Subir material o recurso</h3>
          <div className="dashboard-grid">
            <form action={addCourseResourceAdminAction} className="stack">
              <input type="hidden" name="courseId" value={course.id} />
              <label>
                Título del recurso web
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
                <input type="text" name="title" required placeholder="Ej. Guía de calentamiento vocal" />
              </label>
              <label>
                Archivo descargable (PDF, MP3, ZIP)
                <input type="file" name="resourceFile" required />
              </label>
              <label>
                Descripción
                <input type="text" name="description" placeholder="Opcional" />
              </label>
              <button type="submit" className="button button-secondary">Subir archivo</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section className="section spaced-page">
      <div className="shell stack" style={{ gap: '24px' }}>
        <Breadcrumb items={[{ label: 'Panel admin', href: '/admin' }]} />

        <div className="row-between" style={{ alignItems: 'flex-start' }}>
          <div className="stack" style={{ gap: '6px' }}>
            <span className="eyebrow">Centro de Control Académico</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#031b4e' }}>
              Panel de Administración INTEVOPEDI Academy
            </h1>
            <p className="helper" style={{ maxWidth: '680px' }}>
              Gestiona el catálogo de cursos, edita unidades y lecciones, vincula WhatsApp para notificaciones automáticas y administra inscripciones y certificados.
            </p>
          </div>

          <div className="inline-actions">
            <Link href="/admin/ajustes" className="button button-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Settings size={16} />
              <span>IA y ajustes</span>
            </Link>
          </div>
        </div>

        {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}
        {searchParams?.saved ? <div className="banner banner-success" role="status">{searchParams.saved}</div> : null}

        {/* METRICS ROW */}
        <div className="admin-stats">
          <div className="panel stat-card stack">
            <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} /> Cursos
            </span>
            <strong className="stat-value">{courses.length}</strong>
            <p className="helper">Cursos en catálogo</p>
          </div>
          <div className="panel stat-card stack">
            <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} /> Inscripciones
            </span>
            <strong className="stat-value">{totalEnrollments}</strong>
            <p className="helper">{pendingPayments} pendientes de pago</p>
          </div>
          <div className="panel stat-card stack">
            <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} /> Certificados
            </span>
            <strong className="stat-value">{totalCertificates}</strong>
            <p className="helper">Emitidos con QR</p>
          </div>
          <div className="panel stat-card stack">
            <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} /> Progreso
            </span>
            <strong className="stat-value">{avgProgress}%</strong>
            <p className="helper">Promedio general</p>
          </div>
        </div>

        {/* TABS CONTAINER: CURSOS Y CONTENIDO | WHATSAPP QR | INSCRIPCIONES | CERTIFICADOS */}
        <AdminDashboardTabs
          courses={courses}
          enrollmentsContent={enrollmentsContent}
          certificatesContent={certificatesContent}
          manualFormContent={manualFormContent}
        />

        <AdminFloatingAssistant courses={courses} />
      </div>
    </section>
  );
}
