"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createPostAction,
  deletePostAction,
  togglePinPostAction,
  type ActionState,
} from "@/lib/actions/community";
import { isStaff } from "@/lib/constants";

export type FeedPost = {
  id: string;
  body: string;
  pinned: boolean;
  createdAt: string; // ISO
  author: {
    id: string;
    name: string;
    initials: string;
    avatarBg: string;
    role: string;
    title: string | null;
  };
};

type CommunityScreenProps = {
  posts: FeedPost[];
  me: { id: string; role: string; name: string };
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function roleLabel(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

const initialState: ActionState = {};

function Composer({ meName }: { meName: string }) {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  const firstName = meName.split(" ")[0];

  return (
    <div className="pf-card pf-pad" style={{ marginBottom: 18 }}>
      <div className="pf-h" style={{ marginBottom: 12 }}>
        Share with the community
      </div>
      <form ref={formRef} action={formAction}>
        <textarea
          name="body"
          className="pf-notes"
          style={{ minHeight: 92 }}
          placeholder={`What's on your mind, ${firstName}? Wins, questions, resources…`}
          maxLength={3000}
          required
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <span style={{ fontSize: 12, color: "var(--faint)" }}>
            Be kind — everyone here is building something.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {state.error ? (
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--danger)" }}>{state.error}</span>
            ) : null}
            <button
              type="submit"
              className="pf-btn-grad"
              disabled={pending}
              style={{ fontSize: 13, padding: "10px 18px", borderRadius: 10, opacity: pending ? 0.7 : 1 }}
            >
              {pending ? "Posting…" : "Post update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function PostCard({ post, me }: { post: FeedPost; me: CommunityScreenProps["me"] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const staff = isStaff(me.role);
  const mine = post.author.id === me.id;

  function run(action: () => Promise<ActionState>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  const authorSub = post.author.title ?? roleLabel(post.author.role);

  return (
    <div className="pf-card pf-pad" style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.15s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: post.author.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13.5,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {post.author.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{post.author.name}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{authorSub}</span>
            <span style={{ fontSize: 11.5, color: "var(--faint)" }} suppressHydrationWarning>
              · {timeAgo(post.createdAt)}
            </span>
            {post.pinned ? (
              <span className="pf-badge-sm pf-badge-brand" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                Pinned
              </span>
            ) : null}
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {post.body}
          </div>
          {staff || mine ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              {staff ? (
                <button
                  className="pf-btn-soft"
                  disabled={isPending}
                  onClick={() => run(() => togglePinPostAction(post.id))}
                  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8 }}
                >
                  {post.pinned ? "Unpin" : "Pin"}
                </button>
              ) : null}
              {staff || mine ? (
                <button
                  className="pf-btn-soft"
                  disabled={isPending}
                  onClick={() => run(() => deletePostAction(post.id))}
                  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, color: "var(--danger)" }}
                >
                  Delete
                </button>
              ) : null}
              {error ? (
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)" }}>{error}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CommunityScreen({ posts, me }: CommunityScreenProps) {
  const pinnedCount = posts.filter((post) => post.pinned).length;

  return (
    <div className="pf-screen pf-w1180">
      <div className="pf-community-hero">
        <div>
          <div className="pf-eyebrow">Fellowship space</div>
          <div className="pf-community-title">Build in public, learn together.</div>
          <div className="pf-community-copy">
            Share wins, questions, useful resources, and program announcements with the TechAscend community.
          </div>
        </div>
        <div className="pf-community-stats">
          <div>
            <b>{posts.length}</b>
            <span>updates</span>
          </div>
          <div>
            <b>{pinnedCount}</b>
            <span>pinned</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Composer meName={me.name} />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} me={me} />
          ))}

          {posts.length === 0 ? (
            <div className="pf-card" style={{ padding: "44px 32px", textAlign: "center" }}>
              <div className="pf-h" style={{ fontSize: 17, marginBottom: 6 }}>
                It&apos;s quiet in here… for now
              </div>
              <div style={{ fontSize: 13.5, color: "var(--muted)", maxWidth: 380, margin: "0 auto", lineHeight: 1.55 }}>
                Be the first to post — share a win, ask a question, or drop a resource for your cohort.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
