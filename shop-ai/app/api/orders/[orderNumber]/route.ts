import { NextResponse } from "next/server";
import { getOrderByNumber, updateOrderStatus } from "@/lib/db/orders";

type Params = { params: Promise<{ orderNumber: string }> };

const validStatuses = ["pending", "processing", "fulfilled", "cancelled"];

// GET /api/orders/[orderNumber]
// General-purpose foundation for client-side lookups (e.g. a future "track
// my order" page, or the Admin Dashboard). The order-confirmation page
// itself calls lib/db/orders.ts's getOrderByNumber directly from its Server
// Component instead of hitting this route, since Server Components don't
// need to fetch their own API.
export async function GET(_request: Request, { params }: Params) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

// PATCH /api/orders/[orderNumber]
// Foundation for Stage 4B's Admin Dashboard (update order status/tracking).
// Not yet auth-protected or wired to any UI.
export async function PATCH(request: Request, { params }: Params) {
  const { orderNumber } = await params;
  const body = await request.json().catch(() => null);

  if (!body || !validStatuses.includes(body.status)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(", ")}` },
      { status: 400 },
    );
  }

  const order = await updateOrderStatus(orderNumber, body.status, body.trackingId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}
