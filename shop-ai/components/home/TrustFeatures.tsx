import { Container } from "@/components/ui/Container";
import {
  ReturnIcon,
  ShieldIcon,
  SparkleIcon,
  SupportIcon,
  TruckIcon,
} from "@/components/ui/Icons";

const features = [
  {
    title: "Secure checkout",
    copy: "Protected payments will arrive in a later phase. Your bag is stored on this device for now.",
    icon: ShieldIcon,
  },
  {
    title: "Fast & reliable delivery",
    copy: "Thoughtful packing and tracked delivery windows once fulfillment is connected.",
    icon: TruckIcon,
  },
  {
    title: "Premium quality",
    copy: "Fabrics, hardware, and finishing selected with an atelier standard in mind.",
    icon: SparkleIcon,
  },
  {
    title: "Easy returns",
    copy: "A calm returns process for pieces that do not earn a lasting place.",
    icon: ReturnIcon,
  },
  {
    title: "24/7 support",
    copy: "Styling questions and order care, available around the clock when live.",
    icon: SupportIcon,
  },
];

export function TrustFeatures() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => (
            <div key={feature.title} className="text-center lg:text-left">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-mauve text-plum">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-2xl text-charcoal">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.copy}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
