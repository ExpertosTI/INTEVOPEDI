import Link from 'next/link';
import { getCertificateByCode } from '@/lib/data';
import { formatDateTime } from '@/lib/formatters';
import { normalizeCertificateCode } from '@/lib/validation';

export const metadata = {
  title: 'Verificar certificado | INTEVOPEDI'
};

export default async function VerifyPage({ searchParams }) {
  const code = normalizeCertificateCode(searchParams?.code);
  const certificate = code ? await getCertificateByCode(code) : null;

  return (
    <section className="section spaced-page">
      <div className="shell dashboard-grid">
        <article className="panel stack verify-card">
          <span className="eyebrow">Verificación pública</span>
          <h1>Consulta la validez de un certificado</h1>
          <p>Introduce el código del certificado o abre la URL desde el QR para validar emisión, participante y curso.</p>
          <form method="get" className="verify-box">
            <label>
              Código del certificado
              <input type="text" name="code" autoCapitalize="characters" autoComplete="off" placeholder="CERT-1234ABCD" defaultValue={code || ''} />
            </label>
            <button type="submit" className="button button-primary">
              Verificar ahora
            </button>
          </form>
        </article>

        <article className="panel stack verify-card" aria-live="polite">
          <span className="eyebrow">Resultado</span>
          {!code ? (
            <>
              <h2>Aún no has consultado un código</h2>
              <p>Cuando ingreses un código válido, aquí verás el resultado de la verificación.</p>
            </>
          ) : certificate ? (
            <>
              <h2>Certificado válido</h2>
              <p>
                <strong>{certificate.participant.fullName}</strong> completó el curso <strong>{certificate.enrollment.course.title}</strong>.
              </p>
              <dl className="details-grid">
                <div>
                  <dt>Código</dt>
                  <dd>{certificate.certificateCode}</dd>
                </div>
                <div>
                  <dt>Emitido</dt>
                  <dd>{formatDateTime(certificate.issuedAt)}</dd>
                </div>
              </dl>
              <div className="inline-actions">
                <Link href={`/certificados/${certificate.certificateCode}`} className="button button-secondary">
                  Abrir validación completa
                </Link>
                <a href={`/api/certificados/${certificate.certificateCode}/pdf`} className="button button-primary" target="_blank" rel="noreferrer">
                  Descargar PDF
                </a>
              </div>
            </>
          ) : (
            <>
              <h2>No encontramos ese código</h2>
              <p>Revisa que el código esté correctamente escrito o solicita confirmación a administración.</p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
