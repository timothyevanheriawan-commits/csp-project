import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

// 1. FUNGSI UNTUK MENGAMBIL DATA (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id: recipeId } = await params;

  try {
    const { data: recipe, error } = await getSupabaseAdmin()
      .from("Recipe")
      .select("*, author:User!authorId(*)")
      .eq("id", recipeId)
      .single();

    if (error || !recipe) {
      return NextResponse.json(
        { message: "Resep tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("GET_SINGLE_RECIPE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 2. FUNGSI UNTUK UPDATE DATA (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id: recipeId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
      difficulty,
      category,
    } = body;

    // 1. Cari ID pengguna dari email sesi
    const { data: user } = await getSupabaseAdmin()
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Update resep HANYA JIKA id resep DAN authorId cocok
    const { data: updatedRecipe, error } = await getSupabaseAdmin()
      .from("Recipe")
      .update({
        title,
        description,
        ingredients,
        instructions,
        imageUrl,
        difficulty,
        category,
        updatedAt: new Date().toISOString(),
      })
      .match({ id: recipeId, authorId: user.id })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error("UPDATE_RECIPE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 3. FUNGSI UNTUK HAPUS DATA (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id: recipeId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: user } = await getSupabaseAdmin()
      .from("User")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { error, count } = await getSupabaseAdmin()
      .from("Recipe")
      .delete({ count: "exact" })
      .match({ id: recipeId, authorId: user.id });

    if (error) throw error;

    if (count === 0) {
      return NextResponse.json(
        { message: "Resep tidak ditemukan atau Anda bukan pemiliknya" },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("DELETE_RECIPE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
