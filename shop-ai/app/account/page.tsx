import { requireCustomerSession } from "@/lib/auth/dal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/components/account/LogoutButton";

export const metadata = {
  title: "My account",
  description: "Manage your ShopAI account.",
};

// Order history and any customerId/checkout linking are handled in a later
// stage (5B) — this page only shows the signed-in customer's own details.
export default async function AccountPage() {
  const customer = await requireCustomerSession();

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My account"
        description="Manage your ShopAI account details."
      />
      <Container className="py-12 sm:py-16">
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
      </Container>
    </>
  );
}
