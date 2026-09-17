import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SparkleIcon } from "@/components/ui/Icons";
import { products } from "@/lib/products";

export function AISection() {
  const preview = products.slice(0, 3);

  return (
    <section id="style-studio" className="scroll-mt-24 py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold">
            Style studio
          </p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Your style. Curated by AI.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted">
            In a later phase, ShopAI will learn the colors you reach for, the
            occasions on your calendar, and the silhouettes that feel like you.
            Recommendations will be assembled from the same catalog you shop
            today — never a generic feed.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
            The card beside this copy is a visual preview only. No live model
            or styling API is connected yet.
          </p>
          <div className="mt-8">
            <Button href="/shop" variant="secondary">
              Browse the catalog
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-mauve bg-ivory p-5 shadow-[0_24px_80px_-40px_rgba(74,26,58,0.45)] sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">
                Preview
              </p>
              <p className="mt-1 font-display text-2xl text-charcoal">
                Today&apos;s quiet luxury edit
              </p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-plum text-gold">
              <SparkleIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Based on: evening events, warm neutrals, breathable fabrics.
          </p>
          <ul className="mt-6 space-y-4">
            {preview.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 rounded-2xl bg-cream p-3"
              >
                <div className="relative h-16 w-14 overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted">Suggested match · 94%</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
