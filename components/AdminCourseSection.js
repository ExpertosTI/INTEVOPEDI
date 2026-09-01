'use client';

import { useState } from 'react';
import { CourseBuilderWizard } from '@/components/CourseBuilderWizard';
import Link from 'next/link';

/**
 * AdminCourseSection
 * Sección interactiva del panel admin para crear cursos con wizard o formulario manual.
 */
export function AdminCourseSection({ courses }) {
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' | 'manual'

  const handleCourseCreated = (formData) => {
    console.log('Curso creado:', formData);
    // TODO: Aquí llamar la acción del servidor para crear el curso
    setShowWizard(false);
    // Mostrar toast de éxito
  };

  if (showWizard) {
    return (
      <CourseBuilderWizard
        onCourseCreated={handleCourseCreated}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="admin-course-section stack">
      {/* Quick actions */}
      <div className="quick-actions-bar">
        <button
          className="button button-primary"
          onClick={() => {
            setShowWizard(true);
            setViewMode('wizard');
          }}
        >
          ✨ Crear curso con asistente IA
        </button>
        <button
          className="button button-secondary-outline"
          onClick={() => setViewMode(viewMode === 'manual' ? 'wizard' : 'manual')}
        >
          {viewMode === 'manual' ? '← Volver al asistente' : '⚙️ Formulario manual'}
        </button>
      </div>

      {/* Sección de formulario manual (colapsable) */}
      {viewMode === 'manual' && (
        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Formulario avanzado</span>
            <h2>Crear curso manualmente</h2>
            <p>Para usuarios avanzados que prefieren control total. Usa el asistente IA para orientación.</p>
          </div>
          <p className="helper text-center">
            💡 <strong>Consejo:</strong> Comienza con el asistente IA para generar estructura, luego ajusta detalles aquí si lo necesitas.
          </p>
        </article>
      )}

      {/* Salud de cursos */}
      <article className="panel stack">
        <div className="section-heading">
          <span className="eyebrow">Gestión de cursos</span>
          <h2>Cursos registrados ({courses?.length || 0})</h2>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="empty-state">
            <p className="text-center helper">
              📚 No hay cursos aún. Usa el asistente IA para crear el primero.
            </p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card-admin panel">
                <div className="course-header">
                  <strong>{course.title}</strong>
                  <span className={`status-badge status-${course.status?.toLowerCase()}`}>
                    {course.status === 'PUBLISHED' && 'Publicado'}
                    {course.status === 'DRAFT' && 'Borrador'}
                    {course.status === 'CLOSED' && 'Cerrado'}
                  </span>
                </div>

                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-label">Inscritos</span>
                    <strong>{course.enrollments?.length || 0}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Módulos</span>
                    <strong>{course.modules?.length || 0}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Recursos</span>
                    <strong>{course.resources?.length || 0}</strong>
                  </div>
                </div>

                <div className="course-actions">
                  <Link href={`/cursos/${course.slug}`} className="button button-secondary button-sm">
                    📖 Ver
                  </Link>
                  <button className="button button-secondary-outline button-sm">
                    ✏️ Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
