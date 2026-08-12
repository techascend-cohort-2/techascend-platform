"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction, sendResetLinkAction, setSuspensionAction } from "@/lib/actions/staff";

// Minimal member shape these controls need. Reused by the Members list and the
// student detail page so admins and (student-scoped) managers get the same
// account actions wherever they land.
export type AccountControlsMember = {
  id: string;
  name: string;
  email: string;
  suspendedAt: string | null;
};

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 13.5,
  background: "#fff",
  color: "var(--ink)",
  width: "100%",
};

function TempPasswordCard({ password }: { password: string }) {
  return (
    <div
      className="pf-card"
      style={{ background: "var(--warnbg)", border: "1px solid #f0dcb8", padding: "14px 16px", marginTop: 12 }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--warn)", marginBottom: 6 }}>Temporary password</div>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 1,
          color: "var(--ink)",
          userSelect: "all",
        }}
      >
        {password}
      </div>
      <div style={{ fontSize: 12, color: "var(--warn)", marginTop: 6 }}>
        Share this with the member — they&apos;ll change it on first login.
      </div>
    </div>
  );
}

function ResetLinkCard({ url, emailed, email }: { url: string; emailed: boolean; email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="pf-card" style={{ background: "#f1eafc", border: "1px solid #dbc9f5", padding: "14px 16px", marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--brand1)", marginBottom: 6 }}>Password reset link</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
        {emailed
          ? `Emailed to ${email}. You can also copy the link below to share it directly.`
          : "Copy this link and send it to the member (WhatsApp, SMS, etc.). It expires in 24 hours, and their current password keeps working until they use it."}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          style={{ ...inputStyle, flex: 1, minWidth: 220, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}
        />
        <button
          type="button"
          className="pf-btn-grad"
          style={{ fontSize: 12.5 }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

/**
 * Account actions for a member (password reset link, temp password, suspend /
 * reactivate). Access is enforced server-side in the actions: admins may act
 * on anyone, managers on students only.
 */
export default function AccountControls({ member }: { member: AccountControlsMember }) {
  const router = useRouter();
  const [resetting, startReset] = useTransition();
  const [temp, setTemp] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [linking, startLink] = useTransition();
  const [link, setLink] = useState<{ url: string; emailed: boolean } | null>(null);
  const [suspending, startSuspend] = useTransition();
  const [suspendError, setSuspendError] = useState<string | null>(null);
  const isSuspended = Boolean(member.suspendedAt);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          className="pf-btn-soft"
          disabled={linking}
          style={{ fontSize: 12.5 }}
          onClick={() => {
            setResetError(null);
            setTemp(null);
            startLink(async () => {
              const res = await sendResetLinkAction(member.id);
              if (res.ok && res.resetLink) setLink({ url: res.resetLink, emailed: Boolean(res.emailed) });
              else setResetError(res.error ?? "Could not create a reset link.");
            });
          }}
        >
          {linking ? "Creating…" : link ? "Resend reset link" : "Send reset link"}
        </button>
        <button
          type="button"
          className="pf-btn-soft"
          disabled={resetting}
          style={{ fontSize: 12.5 }}
          onClick={() => {
            setResetError(null);
            setLink(null);
            startReset(async () => {
              const res = await resetPasswordAction(member.id);
              if (res.ok && res.tempPassword) setTemp(res.tempPassword);
              else setResetError(res.error ?? "Could not reset the password.");
            });
          }}
        >
          {resetting ? "Resetting…" : "Set temp password"}
        </button>
        <button
          type="button"
          className="pf-btn-soft"
          disabled={suspending}
          style={{ fontSize: 12.5, ...(isSuspended ? {} : { color: "var(--danger)", borderColor: "var(--danger)" }) }}
          onClick={() => {
            setSuspendError(null);
            if (isSuspended) {
              startSuspend(async () => {
                const res = await setSuspensionAction(member.id, false);
                if (res.ok) router.refresh();
                else setSuspendError(res.error ?? "Could not reactivate the account.");
              });
              return;
            }
            const reason = window.prompt(
              `Suspend ${member.name}? They won't be able to sign in until reactivated.\n\nOptional reason (shown to them):`,
            );
            if (reason === null) return; // cancelled
            startSuspend(async () => {
              const res = await setSuspensionAction(member.id, true, reason || undefined);
              if (res.ok) router.refresh();
              else setSuspendError(res.error ?? "Could not suspend the account.");
            });
          }}
        >
          {suspending ? "Saving…" : isSuspended ? "Reactivate account" : "Suspend account"}
        </button>
        {resetError && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{resetError}</span>}
        {suspendError && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{suspendError}</span>}
      </div>
      {isSuspended && (
        <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 8, fontWeight: 600 }}>
          This account is suspended — the member can&apos;t sign in.
        </div>
      )}
      {link && <ResetLinkCard url={link.url} emailed={link.emailed} email={member.email} />}
      {temp && <TempPasswordCard password={temp} />}
    </div>
  );
}
