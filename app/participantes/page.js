import Link from 'next/link';
import { participantAccessLogin } from '@/app/actions';
import { getParticipantSession } from '@/lib/participant-auth';
import { participantHubBenefits } from '@/lib/site';

export const metadata = {
  title: 'Acceso de participantes | INTEVOPEDI'
};

export default async function ParticipantAccessPage({ searchParams }) {
  const code = searchParams?.code?.trim() || '';
  const error = searchParams?.error;
  const session = await getParticipantSession();

  return (
    <section className="section spaced-page">
      <div className="shell dashboard-grid">
        <article className="panel panel-dark stack">
          <span className="eyebrow">Acceso del participante</span>
          <h1>Entra a tu campus del curso</h1>
          <p>
            Si ya te inscribiste, introduce tu correo y tu código para entrar a tu campus, revisar progreso, recursos y certificado.
          </p>
          {error ? <div className="banner banner-error" role="alert">{error}</div> : null}
          <form action={participantAccessLogin} className="verify-box">
            <label>
              Correo electrónico
              <input type="email" name="email" autoComplete="email" inputMode="email" placeholder="nombre@correo.com" required />
            </label>
            <label>
              Código de inscripción
              <input type="text" name="referenceCode" autoCapitalize="characters" autoComplete="off" placeholder="INT-AB12CD34" defaultValue={code} required />
            </label>
            <button type="submit" className="button button-primary">
              Continuar
            </button>
          </form>
          {session ? (
            <div className="inline-actions">
              <Link href="/campus" className="button button-secondary">
                Ir a mi campus
              </Link>
            </div>
          ) : null}
        </article>

        <article className="panel stack">
          <span className="eyebrow">Beneficios</span>
          <h2>Experiencia más clara y ordenada</h2>
          <ul className="list">
            {participantHubBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="inline-actions">
            <Link href="/cursos" className="button button-secondary">
              Ver cursos
            </Link>
            <Link href="/verificar" className="button button-secondary">
              Verificar certificado
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
