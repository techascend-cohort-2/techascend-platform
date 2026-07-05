const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

// Invisible formatting characters that sneak in when a phone number or email
// is copy-pasted from Contacts/Messages/WhatsApp: zero-width spaces/joiners
// (U+200B-U+200D), left-to-right/right-to-left marks (U+200E-U+200F), bidi
// embedding/override/pop-directional controls (U+202A-U+202E), word joiner
// (U+2060), byte-order mark (U+FEFF), Arabic letter mark (U+061C).
const INVISIBLE_RE = /[\u200B-\u200F\u202A-\u202E\u2060\uFEFF\u061C]/g;

export function stripInvisible(value: string): string {
  return value.replace(INVISIBLE_RE, "");
}

// TODO: support more countries once TechAscend expands beyond Cameroon.
const DEFAULT_COUNTRY_CODE = "237";

export function normalizeEmail(value: string): string | null {
  const lower = stripInvisible(value).trim().toLowerCase();
  return EMAIL_RE.test(lower) ? lower : null;
}

export function normalizePhone(value: string): string | null {
  const raw = stripInvisible(value).trim();
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

  // No country code given -- assume Cameroon for now. Drop a leading trunk
  // "0" some people type out of habit (Cameroon mobile numbers don't use one).
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length < 8 || digits.length > 9) return null;
  return `+${DEFAULT_COUNTRY_CODE}${digits}`;
}

export function normalizeEmailOrPhone(value: string): string | null {
  const raw = stripInvisible(value).trim();
  if (!raw) return null;

  return normalizeEmail(raw) ?? normalizePhone(raw);
}
