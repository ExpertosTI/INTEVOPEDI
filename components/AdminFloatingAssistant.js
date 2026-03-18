"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
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
  const [micStatus, setMicStatus] = useState('idle');
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

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
    if (!SpeechRecognition) {
      setMicStatus('unsupported');
      return null;
    }
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
    setMicStatus('request');
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
        setMicStatus('denied');
        setListening(false);
      });
    }
    setListening(true);
    setMicStatus('listening');
    rec.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join(' ').trim();
      if (transcript) {
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        speak(`Escuchado: ${transcript}. Presiona Enter para enviar.`);
      }
    };
    rec.onerror = () => {
      setListening(false);
      setMicStatus('error');
    };
    rec.onend = () => {
      setListening(false);
      setMicStatus('idle');
    };
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus trap básico dentro del panel
  useEffect(() => {
    function handleKey(e) {
      if (!isOpen || !panelRef.current) return;
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
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

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

          <button type="button" className="button button-secondary" onClick={() => inputRef.current?.focus()}>
            Ir a la entrada
          </button>

          {error ? <div className="banner banner-error" role="alert">{error}</div> : null}

          <div className="assistant-chat" aria-live="polite" ref={chatRef}>
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
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setIsOpen(false);
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
            <p className="helper">Enter envía, Shift+Enter hace salto de línea, Esc cierra. Micrófono: {micStatus === 'listening' ? 'escuchando' : micStatus === 'denied' ? 'permiso denegado' : micStatus === 'unsupported' ? 'no soportado' : 'listo'}.</p>
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
