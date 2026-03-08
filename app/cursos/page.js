import Link from 'next/link';
import { CourseCard } from '@/components/CourseCard';
import { getPublishedCourses } from '@/lib/data';

export const metadata = {
  title: 'Cursos | INTEVOPEDI'
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="section-heading">
          <span className="eyebrow">Oferta formativa</span>
          <h1>Cursos accesibles y listos para inscripción</h1>
          <p>
            Cada curso cuenta con detalle público, formulario persistente, seguimiento del participante, campus privado y certificación verificable.
          </p>
        </div>

        <div className="panel stack">
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">Fase 2</span>
              <h2>Explora e ingresa luego a tu campus</h2>
              <p>Después de inscribirte, podrás entrar con tu correo y código para retomar módulos, materiales y certificado.</p>
            </div>
            <Link href="/participantes" className="button button-secondary">
              Acceso participantes
            </Link>
          </div>
        </div>

        <div className="card-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
