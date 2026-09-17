export type CategorySlug =
  | "women"
  | "men"
  | "accessories"
  | "footwear"
  | "beauty"
  | "home-living";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isSoldOut: boolean;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
