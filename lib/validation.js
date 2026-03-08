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
