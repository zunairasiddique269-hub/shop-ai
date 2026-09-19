"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";
import type { CartItem, Product } from "@/lib/types";

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartProducts: Array<{ product: Product; quantity: number }>;
  wishlistProducts: Product[];
  cartTotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "shopai-cart";
const WISHLIST_KEY = "shopai-wishlist";

type Snapshot = {
  cart: CartItem[];
  wishlist: string[];
};

const emptySnapshot: Snapshot = { cart: [], wishlist: [] };
const listeners = new Set<() => void>();
let snapshot: Snapshot = emptySnapshot;
let clientReady = false;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(next: Snapshot) {
  snapshot = next;
  window.localStorage.setItem(CART_KEY, JSON.stringify(next.cart));
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next.wishlist));
  emit();
}

function hydrate() {
  if (clientReady || typeof window === "undefined") return;
  snapshot = {
    cart: readJson<CartItem[]>(CART_KEY, []),
    wishlist: readJson<string[]>(WISHLIST_KEY, []),
  };
  clientReady = true;
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  hydrate();
  return snapshot;
}

function getServerSnapshot() {
  return emptySnapshot;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { cart, wishlist } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const product = products.find((item) => item.id === productId);
    if (!product || product.isSoldOut || product.stock <= 0) return;

    const current = getSnapshot();
    const existing = current.cart.find((item) => item.productId === productId);
    const nextQuantity = Math.min(
      (existing?.quantity ?? 0) + quantity,
      product.stock,
    );
    const cart = existing
      ? current.cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: nextQuantity }
            : item,
        )
      : [...current.cart, { productId, quantity: nextQuantity }];
    persist({ ...current, cart });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const current = getSnapshot();

    if (quantity <= 0) {
      persist({
        ...current,
        cart: current.cart.filter((item) => item.productId !== productId),
      });
      return;
    }

    const product = products.find((item) => item.id === productId);
    const clamped = product ? Math.min(quantity, Math.max(product.stock, 1)) : quantity;
    const cart = current.cart.map((item) =>
      item.productId === productId ? { ...item, quantity: clamped } : item,
    );
    persist({ ...current, cart });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    const current = getSnapshot();
    persist({
      ...current,
      cart: current.cart.filter((item) => item.productId !== productId),
    });
  }, []);

  const clearCart = useCallback(() => {
    const current = getSnapshot();
    persist({ ...current, cart: [] });
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const current = getSnapshot();
    const wishlist = current.wishlist.includes(productId)
      ? current.wishlist.filter((id) => id !== productId)
      : [...current.wishlist, productId];
    persist({ ...current, wishlist });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const value = useMemo(() => {
    const cartProducts = cart
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter((item): item is { product: Product; quantity: number } =>
        Boolean(item),
      );

    return {
      cart,
      wishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartProducts,
      wishlistProducts: products.filter((product) =>
        wishlist.includes(product.id),
      ),
      cartTotal: cartProducts.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    };
  }, [
    addToCart,
    cart,
    clearCart,
    isWishlisted,
    removeFromCart,
    toggleWishlist,
    updateQuantity,
    wishlist,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
