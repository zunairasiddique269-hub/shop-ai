import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_TONE: Record<OrderStatus, "plum" | "gold" | "ivory" | "sold"> = {
  pending: "gold",
  processing: "plum",
  fulfilled: "ivory",
  cancelled: "sold",
};

const PAYMENT_LABEL: Record<Order["paymentMethod"], string> = {
  cod: "Cash on Delivery",
  "bank-transfer": "Bank Transfer",
};

export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/account"
        className="text-sm font-medium text-plum underline underline-offset-4"
      >
        ← Back to my account
      </Link>

      <div className="mt-4 rounded-3xl border border-mauve bg-ivory p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Order</p>
            <p className="font-display text-2xl text-charcoal">{order.orderNumber}</p>
          </div>
          <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Placed on</dt>
            <dd className="mt-1 text-sm text-charcoal">
              {new Date(order.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Payment method</dt>
            <dd className="mt-1 text-sm text-charcoal">
              {PAYMENT_LABEL[order.paymentMethod]}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Shipping to</dt>
            <dd className="mt-1 text-sm text-charcoal">
              {order.shippingAddress.address}, {order.shippingAddress.area},{" "}
              {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </dd>
          </div>
          {order.trackingId ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Tracking ID</dt>
              <dd className="mt-1 text-sm text-charcoal">{order.trackingId}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="mt-6 rounded-3xl border border-mauve bg-ivory p-6 sm:p-8">
        <h2 className="font-display text-2xl text-charcoal">Items</h2>
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
                <p className="truncate text-sm font-medium text-charcoal">{item.name}</p>
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
    </div>
  );
}
