import Link from 'next/link';
import { redirect } from 'next/navigation';
import { updateParticipantProfile } from '@/app/actions';
import { requireParticipantAuth } from '@/lib/participant-auth';
import { getParticipantCampusData } from '@/lib/data';

export const metadata = {
  title: 'Mi Perfil | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default async function ProfilePage({ searchParams }) {
  const session = await requireParticipantAuth();
  const participant = await getParticipantCampusData(session.participantId);
  const requiredSetup = String(searchParams?.required || '') === '1';
  const error = searchParams?.error;
  const verified = searchParams?.verified;
  const needsPassword = !participant?.passwordHash;

  if (!participant) {
    redirect('/participantes?error=' + encodeURIComponent('Tu sesión ya no está disponible.'));
  }

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Ajustes</span>
            <h1>{requiredSetup ? 'Completa tu acceso' : 'Datos del certificado'}</h1>
            <p>{requiredSetup ? 'Antes de entrar al campus debes completar tus datos y crear tu contraseña personal.' : 'Completa o actualiza tus datos para que aparezcan correctamente en tus certificados digitales.'}</p>
          </div>
          <div className="inline-actions">
            <Link href="/campus" className="button button-secondary">
              Volver al campus
            </Link>
          </div>
        </div>

        {verified ? (
          <div className="banner banner-success" role="status">
            Correo verificado correctamente. Solo falta completar tus datos para continuar.
          </div>
        ) : null}
        {error ? (
          <div className="banner banner-error" role="alert">
            {error}
          </div>
        ) : null}

        <article className="panel form-card stack" style={{ maxWidth: '600px' }}>
          <form action={updateParticipantProfile} className="stack">
            <input type="hidden" name="required" value={requiredSetup ? '1' : '0'} />
            <div className="form-grid">
              <label>
                Nombre completo (como aparecerá en el certificado)
                <input type="text" name="fullName" required defaultValue={participant.fullName} />
              </label>
              <label>
                Teléfono
                <input type="tel" name="phone" required defaultValue={participant.phone} />
              </label>
              <label>
                Ciudad
                <input type="text" name="city" placeholder="Ej. Santo Domingo" defaultValue={participant.city || ''} />
              </label>
              <label>
                Organización o centro educativo
                <input type="text" name="organization" placeholder="Ej. Escuela Primaria" defaultValue={participant.organization || ''} />
              </label>
              <label>
                Perfil o contexto
                <input type="text" name="visualProfile" placeholder="Ej. Docente, familiar..." defaultValue={participant.visualProfile || ''} />
              </label>
            </div>
            <label>
              {needsPassword ? 'Crea tu contraseña de acceso' : 'Nueva contraseña (opcional)'}
              <input type="password" name="password" minLength={8} placeholder={needsPassword ? 'Mínimo 8 caracteres' : 'Déjalo vacío para conservar la actual'} required={needsPassword || requiredSetup} />
            </label>
            <label>
              Notas adicionales
              <textarea name="notes" placeholder="Alguna información adicional que desees agregar..." defaultValue={participant.notes || ''} />
            </label>
            
            <button type="submit" className="button button-primary" style={{ marginTop: '1rem' }}>
              {requiredSetup ? 'Guardar y entrar al campus' : 'Guardar y actualizar datos'}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
