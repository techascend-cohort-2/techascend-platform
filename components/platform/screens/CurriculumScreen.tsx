"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  savePhaseAction,
  saveModuleAction,
  saveLessonAction,
  deleteModuleAction,
  deleteLessonAction,
  type ActionState,
} from "@/lib/actions/staff";

type L = {
  id: string;
  title: string;
  type: string;
  duration: string | null;
  content: string | null;
  aiPrompt: string | null;
  objectives: string[];
  orderIndex: number;
};
type M = { id: string; title: string; description: string | null; track: string; lessons: L[] };
type P = {
  id: string;
  name: string;
  description: string | null;
  startsAt: string | null;
  endsAt: string | null;
  badgeName: string | null;
  modules: M[];
};

const inp: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 9,
  padding: "8px 11px",
  fontSize: 12.5,
  fontFamily: "inherit",
  background: "#fff",
};
const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 800, color: "var(--faint)", margin: "10px 0 4px", letterSpacing: 0.3 };

function Err({ s }: { s: ActionState }) {
  return s.error ? <div style={{ marginTop: 8, fontSize: 12, color: "#B3243F" }}>{s.error}</div> : null;
}

function LessonForm({
  lesson,
  moduleId,
  onDone,
}: {
  lesson: L | null;
  moduleId: string;
  onDone: () => void;
}) {
  const bound = saveLessonAction.bind(null, lesson ? { lessonId: lesson.id } : { moduleId });
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await bound(prev, fd);
      if (res.ok) onDone();
      return res;
    },
    {},
  );
  return (
    <form action={action} style={{ background: "#FBFAFE", border: "1px solid var(--line)", borderRadius: 10, padding: 14, marginTop: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px", gap: 10 }}>
        <div>
          <label style={lbl}>Title</label>
          <input style={inp} name="title" defaultValue={lesson?.title ?? ""} required />
        </div>
        <div>
          <label style={lbl}>Type</label>
          <select style={inp} name="type" defaultValue={lesson?.type ?? "ai"}>
            <option value="ai">ai (lesson)</option>
            <option value="task">task</option>
            <option value="video">video</option>
            <option value="quiz">quiz</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Duration</label>
          <input style={inp} name="duration" defaultValue={lesson?.duration ?? ""} placeholder="30 min" />
        </div>
        <div>
          <label style={lbl}>Order</label>
          <input style={inp} name="orderIndex" type="number" defaultValue={lesson?.orderIndex ?? ""} />
        </div>
      </div>
      <label style={lbl}>Objectives (one per line)</label>
      <textarea style={{ ...inp, resize: "vertical" }} name="objectives" rows={3} defaultValue={lesson?.objectives.join("\n") ?? ""} />
      <label style={lbl}>Content (markdown)</label>
      <textarea style={{ ...inp, resize: "vertical", fontFamily: "var(--font-mono)" }} name="content" rows={10} defaultValue={lesson?.content ?? ""} />
      <label style={lbl}>AI Tutor context (injected when a student asks for help on this lesson)</label>
      <textarea style={{ ...inp, resize: "vertical" }} name="aiPrompt" rows={2} defaultValue={lesson?.aiPrompt ?? ""} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="pf-btn-grad" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending}>
          {pending ? "Saving…" : lesson ? "Save lesson" : "Add lesson"}
        </button>
        <button type="button" className="pf-btn-soft" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} onClick={onDone}>
          Cancel
        </button>
      </div>
      <Err s={state} />
    </form>
  );
}

function ModuleForm({ mod, phaseId, onDone }: { mod: M | null; phaseId: string; onDone: () => void }) {
  const bound = saveModuleAction.bind(null, mod ? { moduleId: mod.id } : { phaseId });
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await bound(prev, fd);
      if (res.ok) onDone();
      return res;
    },
    {},
  );
  return (
    <form action={action} style={{ background: "#FBFAFE", border: "1px solid var(--line)", borderRadius: 10, padding: 14, marginTop: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 120px", gap: 10 }}>
        <div>
          <label style={lbl}>Module title</label>
          <input style={inp} name="title" defaultValue={mod?.title ?? ""} required />
        </div>
        <div>
          <label style={lbl}>Description</label>
          <input style={inp} name="description" defaultValue={mod?.description ?? ""} />
        </div>
        <div>
          <label style={lbl}>Track</label>
          <select style={inp} name="track" defaultValue={mod?.track ?? "ALL"}>
            <option value="ALL">Both tracks</option>
            <option value="A">Track A</option>
            <option value="B">Track B</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="pf-btn-grad" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending}>
          {pending ? "Saving…" : mod ? "Save module" : "Add module"}
        </button>
        <button type="button" className="pf-btn-soft" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} onClick={onDone}>
          Cancel
        </button>
      </div>
      <Err s={state} />
    </form>
  );
}

