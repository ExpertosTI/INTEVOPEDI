import Link from 'next/link';
import { completeAdminPasswordReset } from '@/app/actions';

export const metadata = {
  title: 'Restablecer contraseña admin | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminResetPage({ searchParams }) {
  const token = searchParams?.token || '';
  return (
    <section className="section spaced-page center-page">
      <div className="shell">
        <article className="panel narrow-panel stack">
          <span className="eyebrow">Administración</span>
          <h1>Restablecer contraseña</h1>
          <p>Define una nueva contraseña segura (mínimo 12 caracteres). El enlace expira pronto por seguridad.</p>
          {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}
          {searchParams?.saved ? <div className="banner banner-success" role="status">{searchParams.saved}</div> : null}
          <form action={completeAdminPasswordReset} className="stack">
            <input type="hidden" name="token" value={token} />
            <label>
              Nueva contraseña
              <input
                type="password"
                name="password"
                minLength={12}
                required
                placeholder="Introduce una contraseña robusta"
                autoComplete="new-password"
              />
            </label>
            <div className="inline-actions">
              <button type="submit" className="button button-primary">
                Actualizar contraseña
              </button>
              <Link href="/admin/login" className="button button-secondary">
                Volver al login
              </Link>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
