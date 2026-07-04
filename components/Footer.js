import Link from 'next/link';
import { mainNavigation, siteConfig } from '@/lib/site';

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
            <a
              href={siteConfig.contactPhoneHref}
              aria-label={`Escribir por WhatsApp al ${siteConfig.contactPhone}`}
            >
              {siteConfig.contactPhone}
            </a>
          </p>
          <p>
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </p>
        </div>

        <nav aria-label="Secciones del sitio">
          <h4>Sitio</h4>
          {mainNavigation.map((link) => (
            <p key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </p>
          ))}
          <p>
            <Link href="/verificar">Verificar certificado</Link>
          </p>
          <p>
            <Link href="/participantes">Acceso participantes</Link>
          </p>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 {siteConfig.name}. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