function PhaseForm({ phase, onDone }: { phase: P; onDone: () => void }) {
  const bound = savePhaseAction.bind(null, phase.id);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await bound(prev, fd);
      if (res.ok) onDone();
      return res;
    },
    {},
  );
  const d = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
  return (
    <form action={action} style={{ background: "#FBFAFE", border: "1px solid var(--line)", borderRadius: 10, padding: 14, marginTop: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
        <div>
          <label style={lbl}>Phase name</label>
          <input style={inp} name="name" defaultValue={phase.name} required />
        </div>
        <div>
          <label style={lbl}>Starts</label>
          <input style={inp} name="startsAt" type="date" defaultValue={d(phase.startsAt)} />
        </div>
        <div>
          <label style={lbl}>Ends</label>
          <input style={inp} name="endsAt" type="date" defaultValue={d(phase.endsAt)} />
        </div>
      </div>
      <label style={lbl}>Description</label>
      <textarea style={{ ...inp, resize: "vertical" }} name="description" rows={2} defaultValue={phase.description ?? ""} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="pf-btn-grad" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending}>
          {pending ? "Saving…" : "Save phase"}
        </button>
        <button type="button" className="pf-btn-soft" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} onClick={onDone}>
          Cancel
        </button>
      </div>
      <Err s={state} />
    </form>
  );
}

export default function CurriculumScreen({ phases }: { phases: P[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [open, setOpen] = useState<string | null>(phases[0]?.id ?? null);
  const [editing, setEditing] = useState<string | null>(null); // "phase:<id>" | "module:<id>" | "lesson:<id>" | "newmod:<phaseId>" | "newlesson:<moduleId>"

  const done = () => {
    setEditing(null);
    router.refresh();
  };
  const del = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
        Everything here is live for students the moment you save. Lessons support markdown; the AI-context field steers the tutor per lesson.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {phases.map((phase) => (
          <div key={phase.id} className="pf-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setOpen(open === phase.id ? null : phase.id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 15.5, color: "var(--ink)", padding: 0, textAlign: "left", flex: 1, minWidth: 200 }}
              >
                {open === phase.id ? "▾" : "▸"} {phase.name}
                <span style={{ fontWeight: 600, fontSize: 12, color: "var(--faint)" }}>
                  {" "}· {phase.modules.length} modules · {phase.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons
                  {phase.badgeName ? ` · ${phase.badgeName}` : ""}
                </span>
              </button>
              <button className="pf-link" style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer" }} onClick={() => setEditing(editing === `phase:${phase.id}` ? null : `phase:${phase.id}`)}>
                Edit phase
              </button>
            </div>
            {editing === `phase:${phase.id}` ? <PhaseForm phase={phase} onDone={done} /> : null}

            {open === phase.id ? (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {phase.modules.map((mod) => (
                  <div key={mod.id} style={{ border: "1px solid var(--line)", borderRadius: 11, padding: 13 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <span style={{ fontWeight: 800, fontSize: 13.5 }}>{mod.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, marginLeft: 8, color: mod.track === "ALL" ? "var(--brand1)" : mod.track === "A" ? "#2D6FD9" : "#D6336C", background: mod.track === "ALL" ? "#F1EAFC" : mod.track === "A" ? "#E6F0FC" : "#FCE7F0", padding: "2px 8px", borderRadius: 12 }}>
                          {mod.track === "ALL" ? "Both tracks" : `Track ${mod.track}`}
                        </span>
                      </div>
                      <button className="pf-link" style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer" }} onClick={() => setEditing(editing === `module:${mod.id}` ? null : `module:${mod.id}`)}>
                        Edit
                      </button>
                      <button
                        style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#B3243F" }}
                        onClick={() => {
                          if (confirm(`Delete module "${mod.title}" and its ${mod.lessons.length} lessons? Student progress on them is lost.`)) {
                            del(() => deleteModuleAction(mod.id));
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    {editing === `module:${mod.id}` ? <ModuleForm mod={mod} phaseId={phase.id} onDone={done} /> : null}

                    <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 5 }}>
                      {mod.lessons.map((l) => (
                        <div key={l.id}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, padding: "6px 9px", borderRadius: 8, background: "#FBFAFE" }}>
                            <span style={{ color: "var(--faint)", width: 20, textAlign: "right" }}>{l.orderIndex}.</span>
                            <span style={{ flex: 1, fontWeight: 600 }}>{l.title}</span>
                            <span style={{ color: "var(--faint)", fontSize: 11.5 }}>{l.type}{l.duration ? ` · ${l.duration}` : ""}</span>
                            <button className="pf-link" style={{ fontSize: 11.5, background: "none", border: "none", cursor: "pointer" }} onClick={() => setEditing(editing === `lesson:${l.id}` ? null : `lesson:${l.id}`)}>
                              Edit
                            </button>
                            <button
                              style={{ fontSize: 11.5, background: "none", border: "none", cursor: "pointer", color: "#B3243F" }}
                              onClick={() => {
                                if (confirm(`Delete lesson "${l.title}"?`)) del(() => deleteLessonAction(l.id));
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          {editing === `lesson:${l.id}` ? <LessonForm lesson={l} moduleId={mod.id} onDone={done} /> : null}
                        </div>
                      ))}
                      {editing === `newlesson:${mod.id}` ? (
                        <LessonForm lesson={null} moduleId={mod.id} onDone={done} />
                      ) : (
                        <button className="pf-btn-soft" style={{ padding: "7px 13px", borderRadius: 8, fontSize: 12, cursor: "pointer", alignSelf: "flex-start" }} onClick={() => setEditing(`newlesson:${mod.id}`)}>
                          + Add lesson
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {editing === `newmod:${phase.id}` ? (
                  <ModuleForm mod={null} phaseId={phase.id} onDone={done} />
                ) : (
                  <button className="pf-btn-soft" style={{ padding: "9px 15px", borderRadius: 9, fontSize: 12.5, cursor: "pointer", alignSelf: "flex-start" }} onClick={() => setEditing(`newmod:${phase.id}`)}>
                    + Add module to this phase
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
