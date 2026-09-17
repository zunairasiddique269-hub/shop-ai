import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function SaleBanner() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-plum-deep">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-80">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80"
                alt="Model in a striped fashion editorial look walking along a sunlit corridor"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center px-8 py-14 text-ivory sm:px-14">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
                Limited season
              </p>
              <h2 className="mt-4 font-display text-5xl leading-tight">
                Season Sale
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-ivory/80">
                Selected silhouettes are reduced by up to 30%. An invitation to
                refresh the wardrobe without lowering the standard.
              </p>
              <p className="mt-6 font-display text-2xl text-gold">
                Up to 30% off featured pieces
              </p>
              <div className="mt-8">
                <Button href="/sale" variant="gold">
                  Shop the sale
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
