import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/stats";
import { getAdminSession } from "@/lib/auth/dal";
import { StatCard } from "@/components/admin/StatCard";
import {
  AlertIcon,
  ClipboardIcon,
  PackageIcon,
  SparkleIcon,
} from "@/components/ui/Icons";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const [stats, admin] = await Promise.all([getDashboardStats(), getAdminSession()]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Overview</p>
        <h1 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">
          Welcome back{admin ? `, ${admin.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          A live snapshot of your catalog and orders, pulled directly from the ShopAI database.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Products
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total products" value={stats.totalProducts} icon={PackageIcon} />
          <StatCard
            label="In stock"
            value={stats.inStockProducts}
            icon={PackageIcon}
            tone="success"
          />
          <StatCard
            label="Sold out"
            value={stats.soldOutProducts}
            icon={AlertIcon}
            tone="warning"
          />
          <StatCard
            label="On sale"
            value={stats.onSaleProducts}
            icon={SparkleIcon}
            tone="warning"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Orders
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total orders" value={stats.totalOrders} icon={ClipboardIcon} />
          <StatCard
            label="Pending orders"
            value={stats.pendingOrders}
            icon={AlertIcon}
            tone="warning"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-3xl border border-mauve bg-ivory p-6">
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-plum px-6 text-xs font-medium uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-plum-deep"
        >
          Add a product
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex h-11 items-center justify-center rounded-full border border-plum/20 px-6 text-xs font-medium uppercase tracking-[0.16em] text-plum transition-colors hover:bg-mauve-soft"
        >
          Review orders
        </Link>
      </div>
    </div>
  );
}
