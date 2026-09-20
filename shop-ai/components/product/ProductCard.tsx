"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { HeartIcon, StarIcon } from "@/components/ui/Icons";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/cn";
import { formatPrice, getDiscountPercent } from "@/lib/format";
import { categoryNames } from "@/lib/category-labels";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
  const discount = getDiscountPercent(
    product.price,
    product.originalPrice,
    product.discount,
  );

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-mauve">
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-[3/4] overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-[1.04]",
              product.isSoldOut && "grayscale-[0.35] opacity-80",
            )}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
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
            "absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-sm transition-colors hover:text-plum",
            wished && "text-plum",
          )}
        >
          <HeartIcon className="h-4 w-4" filled={wished} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          {categoryNames[product.category]}
        </p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-charcoal">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="mt-2 flex items-center gap-2 text-gold" aria-label={`${product.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              className="h-3.5 w-3.5"
              filled={index < Math.round(product.rating)}
            />
          ))}
          <span className="text-xs text-muted">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice ? (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          disabled={product.isSoldOut}
          onClick={() => addToCart(product.id)}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-plum/20 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-plum transition-colors hover:bg-plum hover:text-ivory disabled:cursor-not-allowed disabled:border-mauve-deep disabled:bg-mauve disabled:text-muted"
        >
          {product.isSoldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
