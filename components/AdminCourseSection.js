'use client';

import { useState } from 'react';
import { CourseBuilderWizard } from '@/components/CourseBuilderWizard';
import Link from 'next/link';
import {
  Sparkles,
  Settings,
  BookOpen,
  Edit,
  Eye,
  Users,
  Layers,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from '@/components/Icons';
import { createCourseFromAssistantAction } from '@/app/actions';

/**
 * AdminCourseSection
 * Sección interactiva del panel admin para crear cursos con wizard o formulario manual.
 */
export function AdminCourseSection({ courses }) {
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' | 'manual'
  const [actionMessage, setActionMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCourseCreated = async (courseData) => {
    setIsSubmitting(true);
    setActionMessage(null);
    try {
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const payload = {
        title: courseData.title || 'Nuevo Curso Inclusivo',
        summary: courseData.description?.slice(0, 150) || 'Formación técnica accesible para personas con discapacidad.',
        description: courseData.description || 'Curso de capacitación técnica profesional.',
        modality: courseData.modality || 'VIRTUAL',
        priceCents: 0,
        priceLabel: 'Gratuito / Beca',
        seats: 30,
        startDate: now.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0],
        duration: `${courseData.totalHours || (courseData.moduleCount * courseData.moduleDuration)} horas`,
        location: 'Campus Virtual INTEVOPEDI',
        instructor: 'Facilitador INTEVOPEDI',
        status: 'PUBLISHED',
        modules: Array.from({ length: courseData.moduleCount || 3 }, (_, idx) => ({
          title: `Módulo ${idx + 1}: Fundamentos y Práctica`,
          description: `Contenido interactivo y accesible del módulo ${idx + 1}.`,
          durationMinutes: Math.round((courseData.moduleDuration || 2) * 60)
        }))
      };

      const formData = new FormData();
      formData.set('courseDraft', JSON.stringify(payload));

      const res = await createCourseFromAssistantAction(formData);
      if (res?.ok) {
        setActionMessage({ type: 'success', text: res.message || 'Curso creado y publicado con éxito.' });
        setShowWizard(false);
      } else {
        setActionMessage({ type: 'error', text: res?.error || 'Error al guardar el curso.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Error inesperado al crear curso.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showWizard) {
    return (
      <div className="stack">
        {actionMessage && (
          <div className={`banner banner-${actionMessage.type}`} role="status">
            {actionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{actionMessage.text}</span>
          </div>
        )}
        <CourseBuilderWizard
          onCourseCreated={handleCourseCreated}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  return (
    <div className="admin-course-section stack">
      {actionMessage && (
        <div className={`banner banner-${actionMessage.type}`} role="status">
          {actionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Quick actions */}
      <div className="quick-actions-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="button button-primary"
          onClick={() => {
            setShowWizard(true);
            setViewMode('wizard');
          }}
          disabled={isSubmitting}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={18} />
          <span>Crear curso con asistente IA</span>
        </button>
        <button
          className="button button-secondary-outline"
          onClick={() => setViewMode(viewMode === 'manual' ? 'wizard' : 'manual')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {viewMode === 'manual' ? (
            <>
              <ArrowLeft size={16} />
              <span>Volver a vista general</span>
            </>
          ) : (
            <>
              <Settings size={16} />
              <span>Formulario manual rápido</span>
            </>
          )}
        </button>
      </div>

      {/* Salud de cursos */}
      <article className="panel stack">
        <div className="section-heading">
          <span className="eyebrow">Gestión de cursos</span>
          <h2>Cursos registrados ({courses?.length || 0})</h2>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="empty-state">
            <p className="text-center helper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <BookOpen size={18} />
              <span>No hay cursos aún. Usa el asistente IA para crear el primero.</span>
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
                    <span className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> Inscritos
                    </span>
                    <strong>{course.enrollments?.length || 0}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={12} /> Módulos
                    </span>
                    <strong>{course.modules?.length || 0}</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={12} /> Recursos
                    </span>
                    <strong>{course.resources?.length || 0}</strong>
                  </div>
                </div>

                <div className="course-actions" style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/cursos/${course.slug}`} className="button button-secondary button-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={14} /> Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
