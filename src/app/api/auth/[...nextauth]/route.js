// File: src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient"; // Impor client publik
import bcrypt from "bcryptjs";

export const authOptions = {
  // HAPUS 'adapter' jika masih ada
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize: Missing credentials");
          return null;
        }

        // Cari user menggunakan Supabase client
        const { data: user, error } = await supabase
          .from("User")
          .select("*")
          .eq("email", credentials.email)
          .single(); // .single() untuk mendapatkan satu objek

        // Jika user tidak ditemukan atau ada error Supabase
        if (error || !user) {
          console.error("Authorize: User not found or Supabase error:", error);
          return null;
        }

        // Bandingkan password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isValid) {
          console.log("Authorize: Login successful for", user.email);
          return user; // Jika valid, kembalikan data user
        } else {
          console.log("Authorize: Invalid password for", user.email);
          return null; // Jika tidak valid, kembalikan null
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
