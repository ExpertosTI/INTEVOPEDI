import Link from 'next/link';
import { ChevronRight } from '@/components/Icons';

export function Breadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Navegación de migas de pan">
      <Link href="/">Inicio</Link>
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ChevronRight size={14} className="breadcrumb-separator" aria-hidden="true" />
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
