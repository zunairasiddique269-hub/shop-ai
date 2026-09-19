import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Order confirmed",
  description: "Your ShopAI order has been placed.",
};

export default function OrderConfirmationPage() {
  return (
    <>
      <PageHeader eyebrow="Order confirmed" title="Thank you for shopping with us" />
      <Container className="py-12 sm:py-16">
        <OrderConfirmation />
      </Container>
    </>
  );
}
