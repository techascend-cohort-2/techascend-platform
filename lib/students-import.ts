import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { initialsOf, avatarBgFor } from "@/lib/constants";
import { normalizeEmail, normalizePhone } from "@/lib/contact";

// ---------------------------------------------------------------------------
// Bulk student import.
//
// CSV format (one student per row, header row optional & auto-detected):
//   name,email,track,city,phone
//
// - name   (required)
// - email  (optional if phone is provided, unique when present)
// - track  (optional: "A" or "B"; defaults to "A")
// - city   (optional)
// - phone  (optional if email is provided, unique when present)
//
// Each imported student gets the shared default password and is flagged
// mustChangePassword=true, so the app prompts them to set their own on first
// sign-in. Rows whose email or phone already has an account are skipped (not overwritten).
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
    const [name, emailRaw, trackRaw, city, phoneRaw] = cols;

    if (!name) {
      errors.push(`line ${lineNo}: needs a name`);
      continue;
    }

    const email = emailRaw ? normalizeEmail(emailRaw) : null;
    const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
    if (emailRaw && !email) {
      errors.push(`line ${lineNo}: "${emailRaw}" is not a valid email`);
      continue;
    }
    if (phoneRaw && !phone) {
      errors.push(`line ${lineNo}: "${phoneRaw}" is not a valid phone number`);
      continue;
    }

    const identifier = email ?? phone;
    if (!identifier) {
      errors.push(`line ${lineNo}: needs an email or phone number`);
      continue;
    }

    const duplicate = [email, phone].filter((value): value is string => Boolean(value)).find((value) => seen.has(value));
    if (duplicate) {
      errors.push(`line ${lineNo}: duplicate identifier "${duplicate}" in file`);
      continue;
    }
    if (seen.has(identifier)) {
      errors.push(`line ${lineNo}: duplicate identifier "${identifier}" in file`);
      continue;
    }
    seen.add(identifier);
    if (phone) seen.add(phone);

    const track = (trackRaw || "A").toUpperCase() === "B" ? "B" : "A";
    rows.push({
      name,
      email: identifier,
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
  skipped: string[]; // identifiers that already had accounts
  errors: string[];
};

export async function importStudents(
  prisma: PrismaClient,
  rows: ImportRow[],
  opts: { defaultPassword: string; cohortId: string | null },
): Promise<ImportResult> {
  const passwordHash = await bcrypt.hash(opts.defaultPassword, 10);

  // Which of these emails or phone numbers already exist?
  const emails = rows.map((r) => r.email);
  const phones = rows.map((r) => r.phone).filter((phone): phone is string => Boolean(phone));
  const existing = await prisma.user.findMany({
    where: {
      OR: [
        { email: { in: emails } },
        ...(phones.length ? [{ phone: { in: phones } }] : []),
      ],
    },
    select: { email: true, phone: true },
  });
  const existingSet = new Set(existing.map((e) => e.email));
  existing.forEach((e) => {
    if (e.phone) existingSet.add(e.phone);
  });

  const result: ImportResult = { created: 0, createdEmails: [], skipped: [], errors: [] };

  for (const row of rows) {
    if (existingSet.has(row.email) || (row.phone && existingSet.has(row.phone))) {
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
      if (row.phone) existingSet.add(row.phone);
    } catch (e) {
      result.errors.push(`${row.email}: ${(e as Error).message}`);
    }
  }

  return result;
}
