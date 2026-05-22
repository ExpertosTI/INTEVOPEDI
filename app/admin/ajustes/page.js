import Link from 'next/link';
import { updateGeminiApiKeyAction } from '@/app/actions';
import { AdminAssistant } from '@/components/AdminAssistant';
import { requireAdmin } from '@/lib/admin-auth';
import { getMaskedGeminiKey } from '@/lib/admin-settings';
import { getAdminDashboardData } from '@/lib/data';

export const metadata = {
  title: 'Ajustes admin | INTEVOPEDI',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminSettingsPage({ searchParams }) {
  await requireAdmin();
  const keyStatus = await getMaskedGeminiKey();
  const dashboardData = await getAdminDashboardData();

  return (
    <section className="section spaced-page">
      <div className="shell stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Ajustes</span>
            <h1>Configuración de IA y accesibilidad</h1>
            <p>Aquí configuras Gemini y operas el super asistente para crear cursos y contenidos accesibles.</p>
          </div>
          <Link href="/admin" className="button button-secondary">
            Volver al panel admin
          </Link>
        </div>

        {searchParams?.error ? <div className="banner banner-error" role="alert">{searchParams.error}</div> : null}
        {searchParams?.saved ? <div className="banner banner-success" role="status">API key actualizada correctamente.</div> : null}

        <article className="panel stack">
          <div className="section-heading">
            <span className="eyebrow">Gemini API</span>
            <h2>Conexión segura del asistente</h2>
            <p>La clave se guarda cifrada y se usa solo en servidor para ejecutar acciones administrativas.</p>
          </div>
          <p className="helper">{keyStatus || 'Aún no hay API key configurada.'}</p>
          <form action={updateGeminiApiKeyAction} className="stack">
            <label>
              API key de Gemini
              <input
                type="password"
                name="geminiApiKey"
                autoComplete="off"
                placeholder="Pega aquí la API key"
              />
            </label>
            <div className="inline-actions">
              <button type="submit" className="button button-primary">
                Guardar API key
              </button>
            </div>
          </form>
        </article>

        <AdminAssistant courses={dashboardData.courses} />
      </div>
    </section>
  );
}
