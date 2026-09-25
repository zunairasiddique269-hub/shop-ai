import { requireCustomerSession } from "@/lib/auth/dal";
import { getOrdersByCustomerId } from "@/lib/db/orders";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/components/account/LogoutButton";
import { OrderHistoryList } from "@/components/account/OrderHistoryList";

export const metadata = {
  title: "My account",
  description: "Manage your ShopAI account.",
};

// Order history shown here is read-only (view + link to detail). Any
// checkout/tracking-notification refinements are a later stage, not this
// one.
export default async function AccountPage() {
  const customer = await requireCustomerSession();
  const orders = await getOrdersByCustomerId(customer.customerId);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My account"
        description="Manage your ShopAI account details."
      />
      <Container className="space-y-8 py-12 sm:py-16">
        <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-mauve bg-ivory p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Name</p>
            <p className="mt-1 text-base text-charcoal">{customer.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Email</p>
            <p className="mt-1 text-base text-charcoal">{customer.email}</p>
          </div>
          <div className="pt-2">
            <LogoutButton />
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl text-charcoal">Order history</h2>
          <div className="mt-4">
            <OrderHistoryList orders={orders} />
          </div>
        </div>
      </Container>
    </>
  );
}
