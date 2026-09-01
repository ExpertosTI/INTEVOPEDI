'use client';

import { useState } from 'react';

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
            Todo está organizad en formatos accesibles. Descarga lo que necesites.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
          aria-selected={activeTab === 'guide'}
        >
          📖 Guía de usuario
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
          aria-selected={activeTab === 'resources'}
        >
          📚 Recursos por módulo
        </button>
        <button
          className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
          aria-selected={activeTab === 'faq'}
        >
          ❓ Preguntas frecuentes
        </button>
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          aria-selected={activeTab === 'templates'}
        >
          📋 Templates
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
              <span>🚀 Empezar — Primeros pasos</span>
              <span className="icon">▼</span>
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
              <span>♿ Accesibilidad — Aprende con las herramientas que necesitas</span>
              <span className="icon">▼</span>
            </button>
            {expandedSection === 'accessibility' && (
              <div className="accordion-body stack">
                <div className="feature-block">
                  <strong>🔊 Lector de pantalla</strong>
                  <p>
                    Todos nuestros materiales son compatibles con lectores de pantalla. Usa NVDA (Windows), JAWS o
                    VoiceOver (Mac).
                  </p>
                </div>
                <div className="feature-block">
                  <strong>🎨 Alto contraste</strong>
                  <p>
                    En Ajustes, activa el modo de alto contraste para mejorar la legibilidad en cualquier dispositivo.
                  </p>
                </div>
                <div className="feature-block">
                  <strong>📱 Tamaño de texto ajustable</strong>
                  <p>
                    Usa Ctrl + Plus para aumentar el tamaño del texto en tu navegador. Todos nuestros contenidos se
                    adaptan automáticamente.
                  </p>
                </div>
                <div className="feature-block">
                  <strong>📝 Transcripciones de video</strong>
                  <p>
                    Todos los videos incluyen subtítulos y transcripciones descargables en PDF para sordera o
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
              <span>📊 Seguimiento de progreso</span>
              <span className="icon">▼</span>
            </button>
            {expandedSection === 'progress' && (
              <div className="accordion-body stack">
                <p>
                  Tu progreso se actualiza automáticamente. Puedes ver:
                </p>
                <ul className="bullet-list">
                  <li><strong>Módulos completados:</strong> marca verde cuando terminas cada módulo</li>
                  <li><strong>Porcentaje general:</strong> avance total del curso</li>
                  <li><strong>Certificado:</strong> al alcanzar 100%, tu certificado se genera automáticamente</li>
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
          {[1, 2, 3].map((moduleNum) => (
            <article key={moduleNum} className="accordion">
              <button
                className={`accordion-header ${expandedSection === `module-${moduleNum}` ? 'expanded' : ''}`}
                onClick={() => toggleSection(`module-${moduleNum}`)}
                aria-expanded={expandedSection === `module-${moduleNum}`}
              >
                <span>📦 Módulo {moduleNum} — Título del módulo</span>
                <span className="icon">▼</span>
              </button>
              {expandedSection === `module-${moduleNum}` && (
                <div className="accordion-body stack">
                  <div className="resource-group">
                    <h5>📄 Apuntes y guías</h5>
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
                    <h5>🎥 Grabaciones y videos</h5>
                    <ul className="resource-list">
                      <li>
                        <a href="#" className="resource-link">
                          Sesión en vivo del {new Date().toLocaleDateString('es-ES')}
                        </a>
                        <span className="resource-meta">+ transcripción descargable</span>
                      </li>
                    </ul>
                  </div>

                  <div className="resource-group">
                    <h5>📝 Ejercicios prácticos</h5>
                    <ul className="resource-list">
                      <li>
                        <a href="#" className="resource-link">
                          Ejercicio 1 — Aplicación práctica
                        </a>
                        <span className="resource-meta">+ solución comentada</span>
                      </li>
                      <li>
                        <a href="#" className="resource-link">
                          Ejercicio 2 — Caso de estudio
                        </a>
                      </li>
                    </ul>
                  </div>

                  <button className="button button-secondary-outline full-width">
                    ⬇️ Descargar todo como ZIP
                  </button>
                </div>
              )}
            </article>
          ))}
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
              <span>¿Puedo descargar los videos para verlos sin conexión?</span>
              <span className="icon">▼</span>
            </button>
            {expandedSection === 'faq-1' && (
              <div className="accordion-body">
                <p>
                  Sí, todos los videos están disponibles para descargar en formatos MP4 y WebM. Descárgalos en la
                  sección "Recursos por módulo" usando el botón "Descargar todo como ZIP".
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
              <span className="icon">▼</span>
            </button>
            {expandedSection === 'faq-2' && (
              <div className="accordion-body">
                <p>
                  Al alcanzar 100% de progreso, tu certificado se genera automáticamente. Ve a la sección
                  "Certificados" en tu panel para descargarlo, compartirlo o validarlo con el código QR.
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
              <span>¿Los materiales son accesibles para personas con discapacidad visual?</span>
              <span className="icon">▼</span>
            </button>
            {expandedSection === 'faq-3' && (
              <div className="accordion-body">
                <p>
                  ✅ Sí. Todos los PDFs contienen texto seleccionable (OCR), los videos incluyen subtítulos y
                  transcripciones, y el sitio es totalmente navegable con teclado y lector de pantalla.
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
            <h4>📋 Templates para descargar</h4>
            <p className="helper">Usa estos archivos para organizar tus apuntes y entregas.</p>

            <div className="template-cards">
              <div className="template-card panel">
                <strong>📝 Plantilla de Apuntes</strong>
                <p>Word (.docx) | Formato profesional con estilos predefinidos</p>
                <a href="#" className="button button-secondary-outline button-sm">
                  Descargar
                </a>
              </div>

              <div className="template-card panel">
                <strong>📊 Matriz de Análisis</strong>
                <p>Excel (.xlsx) | Para ejercicios de comparación y síntesis</p>
                <a href="#" className="button button-secondary-outline button-sm">
                  Descargar
                </a>
              </div>

              <div className="template-card panel">
                <strong>🎯 Plan de Proyecto</strong>
                <p>PDF (.pdf) | Estructura para proyectos finales</p>
                <a href="#" className="button button-secondary-outline button-sm">
                  Descargar
                </a>
              </div>
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
