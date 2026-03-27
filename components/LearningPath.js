'use client';

import { useState, useTransition } from 'react';
import { toggleModuleProgress } from '@/app/actions';
import { ModuleModal } from './ModuleModal';

export function LearningPath({ modulesProgress = [], enrollmentId, referenceCode, isPreview = false }) {
  const [selectedModule, setSelectedModule] = useState(null);

  const totalModules = modulesProgress.length;
  const completedModules = isPreview ? 0 : modulesProgress.filter(m => m.completed).length;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="learning-path">
      {!isPreview && (
        <div className="learning-path-header stack">
          <div className="row-between">
            <span className="eyebrow">Tu progreso general</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="progress-line" aria-label={`Progreso actual ${progressPercent}%`}>
            <span style={{ width: `${progressPercent}%` }} />
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
              <div className="learning-path-icon" onClick={() => !isPreview && setSelectedModule(moduleData)} style={{ cursor: isPreview ? 'default' : 'pointer' }}>
                {isCompleted ? '✓' : isNext ? '▶' : '·'}
              </div>
              <article className={`panel stack ${isCompleted ? 'module-completed' : ''}`}>
                <div className="row-between">
                  <strong className="eyebrow">Módulo {moduleData.order || index + 1}</strong>
                  {isNext && !isPreview && <span className="badge badge-pending">Siguiente paso</span>}
                </div>
                <h3>{moduleData.title}</h3>
                <p>{moduleData.description}</p>
                
                {moduleData.durationMinutes && (
                  <p className="helper">Duración estimada: {moduleData.durationMinutes} min</p>
                )}

                {!isPreview && (
                  <button 
                    onClick={() => setSelectedModule(moduleData)}
                    className={`button ${item.completed ? 'button-secondary' : 'button-primary'}`}
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {item.completed ? 'Ver lección de nuevo' : isNext ? 'Comenzar evaluación' : 'Ver detalles'}
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
