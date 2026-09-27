import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="ea-footer" role="contentinfo">
      <div className="shell ea-footer-grid">
        <div className="ea-footer-brand">
          <div className="ea-brand-text">
            <span className="ea-footer-brand-title">INTEVOPEDI</span>
            <span className="ea-footer-brand-sub">Academy</span>
          </div>
          <p className="ea-footer-desc">
            Plataforma de formación técnica, artística y virtual inclusiva. Acceso 100% gratuito a cursos de alta calidad con opción a certificación de estudios internacional.
          </p>
          <div className="ea-footer-contact-row">
            <a
              href={siteConfig.contactPhoneHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ea-footer-wa-btn"
            >
              <span>💬 Asesoría por WhatsApp: {siteConfig.contactPhone}</span>
            </a>
          </div>
        </div>

        <div className="ea-footer-col">
          <h4>Cursos populares</h4>
          <ul>
            <li><Link href="/cursos/curso-de-canto">Curso de canto</Link></li>
            <li><Link href="/cursos/curso-de-bajo-1760">Curso de bajo</Link></li>
            <li><Link href="/cursos/curso-de-musica">Curso de música</Link></li>
            <li><Link href="/cursos/ia-accesibilidad-digital">IA y Accesibilidad</Link></li>
            <li><Link href="/cursos/qa-tester-accesibilidad">QA Tester Especialista</Link></li>
            <li><Link href="/cursos">Ver catálogo completo (+50)</Link></li>
          </ul>
        </div>

        <div className="ea-footer-col">
          <h4>Sobre nosotros</h4>
          <ul>
            <li><Link href="/#sobre-nosotros">Nuestra institución</Link></li>
            <li><Link href="/verificar">Certificado de estudios</Link></li>
            <li><Link href="/grupo-atrevete">Grupo Atrévete (Música)</Link></li>
            <li><Link href="/participantes">Campus del estudiante</Link></li>
            <li><Link href="/admin/login">Acceso administrativo</Link></li>
          </ul>
        </div>

        <div className="ea-footer-col">
          <h4>Ayuda y contacto</h4>
          <p className="ea-footer-address">
            📍 {siteConfig.address}
          </p>
          <p className="ea-footer-email">
            ✉ <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
          <p className="ea-footer-hours">
            🕒 Campus abierto 24/7 · Soporte de Lunes a Viernes 8am - 6pm
          </p>
        </div>
      </div>

      <div className="shell ea-footer-bottom">
        <p>© 2026 {siteConfig.name}. Todos los derechos reservados. Desarrollado con los más altos estándares de accesibilidad y diseño web moderno.</p>
      </div>
    </footer>
  );
}
