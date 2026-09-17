import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-plum">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
          alt="Editorial fashion portrait with a tailored coat and gold jewelry"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%] opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-plum via-plum/80 to-plum/30" />
      </div>

      <Container className="relative grid min-h-[78vh] items-center py-20 lg:min-h-[86vh]">
        <div className="max-w-xl text-ivory">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            Fashion, personalized for you
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Dress the life you are stepping into.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-ivory/80">
            ShopAI is a fashion house with an atelier eye and an intelligent
            edit. Discover pieces with presence now — and a styling companion
            that will soon learn your silhouette, palette, and occasion.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" variant="gold">
              Shop now
            </Button>
            <Button href="/#style-studio" variant="inverse">
              Discover your style
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
