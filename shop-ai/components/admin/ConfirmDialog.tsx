"use client";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  isSubmitting = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-charcoal/50"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-sm rounded-3xl bg-ivory p-6 shadow-2xl"
      >
        <h2 id="confirm-dialog-title" className="font-display text-xl text-charcoal">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 rounded-full border border-mauve-deep px-5 text-xs font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:bg-mauve-soft disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={
              destructive
                ? "h-10 rounded-full bg-red-600 px-5 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                : "h-10 rounded-full bg-plum px-5 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-plum-deep disabled:opacity-60"
            }
          >
            {isSubmitting ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
