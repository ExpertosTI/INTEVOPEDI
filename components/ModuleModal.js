'use client';

import { useState, useTransition } from 'react';
import { ModuleQuiz } from './ModuleQuiz';
import { submitModuleQuizAction } from '@/app/actions';
import * as Icons from './Icons';

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
      inset: 0,
      background: 'rgba(5, 10, 20, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
      <div className="panel stack" style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'rgba(255,255,255,0.05)',
          color: 'var(--text)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--glass-border)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>×</button>

        <div className="stack" style={{ gap: '0.5rem', marginBottom: '2rem' }}>
          <span className="eyebrow">Módulo en curso</span>
          <h2 className="h2" style={{ margin: 0 }}>{module.title}</h2>
        </div>

        <div className="category-filters" style={{ 
          marginBottom: '2rem',
          borderBottom: '1px solid var(--glass-border)', 
          paddingBottom: '1rem'
        }}>
          <button 
            className={`category-chip ${view === 'lesson' ? 'active' : ''}`}
            onClick={() => { setView('lesson'); setResult(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Icons.BookOpen size={16} /> Lección
          </button>
          <button 
            className={`category-chip ${view === 'quiz' ? 'active' : ''}`}
            onClick={() => { setView('quiz'); setResult(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Icons.TrendingUp size={16} /> Evaluación
          </button>
        </div>

        {view === 'lesson' ? (
          <article className="stack lesson-content" style={{ animation: 'fadeIn 0.4s var(--ease)' }}>
            <div dangerouslySetInnerHTML={{ __html: simulateMarkdown(module.content || module.description) }} />
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="button button-primary"
                onClick={() => setView('quiz')}
                style={{ borderRadius: 'var(--radius-full)', padding: '0 32px' }}
              >
                Comenzar evaluación <Icons.ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </article>
        ) : (
          <div className="stack" style={{ animation: 'fadeIn 0.4s var(--ease)' }}>
            {result ? (
              <div className="stack text-center" style={{ padding: '3rem 1rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', background: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                  color: result.success ? 'var(--level-beginner)' : 'var(--level-advanced)'
                }}>
                  {result.success ? <Icons.CheckCircle size={48} /> : <span>⚠️</span>}
                </div>
                <h3 className="h2">{result.success ? '¡Excelente Trabajo!' : 'Casi lo tienes'}</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{result.message}</p>
                
                <div className="inline-actions" style={{ justifyContent: 'center' }}>
                  {result.success ? (
                    <button className="button button-primary" onClick={onClose}>Continuar curso</button>
                  ) : (
                    <button className="button button-secondary" onClick={() => setResult(null)}>Reintentar evaluación</button>
                  )}
                </div>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }
        .lesson-content p {
          margin-bottom: 1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          font-size: 1.05rem;
        }
        .lesson-content li {
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
