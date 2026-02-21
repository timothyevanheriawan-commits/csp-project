import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      console.error("API Profil Error (User):", userError);
      throw new Error("Pengguna tidak ditemukan.");
    }

    const { data: userRecipes, error: recipesError } = await supabase
      .from("Recipe")
      .select("*")
      .eq("authorId", user.id)
      .order("createdAt", { ascending: false });

    if (recipesError) {
      console.error("API Profil Error (Recipes):", recipesError);
      throw new Error("Gagal mengambil resep pengguna.");
    }

    return NextResponse.json(userRecipes);
  } catch (error: any) {
    console.error("FETCH_USER_RECIPES_ERROR:", error.message);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
