import React from "react";

// Minimal markdown renderer for lesson content (headings, bold, inline code,
// fenced code blocks, lists, blockquotes, paragraphs). No external deps.

function inline(text: string, keyBase: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Split on **bold** and `code`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(<b key={`${keyBase}-b${i}`}>{tok.slice(2, -2)}</b>);
    } else {
      parts.push(
        <code
          key={`${keyBase}-c${i}`}
          style={{
            background: "#F4F1FA",
            border: "1px solid #E7E1F2",
            borderRadius: 5,
            padding: "1px 6px",
            fontSize: "0.9em",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const segments = text.split(/```/);

  segments.forEach((seg, si) => {
    if (si % 2 === 1) {
      // code fence
      const code = seg.replace(/^[a-z]*\n/, "");
      blocks.push(
        <pre
          key={`pre-${si}`}
          style={{
            background: "#1E1633",
            color: "#E9E3F7",
            borderRadius: 12,
            padding: "14px 16px",
            fontSize: 12.5,
            lineHeight: 1.6,
            overflowX: "auto",
            fontFamily: "var(--font-mono), monospace",
            margin: "14px 0",
          }}
        >
          {code.trimEnd()}
        </pre>,
      );
      return;
    }
    const lines = seg.split("\n");
    let list: string[] | null = null;
    let ordered = false;
    const flushList = (key: string) => {
      if (!list) return;
      const items = list.map((li, j) => (
        <li key={`${key}-li${j}`} style={{ margin: "4px 0" }}>
          {inline(li, `${key}-li${j}`)}
        </li>
      ));
      blocks.push(
        ordered ? (
          <ol key={key} style={{ paddingLeft: 22, margin: "10px 0" }}>{items}</ol>
        ) : (
          <ul key={key} style={{ paddingLeft: 22, margin: "10px 0" }}>{items}</ul>
        ),
      );
      list = null;
    };

    lines.forEach((raw, li) => {
      const line = raw.trimEnd();
      const key = `s${si}-l${li}`;
      const bullet = line.match(/^[-*]\s+(.*)/);
      const num = line.match(/^\d+\.\s+(.*)/);
      if (bullet || num) {
        if (list && ordered !== Boolean(num)) flushList(`${key}-sw`);
        if (!list) {
          list = [];
          ordered = Boolean(num);
        }
        list.push((bullet ?? num)![1]);
        return;
      }
      flushList(`${key}-fl`);
      if (!line.trim()) return;
      if (line.startsWith("### ")) {
        blocks.push(
          <h4 key={key} style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 14.5, margin: "18px 0 6px" }}>
            {inline(line.slice(4), key)}
          </h4>,
        );
      } else if (line.startsWith("## ")) {
        blocks.push(
          <h3 key={key} style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16.5, margin: "22px 0 8px" }}>
            {inline(line.slice(3), key)}
          </h3>,
        );
      } else if (line.startsWith("# ")) {
        blocks.push(
          <h2 key={key} style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 19, margin: "22px 0 8px" }}>
            {inline(line.slice(2), key)}
          </h2>,
        );
      } else if (line.startsWith("> ")) {
        blocks.push(
          <blockquote
            key={key}
            style={{
              borderLeft: "3px solid var(--brand1)",
              background: "#F8F5FE",
              padding: "10px 14px",
              borderRadius: "0 10px 10px 0",
              margin: "12px 0",
              fontSize: 13.5,
              color: "#4B4463",
            }}
          >
            {inline(line.slice(2), key)}
          </blockquote>,
        );
      } else {
        blocks.push(
          <p key={key} style={{ margin: "10px 0", lineHeight: 1.65, fontSize: 14 }}>
            {inline(line, key)}
          </p>,
        );
      }
    });
    flushList(`s${si}-end`);
  });

  return <div>{blocks}</div>;
}
