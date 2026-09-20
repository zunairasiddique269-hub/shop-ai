import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getOrderByNumber } from "@/lib/db/orders";

export const metadata = {
  title: "Order confirmed",
  description: "Your ShopAI order has been placed.",
};

type OrderConfirmationPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : undefined;

  return (
    <>
      <PageHeader eyebrow="Order confirmed" title="Thank you for shopping with us" />
      <Container className="py-12 sm:py-16">
        <OrderConfirmation order={order} />
      </Container>
    </>
  );
}
