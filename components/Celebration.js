'use client';

import { useEffect, useState } from 'react';

export function Celebration({ show = false, message = '¡Felicidades! 🎉' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="celebration-overlay" role="status" aria-live="assertive">
      <div className="celebration-text">{message}</div>
    </div>
  );
}
