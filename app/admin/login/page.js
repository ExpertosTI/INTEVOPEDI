import { adminLogin } from '@/app/actions';

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
          <form action={adminLogin}>
            <label>
              Contraseña
              <input type="password" name="password" autoComplete="current-password" required placeholder="Tu contraseña de administración" />
            </label>
            <button type="submit" className="button button-primary">
              Ingresar
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
