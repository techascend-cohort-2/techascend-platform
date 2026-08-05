// Absolute base URL for links that leave the app (emails, copyable reset
// links, social cards). Configure NEXT_PUBLIC_SITE_URL in production; the
// fallback is the public site so links are never broken.
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.tech-ascend.com").replace(/\/+$/, "");
}
