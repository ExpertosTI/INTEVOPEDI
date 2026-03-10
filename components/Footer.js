import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="shell footer-grid">
        <div>
          <h3>{siteConfig.fullName}</h3>
          <p>{siteConfig.description}</p>
        </div>

        <div>
          <h4>Contacto</h4>
          <p>{siteConfig.address}</p>
          <p>
            <a href={siteConfig.contactPhoneHref} aria-label={`Escribir por WhatsApp al ${siteConfig.contactPhone}`}>{siteConfig.contactPhone}</a>
          </p>
          <p>
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>

        <nav aria-label="Recursos del sitio">
          <h4>Recursos</h4>
          <p>
            <Link href="/cursos">Cursos</Link>
          </p>
          <p>
            <Link href="/participantes">Acceso participantes</Link>
          </p>
          <p>
            <Link href="/recursos">Centro de recursos</Link>
          </p>
          <p>
            <Link href="/grupo-atrevete">Grupo Atrévete</Link>
          </p>
          <p>
            <Link href="/admin/login">Panel admin</Link>
          </p>
          <p>
            <a href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer">
              Repositorio GitHub
            </a>
          </p>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 {siteConfig.name}. Todos los derechos reservados.</span>
        <span className="footer-powered">Renace Tech</span>
      </div>
    </footer>
  );
}
