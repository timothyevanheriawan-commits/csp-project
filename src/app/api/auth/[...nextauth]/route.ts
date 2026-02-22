import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Use getSupabaseAdmin() to find the user to bypass RLS during login
        const { data: user, error } = await getSupabaseAdmin()
          .from("User")
          .select("id, email, password, name, image, role, status")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          console.error("Authorize error:", error);
          return null;
        }

        if (!user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (isValid) {
          if (user.status === "BANNED") {
            throw new Error("Akun Anda telah ditangguhkan.");
          }
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role;
        token.status = user.status;
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.picture = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
