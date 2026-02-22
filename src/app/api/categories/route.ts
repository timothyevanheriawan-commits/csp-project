import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper for admin check
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// GET all categories
export async function GET() {
  try {
    const { data: categories, error } = await getSupabaseAdmin()
      .from("RecipeCategory")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json(categories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal mengambil data kategori.", error: message },
      { status: 500 },
    );
  }
}

// POST new category
export async function POST(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, icon } = await req.json();
    const { data, error } = await getSupabaseAdmin()
      .from("RecipeCategory")
      .insert([{ name, icon }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal menambah kategori.", error: message },
      { status: 500 },
    );
  }
}

// PUT (update) category
export async function PUT(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, icon } = await req.json();
    const { data, error } = await getSupabaseAdmin()
      .from("RecipeCategory")
      .update({ name, icon })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal memperbarui kategori.", error: message },
      { status: 500 },
    );
  }
}

// DELETE category
export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ message: "ID diperlukan" }, { status: 400 });

    const { error } = await getSupabaseAdmin()
      .from("RecipeCategory")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal menghapus kategori.", error: message },
      { status: 500 },
    );
  }
}
