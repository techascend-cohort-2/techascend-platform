import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { parseStudentsCsv, importStudents } from "../lib/students-import";

// CLI bulk import.
//
//   npm run import:students -- <file.csv> [defaultPassword] [cohortName]
//
// CSV columns (header optional): name,email,track,city,phone
// Defaults: password "TechAscend2026!", newest... no — the first cohort by
// creation. Every imported student must change their password on first login.

const prisma = new PrismaClient();

async function main() {
  const [, , file, passwordArg, cohortNameArg] = process.argv;
  if (!file) {
    console.error("Usage: npm run import:students -- <file.csv> [defaultPassword] [cohortName]");
    process.exit(1);
  }

  const defaultPassword = passwordArg || "TechAscend2026!";
  if (defaultPassword.length < 8) {
    console.error("Default password must be at least 8 characters.");
    process.exit(1);
  }

  const text = readFileSync(file, "utf8");
  const { rows, errors: parseErrors } = parseStudentsCsv(text);

  const cohort = cohortNameArg
    ? await prisma.cohort.findFirst({ where: { name: { contains: cohortNameArg } } })
    : await prisma.cohort.findFirst({ orderBy: { createdAt: "asc" } });

  if (cohortNameArg && !cohort) {
    console.error(`No cohort matching "${cohortNameArg}". Available:`);
    const all = await prisma.cohort.findMany();
    all.forEach((c) => console.error(`  - ${c.name}`));
    process.exit(1);
  }

  console.log(`Importing ${rows.length} student(s) into cohort "${cohort?.name ?? "(none)"}"…`);
  const res = await importStudents(prisma, rows, { defaultPassword, cohortId: cohort?.id ?? null });

  console.log(`\n✅ Created:  ${res.created}`);
  if (res.skipped.length) console.log(`⏭  Skipped (already exist): ${res.skipped.length}\n   ${res.skipped.join(", ")}`);
  const allErrors = [...parseErrors, ...res.errors];
  if (allErrors.length) {
    console.log(`\n⚠  ${allErrors.length} row(s) not imported:`);
    allErrors.forEach((e) => console.log(`   ${e}`));
  }
  console.log(`\nDefault password for new accounts: ${defaultPassword}`);
  console.log("Each student is prompted to change it on first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
