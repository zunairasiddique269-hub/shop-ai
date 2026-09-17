import { Container } from "./Container";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-mauve bg-mauve-soft/70">
      <Container className="py-16 sm:py-20">
        {eyebrow ? (
          <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl text-charcoal sm:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
