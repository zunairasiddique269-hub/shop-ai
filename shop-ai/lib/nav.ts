export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/sale", label: "Sale" },
  { href: "/about", label: "About" },
] as const;

export const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/sale", label: "Season Sale" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
] as const;

export const serviceLinks = [
  { href: "/about", label: "About ShopAI" },
  { href: "/about#care", label: "Shipping & Delivery" },
  { href: "/about#care", label: "Returns" },
  { href: "/about#care", label: "Size Guide" },
  { href: "/about#care", label: "Contact" },
] as const;

export const accountLinks = [
  { href: "/login", label: "Sign In" },
  { href: "/register", label: "Create Account" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Bag" },
] as const;
