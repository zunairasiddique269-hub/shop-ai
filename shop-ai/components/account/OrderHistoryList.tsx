import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

// Same status -> Badge tone mapping used in the admin dashboard's
// OrderCard, so "pending"/"processing"/etc. look consistent everywhere.
const STATUS_TONE: Record<OrderStatus, "plum" | "gold" | "ivory" | "sold"> = {
  pending: "gold",
  processing: "plum",
  fulfilled: "ivory",
  cancelled: "sold",
};

export function OrderHistoryList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-mauve-deep bg-mauve-soft px-6 py-12 text-center">
        <p className="text-charcoal">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/shop"
          className="mt-3 inline-block text-sm font-medium text-plum underline underline-offset-4"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.orderNumber}>
          <Link
            href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mauve bg-cream px-5 py-4 transition-colors hover:border-plum"
          >
            <div className="min-w-0">
              <p className="font-medium text-charcoal">{order.orderNumber}</p>
              <p className="text-xs text-muted">
                {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {" · "}
                {order.items.length} item{order.items.length === 1 ? "" : "s"}
                {order.trackingId ? ` · Tracking: ${order.trackingId}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-charcoal">
                {formatPrice(order.total)}
              </span>
              <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
