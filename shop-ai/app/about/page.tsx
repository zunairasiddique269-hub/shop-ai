import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "About",
  description: "The story of ShopAI, an original fashion house with a forthcoming AI styling studio.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The house"
        title="About ShopAI"
        description="An original fashion house for people who want presence in their clothes and intelligence in how they find them."
      />
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2">
        <div className="relative min-h-96 overflow-hidden rounded-[2rem]">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
            alt="Quiet clothing rack in a sunlit atelier with linen garments"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <h2 className="font-display text-4xl text-charcoal">
            Atelier first. Intelligence next.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted">
            ShopAI began as a wardrobe, not a dashboard. We design and source
            pieces with a preference for natural fibers, considered hardware,
            and silhouettes that last more than a season. The AI styling studio
            will sit beside that catalog — recommending from what we actually
            sell, using preferences you choose to share.
          </p>
          <p className="mt-4 text-base leading-7 text-muted">
            Accounts, payments, and live recommendations are scheduled for later
            phases. This storefront is the first public face of the house.
          </p>
        </div>
      </Container>
      <section id="care" className="scroll-mt-24 bg-mauve-soft/70 py-16">
        <Container className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Shipping & delivery",
              copy: "Tracked delivery windows and careful packing will go live with fulfillment.",
            },
            {
              title: "Returns",
              copy: "Unworn pieces in original condition will follow a simple returns window.",
            },
            {
              title: "Size guide & contact",
              copy: "A full size guide and support desk arrive with the account phase.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-2xl text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.copy}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
