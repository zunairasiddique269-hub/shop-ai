import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "plum",
}: {
  children: string;
  tone?: "plum" | "gold" | "ivory" | "sold";
}) {
  const tones = {
    plum: "bg-plum text-ivory",
    gold: "bg-gold text-plum-deep",
    ivory: "bg-ivory/90 text-charcoal",
    sold: "bg-charcoal text-ivory",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
