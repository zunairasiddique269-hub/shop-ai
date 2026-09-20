import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/products";

type Params = { params: Promise<{ id: string }> };

// Foundation for Stage 4B's Admin Dashboard. Not yet auth-protected.

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const product = await updateProduct(id, body);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
