import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Middleware runs on the edge — use the Node-free config (no Prisma/bcrypt).
export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  // The `authorized` callback in authConfig handles allow/redirect logic.
  void req;
});

export const config = {
  // Run on everything except static assets and the auth API.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
