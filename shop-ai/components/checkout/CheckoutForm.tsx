"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/format";
import { generateOrderNumber, saveOrder } from "@/lib/orders";
import { calculateOrderTotals } from "@/lib/shipping";
import type { Order, OrderItem, PaymentMethod } from "@/lib/types";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  area: "",
  postalCode: "",
};

const inputClasses =
  "mt-2 h-12 w-full rounded-full border bg-cream px-4 text-sm outline-none transition-colors";

function fieldBorder(hasError: boolean) {
  return hasError
    ? "border-red-400 focus:border-red-500"
    : "border-mauve focus:border-plum";
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!/^[+0-9\s-]{7,}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  if (form.address.trim().length < 5) {
    errors.address = "Enter your street address.";
  }
  if (form.city.trim().length < 2) {
    errors.city = "Enter your city.";
  }
  if (form.area.trim().length < 2) {
    errors.area = "Enter your area or neighborhood.";
  }
  if (!/^[0-9]{4,6}$/.test(form.postalCode.trim())) {
    errors.postalCode = "Enter a valid postal code.";
  }

  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const { cartProducts, cartTotal, clearCart } = useStore();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

  if (cartProducts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-mauve-deep bg-mauve-soft px-6 py-20 text-center">
        <p className="font-display text-3xl text-charcoal">
          There&apos;s nothing to check out yet
        </p>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Add pieces to your bag before continuing to checkout.
        </p>
        <div className="mt-8">
          <Button href="/shop">Back to shop</Button>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, total } = calculateOrderTotals(cartTotal);

  function updateField(field: keyof FormState) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const items: OrderItem[] = cartProducts.map(({ product, quantity }) => ({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    }));

    const order: Order = {
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      shippingAddress: {
        address: form.address.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        postalCode: form.postalCode.trim(),
      },
      paymentMethod,
      items,
      subtotal,
      shipping,
      total,
    };

    saveOrder(order);
    clearCart();
    router.push("/order-confirmation");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-mauve bg-ivory p-6 sm:p-8">
          <h2 className="font-display text-2xl text-charcoal">
            Customer information
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={updateField("fullName")}
              error={errors.fullName}
              autoComplete="name"
            />
            <Field
              id="phone"
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={updateField("phone")}
              error={errors.phone}
              autoComplete="tel"
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              error={errors.email}
              autoComplete="email"
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-mauve bg-ivory p-6 sm:p-8">
          <h2 className="font-display text-2xl text-charcoal">
            Shipping information
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              id="address"
              label="Address"
              value={form.address}
              onChange={updateField("address")}
              error={errors.address}
              autoComplete="street-address"
              className="sm:col-span-2"
            />
            <Field
              id="city"
              label="City"
              value={form.city}
              onChange={updateField("city")}
              error={errors.city}
              autoComplete="address-level2"
            />
            <Field
              id="area"
              label="Area"
              value={form.area}
              onChange={updateField("area")}
              error={errors.area}
            />
            <Field
              id="postalCode"
              label="Postal code"
              value={form.postalCode}
              onChange={updateField("postalCode")}
              error={errors.postalCode}
              autoComplete="postal-code"
              inputMode="numeric"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-mauve bg-ivory p-6 sm:p-8">
          <h2 className="font-display text-2xl text-charcoal">
            Payment method
          </h2>
          <div className="mt-6 space-y-3">
            <PaymentOption
              id="cod"
              name="Cash on Delivery"
              description="Pay with cash when your order arrives."
              checked={paymentMethod === "cod"}
              onSelect={() => setPaymentMethod("cod")}
            />
            <PaymentOption
              id="bank-transfer"
              name="Bank Transfer"
              description="Transfer the total to our account after placing your order."
              checked={paymentMethod === "bank-transfer"}
              onSelect={() => setPaymentMethod("bank-transfer")}
            />
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-6">
        <div className="rounded-3xl border border-mauve bg-ivory p-6">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            Order summary
          </p>

          <ul className="mt-5 space-y-4">
            {cartProducts.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted">Qty {quantity}</p>
                </div>
                <p className="shrink-0 text-sm text-charcoal">
                  {formatPrice(product.price * quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-mauve pt-5 text-sm">
            <div className="flex items-center justify-between text-muted">
              <dt>Subtotal</dt>
              <dd className="text-charcoal">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-muted">
              <dt>Shipping</dt>
              <dd className="text-charcoal">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-mauve pt-4 font-display text-2xl text-charcoal">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting ? "Placing order…" : "Place order"}
          </Button>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  ...props
}: {
  id: keyof FormState;
  label: string;
  error?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-[0.16em] text-muted"
      >
        {label} <span className="text-plum">*</span>
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClasses} ${fieldBorder(Boolean(error))}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PaymentOption({
  id,
  name,
  description,
  checked,
  onSelect,
}: {
  id: PaymentMethod;
  name: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        checked ? "border-plum bg-mauve-soft" : "border-mauve bg-cream"
      }`}
    >
      <input
        type="radio"
        id={id}
        name="paymentMethod"
        checked={checked}
        onChange={onSelect}
        className="mt-1 h-4 w-4 accent-plum"
      />
      <span>
        <span className="block text-sm font-medium text-charcoal">
          {name}
        </span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </span>
    </label>
  );
}
