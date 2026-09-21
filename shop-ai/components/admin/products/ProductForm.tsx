"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Category, CategorySlug, Product } from "@/lib/types";
import { AlertIcon } from "@/components/ui/Icons";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type FormState = {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug | "";
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  imageAlt: string;
  rating: string;
  reviewCount: string;
  stock: string;
  isNew: boolean;
  isFeatured: boolean;
  isSoldOut: boolean;
};

function toFormState(product?: Product): FormState {
  return {
    id: product?.id ?? "",
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    originalPrice: product?.originalPrice ? String(product.originalPrice) : "",
    discount: product?.discount ? String(product.discount) : "",
    image: product?.image ?? "",
    imageAlt: product?.imageAlt ?? "",
    rating: product ? String(product.rating) : "0",
    reviewCount: product ? String(product.reviewCount) : "0",
    stock: product ? String(product.stock) : "0",
    isNew: product?.isNew ?? false,
    isFeatured: product?.isFeatured ?? false,
    isSoldOut: product?.isSoldOut ?? false,
  };
}

const fieldClasses =
  "mt-1.5 h-11 w-full rounded-2xl border border-mauve bg-white px-4 text-sm text-charcoal outline-none focus:border-plum disabled:opacity-60";
const labelClasses = "text-xs font-medium uppercase tracking-[0.1em] text-muted";

export function ProductForm({
  mode,
  categories,
  initialProduct,
}: {
  mode: "create" | "edit";
  categories: Category[];
  initialProduct?: Product;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(initialProduct));
  const [idTouched, setIdTouched] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onNameChange(value: string) {
    update("name", value);
    const nextSlug = slugify(value);
    update("slug", nextSlug);
    if (!idTouched && mode === "create") {
      update("id", nextSlug ? `p-${nextSlug}` : "");
    }
  }

  const stockValue = Number(form.stock || 0);
  const willBeSoldOut = stockValue <= 0 || form.isSoldOut;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.category) {
      setError("Please choose a category.");
      return;
    }

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice.trim() ? Number(form.originalPrice) : null,
      discount: form.discount.trim() ? Number(form.discount) : null,
      image: form.image.trim(),
      imageAlt: form.imageAlt.trim(),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      stock: Number(form.stock),
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      isSoldOut: form.isSoldOut,
    };

    setIsSubmitting(true);
    try {
      const url = mode === "create" ? "/api/products" : `/api/products/${initialProduct?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please check the form and try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <section className="rounded-3xl border border-mauve bg-ivory p-6">
        <h2 className="font-display text-lg text-charcoal">Basic details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="pf-name">
              Name
            </label>
            <input
              id="pf-name"
              required
              value={form.name}
              onChange={(event) => onNameChange(event.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-slug">
              Slug
            </label>
            <input
              id="pf-slug"
              required
              value={form.slug}
              onChange={(event) => update("slug", slugify(event.target.value))}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-id">
              Product ID
            </label>
            <input
              id="pf-id"
              required
              disabled={mode === "edit"}
              value={form.id}
              onChange={(event) => {
                setIdTouched(true);
                update("id", event.target.value);
              }}
              className={fieldClasses}
            />
            <p className="mt-1 text-xs text-muted">
              {mode === "edit"
                ? "The ID can't be changed after a product is created."
                : "Auto-filled from the name. Must be unique."}
            </p>
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-category">
              Category
            </label>
            <select
              id="pf-category"
              required
              value={form.category}
              onChange={(event) => update("category", event.target.value as CategorySlug)}
              className={fieldClasses}
            >
              <option value="" disabled>
                Choose a category…
              </option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClasses} htmlFor="pf-description">
            Description
          </label>
          <textarea
            id="pf-description"
            required
            rows={4}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-mauve bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-plum"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-mauve bg-ivory p-6">
        <h2 className="font-display text-lg text-charcoal">Pricing</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClasses} htmlFor="pf-price">
              Price (Rs.)
            </label>
            <input
              id="pf-price"
              type="number"
              min={0}
              step={1}
              required
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-original-price">
              Original price (Rs.)
            </label>
            <input
              id="pf-original-price"
              type="number"
              min={0}
              step={1}
              value={form.originalPrice}
              onChange={(event) => update("originalPrice", event.target.value)}
              className={fieldClasses}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-discount">
              Discount (%)
            </label>
            <input
              id="pf-discount"
              type="number"
              min={0}
              max={100}
              step={1}
              value={form.discount}
              onChange={(event) => update("discount", event.target.value)}
              className={fieldClasses}
              placeholder="Auto from original price"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">
          Leave discount blank to calculate it automatically from the original price.
        </p>
      </section>

      <section className="rounded-3xl border border-mauve bg-ivory p-6">
        <h2 className="font-display text-lg text-charcoal">Image</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="pf-image">
              Image URL
            </label>
            <input
              id="pf-image"
              type="url"
              required
              value={form.image}
              onChange={(event) => update("image", event.target.value)}
              className={fieldClasses}
              placeholder="https://images.unsplash.com/…"
            />
            <p className="mt-1 text-xs text-muted">
              Must be an images.unsplash.com URL — that&apos;s the only image host this project
              is configured to allow.
            </p>
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-image-alt">
              Image alt text
            </label>
            <input
              id="pf-image-alt"
              required
              value={form.imageAlt}
              onChange={(event) => update("imageAlt", event.target.value)}
              className={fieldClasses}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-mauve bg-ivory p-6">
        <h2 className="font-display text-lg text-charcoal">Inventory &amp; ratings</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClasses} htmlFor="pf-stock">
              Stock
            </label>
            <input
              id="pf-stock"
              type="number"
              min={0}
              step={1}
              required
              value={form.stock}
              onChange={(event) => update("stock", event.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-rating">
              Rating (0–5)
            </label>
            <input
              id="pf-rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              required
              value={form.rating}
              onChange={(event) => update("rating", event.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="pf-review-count">
              Review count
            </label>
            <input
              id="pf-review-count"
              type="number"
              min={0}
              step={1}
              required
              value={form.reviewCount}
              onChange={(event) => update("reviewCount", event.target.value)}
              className={fieldClasses}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <label className="flex items-center gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(event) => update("isNew", event.target.checked)}
              className="h-4 w-4 rounded border-mauve-deep text-plum focus:ring-plum"
            />
            Mark as new arrival
          </label>
          <label className="flex items-center gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => update("isFeatured", event.target.checked)}
              className="h-4 w-4 rounded border-mauve-deep text-plum focus:ring-plum"
            />
            Feature on the homepage
          </label>
          <label className="flex items-center gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={form.isSoldOut}
              disabled={stockValue <= 0}
              onChange={(event) => update("isSoldOut", event.target.checked)}
              className="h-4 w-4 rounded border-mauve-deep text-plum focus:ring-plum disabled:opacity-50"
            />
            Force sold out (even with stock remaining)
          </label>
          <p className="text-xs text-muted">
            {stockValue <= 0
              ? "Stock is 0, so this product will show as sold out automatically."
              : willBeSoldOut
                ? "This product will be marked sold out."
                : "This product will be shown as in stock."}
          </p>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-full bg-plum px-8 text-xs font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-plum-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-full border border-mauve-deep px-8 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-colors hover:bg-mauve-soft disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
