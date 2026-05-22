'use client';

import { useState } from 'react';

export function ModuleQuiz({ quizData = [], onSubmit, isPending }) {
  const [answers, setAnswers] = useState(new Array(quizData.length).fill(null));
  const [error, setError] = useState(null);

  const handleOptionChange = (qIndex, oIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = oIndex;
    setAnswers(newAnswers);
  };

  const isComplete = answers.every(a => a !== null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) {
      setError('Por favor responde todas las preguntas antes de enviar.');
      return;
    }
    setError(null);
    onSubmit(answers);
  };

  if (!quizData?.length) return <p>No hay preguntas para este módulo.</p>;

  return (
    <div className="module-quiz stack">
      <div className="section-heading">
        <span className="eyebrow">Evaluación</span>
        <h2>Validemos lo aprendido</h2>
        <p>Selecciona la respuesta correcta para aprobar el módulo.</p>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        {quizData.map((q, qIndex) => (
          <fieldset key={qIndex} className="panel panel-ghost stack" style={{ border: 'none', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
            <legend className="eyebrow" style={{ float: 'none', marginBottom: '1rem' }}>Pregunta {qIndex + 1}</legend>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '1rem' }}>{q.question}</p>
            <div className="stack" style={{ gap: '0.75rem' }}>
              {q.options.map((opt, oIndex) => (
                <label key={oIndex} className="quiz-option-label" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '0.75rem', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: answers[qIndex] === oIndex ? 'rgba(var(--brand-primary-rgb), 0.1)' : 'transparent',
                  borderColor: answers[qIndex] === oIndex ? 'var(--brand-primary)' : 'rgba(255,255,255,0.1)'
                }}>
                  <input
                    type="radio"
                    name={`q-${qIndex}`}
                    value={oIndex}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleOptionChange(qIndex, oIndex)}
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {error && <div className="banner banner-error">{error}</div>}

        <div className="inline-actions" style={{ marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="button button-primary" 
            disabled={!isComplete || isPending}
          >
            {isPending ? 'Validando...' : 'Finalizar evaluación'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .quiz-option-label:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
