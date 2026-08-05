// Minimal, dependency-free transactional email. Uses Resend's HTTP API when
// RESEND_API_KEY is configured; otherwise reports "not sent" so callers can
// fall back to a copyable link. Add other providers here behind the same
// sendEmail() contract if needed.

export type SendResult = { sent: boolean; error?: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && (process.env.EMAIL_FROM || process.env.RESEND_FROM));
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return { sent: false, error: "email_not_configured" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.text ? { text: opts.text } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[mailer] Resend error:", res.status, detail.slice(0, 300));
      return { sent: false, error: `send_failed_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[mailer] send threw:", err instanceof Error ? err.message : err);
    return { sent: false, error: "send_threw" };
  }
}
