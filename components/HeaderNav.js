'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { label: 'Cursos', href: '/cursos' },
  { label: 'Participantes', href: '/participantes' },
  { label: 'Verificar', href: '/verificar' },
  { label: 'Grupo Atrévete', href: '/grupo-atrevete' }
];

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className={`nav-panel ${isOpen ? 'nav-panel-open' : ''}`}>
        <nav className="site-nav" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <Link href="/participantes" className="button button-primary nav-cta" onClick={() => setIsOpen(false)}>
          Acceder al campus
        </Link>
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
