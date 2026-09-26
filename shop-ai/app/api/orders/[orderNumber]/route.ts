import { NextResponse } from "next/server";
import { getOrderByNumber, updateOrderStatus } from "@/lib/db/orders";
import { requireAdminApi } from "@/lib/auth/dal";
import { sendOrderStatusUpdateEmail } from "@/lib/notifications/email";

type Params = { params: Promise<{ orderNumber: string }> };

const validStatuses = ["pending", "processing", "fulfilled", "cancelled"];

// GET /api/orders/[orderNumber]
// Admin-only. Nothing on the customer storefront currently uses this route
// — the order-confirmation page calls lib/db/orders.ts's getOrderByNumber
// directly from its Server Component instead (see app/order-confirmation/
// page.tsx) — and a single order carries a customer's name, email, phone,
// and address, so it stays behind admin auth like the list endpoint above.
export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

// PATCH /api/orders/[orderNumber]
// Admin-only (Stage 4B's Orders page: update status/tracking ID).
export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { orderNumber } = await params;
  const body = await request.json().catch(() => null);

  if (!body || !validStatuses.includes(body.status)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(", ")}` },
      { status: 400 },
    );
  }

  if (
    body.trackingId !== undefined &&
    body.trackingId !== null &&
    typeof body.trackingId !== "string"
  ) {
    return NextResponse.json(
      { error: "trackingId must be a string." },
      { status: 400 },
    );
  }

  // Snapshot the order's state before updating, so we can tell whether this
  // request actually changes anything worth emailing about — an admin
  // re-saving the same status/tracking value shouldn't trigger a new email.
  // This is the smallest safe way to detect a real change without
  // redesigning trackingId editing's existing "undefined leaves it
  // unchanged" behavior (see updateOrderStatus in lib/db/orders.ts).
  const previousOrder = await getOrderByNumber(orderNumber);

  const order = await updateOrderStatus(
    orderNumber,
    body.status,
    body.trackingId === null ? undefined : body.trackingId,
  );
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const statusChanged = previousOrder ? previousOrder.status !== order.status : false;
  const trackingChanged = previousOrder
    ? (previousOrder.trackingId ?? "") !== (order.trackingId ?? "")
    : false;

  // Same rule as order creation: an email problem must never turn this
  // successful database update into a failed request for the admin.
  if (statusChanged || trackingChanged) {
    try {
      await sendOrderStatusUpdateEmail(order);
    } catch (error) {
      console.error("Order status update email failed", error);
    }
  }

  return NextResponse.json({ order });
}
