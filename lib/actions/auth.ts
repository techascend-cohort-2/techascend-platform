"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { auth, signIn, signOut } from "@/auth";
import { signupSchema } from "@/lib/validation";
import { ROLE_HOME, isRole, initialsOf, avatarBgFor } from "@/lib/constants";
import { notify } from "@/lib/progress";
import { normalizeEmailOrPhone } from "@/lib/contact";

export type FormState = { error?: string; ok?: boolean };

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = normalizeEmailOrPhone(String(formData.get("email") ?? "")) ?? "";
  const password = String(formData.get("password") ?? "");
  try {
    const user = await prisma.user.findFirst({ where: { OR: [{ email }, { phone: email }] } });
    const dest = user && isRole(user.role) ? ROLE_HOME[user.role] : "/login";
    await signIn("credentials", { email, password, redirectTo: dest });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) return { error: "Invalid email/phone or password." };
    throw error; // re-throw Next.js redirect
  }
}

/**
 * Signup creates an APPLICANT account + an Application record — unless an
 * accepted application already exists for the email, in which case the
 * account is created directly as a student on the accepted track.
 */
export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    track: formData.get("track") || undefined,
    city: formData.get("city") || undefined,
    phone: formData.get("phone") || undefined,
    motivation: formData.get("motivation") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  const d = parsed.data;
  const email = d.email.toLowerCase();

  if (await prisma.user.findUnique({ where: { email } })) {
    return { error: "An account with that email already exists — sign in instead." };
  }

  const accepted = await prisma.application.findFirst({
    where: { email, status: "accepted", role: "learner" },
  });

  const passwordHash = await bcrypt.hash(d.password, 10);
  const role = accepted ? "student" : "applicant";
  const track = accepted?.track ?? d.track ?? null;
  const cohort = accepted ? await prisma.cohort.findFirst({ orderBy: { createdAt: "asc" } }) : null;

  const user = await prisma.user.create({
    data: {
      name: d.name,
      email,
      passwordHash,
      role,
      track,
      city: d.city ?? accepted?.city ?? null,
      phone: d.phone ?? accepted?.phone ?? null,
      initials: initialsOf(d.name),
      avatarBg: avatarBgFor(d.name),
      cohortId: cohort?.id ?? null,
      title: role === "student" ? `Fellow${track ? ` · Track ${track}` : ""}` : "Applicant",
    },
  });

  if (!accepted) {
    await prisma.application.upsert({
      where: { email },
      create: {
        role: "learner",
        name: d.name,
        email,
        phone: d.phone ?? null,
        city: d.city ?? null,
        track: d.track ?? null,
        motivation: d.motivation ?? null,
        status: "new",
      },
      update: {}, // keep any existing application untouched
    });
  } else {
    await notify(user.id, "Welcome to TechAscend! 🎉", "/dashboard", "Your application was accepted — your fellowship starts now.");
  }

  try {
    await signIn("credentials", {
      email,
      password: d.password,
      redirectTo: ROLE_HOME[role],
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) return { error: "Account created — please sign in." };
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in." };
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) return { error: "Account not found." };
  if (!(await bcrypt.compare(current, user.passwordHash))) {
    return { error: "Current password is incorrect." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10), mustChangePassword: false },
  });
  return { ok: true };
}
