"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { cartProducts, cartTotal, updateQuantity, removeFromCart } = useStore();

  if (cartProducts.length === 0) {
    return (
      <div className="rounded-3xl border border-mauve bg-ivory px-6 py-16 text-center">
        <p className="font-display text-3xl text-charcoal">Your bag is empty</p>
        <p className="mt-3 text-muted">
          Add pieces from the shop. Checkout is not connected in this phase.
        </p>
        <div className="mt-8">
          <Button href="/shop">Continue shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <ul className="space-y-6">
        {cartProducts.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex gap-4 rounded-3xl border border-mauve bg-ivory p-4 sm:gap-6 sm:p-5"
          >
            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl text-charcoal">{product.name}</p>
              <p className="mt-1 text-sm text-muted">{formatPrice(product.price)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-xs uppercase tracking-[0.16em] text-muted">
                  Qty
                  <select
                    className="ml-2 h-10 rounded-full border border-mauve bg-cream px-3 text-sm text-charcoal"
                    value={quantity}
                    onChange={(event) =>
                      updateQuantity(product.id, Number(event.target.value))
                    }
                  >
                    {Array.from({ length: 8 }).map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="text-xs uppercase tracking-[0.16em] text-plum"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-3xl bg-plum p-6 text-ivory">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">Summary</p>
        <p className="mt-4 flex justify-between font-display text-3xl">
          <span>Total</span>
          <span>{formatPrice(cartTotal)}</span>
        </p>
        <p className="mt-4 text-sm leading-6 text-ivory/70">
          Secure checkout, payments, and order processing will be added in a
          later phase. Your bag is saved on this device.
        </p>
        <button
          type="button"
          disabled
          className="mt-6 h-12 w-full rounded-full bg-ivory/20 text-xs uppercase tracking-[0.18em] text-ivory/70"
        >
          Checkout coming later
        </button>
      </aside>
    </div>
  );
}
