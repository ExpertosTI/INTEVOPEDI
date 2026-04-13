"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAssistant } from '@/lib/useAssistant';
import { formatAndSanitizeExtendedMarkdown } from '@/lib/sanitize';

function formatMarkdown(text) {
  return formatAndSanitizeExtendedMarkdown(text);
}

export function AdminFloatingAssistant({ courses = [] }) {
  const {
    isPending,
    messages,
    prompt, setPrompt,
    actionType, setActionType,
    courseId, setCourseId,
    error,
    listening, micStatus,
    clearMessages,
    sendPrompt,
    startListening,
    copyToClipboard
  } = useAssistant();

  const [open, setOpen] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const openRef = useRef(open);

  useEffect(() => { openRef.current = open; }, [open]);

  const selectedCourse = useMemo(() => courses.find((c) => c.id === courseId) || null, [courses, courseId]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    function handleKey(e) {
      if (!openRef.current || !panelRef.current) return;
      if (e.key === 'Tab') {
        const focusables = panelRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const quick = [
    'Resumen ejecutivo de inscripciones y pagos pendientes',
    'Crear curso accesible de IA con 3 módulos, 6 horas, modalidad virtual',
    'Crear curso: título, objetivo, 12h, 5 módulos, modalidad híbrida',
    selectedCourse ? `Generar contenido avanzado para ${selectedCourse.title}` : null
  ].filter(Boolean);

  return (
    <div className={`admin-floating-assistant ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="assistant-toggle button button-primary"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '✕ Cerrar' : '🤖 Asistente IA'}
      </button>

      {open ? (
        <div
          className="assistant-panel panel stack"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente administrativo"
          ref={panelRef}
        >
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">Super asistente</span>
              <strong>Acciones globales como super admin</strong>
              <p className="helper">Usa frases cortas. El asistente crea cursos, genera contenido y resume estado.</p>
            </div>
            <div className="assistant-meta">
              <label>
                Acción
                <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
                  <option value="general">General</option>
                  <option value="enroll-student">Inscribir estudiante</option>
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

          <div className="assistant-chat" aria-live="polite" ref={chatRef}>
            {messages.length === 0 ? <p className="helper">Empieza con una pregunta o usa un atajo.</p> : null}
            {messages.map((m, i) => (
              <div key={`${m.ts}-${i}`} className={`msg msg-${m.role}`}>
                <strong>{m.role === 'admin' ? 'Tú' : '🤖 Asistente'}</strong>
                {m.role === 'assistant' ? (
                  <p dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content) }} />
                ) : (
                  <p>{m.content}</p>
                )}
                {m.role === 'assistant' ? (
                  <div className="msg-actions">
                    <button
                      type="button"
                      className="msg-action-btn"
                      onClick={() => copyToClipboard(m.content)}
                      title="Copiar respuesta"
                    >
                      📋 Copiar
                    </button>
                    {lastResult?.enrollmentDraft && i === messages.length - 1 && (
                      <form action={async (formData) => {
                        const { enrollStudentFromAssistantAction } = await import('@/app/actions');
                        formData.set('enrollmentDraft', JSON.stringify(lastResult.enrollmentDraft));
                        const res = await enrollStudentFromAssistantAction(formData);
                        if (res.ok) {
                          alert(res.message);
                          clearMessages();
                        } else {
                          alert(res.error);
                        }
                      }}>
                        <button type="submit" className="button button-primary" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                          ✅ Confirmar Inscripción de {lastResult.enrollmentDraft.fullName}
                        </button>
                      </form>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
            {isPending ? (
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            ) : null}
          </div>

          <div className="assistant-input">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Pide una acción o un resumen"
              rows={3}
              disabled={isPending}
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setOpen(false);
                }
              }}
            />
            <div className="inline-actions">
              <button type="button" className="button button-primary" onClick={() => sendPrompt()} disabled={isPending || prompt.trim().length < 8}>
                {isPending ? 'Procesando…' : 'Enviar'}
              </button>
              <button type="button" className="button button-secondary" onClick={clearMessages} disabled={isPending}>
                Limpiar
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={startListening}
                disabled={isPending || listening}
              >
                {listening ? '🎤 Escuchando…' : '🎤 Hablar'}
              </button>
            </div>
            <p className="helper">Enter envía · Shift+Enter salto · Esc cierra · Mic: {micStatus === 'listening' ? 'escuchando' : micStatus === 'denied' ? 'denegado' : micStatus === 'unsupported' ? 'no soportado' : 'listo'}.</p>
          </div>

          {quick.length ? (
            <div className="assistant-quick" role="group" aria-label="Atajos sugeridos">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="button button-secondary"
                  onClick={() => sendPrompt(q)}
                  disabled={isPending}
                  style={{ fontSize: '0.78rem', height: '36px', padding: '0 14px' }}
                >
                  {q.length > 50 ? `${q.slice(0, 50)}…` : q}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
