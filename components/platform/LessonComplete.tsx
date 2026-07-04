"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLessonAction } from "@/lib/actions/program";

export default function LessonComplete({
  lessonId,
  completed,
  nextHref,
}: {
  lessonId: string;
  completed: boolean;
  nextHref: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function toggle() {
    setError("");
    startTransition(async () => {
      const res = await toggleLessonAction(lessonId, !completed);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (!completed && nextHref) {
        router.push(nextHref);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <button
        onClick={toggle}
        disabled={pending}
        className={completed ? "pf-btn-soft" : "pf-btn-grad"}
        style={{ padding: "12px 22px", borderRadius: 12, fontSize: 13.5, cursor: "pointer" }}
      >
        {pending
          ? "Saving…"
          : completed
            ? "✓ Completed — click to undo"
            : nextHref
              ? "Mark complete & continue →"
              : "Mark complete"}
      </button>
      {error ? <span style={{ fontSize: 12.5, color: "var(--danger)" }}>{error}</span> : null}
    </div>
  );
}
