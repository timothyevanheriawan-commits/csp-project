import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, image } = body;

    const { data: updatedUser, error } = await supabaseAdmin
      .from("User")
      .update({
        name,
        image, // URL foto profil dari Supabase Storage
        updatedAt: new Date().toISOString(),
      })
      .eq("email", session.user.email)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
