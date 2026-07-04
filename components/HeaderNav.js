'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/site';

export function HeaderNav({ navigation = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/#inicio') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href;
  };

  return (
    <>
      <div className={`nav-panel ${isOpen ? 'nav-panel-open' : ''}`}>
        <nav className="site-nav" aria-label="Navegación principal">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/#curso" className="button button-secondary nav-cta-secondary" onClick={() => setIsOpen(false)}>
          Inscribirme
        </Link>
        <a
          href={siteConfig.contactPhoneHref}
          className="button button-primary nav-cta"
          onClick={() => setIsOpen(false)}
          aria-label={`Escribir por WhatsApp al ${siteConfig.contactPhone}`}
        >
          {siteConfig.contactPhone}
        </a>
      </div>
      <button
        type="button"
        className="nav-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Alternar menú de navegación"
      >
        {isOpen ? '✕' : '☰'}
      </button>
    </>
  );
}
