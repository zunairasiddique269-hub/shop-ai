"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

// The admin dashboard (app/admin/**) has its own layout and chrome
// (components/admin/AdminShell.tsx) — it should never show the customer
// Navbar/Footer. Rather than restructuring app/ into route groups with two
// separate root layouts (a much larger change to a codebase this far
// along), this thin client wrapper just skips the storefront chrome for
// /admin routes. Every existing customer route is completely unaffected.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
