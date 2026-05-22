'use client';

import { exportEnrollmentsCsv } from '@/app/actions';
import { useState, useTransition } from 'react';

export function AdminExportButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleExport() {
    setError('');
    startTransition(async () => {
      try {
        const result = await exportEnrollmentsCsv();
        if (result?.ok && result.csv) {
          const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `inscripciones-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          setError('Error al generar CSV');
        }
      } catch {
        setError('Error al exportar');
      }
    });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        className="button button-secondary export-btn"
        onClick={handleExport}
        disabled={isPending}
      >
        {isPending ? 'Exportando…' : '📥 Exportar CSV'}
      </button>
      {error ? <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>{error}</span> : null}
    </div>
  );
}
