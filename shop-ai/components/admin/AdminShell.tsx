"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/brand/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import type { AdminSessionPayload } from "@/lib/auth/session";
import {
  ClipboardIcon,
  DashboardIcon,
  ExternalLinkIcon,
  MenuIcon,
  CloseIcon,
  PackageIcon,
} from "@/components/ui/Icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/products", label: "Products", icon: PackageIcon, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ClipboardIcon, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-8">
        <Logo inverted compact={false} />
        <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-gold">
          Admin Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-gold text-plum-deep"
                  : "text-mauve-deep hover:bg-plum-soft/40 hover:text-ivory",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-plum-soft/30 px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-mauve-deep transition-colors hover:bg-plum-soft/40 hover:text-ivory"
        >
          <ExternalLinkIcon className="h-4 w-4 shrink-0" />
          View store
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminSessionPayload;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-plum-deep lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-plum-deep shadow-xl">
            <div className="flex justify-end px-4 pt-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-mauve-deep hover:text-ivory"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-mauve bg-ivory/95 px-4 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-charcoal lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div>
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-gold">
                Admin Dashboard
              </p>
              <p className="font-display text-lg text-charcoal">ShopAI Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-charcoal">{admin.name}</p>
              <p className="text-xs capitalize text-muted">{admin.role}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum text-sm font-semibold uppercase text-ivory">
              {admin.name.charAt(0)}
            </span>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
