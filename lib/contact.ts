const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

export function normalizeEmail(value: string): string | null {
  const lower = value.trim().toLowerCase();
  return EMAIL_RE.test(lower) ? lower : null;
}

export function normalizePhone(value: string): string | null {
  const raw = value.trim();
  if (!raw || !PHONE_CHARS_RE.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return raw.startsWith("+") ? `+${digits}` : digits;
}

export function normalizeEmailOrPhone(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;

  return normalizeEmail(raw) ?? normalizePhone(raw);
}
