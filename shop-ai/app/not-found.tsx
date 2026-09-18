import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-muted">
        The piece you&apos;re looking for may have sold out or moved. Explore
        the rest of the collection instead.
      </p>
      <div className="mt-8">
        <Button href="/shop">Back to shop</Button>
      </div>
    </Container>
  );
}
