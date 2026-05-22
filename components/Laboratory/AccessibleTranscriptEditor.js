import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * AccessibleTranscriptEditor
 * Un editor de video basado en texto diseñado específicamente para usuarios novidentes.
 * Permite navegar la trascripción y marcar segmentos para convertirlos en Shorts.
 */
const AccessibleTranscriptEditor = ({ transcript = [], videoPath, onClipGenerated }) => {
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);

  // Singleton AudioContext para evitar churn
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Anunciar cambios de estado para lectores de pantalla
  const announceToScreenReader = useCallback((message) => {
    const announcement = document.getElementById('lci-announcer');
    if (announcement) {
      announcement.textContent = message;
    }
  }, []);

  const handleWordClick = useCallback(async (word) => {
    if (selectedRange.start === null) {
      setSelectedRange({ start: word.start, end: word.end });
      playFeedbackSound('high');
      announceToScreenReader(`Inicio del clip marcado en el segundo ${Math.round(word.start)}`);
    } else {
      setSelectedRange(prev => ({ ...prev, end: word.end }));
      playFeedbackSound('mid');
      announceToScreenReader(`Fin del clip marcado en el segundo ${Math.round(word.end)}`);
      
      // Activar Narrador de IA automáticamente para describir el clip seleccionado
      const description = await window.electronAPI.describeFrame({ 
        videoPath, 
        timestamp: word.start 
      });
      if (description.success) {
        announceToScreenReader(`Descripción visual: ${description.description}`);
      }
    }
  }, [selectedRange, playFeedbackSound, announceToScreenReader, videoPath]);

  const playFeedbackSound = useCallback((type) => {
    const audioCtx = getAudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(type === 'high' ? 880 : type === 'mid' ? 440 : 220, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }, [getAudioContext]);

  // Memoizar cálculo de palabras seleccionadas para evitar O(n) en cada render
  const selectedWordIndices = useMemo(() => {
    if (selectedRange.start === null || selectedRange.end === null) return new Set();
    const indices = new Set();
    transcript.forEach((item, index) => {
      if (item.start >= selectedRange.start && item.end <= selectedRange.end) {
        indices.add(index);
      }
    });
    return indices;
  }, [selectedRange, transcript]);

  const handleGenerateClip = useCallback(async () => {
    if (selectedRange.start !== null && selectedRange.end !== null) {
      playFeedbackSound('low');
      announceToScreenReader("Generando clip vertical... Por favor espere.");
      // Invocamos a la API de Electron (definida en preload.js)
      const result = await window.electronAPI.clipVideo({
        inputPath: videoPath,
        start: selectedRange.start,
        end: selectedRange.end
      });

      if (result.success) {
        announceToScreenReader("¡Clip generado con éxito!");
        onClipGenerated(result.outputPath);
      }
    }
  }, [selectedRange, playFeedbackSound, announceToScreenReader, videoPath, onClipGenerated]);

  return (
    <div className="transcript-editor-container stack">
      {/* Zona de Anuncios Accesibles (Visibilidad oculta pero activa para ARIA) */}
      <div id="lci-announcer" aria-live="polite" className="sr-only" role="status"></div>

      <header className="section-heading">
        <h2>Editor de Transcripción</h2>
        <p>Selecciona las palabras inicial y final para crear tu Short.</p>
      </header>

      <div className="transcript-box panel">
        <div className="transcript-content" role="region" aria-label="Texto del video">
          {transcript.map((item, index) => (
            <button
              key={`${item.word}-${index}`}
              className={`transcript-word ${selectedWordIndices.has(index) ? 'is-selected' : ''}`}
              onClick={() => handleWordClick(item)}
              onKeyDown={(e) => {
                const buttons = e.currentTarget.parentElement.querySelectorAll('.transcript-word');
                const currentIndex = Array.from(buttons).indexOf(e.currentTarget);
                
                if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
                  e.preventDefault();
                  buttons[currentIndex + 1].focus();
                } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                  e.preventDefault();
                  buttons[currentIndex - 1].focus();
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  buttons[0].focus();
                } else if (e.key === 'End') {
                  e.preventDefault();
                  buttons[buttons.length - 1].focus();
                }
              }}
              aria-label={`Palabra: ${item.word} en tiempo ${Math.round(item.start)} segundos`}
            >
              {item.word}
            </button>
          ))}
        </div>
      </div>

      <div className="editor-controls row">
        <button 
          onClick={() => setSelectedRange({ start: null, end: null })}
          className="button button-secondary"
        >
          Limpiar selección
        </button>
        
        <button 
          onClick={handleGenerateClip}
          disabled={!selectedRange.start || !selectedRange.end}
          className="button button-primary"
          aria-label="Generar Short de la selección actual"
        >
          Generar Short Vertical
        </button>
      </div>

      <style jsx>{`
        .transcript-content {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          max-height: 60vh;
          max-height: min(60vh, 500px);
          overflow-y: auto;
          padding: 1rem;
        }
        .transcript-word {
          background: none;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.5rem 0.6rem;
          border-radius: 4px;
          transition: all 0.2s;
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .transcript-word:hover, .transcript-word:focus {
          background: var(--primary-light);
          border-color: var(--primary);
          outline: none;
        }
        .transcript-word.is-selected {
          background: var(--primary);
          color: var(--text-on-primary);
          border-color: var(--primary-dark);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default AccessibleTranscriptEditor;
