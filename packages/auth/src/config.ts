import type { DefaultSession, NextAuthConfig } from "next-auth";

import { env } from "../env";
import WalletProvider from "./providers/WalletProvider";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  secret: env.AUTH_SECRET,
  providers: [WalletProvider],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        // User is available during sign-in
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      // @ts-expect-error NextAuth is a bitch
      session.user = token.user;
      return session;
    },
  },
} satisfies NextAuthConfig;
