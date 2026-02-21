import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email ini sudah terdaftar." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using admin client to bypass RLS if necessary
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("User")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (createError) throw createError;

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error: unknown) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
