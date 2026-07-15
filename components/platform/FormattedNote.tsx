import React from "react";

// Renders a free-text review note the way it was typed: line breaks are kept,
// leading "* " / "- " / "• " lines become a real bullet list, and inline
// **bold** is honoured. Reviewers paste lightly-formatted notes (headings,
// bullet checklists with emoji, tips) and we want students to read them the
// same way — not as one collapsed run-on paragraph.

// Split a single line's text on **bold** spans and render <strong> for them.
function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter((p) => p !== "")
    .map((part, i) => {
      const m = /^\*\*([^*]+)\*\*$/.exec(part);
      if (m) return <strong key={`${keyBase}-b${i}`}>{m[1]}</strong>;
      return <React.Fragment key={`${keyBase}-t${i}`}>{part}</React.Fragment>;
    });
}

const BULLET_RE = /^\s*[*\-•]\s+(.*)$/;

export default function FormattedNote({ text }: { text: string }) {
  // Normalise Windows newlines, then group consecutive bullet lines into <ul>.
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    const items = bullets;
    blocks.push(
      <ul key={`ul-${blocks.length}`} style={{ margin: "4px 0", paddingLeft: 20 }}>
        {items.map((b, i) => (
          <li key={i} style={{ marginBottom: 2 }}>
            {renderInline(b, `li-${blocks.length}-${i}`)}
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((line, i) => {
    const bulletMatch = BULLET_RE.exec(line);
    if (bulletMatch) {
      bullets.push(bulletMatch[1]);
      return;
    }
    flushBullets();
    if (line.trim() === "") {
      // Blank line = paragraph break: add a little vertical space.
      blocks.push(<div key={`sp-${blocks.length}`} style={{ height: 6 }} />);
    } else {
      blocks.push(
        <div key={`p-${blocks.length}`}>{renderInline(line, `p-${i}`)}</div>,
      );
    }
  });
  flushBullets();

  return <>{blocks}</>;
}
