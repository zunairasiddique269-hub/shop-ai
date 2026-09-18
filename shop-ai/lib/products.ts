import type { CategorySlug, Product } from "./types";
import { getDiscountPercent } from "./format";

const catalog: Product[] = [
  {
    id: "p-lawn-suit",
    name: "Embroidered Lawn Suit",
    slug: "embroidered-lawn-suit",
    category: "women",
    description:
      "A three-piece lawn ensemble with fine threadwork, a breathable silhouette, and a softly gathered dupatta for warm-weather gatherings.",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Embroidered lawn suit styled with a flowing dupatta",
    rating: 4.8,
    reviewCount: 126,
    stock: 18,
    isNew: true,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-mens-kurta",
    name: "Men's Kurta",
    slug: "mens-kurta",
    category: "men",
    description:
      "A straight-cut cotton kurta with a stand collar, concealed placket, and a clean hem intended for both festive evenings and considered everyday wear.",
    price: 2899,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148cfe4511?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Man wearing a tailored light kurta-style shirt",
    rating: 4.6,
    reviewCount: 84,
    stock: 22,
    isNew: false,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-linen-shirt",
    name: "Linen Shirt",
    slug: "linen-shirt",
    category: "men",
    description:
      "Washed linen with a relaxed shoulder, mother-of-pearl buttons, and a slightly longer back hem for effortless layering.",
    price: 4299,
    originalPrice: 5499,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Folded linen shirt in a pale oatmeal tone",
    rating: 4.7,
    reviewCount: 61,
    stock: 14,
    isNew: false,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-embroidered-dress",
    name: "Embroidered Dress",
    slug: "embroidered-dress",
    category: "women",
    description:
      "A midi dress with tonal embroidery at the neckline, a softly cinched waist, and a fluid skirt that moves with you.",
    price: 7999,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Long embroidered evening dress in a deep jewel tone",
    rating: 4.9,
    reviewCount: 47,
    stock: 9,
    isNew: true,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-leather-handbag",
    name: "Leather Handbag",
    slug: "leather-handbag",
    category: "accessories",
    description:
      "A structured calf-leather bag with a discreet gold-tone clasp, interior slip pocket, and a silhouette made for city days.",
    price: 6499,
    originalPrice: 8999,
    discount: 28,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Structured tan leather handbag with gold hardware",
    rating: 4.8,
    reviewCount: 93,
    stock: 11,
    isNew: false,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-classic-sneakers",
    name: "Classic Sneakers",
    slug: "classic-sneakers",
    category: "footwear",
    description:
      "Low-profile sneakers in smooth leather with a cushioned insole and a quiet off-white sole for everyday polish.",
    price: 5499,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Classic cream leather sneakers on a wooden surface",
    rating: 4.5,
    reviewCount: 158,
    stock: 30,
    isNew: false,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-silk-scarf",
    name: "Silk Scarf",
    slug: "silk-scarf",
    category: "accessories",
    description:
      "A square silk scarf with an original atelier print, rolled edges, and a weight that knots without slipping.",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Silk scarf draped across a marble table",
    rating: 4.7,
    reviewCount: 39,
    stock: 40,
    isNew: true,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-premium-abaya",
    name: "Premium Abaya",
    slug: "premium-abaya",
    category: "women",
    description:
      "A fluid abaya in crepe with a refined neckline, concealed fastenings, and a quiet drape that reads as evening-ready.",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Woman wearing a flowing black abaya in a sunlit hallway",
    rating: 4.9,
    reviewCount: 72,
    stock: 7,
    isNew: true,
    isFeatured: true,
    isSoldOut: false,
  },
  {
    id: "p-pearl-earrings",
    name: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    category: "accessories",
    description:
      "Lightweight drops with a satin-gold setting and cultured pearls, designed to catch light without overwhelming the neckline.",
    price: 2199,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pearl drop earrings resting on a soft fabric",
    rating: 4.6,
    reviewCount: 28,
    stock: 16,
    isNew: true,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-cashmere-wrap",
    name: "Cashmere Wrap",
    slug: "cashmere-wrap",
    category: "women",
    description:
      "An oversized wrap in a fine cashmere blend, finished with a delicate fringe and a shade that layers over almost everything.",
    price: 6799,
    originalPrice: 8499,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Soft knit wrap folded on a wooden bench",
    rating: 4.8,
    reviewCount: 54,
    stock: 0,
    isNew: false,
    isFeatured: false,
    isSoldOut: true,
  },
  {
    id: "p-tailored-trousers",
    name: "Tailored Trousers",
    slug: "tailored-trousers",
    category: "men",
    description:
      "Pressed wool-blend trousers with a mid rise, tapered leg, and a crease that holds through a full day.",
    price: 4599,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Tailored trousers hung against a neutral wall",
    rating: 4.4,
    reviewCount: 33,
    stock: 19,
    isNew: false,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-evening-heels",
    name: "Sculpted Evening Heels",
    slug: "sculpted-evening-heels",
    category: "footwear",
    description:
      "A refined heel in champagne satin with a softly squared toe and a padded insole for longer evenings.",
    price: 7299,
    originalPrice: 9299,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Champagne satin heels photographed from above",
    rating: 4.5,
    reviewCount: 41,
    stock: 8,
    isNew: true,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-attar-set",
    name: "Atelier Fragrance Set",
    slug: "atelier-fragrance-set",
    category: "beauty",
    description:
      "A trio of concentrated scents — saffron wood, white musk, and bitter orange blossom — presented in travel-ready vials.",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1541643607614-d8fce1f27611?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Glass fragrance bottles arranged on a dark surface",
    rating: 4.7,
    reviewCount: 67,
    stock: 21,
    isNew: true,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-linen-cushion",
    name: "Stonewashed Linen Cushion",
    slug: "stonewashed-linen-cushion",
    category: "home-living",
    description:
      "A square cushion in stonewashed linen with a hidden zip and a down-alternative fill that holds its shape.",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Linen cushions styled on a sofa in a bright living room",
    rating: 4.3,
    reviewCount: 19,
    stock: 25,
    isNew: false,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-gold-bangle",
    name: "Brushed Gold Bangle",
    slug: "brushed-gold-bangle",
    category: "accessories",
    description:
      "A slim oval bangle with a brushed finish, designed to stack or sit alone against a bare wrist.",
    price: 1699,
    originalPrice: 2199,
    discount: 23,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Gold bangles stacked on a linen cloth",
    rating: 4.4,
    reviewCount: 22,
    stock: 0,
    isNew: false,
    isFeatured: false,
    isSoldOut: true,
  },
  {
    id: "p-navy-blazer",
    name: "Midnight Knit Blazer",
    slug: "midnight-knit-blazer",
    category: "men",
    description:
      "An unstructured knit blazer with patch pockets and a soft shoulder — tailored enough for dinner, easy enough for travel.",
    price: 9899,
    originalPrice: 12499,
    discount: 21,
    image:
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Navy knit blazer on a wooden hanger",
    rating: 4.6,
    reviewCount: 18,
    stock: 6,
    isNew: false,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-rose-serum",
    name: "Damask Rose Serum",
    slug: "damask-rose-serum",
    category: "beauty",
    description:
      "A lightweight facial serum with damask rose distillate and squalane, meant for evening use on dry or combination skin.",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Rose-tinted serum bottle beside fresh petals",
    rating: 4.8,
    reviewCount: 88,
    stock: 13,
    isNew: false,
    isFeatured: false,
    isSoldOut: false,
  },
  {
    id: "p-table-runner",
    name: "Embroidered Table Runner",
    slug: "embroidered-table-runner",
    category: "home-living",
    description:
      "A hand-finished runner in ivory cotton with a narrow embroidered border, sized for a six-seat table.",
    price: 2799,
    originalPrice: 3499,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Dining table dressed with an ivory runner and ceramic ware",
    rating: 4.5,
    reviewCount: 14,
    stock: 10,
    isNew: true,
    isFeatured: false,
    isSoldOut: false,
  },
];

