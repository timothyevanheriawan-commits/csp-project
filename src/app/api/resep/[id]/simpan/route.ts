import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

async function getUserIdFromSession(session: Session) {
  if (!session?.user?.email) return null;
  const { data: user } = await getSupabaseAdmin()
    .from("User")
    .select("id")
    .eq("email", session.user.email)
    .single();
  return user?.id;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserIdFromSession(session);
  const { id: recipeId } = await params;

  if (!userId || !recipeId) {
    return NextResponse.json(
      { message: "User or Recipe ID is missing" },
      { status: 400 },
    );
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("SavedRecipe")
      .insert([{ userId, recipeId }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Resep ini sudah ada di daftar simpanan Anda." },
          { status: 409 },
        );
      }
      throw error;
    }
    return NextResponse.json(
      { message: "Resep berhasil disimpan" },
      { status: 201 },
    );
  } catch (error) {
    console.error("SAVE_RECIPE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserIdFromSession(session);
  const { id: recipeId } = await params;

  if (!userId || !recipeId) {
    return NextResponse.json(
      { message: "User or Recipe ID is missing" },
      { status: 400 },
    );
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("SavedRecipe")
      .delete()
      .eq("userId", userId)
      .eq("recipeId", recipeId);

    if (error) throw error;

    return NextResponse.json({ message: "Simpanan resep berhasil dihapus" });
  } catch (error) {
    console.error("UNSAVE_RECIPE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
