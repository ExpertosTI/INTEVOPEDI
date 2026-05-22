import { getPublishedCourses } from '@/lib/data';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CourseListClient } from '@/components/CourseListClient';

export const metadata = {
  title: 'Cursos | INTEVOPEDI'
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <Breadcrumb items={[{ label: 'Cursos', href: '/cursos' }]} />
        <div className="section-heading">
          <span className="eyebrow">Catálogo de formación</span>
          <h1>Cursos accesibles diseñados para el impacto real</h1>
          <p>
            Oferta académica actualizada con enfoque en competencias digitales, accesibilidad y empleabilidad.
          </p>
        </div>
        <CourseListClient courses={courses} />
      </div>
    </section>
  );
}
