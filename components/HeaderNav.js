'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/site';
import { Menu, X, MessageCircle } from '@/components/Icons';

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cursos?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearchSubmit} className="ea-search-bar">
        <svg className="ea-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="¿Qué quieres aprender hoy?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Buscar cursos gratis"
        />
      </form>

      <div className={`nav-panel ${isOpen ? 'nav-panel-open' : ''}`}>
        <div className="nav-shell">
          <nav className="site-nav" aria-label="Navegación principal">
            <Link
              href="/cursos"
              className={`ea-nav-btn ${pathname === '/cursos' ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Cursos gratis</span>
            </Link>

            <Link
              href="/#sobre-nosotros"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Sobre nosotros
            </Link>

            <Link
              href="/verificar"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Certificados
            </Link>

            <Link
              href="/grupo-atrevete"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Grupo Atrévete
            </Link>
          </nav>
        </div>

        <div className="nav-actions">
          <a
            href={siteConfig.contactPhoneHref}
            className="ea-wa-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Asesoría por WhatsApp"
            title="Recibir asesoría por WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.11l-.3-.17-3.12.82.83-3.04-.19-.31a8.196 8.196 0 0 1-1.26-4.44c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.21-.18-.46-.3z" />
            </svg>
          </a>

          <Link
            href="/participantes"
            className="button button-outline ea-btn-login"
            onClick={() => setIsOpen(false)}
          >
            Mi Campus
          </Link>

          <Link
            href="/cursos"
            className="button button-primary ea-btn-register"
            onClick={() => setIsOpen(false)}
          >
            Explorar cursos
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="nav-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Abrir menú"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </>
  );
}
