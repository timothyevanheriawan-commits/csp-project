import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabaseClient";

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
      .select(    `
                recipe: Recipe (
                    *,
                    author: User!authorId (*)
                )
            `
      )
      .eq("userId", userId);

    if (error) {
      throw error;
    }

    const savedRecipes = data
      .map((item) => item.recipe || item.Recipe)
      .filter(Boolean);

    return NextResponse.json(savedRecipes);
  } catch (error) {
    console.error("FETCH_SAVED_RECIPES_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
