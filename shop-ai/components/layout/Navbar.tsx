"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/lib/nav";

export function Navbar() {
  const pathname = usePathname();
  return <NavbarFrame key={pathname} pathname={pathname} />;
}

function NavbarFrame({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-mauve/80 bg-ivory/95 backdrop-blur-sm">
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-colors",
                  active ? "text-plum" : "text-charcoal/75 hover:text-plum",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:text-plum md:inline-flex"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "Close search" : "Open search"}
            onClick={() => setSearchOpen((value) => !value)}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:text-plum"
            aria-label={`Wishlist, ${wishlist.length} saved`}
          >
            <HeartIcon className="h-5 w-5" filled={wishlist.length > 0} />
            {wishlist.length > 0 ? (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" />
            ) : null}
          </Link>
          <Link
            href="/login"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:text-plum sm:inline-flex"
            aria-label="Account"
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:text-plum"
            aria-label={`Bag, ${cartCount} items`}
          >
            <BagIcon className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-plum px-1 text-center text-[0.6rem] font-semibold leading-4 text-ivory">
              {cartCount}
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {searchOpen ? (
        <div className="hidden border-t border-mauve bg-ivory md:block">
          <Container className="py-4">
            <form onSubmit={submitSearch} className="flex gap-3">
              <label htmlFor="nav-search" className="sr-only">
                Search products
              </label>
              <input
                id="nav-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the collection"
                className="h-12 w-full rounded-full border border-mauve bg-cream px-5 text-sm text-charcoal outline-none placeholder:text-muted focus:border-plum"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-plum px-6 text-xs uppercase tracking-[0.18em] text-ivory"
              >
                Search
              </button>
            </form>
          </Container>
        </div>
      ) : null}

      {open ? (
        <div
          id={menuId}
          className="fixed inset-x-0 top-[4.5rem] z-40 h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-mauve bg-ivory lg:hidden"
        >
          <Container className="flex flex-col gap-6 py-8">
            <form onSubmit={submitSearch}>
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the collection"
                  className="h-12 w-full rounded-full border border-mauve bg-cream pl-11 pr-4 text-sm outline-none focus:border-plum"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-mauve py-4 font-display text-3xl text-charcoal"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="py-4 text-sm uppercase tracking-[0.18em]">
                Account
              </Link>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
