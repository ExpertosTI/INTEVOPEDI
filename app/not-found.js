import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell spaced-page center-page">
      <div className="panel narrow-panel">
        <span className="eyebrow">404</span>
        <h1>No encontramos la página solicitada</h1>
        <p>La dirección puede haber cambiado o el recurso todavía no está disponible.</p>
        <Link href="/" className="button button-primary">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
