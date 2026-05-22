export function ProgressBar({ current, total, label }) {
  const percentage = Math.min(100, Math.round(((current || 0) / (total || 1)) * 100));

  return (
    <div className="progress-container stack-small">
      <div className="progress-line" role="progressbar" aria-valuenow={current} aria-valuemin="0" aria-valuemax={total} aria-label={label}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <p className="helper">
        {label}: <strong>{current}</strong> de {total || 'cupos abiertos'}.
      </p>
    </div>
  );
}
