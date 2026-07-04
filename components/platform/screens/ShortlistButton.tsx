"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { shortlistAction } from "@/lib/actions/community";

export default function ShortlistButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onShortlist() {
    setError(null);
    startTransition(async () => {
      const res = await shortlistAction(studentId);
      if (res.error) {
        setError(res.error);
      } else {
        setDone(true);
        router.refresh();
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
      <button
        type="button"
        className="pf-shortlist"
        onClick={onShortlist}
        disabled={pending || done}
        style={pending ? { opacity: 0.6 } : undefined}
      >
        {pending ? "Adding…" : done ? "Shortlisted ✓" : "Shortlist"}
      </button>
      {error ? (
        <span style={{ fontSize: 11, color: "var(--danger)", fontWeight: 600 }}>{error}</span>
      ) : null}
    </div>
  );
}
