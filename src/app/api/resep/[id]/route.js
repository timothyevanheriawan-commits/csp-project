import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getRecipeIdFromUrl(url) {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export async function DELETE(request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const recipeId = getRecipeIdFromUrl(request.nextUrl.pathname);

  if (!recipeId) {
    return NextResponse.json(
      { message: "Recipe ID is required" },
      { status: 400 }
    );
  }

  try {
    const { data: user } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { error, count } = await supabaseAdmin
      .from("Recipe")
      .delete({ count: "exact" })
      .match({ id: recipeId, authorId: user.id });

    if (error) throw error;

    if (count === 0) {
      return NextResponse.json(
        { message: "Recipe not found or you are not the owner" },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("DELETE_RECIPE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
