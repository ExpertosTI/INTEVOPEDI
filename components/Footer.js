import Link from 'next/link';
import { mainNavigation, siteConfig } from '@/lib/site';
import { Phone, Mail, Award, User, Globe } from '@/components/Icons';

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
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} />
            <span>{siteConfig.address}</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} />
            <a
              href={siteConfig.contactPhoneHref}
              aria-label={`Escribir por WhatsApp al ${siteConfig.contactPhone}`}
            >
              {siteConfig.contactPhone}
            </a>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} />
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
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} />
            <Link href="/verificar">Verificar certificado</Link>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} />
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
