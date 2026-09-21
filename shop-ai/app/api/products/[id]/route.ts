import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct, type NewProductInput } from "@/lib/products";
import { requireAdminApi } from "@/lib/auth/dal";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id] — public, used for admin edit-form prefill and any
// future single-product lookups.
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

const numericFields = [
  "price",
  "originalPrice",
  "discount",
  "rating",
  "reviewCount",
  "stock",
] as const;
const stringFields = ["name", "slug", "category", "description", "image", "imageAlt"] as const;
const booleanFields = ["isNew", "isFeatured", "isSoldOut"] as const;

// Builds a validated partial update from an arbitrary JSON body — every
// field is optional (it's a PATCH-like partial update), but any field that
// IS present must have the right type, so a malformed request can't write
// garbage into the database. `id` is never accepted here; it's immutable.
function parseProductUpdate(
  body: unknown,
): { data: Partial<NewProductInput> } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }
  const record = body as Record<string, unknown>;
  // Built as a loosely-typed bag first, then cast once at the end — TypeScript
  // can't prove a per-key correspondence when writing through a union-typed
  // key (data[field] = value), so validating manually here and casting the
  // finished, verified object is both correct and avoids fighting the type
  // system over something already checked at runtime.
  const data: Record<string, unknown> = {};

  for (const field of stringFields) {
    if (field in record) {
      const value = record[field];
      if (typeof value !== "string" || !value.trim()) {
        return { error: `${field} must be a non-empty string.` };
      }
      data[field] = value;
    }
  }

  for (const field of numericFields) {
    if (field in record) {
      const value = record[field];
      if (value === null && (field === "originalPrice" || field === "discount")) {
        data[field] = undefined;
        continue;
      }
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        return { error: `${field} must be a non-negative number.` };
      }
      if (field === "discount" && value > 100) {
        return { error: "discount must be between 0 and 100." };
      }
      data[field] = value;
    }
  }

  for (const field of booleanFields) {
    if (field in record) {
      data[field] = Boolean(record[field]);
    }
  }

  return { data: data as Partial<NewProductInput> };
}

// PUT /api/products/[id] — admin-only (Stage 4B's Edit Product form,
// inventory/discount/sold-out updates).
export async function PUT(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const parsed = parseProductUpdate(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const product = await updateProduct(id, parsed.data);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Could not update product. Check that the slug is unique and the category exists." },
      { status: 400 },
    );
  }
}

// DELETE /api/products/[id] — admin-only.
export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
