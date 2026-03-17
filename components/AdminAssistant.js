'use client';

import { useId, useMemo, useState, useTransition } from 'react';
import { appendModulesFromAssistantAction, createCourseFromAssistantAction, runAdminAssistantAction } from '@/app/actions';

function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function AdminAssistant({ courses = [] }) {
  const regionId = useId();
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState('');
  const [actionType, setActionType] = useState('general');
  const [courseId, setCourseId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [draftPayload, setDraftPayload] = useState('');

  const selectedCourse = useMemo(() => courses.find((course) => course.id === courseId) || null, [courses, courseId]);

  async function runAssistant() {
    setError('');
    setNotice('');
    setResult(null);
    setDraftPayload('');

    const data = new FormData();
    data.set('prompt', prompt);
    data.set('actionType', actionType);
    if (courseId) data.set('courseId', courseId);

    startTransition(async () => {
      const response = await runAdminAssistantAction(data);
      if (!response?.ok) {
        setError(response?.error || 'No se pudo ejecutar el asistente.');
        return;
      }
      setResult(response.data);
      if (response.data?.courseDraft) {
        setDraftPayload(JSON.stringify(response.data.courseDraft, null, 2));
      }
    });
  }

  async function createCourseFromDraft() {
    setError('');
    setNotice('');
    if (!draftPayload) return;

    const formData = new FormData();
    formData.set('courseDraft', draftPayload);

    startTransition(async () => {
      const response = await createCourseFromAssistantAction(formData);
      if (!response?.ok) {
        setError(response?.error || 'No se pudo crear el curso.');
        return;
      }
      setNotice(response?.message || 'Curso creado correctamente.');
      setPrompt('');
      setResult(null);
      setDraftPayload('');
    });
  }

  async function appendModules() {
    setError('');
    setNotice('');
    if (!courseId || !result?.courseContentDraft?.newModules) return;

    const formData = new FormData();
    formData.set('courseId', courseId);
    formData.set('newModules', JSON.stringify(result.courseContentDraft.newModules));

    startTransition(async () => {
      const response = await appendModulesFromAssistantAction(formData);
      if (!response?.ok) {
        setError(response?.error || 'No se pudo agregar contenido.');
        return;
      }
      setNotice(response?.message || 'Contenido agregado correctamente.');
      setResult(null);
    });
  }

  const suggestedButtons = normalizeArray(result?.suggestedButtons);
  const audioBrief = result?.audioBrief || '';

  return (
    <article className="panel stack admin-assistant" aria-labelledby="assistant-title">
      <div className="row-between">
        <div className="stack">
          <span className="eyebrow">Asistente accesible</span>
          <h2 id="assistant-title">Super asistente para administración</h2>
          <p className="helper">Diseñado para operar con lector de pantalla: instrucciones cortas, botones sugeridos y resumen auditivo.</p>
        </div>
      </div>

      {error ? <div className="banner banner-error" role="alert">{error}</div> : null}
      {notice ? <div className="banner banner-success" role="status">{notice}</div> : null}

      <div className="admin-assistant-grid" role="group" aria-describedby={`${regionId}-help`}>
        <div className="stack">
          <p id={`${regionId}-help`} className="helper">
            Consejo: usa frases cortas. Ejemplo: “Crear un curso de accesibilidad móvil para docentes, 3 módulos, 2 horas”.
          </p>

          <label>
            Qué necesitas hacer
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe tu solicitud…"
              aria-describedby={`${regionId}-help`}
            />
          </label>

          <div className="admin-assistant-controls">
            <label>
              Tipo de acción
              <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
                <option value="general">Ayuda general</option>
                <option value="create-course">Crear curso</option>
                <option value="create-content">Crear contenido para curso</option>
              </select>
            </label>

            <label>
              Curso (opcional)
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">Sin seleccionar</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="inline-actions">
            <button
              type="button"
              className="button button-primary"
              disabled={isPending || prompt.trim().length < 12}
              onClick={runAssistant}
            >
              {isPending ? 'Procesando…' : 'Ejecutar asistente'}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setPrompt('');
                setResult(null);
                setError('');
                setNotice('');
                setDraftPayload('');
              }}
              disabled={isPending}
            >
              Limpiar
            </button>
          </div>

          {suggestedButtons.length ? (
            <div className="admin-assistant-suggestions" role="group" aria-label="Acciones sugeridas">
              {suggestedButtons.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="button button-secondary"
                  onClick={() => setPrompt(label)}
                  disabled={isPending}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="stack" aria-live="polite">
          <div className="panel panel-dark stack assistant-audio" role="region" aria-label="Resumen auditivo">
            <span className="eyebrow">Resumen auditivo</span>
            <p className="helper">Este bloque está optimizado para lectura por voz.</p>
            <p className="assistant-audio-text">{audioBrief || 'Ejecuta el asistente para escuchar un resumen aquí.'}</p>
            <button
              type="button"
              className="button button-secondary"
              disabled={!audioBrief}
              onClick={() => {
                if (!audioBrief || typeof window === 'undefined' || !('speechSynthesis' in window)) {
                  return;
                }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(audioBrief);
                utterance.lang = 'es-ES';
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
              }}
            >
              Escuchar resumen
            </button>
          </div>

          {result?.summary ? (
            <div className="panel stack" role="region" aria-label="Resultado del asistente">
              <span className="eyebrow">Resultado</span>
              <p>{result.summary}</p>

              {actionType === 'create-course' && draftPayload ? (
                <div className="stack">
                  <span className="eyebrow">Borrador de curso</span>
                  <label>
                    Revisión (JSON)
                    <textarea value={draftPayload} onChange={(e) => setDraftPayload(e.target.value)} />
                  </label>
                  <button type="button" className="button button-primary" onClick={createCourseFromDraft} disabled={isPending}>
                    Confirmar y crear curso
                  </button>
                  <p className="helper">Acción segura: crea el curso como borrador con módulos.</p>
                </div>
              ) : null}

              {actionType === 'create-content' && selectedCourse && result?.courseContentDraft ? (
                <div className="stack">
                  <span className="eyebrow">Contenido propuesto</span>
                  <dl className="details-grid">
                    <div>
                      <dt>Curso</dt>
                      <dd>{selectedCourse.title}</dd>
                    </div>
                    <div>
                      <dt>Objetivo</dt>
                      <dd>{result.courseContentDraft.courseObjective || '—'}</dd>
                    </div>
                  </dl>

                  {Array.isArray(result.courseContentDraft.accessibleMaterials) ? (
                    <div className="stack">
                      <strong>Materiales accesibles</strong>
                      <ul className="list compact-list">
                        {result.courseContentDraft.accessibleMaterials.slice(0, 6).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {Array.isArray(result.courseContentDraft.assessmentIdeas) ? (
                    <div className="stack">
                      <strong>Ideas de evaluación</strong>
                      <ul className="list compact-list">
                        {result.courseContentDraft.assessmentIdeas.slice(0, 6).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {Array.isArray(result.courseContentDraft.newModules) && result.courseContentDraft.newModules.length ? (
                    <div className="stack">
                      <strong>Módulos sugeridos</strong>
                      <ul className="list compact-list">
                        {result.courseContentDraft.newModules.slice(0, 8).map((item) => (
                          <li key={item.title}>{item.title}</li>
                        ))}
                      </ul>
                      <button type="button" className="button button-primary" onClick={appendModules} disabled={isPending || !courseId}>
                        Agregar módulos al curso
                      </button>
                      <p className="helper">Acción segura: agrega módulos al final del curso seleccionado.</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="panel stack">
              <span className="eyebrow">Estado</span>
              <p className="helper">Sin resultados todavía. El asistente mostrará aquí los siguientes pasos.</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
