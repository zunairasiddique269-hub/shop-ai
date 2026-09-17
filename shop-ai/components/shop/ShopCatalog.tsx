"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CloseIcon } from "@/components/ui/Icons";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/cn";
import {
  filterProducts,
  products,
  type PriceFilter,
  type ProductSort,
} from "@/lib/products";
import type { CategorySlug } from "@/lib/types";

const priceOptions: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "Any price" },
  { value: "under-3000", label: "Under Rs. 3,000" },
  { value: "3000-6000", label: "Rs. 3,000 – 6,000" },
  { value: "over-6000", label: "Over Rs. 6,000" },
];

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating", label: "Highest rated" },
];

export function ShopCatalog() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  return <ShopCatalogInner key={q} />;
}

function ShopCatalogInner() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = params.get("q") ?? "";
  const category = (params.get("category") ?? "all") as CategorySlug | "all";
  const price = (params.get("price") ?? "all") as PriceFilter;
  const sort = (params.get("sort") ?? "featured") as ProductSort;
  const [searchDraft, setSearchDraft] = useState(search);

  const results = useMemo(
    () =>
      filterProducts(products, {
        search: searchDraft,
        category,
        price,
        sort,
      }),
    [searchDraft, category, price, sort],
  );

  function update(next: Record<string, string>) {
    const query = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") query.delete(key);
      else query.set(key, value);
    });
    const qs = query.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function commitSearch() {
    update({ q: searchDraft.trim() });
  }

  const filterProps = {
    searchDraft,
    onSearch: setSearchDraft,
    onCommit: commitSearch,
    category,
    price,
    onUpdate: update,
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <FilterFields searchId="shop-search-desktop" {...filterProps} />
      </aside>

      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {results.length} piece{results.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-11 rounded-full border border-mauve px-4 text-xs uppercase tracking-[0.16em] lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              Filters
            </button>
            <label className="flex items-center gap-3 text-sm text-muted">
              Sort
              <select
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
                className="h-11 rounded-full border border-mauve bg-ivory px-4 text-sm text-charcoal outline-none focus:border-plum"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <ProductGrid products={results} />
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] overflow-y-auto bg-ivory p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-2xl">Filters</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <FilterFields searchId="shop-search-mobile" {...filterProps} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterFields({
  searchId,
  searchDraft,
  onSearch,
  onCommit,
  category,
  price,
  onUpdate,
}: {
  searchId: string;
  searchDraft: string;
  onSearch: (value: string) => void;
  onCommit: () => void;
  category: CategorySlug | "all";
  price: PriceFilter;
  onUpdate: (next: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onCommit();
        }}
      >
        <fieldset>
          <legend className="text-[0.68rem] uppercase tracking-[0.2em] text-gold">
            Search
          </legend>
          <label htmlFor={searchId} className="sr-only">
            Search products
          </label>
          <input
            id={searchId}
            value={searchDraft}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search names & descriptions"
            className="mt-3 h-11 w-full rounded-full border border-mauve bg-ivory px-4 text-sm outline-none focus:border-plum"
          />
        </fieldset>
      </form>

      <fieldset>
        <legend className="text-[0.68rem] uppercase tracking-[0.2em] text-gold">
          Category
        </legend>
        <div className="mt-3 grid gap-2">
          <FilterChip
            active={category === "all"}
            onClick={() => onUpdate({ category: "all" })}
          >
            All
          </FilterChip>
          {categories.map((item) => (
            <FilterChip
              key={item.slug}
              active={category === item.slug}
              onClick={() => onUpdate({ category: item.slug })}
            >
              {item.name}
            </FilterChip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[0.68rem] uppercase tracking-[0.2em] text-gold">
          Price
        </legend>
        <div className="mt-3 grid gap-2">
          {priceOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={price === option.value}
              onClick={() => onUpdate({ price: option.value })}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-left text-sm transition-colors",
        active
          ? "border-plum bg-plum text-ivory"
          : "border-mauve bg-ivory text-charcoal hover:border-plum",
      )}
    >
      {children}
    </button>
  );
}
