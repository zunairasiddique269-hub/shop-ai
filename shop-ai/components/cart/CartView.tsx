"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/context/StoreProvider";
import { categoryNames } from "@/lib/categories";
import { formatPrice, getDiscountPercent } from "@/lib/format";
import {
  amountToFreeShipping,
  calculateOrderTotals,
} from "@/lib/shipping";

export function CartView() {
  const { cartProducts, cartTotal, updateQuantity, removeFromCart } =
    useStore();

  if (cartProducts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-mauve-deep bg-mauve-soft px-6 py-20 text-center">
        <p className="font-display text-3xl text-charcoal">Your bag is empty</p>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          You haven&apos;t added anything yet. Browse the collection and find
          something you love.
        </p>
        <div className="mt-8">
          <Button href="/shop">Continue shopping</Button>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, total } = calculateOrderTotals(cartTotal);
  const remainingForFreeShipping = amountToFreeShipping(subtotal);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <ul className="space-y-6">
        {cartProducts.map(({ product, quantity }) => {
          const discount = getDiscountPercent(
            product.price,
            product.originalPrice,
            product.discount,
          );
          const atStockLimit = quantity >= product.stock;
          const lineTotal = product.price * quantity;

          return (
            <li
              key={product.id}
              className="flex gap-4 rounded-3xl border border-mauve bg-ivory p-4 sm:gap-6 sm:p-5"
            >
              <Link
                href={`/product/${product.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-28"
              >
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">
                      {categoryNames[product.category]}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-display text-xl text-charcoal transition-colors hover:text-plum sm:text-2xl"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-display text-lg text-charcoal sm:text-xl">
                      {formatPrice(lineTotal)}
                    </p>
                    {discount ? (
                      <p className="text-xs text-muted line-through">
                        {formatPrice(
                          (product.originalPrice ?? product.price) * quantity,
                        )}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{formatPrice(product.price)} each</span>
                  {discount ? <Badge tone="gold">{`${discount}% off`}</Badge> : null}
                  {product.isSoldOut ? <Badge tone="sold">Sold out</Badge> : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex h-10 items-center rounded-full border border-mauve bg-cream">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={product.isSoldOut}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="flex h-full w-9 items-center justify-center text-charcoal transition-colors hover:text-plum disabled:cursor-not-allowed disabled:text-mauve-deep"
                    >
                      −
                    </button>
                    <span
                      className="w-8 text-center text-sm font-semibold text-charcoal"
                      aria-live="polite"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={product.isSoldOut || atStockLimit}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="flex h-full w-9 items-center justify-center text-charcoal transition-colors hover:text-plum disabled:cursor-not-allowed disabled:text-mauve-deep"
                    >
                      +
                    </button>
                  </div>

                  {!product.isSoldOut && atStockLimit ? (
                    <span className="text-xs text-muted">
                      Only {product.stock} in stock
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-xs uppercase tracking-[0.16em] text-plum transition-colors hover:text-plum-deep"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit space-y-6">
        <div className="rounded-3xl bg-plum p-6 text-ivory">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            Order summary
          </p>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between text-ivory/85">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-ivory/85">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-ivory/20 pt-4 font-display text-2xl">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {remainingForFreeShipping > 0 ? (
            <p className="mt-4 text-xs leading-5 text-ivory/70">
              Add {formatPrice(remainingForFreeShipping)} more to unlock free
              shipping.
            </p>
          ) : (
            <p className="mt-4 text-xs leading-5 text-gold">
              You&apos;ve unlocked free shipping.
            </p>
          )}

          <Button
            href="/checkout"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
          >
            Proceed to checkout
          </Button>
        </div>

        <Button href="/shop" variant="secondary" className="w-full">
          Continue shopping
        </Button>
      </aside>
    </div>
  );
}
