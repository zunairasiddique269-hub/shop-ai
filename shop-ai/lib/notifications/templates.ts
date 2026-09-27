import "server-only";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Content only — no provider/delivery code here. lib/notifications/email.ts
// is the only file that knows how an email actually gets sent; this file
// just builds { subject, html, text } for it to hand to the provider.

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const PAYMENT_LABEL: Record<Order["paymentMethod"], string> = {
  cod: "Cash on Delivery",
  "bank-transfer": "Bank Transfer",
};

// Plain, honest labels — matches the four real OrderStatus values. Never
// say "shipped" or "delivered" here; those aren't states this app tracks.
const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pending",
  processing: "Processing",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

function formatOrderDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAddress(order: Order): string {
  const a = order.shippingAddress;
  return `${a.address}, ${a.area}, ${a.city} ${a.postalCode}`;
}

// Minimal HTML escaping for values that come from user input (name,
// address, tracking ID) before they're interpolated into the HTML email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderItemsRowsHtml(order: Order): string {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e6dfe2;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e6dfe2;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e6dfe2;text-align:right;">${formatPrice(
            item.price * item.quantity,
          )}</td>
        </tr>`,
    )
    .join("");
}

function renderItemsLinesText(order: Order): string {
  return order.items
    .map((item) => `  - ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
    .join("\n");
}

