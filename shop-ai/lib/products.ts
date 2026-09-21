import "server-only";
import { and, eq, ne } from "drizzle-orm";
import { db } from "./db/client";
import { products as productsTable } from "./db/schema";
import type { CategorySlug, Product } from "./types";
import { getDiscountPercent } from "./format";

// Server-only (Server Components / route handlers / server actions). Never
// import this file from a "use client" component — see lib/db/client.ts.
// The client-side cart (context/StoreProvider.tsx) gets product data from
// the /api/products route handler instead of importing this module.

function toProduct(row: typeof productsTable.$inferSelect): Product {
  const discount =
    getDiscountPercent(row.price, row.originalPrice ?? undefined, row.discount ?? undefined) ??
    undefined;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category as CategorySlug,
    description: row.description,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    discount,
    image: row.image,
    imageAlt: row.imageAlt,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stock: row.stock,
    isNew: row.isNew,
    isFeatured: row.isFeatured,
    isSoldOut: row.stock <= 0 || row.isSoldOut,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.select().from(productsTable);
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);
  return row ? toProduct(row) : undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug))
    .limit(1);
  return row ? toProduct(row) : undefined;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.category, product.category),
        ne(productsTable.id, product.id),
      ),
    )
    .limit(limit);
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true));
  return rows.map(toProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isNew, true));
  return rows.map(toProduct);
}

export async function getSaleProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((product) => Boolean(product.discount) && !product.isSoldOut);
}

// --- Admin-facing CRUD (foundation for Stage 4B; not yet exposed in any UI) ---

export type NewProductInput = Omit<Product, "discount" | "isSoldOut"> & {
  discount?: number;
  // Optional manual override so the admin can mark a product sold out even
  // while stock remains (e.g. temporarily discontinuing it). Independent of
  // stock — toProduct() already ORs the two together (stock <= 0 ||
  // isSoldOut) so a product always reads as sold out once stock hits 0,
  // regardless of this flag.
  isSoldOut?: boolean;
};

export async function createProduct(input: NewProductInput): Promise<Product> {
  const [row] = await db
    .insert(productsTable)
    .values({
      id: input.id,
      name: input.name,
      slug: input.slug,
      category: input.category,
      description: input.description,
      price: input.price,
      originalPrice: input.originalPrice ?? null,
      discount: input.discount ?? null,
      image: input.image,
      imageAlt: input.imageAlt,
      rating: input.rating,
      reviewCount: input.reviewCount,
      stock: input.stock,
      isNew: input.isNew,
      isFeatured: input.isFeatured,
      isSoldOut: input.stock <= 0 || Boolean(input.isSoldOut),
    })
    .returning();
  return toProduct(row);
}

export async function updateProduct(
  id: string,
  input: Partial<NewProductInput>,
): Promise<Product | undefined> {
  const [row] = await db
    .update(productsTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(productsTable.id, id))
    .returning();
  return row ? toProduct(row) : undefined;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const deleted = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning({ id: productsTable.id });
  return deleted.length > 0;
}

// --- Pure, DB-free filter/sort helper (unchanged from the original static
// implementation) — operates on an already-fetched product list, so it stays
// synchronous. Called from the Shop page's Server Component. ---

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type PriceFilter = "all" | "under-3000" | "3000-6000" | "over-6000";

export type ProductQuery = {
  search?: string;
  category?: CategorySlug | "all";
  price?: PriceFilter;
  sort?: ProductSort;
};

export function filterProducts(
  list: Product[],
  query: ProductQuery,
): Product[] {
  const search = query.search?.trim().toLowerCase() ?? "";
  const category = query.category && query.category !== "all" ? query.category : null;
  const price = query.price ?? "all";

  const filtered = list.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.includes(search);

    const matchesCategory = !category || product.category === category;

    const matchesPrice =
      price === "all" ||
      (price === "under-3000" && product.price < 3000) ||
      (price === "3000-6000" && product.price >= 3000 && product.price <= 6000) ||
      (price === "over-6000" && product.price > 6000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sort = query.sort ?? "featured";
  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest":
        return Number(b.isNew) - Number(a.isNew);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return Number(b.isFeatured) - Number(a.isFeatured);
    }
  });
}
