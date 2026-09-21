"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { categoryNames } from "@/lib/category-labels";
import { Badge } from "@/components/ui/Badge";
import { SearchIcon, PencilIcon, TrashIcon, AlertIcon } from "@/components/ui/Icons";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function ProductsTable({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  async function toggleSoldOut(product: Product) {
    setError(null);
    setPendingId(product.id);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSoldOut: !product.isSoldOut }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        product?: Product;
        error?: string;
      };
      if (!response.ok || !data.product) {
        throw new Error(data.error ?? "Could not update this product.");
      }
      const updated = data.product;
      setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this product.");
    } finally {
      setPendingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setError(null);
    setPendingId(deleteTarget.id);
    try {
      const response = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete this product.");
      }
      setProducts((current) => current.filter((item) => item.id !== deleteTarget.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this product.");
    } finally {
      setPendingId(null);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or ID…"
            className="h-11 w-full rounded-full border border-mauve bg-ivory pl-10 pr-4 text-sm outline-none focus:border-plum"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-11 rounded-full border border-mauve bg-ivory px-4 text-sm outline-none focus:border-plum"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertIcon className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-3xl border border-mauve bg-ivory">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-mauve text-xs uppercase tracking-[0.1em] text-muted">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted">
                  {products.length === 0
                    ? "No products yet. Add your first product to get started."
                    : "No products match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const isPending = pendingId === product.id;
                return (
                  <tr key={product.id} className="border-b border-mauve/60 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-mauve-soft">
                          <Image
                            src={product.image}
                            alt={product.imageAlt}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-charcoal">{product.name}</p>
                          <p className="truncate text-xs text-muted">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {categoryNames[product.category] ?? product.category}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-charcoal">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice ? (
                          <span className="text-xs text-muted line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        ) : null}
                        {product.discount ? (
                          <span className="text-xs text-gold">{product.discount}% off</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal">{product.stock}</td>
                    <td className="px-4 py-3">
                      {product.isSoldOut ? (
                        <Badge tone="sold">Sold out</Badge>
                      ) : (
                        <Badge tone="gold">In stock</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {product.isNew ? <Badge tone="ivory">New</Badge> : null}
                        {product.isFeatured ? <Badge tone="plum">Featured</Badge> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSoldOut(product)}
                          disabled={isPending || product.stock <= 0}
                          title={
                            product.stock <= 0
                              ? "Automatically sold out while stock is 0"
                              : product.isSoldOut
                                ? "Mark as in stock"
                                : "Mark as sold out"
                          }
                          className="rounded-full border border-mauve-deep px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-plum hover:text-plum disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {product.isSoldOut ? "Unmark" : "Sold out"}
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          aria-label={`Edit ${product.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-mauve-deep text-charcoal transition-colors hover:border-plum hover:text-plum"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          disabled={isPending}
                          aria-label={`Delete ${product.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-mauve-deep text-charcoal transition-colors hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this product?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed from the catalog. This can't be undone.`
            : ""
        }
        confirmLabel="Delete product"
        destructive
        isSubmitting={pendingId === deleteTarget?.id}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
