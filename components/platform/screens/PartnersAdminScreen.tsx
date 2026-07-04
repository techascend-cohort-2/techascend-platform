"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  savePartnerOrgAction,
  createPartnerUserAction,
  deletePartnerOrgAction,
  type ActionState,
} from "@/lib/actions/staff";
import { PARTNER_TYPES } from "@/lib/constants";

export type PartnerOrg = {
  id: string;
  name: string;
  abbr: string | null;
  type: string;
  contribution: string | null;
  contactInfo: string | null;
  website: string | null;
  users: { id: string; name: string; email: string }[];
  counts: { opportunities: number; pipelineCards: number };
};

const inp: React.CSSProperties = {
  width: "100%", border: "1px solid var(--line)", borderRadius: 9,
  padding: "9px 12px", fontSize: 13, fontFamily: "inherit", background: "#fff",
};
const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 800, color: "var(--faint)", margin: "10px 0 4px", letterSpacing: 0.3 };

function OrgForm({ org, onDone }: { org: PartnerOrg | null; onDone: () => void }) {
  const bound = savePartnerOrgAction.bind(null, org?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await bound(prev, fd);
      if (res.ok) onDone();
      return res;
    },
    {},
  );
  return (
    <form action={action} style={{ background: "#FBFAFE", border: "1px solid var(--line)", borderRadius: 10, padding: 14, marginTop: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 90px 1fr", gap: 10 }}>
        <div><label style={lbl}>Organisation name</label><input style={inp} name="name" defaultValue={org?.name ?? ""} required /></div>
        <div><label style={lbl}>Abbr</label><input style={inp} name="abbr" defaultValue={org?.abbr ?? ""} maxLength={5} /></div>
        <div>
          <label style={lbl}>Type</label>
          <select style={inp} name="type" defaultValue={org?.type ?? "hiring"}>
            {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div><label style={lbl}>Contribution</label><input style={inp} name="contribution" defaultValue={org?.contribution ?? ""} placeholder="e.g. 20 sponsored seats" /></div>
        <div><label style={lbl}>Contact</label><input style={inp} name="contactInfo" defaultValue={org?.contactInfo ?? ""} placeholder="email / phone" /></div>
        <div><label style={lbl}>Website</label><input style={inp} name="website" type="url" defaultValue={org?.website ?? ""} placeholder="https://…" /></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="pf-btn-grad" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending}>
          {pending ? "Saving…" : org ? "Save" : "Create organisation"}
        </button>
        <button type="button" className="pf-btn-soft" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} onClick={onDone}>Cancel</button>
      </div>
      {state.error ? <div style={{ marginTop: 8, fontSize: 12, color: "#B3243F" }}>{state.error}</div> : null}
    </form>
  );
}

function AccountForm({ partnerId, onPwd }: { partnerId: string; onPwd: (email: string, pwd: string) => void }) {
  const bound = createPartnerUserAction.bind(null, partnerId);
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await bound(prev, fd);
      if (res.ok && res.tempPassword) onPwd(String(fd.get("email")), res.tempPassword);
      return res;
    },
    {},
  );
  return (
    <form action={action} style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
      <input style={{ ...inp, width: 170 }} name="name" placeholder="Contact name" required />
      <input style={{ ...inp, width: 220 }} name="email" type="email" placeholder="email@org.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="pf-btn-soft" style={{ padding: "9px 14px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} disabled={pending}>
        {pending ? "Creating…" : "+ Add account"}
      </button>
      {state.error ? <span style={{ fontSize: 12, color: "#B3243F" }}>{state.error}</span> : null}
    </form>
  );
}

export default function PartnersAdminScreen({ orgs }: { orgs: PartnerOrg[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pwd, setPwd] = useState<{ email: string; pwd: string } | null>(null);

  const done = () => {
    setEditing(null);
    setCreating(false);
    router.refresh();
  };

  return (
    <div className="pf-screen pf-w1180">
      {pwd ? (
        <div style={{ marginBottom: 16, background: "#FCF1DE", border: "1px solid #F2DBB4", borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: "#7A4C08" }}>Partner account created — {pwd.email}</div>
          <div style={{ fontSize: 13, color: "#7A4C08", marginTop: 4 }}>
            Temporary password:{" "}
            <code style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 14, background: "#fff", padding: "2px 8px", borderRadius: 6 }}>{pwd.pwd}</code>
            {" "}— shown once; share it privately.
          </div>
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
          Organisations that fund, hire from, or support the program. Each can have login accounts for the Partner Portal.
        </div>
        <button className="pf-btn-grad" style={{ padding: "9px 17px", borderRadius: 10, fontSize: 12.5 }} onClick={() => setCreating((v) => !v)}>
          + New partner organisation
        </button>
      </div>
      {creating ? <OrgForm org={null} onDone={done} /> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        {orgs.length === 0 && !creating ? (
          <div className="pf-card" style={{ padding: 32, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
            No partner organisations yet — add your first sponsor, hiring or tech partner above.
          </div>
        ) : null}
        {orgs.map((org) => (
          <div key={org.id} className="pf-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13, color: "var(--brand1)", background: "#F1EAFC" }}>
                {org.abbr ?? org.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 800, fontSize: 14.5 }}>
                  {org.name}
                  <span style={{ fontSize: 11, fontWeight: 800, marginLeft: 8, color: "#2D6FD9", background: "#E6F0FC", padding: "2px 9px", borderRadius: 12 }}>{org.type}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {org.contribution ?? "—"}
                  {org.contactInfo ? ` · ${org.contactInfo}` : ""}
                  {org.website ? (
                    <> · <a href={org.website} target="_blank" rel="noreferrer" className="pf-link">website ↗</a></>
                  ) : null}
                </div>
              </div>
              <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
                {org.users.length} account{org.users.length === 1 ? "" : "s"} · {org.counts.opportunities} opps · {org.counts.pipelineCards} in pipeline
              </span>
              <button className="pf-link" style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer" }} onClick={() => setEditing(editing === org.id ? null : org.id)}>
                Edit
              </button>
              <button
                style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#B3243F" }}
                onClick={() => {
                  if (confirm(`Delete ${org.name}? (Blocked if it still has accounts.)`)) {
                    start(async () => {
                      const res = await deletePartnerOrgAction(org.id);
                      if (res.error) alert(res.error);
                      router.refresh();
                    });
                  }
                }}
              >
                Delete
              </button>
            </div>
            {editing === org.id ? <OrgForm org={org} onDone={done} /> : null}
            {org.users.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {org.users.map((u) => (
                  <span key={u.id} style={{ fontSize: 11.5, background: "#FBFAFE", border: "1px solid var(--line)", borderRadius: 16, padding: "4px 11px" }}>
                    {u.name} · {u.email}
                  </span>
                ))}
              </div>
            ) : null}
            <AccountForm partnerId={org.id} onPwd={(email, p) => setPwd({ email, pwd: p })} />
          </div>
        ))}
      </div>
    </div>
  );
}
