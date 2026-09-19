import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Bag",
  description: "Review pieces added to your ShopAI bag.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your selection"
        title="Bag"
        description="Review your pieces, then continue to a simple, secure checkout."
      />
      <Container className="py-12 sm:py-16">
        <CartView />
      </Container>
    </>
  );
}
