import { requireAdminSession } from "@/lib/auth/dal";
import { AdminShell } from "@/components/admin/AdminShell";

// This route group ((dashboard)) covers every authenticated admin page:
// /admin, /admin/products, /admin/orders, etc. app/admin/login/page.tsx
// deliberately lives OUTSIDE this group, so requireAdminSession()'s redirect
// to /admin/login here can never loop back into itself.
//
// proxy.ts already redirects unauthenticated requests before this layout
// even runs, but that check is optimistic (cookie-only, no revalidation) —
// this is the real, authoritative check, matching the Data Access Layer
// pattern in Next's own auth guide.
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell admin={session}>{children}</AdminShell>;
}
