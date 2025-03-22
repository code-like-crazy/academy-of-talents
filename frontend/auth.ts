import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { loginSchema } from "@/lib/validations/auth";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validationResult = loginSchema.safeParse(credentials);

        if (!validationResult.success) {
          return null;
        }

        const { email, password } = validationResult.data;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .get();

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name || "",
          email: user.email,
          role: user.role || "user", // Ensure role is never null
          image: user.image || null,
        };
      },
    }),
  ],
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
