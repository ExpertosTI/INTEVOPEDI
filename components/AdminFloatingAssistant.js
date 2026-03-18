"use client";

import { useMemo, useRef, useState, useTransition } from 'react';
import { runAdminAssistantAction } from '@/app/actions';

export function AdminFloatingAssistant({ courses = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [actionType, setActionType] = useState('general');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const selectedCourse = useMemo(() => courses.find((c) => c.id === courseId) || null, [courses, courseId]);

  function speak(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.98;
    window.speechSynthesis.speak(utterance);
  }

  function addMessage(role, content) {
    setMessages((prev) => [...prev, { role, content, ts: Date.now() }].slice(-12));
  }

  function ensureRecognition() {
    if (recognitionRef.current || typeof window === 'undefined') return recognitionRef.current;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = 'es-ES';
    rec.continuous = false;
    rec.interimResults = false;
    recognitionRef.current = rec;
    return rec;
  }

  function startListening() {
    const rec = ensureRecognition();
    if (!rec) {
      setError('Tu navegador no soporta reconocimiento de voz.');
      return;
    }
    setError('');
    setListening(true);
    rec.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join(' ').trim();
      if (transcript) {
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        speak(`Escuchado: ${transcript}. Presiona Enter para enviar.`);
      }
    };
    rec.onerror = () => {
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.start();
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
        speak(response.data.summary);
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
    'Crear curso completo: título, objetivo, duración 12h, 5 módulos, modalidad híbrida, incluye PDF de apoyo y tareas',
    selectedCourse ? `Generar contenido avanzado para ${selectedCourse.title} con materiales y evaluaciones` : null
  ].filter(Boolean);

  // Confirmaciones rápidas por accesibilidad
  function handleConfirmation(command) {
    const lower = command.trim().toLowerCase();
    if (['sí', 'si', 'confirmar', 'aceptar'].includes(lower)) {
      speak('Confirmado. Ejecuta la acción o revisa el borrador.');
    }
    if (['no', 'cancelar', 'detener'].includes(lower)) {
      speak('Acción cancelada.');
    }
  }

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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
              }}
            />
            <div className="inline-actions">
              <button type="button" className="button button-primary" onClick={sendPrompt} disabled={isPending || prompt.trim().length < 8}>
                {isPending ? 'Procesando…' : 'Enviar'}
              </button>
              <button type="button" className="button button-secondary" onClick={() => setMessages([])} disabled={isPending}>
                Limpiar historial
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={startListening}
                disabled={isPending || listening}
              >
                {listening ? 'Escuchando…' : 'Hablar' }
              </button>
            </div>
            <p className="helper">Enter envía, Shift+Enter hace salto de línea. Comandos rápidos: "sí", "no", "confirmar" tras una respuesta.</p>
          </div>

          {quick.length ? (
            <div className="assistant-quick" role="group" aria-label="Atajos sugeridos">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setPrompt(q);
                    speak(q);
                    // Ejecutar de inmediato con el atajo cargado
                    startTransition(() => {
                      addMessage('admin', q);
                      const data = new FormData();
                      data.set('prompt', q);
                      data.set('actionType', actionType);
                      if (courseId) data.set('courseId', courseId);
                      runAdminAssistantAction(data).then((response) => {
                        if (!response?.ok) {
                          setError(response?.error || 'No se pudo ejecutar el asistente.');
                          return;
                        }
                        if (response.data?.summary) {
                          addMessage('assistant', response.data.summary);
                          speak(response.data.summary);
                        }
                        if (response.data?.courseDraft) {
                          addMessage('assistant', 'Se generó un borrador de curso. Revisa en Ajustes IA.');
                        }
                        if (response.data?.courseContentDraft) {
                          addMessage('assistant', 'Contenido generado para el curso seleccionado.');
                        }
                      });
                    });
                  }}
                  disabled={isPending}
                >
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
