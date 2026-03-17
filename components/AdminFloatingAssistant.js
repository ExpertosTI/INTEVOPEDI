"use client";

import { useMemo, useState, useTransition } from 'react';
import { runAdminAssistantAction } from '@/app/actions';

export function AdminFloatingAssistant({ courses = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [actionType, setActionType] = useState('general');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');

  const selectedCourse = useMemo(() => courses.find((c) => c.id === courseId) || null, [courses, courseId]);

  function addMessage(role, content) {
    setMessages((prev) => [...prev, { role, content, ts: Date.now() }].slice(-12));
  }

  function sendPrompt() {
    if (prompt.trim().length < 8) {
      setError('Escribe una solicitud más completa.');
      return;
    }
    setError('');
    const input = prompt.trim();
    addMessage('admin', input);
    setPrompt('');

    const formData = new FormData();
    formData.set('prompt', input);
    formData.set('actionType', actionType);
    if (courseId) formData.set('courseId', courseId);

    startTransition(async () => {
      const response = await runAdminAssistantAction(formData);
      if (!response?.ok) {
        setError(response?.error || 'No se pudo ejecutar el asistente.');
        return;
      }
      if (response.data?.summary) {
        addMessage('assistant', response.data.summary);
      }
      if (response.data?.courseDraft) {
        addMessage('assistant', 'Se generó un borrador de curso. Revisa en Ajustes IA.');
      }
      if (response.data?.courseContentDraft) {
        addMessage('assistant', 'Contenido generado para el curso seleccionado.');
      }
    });
  }

  const quick = [
    'Resumen ejecutivo de inscripciones y pagos pendientes',
    'Preparar anuncio del nuevo curso con bullets',
    'Crear curso accesible de IA con 3 módulos, 6 horas, modalidad virtual',
    selectedCourse ? `Generar contenido para ${selectedCourse.title}` : null
  ].filter(Boolean);

  return (
    <div className={`admin-floating-assistant ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="assistant-toggle button button-primary"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Cerrar asistente' : 'Asistente admin'}
      </button>

      {isOpen ? (
        <div className="assistant-panel panel stack">
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">Super asistente</span>
              <strong>Acciones globales como super admin</strong>
              <p className="helper">Usa frases cortas. El asistente puede crear cursos, generar contenido y resumir estado.</p>
            </div>
            <div className="assistant-meta">
              <label>
                Acción
                <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
                  <option value="general">General</option>
                  <option value="create-course">Crear curso</option>
                  <option value="create-content">Contenido de curso</option>
                </select>
              </label>
              <label>
                Curso
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  <option value="">Ninguno</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {error ? <div className="banner banner-error" role="alert">{error}</div> : null}

          <div className="assistant-chat" aria-live="polite">
            {messages.length === 0 ? <p className="helper">Empieza con una pregunta o usa un atajo.</p> : null}
            {messages.map((m) => (
              <div key={m.ts} className={`msg msg-${m.role}`}>
                <strong>{m.role === 'admin' ? 'Tú' : 'Asistente'}</strong>
                <p>{m.content}</p>
              </div>
            ))}
          </div>

          <div className="assistant-input">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Pide una acción o un resumen"
              rows={3}
              disabled={isPending}
            />
            <div className="inline-actions">
              <button type="button" className="button button-primary" onClick={sendPrompt} disabled={isPending || prompt.trim().length < 8}>
                {isPending ? 'Procesando…' : 'Enviar'}
              </button>
              <button type="button" className="button button-secondary" onClick={() => setMessages([])} disabled={isPending}>
                Limpiar historial
              </button>
            </div>
          </div>

          {quick.length ? (
            <div className="assistant-quick" role="group" aria-label="Atajos sugeridos">
              {quick.map((q) => (
                <button key={q} type="button" className="button button-secondary" onClick={() => setPrompt(q)} disabled={isPending}>
                  {q}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
