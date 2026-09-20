import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { categories as categoriesTable } from "./db/schema";
import type { Category } from "./types";

// Server-only (Server Components / route handlers / server actions). Never
// import this file from a "use client" component — see lib/db/client.ts.
// Client components that need category labels use lib/category-labels.ts
// instead, which has zero database dependency.
export { categoryNames } from "./category-labels";

function toCategory(row: typeof categoriesTable.$inferSelect): Category {
  return {
    slug: row.slug as Category["slug"],
    name: row.name,
    description: row.description,
    image: row.image,
    imageAlt: row.imageAlt,
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.id));
  return rows.map(toCategory);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const [row] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, slug))
    .limit(1);
  return row ? toCategory(row) : undefined;
}

export async function createCategory(input: Category): Promise<Category> {
  const [row] = await db.insert(categoriesTable).values(input).returning();
  return toCategory(row);
}

export async function updateCategory(
  slug: string,
  input: Partial<Omit<Category, "slug">>,
): Promise<Category | undefined> {
  const [row] = await db
    .update(categoriesTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(categoriesTable.slug, slug))
    .returning();
  return row ? toCategory(row) : undefined;
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const deleted = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.slug, slug))
    .returning({ slug: categoriesTable.slug });
  return deleted.length > 0;
}
