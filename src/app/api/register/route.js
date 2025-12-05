import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing name, email, or password", {
        status: 400,
      });
    }

    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email ini sudah terdaftar." },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: createError } = await supabaseAdmin
      .from("User")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (createError) throw createError;

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
