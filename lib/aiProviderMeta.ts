// Metadata for the AI providers students can bring their own tutor key from.
// Pure data — safe to import from client components. The streaming logic that
// actually uses these keys lives in lib/ai.ts (server-only).

export type AiProviderId = "gemini" | "anthropic" | "openai" | "lcwat";

export type AiProviderMeta = {
  id: AiProviderId;
  label: string;
  free: boolean;
  placeholder: string;
  // getKeyUrl/getKeyLabel omitted for providers with no public signup (LCWAT).
  getKeyUrl?: string;
  getKeyLabel?: string;
  howTo: string;
};

// Order matters: the tutor tries the student's keys in this order and falls
// back to the next provider when one is exhausted or rejected. Gemini first
// because it's the only free public one; the TechAscend LCWAT gateway is the
// final fallback (and works with no student key when the program enables it).
export const AI_PROVIDERS: AiProviderMeta[] = [
  {
    id: "gemini",
    label: "Google Gemini",
    free: true,
    placeholder: "AIza…",
    getKeyUrl: "https://aistudio.google.com/apikey",
    getKeyLabel: "Google AI Studio",
    howTo:
      "Sign in with any Google account, click “Create API key”, and copy it. Free — no card required, with a generous daily limit that resets every day.",
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    free: false,
    placeholder: "sk-ant-…",
    getKeyUrl: "https://console.anthropic.com/settings/keys",
    getKeyLabel: "console.anthropic.com",
    howTo:
      "Create an account, go to Settings → API keys, and click “Create key”. Paid — you load a small credit (from $5) and only pay for what you use.",
  },
  {
    id: "openai",
    label: "OpenAI (ChatGPT)",
    free: false,
    placeholder: "sk-…",
    getKeyUrl: "https://platform.openai.com/api-keys",
    getKeyLabel: "platform.openai.com",
    howTo:
      "Create an account, open the API keys page, and click “Create new secret key”. Paid — add a small credit in Billing; each message costs a fraction of a cent.",
  },
  {
    id: "lcwat",
    label: "TechAscend LCWAT",
    free: true,
    placeholder: "lcwat_…",
    howTo:
      "TechAscend's own AI gateway. If the program has enabled it, you can use the AI Tutor with no key at all. To use your own gateway key instead, paste it here — the TechAscend team issues these.",
  },
];

export const AI_PROVIDER_IDS = AI_PROVIDERS.map((p) => p.id);

export function isAiProviderId(v: string): v is AiProviderId {
  return (AI_PROVIDER_IDS as string[]).includes(v);
}
