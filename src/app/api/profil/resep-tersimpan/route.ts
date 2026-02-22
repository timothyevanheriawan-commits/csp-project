import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabaseClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface SavedRecipeRow {
  recipe: unknown;
  Recipe?: unknown;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !userData) {
      throw new Error("User not found for session email.");
    }

    const userId = userData.id;

    const { data, error } = await supabase
      .from("SavedRecipe")
      .select(
        `
                recipe: Recipe (
                    *,
                    author: User!authorId (*)
                )
            `,
      )
      .eq("userId", userId);

    if (error) {
      throw error;
    }

    const savedRecipes = (data as SavedRecipeRow[])
      .map((item) => item.recipe || item.Recipe)
      .filter(Boolean);

    return NextResponse.json(savedRecipes);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("FETCH_SAVED_RECIPES_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}
