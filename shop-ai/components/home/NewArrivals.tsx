import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getNewArrivals } from "@/lib/products";

export async function NewArrivals() {
  const newArrivals = await getNewArrivals();
  return (
    <section className="bg-cream py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Just in"
          title="New arrivals"
          description="Fresh silhouettes from the latest atelier drop, ready to live in your wardrobe."
        />
        <div className="mt-12">
          <ProductGrid products={newArrivals} />
        </div>
      </Container>
    </section>
  );
}
