import { NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/categories";
import { requireAdminApi } from "@/lib/auth/dal";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

// Admin-only. No category-management UI ships in Stage 4B (the product
// form only reads existing categories), but this write endpoint already
// existed and must not be left open.
export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.slug !== "string" ||
    typeof body.name !== "string" ||
    typeof body.description !== "string" ||
    typeof body.image !== "string" ||
    typeof body.imageAlt !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid category fields." },
      { status: 400 },
    );
  }

  try {
    const category = await createCategory({
      slug: body.slug,
      name: body.name,
      description: body.description,
      image: body.image,
      imageAlt: body.imageAlt,
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create category. Check that the slug is unique." },
      { status: 400 },
    );
  }
}
