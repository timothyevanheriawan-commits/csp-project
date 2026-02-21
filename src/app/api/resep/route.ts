import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const { data: recipes, error } = await supabase
      .from("Recipe")
      .select("*, author:User!authorId(*)")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(recipes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("GET RECIPES ERROR:", error.message);
    }
    return NextResponse.json(
      { message: "Gagal mengambil data resep." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { message: "Unauthorized: Anda harus login untuk membuat resep." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const { data: user, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      throw new Error("Pengguna tidak ditemukan di database.");
    }

    const recipeData = { ...body, authorId: user.id };

    const { data: newRecipe, error: createError } = await supabaseAdmin
      .from("Recipe")
      .insert([recipeData])
      .select()
      .single();

    if (createError) {
      console.error("Supabase Create Error:", createError);
      throw new Error(createError.message);
    }

    if (!newRecipe) {
      throw new Error(
        "Gagal membuat resep, data tidak kembali setelah insert.",
      );
    }

    return NextResponse.json(newRecipe);
  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      console.error("CREATE_RECIPE_ERROR:", error.message);
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
