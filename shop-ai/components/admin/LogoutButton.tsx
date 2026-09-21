"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/ui/Icons";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-mauve-deep transition-colors hover:bg-plum-soft/40 hover:text-ivory disabled:opacity-60"
    >
      <LogoutIcon className="h-4 w-4 shrink-0" />
      {isLoggingOut ? "Signing out…" : "Logout"}
    </button>
  );
}
