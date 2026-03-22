import Link from 'next/link';
import { ParticipantLoginForm } from '@/components/ParticipantLoginForm';
import { participantAccessLogin } from '@/app/actions';
import { getParticipantSession } from '@/lib/participant-auth';
import { participantHubBenefits } from '@/lib/site';

export const metadata = {
  title: 'Acceso de participantes | INTEVOPEDI'
};

export default async function ParticipantAccessPage({ searchParams }) {
  const code = searchParams?.code?.trim() || '';
  const emailParam = searchParams?.email?.trim() || '';
  const error = searchParams?.error;
  const registered = searchParams?.registered;
  const verified = searchParams?.verified;
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
          
          {verified ? (
            <div className="banner banner-success" role="status">
              Tu correo quedó verificado. Ya puedes entrar con tu contraseña.
            </div>
          ) : null}
          {registered ? (
            <div className="banner banner-success" role="status">
              Cuenta creada. Revisa tu correo ({emailParam}) para verificar tu acceso (vigente 72h).
            </div>
          ) : null}
          {error ? (
            <div className="banner banner-error" role="alert">
              {error}
            </div>
          ) : null}

          <ParticipantLoginForm defaultEmail={emailParam} defaultCode={code} />
          
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