// Shared, simple layout — deliberately avoids flexbox/grid, which many
// email clients don't support. Kept to basic tables and block elements.
function wrapHtml(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#faf6f2;font-family:Georgia,'Times New Roman',serif;color:#2c2230;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6dfe2;border-radius:16px;padding:32px;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#a4788f;">
        Shop AI
      </p>
      <h1 style="margin:0 0 16px;font-size:22px;color:#2c2230;">${heading}</h1>
      ${bodyHtml}
      <p style="margin-top:32px;font-size:12px;color:#8b7f85;">
        This is an automated message from Shop AI. Please do not reply directly to this email.
      </p>
    </div>
  </body>
</html>`;
}

export function buildOrderConfirmationEmail(order: Order): EmailContent {
  const subject = `Your Shop AI order ${order.orderNumber} is confirmed`;

  const html = wrapHtml(
    "Thank you for your order",
    `
      <p>Hi ${escapeHtml(order.customer.fullName)},</p>
      <p>We've received your order and it's being prepared. Here's a summary for your records.</p>

      <p style="margin:4px 0;"><strong>Order number:</strong> ${escapeHtml(order.orderNumber)}</p>
      <p style="margin:4px 0;"><strong>Order date:</strong> ${formatOrderDate(order.createdAt)}</p>
      <p style="margin:4px 0;"><strong>Status:</strong> ${STATUS_LABEL[order.status]}</p>
      ${
        order.trackingId
          ? `<p style="margin:4px 0;"><strong>Tracking ID:</strong> ${escapeHtml(order.trackingId)}</p>`
          : ""
      }
      <p style="margin:4px 0;"><strong>Payment method:</strong> ${PAYMENT_LABEL[order.paymentMethod]}</p>
      <p style="margin:4px 0;"><strong>Shipping to:</strong> ${escapeHtml(formatAddress(order))}</p>

      <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #2c2230;">Item</th>
            <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #2c2230;">Qty</th>
            <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #2c2230;">Price</th>
          </tr>
        </thead>
        <tbody>${renderItemsRowsHtml(order)}</tbody>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
        <tr>
          <td style="padding:2px 0;color:#6b5f66;">Subtotal</td>
          <td style="padding:2px 0;text-align:right;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:2px 0;color:#6b5f66;">Shipping</td>
          <td style="padding:2px 0;text-align:right;">${
            order.shipping === 0 ? "Free" : formatPrice(order.shipping)
          }</td>
        </tr>
        <tr>
          <td style="padding:10px 0 0;font-size:18px;font-weight:bold;border-top:1px solid #e6dfe2;">Total</td>
          <td style="padding:10px 0 0;text-align:right;font-size:18px;font-weight:bold;border-top:1px solid #e6dfe2;">${formatPrice(
            order.total,
          )}</td>
        </tr>
      </table>
    `,
  );

  const text = `Thank you for your order

Hi ${order.customer.fullName},

We've received your order and it's being prepared. Here's a summary for your records.

Order number: ${order.orderNumber}
Order date: ${formatOrderDate(order.createdAt)}
Status: ${STATUS_LABEL[order.status]}
${order.trackingId ? `Tracking ID: ${order.trackingId}\n` : ""}Payment method: ${PAYMENT_LABEL[order.paymentMethod]}
Shipping to: ${formatAddress(order)}

Items:
${renderItemsLinesText(order)}

Subtotal: ${formatPrice(order.subtotal)}
Shipping: ${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
Total: ${formatPrice(order.total)}

This is an automated message from Shop AI. Please do not reply directly to this email.`;

  return { subject, html, text };
}

export function buildOrderStatusUpdateEmail(order: Order): EmailContent {
  const subject = `Update on your Shop AI order ${order.orderNumber}`;

  const html = wrapHtml(
    "Your order has been updated",
    `
      <p>Hi ${escapeHtml(order.customer.fullName)},</p>
      <p>There's an update on your order. Here's the latest information.</p>

      <p style="margin:4px 0;"><strong>Order number:</strong> ${escapeHtml(order.orderNumber)}</p>
      <p style="margin:4px 0;"><strong>Status:</strong> ${STATUS_LABEL[order.status]}</p>
      ${
        order.trackingId
          ? `<p style="margin:4px 0;"><strong>Tracking ID:</strong> ${escapeHtml(order.trackingId)}</p>`
          : ""
      }
      <p style="margin:4px 0;"><strong>Shipping to:</strong> ${escapeHtml(formatAddress(order))}</p>
      <p style="margin:16px 0 0;font-size:16px;"><strong>Order total:</strong> ${formatPrice(order.total)}</p>
    `,
  );

  const text = `Your order has been updated

Hi ${order.customer.fullName},

There's an update on your order. Here's the latest information.

Order number: ${order.orderNumber}
Status: ${STATUS_LABEL[order.status]}
${order.trackingId ? `Tracking ID: ${order.trackingId}\n` : ""}Shipping to: ${formatAddress(order)}
Order total: ${formatPrice(order.total)}

This is an automated message from Shop AI. Please do not reply directly to this email.`;

  return { subject, html, text };
}

// --- WhatsApp message content ---
//
// Added for the WhatsApp notification feature. Reuses the same
// formatOrderDate/formatAddress/PAYMENT_LABEL/STATUS_LABEL helpers above
// rather than duplicating them in lib/notifications/whatsapp.ts, which only
// knows about delivery (the HTTP call), never message wording — same split
// as the email content above. WhatsApp messages are plain text (no HTML),
// so these return a single string each. `*text*` is WhatsApp's own bold
// formatting syntax, not markdown.

export function buildOrderConfirmationWhatsAppMessage(order: Order): string {
  const lines = [
    `*Shop AI — Order Confirmed*`,
    ``,
    `Hi ${order.customer.fullName}, thanks for your order!`,
    ``,
    `*Order:* ${order.orderNumber}`,
    `*Date:* ${formatOrderDate(order.createdAt)}`,
    `*Status:* ${STATUS_LABEL[order.status]}`,
  ];
  if (order.trackingId) {
    lines.push(`*Tracking ID:* ${order.trackingId}`);
  }
  lines.push(
    `*Payment:* ${PAYMENT_LABEL[order.paymentMethod]}`,
    `*Shipping to:* ${formatAddress(order)}`,
    ``,
    `*Items:*`,
    ...order.items.map(
      (item) => `- ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`,
    ),
    ``,
    `*Total: ${formatPrice(order.total)}*`,
    ``,
    `This is an automated message from Shop AI.`,
  );
  return lines.join("\n");
}

export function buildOrderStatusUpdateWhatsAppMessage(order: Order): string {
  const lines = [
    `*Shop AI — Order Update*`,
    ``,
    `Hi ${order.customer.fullName}, there's an update on your order.`,
    ``,
    `*Order:* ${order.orderNumber}`,
    `*Status:* ${STATUS_LABEL[order.status]}`,
  ];
  if (order.trackingId) {
    lines.push(`*Tracking ID:* ${order.trackingId}`);
  }
  lines.push(
    `*Order total:* ${formatPrice(order.total)}`,
    `*Shipping to:* ${formatAddress(order)}`,
    ``,
    `This is an automated message from Shop AI.`,
  );
  return lines.join("\n");
}
