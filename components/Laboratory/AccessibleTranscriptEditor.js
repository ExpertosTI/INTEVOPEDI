import React, { useState, useEffect, useRef } from 'react';

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

  // Anunciar cambios de estado para lectores de pantalla
  const announceToScreenReader = (message) => {
    const announcement = document.getElementById('lci-announcer');
    if (announcement) {
      announcement.textContent = message;
    }
  };

  const handleWordClick = async (word) => {
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
  };

  const playFeedbackSound = (type) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(type === 'high' ? 880 : type === 'mid' ? 440 : 220, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  };

  const handleGenerateClip = async () => {
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
  };

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
              className={`transcript-word ${selectedRange.start <= item.start && selectedRange.end >= item.end ? 'is-selected' : ''}`}
              onClick={() => handleWordClick(item)}
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
          max-height: 400px;
          overflow-y: auto;
          padding: 1rem;
        }
        .transcript-word {
          background: none;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .transcript-word:hover, .transcript-word:focus {
          background: var(--primary-light);
          border-color: var(--primary);
          outline: none;
        }
        .transcript-word.is-selected {
          background: var(--primary);
          color: white;
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
