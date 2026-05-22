'use client';

import { useState } from 'react';
import { ModuleModal } from './ModuleModal';
import * as Icons from './Icons';

export function LearningPath({ modulesProgress = [], enrollmentId, referenceCode, isPreview = false }) {
  const [selectedModule, setSelectedModule] = useState(null);

  const totalModules = modulesProgress.length;
  const completedModules = isPreview ? 0 : modulesProgress.filter(m => m.completed).length;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="learning-path" style={{ padding: '0 10px' }}>
      {!isPreview && (
        <div className="learning-path-header stack" style={{ 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <div className="row-between">
            <span className="eyebrow" style={{ color: 'var(--primary)' }}>Tu ruta de éxito</span>
            <strong style={{ fontSize: '1.2rem' }}>{progressPercent}%</strong>
          </div>
          <div className="progress-line" style={{ height: '6px', borderRadius: '3px', overflow: 'hidden' }} aria-label={`Progreso actual ${progressPercent}%`}>
            <span style={{ 
              width: `${progressPercent}%`,
              background: 'var(--primary-gradient)',
              boxShadow: '0 0 10px var(--primary-ring)'
            }} />
          </div>
        </div>
      )}

      <div className="learning-path-timeline">
        {modulesProgress.map((item, index) => {
          const isCompleted = isPreview ? false : item.completed;
          const isNext = isPreview ? index === 0 : (!isCompleted && (index === 0 || modulesProgress[index - 1].completed));
          let statusClass = 'pending';
          if (isCompleted) statusClass = 'completed';
          if (isNext) statusClass = 'active';

          const moduleData = item.module || item;

          return (
            <div key={moduleData.id || index} className={`learning-path-node ${statusClass}`}>
              <div className="learning-path-connector" />
              <div className="learning-path-icon" 
                onClick={() => !isPreview && setSelectedModule(moduleData)} 
                style={{ 
                  cursor: isPreview ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: isNext ? '0 0 15px var(--primary-ring)' : 'none'
                }}>
                {isCompleted ? <Icons.CheckCircle size={16} /> : isNext ? <Icons.Play size={14} style={{ marginLeft: '2px' }} /> : <span style={{ opacity: 0.5 }}>•</span>}
              </div>
              
              <article className={`panel stack ${isCompleted ? 'module-completed' : ''}`} 
                onClick={() => !isPreview && setSelectedModule(moduleData)}
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid var(--glass-border)',
                  transition: 'all 0.3s var(--ease)',
                  opacity: isNext || isCompleted ? 1 : 0.7,
                  transform: isNext ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isNext ? 'var(--shadow-premium)' : 'var(--shadow-sm)',
                  cursor: isPreview ? 'default' : 'pointer'
                }}
              >
                <div className="row-between">
                  <strong className="eyebrow" style={{ opacity: 0.6 }}>Módulo {moduleData.order || index + 1}</strong>
                  {isNext && !isPreview && <span className="badge badge-confirmed" style={{ background: 'var(--primary)', color: '#fff' }}>ACTUAL</span>}
                </div>
                <h3>{moduleData.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{moduleData.description}</p>
                
                <div className="course-card-meta" style={{ marginTop: '0.5rem' }}>
                  {moduleData.durationMinutes && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <Icons.TrendingUp size={12} /> {moduleData.durationMinutes} min
                    </span>
                  )}
                </div>

                {!isPreview && (
                  <button 
                    onClick={() => setSelectedModule(moduleData)}
                    className={`button ${item.completed ? 'button-secondary' : 'button-primary'}`}
                    style={{ alignSelf: 'flex-start', marginTop: '1rem', borderRadius: 'var(--radius-full)', height: '36px', padding: '0 20px', fontSize: '0.8rem' }}
                  >
                    {item.completed ? 'Repasar lección' : isNext ? 'Continuar camino' : 'Ver contenido'}
                  </button>
                )}
              </article>
            </div>
          );
        })}
      </div>

      {selectedModule && (
        <ModuleModal 
          module={selectedModule} 
          enrollmentId={enrollmentId}
          referenceCode={referenceCode}
          onClose={() => setSelectedModule(null)}
          onComplete={() => {
            // Se refresca por servidor mediante revalidatePath en la acción
          }}
        />
      )}
    </div>
  );
}
