"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getLastOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

const paymentMethodLabels: Record<Order["paymentMethod"], string> = {
  cod: "Cash on Delivery",
  "bank-transfer": "Bank Transfer",
};

export function OrderConfirmation() {
  const [order] = useState<Order | null | undefined>(() =>
    typeof window === "undefined" ? undefined : getLastOrder(),
  );

  // Avoid a flash of the "no order" state while localStorage is read.
  if (order === undefined) {
    return null;
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-dashed border-mauve-deep bg-mauve-soft px-6 py-20 text-center">
        <p className="font-display text-3xl text-charcoal">
          No recent order found
        </p>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          We couldn&apos;t find an order to show. If you just placed one, try
          returning to the shop and checking again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/shop">Continue shopping</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-mauve bg-ivory p-6 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-8 w-8 text-gold"
            aria-hidden
          >
            <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl text-charcoal sm:text-4xl">
          Thank you, your order is confirmed
        </h1>
        <p className="mt-3 text-muted">
          A confirmation has been saved for order{" "}
          <span className="font-medium text-charcoal">{order.orderNumber}</span>.
        </p>

        <dl className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-2">
          <SummaryRow label="Order number" value={order.orderNumber} />
          <SummaryRow label="Name" value={order.customer.fullName} />
          <SummaryRow label="Shipping city" value={order.shippingAddress.city} />
          <SummaryRow
            label="Payment method"
            value={paymentMethodLabels[order.paymentMethod]}
          />
        </dl>
      </div>

      <div className="mt-8 rounded-3xl border border-mauve bg-ivory p-6 sm:p-8">
        <h2 className="font-display text-2xl text-charcoal">Order details</h2>

        <ul className="mt-6 space-y-4">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">
                  {item.name}
                </p>
                <p className="text-xs text-muted">Qty {item.quantity}</p>
              </div>
              <p className="shrink-0 text-sm text-charcoal">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-3 border-t border-mauve pt-5 text-sm">
          <div className="flex items-center justify-between text-muted">
            <dt>Subtotal</dt>
            <dd className="text-charcoal">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between text-muted">
            <dt>Shipping</dt>
            <dd className="text-charcoal">
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center justify-between border-t border-mauve pt-4 font-display text-2xl text-charcoal">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/shop">Continue shopping</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-charcoal">{value}</dd>
    </div>
  );
}
