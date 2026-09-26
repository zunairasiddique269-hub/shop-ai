import "server-only";
import type { Order } from "@/lib/types";
import { buildOrderConfirmationEmail, buildOrderStatusUpdateEmail } from "./templates";

// The ONLY file in this project that knows an email provider exists, what
// it's called, or how its API works. Every other file calls the two
// intent-based functions exported at the bottom of this file
// (sendOrderConfirmationEmail / sendOrderStatusUpdateEmail) — nothing else
// imports fetch-to-Resend logic directly.
//
// Provider: Resend (https://resend.com). Its send-email endpoint is a
// single JSON POST, so this calls it directly with fetch() rather than
// installing the `resend` npm package — one less dependency to maintain,
// and no SDK version to keep pinned, which matters for "reusable for
// future client deployments" (a plain HTTP call outlives SDK churn).
//
// Every function below THROWS on failure (missing config, network error,
// non-2xx response) rather than swallowing the error itself. That's
// deliberate: the call sites in app/api/orders/route.ts and
// app/api/orders/[orderNumber]/route.ts are responsible for catching,
// logging, and making sure an email problem never turns a successful
// order/update into a failed request to the customer or admin.

const RESEND_API_URL = "https://api.resend.com/emails";

type EmailConfig = {
  apiKey: string;
  fromAddress: string;
  fromName: string;
};

function getEmailConfig(): EmailConfig {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Shop AI";

  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "RESEND_API_KEY is not set. Copy .env.example to .env and set RESEND_API_KEY to a real Resend API key to enable email sending.",
    );
  }
  if (!fromAddress || !fromAddress.trim()) {
    throw new Error(
      "EMAIL_FROM_ADDRESS is not set. Set it in .env to the address emails should be sent from (must be a domain verified with your Resend account).",
    );
  }

  return { apiKey, fromAddress, fromName };
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const config = getEmailConfig();

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${config.fromName} <${config.fromAddress}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    // Only surface a short message, never the full response body — it's
    // not expected to contain secrets, but there's no reason to log more
    // than necessary either.
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody.message === "string"
        ? errorBody.message
        : response.statusText;
    throw new Error(`Resend API error (${response.status}): ${message}`);
  }
}

// Called after a new order is successfully created (guest or logged-in —
// the recipient always comes from the order's own customerEmail snapshot,
// never a client-supplied address).
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  const { subject, html, text } = buildOrderConfirmationEmail(order);
  await sendEmail({ to: order.customer.email, subject, html, text });
}

// Called after an admin changes an order's status and/or tracking ID.
export async function sendOrderStatusUpdateEmail(order: Order): Promise<void> {
  const { subject, html, text } = buildOrderStatusUpdateEmail(order);
  await sendEmail({ to: order.customer.email, subject, html, text });
}
