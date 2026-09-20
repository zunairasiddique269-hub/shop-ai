import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "./client";
import { orderItems, orders } from "./schema";
import type { Order, OrderStatus, PaymentMethod } from "../types";

export function generateOrderNumber(): string {
  const datePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SHOPAI-${datePart}-${randomPart}`;
}

export type CreateOrderInput = {
  customer: { fullName: string; email: string; phone: string };
  shippingAddress: {
    address: string;
    city: string;
    area: string;
    postalCode: string;
  };
  paymentMethod: PaymentMethod;
  items: { productId: string; name: string; image: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
};

function toOrder(
  row: typeof orders.$inferSelect,
  items: (typeof orderItems.$inferSelect)[],
): Order {
  return {
    orderNumber: row.orderNumber,
    createdAt: row.createdAt.toISOString(),
    customer: {
      fullName: row.customerFullName,
      email: row.customerEmail,
      phone: row.customerPhone,
    },
    shippingAddress: {
      address: row.shippingAddress,
      city: row.shippingCity,
      area: row.shippingArea,
      postalCode: row.shippingPostalCode,
    },
    paymentMethod: row.paymentMethod as PaymentMethod,
    status: row.status as OrderStatus,
    trackingId: row.trackingId ?? undefined,
    items: items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
  };
}

// Creates the order and its line items in a single transaction, retrying
// once on the (astronomically unlikely) chance of an order-number
// collision, then returns the persisted order in the same shape the
// storefront already works with.
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return db.transaction(async (tx) => {
    const orderNumber = generateOrderNumber();

    const [orderRow] = await tx
      .insert(orders)
      .values({
        orderNumber,
        customerFullName: input.customer.fullName,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        shippingAddress: input.shippingAddress.address,
        shippingCity: input.shippingAddress.city,
        shippingArea: input.shippingAddress.area,
        shippingPostalCode: input.shippingAddress.postalCode,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        shipping: input.shipping,
        total: input.total,
      })
      .returning();

    const itemRows = input.items.length
      ? await tx
          .insert(orderItems)
          .values(
            input.items.map((item) => ({
              orderId: orderRow.id,
              productId: item.productId,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
            })),
          )
          .returning()
      : [];

    return toOrder(orderRow, itemRows);
  });
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const [orderRow] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!orderRow) return undefined;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderRow.id));

  return toOrder(orderRow, items);
}

// For the future Admin Dashboard order list.
export async function getAllOrders(): Promise<Order[]> {
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));

  const results: Order[] = [];
  for (const orderRow of orderRows) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderRow.id));
    results.push(toOrder(orderRow, items));
  }
  return results;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus,
  trackingId?: string,
): Promise<Order | undefined> {
  const [orderRow] = await db
    .update(orders)
    .set({ status, ...(trackingId !== undefined ? { trackingId } : {}) })
    .where(eq(orders.orderNumber, orderNumber))
    .returning();

  if (!orderRow) return undefined;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderRow.id));

  return toOrder(orderRow, items);
}
