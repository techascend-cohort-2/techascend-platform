"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  type ActionState,
} from "@/lib/actions/community";
import { EVENT_KINDS, EVENT_AUDIENCES } from "@/lib/constants";

export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  audience: string;
  location: string | null;
  link: string | null;
  startsAt: string; // ISO
  endsAt: string | null; // ISO
};

type EventsScreenProps = {
  upcoming: EventItem[];
  past: EventItem[];
  isStaff: boolean;
};

const TZ = "Africa/Douala";

const KIND_STYLES: Record<string, { fg: string; bg: string; label: string }> = {
  live_session: { fg: "#7C3AED", bg: "#F1EAFC", label: "Live session" },
  workshop: { fg: "#2D6FD9", bg: "#E6F0FC", label: "Workshop" },
  deadline: { fg: "#C97A0E", bg: "#FCF1DE", label: "Deadline" },
  ceremony: { fg: "#D6336C", bg: "#FCE7F0", label: "Ceremony" },
  community: { fg: "#1F9D6B", bg: "#E6F6EF", label: "Community" },
};

const AUDIENCE_LABELS: Record<string, string> = {
  all: "Everyone",
  students: "Students",
  applicants: "Applicants",
  partners: "Partners",
  staff: "Staff",
};

function kindStyle(kind: string) {
  return KIND_STYLES[kind] ?? { fg: "var(--brand1)", bg: "#F1EAFC", label: kind.replace(/_/g, " ") };
}

function dateBlock(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-GB", { day: "numeric", timeZone: TZ }),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: TZ }),
  };
}

function formatWhen(startISO: string, endISO: string | null): string {
  const start = new Date(startISO);
  const day = start.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  });
  const time = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
  const range = endISO ? `${time(start)}–${time(new Date(endISO))}` : time(start);
  return `${day} · ${range}`;
}

// Prefill value for <input type="datetime-local"> from a stored ISO date.
function toInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "9px 12px",
  fontFamily: "inherit",
  fontSize: 13,
  color: "var(--ink)",
  background: "var(--bg)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11.5,
  fontWeight: 700,
  color: "var(--muted)",
  marginBottom: 5,
};

const initialState: ActionState = {};

