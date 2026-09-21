import { getAllOrders } from "@/lib/db/orders";
import { OrdersList } from "@/components/admin/orders/OrdersList";

export const metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Fulfillment</p>
        <h1 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Orders</h1>
        <p className="mt-2 text-sm text-muted">
          {orders.length} order{orders.length === 1 ? "" : "s"} placed through the storefront.
        </p>
      </div>

      <OrdersList initialOrders={orders} />
    </div>
  );
}
