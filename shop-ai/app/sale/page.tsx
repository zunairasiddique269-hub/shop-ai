import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSaleProducts } from "@/lib/products";

export const metadata = {
  title: "Season Sale",
  description: "Reduced ShopAI pieces from the current seasonal edit.",
};

export default async function SalePage() {
  const saleProducts = await getSaleProducts();
  return (
    <>
      <PageHeader
        eyebrow="Limited season"
        title="Season Sale"
        description="Selected silhouettes with visible original prices and discount badges. Fulfillment is not live in this phase."
      />
      <Container className="py-12 sm:py-16">
        <ProductGrid products={saleProducts} />
      </Container>
    </>
  );
}
