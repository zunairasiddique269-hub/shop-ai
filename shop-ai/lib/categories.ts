import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "women",
    name: "Women",
    description: "Occasion wear, everyday elegance, and seasonal edits.",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Woman wearing a refined cream blouse and gold earrings",
  },
  {
    slug: "men",
    name: "Men",
    description: "Tailored kurtas, linen layers, and modern classics.",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Man in a tailored beige suit standing in natural light",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Handbags, scarves, and finishing pieces.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a21ac61?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Structured leather handbag on a linen surface",
  },
  {
    slug: "footwear",
    name: "Footwear",
    description: "Sneakers, sandals, and evening shoes.",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pair of elegant heeled shoes on a marble floor",
  },
  {
    slug: "beauty",
    name: "Beauty",
    description: "Fragrances and considered self-care.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Soft-focus arrangement of beauty products and florals",
  },
  {
    slug: "home-living",
    name: "Home & Living",
    description: "Textiles and objects for a calmer interior.",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Styled living room with warm textiles and ceramic details",
  },
];

export const categoryNames: Record<CategorySlug, string> = {
  women: "Women",
  men: "Men",
  accessories: "Accessories",
  footwear: "Footwear",
  beauty: "Beauty",
  "home-living": "Home & Living",
};

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
