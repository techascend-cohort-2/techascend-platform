import "server-only";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site";
import { sendEmail } from "@/lib/mailer";

// How long a reset link stays valid. Self-service links are short-lived;
// staff-issued links get a longer window since they may be relayed by hand.
export const SELF_RESET_TTL_MIN = 60;
export const STAFF_RESET_TTL_MIN = 60 * 24;

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function resetLinkFor(rawToken: string): string {
  return `${siteUrl()}/reset-password?token=${rawToken}`;
}

/**
 * Issue a fresh reset token for a user. Any earlier unused tokens are
 * invalidated so only the newest link works — this is also what makes
 * "resend" safe: the previous link stops working the moment a new one is cut.
 * Returns the raw token (only time it exists in plaintext) and the full link.
 */
export async function createResetToken(
  userId: string,
  ttlMinutes: number,
): Promise<{ token: string; link: string; expiresAt: Date }> {
  await prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);
  await prisma.passwordResetToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  return { token, link: resetLinkFor(token), expiresAt };
}

/** Look up a still-valid token. Returns the userId or null. */
export async function findValidReset(rawToken: string): Promise<{ id: string; userId: string } | null> {
  if (!rawToken) return null;
  const row = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(rawToken) } });
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) return null;
  return { id: row.id, userId: row.userId };
}

/** Consume a token so a link can't be reused. */
export async function consumeReset(tokenId: string): Promise<void> {
  await prisma.passwordResetToken.update({ where: { id: tokenId }, data: { usedAt: new Date() } });
}

export async function sendResetEmail(
  to: string,
  name: string | null,
  link: string,
  ttlMinutes: number,
): Promise<boolean> {
  const hours = Math.round(ttlMinutes / 60);
  const window = ttlMinutes >= 60 ? `${hours} hour${hours === 1 ? "" : "s"}` : `${ttlMinutes} minutes`;
  const greeting = name ? `Hi ${name},` : "Hi,";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
      <h2 style="color:#6d28d9;margin-bottom:8px">Reset your TechAscend password</h2>
      <p>${greeting}</p>
      <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in ${window}.</p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#6d28d9;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block">Reset password</a>
      </p>
      <p style="font-size:13px;color:#666">Or paste this link into your browser:<br><a href="${link}">${link}</a></p>
      <p style="font-size:13px;color:#666">If you didn't request this, you can safely ignore this email — your password won't change.</p>
    </div>`;
  const text = `${greeting}\n\nReset your TechAscend password using this link (expires in ${window}):\n${link}\n\nIf you didn't request this, ignore this email.`;
  const res = await sendEmail({ to, subject: "Reset your TechAscend password", html, text });
  return res.sent;
}
