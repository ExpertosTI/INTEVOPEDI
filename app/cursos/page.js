import { Suspense } from 'react';
import Link from 'next/link';
import { getPublishedCourses } from '@/lib/data';
import { CourseListClient } from '@/components/CourseListClient';

export const metadata = {
  title: 'Cursos Online Gratis con Certificado | INTEVOPEDI Academy',
  description: 'Explora nuestra oferta de cursos virtuales gratuitos en música, técnica vocal, tecnología, IA y habilidades laborales.'
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="ea-catalog-page">
      <div className="shell">
        <nav className="clp-crumbs" aria-label="Navegación secundaria">
          <Link href="/">Inicio</Link>
          <svg className="clp-crumbs-sep" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>Todos los cursos</span>
        </nav>

        <div className="ea-catalog-header">
          <span className="ea-hero-badge">Catálogo Académico</span>
          <h1>Aprende con cursos gratis y certificados</h1>
          <p>
            Capacítate en áreas de alta demanda con contenidos prácticos, proyectos reales y certificación con validez internacional.
          </p>
        </div>

        <Suspense fallback={<div className="ea-catalog-loading">Cargando catálogo de cursos...</div>}>
          <CourseListClient courses={courses} />
        </Suspense>
      </div>
    </div>
  );
}
