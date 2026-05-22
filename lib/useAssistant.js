'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import { runAdminAssistantAction } from '@/app/actions';

const MSG_STORAGE_KEY = 'assistant_messages';
const MAX_MESSAGES = 20;

function loadStoredMessages() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(MSG_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function storeMessages(msgs) {
  try {
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)));
  } catch {}
}

function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.98;
  window.speechSynthesis.speak(utterance);
}

export function useAssistant() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState(() => loadStoredMessages());
  const [prompt, setPrompt] = useState('');
  const [actionType, setActionType] = useState('general');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [micStatus, setMicStatus] = useState('idle');

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => {
      const updated = [...prev, { role, content, ts: Date.now() }].slice(-MAX_MESSAGES);
      storeMessages(updated);
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    storeMessages([]);
  }, []);

  const sendPrompt = useCallback((overridePrompt) => {
    const input = (overridePrompt || prompt).trim();
    if (input.length < 8) {
      setError('Escribe una solicitud más completa (mínimo 8 caracteres).');
      return;
    }
    setError('');
    setNotice('');
    setLastResult(null);
    addMessage('admin', input);
    if (!overridePrompt) setPrompt('');

    const formData = new FormData();
    formData.set('prompt', input);
    formData.set('actionType', actionType);
    if (courseId) formData.set('courseId', courseId);

    startTransition(async () => {
      const response = await runAdminAssistantAction(formData);
      if (!response?.ok) {
        setError(response?.error || 'No se pudo ejecutar el asistente.');
        addMessage('assistant', `⚠️ Error: ${response?.error || 'No se pudo ejecutar.'}`);
        return;
      }
      setLastResult(response.data);
      if (response.data?.summary) {
        addMessage('assistant', response.data.summary);
        speak(response.data.audioBrief || response.data.summary);
      }
      if (response.data?.courseDraft) {
        addMessage('assistant', '📋 Borrador de curso generado. Revisa en el panel de ajustes IA.');
      }
      if (response.data?.courseContentDraft) {
        addMessage('assistant', '📝 Contenido generado para el curso seleccionado.');
      }
    });
  }, [prompt, actionType, courseId, addMessage]);

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

  function copyToClipboard(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  return {
    isPending,
    messages, setMessages,
    prompt, setPrompt,
    actionType, setActionType,
    courseId, setCourseId,
    error, setError,
    notice, setNotice,
    lastResult,
    listening, micStatus,
    addMessage,
    clearMessages,
    sendPrompt,
    startListening,
    copyToClipboard,
    speak
  };
}
