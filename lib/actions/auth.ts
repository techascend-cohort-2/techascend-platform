"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn, signOut } from "@/auth";
import { signupSchema } from "@/lib/validation";
import { ROLE_HOME, type Role } from "@/lib/constants";

export type FormState = { error?: string; ok?: boolean };

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    // Look up the role up front so we can land each user on their own home.
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    const dest =
      user && (["student", "admin", "partner"] as string[]).includes(user.role)
        ? ROLE_HOME[user.role as Role]
        : "/dashboard";
    await signIn("credentials", { email, password, redirectTo: dest });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // re-throw Next.js redirect
  }
}

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") ?? "student",
    track: formData.get("track") || undefined,
    country: formData.get("country") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      track: data.track ?? null,
      country: data.country ?? "Cameroon",
      initials: initials(data.name),
      title: data.role === "student" ? `Fellow${data.track ? ` · Track ${data.track}` : ""}` : undefined,
    },
  });

  try {
    await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      redirectTo: ROLE_HOME[data.role as Role] ?? "/dashboard",
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
