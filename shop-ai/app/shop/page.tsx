import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Shop",
  description: "Browse the ShopAI fashion catalog with filters for category, price, and sort.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Shop"
        description="Filter the catalog by category and price. Search and sorting are wired to this mock catalog so a later product API can drop in."
      />
      <Container className="py-12 sm:py-16">
        <Suspense fallback={<p className="text-muted">Loading the collection…</p>}>
          <ShopCatalog />
        </Suspense>
      </Container>
    </>
  );
}
