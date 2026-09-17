"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function AuthForm({
  mode,
}: {
  mode: "login" | "register";
}) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
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
          className="mt-2 h-12 w-full rounded-full border border-mauve bg-cream px-4 text-sm outline-none focus:border-plum"
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
          className="mt-2 h-12 w-full rounded-full border border-mauve bg-cream px-4 text-sm outline-none focus:border-plum"
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
            className="mt-2 h-12 w-full rounded-full border border-mauve bg-cream px-4 text-sm outline-none focus:border-plum"
          />
        </div>
      ) : null}
      <Button type="submit" className="w-full">
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
      {submitted ? (
        <p className="text-sm text-muted">
          Accounts are not connected yet. This screen is a layout placeholder
          for a later authentication phase.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Authentication will be implemented later. No credentials are stored.
        </p>
      )}
    </form>
  );
}
