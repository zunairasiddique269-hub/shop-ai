import { AISection } from "@/components/home/AISection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { SaleBanner } from "@/components/home/SaleBanner";
import { TrustFeatures } from "@/components/home/TrustFeatures";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <SaleBanner />
      <AISection />
      <NewArrivals />
      <TrustFeatures />
      <NewsletterSection />
    </>
  );
}