function EventForm({
  action,
  initial,
  submitLabel,
  onCancel,
  onDone,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: EventItem;
  submitLabel: string;
  onCancel: () => void;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input name="title" defaultValue={initial?.title ?? ""} required minLength={2} style={inputStyle} placeholder="e.g. Live coding session" />
        </div>
        <div>
          <label style={labelStyle}>Kind</label>
          <select name="kind" defaultValue={initial?.kind ?? "live_session"} style={inputStyle}>
            {EVENT_KINDS.map((k) => (
              <option key={k} value={k}>
                {kindStyle(k).label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Audience</label>
          <select name="audience" defaultValue={initial?.audience ?? "all"} style={inputStyle}>
            {EVENT_AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABELS[a] ?? a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Location</label>
          <input name="location" defaultValue={initial?.location ?? ""} style={inputStyle} placeholder="Google Meet, Douala hub…" />
        </div>
        <div>
          <label style={labelStyle}>Link (optional)</label>
          <input name="link" type="url" defaultValue={initial?.link ?? ""} style={inputStyle} placeholder="https://…" />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          style={{ ...inputStyle, minHeight: 70, resize: "vertical", lineHeight: 1.5 }}
          placeholder="What should people expect?"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Starts at</label>
          <input name="startsAt" type="datetime-local" defaultValue={toInputValue(initial?.startsAt ?? null)} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Ends at (optional)</label>
          <input name="endsAt" type="datetime-local" defaultValue={toInputValue(initial?.endsAt ?? null)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="submit"
          className="pf-btn-grad"
          disabled={pending}
          style={{ fontSize: 13, padding: "10px 18px", borderRadius: 10, opacity: pending ? 0.7 : 1 }}
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="pf-btn-soft" onClick={onCancel} style={{ fontSize: 13, padding: "10px 16px", borderRadius: 10 }}>
          Cancel
        </button>
        {state.error ? (
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--danger)" }}>{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}

function EventCard({ event, isStaff, dimmed }: { event: EventItem; isStaff: boolean; dimmed?: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const ks = kindStyle(event.kind);
  const { day, month } = dateBlock(event.startsAt);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteEventAction(event.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="pf-card pf-pad">
        <div className="pf-h" style={{ marginBottom: 14 }}>Edit event</div>
        <EventForm
          action={updateEventAction.bind(null, event.id)}
          initial={event}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onDone={() => {
            setEditing(false);
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="pf-card pf-pad"
      style={{ opacity: dimmed ? 0.65 : isPending ? 0.6 : 1, transition: "opacity 0.15s" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div
          style={{
            width: 58,
            flexShrink: 0,
            textAlign: "center",
            background: ks.bg,
            borderRadius: 12,
            padding: "9px 4px",
          }}
        >
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, lineHeight: 1, color: ks.fg }}>
            {day}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: ks.fg, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {month}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 15 }}>{event.title}</span>
            <span className="pf-badge-sm" style={{ color: ks.fg, background: ks.bg }}>
              {ks.label}
            </span>
            {isStaff ? (
              <span className="pf-badge-sm" style={{ color: "var(--muted)", background: "var(--bg)" }}>
                {AUDIENCE_LABELS[event.audience] ?? event.audience}
              </span>
            ) : null}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginTop: 5 }}>
            {formatWhen(event.startsAt, event.endsAt)}
            {event.location ? <span> · {event.location}</span> : null}
          </div>
          {event.description ? (
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginTop: 7 }}>
              {event.description}
            </div>
          ) : null}
          {error ? (
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)", marginTop: 8 }}>{error}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          {event.link ? (
            <a
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="pf-btn-grad"
              style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 9, textDecoration: "none", display: "inline-block" }}
            >
              Join
            </a>
          ) : null}
          {isStaff ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="pf-btn-soft"
                onClick={() => setEditing(true)}
                disabled={isPending}
                style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8 }}
              >
                Edit
              </button>
              <button
                className="pf-btn-soft"
                onClick={handleDelete}
                disabled={isPending}
                style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, color: "var(--danger)" }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function EventsScreen({ upcoming, past, isStaff }: EventsScreenProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [showPast, setShowPast] = useState(false);

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="pf-h" style={{ fontSize: 17 }}>Upcoming</div>
          {isStaff ? (
            <button
              className={adding ? "pf-btn-soft" : "pf-btn-grad"}
              onClick={() => setAdding((v) => !v)}
              style={{ fontSize: 13, padding: "10px 16px", borderRadius: 10 }}
            >
              {adding ? "Close" : "+ Add event"}
            </button>
          ) : null}
        </div>

        {isStaff && adding ? (
          <div className="pf-card pf-pad" style={{ marginBottom: 16 }}>
            <div className="pf-h" style={{ marginBottom: 14 }}>New event</div>
            <EventForm
              action={createEventAction}
              submitLabel="Create event"
              onCancel={() => setAdding(false)}
              onDone={() => {
                setAdding(false);
                router.refresh();
              }}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} isStaff={isStaff} />
          ))}
          {upcoming.length === 0 ? (
            <div className="pf-card" style={{ padding: "40px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🗓️</div>
              <div className="pf-h" style={{ fontSize: 16, marginBottom: 4 }}>No upcoming events yet.</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                {isStaff ? "Add the first one with the button above." : "Check back soon — new sessions are added regularly."}
              </div>
            </div>
          ) : null}
        </div>

        {past.length > 0 ? (
          <div style={{ marginTop: 28 }}>
            <button className="pf-link" onClick={() => setShowPast((v) => !v)} style={{ fontSize: 13, padding: 0 }}>
              {showPast ? "Hide past events ↑" : `Show past events (${past.length}) ↓`}
            </button>
            {showPast ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                {past.map((event) => (
                  <EventCard key={event.id} event={event} isStaff={isStaff} dimmed />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
