import { NextResponse } from "next/server";
import { createOrder, getAllOrders } from "@/lib/db/orders";
import { getCustomerSession, requireAdminApi } from "@/lib/auth/dal";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// POST /api/orders
// Called by CheckoutForm (via lib/orders.ts's placeOrder) when the customer
// places an order. Persists the order + its line items to the database,
// replacing the previous localStorage-only persistence.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.customer !== "object" ||
    typeof body.shippingAddress !== "object" ||
    !isNonEmptyString(body.customer?.fullName) ||
    !isNonEmptyString(body.customer?.email) ||
    !isNonEmptyString(body.customer?.phone) ||
    !isNonEmptyString(body.shippingAddress?.address) ||
    !isNonEmptyString(body.shippingAddress?.city) ||
    !isNonEmptyString(body.shippingAddress?.area) ||
    !isNonEmptyString(body.shippingAddress?.postalCode) ||
    (body.paymentMethod !== "cod" && body.paymentMethod !== "bank-transfer") ||
    !Array.isArray(body.items) ||
    body.items.length === 0 ||
    typeof body.subtotal !== "number" ||
    typeof body.shipping !== "number" ||
    typeof body.total !== "number"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid order fields." },
      { status: 400 },
    );
  }

  const items = body.items.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      isNonEmptyString((item as Record<string, unknown>).productId) &&
      isNonEmptyString((item as Record<string, unknown>).name) &&
      isNonEmptyString((item as Record<string, unknown>).image) &&
      typeof (item as Record<string, unknown>).price === "number" &&
      typeof (item as Record<string, unknown>).quantity === "number",
  );

  if (!items) {
    return NextResponse.json(
      { error: "One or more order items are invalid." },
      { status: 400 },
    );
  }

  // Optional: guest checkout must keep working. getCustomerSession() returns
  // null when there's no valid customer session cookie, in which case the
  // order is simply saved with customerId: null, exactly as before this
  // stage. The client never sends a customerId — it can't, since it's never
  // read from `body` below.
  const customerSession = await getCustomerSession();

  const order = await createOrder({
    customer: body.customer,
    shippingAddress: body.shippingAddress,
    paymentMethod: body.paymentMethod,
    items: body.items,
    subtotal: body.subtotal,
    shipping: body.shipping,
    total: body.total,
    customerId: customerSession?.customerId ?? null,
  });

  return NextResponse.json({ order }, { status: 201 });
}

// GET /api/orders
// Admin-only — this returns every order, including every customer's name,
// email, phone, and shipping address, so it must never be public. Used by
// the Admin Dashboard's order list and overview stats.
export async function GET() {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}
