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

export type PaymentMethod = "cod" | "bank-transfer";

export type OrderStatus = "pending" | "processing" | "fulfilled" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    area: string;
    postalCode: string;
  };
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  trackingId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};
