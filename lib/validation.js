export function sanitizeText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function normalizeEmail(value) {
  return sanitizeText(value).toLowerCase();
}

export function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');

  if (digits.length === 10) {
    return digits;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }

  return digits;
}

export function isValidPhone(value) {
  const normalized = normalizePhone(value);
  return /^\d{10}$/.test(normalized);
}

export function formatPhoneForDisplay(value) {
  const normalized = normalizePhone(value);

  if (normalized.length !== 10) {
    return sanitizeText(value);
  }

  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}

export function normalizeCertificateCode(value) {
  return sanitizeText(value).toUpperCase();
}

export function isValidCertificateCode(value) {
  return /^[A-Z]{2,10}-[A-Z0-9]{6,20}$/.test(normalizeCertificateCode(value));
}

export function normalizeCedula(value) {
  return String(value || '').replace(/\D/g, '');
}

export function isValidCedula(value) {
  const digits = normalizeCedula(value);
  return digits.length >= 8 && digits.length <= 11;
}

export function normalizeLoginIdentifier(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }
  return digits;
}

export function detectIdentifierType(value) {
  const normalized = normalizeLoginIdentifier(value);
  if (normalized.length === 10) {
    return 'phone';
  }
  return 'cedula';
}

