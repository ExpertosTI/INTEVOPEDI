'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/site';
import { Menu, X, MessageCircle } from '@/components/Icons';

export function HeaderNav({ navigation = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return undefined;

    const sectionIds = navigation
      .map((link) => link.href.replace('/#', ''))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.45] }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname, navigation]);

  const isActive = (href) => {
    if (pathname !== '/') {
      if (href === '/#inicio') return pathname === '/';
      if (href.startsWith('/#')) return false;
      return pathname === href;
    }

    return activeSection === href.replace('/#', '');
  };

  return (
    <>
      <div className={`nav-panel ${isOpen ? 'nav-panel-open' : ''}`}>
        <div className="nav-shell">
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
        </div>

        <div className="nav-actions">
          <Link
            href="/#curso"
            className="button button-secondary button-sm nav-cta-secondary"
            onClick={() => setIsOpen(false)}
          >
            Inscribirme
          </Link>
          <a
            href={siteConfig.contactPhoneHref}
            className="button button-whatsapp button-sm nav-cta"
            onClick={() => setIsOpen(false)}
            aria-label={`Escribir por WhatsApp al ${siteConfig.contactPhone}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageCircle size={16} />
            <span>{siteConfig.contactPhone}</span>
          </a>
        </div>
      </div>
      <button
        type="button"
        className="nav-toggle"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-label="Alternar menú de navegación"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </>
  );
}
