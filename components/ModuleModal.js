'use client';

import { useState, useTransition } from 'react';
import { ModuleQuiz } from './ModuleQuiz';
import { submitModuleQuizAction } from '@/app/actions';

export function ModuleModal({ module, enrollmentId, referenceCode, onClose, onComplete }) {
  const [view, setView] = useState('lesson'); // 'lesson' or 'quiz'
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const simulateMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/^# (.*$)/gm, '<h1 class="h2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="h3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="h4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
  };

  const handleSubmitQuiz = (answers) => {
    const formData = new FormData();
    formData.append('enrollmentId', enrollmentId);
    formData.append('moduleId', module.id);
    formData.append('referenceCode', referenceCode);
    formData.append('answers', JSON.stringify(answers));

    startTransition(async () => {
      const resp = await submitModuleQuizAction(formData);
      setResult(resp || { success: false, message: 'Ocurrió un error en la evaluación.' });
      if (resp?.success) {
        if (onComplete) onComplete();
      }
    });
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="panel panel-dark stack" style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'transparent',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '1.5rem',
          border: 'none',
          cursor: 'pointer'
        }}>×</button>

        <div className="inline-actions" style={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          paddingBottom: '1rem',
          marginBottom: '2rem'
        }}>
          <button 
            className={`button ${view === 'lesson' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => { setView('lesson'); setResult(null); }}
          >
            Lección
          </button>
          <button 
            className={`button ${view === 'quiz' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setView('quiz')}
          >
            Evaluación
          </button>
        </div>

        {view === 'lesson' ? (
          <article className="stack lesson-content">
            <div dangerouslySetInnerHTML={{ __html: simulateMarkdown(module.content || module.description) }} />
            <div className="inline-actions" style={{ marginTop: '2rem' }}>
              <button 
                className="button button-primary"
                onClick={() => setView('quiz')}
              >
                Comenzar evaluación
              </button>
            </div>
          </article>
        ) : (
          <div className="stack">
            {result ? (
              <div className={`banner ${result.success ? 'banner-primary' : 'banner-error'} stack text-center`}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{result.success ? '¡Excelente!' : 'Casi lo tienes'}</h3>
                <p>{result.message}</p>
                {result.success ? (
                  <button className="button button-primary" style={{ marginTop: '1rem' }} onClick={onClose}>Continuar curso</button>
                ) : (
                  <button className="button button-secondary" style={{ marginTop: '1rem' }} onClick={() => setResult(null)}>Reintentar</button>
                )}
              </div>
            ) : (
              <ModuleQuiz 
                quizData={module.quizData} 
                onSubmit={handleSubmitQuiz} 
                isPending={isPending} 
              />
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--brand-primary);
        }
        .lesson-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
        }
        .lesson-content li {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
