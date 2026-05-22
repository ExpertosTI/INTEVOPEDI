import { adminLogin, requestAdminPasswordReset } from '@/app/actions';

export const metadata = {
  title: 'Acceso admin | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLoginPage({ searchParams }) {
  return (
    <section className="section spaced-page center-page">
      <div className="shell">
        <article className="panel narrow-panel stack">
          <span className="eyebrow">Administración</span>
          <h1>Entrar al panel</h1>
          <p>Usa la contraseña configurada en `ADMIN_ACCESS_PASSWORD` para gestionar inscripciones y certificados.</p>
          {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}
          {searchParams?.saved ? <div className="banner banner-success" role="status">{searchParams.saved}</div> : null}
          <form action={adminLogin} className="stack">
            <label>
              Contraseña
              <input type="password" name="password" autoComplete="current-password" required placeholder="Tu contraseña de administración" />
            </label>
            <div className="inline-actions">
              <button type="submit" className="button button-primary">
                Ingresar
              </button>
              <button type="submit" form="admin-reset" className="button button-secondary">
                Olvidé mi contraseña
              </button>
            </div>
          </form>
          <form id="admin-reset" action={requestAdminPasswordReset} className="inline-form" style={{ display: 'none' }}>
            <input type="hidden" name="reset" value="1" />
          </form>
        </article>
      </div>
    </section>
  );
}
