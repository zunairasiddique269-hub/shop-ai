import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  compact = false,
  inverted = false,
}: {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3",
        inverted ? "text-ivory" : "text-plum",
        className,
      )}
      aria-label="ShopAI home"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
          <rect
            width="48"
            height="48"
            rx="14"
            fill={inverted ? "#FBF8F3" : "#4A1A3A"}
          />
          <path
            d="M31.5 16.2c-1.4-1.5-3.4-2.4-5.8-2.4-5.1 0-8.4 3.2-8.4 7.3 0 3.4 2.1 5.4 6.8 6.6l3.4.9c3.1.8 4.4 1.8 4.4 3.6 0 2.2-2.1 3.7-5.1 3.7-2.6 0-4.6-1-6.1-2.8"
            fill="none"
            stroke={inverted ? "#4A1A3A" : "#C4A574"}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M16.8 31.8c1.5 1.7 3.7 2.7 6.4 2.7 5.3 0 8.7-3.1 8.7-7.4 0-3.5-2.2-5.4-7-6.6l-3.3-.8c-2.8-.7-4.1-1.8-4.1-3.5 0-2.1 2-3.5 4.8-3.5 2.4 0 4.2.9 5.6 2.5"
            fill="none"
            stroke={inverted ? "#6B3A55" : "#E8D7B8"}
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M24 21.2 25.4 24l2.8.4-2 2 .5 2.8L24 27.8 21.3 29.2l.5-2.8-2-2 2.8-.4L24 21.2Z"
            fill={inverted ? "#C4A574" : "#C4A574"}
          />
        </svg>
      </span>
      {compact ? (
        <span className="sr-only">ShopAI</span>
      ) : (
        <span className="flex items-baseline gap-0.5">
          <span className="font-display text-[1.65rem] leading-none tracking-tight">
            Shop
          </span>
          <span className="font-display text-[1.65rem] leading-none tracking-[0.12em] text-gold">
            AI
          </span>
        </span>
      )}
    </Link>
  );
}
