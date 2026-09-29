'use client';

import { useState } from 'react';
import Link from 'next/link';

export function AdminCourseContentManager({ initialCourses = [] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedSlug, setSelectedSlug] = useState(initialCourses[0]?.slug || 'ia-accesibilidad-digital');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Active course being edited
  const currentCourse = courses.find((c) => c.slug === selectedSlug) || courses[0] || {
    slug: 'nuevo-curso',
    title: 'Nuevo Curso',
    category: 'Tecnología',
    instructor: 'Equipo Técnico INTEVOPEDI',
    instructorTitle: 'Especialista en Accesibilidad',
    instructorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    instructorBio: 'Biografía del docente o equipo formador.',
    duration: '40 horas certificables',
    modality: '100% Virtual a tu propio ritmo',
    priceLabel: 'Gratis',
    videoId: null,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    certificateTitle: 'Certificación Oficial INTEVOPEDI',
    certificateHours: '40 horas certificables',
    summary: 'Resumen breve del curso.',
    description: 'Descripción detallada del curso.',
    modules: []
  };

  const [formData, setFormData] = useState({ ...currentCourse });

  // When switching selected course
  const handleSelectCourse = (slug) => {
    setSelectedSlug(slug);
    const found = courses.find((c) => c.slug === slug);
    if (found) {
      setFormData({ ...found, modules: found.modules || [] });
      setSaveMessage(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to extract YouTube video ID if full URL pasted
  const handleVideoUrlChange = (val) => {
    let videoId = val.trim();
    if (videoId.includes('youtube.com/watch?v=')) {
      videoId = videoId.split('v=')[1]?.split('&')[0] || videoId;
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }
    handleInputChange('videoId', videoId);
  };

  // Unit manipulation
  const handleAddUnit = () => {
    const newOrder = (formData.modules?.length || 0) + 1;
    const newUnit = {
      id: `unit-${Date.now()}`,
      order: newOrder,
      title: `Unidad ${newOrder}. Nuevo Módulo de Aprendizaje`,
      description: 'Descripción de las competencias y contenidos a desarrollar.',
      durationMinutes: 90,
      lessons: [
        { title: 'Introducción a la unidad', type: 'video', duration: '15 min' },
        { title: 'Lectura y fundamentos', type: 'reading', duration: '20 min' }
      ]
    };
    setFormData((prev) => ({
      ...prev,
      modules: [...(prev.modules || []), newUnit]
    }));
  };

  const handleRemoveUnit = (index) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, idx) => idx !== index)
    }));
  };

  const handleUnitChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, modules: updated };
    });
  };

  // Lesson manipulation inside a unit
  const handleAddLesson = (unitIndex) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      const unit = updated[unitIndex];
      const currentLessons = unit.lessons || [];
      updated[unitIndex] = {
        ...unit,
        lessons: [
          ...currentLessons,
          {
            title: `Nueva clase ${currentLessons.length + 1}`,
            type: 'video',
            duration: '15 min'
          }
        ]
      };
      return { ...prev, modules: updated };
    });
  };

  const handleRemoveLesson = (unitIndex, lessonIndex) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      const unit = updated[unitIndex];
      updated[unitIndex] = {
        ...unit,
        lessons: unit.lessons.filter((_, idx) => idx !== lessonIndex)
      };
      return { ...prev, modules: updated };
    });
  };

  const handleLessonChange = (unitIndex, lessonIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      const unit = updated[unitIndex];
      const updatedLessons = [...(unit.lessons || [])];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        [field]: value
      };
      updated[unitIndex] = { ...unit, lessons: updatedLessons };
      return { ...prev, modules: updated };
    });
  };

  // Save changes
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_COURSE',
          courseData: formData
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSaveMessage({ type: 'success', text: `¡Curso "${formData.title}" actualizado y publicado con éxito!` });
        // Update local list
        setCourses((prev) => {
          const idx = prev.findIndex((c) => c.slug === formData.slug);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.course;
            return next;
          }
          return [data.course, ...prev];
        });
      } else {
        setSaveMessage({ type: 'error', text: 'Error al guardar los cambios del curso.' });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Error de conexión.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ea-admin-content-manager stack" style={{ gap: '24px' }}>
      {/* TOP SELECTOR & ACTIONS BAR */}
      <div className="panel" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #e6eaf3' }}>
        <div className="row-between" style={{ alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#031b4e' }}>
              Selecciona el curso a editar:
            </span>
            <select
              value={selectedSlug}
              onChange={(e) => handleSelectCourse(e.target.value)}
              style={{
                height: '42px',
                padding: '0 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.92rem',
                fontWeight: '700',
                color: '#031b4e',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title} ({c.category || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href={`/cursos/${formData.slug}`}
              target="_blank"
              className="button button-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              👁 Ver página del curso en vivo
            </Link>
            <button
              type="button"
              className="ea-btn-primary"
              onClick={handleSaveCourse}
              disabled={isSaving}
              style={{ height: '42px', padding: '0 22px' }}
            >
              {isSaving ? 'Guardando...' : '💾 Guardar y Publicar Cambios'}
            </button>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className={`banner banner-${saveMessage.type}`} role="status">
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* FORM BODY */}
      <form onSubmit={handleSaveCourse} className="stack" style={{ gap: '24px' }}>
        {/* 1. INFORMACIÓN GENERAL Y MULTIMEDIA */}
        <div className="panel stack" style={{ padding: '28px' }}>
          <div className="clp-row-head" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#031b4e', margin: 0 }}>
              1. Información General y Multimedia
            </h3>
            <span className="clp-row-meta">Portada, Video y Datos Principales</span>
          </div>

          <div className="form-row">
            <label>
              Título del curso *
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </label>
            <label>
              Slug (Identificador URL) *
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Categoría
              <select
                value={formData.category || 'Arte'}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="Arte">Arte y Música</option>
                <option value="Tecnología">Tecnología e IA</option>
                <option value="Empleabilidad">Empleabilidad y Contact Center</option>
                <option value="Educación">Educación Inclusiva</option>
              </select>
            </label>
            <label>
              Duración del curso
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ej. 80 horas certificables"
              />
            </label>
            <label>
              Modalidad
              <input
                type="text"
                value={formData.modality || ''}
                onChange={(e) => handleInputChange('modality', e.target.value)}
                placeholder="100% Virtual a tu propio ritmo"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              ID o Enlace del Video de Presentación (YouTube) *
              <input
                type="text"
                value={formData.videoId || ''}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Ej: 6XM8rGAupSo o https://youtube.com/watch?v=6XM8rGAupSo"
              />
              <span className="helper" style={{ fontSize: '0.78rem' }}>
                Este video se reproduce al pulsar el botón Play en la tarjeta lateral.
              </span>
            </label>
            <label>
              URL de la Imagen de Portada (Miniatura 16:9)
              <input
                type="text"
                value={formData.thumbnail || ''}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>

          {/* Mini preview de miniatura */}
          {formData.thumbnail && (
            <div style={{ maxWidth: '280px', marginTop: '6px' }}>
              <span className="helper" style={{ display: 'block', marginBottom: '4px' }}>Vista previa de portada:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.thumbnail}
                alt="Vista previa"
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          )}

          <label style={{ marginTop: '12px' }}>
            Resumen breve
            <input
              type="text"
              value={formData.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Descripción breve mostrada en las tarjetas del catálogo"
            />
          </label>

          <label>
            Descripción detallada
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Texto completo presentado en la cabecera del curso"
            />
          </label>
        </div>

        {/* 2. DOCENTE Y CERTIFICACIÓN OFICIAL */}
        <div className="panel stack" style={{ padding: '28px' }}>
          <div className="clp-row-head" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#031b4e', margin: 0 }}>
              2. Docente y Certificación Oficial
            </h3>
            <span className="clp-row-meta">Perfil del Profesor y Título a Otorgar</span>
          </div>

          <div className="form-row">
            <label>
              Nombre del Docente *
              <input
                type="text"
                value={formData.instructor || ''}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                placeholder="Ej. Equipo Técnico INTEVOPEDI"
              />
            </label>
            <label>
              Título / Especialidad del Docente *
              <input
                type="text"
                value={formData.instructorTitle || ''}
                onChange={(e) => handleInputChange('instructorTitle', e.target.value)}
                placeholder="Ej. Especialistas en Accesibilidad & IA"
              />
            </label>
            <label>
              Foto del Docente (URL)
              <input
                type="text"
                value={formData.instructorPhoto || ''}
                onChange={(e) => handleInputChange('instructorPhoto', e.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>

          <label>
            Biografía y Trayectoria del Docente
            <textarea
              rows={2}
              value={formData.instructorBio || ''}
              onChange={(e) => handleInputChange('instructorBio', e.target.value)}
              placeholder="Experiencia, certificaciones y trayectoria académica..."
            />
          </label>

          <div className="form-row" style={{ marginTop: '12px' }}>
            <label>
              Título a Certificar (En el Diploma) *
              <input
                type="text"
                value={formData.certificateTitle || ''}
                onChange={(e) => handleInputChange('certificateTitle', e.target.value)}
                placeholder="Ej. Certificación en IA y Accesibilidad Digital"
              />
            </label>
            <label>
              Horas Académicas Certificables *
              <input
                type="text"
                value={formData.certificateHours || ''}
                onChange={(e) => handleInputChange('certificateHours', e.target.value)}
                placeholder="Ej. 40 horas certificables"
              />
            </label>
          </div>
        </div>

        {/* 3. PROGRAMA Y TEMARIO: UNIDADES Y CLASES */}
        <div className="panel stack" style={{ padding: '28px' }}>
          <div className="row-between" style={{ alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#031b4e', margin: 0 }}>
                3. Programa del Curso: Unidades y Clases
              </h3>
              <p className="helper" style={{ marginTop: '4px' }}>
                Organiza las unidades didácticas y añade las clases con video, lectura o evaluación.
              </p>
            </div>
            <button
              type="button"
              className="button button-primary"
              onClick={handleAddUnit}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              ➕ Agregar Unidad
            </button>
          </div>

          <div className="stack" style={{ gap: '20px' }}>
            {(formData.modules || []).map((unit, uIdx) => (
              <div
                key={unit.id || uIdx}
                className="panel"
                style={{
                  padding: '20px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px'
                }}
              >
                <div className="row-between" style={{ alignItems: 'center', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '1rem', color: '#1d448e' }}>
                    Unidad {uIdx + 1}
                  </strong>
                  <button
                    type="button"
                    className="button button-outline"
                    style={{ borderColor: '#ef4444', color: '#dc2626', padding: '4px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleRemoveUnit(uIdx)}
                  >
                    🗑 Eliminar Unidad
                  </button>
                </div>

                <div className="form-row">
                  <label style={{ flex: '2 1 0%' }}>
                    Título de la Unidad
                    <input
                      type="text"
                      value={unit.title || ''}
                      onChange={(e) => handleUnitChange(uIdx, 'title', e.target.value)}
                      placeholder="Ej. Unidad 1. Introducción a la IA y Accesibilidad"
                    />
                  </label>
                  <label style={{ flex: '1 1 0%' }}>
                    Duración estimada
                    <input
                      type="text"
                      value={unit.durationMinutes ? `${unit.durationMinutes} min` : ''}
                      onChange={(e) => handleUnitChange(uIdx, 'durationMinutes', parseInt(e.target.value) || 90)}
                      placeholder="Ej. 90 min"
                    />
                  </label>
                </div>

                <label>
                  Descripción de la Unidad
                  <input
                    type="text"
                    value={unit.description || ''}
                    onChange={(e) => handleUnitChange(uIdx, 'description', e.target.value)}
                    placeholder="Resumen del contenido de la unidad..."
                  />
                </label>

                {/* LESSONS LIST */}
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <div className="row-between" style={{ alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#031b4e' }}>
                      Clases y lecciones ({unit.lessons?.length || 0}):
                    </span>
                    <button
                      type="button"
                      className="button button-secondary-outline button-sm"
                      onClick={() => handleAddLesson(uIdx)}
                    >
                      ➕ Añadir Clase
                    </button>
                  </div>

                  <div className="stack" style={{ gap: '8px' }}>
                    {(unit.lessons || []).map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>
                          {lIdx + 1}.
                        </span>

                        <input
                          type="text"
                          value={lesson.title || ''}
                          onChange={(e) => handleLessonChange(uIdx, lIdx, 'title', e.target.value)}
                          placeholder="Título de la clase..."
                          style={{ flex: '1 1 auto', height: '34px', fontSize: '0.88rem' }}
                        />

                        <select
                          value={lesson.type || 'video'}
                          onChange={(e) => handleLessonChange(uIdx, lIdx, 'type', e.target.value)}
                          style={{ height: '34px', fontSize: '0.82rem', padding: '0 8px' }}
                        >
                          <option value="video">🎥 Video</option>
                          <option value="reading">📄 Lectura</option>
                          <option value="practice">✍ Práctica</option>
                          <option value="quiz">📝 Quiz</option>
                        </select>

                        <input
                          type="text"
                          value={lesson.duration || ''}
                          onChange={(e) => handleLessonChange(uIdx, lIdx, 'duration', e.target.value)}
                          placeholder="15 min"
                          style={{ width: '80px', height: '34px', fontSize: '0.82rem' }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(uIdx, lIdx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}
                          title="Eliminar clase"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SAVE BAR */}
        <div className="panel" style={{ padding: '20px 24px', background: '#f8fafc', textAlign: 'right' }}>
          <button
            type="submit"
            className="ea-btn-primary"
            disabled={isSaving}
            style={{ padding: '14px 32px', fontSize: '1.05rem' }}
          >
            {isSaving ? 'Guardando curso...' : '💾 Guardar Todo y Publicar en el Catálogo'}
          </button>
        </div>
      </form>
    </div>
  );
}
