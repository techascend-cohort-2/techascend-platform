const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

// TODO: support more countries once TechAscend expands beyond Cameroon.
const DEFAULT_COUNTRY_CODE = "237";

export function normalizeEmail(value: string): string | null {
  const lower = value.trim().toLowerCase();
  return EMAIL_RE.test(lower) ? lower : null;
}

export function normalizePhone(value: string): string | null {
  const raw = value.trim();
  if (!raw || !PHONE_CHARS_RE.test(raw)) return null;

  const hasPlus = raw.startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (hasPlus) {
    if (digits.length < 8 || digits.length > 15) return null;
    return `+${digits}`;
  }

  // Already has the Cameroon country code, just missing the "+".
  if (digits.startsWith(DEFAULT_COUNTRY_CODE) && digits.length === DEFAULT_COUNTRY_CODE.length + 9) {
    return `+${digits}`;
  }

  // No country code given — assume Cameroon for now. Drop a leading trunk
  // "0" some people type out of habit (Cameroon mobile numbers don't use one).
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length < 8 || digits.length > 9) return null;
  return `+${DEFAULT_COUNTRY_CODE}${digits}`;
}

export function normalizeEmailOrPhone(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;

  return normalizeEmail(raw) ?? normalizePhone(raw);
}
