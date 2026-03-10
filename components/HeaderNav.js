'use client';

import Link from 'next/link';
import { useState } from 'react';

export function HeaderNav({ navigation, contactPhoneHref, contactPhone }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Abrir menú principal"
        aria-expanded={isOpen}
        aria-controls="site-nav-links"
        onClick={() => setIsOpen((value) => !value)}
      >
        Menú
      </button>

      <div className={`nav-panel${isOpen ? ' nav-panel-open' : ''}`}>
        <nav id="site-nav-links" className="site-nav" aria-label="Principal">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={contactPhoneHref} className="button button-secondary nav-cta" aria-label={`Contactar por WhatsApp al ${contactPhone}`}>
          {contactPhone}
        </a>
      </div>
    </>
  );
}
