"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/customer/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
