import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { PlusIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Catalog</p>
          <h1 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-muted">
            {products.length} product{products.length === 1 ? "" : "s"} in the database.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-plum px-6 text-xs font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-plum-deep"
        >
          <PlusIcon className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <ProductsTable initialProducts={products} categories={categories} />
    </div>
  );
}
