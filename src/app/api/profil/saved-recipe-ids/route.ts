import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabaseClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json([]);
  }

  try {
    const { data: user } = await supabase
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();
    if (!user) {
      return NextResponse.json([]);
    }

    const { data: saved, error } = await supabase
      .from("SavedRecipe")
      .select("recipeId")
      .eq("userId", user.id);

    if (error) throw error;

    const savedRecipeIds = saved.map((item: any) => item.recipeId);
    return NextResponse.json(savedRecipeIds);
  } catch (error) {
    console.error("FETCH_SAVED_IDS_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
