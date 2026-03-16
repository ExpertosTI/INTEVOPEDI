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

export default async function ProfilePage() {
  const session = await requireParticipantAuth();
  const participant = await getParticipantCampusData(session.participantId);

  if (!participant) {
    redirect('/participantes?error=' + encodeURIComponent('Tu sesión ya no está disponible.'));
  }

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Ajustes</span>
            <h1>Datos del certificado</h1>
            <p>Completa o actualiza tus datos para que aparezcan correctamente en tus certificados digitales.</p>
          </div>
          <div className="inline-actions">
            <Link href="/campus" className="button button-secondary">
              Volver al campus
            </Link>
          </div>
        </div>

        <article className="panel form-card stack" style={{ maxWidth: '600px' }}>
          <form action={updateParticipantProfile} className="stack">
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
              Notas adicionales
              <textarea name="notes" placeholder="Alguna información adicional que desees agregar..." defaultValue={participant.notes || ''} />
            </label>
            
            <button type="submit" className="button button-primary" style={{ marginTop: '1rem' }}>
              Guardar y actualizar datos
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
