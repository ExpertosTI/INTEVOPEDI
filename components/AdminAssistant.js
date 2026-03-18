'use client';

import { useId, useMemo, useRef, useState, useTransition } from 'react';
import { appendModulesFromAssistantAction, createCourseFromAssistantAction, runAdminAssistantAction } from '@/app/actions';

const PROMPT_HISTORY_KEY = 'admin_assistant_history';
const MAX_HISTORY = 5;

function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function loadHistory() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PROMPT_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(prompts) {
  try {
    localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(prompts.slice(-MAX_HISTORY)));
  } catch {}
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
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmAppend, setConfirmAppend] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const resultRef = useRef(null);
  const timerRef = useRef(null);

  const selectedCourse = useMemo(() => courses.find((course) => course.id === courseId) || null, [courses, courseId]);

  function startTimer() {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function formatElapsed(seconds) {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }

  async function runAssistant() {
    setError('');
    setNotice('');
    setResult(null);
    setDraftPayload('');
    setConfirmCreate(false);
    setConfirmAppend(false);
    startTimer();

    const data = new FormData();
    data.set('prompt', prompt);
    data.set('actionType', actionType);
    if (courseId) data.set('courseId', courseId);

    startTransition(async () => {
      const response = await runAdminAssistantAction(data);
      stopTimer();
      if (!response?.ok) {
        setError(response?.error || 'No se pudo ejecutar el asistente.');
        return;
      }
      setResult(response.data);
      if (response.data?.courseDraft) {
        setDraftPayload(JSON.stringify(response.data.courseDraft, null, 2));
      }
      const prompts = loadHistory();
      const updated = [prompt, ...prompts.filter((p) => p !== prompt)].slice(0, MAX_HISTORY);
      saveHistory(updated);
      setHistory(updated);
      if (resultRef.current) {
        resultRef.current.focus();
      }
    });
  }

  async function createCourseFromDraft() {
    setError('');
    setNotice('');
    if (!draftPayload) return;
    if (!confirmCreate) {
      setError('Confirma la creación del curso antes de proceder.');
      return;
    }

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
      setConfirmCreate(false);
      setConfirmAppend(false);
    });
  }

  async function appendModules() {
    setError('');
    setNotice('');
    if (!courseId || !result?.courseContentDraft?.newModules) return;
    if (!confirmAppend) {
      setError('Confirma la adición de módulos antes de proceder.');
      return;
    }

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
      setConfirmAppend(false);
    });
  }

  function exportDraft() {
    if (!draftPayload && !result?.courseContentDraft) return;
    const content = draftPayload || JSON.stringify(result.courseContentDraft, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `borrador-curso-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function useHistoryItem(item) {
    setPrompt(item);
    setShowHistory(false);
  }

  function formatSummary(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
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
        {isPending ? (
          <div className="assistant-timer" role="status" aria-live="polite">
            <span className="assistant-timer-label">Tiempo:</span>
            <output aria-label={`Tiempo transcurrido: ${formatElapsed(elapsed)}`}>{formatElapsed(elapsed)}</output>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="banner banner-error" role="alert">
          {error}
          <button type="button" className="button button-secondary" onClick={runAssistant} disabled={isPending}>
            Reintentar
          </button>
        </div>
      ) : null}
      {notice ? <div className="banner banner-success" role="status">{notice}</div> : null}

      <div className="admin-assistant-grid" role="group" aria-describedby={`${regionId}-help`}>
        <div className="stack">
          <p id={`${regionId}-help`} className="helper">
            Consejo: usa frases cortas. Ejemplo: "Crear un curso de accesibilidad móvil para docentes, 3 módulos, 2 horas".
          </p>

          <div className="prompt-history-wrap">
            <label htmlFor={`${regionId}-prompt`}>
              Qué necesitas hacer
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setShowHistory((v) => !v)}
                aria-expanded={showHistory}
                disabled={isPending}
                title="Ver historial de prompts"
              >
                Historial ({history.length})
              </button>
            </label>
            {showHistory && history.length > 0 ? (
              <ul className="history-dropdown" role="list">
                {history.map((item, i) => (
                  <li key={i}>
                    <button type="button" onClick={() => useHistoryItem(item)} className="button button-ghost history-item">
                      {item.length > 60 ? `${item.slice(0, 60)}…` : item}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <textarea
              id={`${regionId}-prompt`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe tu solicitud…"
              aria-describedby={`${regionId}-help`}
              aria-busy={isPending}
              disabled={isPending}
            />
          </div>

          <div className="admin-assistant-controls">
            <label>
              Tipo de acción
              <select value={actionType} onChange={(e) => setActionType(e.target.value)} disabled={isPending}>
                <option value="general">Ayuda general</option>
                <option value="create-course">Crear curso</option>
                <option value="create-content">Crear contenido para curso</option>
              </select>
            </label>

            <label>
              Curso (opcional)
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={isPending}>
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
              aria-busy={isPending}
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
              disabled={!audioBrief || isPending}
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
            <div
              className="panel stack"
              role="region"
              aria-label="Resultado del asistente"
              ref={resultRef}
              tabIndex={-1}
            >
              <div className="row-between">
                <span className="eyebrow">Resultado</span>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={exportDraft}
                  disabled={isPending}
                  title="Exportar como JSON"
                >
                  Exportar JSON
                </button>
              </div>
              <p
                className="assistant-summary"
                dangerouslySetInnerHTML={{ __html: formatSummary(result.summary) }}
              />

              {actionType === 'create-course' && draftPayload ? (
                <div className="stack">
                  <span className="eyebrow">Borrador de curso</span>
                  <label>
                    Revisión (JSON)
                    <textarea
                      value={draftPayload}
                      onChange={(e) => setDraftPayload(e.target.value)}
                      disabled={isPending}
                    />
                  </label>
                  <div className="inline-actions">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={exportDraft}
                      disabled={isPending}
                    >
                      Descargar JSON
                    </button>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={createCourseFromDraft}
                      disabled={isPending}
                    >
                      Confirmar y crear curso
                    </button>
                  </div>
                  <label className="confirm-inline">
                    <input
                      type="checkbox"
                      checked={confirmCreate}
                      onChange={(e) => setConfirmCreate(e.target.checked)}
                      disabled={isPending}
                    />
                    <span>Entiendo que se creará un curso nuevo con estos datos.</span>
                  </label>
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
                      <label className="confirm-inline">
                        <input
                          type="checkbox"
                          checked={confirmAppend}
                          onChange={(e) => setConfirmAppend(e.target.checked)}
                          disabled={isPending}
                        />
                        <span>Entiendo que se agregarán estos módulos al curso seleccionado.</span>
                      </label>
                      <div className="inline-actions">
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={exportDraft}
                          disabled={isPending}
                        >
                          Exportar JSON
                        </button>
                        <button
                          type="button"
                          className="button button-primary"
                          onClick={appendModules}
                          disabled={isPending || !courseId}
                        >
                          Agregar módulos
                        </button>
                      </div>
                      <p className="helper">Acción segura: agrega módulos al final del curso seleccionado.</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="panel stack">
              <span className="eyebrow">Estado</span>
              <p className="helper">
                {isPending
                  ? 'El asistente está procesando tu solicitud. Por favor espera…'
                  : 'Sin resultados todavía. El asistente mostrará aquí los siguientes pasos.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}