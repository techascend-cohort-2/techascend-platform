import { prisma } from "@/lib/db";
import { encryptSecret, decryptSecret, maskSecret } from "@/lib/crypto";

const LCWAT_URL_KEY = "lcwat_gateway_url";
const LCWAT_APIKEY_ENC_KEY = "lcwat_api_key_enc";

async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
}

async function deleteSetting(key: string): Promise<void> {
  await prisma.setting.deleteMany({ where: { key } });
}

/** Effective LCWAT config: DB values (admin-set) take precedence over env. */
export async function getLcwatConfig(): Promise<{ url: string | null; apiKey: string | null }> {
  const [dbUrl, dbKeyEnc] = await Promise.all([getSetting(LCWAT_URL_KEY), getSetting(LCWAT_APIKEY_ENC_KEY)]);
  const rawUrl = dbUrl || process.env.LCWAT_GATEWAY_URL || "";
  const url = rawUrl ? rawUrl.replace(/\/+$/, "") : null;
  const apiKey = dbKeyEnc ? decryptSecret(dbKeyEnc) : process.env.LCWAT_API_KEY || null;
  return { url, apiKey };
}

/** True when the platform LCWAT gateway is usable (both URL and key resolve). */
export async function lcwatPlatformEnabled(): Promise<boolean> {
  const { url, apiKey } = await getLcwatConfig();
  return Boolean(url && apiKey);
}

/** Admin view: what's stored in the DB + whether an env fallback is active. */
export async function getLcwatAdminView(): Promise<{
  url: string;
  keyMasked: string | null;
  usingEnvUrl: boolean;
  usingEnvKey: boolean;
}> {
  const [dbUrl, dbKeyEnc] = await Promise.all([getSetting(LCWAT_URL_KEY), getSetting(LCWAT_APIKEY_ENC_KEY)]);
  const dbKeyPlain = dbKeyEnc ? decryptSecret(dbKeyEnc) : null;
  const envKey = process.env.LCWAT_API_KEY || null;
  return {
    url: dbUrl || process.env.LCWAT_GATEWAY_URL || "",
    keyMasked: dbKeyPlain ? maskSecret(dbKeyPlain) : envKey ? maskSecret(envKey) : null,
    usingEnvUrl: !dbUrl && Boolean(process.env.LCWAT_GATEWAY_URL),
    usingEnvKey: !dbKeyPlain && Boolean(envKey),
  };
}

/** Save admin LCWAT config. A blank apiKey leaves the stored key unchanged. */
export async function setLcwatConfig(url: string, apiKey: string): Promise<void> {
  const trimmedUrl = url.trim();
  if (trimmedUrl) await setSetting(LCWAT_URL_KEY, trimmedUrl);
  else await deleteSetting(LCWAT_URL_KEY);

  const trimmedKey = apiKey.trim();
  if (trimmedKey) await setSetting(LCWAT_APIKEY_ENC_KEY, encryptSecret(trimmedKey));
}

/** Remove the DB LCWAT config entirely (reverts to env fallback / disabled). */
export async function clearLcwatConfig(): Promise<void> {
  await Promise.all([deleteSetting(LCWAT_URL_KEY), deleteSetting(LCWAT_APIKEY_ENC_KEY)]);
}
