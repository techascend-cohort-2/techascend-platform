import type { NextAuthConfig } from "next-auth";

// ---------------------------------------------------------------------------
// Route access groups (paths live in the app/(platform) route group).
// ---------------------------------------------------------------------------
const ADMIN_ONLY = ["/admin", "/applications", "/curriculum", "/cohorts", "/partners", "/revenue"];
const STAFF_PATHS = ["/reviews", "/students"]; // admin + manager
const STUDENT_ONLY = ["/dashboard", "/learning", "/tutor", "/projects", "/earn", "/badges"];
const PARTNER_ONLY = ["/partner", "/talent-pool", "/hiring-pipeline", "/impact"];
const APPLICANT_ONLY = ["/welcome"];
// Any signed-in member except applicants:
const MEMBER_SHARED = ["/community", "/opportunities"];
// Any signed-in user at all:
const AUTH_SHARED = ["/events", "/profile"];

const ALL_PROTECTED = [
  ...ADMIN_ONLY,
  ...STAFF_PATHS,
  ...STUDENT_ONLY,
  ...PARTNER_ONLY,
  ...APPLICANT_ONLY,
  ...MEMBER_SHARED,
  ...AUTH_SHARED,
];

const HOME_BY_ROLE: Record<string, string> = {
  applicant: "/welcome",
  student: "/dashboard",
  manager: "/community",
  admin: "/admin",
  partner: "/partner",
};

function inGroup(path: string, group: string[]) {
  return group.some((p) => path === p || path.startsWith(p + "/"));
}

function roleAllows(role: string, path: string): boolean {
  if (inGroup(path, AUTH_SHARED)) return true;
  switch (role) {
    case "admin":
      return (
        inGroup(path, ADMIN_ONLY) || inGroup(path, STAFF_PATHS) || inGroup(path, MEMBER_SHARED)
      );
    case "manager":
      return inGroup(path, STAFF_PATHS) || inGroup(path, MEMBER_SHARED);
    case "student":
      return inGroup(path, STUDENT_ONLY) || inGroup(path, MEMBER_SHARED);
    case "partner":
      return inGroup(path, PARTNER_ONLY) || inGroup(path, MEMBER_SHARED);
    case "applicant":
      return inGroup(path, APPLICANT_ONLY);
    default:
      return false;
  }
}

// Edge-safe config shared with middleware. NO Node-only imports here
// (no Prisma, no bcrypt) — the Credentials provider is added in ./auth.ts.
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) token.role = (user as { role?: string }).role ?? "applicant";
      // allow role refresh after promotion (session.update({ role }))
      if (trigger === "update" && session?.role) token.role = session.role as string;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "applicant";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      if (!inGroup(path, ALL_PROTECTED)) return true;

      const user = auth?.user;
      if (!user) return false; // → redirect to /login

      const role = (user as { role?: string }).role ?? "applicant";
      if (roleAllows(role, path)) return true;

      const home = HOME_BY_ROLE[role] ?? "/login";
      return Response.redirect(new URL(home, nextUrl));
    },
  },
} satisfies NextAuthConfig;
