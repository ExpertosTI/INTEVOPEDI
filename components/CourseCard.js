import Link from 'next/link';
import { getCourseResourceStats } from '@/lib/site';

const modalityIcons = {
  Zoom: '📹',
  Presencial: '🏫',
  Híbrido: '🔄',
  Virtual: '💻'
};

export function CourseCard({ course }) {
  const startDate = new Date(course.startDate);
  const resourceStats = getCourseResourceStats(course.slug);
  const icon = modalityIcons[course.modality] || '📚';
  const isOpen = course.status === 'PUBLISHED';
  const hasSeatLimit = course.seats && course.seats > 0;
  const enrolledCount = course.enrollments?.length || 0;
  const isFull = hasSeatLimit && enrolledCount >= course.seats;

  return (
    <article className="panel course-card">
      <div className="course-card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="course-card-modality">{icon} {course.modality}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`course-card-status ${isFull ? 'closed' : 'open'}`}>
            {isFull ? 'Lleno' : isOpen ? 'Abierto' : 'Cerrado'}
          </span>
          <span className="badge badge-gold">{course.priceLabel}</span>
        </div>
      </div>
      <h3>{course.title}</h3>
      <p>{course.summary}</p>
      <dl className="details-grid compact-details">
        <div>
          <dt>Fecha</dt>
          <dd>{startDate.toLocaleDateString('es-DO', { dateStyle: 'long' })}</dd>
        </div>
        <div>
          <dt>Duración</dt>
          <dd>{course.duration}</dd>
        </div>
        <div>
          <dt>Módulos</dt>
          <dd>{course.modules?.length || 0}</dd>
        </div>
        <div>
          <dt>Cupos</dt>
          <dd>{hasSeatLimit ? `${enrolledCount}/${course.seats}` : 'Abiertos'}</dd>
        </div>
        <div>
          <dt>Instructor</dt>
          <dd>{course.instructor}</dd>
        </div>
        <div>
          <dt>Recursos</dt>
          <dd>{resourceStats.itemsCount}</dd>
        </div>
      </dl>
      {hasSeatLimit && (
        <div className="progress-line" aria-hidden="true">
          <span style={{ width: `${Math.min(100, Math.round((enrolledCount / course.seats) * 100))}%` }} />
        </div>
      )}
      <Link href={`/cursos/${course.slug}`} className="button button-primary">
        Ver detalles e inscribirme
      </Link>
    </article>
  );
}
