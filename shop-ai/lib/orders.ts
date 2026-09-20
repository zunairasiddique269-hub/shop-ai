import type { Order, PaymentMethod } from "./types";

// Client-safe. Unlike lib/db/orders.ts, this file has no database import —
// it's the thin fetch wrapper CheckoutForm (a "use client" component) calls
// to persist an order via the /api/orders route handler, replacing the
// previous localStorage-only persistence.

export type PlaceOrderInput = {
  customer: { fullName: string; email: string; phone: string };
  shippingAddress: {
    address: string;
    city: string;
    area: string;
    postalCode: string;
  };
  paymentMethod: PaymentMethod;
  items: { productId: string; name: string; image: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
};

export class PlaceOrderError extends Error {}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new PlaceOrderError(
      "We couldn't place your order. Please check your details and try again.",
    );
  }

  const data = (await response.json()) as { order: Order };
  return data.order;
}
