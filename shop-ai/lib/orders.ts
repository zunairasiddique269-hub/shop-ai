import type { Order } from "./types";

// Temporary client-side order storage. This key is the seam where a real
// backend (order API + database) would plug in later — the rest of the app
// only ever calls these two functions, never localStorage directly.
const LAST_ORDER_KEY = "shopai-last-order";

export function generateOrderNumber(): string {
  const datePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SHOPAI-${datePart}-${randomPart}`;
}

export function saveOrder(order: Order) {
  try {
    window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Storage can fail (private browsing, quota, etc). The order flow still
    // completes in-memory for this session; nothing else depends on it.
  }
}

export function getLastOrder(): Order | null {
  try {
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
