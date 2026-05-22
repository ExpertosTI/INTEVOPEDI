const labelMap = {
  PENDING_PAYMENT: 'Pendiente de pago',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  PENDING: 'Pendiente',
  VERIFIED: 'Verificado',
  WAIVED: 'Exonerado'
};

export function StatusPill({ value }) {
  const normalized = String(value || '').toLowerCase();
  return <span className={`badge badge-${normalized}`}>{labelMap[value] || value}</span>;
}
