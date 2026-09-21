import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: "default" | "warning" | "success";
}) {
  const toneClasses = {
    default: "bg-plum text-ivory",
    warning: "bg-gold text-plum-deep",
    success: "bg-mauve text-plum",
  };

  return (
    <div className="rounded-3xl border border-mauve bg-ivory p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            toneClasses[tone],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-4xl text-charcoal">{value}</p>
    </div>
  );
}
