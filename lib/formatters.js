export function formatDate(dateLike) {
  if (!dateLike) return 'Fecha por definir';
  try {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    return d.toLocaleDateString('es-DO', {
      dateStyle: 'long'
    });
  } catch (e) {
    return 'Fecha desconocida';
  }
}

export function formatDateTime(dateLike) {
  if (!dateLike) return 'Fecha por definir';
  try {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    return d.toLocaleString('es-DO', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  } catch (e) {
    return 'Fecha desconocida';
  }
}

export function formatPercent(value) {
  return `${Math.max(0, Math.min(100, Number(value || 0)))}%`;
}
