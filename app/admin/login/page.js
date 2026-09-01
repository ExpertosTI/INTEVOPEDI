import { requestAdminLoginCode, verifyAdminLoginCode } from '@/app/actions';

export const metadata = {
  title: 'Acceso admin | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLoginPage({ searchParams }) {
  const step = searchParams?.step === 'code' ? 'code' : 'email';
  const email = searchParams?.email || '';

  return (
    <section className="section spaced-page center-page">
      <div className="shell">
        <article className="panel narrow-panel stack">
          <span className="eyebrow">Administración</span>
          <h1>Entrar al panel</h1>
          {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}
          {searchParams?.saved ? <div className="banner banner-success" role="status">{searchParams.saved}</div> : null}
          {step === 'email' ? (
            <>
              <p>Escribe el correo del administrador y te enviaremos un código de acceso.</p>
              <form action={requestAdminLoginCode} className="stack">
                <label>
                  Correo del administrador
                  <input type="email" name="email" autoComplete="email" required placeholder="admin@renace.space" />
                </label>
                <button type="submit" className="button button-primary">
                  Enviar código
                </button>
              </form>
            </>
          ) : (
            <>
              <p>Introduce el código de 6 dígitos que enviamos a {email || 'tu correo'}.</p>
              <form action={verifyAdminLoginCode} className="stack">
                <input type="hidden" name="email" value={email} />
                <label>
                  Código de acceso
                  <input
                    type="text"
                    name="code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoComplete="one-time-code"
                    required
                    placeholder="123456"
                  />
                </label>
                <div className="inline-actions">
                  <button type="submit" className="button button-primary">
                    Ingresar
                  </button>
                  <button type="submit" formAction={requestAdminLoginCode} className="button button-secondary">
                    Reenviar código
                  </button>
                </div>
              </form>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
