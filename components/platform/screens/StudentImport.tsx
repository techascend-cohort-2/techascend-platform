"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { importStudentsAction, type ImportState } from "@/lib/actions/staff";

const EXAMPLE = `name,email,track,city,phone
Amina Njoya,amina@example.com,A,Douala,+237600000001
Marie Doh,marie@example.com,B,Yaoundé,
Grace Mba,grace@example.com,A,Buea,+237600000003`;

const input: React.CSSProperties = {
  border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px",
  fontSize: 13, fontFamily: "inherit", background: "#fff",
};

export default function StudentImport({ cohorts }: { cohorts: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [csv, setCsv] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, action, pending] = useActionState<ImportState, FormData>(
    async (prev, fd) => {
      const res = await importStudentsAction(prev, fd);
      if (res.ok) router.refresh();
      return res;
    },
    {},
  );

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    f.text().then(setCsv);
  }

  return (
    <div className="pf-card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div className="pf-h">Import students</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
            Bulk-create accounts from a CSV. Each student gets the default password and is prompted to change it on first login.
          </div>
        </div>
        <button className={open ? "pf-btn-soft" : "pf-btn-grad"} style={{ padding: "9px 17px", borderRadius: 10, fontSize: 12.5, cursor: "pointer" }} onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Import from CSV"}
        </button>
      </div>

      {open ? (
        <form action={action} style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
            Format (header optional): <code style={{ fontFamily: "var(--font-mono)", background: "#F4F1FA", padding: "1px 6px", borderRadius: 5 }}>name,email,track,city,phone</code>
            {" "}— <b>name</b> and <b>email</b> required; <b>track</b> A/B (defaults A); city/phone optional.
          </div>

          <textarea
            name="csv"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={9}
            placeholder={EXAMPLE}
            style={{ ...input, width: "100%", fontFamily: "var(--font-mono)", fontSize: 12.5, resize: "vertical" }}
          />

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
            <button type="button" className="pf-btn-soft" style={{ padding: "8px 14px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
              Upload .csv file
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" hidden onChange={onFile} />
            <button type="button" className="pf-link" style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer" }} onClick={() => setCsv(EXAMPLE)}>
              Load example
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap", marginTop: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--faint)", marginBottom: 4 }}>DEFAULT PASSWORD (min 8)</label>
              <input style={{ ...input, width: 230 }} name="defaultPassword" defaultValue="TechAscend2026!" minLength={8} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--faint)", marginBottom: 4 }}>COHORT</label>
              <select style={{ ...input, width: 220 }} name="cohortId" defaultValue={cohorts[0]?.id ?? ""}>
                <option value="">— no cohort —</option>
                {cohorts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button className="pf-btn-grad" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13 }} disabled={pending}>
              {pending ? "Importing…" : "Import students"}
            </button>
          </div>

          {state.error ? (
            <div style={{ marginTop: 12, fontSize: 12.5, color: "#B3243F", background: "#FDECEF", borderRadius: 9, padding: "9px 12px" }}>{state.error}</div>
          ) : null}

          {state.ok && state.summary ? (
            <div style={{ marginTop: 12, fontSize: 12.5, background: "var(--posbg)", color: "#14543A", borderRadius: 9, padding: "11px 14px" }}>
              <b>{state.summary.created} student{state.summary.created === 1 ? "" : "s"} created.</b>{" "}
              They can now sign in with the default password and will be asked to change it.
              {state.summary.skipped.length > 0 ? (
                <div style={{ marginTop: 6, color: "#7A4C08" }}>
                  Skipped {state.summary.skipped.length} (already had accounts): {state.summary.skipped.slice(0, 8).join(", ")}
                  {state.summary.skipped.length > 8 ? "…" : ""}
                </div>
              ) : null}
              {state.summary.errors.length > 0 ? (
                <div style={{ marginTop: 6, color: "#B3243F" }}>
                  {state.summary.errors.length} row(s) skipped: {state.summary.errors.slice(0, 6).join("; ")}
                  {state.summary.errors.length > 6 ? "…" : ""}
                </div>
              ) : null}
            </div>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
