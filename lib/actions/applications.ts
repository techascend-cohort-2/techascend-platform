"use server";

import { prisma } from "@/lib/db";
import { applicationSchema } from "@/lib/validation";

export type ApplyState = { ok?: boolean; error?: string };

export async function submitApplicationAction(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const raw: Record<string, string> = {};
  for (const [k, v] of formData.entries()) raw[k] = String(v);

  const parsed = applicationSchema.safeParse({
    role: raw.role,
    name: raw.name,
    email: raw.email,
    phone: raw.phone || undefined,
    track: raw.track || undefined,
    org: raw.org || undefined,
    motivation: raw.motivation || undefined,
    fields: raw,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.application.findUnique({ where: { email } });
  if (existing && existing.status !== "rejected") {
    return { ok: true }; // already applied — treat as success, no duplicates
  }

  await prisma.application.upsert({
    where: { email },
    create: {
      role: parsed.data.role,
      name: parsed.data.name,
      email,
      phone: parsed.data.phone ?? null,
      city: parsed.data.city ?? null,
      track: parsed.data.track ?? null,
      org: parsed.data.org ?? null,
      motivation: parsed.data.motivation ?? null,
      fields: parsed.data.fields ?? {},
      status: "new",
    },
    update: {
      role: parsed.data.role,
      name: parsed.data.name,
      status: "new",
      motivation: parsed.data.motivation ?? null,
      fields: parsed.data.fields ?? {},
    },
  });

  return { ok: true };
}
