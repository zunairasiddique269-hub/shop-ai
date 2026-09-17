import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-plum text-ivory hover:bg-plum-deep focus-visible:outline-plum",
  secondary:
    "bg-transparent text-charcoal border border-charcoal/20 hover:border-plum hover:text-plum",
  gold: "bg-gold text-plum-deep hover:bg-gold-light focus-visible:outline-gold",
  ghost: "bg-transparent text-charcoal hover:text-plum",
  inverse:
    "bg-ivory text-plum hover:bg-cream focus-visible:outline-ivory",
};

const sizes = {
  sm: "h-10 px-4 text-xs tracking-[0.16em]",
  md: "h-12 px-6 text-xs tracking-[0.18em]",
  lg: "h-14 px-8 text-sm tracking-[0.2em]",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
