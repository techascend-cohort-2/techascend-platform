import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { initialsOf, avatarBgFor } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Bulk student import.
//
// CSV format (one student per row, header row optional & auto-detected):
//   name,email,track,city,phone
//
// - name   (required)
// - email  (required, unique)
// - track  (optional: "A" or "B"; defaults to "A")
// - city   (optional)
// - phone  (optional)
//
// Each imported student gets the shared default password and is flagged
// mustChangePassword=true, so the app prompts them to set their own on first
// sign-in. Rows whose email already has an account are skipped (not overwritten).
// ---------------------------------------------------------------------------

export type ImportRow = {
  name: string;
  email: string;
  track: string;
  city?: string;
  phone?: string;
};

export type ParseResult = {
  rows: ImportRow[];
  errors: string[]; // human-readable "line N: reason"
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Split a single CSV line honouring simple double-quoted fields.
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === "," || ch === ";" || ch === "\t") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseStudentsCsv(text: string): ParseResult {
  const rows: ImportRow[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let start = 0;
  if (lines.length > 0) {
    const first = splitCsvLine(lines[0]).map((c) => c.toLowerCase());
    if (first.includes("email") || first.includes("name")) start = 1; // header row
  }

  for (let i = start; i < lines.length; i++) {
    const lineNo = i + 1;
    const cols = splitCsvLine(lines[i]);
    const [name, email, trackRaw, city, phone] = cols;

    if (!name || !email) {
      errors.push(`line ${lineNo}: needs at least name and email`);
      continue;
    }
    const emailLc = email.toLowerCase();
    if (!EMAIL_RE.test(emailLc)) {
      errors.push(`line ${lineNo}: "${email}" is not a valid email`);
      continue;
    }
    if (seen.has(emailLc)) {
      errors.push(`line ${lineNo}: duplicate email "${emailLc}" in file`);
      continue;
    }
    seen.add(emailLc);

    const track = (trackRaw || "A").toUpperCase() === "B" ? "B" : "A";
    rows.push({
      name,
      email: emailLc,
      track,
      city: city || undefined,
      phone: phone || undefined,
    });
  }

  return { rows, errors };
}

export type ImportResult = {
  created: number;
  createdEmails: string[];
  skipped: string[]; // emails that already had accounts
  errors: string[];
};

export async function importStudents(
  prisma: PrismaClient,
  rows: ImportRow[],
  opts: { defaultPassword: string; cohortId: string | null },
): Promise<ImportResult> {
  const passwordHash = await bcrypt.hash(opts.defaultPassword, 10);

  // Which of these emails already exist?
  const emails = rows.map((r) => r.email);
  const existing = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { email: true },
  });
  const existingSet = new Set(existing.map((e) => e.email));

  const result: ImportResult = { created: 0, createdEmails: [], skipped: [], errors: [] };

  for (const row of rows) {
    if (existingSet.has(row.email)) {
      result.skipped.push(row.email);
      continue;
    }
    try {
      const user = await prisma.user.create({
        data: {
          name: row.name,
          email: row.email,
          passwordHash,
          role: "student",
          track: row.track,
          city: row.city ?? null,
          phone: row.phone ?? null,
          cohortId: opts.cohortId,
          initials: initialsOf(row.name),
          avatarBg: avatarBgFor(row.name),
          title: `Fellow · Track ${row.track}`,
          mustChangePassword: true,
        },
      });
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to TechAscend 🎉",
          body: "You're signed in with a temporary password — please set your own in My Profile.",
          href: "/profile",
        },
      });
      result.created++;
      result.createdEmails.push(row.email);
      existingSet.add(row.email); // guard against dup within the same batch
    } catch (e) {
      result.errors.push(`${row.email}: ${(e as Error).message}`);
    }
  }

  return result;
}
