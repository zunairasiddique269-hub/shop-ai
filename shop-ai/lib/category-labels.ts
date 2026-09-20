import type { CategorySlug } from "./types";

// Pure, dependency-free label lookup — safe to import from Client
// Components (ProductCard, ProductDetail, CartView) since it never touches
// the database. lib/categories.ts re-exports this for server-side callers
// that want both the DB-backed functions and this map from one import.
export const categoryNames: Record<CategorySlug, string> = {
  women: "Women",
  men: "Men",
  accessories: "Accessories",
  footwear: "Footwear",
  beauty: "Beauty",
  "home-living": "Home & Living",
};
