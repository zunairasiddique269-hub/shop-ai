"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { AlertIcon, ChevronDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "fulfilled", "cancelled"];

const STATUS_TONE: Record<OrderStatus, "plum" | "gold" | "ivory" | "sold"> = {
  pending: "gold",
  processing: "plum",
  fulfilled: "ivory",
  cancelled: "sold",
};

const PAYMENT_LABEL: Record<Order["paymentMethod"], string> = {
  cod: "Cash on delivery",
  "bank-transfer": "Bank transfer",
};

export function OrderCard({
  order,
  onUpdated,
}: {
  order: Order;
  onUpdated: (order: Order) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isDirty = status !== order.status || trackingId !== (order.trackingId ?? "");

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingId: trackingId.trim() || null }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        order?: Order;
        error?: string;
      };
      if (!response.ok || !data.order) {
        throw new Error(data.error ?? "Could not update this order.");
      }
      onUpdated(data.order);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this order.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-mauve bg-ivory">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <div>
          <p className="font-medium text-charcoal">{order.orderNumber}</p>
          <p className="text-xs text-muted">
            {order.customer.fullName} ·{" "}
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-charcoal">{formatPrice(order.total)}</span>
          <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
          <ChevronDownIcon
            className={cn("h-4 w-4 text-muted transition-transform", expanded && "rotate-180")}
          />
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-mauve/60 px-6 py-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Customer
              </h3>
              <p className="mt-2 text-sm text-charcoal">{order.customer.fullName}</p>
              <p className="text-sm text-muted">{order.customer.email}</p>
              <p className="text-sm text-muted">{order.customer.phone}</p>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Shipping address
              </h3>
              <p className="mt-2 text-sm text-charcoal">
                {order.shippingAddress.address}, {order.shippingAddress.area}
              </p>
              <p className="text-sm text-muted">
                {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </p>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Payment
              </h3>
              <p className="mt-2 text-sm text-charcoal">
                {PAYMENT_LABEL[order.paymentMethod]}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Items
              </h3>
              <ul className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between text-sm text-charcoal"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-muted">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-mauve/60 pt-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-charcoal">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-mauve/60 bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Update fulfillment
            </h3>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs text-muted" htmlFor={`status-${order.orderNumber}`}>
                  Status
                </label>
                <select
                  id={`status-${order.orderNumber}`}
                  value={status}
                  onChange={(event) => setStatus(event.target.value as OrderStatus)}
                  className="mt-1 h-10 rounded-full border border-mauve bg-ivory px-4 text-sm capitalize outline-none focus:border-plum"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option} className="capitalize">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs text-muted" htmlFor={`tracking-${order.orderNumber}`}>
                  Tracking ID
                </label>
                <input
                  id={`tracking-${order.orderNumber}`}
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  placeholder="e.g. TCS-1234567"
                  className="mt-1 h-10 w-full rounded-full border border-mauve bg-ivory px-4 text-sm outline-none focus:border-plum"
                />
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="h-10 rounded-full bg-plum px-6 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-plum-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
            {error ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
                <AlertIcon className="h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
