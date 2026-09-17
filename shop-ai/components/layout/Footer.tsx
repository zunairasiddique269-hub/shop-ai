import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Newsletter } from "@/components/home/Newsletter";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, PinterestIcon } from "@/components/ui/Icons";
import { accountLinks, serviceLinks, shopLinks } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-auto bg-plum text-ivory">
      <Container className="grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo inverted />
          <p className="mt-5 max-w-sm text-sm leading-7 text-ivory/75">
            ShopAI is an original fashion house for considered wardrobes —
            pairing atelier-led collections with a forthcoming AI styling
            experience, personalized for you.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialLink label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink label="Pinterest">
              <PinterestIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink label="Facebook">
              <FacebookIcon className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Customer service" links={serviceLinks} />
        <FooterColumn title="Account" links={accountLinks} />
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-gold">
              Atelier notes
            </p>
            <p className="mt-2 text-sm text-ivory/75">
              Receive new arrivals and styling notes. Newsletter signup is
              stored on this device for now.
            </p>
          </div>
          <div className="w-full max-w-md">
            <Newsletter compact />
          </div>
        </Container>
      </div>

      <div className="border-t border-ivory/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-ivory/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ShopAI. All rights reserved.</p>
          <p>Crafted as an original fashion storefront.</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-ivory/80">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link href={link.href} className="transition-colors hover:text-ivory">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#social"
      aria-label={`${label} (placeholder)`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
