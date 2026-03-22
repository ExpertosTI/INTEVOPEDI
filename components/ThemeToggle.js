'use client';

import { useCallback, useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('intevopedi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
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
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
