import Link from 'next/link';

export function Breadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Navegación de migas de pan">
      <Link href="/">Inicio</Link>
      {items.map((item, i) => (
        <span key={item.label}>
          <span className="breadcrumb-separator" aria-hidden="true">›</span>
          {i === items.length - 1 ? (
            <span className="breadcrumb-current" aria-current="page">{item.label}</span>
          ) : (
            <Link href={item.href}>{item.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
