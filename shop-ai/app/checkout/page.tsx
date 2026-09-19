import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Checkout",
  description: "Complete your ShopAI order.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        description="Enter your details below to complete your order."
      />
      <Container className="py-12 sm:py-16">
        <CheckoutForm />
      </Container>
    </>
  );
}
