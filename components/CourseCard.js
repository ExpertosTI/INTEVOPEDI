import Link from 'next/link';
import { getCourseResourceStats } from '@/lib/site';

export function CourseCard({ course }) {
  const startDate = new Date(course.startDate);
  const resourceStats = getCourseResourceStats(course.slug);

  return (
    <article className="panel course-card">
      <div className="course-card-top">
        <span className="eyebrow">{course.modality}</span>
        <span className="badge badge-gold">{course.priceLabel}</span>
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
          <dd>{course.seats || 'Abiertos'}</dd>
        </div>
        <div>
          <dt>Recursos</dt>
          <dd>{resourceStats.itemsCount}</dd>
        </div>
      </dl>
      <Link href={`/cursos/${course.slug}`} className="button button-primary">
        Ver detalles e inscribirme
      </Link>
    </article>
  );
}
