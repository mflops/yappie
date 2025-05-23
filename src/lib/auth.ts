import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database" as const,
  },
  pages: {
    signIn: "/auth/signin",
  }
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}