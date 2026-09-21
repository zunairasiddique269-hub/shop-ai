import "server-only";
import { getAllProducts } from "@/lib/products";
import { getAllOrders } from "@/lib/db/orders";

export type DashboardStats = {
  totalProducts: number;
  inStockProducts: number;
  soldOutProducts: number;
  onSaleProducts: number;
  totalOrders: number;
  pendingOrders: number;
};

// All numbers here come straight from the database via the existing
// lib/products.ts / lib/db/orders.ts query functions — nothing here is
// hard-coded or estimated.
export async function getDashboardStats(): Promise<DashboardStats> {
  const [products, orders] = await Promise.all([getAllProducts(), getAllOrders()]);

  const soldOutProducts = products.filter((product) => product.isSoldOut).length;
  const onSaleProducts = products.filter(
    (product) => Boolean(product.discount) && !product.isSoldOut,
  ).length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return {
    totalProducts: products.length,
    inStockProducts: products.length - soldOutProducts,
    soldOutProducts,
    onSaleProducts,
    totalOrders: orders.length,
    pendingOrders,
  };
}
