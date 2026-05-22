import DOMPurify from 'isomorphic-dompurify';

// Configuración segura para contenido del asistente IA
// Solo permite tags básicos de formato, sin scripts ni event handlers
const ASSISTENT_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  ALLOWED_ATTR: [], // Sin atributos permitidos
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false
};

/**
 * Sanitiza HTML proveniente del asistente IA para renderizado seguro.
 * Solo permite tags de formato básico (strong, em, listas, etc.)
 * Elimina todo script, event handlers, y atributos potencialmente peligrosos.
 */
export function sanitizeAssistantHtml(dirtyHtml) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
  return DOMPurify.sanitize(dirtyHtml, ASSISTENT_CONFIG);
}

/**
 * Sanitiza texto plano, escapando caracteres HTML peligrosos.
 * Útil para mostrar contenido de usuario que no debe interpretarse como HTML.
 */
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formatea markdown simple y sanitiza el resultado.
 * Convierte **bold**, *italic*, y newlines a HTML seguro.
 */
export function formatAndSanitizeMarkdown(text) {
  if (!text) return '';
  
  // Primero escapamos HTML existente para prevenir inyección
  let escaped = escapeHtml(text);
  
  // Luego aplicamos formato markdown
  const withFormatting = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
  
  // Finalmente sanitizamos para asegurar que no hay scripts
  return DOMPurify.sanitize(withFormatting, ASSISTENT_CONFIG);
}

/**
 * Formatea markdown extendido (con listas) y sanitiza.
 */
export function formatAndSanitizeExtendedMarkdown(text) {
  if (!text) return '';
  
  // Primero escapamos HTML existente
  let escaped = escapeHtml(text);
  
  // Aplicamos formato extendido
  let withFormatting = escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');
  
  // Envolvemos listas consecutivas
  withFormatting = withFormatting
    .replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>');
  
  // Newlines restantes
  withFormatting = withFormatting.replace(/\n/g, '<br />');
  
  return DOMPurify.sanitize(withFormatting, ASSISTENT_CONFIG);
}
