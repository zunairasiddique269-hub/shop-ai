import { NextResponse } from "next/server";
import { deleteCategory, getCategory, updateCategory } from "@/lib/categories";

type Params = { params: Promise<{ slug: string }> };

// Foundation for Stage 4B's Admin Dashboard. Not yet auth-protected.

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }
  return NextResponse.json({ category });
}

export async function PUT(request: Request, { params }: Params) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const category = await updateCategory(slug, body);
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }
  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { slug } = await params;
  const deleted = await deleteCategory(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
