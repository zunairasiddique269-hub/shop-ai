import { Newsletter } from "./Newsletter";
import { Container } from "@/components/ui/Container";

export function NewsletterSection() {
  return (
    <section className="border-y border-mauve bg-mauve-soft/80 py-20">
      <Container className="max-w-3xl text-center">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold">
          The list
        </p>
        <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
          New drops, first.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted">
          Join for atelier notes, fabric stories, and early access to seasonal
          edits. This form is frontend-only until a mailing service is added.
        </p>
        <div className="mt-8">
          <Newsletter />
        </div>
      </Container>
    </section>
  );
}
