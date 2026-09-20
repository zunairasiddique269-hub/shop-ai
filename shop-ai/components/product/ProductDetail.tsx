"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeartIcon, ShieldIcon, StarIcon, TruckIcon } from "@/components/ui/Icons";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/cn";
import { formatPrice, getDiscountPercent } from "@/lib/format";
import { categoryNames } from "@/lib/category-labels";
import type { Product } from "@/lib/types";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const wished = isWishlisted(product.id);
  const discount = getDiscountPercent(
    product.price,
    product.originalPrice,
    product.discount,
  );
  const maxQuantity = Math.max(product.stock, 0);

  const stockLabel = useMemo(() => {
    if (product.isSoldOut) return "Sold out";
    if (product.stock <= 5) return `Only ${product.stock} left in stock`;
    return "In stock";
  }, [product.isSoldOut, product.stock]);

  function decrease() {
    setQuantity((value) => Math.max(1, value - 1));
  }

  function increase() {
    setQuantity((value) =>
      maxQuantity > 0 ? Math.min(maxQuantity, value + 1) : value + 1,
    );
  }

  function handleAddToCart() {
    if (product.isSoldOut) return;
    addToCart(product.id, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl bg-mauve">
        <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={cn(
              "object-cover",
              product.isSoldOut && "grayscale-[0.35] opacity-80",
            )}
          />
        </div>

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.isNew ? <Badge tone="ivory">New</Badge> : null}
          {discount ? <Badge tone="gold">{`${discount}% off`}</Badge> : null}
          {product.isSoldOut ? <Badge tone="sold">Sold out</Badge> : null}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-sm transition-colors hover:text-plum",
            wished && "text-plum",
          )}
        >
          <HeartIcon className="h-5 w-5" filled={wished} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <Link
          href="/shop"
          className="mb-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-plum"
        >
          <span aria-hidden>←</span> Back to shop
        </Link>

        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
          {categoryNames[product.category]}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
          {product.name}
        </h1>

        <div
          className="mt-4 flex items-center gap-2 text-gold"
          aria-label={`${product.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              className="h-4 w-4"
              filled={index < Math.round(product.rating)}
            />
          ))}
          <span className="text-sm text-muted">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-3xl text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice ? (
            <span className="text-lg text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
          {discount ? <Badge tone="gold">{`Save ${discount}%`}</Badge> : null}
        </div>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted">
          {product.description}
        </p>

        <p
          className={cn(
            "mt-6 text-sm font-medium uppercase tracking-[0.14em]",
            product.isSoldOut ? "text-plum" : "text-charcoal/70",
          )}
        >
          {stockLabel}
        </p>

        {/* Quantity selector */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Quantity
          </span>
          <div className="inline-flex h-12 items-center rounded-full border border-mauve bg-ivory">
            <button
              type="button"
              onClick={decrease}
              disabled={quantity <= 1 || product.isSoldOut}
              aria-label="Decrease quantity"
              className="flex h-full w-11 items-center justify-center text-lg text-charcoal transition-colors hover:text-plum disabled:cursor-not-allowed disabled:text-mauve-deep"
            >
              −
            </button>
            <span
              className="w-10 text-center text-sm font-semibold text-charcoal"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={
                product.isSoldOut ||
                (maxQuantity > 0 && quantity >= maxQuantity)
              }
              aria-label="Increase quantity"
              className="flex h-full w-11 items-center justify-center text-lg text-charcoal transition-colors hover:text-plum disabled:cursor-not-allowed disabled:text-mauve-deep"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="w-full sm:w-auto sm:min-w-[14rem]"
            disabled={product.isSoldOut}
            onClick={handleAddToCart}
          >
            {product.isSoldOut
              ? "Sold out"
              : justAdded
                ? "Added to bag ✓"
                : "Add to cart"}
          </Button>
          <Button href="/cart" variant="secondary" size="lg" className="w-full sm:w-auto">
            View bag
          </Button>
        </div>

        {/* Trust features */}
        <div className="mt-10 grid gap-4 border-t border-mauve pt-8 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <TruckIcon className="mt-0.5 h-5 w-5 text-plum" />
            <div>
              <p className="text-sm font-medium text-charcoal">Free delivery</p>
              <p className="text-xs text-muted">On orders over Rs. 5,000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldIcon className="mt-0.5 h-5 w-5 text-plum" />
            <div>
              <p className="text-sm font-medium text-charcoal">Secure checkout</p>
              <p className="text-xs text-muted">Arriving in a later phase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
