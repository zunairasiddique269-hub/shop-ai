// Centralized cart/order money math so subtotal, shipping, and total are
// calculated in exactly one place. Swap calculateShipping for a backend call
// later without touching the cart or checkout UI.

export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 250;

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calculateOrderTotals(subtotal: number) {
  const shipping = calculateShipping(subtotal);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

export function amountToFreeShipping(subtotal: number): number {
  return Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
}
