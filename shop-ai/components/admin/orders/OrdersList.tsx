"use client";

import { useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { OrderCard } from "@/components/admin/orders/OrderCard";
import { SearchIcon } from "@/components/ui/Icons";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.fullName.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function handleUpdated(updated: Order) {
    setOrders((current) =>
      current.map((order) => (order.orderNumber === updated.orderNumber ? updated : order)),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order #, name, or email…"
            className="h-11 w-full rounded-full border border-mauve bg-ivory pl-10 pr-4 text-sm outline-none focus:border-plum"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")}
          className="h-11 rounded-full border border-mauve bg-ivory px-4 text-sm outline-none focus:border-plum"
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-mauve bg-ivory px-6 py-16 text-center text-sm text-muted">
          {orders.length === 0
            ? "No orders yet. They'll show up here as soon as customers check out."
            : "No orders match your search."}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.orderNumber} order={order} onUpdated={handleUpdated} />
          ))}
        </div>
      )}

      <p className="text-xs text-muted">
        Showing {filtered.length} of {orders.length} · Total value{" "}
        {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
      </p>
    </div>
  );
}
