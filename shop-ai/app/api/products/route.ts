import { NextResponse } from "next/server";
import { createProduct, getAllProducts } from "@/lib/products";
import { requireAdminApi } from "@/lib/auth/dal";

// GET /api/products
// Public. Used by context/StoreProvider.tsx (a Client Component) to load
// the product catalog it needs for cart/wishlist lookups, since Client
// Components can't import the DB-backed lib/products.ts directly. Also used
// by the Admin Dashboard's product list.
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

// POST /api/products
// Admin-only (Stage 4B's Add Product form). Authorization is enforced here
// on the server, not just by hiding the button in the UI.
export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.id !== "string" ||
    !body.id.trim() ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.slug !== "string" ||
    !body.slug.trim() ||
    typeof body.category !== "string" ||
    !body.category.trim() ||
    typeof body.description !== "string" ||
    !body.description.trim() ||
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0 ||
    typeof body.image !== "string" ||
    !body.image.trim() ||
    typeof body.imageAlt !== "string" ||
    !body.imageAlt.trim() ||
    typeof body.rating !== "number" ||
    !Number.isFinite(body.rating) ||
    typeof body.reviewCount !== "number" ||
    !Number.isFinite(body.reviewCount) ||
    typeof body.stock !== "number" ||
    !Number.isFinite(body.stock) ||
    body.stock < 0 ||
    (body.originalPrice !== undefined &&
      body.originalPrice !== null &&
      (typeof body.originalPrice !== "number" || body.originalPrice < 0)) ||
    (body.discount !== undefined &&
      body.discount !== null &&
      (typeof body.discount !== "number" || body.discount < 0 || body.discount > 100))
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
      originalPrice: body.originalPrice ?? undefined,
      discount: body.discount ?? undefined,
      image: body.image,
      imageAlt: body.imageAlt,
      rating: body.rating,
      reviewCount: body.reviewCount,
      stock: body.stock,
      isNew: Boolean(body.isNew),
      isFeatured: Boolean(body.isFeatured),
      isSoldOut: Boolean(body.isSoldOut),
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create product. Check that the id/slug are unique." },
      { status: 400 },
    );
  }
}
