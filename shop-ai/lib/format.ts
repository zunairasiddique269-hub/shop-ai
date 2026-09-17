export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function getDiscountPercent(
  price: number,
  originalPrice?: number,
  discount?: number,
): number | null {
  if (discount && discount > 0) return discount;
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
