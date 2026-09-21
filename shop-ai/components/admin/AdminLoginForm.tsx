"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertIcon } from "@/components/ui/Icons";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-plum-soft/40 bg-plum p-8 shadow-xl shadow-plum-deep/40"
      noValidate
    >
      <div>
        <label
          htmlFor="admin-email"
          className="text-xs uppercase tracking-[0.16em] text-mauve-deep"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 h-12 w-full rounded-full border border-plum-soft/50 bg-plum-deep px-4 text-sm text-ivory outline-none placeholder:text-mauve-deep/70 focus:border-gold disabled:opacity-60"
          placeholder="admin@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="admin-password"
          className="text-xs uppercase tracking-[0.16em] text-mauve-deep"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 h-12 w-full rounded-full border border-plum-soft/50 bg-plum-deep px-4 text-sm text-ivory outline-none placeholder:text-mauve-deep/70 focus:border-gold disabled:opacity-60"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-gold/30 bg-plum-deep/60 px-4 py-3 text-sm text-gold-light">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-xs font-medium uppercase tracking-[0.18em] text-plum-deep transition-colors duration-300 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-plum-deep/30 border-t-plum-deep" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
