import Link from 'next/link';
import { getCourseResourceStats } from '@/lib/site';

const modalityIcons = {
  Zoom: '📹',
  Presencial: '🏫',
  Híbrido: '🔄',
  Virtual: '💻'
};

const levelLabels = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado'
};

export function CourseCard({ course }) {
  const resourceStats = getCourseResourceStats(course.slug);
  const icon = modalityIcons[course.modality] || '📚';
  const hasSeatLimit = course.seats && course.seats > 0;
  const enrolledCount = course.enrollments?.length || 0;
  const isFull = hasSeatLimit && enrolledCount >= course.seats;

  return (
    <Link href={`/cursos/${course.slug}`} className="course-card-premium">
      <div className="course-card-hero">
        <span className="course-card-icon-large">{icon}</span>
        {isFull && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 2,
            background: 'var(--accent-red)', color: '#fff', fontSize: '0.6rem',
            fontWeight: 800, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase'
          }}>
            Lleno
          </div>
        )}
      </div>

      <div className="course-card-body">
        <div className="row-between" style={{ alignItems: 'center' }}>
          <span className={`course-card-category cat-${course.category}`}>{course.category}</span>
          <span className={`course-level-badge level-${course.level}`}>
            {levelLabels[course.level] || course.level}
          </span>
        </div>

        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-description">{course.summary}</p>

        <div className="course-card-footer">
          <div className="course-card-meta">
            <span>⏱️ {course.duration}</span>
            <span>📂 {course.modules?.length || 0} módulos</span>
          </div>
          <strong style={{ color: 'var(--accent-green)', fontSize: '0.9rem' }}>
            {course.priceLabel}
          </strong>
        </div>

        {hasSeatLimit && (
          <div className="progress-line" style={{ marginTop: '12px', height: '3px' }} aria-hidden="true">
            <span style={{ 
              width: `${Math.min(100, Math.round((enrolledCount / course.seats) * 100))}%`,
              background: isFull ? 'var(--accent-red)' : 'var(--primary)'
            }} />
          </div>
        )}
      </div>
    </Link>
  );
}
