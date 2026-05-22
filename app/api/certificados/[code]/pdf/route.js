import { readFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { buildPublicUrl } from '@/lib/certificates';
import { getCertificateByCode } from '@/lib/data';
import { formatDateTime } from '@/lib/formatters';
import { siteConfig } from '@/lib/site';

export async function GET(request, { params }) {
  const certificate = await getCertificateByCode(params.code);

  if (!certificate) {
    return new Response('Certificate not found', { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const width = page.getWidth();
  const height = page.getHeight();
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const logoPath = path.join(process.cwd(), 'public', 'Logo.png');
  const logoBytes = await readFile(logoPath);
  const logoImage = await pdf.embedPng(logoBytes);
  const verificationUrl = buildPublicUrl(`/certificados/${certificate.certificateCode}`);
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { width: 180, margin: 1 });
  const qrBytes = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
  const qrImage = await pdf.embedPng(qrBytes);

  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, color: rgb(0.97, 0.98, 1) });
  page.drawRectangle({ x: 36, y: 36, width: width - 72, height: height - 72, borderWidth: 2, borderColor: rgb(0.04, 0.23, 0.43) });
  page.drawImage(logoImage, { x: 70, y: 450, width: 96, height: 96 });
  page.drawText('CERTIFICADO DE PARTICIPACIÓN', { x: 190, y: 500, size: 28, font: titleFont, color: rgb(0.04, 0.23, 0.43) });
  page.drawText('INTEVOPEDI', { x: 190, y: 470, size: 20, font: titleFont, color: rgb(0.77, 0.63, 0.35) });
  page.drawText('Se certifica que', { x: 190, y: 420, size: 16, font: bodyFont, color: rgb(0.16, 0.2, 0.26) });
  page.drawText(certificate.participant.fullName, { x: 190, y: 385, size: 30, font: titleFont, color: rgb(0.04, 0.23, 0.43) });
  page.drawText('participó satisfactoriamente en el curso', { x: 190, y: 350, size: 16, font: bodyFont, color: rgb(0.16, 0.2, 0.26) });
  page.drawText(certificate.enrollment.course.title, { x: 190, y: 318, size: 20, font: titleFont, color: rgb(0.04, 0.23, 0.43) });
  page.drawText(`Emitido el ${formatDateTime(certificate.issuedAt)}`, { x: 190, y: 282, size: 15, font: bodyFont, color: rgb(0.16, 0.2, 0.26) });
  page.drawText(`Código: ${certificate.certificateCode}`, { x: 190, y: 252, size: 15, font: bodyFont, color: rgb(0.16, 0.2, 0.26) });
  page.drawText('Valida este certificado escaneando el QR o visitando la URL pública de verificación.', { x: 190, y: 215, size: 13, font: bodyFont, color: rgb(0.36, 0.45, 0.54) });
  page.drawImage(qrImage, { x: 615, y: 132, width: 150, height: 150 });
  page.drawText('Validación pública', { x: 625, y: 110, size: 12, font: titleFont, color: rgb(0.04, 0.23, 0.43) });
  page.drawText(new URL(siteConfig.baseUrl).host, { x: 78, y: 82, size: 12, font: bodyFont, color: rgb(0.36, 0.45, 0.54) });
  page.drawText('829 954 8273', { x: 78, y: 62, size: 12, font: bodyFont, color: rgb(0.36, 0.45, 0.54) });

  const pdfBytes = await pdf.save();

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${certificate.certificateCode}.pdf"`,
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, noarchive'
    }
  });
}
