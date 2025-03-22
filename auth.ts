import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db } from "@/lib/db";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role?: string;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [],
  callbacks: {
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
  },
});

// For use in server components
export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user;
};
