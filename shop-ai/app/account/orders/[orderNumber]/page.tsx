import { notFound } from "next/navigation";
import { requireCustomerSession } from "@/lib/auth/dal";
import { getOrderByNumberForCustomer } from "@/lib/db/orders";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { OrderDetail } from "@/components/account/OrderDetail";

export const metadata = {
  title: "Order details",
};

// Ownership is enforced at the database query level
// (getOrderByNumberForCustomer filters by customerId in its WHERE clause),
// not just by checking after the fact — so a signed-in customer can never
// retrieve another customer's order here, even by guessing an order number.
export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const customer = await requireCustomerSession();
  const order = await getOrderByNumberForCustomer(orderNumber, customer.customerId);

  if (!order) {
    notFound();
  }

  return (
    <>
      <PageHeader eyebrow="Account" title="Order details" />
      <Container className="py-12 sm:py-16">
        <OrderDetail order={order} />
      </Container>
    </>
  );
}
