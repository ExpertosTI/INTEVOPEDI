export function formatDate(dateLike) {
  return new Date(dateLike).toLocaleDateString('es-DO', {
    dateStyle: 'long'
  });
}

export function formatDateTime(dateLike) {
  return new Date(dateLike).toLocaleString('es-DO', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
}

export function formatPercent(value) {
  return `${Math.max(0, Math.min(100, Number(value || 0)))}%`;
}
