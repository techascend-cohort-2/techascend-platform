import type { NextAuthConfig } from "next-auth";

// Route protection groups. These paths live in the app/(platform) route group.
const ADMIN_PATHS = ["/admin", "/cohorts", "/students", "/partners", "/revenue"];
const PARTNER_PATHS = ["/partner", "/talent-pool", "/hiring-pipeline", "/impact"];
const STUDENT_PATHS = [
  "/dashboard",
  "/learning",
  "/tutor",
  "/projects",
  "/earn",
  "/community",
  "/opportunities",
  "/badges",
];
const PROTECTED = [...ADMIN_PATHS, ...PARTNER_PATHS, ...STUDENT_PATHS];

const HOME_BY_ROLE: Record<string, string> = {
  student: "/dashboard",
  admin: "/admin",
  partner: "/partner",
};

function startsWithAny(path: string, list: string[]) {
  return list.some((p) => path === p || path.startsWith(p + "/"));
}

// Edge-safe config shared with middleware. Contains NO Node-only imports
// (no Prisma, no bcrypt) — the Credentials provider is added in ./auth.ts.
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "student";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "student";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      if (!startsWithAny(path, PROTECTED)) return true;

      const user = auth?.user;
      if (!user) return false; // → redirect to /login

      const role = (user as { role?: string }).role ?? "student";
      const home = HOME_BY_ROLE[role] ?? "/dashboard";

      const needsAdmin = startsWithAny(path, ADMIN_PATHS);
      const needsPartner = startsWithAny(path, PARTNER_PATHS);
      const needsStudent = startsWithAny(path, STUDENT_PATHS);
      if (needsAdmin && role !== "admin") return Response.redirect(new URL(home, nextUrl));
      if (needsPartner && role !== "partner") return Response.redirect(new URL(home, nextUrl));
      if (needsStudent && role !== "student") return Response.redirect(new URL(home, nextUrl));

      return true;
    },
  },
} satisfies NextAuthConfig;
