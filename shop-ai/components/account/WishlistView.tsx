"use client";

import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useStore } from "@/context/StoreProvider";

export function WishlistView() {
  const { wishlistProducts } = useStore();

  if (wishlistProducts.length === 0) {
    return (
      <div className="rounded-3xl border border-mauve bg-ivory px-6 py-16 text-center">
        <p className="font-display text-3xl text-charcoal">Nothing saved yet</p>
        <p className="mt-3 text-muted">
          Tap the heart on a product card to keep it here.
        </p>
        <div className="mt-8">
          <Button href="/shop">Explore the shop</Button>
        </div>
      </div>
    );
  }

  return <ProductGrid products={wishlistProducts} />;
}
