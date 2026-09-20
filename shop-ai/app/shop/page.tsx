import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories } from "@/lib/categories";
import {
  filterProducts,
  getAllProducts,
  type PriceFilter,
  type ProductSort,
} from "@/lib/products";
import type { CategorySlug } from "@/lib/types";

export const metadata = {
  title: "Shop",
  description: "Browse the ShopAI fashion catalog with filters for category, price, and sort.",
};

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Shop"
        description="Filter the catalog by category and price."
      />
      <Container className="py-12 sm:py-16">
        <Suspense fallback={<p className="text-muted">Loading the collection…</p>}>
          <ShopResults searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function ShopResults({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const results = filterProducts(allProducts, {
    search: get("q") ?? "",
    category: (get("category") ?? "all") as CategorySlug | "all",
    price: (get("price") ?? "all") as PriceFilter,
    sort: (get("sort") ?? "featured") as ProductSort,
  });

  return <ShopCatalog results={results} categories={categories} />;
}
