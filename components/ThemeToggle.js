'use client';

import { useCallback, useEffect, useState } from 'react';
import * as Icons from './Icons';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('intevopedi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.body.setAttribute('data-theme', initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('intevopedi_theme', next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        padding: '8px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.3s var(--ease)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {theme === 'light' ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
    </button>
  );
}
