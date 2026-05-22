'use client';

import React, { useState, useEffect } from 'react';
import AccessibleTranscriptEditor from '@/components/Laboratory/AccessibleTranscriptEditor';

/**
 * LaboratorioPage
 * Punto de entrada para el Laboratorio de Contenido Inclusivo.
 * Gestiona el flujo completo: URL YouTube -> Descarga Local -> Transcripción -> Clipping.
 */
export default function LaboratorioPage() {
  const [isElectron, setIsElectron] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [status, setStatus] = useState('IDLE'); // IDLE, DOWNLOADING, TRANSCRIBING, READY, CLIPPING, DONE
  const [videoData, setVideoData] = useState({ path: null, transcript: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Detectar si estamos en Electron mediante la API expuesta en preload.js
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsElectron(true);
    }
  }, []);

  const handleStartProcess = async () => {
    if (!youtubeUrl) return;

    try {
      setStatus('DOWNLOADING');
      setError(null);

      // 1. Descargar video (vía IPC)
      const downloadResult = await window.electronAPI.downloadVideo(youtubeUrl);
      if (!downloadResult.success) throw new Error(downloadResult.error);

      // 2. Transcribir (vía IPC)
      setStatus('TRANSCRIBING');
      const transcriptionResult = await window.electronAPI.transcribeVideo(downloadResult.path);
      if (!transcriptionResult.success) throw new Error(transcriptionResult.error);

      setVideoData({
        path: downloadResult.path,
        transcript: transcriptionResult.transcript
      });
      setStatus('READY');
      
    } catch (err) {
      setError(err.message);
      setStatus('IDLE');
    }
  };

  if (!isElectron) {
    return (
      <div className="section spaced-page">
        <div className="shell panel stack">
          <h1>Laboratorio de Contenido Inclusivo</h1>
          <p className="alert alert-warning">
            Esta herramienta requiere la <strong>Aplicación de Escritorio de INTEVOPEDI</strong> para funcionar, 
            ya que utiliza el procesamiento local de tu computadora para no saturar el servidor del instituto.
          </p>
          <a href="#" className="button button-primary">Descargar para Windows / Mac</a>
        </div>
      </div>
    );
  }

  return (
    <div className="section spaced-page laboratory-hub">
      <div className="shell stack">
        <header className="section-heading">
          <span className="eyebrow">Proyecto Institucional</span>
          <h1>Hub del Generador de Contenido</h1>
          <p>Convierte tus transmisiones en vivo en piezas de alto impacto de forma accesible.</p>
        </header>

        {status === 'IDLE' && (
          <article className="panel stack">
            <label htmlFor="yt-url">Enlace de YouTube:</label>
            <div className="row row-responsive">
              <input 
                id="yt-url"
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="input"
              />
              <button 
                onClick={handleStartProcess}
                className="button button-primary"
                disabled={!youtubeUrl}
              >
                Empezar Procesamiento
              </button>
            </div>
            {error && (
  <p 
    className="text-error" 
    role="alert" 
    aria-live="assertive"
    aria-atomic="true"
  >
    Error: {error}
  </p>
)}
          </article>
        )}

        {(status === 'DOWNLOADING' || status === 'TRANSCRIBING') && (
          <article className="panel stack text-center">
            <div className="spinner"></div>
            <h2>{status === 'DOWNLOADING' ? 'Descargando Video...' : 'Generando Transcripción...'}</h2>
            <p>Este proceso ocurre localmente en tu PC para mayor privacidad y velocidad.</p>
          </article>
        )}

        {status === 'READY' && (
          <AccessibleTranscriptEditor 
            videoPath={videoData.path}
            transcript={videoData.transcript}
            onClipGenerated={async (outputPath) => {
              setStatus('DONE');
              
              // Sincronizar métricas con el servidor principal
              try {
                await fetch('/api/laboratorio/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    videoSourceUrl: youtubeUrl,
                    clipDurationSec: 60, // Estimación o cálculo real
                    platform: 'Laboratorio LCI',
                    actionType: 'GENERATED',
                    metadata: { outputPath }
                  })
                });
              } catch (err) {
                console.error('Error syncing metrics:', err);
              }
            }}
          />
        )}

        {status === 'DONE' && (
          <article className="panel panel-success stack">
            <h2>¡Tu Short está listo!</h2>
            <p>El video se ha guardado en tu carpeta de descargas de forma vertical.</p>
            <button onClick={() => setStatus('IDLE')} className="button button-secondary">
              Crear otro clip
            </button>
          </article>
        )}
      </div>

      <style jsx>{`
        .laboratory-hub {
          background: var(--surface-light);
          min-height: 80vh;
        }
        .row-responsive {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .row-responsive .input {
          flex: 1;
          min-width: 250px;
        }
        .row-responsive .button {
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .row-responsive {
            flex-direction: column;
          }
          .row-responsive .input,
          .row-responsive .button {
            width: 100%;
          }
        }
        .text-error { color: var(--error); margin-top: 1rem; }
        .spinner {
          border: 4px solid var(--spinner-track);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border-left-color: var(--primary);
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
