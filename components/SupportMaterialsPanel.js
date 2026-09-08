'use client';

import { useState } from 'react';
import {
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle,
  Accessibility,
  TrendingUp,
  Video,
  Zap,
  Volume2
} from '@/components/Icons';

/**
 * SupportMaterialsPanel
 * Panel accesible de materiales de apoyo para cursos.
 * Incluye: guías de usuario, FAQ, templates, y recursos por módulo.
 */
export function SupportMaterialsPanel({ courseId, course }) {
  const [activeTab, setActiveTab] = useState('guide');
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <section className="support-materials-panel stack">
      <div className="panel-header">
        <div className="stack">
          <span className="eyebrow">Centro de apoyo</span>
          <h3>Materiales y guías para {course?.title || 'este curso'}</h3>
          <p className="helper">
            Todo está organizado en formatos accesibles. Descarga lo que necesites.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
          aria-selected={activeTab === 'guide'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <BookOpen size={16} />
          <span>Guía de usuario</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
          aria-selected={activeTab === 'resources'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Layers size={16} />
          <span>Recursos por módulo</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
          aria-selected={activeTab === 'faq'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <HelpCircle size={16} />
          <span>Preguntas frecuentes</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          aria-selected={activeTab === 'templates'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={16} />
          <span>Plantillas</span>
        </button>
      </div>

      {/* TAB: Guía de usuario */}
      {activeTab === 'guide' && (
        <div className="tab-content stack">
          <article className="accordion">
            <button
              className={`accordion-header ${expandedSection === 'getting-started' ? 'expanded' : ''}`}
              onClick={() => toggleSection('getting-started')}
              aria-expanded={expandedSection === 'getting-started'}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} />
                <strong>Primeros pasos en la plataforma</strong>
              </span>
              <span className="icon">
                {expandedSection === 'getting-started' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {expandedSection === 'getting-started' && (
              <div className="accordion-body stack">
                <ol className="ordered-list">
                  <li>
                    <strong>Accede a tu cuenta</strong>
                    <p>
                      Usa tu correo y contraseña para ingresar al campus. Si olvidaste tu contraseña, usa el enlace
                      "Recuperar acceso" en la página de login.
                    </p>
                  </li>
                  <li>
                    <strong>Explora el panel principal</strong>
                    <p>
                      Verás tus cursos activos, progreso y próximas sesiones. Cada curso muestra un progreso visual
                      en barras y porcentajes.
                    </p>
                  </li>
                  <li>
                    <strong>Abre el curso</strong>
                    <p>
                      Haz clic en cualquier curso para ver sus módulos, descargar materiales y acceder a ejercicios.
                    </p>
                  </li>
                  <li>
                    <strong>Descarga materiales sin conexión</strong>
                    <p>
                      Antes de una sesión, descarga PDFs, apuntes y videos para estudiar sin internet.
                    </p>
                  </li>
                </ol>
              </div>
            )}
          </article>

          <article className="accordion">
            <button
              className={`accordion-header ${expandedSection === 'accessibility' ? 'expanded' : ''}`}
              onClick={() => toggleSection('accessibility')}
              aria-expanded={expandedSection === 'accessibility'}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Accessibility size={18} />
                <strong>Características de accesibilidad inclusiva</strong>
              </span>
              <span className="icon">
                {expandedSection === 'accessibility' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {expandedSection === 'accessibility' && (
              <div className="accordion-body stack">
                <div className="feature-block">
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Volume2 size={16} /> Lector de pantalla
                  </strong>
                  <p>
                    Todos nuestros materiales son compatibles con lectores de pantalla. Usa NVDA (Windows), JAWS o
                    VoiceOver (Mac/iOS).
                  </p>
                </div>
                <div className="feature-block">
                  <strong>🎨 Alto contraste</strong>
                  <p>
                    En el encabezado, activa el alternador de tema para mejorar la legibilidad y contraste en cualquier dispositivo.
                  </p>
                </div>
                <div className="feature-block">
                  <strong>📱 Tamaño de texto adaptable</strong>
                  <p>
                    Usa Ctrl + Plus para aumentar el tamaño del texto en tu navegador. Todos nuestros contenidos se
                    adaptan automáticamente sin romper el diseño.
                  </p>
                </div>
                <div className="feature-block">
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} /> Transcripciones de audio y video
                  </strong>
                  <p>
                    Todos los videos incluyen subtítulos y transcripciones descargables en formato accesible para personas con sordera o
                    preferencia de lectura.
                  </p>
                </div>
              </div>
            )}
          </article>

          <article className="accordion">
            <button
              className={`accordion-header ${expandedSection === 'progress' ? 'expanded' : ''}`}
              onClick={() => toggleSection('progress')}
              aria-expanded={expandedSection === 'progress'}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} />
                <strong>Seguimiento de progreso y certificación</strong>
              </span>
              <span className="icon">
                {expandedSection === 'progress' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {expandedSection === 'progress' && (
              <div className="accordion-body stack">
                <p>
                  Tu progreso se actualiza automáticamente. Puedes ver:
                </p>
                <ul className="bullet-list">
                  <li><strong>Módulos completados:</strong> marca de verificación verde cuando terminas cada módulo</li>
                  <li><strong>Porcentaje general:</strong> avance total del curso</li>
                  <li><strong>Certificado:</strong> al alcanzar 100%, tu certificado se genera automáticamente con código QR verificable</li>
                  <li><strong>Historial:</strong> revisa cuándo completaste cada sección</li>
                </ul>
              </div>
            )}
          </article>
        </div>
      )}

      {/* TAB: Recursos por módulo */}
      {activeTab === 'resources' && (
        <div className="tab-content stack">
          {(course?.modules && course.modules.length > 0 ? course.modules : [1, 2, 3]).map((moduleItem, index) => {
            const moduleNum = typeof moduleItem === 'object' ? (moduleItem.order || index + 1) : moduleItem;
            const moduleTitle = typeof moduleItem === 'object' ? moduleItem.title : `Módulo ${moduleNum}`;

            return (
              <article key={moduleNum} className="accordion">
                <button
                  className={`accordion-header ${expandedSection === `module-${moduleNum}` ? 'expanded' : ''}`}
                  onClick={() => toggleSection(`module-${moduleNum}`)}
                  aria-expanded={expandedSection === `module-${moduleNum}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={18} />
                    <strong>Módulo {moduleNum}: {moduleTitle}</strong>
                  </span>
                  <span className="icon">
                    {expandedSection === `module-${moduleNum}` ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {expandedSection === `module-${moduleNum}` && (
                  <div className="accordion-body stack">
                    <div className="resource-group">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={16} /> Apuntes y guías
                      </h5>
                      <ul className="resource-list">
                        <li>
                          <a href="#" className="resource-link">
                            Apuntes completos módulo {moduleNum}.pdf
                          </a>
                          <span className="resource-meta">(2.4 MB) accesible</span>
                        </li>
                        <li>
                          <a href="#" className="resource-link">
                            Guía de lectura rápida (resumen).pdf
                          </a>
                          <span className="resource-meta">(400 KB)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="resource-group">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Video size={16} /> Grabaciones y videos
                      </h5>
                      <ul className="resource-list">
                        <li>
                          <a href="#" className="resource-link">
                            Sesión en vivo grabada
                          </a>
                          <span className="resource-meta">+ transcripción descargable</span>
                        </li>
                      </ul>
                    </div>

                    <div className="resource-group">
                      <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={16} /> Ejercicios prácticos
                      </h5>
                      <ul className="resource-list">
                        <li>
                          <a href="#" className="resource-link">
                            Ejercicio 1 — Aplicación práctica
                          </a>
                          <span className="resource-meta">+ solución comentada</span>
                        </li>
                      </ul>
                    </div>

                    <button className="button button-secondary-outline full-width" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Download size={16} /> Descargar todo como ZIP
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* TAB: FAQ */}
      {activeTab === 'faq' && (
        <div className="tab-content stack">
          <article className="accordion">
            <button
              className={`accordion-header ${expandedSection === 'faq-1' ? 'expanded' : ''}`}
              onClick={() => toggleSection('faq-1')}
              aria-expanded={expandedSection === 'faq-1'}
            >
              <span>¿Puedo descargar los materiales para estudiar sin conexión?</span>
              <span className="icon">
                {expandedSection === 'faq-1' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {expandedSection === 'faq-1' && (
              <div className="accordion-body">
                <p>
                  Sí, todos los recursos y apuntes están disponibles para descargar en formatos estándar (PDF accesible, MP4, etc.). Puedes descargarlos en la sección "Recursos por módulo".
                </p>
              </div>
            )}
          </article>

          <article className="accordion">
            <button
              className={`accordion-header ${expandedSection === 'faq-2' ? 'expanded' : ''}`}
              onClick={() => toggleSection('faq-2')}
              aria-expanded={expandedSection === 'faq-2'}
            >
              <span>¿Dónde está mi certificado después de completar el curso?</span>
              <span className="icon">
                {expandedSection === 'faq-2' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {expandedSection === 'faq-2' && (
              <div className="accordion-body">
                <p>
                  Al alcanzar el 100% de progreso y aprobación, tu certificado se genera automáticamente con código de validación único y código QR. Puedes descargarlo en PDF e imprimirlo con calidad profesional.
                </p>
              </div>
            )}
          </article>

          <article className="accordion">
            <button
              className={`accordion-header ${expandedSection === 'faq-3' ? 'expanded' : ''}`}
              onClick={() => toggleSection('faq-3')}
              aria-expanded={expandedSection === 'faq-3'}
            >
              <span>¿Los materiales son accesibles para personas con discapacidad visual y auditiva?</span>
              <span className="icon">
                {expandedSection === 'faq-3' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            {expandedSection === 'faq-3' && (
              <div className="accordion-body">
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} color="var(--accent-teal)" />
                  <span>Sí. Todos los documentos contienen texto seleccionable estructurado, los videos incluyen transcripciones y el sitio cumple con estándares internacionales WCAG.</span>
                </p>
              </div>
            )}
          </article>
        </div>
      )}

      {/* TAB: Templates */}
      {activeTab === 'templates' && (
        <div className="tab-content stack">
          <div className="template-group">
            <h4>Plantillas para descargar</h4>
            <p className="helper">Usa estos archivos para organizar tus apuntes y entregas.</p>

            <div className="template-cards">
              <div className="template-card panel stack">
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} /> Plantilla de Apuntes Accesible
                </strong>
                <p>Documento formateado con títulos accesibles y contrastes adecuados.</p>
                <a href="#" className="button button-secondary-outline button-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={14} /> Descargar Plantilla
                </a>
              </div>

              <div className="template-card panel stack">
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} /> Matriz de Planificación y Tareas
                </strong>
                <p>Estructura paso a paso para organizar entregas y proyectos finales.</p>
                <a href="#" className="button button-secondary-outline button-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={14} /> Descargar Matriz
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
            </div>
          </div>
        </div>
      )}

      {/* Footer del panel */}
      <div className="support-footer text-center">
        <p className="helper">
          ¿Necesitas ayuda adicional? Contacta al equipo en{' '}
          <a href="mailto:soporte@intevopedi.org">soporte@intevopedi.org</a>
        </p>
      </div>
    </section>
  );
}
