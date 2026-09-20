import { NextResponse } from "next/server";
import { createProduct, getAllProducts } from "@/lib/products";

// GET /api/products
// Used by context/StoreProvider.tsx (a Client Component) to load the
// product catalog it needs for cart/wishlist lookups, since Client
// Components can't import the DB-backed lib/products.ts directly. Also
// usable by the future Admin Dashboard's product list.
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

// POST /api/products
// Foundation for Stage 4B's Admin Dashboard (create product). Not yet
// wired to any UI, and not yet auth-protected — the upcoming admin stage
// adds authentication/authorization in front of this and the other
// write endpoints below.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.id !== "string" ||
    typeof body.name !== "string" ||
    typeof body.slug !== "string" ||
    typeof body.category !== "string" ||
    typeof body.description !== "string" ||
    typeof body.price !== "number" ||
    typeof body.image !== "string" ||
    typeof body.imageAlt !== "string" ||
    typeof body.rating !== "number" ||
    typeof body.reviewCount !== "number" ||
    typeof body.stock !== "number"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid product fields." },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct({
      id: body.id,
      name: body.name,
      slug: body.slug,
      category: body.category,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice,
      discount: body.discount,
      image: body.image,
      imageAlt: body.imageAlt,
      rating: body.rating,
      reviewCount: body.reviewCount,
      stock: body.stock,
      isNew: Boolean(body.isNew),
      isFeatured: Boolean(body.isFeatured),
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create product. Check that the id/slug are unique." },
      { status: 400 },
    );
  }
}
