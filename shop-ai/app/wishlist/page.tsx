import { WishlistView } from "@/components/account/WishlistView";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Wishlist",
  description: "Pieces you have saved on this device.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        description="Hearts stay on this browser until accounts are introduced."
      />
      <Container className="py-12 sm:py-16">
        <WishlistView />
      </Container>
    </>
  );
}
