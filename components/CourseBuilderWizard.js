'use client';

import { useState, useRef, useEffect } from 'react';
import { useAssistant } from '@/lib/useAssistant';
import { formatAndSanitizeExtendedMarkdown } from '@/lib/sanitize';
import {
  Sparkles,
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Video,
  BookOpen,
  Mic,
  Clock,
  Layers
} from '@/components/Icons';

/**
 * CourseBuilderWizard
 * Guía paso-a-paso para crear cursos con IA.
 * Pasos: 1) Básico | 2) Objetivo | 3) Estructura | 4) Recursos | 5) Confirmación
 */
export function CourseBuilderWizard({ onCourseCreated, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objective: '',
    moduleCount: 3,
    moduleDuration: 2,
    totalHours: 6,
    modality: 'VIRTUAL', // VIRTUAL, HYBRID, ASYNC
    courseMaterials: []
  });

  const { isPending, messages, sendPrompt, clearMessages } = useAssistant();
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAi, setShowAi] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Generar prompt para IA según el paso
  const generateAiPrompt = () => {
    if (step === 2) {
      return `Mejora este objetivo de curso (sé conciso y medible): "${formData.objective}"`;
    }
    if (step === 3) {
      return `Diseña ${formData.moduleCount} módulos de ${formData.moduleDuration}h cada uno para el curso "${formData.title}" con objetivo: "${formData.objective}". Proporciona títulos y descripción breve de cada módulo.`;
    }
    if (step === 4) {
      return `Sugiere 5-7 materiales de apoyo (PDFs, videos, ejercicios) para un curso de ${formData.totalHours}h llamado "${formData.title}". Sé específico con tipos y temas.`;
    }
    return '';
  };

  const handleAiRequest = async () => {
    const prompt = generateAiPrompt();
    if (!prompt) return;
    setAiPrompt(prompt);
    clearMessages();
    await sendPrompt(prompt, 'general', null);
    setShowAi(true);
  };

  const handleNextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateCourse = async () => {
    // TODO: enviar a acción del servidor
    console.log('Crear curso:', formData);
    onCourseCreated?.(formData);
  };

  const stepTitles = [
    'Información básica',
    'Objetivo del curso',
    'Estructura de módulos',
    'Materiales de apoyo',
    'Confirmación'
  ];

  return (
    <div className="course-builder-wizard panel stack">
      {/* Encabezado con progreso */}
      <div className="wizard-header">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Crear curso</span>
            <h2>{stepTitles[step - 1]}</h2>
            <p className="helper">Paso {step} de 5. La IA te ayudará en cada paso.</p>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
            aria-label="Cancelar"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="progress-bar-wizard">
          <div
            className="progress-bar-fill"
            style={{ width: `${(step / 5) * 100}%` }}
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={5}
            role="progressbar"
          />
        </div>
      </div>

      <div className="wizard-content row">
        {/* Sección formulario */}
        <div className="wizard-form flex-1">
          {step === 1 && (
            <fieldset className="stack">
              <legend>Información básica del curso</legend>
              <label>
                <strong>Título del curso *</strong>
                <input
                  type="text"
                  placeholder="ej: IA como Apoyo a la Discapacidad Visual"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input"
                  required
                />
              </label>
              <label>
                <strong>Descripción breve *</strong>
                <textarea
                  placeholder="Describe el contenido y quién es el público objetivo"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input"
                  rows={4}
                  required
                />
              </label>
              <label>
                <strong>Modalidad *</strong>
                <select
                  value={formData.modality}
                  onChange={(e) => handleInputChange('modality', e.target.value)}
                  className="input"
                >
                  <option value="VIRTUAL">Virtual (Zoom/Teams)</option>
                  <option value="HYBRID">Híbrida (Presencial + Online)</option>
                  <option value="ASYNC">Asincrónica (Autoestudio)</option>
                </select>
              </label>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="stack">
              <legend>Objetivo del curso</legend>
              <label>
                <strong>¿Qué aprenderán los participantes? *</strong>
                <textarea
                  placeholder="Describe los resultados de aprendizaje específicos"
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  className="input"
                  rows={5}
                  required
                />
              </label>
              <div className="helper">
                💡 Usa verbos medibles: conocer, comprender, aplicar, analizar, crear.
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="stack">
              <legend>Estructura de módulos</legend>
              <label>
                <strong>Número de módulos *</strong>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.moduleCount}
                  onChange={(e) => handleInputChange('moduleCount', parseInt(e.target.value))}
                  className="input"
                />
              </label>
              <label>
                <strong>Duración por módulo (horas) *</strong>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  max={24}
                  value={formData.moduleDuration}
                  onChange={(e) => handleInputChange('moduleDuration', parseFloat(e.target.value))}
                  className="input"
                />
              </label>
              <div className="stat-card">
                <span className="eyebrow">Total estimado</span>
                <strong className="stat-value">
                  {(formData.moduleCount * formData.moduleDuration).toFixed(1)}h
                </strong>
                <p className="helper">Ajusta según sea necesario</p>
              </div>
            </fieldset>
          )}

          {step === 4 && (
            <fieldset className="stack">
              <legend>Materiales de apoyo</legend>
              <p className="helper">
                Los materiales se organizarán por módulo. Usa la IA para sugerencias específicas.
              </p>
              <div className="material-types">
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> Apuntes PDF estructurados</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Video size={16} /> Grabaciones y sesiones en video</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><BookOpen size={16} /> Ejercicios prácticos paso a paso</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Mic size={16} /> Audios y descripciones habladas</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Layers size={16} /> Guías y material complementario</span>
                </label>
              </div>
            </fieldset>
          )}

          {step === 5 && (
            <fieldset className="stack">
              <legend>Resumen del curso</legend>
              <div className="summary-card panel">
                <div className="summary-row">
                  <span className="label">Título:</span>
                  <strong>{formData.title || '—'}</strong>
                </div>
                <div className="summary-row">
                  <span className="label">Modalidad:</span>
                  <strong>
                    {formData.modality === 'VIRTUAL' && 'Virtual'}
                    {formData.modality === 'HYBRID' && 'Híbrida'}
                    {formData.modality === 'ASYNC' && 'Asincrónica'}
                  </strong>
                </div>
                <div className="summary-row">
                  <span className="label">Duración:</span>
                  <strong>{(formData.moduleCount * formData.moduleDuration).toFixed(1)}h en {formData.moduleCount} módulos</strong>
                </div>
                <div className="summary-row">
                  <span className="label">Objetivo:</span>
                  <p>{formData.objective || '—'}</p>
                </div>
              </div>
              <p className="helper text-center">
                ✅ Verificado. Listo para crear el curso en la base de datos.
              </p>
            </fieldset>
          )}
        </div>

        {/* Sección IA */}
        {showAi && (
          <div className="wizard-ai flex-1 stack panel" style={{ maxHeight: '500px', overflow: 'auto' }}>
            <div className="row-between">
              <strong>💡 Sugerencias de IA</strong>
              <button
                type="button"
                className="text-btn"
                onClick={() => setShowAi(false)}
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="ai-chat" ref={chatRef} aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`msg msg-${m.role}`}>
                  {m.role === 'assistant' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatAndSanitizeExtendedMarkdown(m.content)
                      }}
                    />
                  )}
                  {m.role === 'user' && <p>{m.content}</p>}
                </div>
              ))}
              {isPending && <div className="spinner-inline">Generando...</div>}
            </div>
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="wizard-footer row-between">
        <div className="button-group">
          <button
            type="button"
            className="button button-secondary"
            onClick={handlePrevStep}
            disabled={step === 1}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Atrás</span>
          </button>
          <button
            type="button"
            className="button button-secondary-outline"
            onClick={handleAiRequest}
            disabled={isPending}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} />
            <span>Sugerir con IA</span>
          </button>
        </div>

        <div className="button-group">
          {step < 5 ? (
            <button
              type="button"
              className="button button-primary"
              onClick={handleNextStep}
              disabled={
                (step === 1 && !formData.title) ||
                (step === 2 && !formData.objective)
              }
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Siguiente</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button button-secondary"
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={handleCreateCourse}
                disabled={isPending}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={16} />
                <span>Crear curso</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