export const products: Product[] = catalog.map((product) => ({
  ...product,
  discount:
    getDiscountPercent(product.price, product.originalPrice, product.discount) ??
    undefined,
  isSoldOut: product.stock <= 0 || product.isSoldOut,
}));

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((product) => product.isNew);
}

export function getSaleProducts(): Product[] {
  return products.filter(
    (product) => Boolean(product.discount) && !product.isSoldOut,
  );
}

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type PriceFilter = "all" | "under-3000" | "3000-6000" | "over-6000";

export type ProductQuery = {
  search?: string;
  category?: CategorySlug | "all";
  price?: PriceFilter;
  sort?: ProductSort;
};

export function filterProducts(
  list: Product[],
  query: ProductQuery,
): Product[] {
  const search = query.search?.trim().toLowerCase() ?? "";
  const category = query.category && query.category !== "all" ? query.category : null;
  const price = query.price ?? "all";

  const filtered = list.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.includes(search);

    const matchesCategory = !category || product.category === category;

    const matchesPrice =
      price === "all" ||
      (price === "under-3000" && product.price < 3000) ||
      (price === "3000-6000" && product.price >= 3000 && product.price <= 6000) ||
      (price === "over-6000" && product.price > 6000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sort = query.sort ?? "featured";
  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest":
        return Number(b.isNew) - Number(a.isNew);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return Number(b.isFeatured) - Number(a.isFeatured);
    }
  });
}
