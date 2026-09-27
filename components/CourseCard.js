import Link from 'next/link';

const defaultThumbnails = {
  Arte: 'https://d3puay5pkxu9s4.cloudfront.net/courses/4472/img/web/800_imagen.jpg',
  Música: 'https://d3puay5pkxu9s4.cloudfront.net/curso/1760/card_imagen.jpg',
  Tecnología: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  Empleabilidad: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
};

export function CourseCard({ course }) {
  const thumbnail = course.thumbnail || defaultThumbnails[course.category] || defaultThumbnails.Tecnología;
  const rating = course.rating || 4.9;
  const students = course.studentsCount || `${(course.enrollments?.length || 0) + 1240}`;
  const duration = course.duration || '60 horas';

  return (
    <article className="ccard">
      <Link href={`/cursos/${course.slug}`} className="ccard__link" aria-label={`Ver curso ${course.title}`}>
        <span className="sr-only">Ver curso {course.title}</span>
      </Link>

      <div className="ccard__thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={course.title}
          loading="lazy"
          className="ccard__img"
        />
        <div className="ccard__play-overlay">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="ccard__badge-free">Gratis</span>
      </div>

      <div className="ccard__body">
        <span className="ccard__cat">{course.category || 'Curso Online'}</span>
        <h3 className="ccard__t">{course.title}</h3>
        <p className="ccard__summary">{course.summary}</p>

        <div className="ccard__m">
          <span className="ccard__m-rate">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffb800">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <strong>{rating}</strong>
          </span>
          <span className="ccard__m-users">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{students}</span>
          </span>
          <span className="ccard__m-time">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{duration.split(' ')[0]} h</span>
          </span>
        </div>

        <div className="ccard__foot">
          <div className="ccard__cert">
            <svg className="ccard__cert-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2l2.4 2.5 3.4-.6 1.3 3.2 3.3 1.3-.6 3.4 2.5 2.4-2.5 2.4.6 3.4-3.3 1.3-1.3 3.2-3.4-.6L12 22l-2.4-2.5-3.4.6-1.3-3.2-3.3-1.3.6-3.4L-0.3 12l2.5-2.4-.6-3.4 3.3-1.3 1.3-3.2 3.4.6L12 2zm-1 14.5l5.5-5.5-1.4-1.4-4.1 4.1-2.1-2.1-1.4 1.4 3.5 3.5z" />
            </svg>
            <span>Certificado de estudios</span>
          </div>
          <span className="ccard__cta">Ver curso</span>
        </div>
      </div>
    </article>
  );
}
