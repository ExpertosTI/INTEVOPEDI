import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCertificateByCode } from '@/lib/data';
import { formatDateTime } from '@/lib/formatters';

export async function generateMetadata({ params }) {
  return {
    title: `Certificado ${params.code} | INTEVOPEDI`,
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function CertificatePage({ params }) {
  const certificate = await getCertificateByCode(params.code);

  if (!certificate) {
    notFound();
  }

  return (
    <section className="section spaced-page">
      <div className="shell center-page">
        <article className="panel narrow-panel stack">
          <span className="eyebrow">Certificado verificado</span>
          <h1>{certificate.valid ? 'Certificado válido' : 'Certificado no válido'}</h1>
          <p>
            Este registro corresponde a <strong>{certificate.participant.fullName}</strong> y fue emitido por INTEVOPEDI para el curso <strong>{certificate.enrollment.course.title}</strong>.
          </p>
          <dl className="details-grid">
            <div>
              <dt>Código</dt>
              <dd>{certificate.certificateCode}</dd>
            </div>
            <div>
              <dt>Fecha de emisión</dt>
              <dd>{formatDateTime(certificate.issuedAt)}</dd>
            </div>
            <div>
              <dt>Participante</dt>
              <dd>{certificate.participant.fullName}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{certificate.valid ? 'Válido' : 'No válido'}</dd>
            </div>
          </dl>
          <div className="inline-actions">
            <a href={`/api/certificados/${certificate.certificateCode}/pdf`} className="button button-primary" target="_blank" rel="noreferrer">
              Descargar PDF
            </a>
            <Link href="/verificar" className="button button-secondary">
              Verificar otro código
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
