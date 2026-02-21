import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// Helper for admin check
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// GET all recipes for admin dashboard
export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: recipes, error } = await supabaseAdmin
      .from("Recipe")
      .select(
        "id, title, category, createdAt, isFeatured, author:User!authorId(name, email)",
      )
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(recipes);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal mengambil data resep.", error: message },
      { status: 500 },
    );
  }
}

// PUT (update title or featured status)
export async function PUT(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, isFeatured } = await req.json();

    // Build update object based on what's provided
    const updateData: { title?: string; isFeatured?: boolean } = {};
    if (title !== undefined) updateData.title = title;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const { data, error } = await supabaseAdmin
      .from("Recipe")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal memperbarui resep.", error: message },
      { status: 500 },
    );
  }
}

// DELETE recipes
export async function DELETE(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get("ids");

    if (!idsString)
      return NextResponse.json({ message: "ID diperlukan" }, { status: 400 });

    const ids = idsString.split(",");

    const { error } = await supabaseAdmin.from("Recipe").delete().in("id", ids);

    if (error) throw error;
    return NextResponse.json({ message: "Resep berhasil dihapus" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Gagal menghapus resep.", error: message },
      { status: 500 },
    );
  }
}
