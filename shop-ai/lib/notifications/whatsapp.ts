import "server-only";
import type { Order } from "@/lib/types";
import {
  buildOrderConfirmationWhatsAppMessage,
  buildOrderStatusUpdateWhatsAppMessage,
} from "./templates";

// The ONLY file in this project that knows a WhatsApp provider exists, what
// it's called, or how its API works — same role for WhatsApp that
// lib/notifications/email.ts plays for email. Every other file calls the
// two intent-based functions exported at the bottom
// (sendOrderConfirmationWhatsApp / sendOrderStatusUpdateWhatsApp).
//
// Provider: the official WhatsApp Cloud API (Meta), not a third-party
// reseller SDK. Its send-message endpoint is a single JSON POST, so this
// calls it directly with fetch(), the same choice already made for Resend
// in email.ts — no SDK dependency to install or keep pinned.
//
// Every function below THROWS on failure (missing config, network error,
// non-2xx response) rather than swallowing it, for the same reason as
// email.ts: the call sites in app/api/orders/route.ts and
// app/api/orders/[orderNumber]/route.ts are responsible for catching,
// logging, and making sure a WhatsApp problem never turns a successful
// order/update into a failed request.
//
// IMPORTANT REAL-WORLD CAVEAT (not something code alone can fix): the
// WhatsApp Business Platform generally requires a pre-approved message
// TEMPLATE for messages a business sends first (outside a 24-hour window
// the customer opened by messaging the business themselves). The plain
// text message sent here will work while testing against Meta's own test
// number, and within an open customer-service window, but a production
// deployment sending unprompted order confirmations will likely need to
// create and get a template approved in Meta Business Manager and switch
// the payload below to a "template" message referencing it. That approval
// step can't be done from here — it requires the business's own Meta
// Business Manager account.

const WHATSAPP_API_VERSION = "v21.0";

type WhatsAppConfig = {
  accessToken: string;
  phoneNumberId: string;
  defaultCountryCode: string;
};

function getWhatsAppConfig(): WhatsAppConfig {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const defaultCountryCode = process.env.WHATSAPP_DEFAULT_COUNTRY_CODE?.trim() || "92";

  if (!accessToken || !accessToken.trim()) {
    throw new Error(
      "WHATSAPP_ACCESS_TOKEN is not set. Copy .env.example to .env and set WHATSAPP_ACCESS_TOKEN to a real WhatsApp Cloud API access token to enable WhatsApp notifications.",
    );
  }
  if (!phoneNumberId || !phoneNumberId.trim()) {
    throw new Error(
      "WHATSAPP_PHONE_NUMBER_ID is not set. Set it in .env to your WhatsApp Business phone number ID from Meta Business Manager.",
    );
  }

  return { accessToken, phoneNumberId, defaultCountryCode };
}

// WhatsApp Cloud API expects the recipient as digits only, with country
// code, no leading "+" (e.g. "923001234567"). Checkout only validates that
// a phone number looks roughly phone-shaped (see components/checkout/
// CheckoutForm.tsx), so it may be stored as a local number like
// "03001234567" or already include a "+" — this normalizes both common
// cases. WHATSAPP_DEFAULT_COUNTRY_CODE lets a future deployment outside
// Pakistan override the assumed country code for locally-formatted numbers.
function toWhatsAppRecipient(rawPhone: string, defaultCountryCode: string): string {
  const digitsAndPlus = rawPhone.replace(/[^\d+]/g, "");
  if (digitsAndPlus.startsWith("+")) {
    return digitsAndPlus.slice(1);
  }
  if (digitsAndPlus.startsWith("0")) {
    return `${defaultCountryCode}${digitsAndPlus.slice(1)}`;
  }
  return digitsAndPlus;
}

async function sendWhatsAppMessage(options: { to: string; body: string }): Promise<void> {
  const config = getWhatsAppConfig();
  const recipient = toWhatsAppRecipient(options.to, config.defaultCountryCode);

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "text",
      text: { body: options.body },
    }),
  });

  if (!response.ok) {
    // Same rule as email.ts: surface only a short message, never the full
    // response body or any header.
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody?.error?.message === "string"
        ? errorBody.error.message
        : response.statusText;
    throw new Error(`WhatsApp API error (${response.status}): ${message}`);
  }
}

// Called after a new order is successfully created (guest or logged-in —
// the recipient always comes from the order's own customerPhone snapshot,
// never a client-supplied number).
export async function sendOrderConfirmationWhatsApp(order: Order): Promise<void> {
  const body = buildOrderConfirmationWhatsAppMessage(order);
  await sendWhatsAppMessage({ to: order.customer.phone, body });
}

// Called after an admin changes an order's status and/or tracking ID.
export async function sendOrderStatusUpdateWhatsApp(order: Order): Promise<void> {
  const body = buildOrderStatusUpdateWhatsAppMessage(order);
  await sendWhatsAppMessage({ to: order.customer.phone, body });
}
