"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AuthForm({
  mode,
}: {
  mode: "login" | "register";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const url = mode === "login" ? "/api/customer/login" : "/api/customer/register";
    const body =
      mode === "login"
        ? { email, password }
        : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md space-y-4 rounded-3xl border border-mauve bg-ivory p-8"
    >
      <div>
        <label htmlFor="email" className="text-xs uppercase tracking-[0.16em] text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 h-12 w-full rounded-full border border-mauve bg-cream px-4 text-sm outline-none focus:border-plum disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-xs uppercase tracking-[0.16em] text-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 h-12 w-full rounded-full border border-mauve bg-cream px-4 text-sm outline-none focus:border-plum disabled:opacity-60"
        />
      </div>
      {mode === "register" ? (
        <div>
          <label htmlFor="name" className="text-xs uppercase tracking-[0.16em] text-muted">
            Full name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className="mt-2 h-12 w-full rounded-full border border-mauve bg-cream px-4 text-sm outline-none focus:border-plum disabled:opacity-60"
          />
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "login"
            ? "Signing in…"
            : "Creating account…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </Button>
    </form>
  );
}
