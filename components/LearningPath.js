'use client';

import { useTransition } from 'react';
import { toggleModuleProgress } from '@/app/actions';

export function LearningPath({ modulesProgress = [], enrollmentId, referenceCode, isPreview = false }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (moduleId, currentStatus) => {
    if (isPreview) return;
    
    startTransition(() => {
      const formData = new FormData();
      formData.append('enrollmentId', enrollmentId);
      formData.append('moduleId', moduleId);
      formData.append('referenceCode', referenceCode);
      formData.append('completed', currentStatus ? 'false' : 'true');
      toggleModuleProgress(formData);
    });
  };

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

          return (
            <div key={item.id || item.module?.id || index} className={`learning-path-node ${statusClass}`}>
              <div className="learning-path-connector" />
              <div className="learning-path-icon">
                {isCompleted ? '✓' : isNext ? '▶' : '·'}
              </div>
              <article className={`panel stack ${isCompleted ? 'module-completed' : ''}`}>
                <div className="row-between">
                  <strong className="eyebrow">Módulo {item.module?.order || item.order || index + 1}</strong>
                  {isNext && !isPreview && <span className="badge badge-pending">Siguiente paso</span>}
                </div>
                <h3>{item.module?.title || item.title}</h3>
                <p>{item.module?.description || item.description}</p>
                
                {item.module?.durationMinutes || item.durationMinutes ? (
                  <p className="helper">Duración estimada: {item.module?.durationMinutes || item.durationMinutes} min</p>
                ) : null}

                {!isPreview && (
                  <button 
                    onClick={() => handleToggle(item.moduleId || item.id, item.completed)}
                    className={`button ${item.completed ? 'button-ghost' : 'button-primary'}`}
                    disabled={isPending}
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {isPending ? 'Actualizando...' : item.completed ? 'Deshacer completado' : 'Marcar como completado'}
                  </button>
                )}
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
