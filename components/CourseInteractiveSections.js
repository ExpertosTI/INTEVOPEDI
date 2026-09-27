'use client';

import { useState } from 'react';

export function CourseVideoPreview({ videoId, thumbnail, title }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying && videoId) {
    return (
      <div className="clp-video-player">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&hl=es&rel=0`}
          title={`Video de presentación - ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="clp-iframe"
        />
      </div>
    );
  }

  return (
    <div className="clp-video" onClick={() => setIsPlaying(true)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsPlaying(true)} aria-label="Reproducir presentación del curso">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={`Presentación de ${title}`}
        width="800"
        height="450"
        className="clp-video-thumb"
      />
      <button className="clp-play-btn" type="button" aria-label="Reproducir video de presentación">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <div className="clp-video-caption">
        <span>▶ Ver video de presentación (1 min)</span>
      </div>
    </div>
  );
}

export function CourseCurriculum({ modules = [] }) {
  // Open the first unit by default
  const [openUnits, setOpenUnits] = useState({ 0: true });

  const toggleUnit = (index) => {
    setOpenUnits((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getIconForType = (type) => {
    if (type === 'reading') {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    }
    if (type === 'quiz' || type === 'practice') {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  };

  return (
    <div className="clp-units">
      {modules.map((mod, idx) => {
        const isOpen = !!openUnits[idx];
        const lessons = mod.lessons || [];
        const countText = `${lessons.length || mod.lessonsCount || 4} clases`;

        return (
          <div key={mod.id || idx} className={`clp-unit ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="clp-unit-hd"
              onClick={() => toggleUnit(idx)}
              aria-expanded={isOpen}
            >
              <div className="clp-unit-title-group">
                <span className={`clp-unit-chevron ${isOpen ? 'rotated' : ''}`}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
                <span className="clp-unit-name">
                  <strong>{mod.title.includes('Unidad') ? '' : `Unidad ${mod.order || idx + 1}. `}</strong>
                  {mod.title}
                </span>
              </div>
              <span className="clp-unit-meta">{countText}</span>
            </button>

            {isOpen && (
              <div className="clp-unit-body">
                {mod.description && (
                  <p className="clp-unit-desc">{mod.description}</p>
                )}
                <ul className="clp-lesson-list">
                  {lessons.length > 0 ? (
                    lessons.map((lesson, lIdx) => (
                      <li key={lIdx} className="clp-lesson-item">
                        <span className={`clp-lesson-icon ${lesson.type || 'video'}`}>
                          {getIconForType(lesson.type)}
                        </span>
                        <span className="clp-lesson-title">{lesson.title}</span>
                        {lesson.duration && (
                          <span className="clp-lesson-dur">{lesson.duration}</span>
                        )}
                        <span className="clp-lesson-free">Gratis</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="clp-lesson-item">
                        <span className="clp-lesson-icon video">{getIconForType('video')}</span>
                        <span className="clp-lesson-title">Introducción a los conceptos clave</span>
                        <span className="clp-lesson-dur">15 min</span>
                        <span className="clp-lesson-free">Gratis</span>
                      </li>
                      <li className="clp-lesson-item">
                        <span className="clp-lesson-icon reading">{getIconForType('reading')}</span>
                        <span className="clp-lesson-title">Material de estudio y lecturas guiadas</span>
                        <span className="clp-lesson-dur">20 min</span>
                        <span className="clp-lesson-free">Gratis</span>
                      </li>
                      <li className="clp-lesson-item">
                        <span className="clp-lesson-icon practice">{getIconForType('practice')}</span>
                        <span className="clp-lesson-title">Evaluación práctica y proyecto de unidad</span>
                        <span className="clp-lesson-dur">30 min</span>
                        <span className="clp-lesson-free">Gratis</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
