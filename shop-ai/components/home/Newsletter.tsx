"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";

export function Newsletter({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={cn("text-sm", compact ? "text-ivory/80" : "text-muted", className)}>
        Thank you. We will keep this address for a later mailing list.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        compact
          ? "flex flex-col gap-3 sm:flex-row"
          : "mx-auto flex max-w-xl flex-col gap-3 sm:flex-row",
        className,
      )}
    >
      <label htmlFor={compact ? "footer-email" : "newsletter-email"} className="sr-only">
        Email address
      </label>
      <input
        id={compact ? "footer-email" : "newsletter-email"}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className={cn(
          "h-12 w-full rounded-full px-5 text-sm outline-none",
          compact
            ? "border border-ivory/20 bg-plum-deep text-ivory placeholder:text-ivory/45 focus:border-gold"
            : "border border-mauve bg-ivory text-charcoal placeholder:text-muted focus:border-plum",
        )}
      />
      <button
        type="submit"
        className={cn(
          "h-12 shrink-0 rounded-full px-6 text-xs uppercase tracking-[0.18em]",
          compact ? "bg-gold text-plum-deep" : "bg-plum text-ivory",
        )}
      >
        Subscribe
      </button>
    </form>
  );
}
