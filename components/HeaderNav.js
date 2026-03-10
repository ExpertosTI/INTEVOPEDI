'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function HeaderNav({ navigation }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
