import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Mirrors lib/types.ts's Category shape. `slug` is the natural key the rest
// of the app already uses (CategorySlug), so it stays unique + human-readable
// instead of switching everything over to a numeric foreign key.
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Mirrors lib/types.ts's Product shape. `id` stays a text primary key (e.g.
// "p-embroidered-lawn-suit") so existing cart/wishlist ids and URLs keep
// working unchanged. `category` stores the category slug directly rather
// than a numeric FK, for the same reason as above.
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category")
    .notNull()
    .references(() => categories.slug, { onDelete: "restrict" }),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  discount: integer("discount"),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  rating: doublePrecision("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  stock: integer("stock").notNull(),
  isNew: boolean("is_new").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isSoldOut: boolean("is_sold_out").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Stage 5A foundation only: the table shape for real customer accounts.
// No signup/login/session logic is wired up yet — this stage is schema
// only, matching how adminUsers was introduced as a foundation in Stage 4B
// before its auth logic followed in a later stage.
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// One row per placed order. Customer/shipping fields stay flattened here
// (rather than being replaced by a join to `customers`) so an order keeps
// its own permanent snapshot of who it was placed for — see the customerId
// comment below for why both exist side by side.
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  // Nullable: orders placed before customer accounts existed have no
  // customer row, and guest checkout (no account) must keep working going
  // forward too. Kept alongside the existing flattened customerFullName/
  // customerEmail/customerPhone fields below rather than replacing them —
  // those remain the order's permanent snapshot of who it was placed for,
  // independent of whether the account behind customerId is later renamed
  // or deleted.
  customerId: integer("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),

  customerFullName: text("customer_full_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),

  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingArea: text("shipping_area").notNull(),
  shippingPostalCode: text("shipping_postal_code").notNull(),

  paymentMethod: text("payment_method").notNull(), // "cod" | "bank-transfer"
  status: text("status").notNull().default("pending"), // pending | processing | fulfilled | cancelled
  trackingId: text("tracking_id"),

  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
});

// One row per line item. Product name/image/price are snapshotted at order
// time (matching the existing OrderItem type) so an order's receipt never
// changes even if the product is later edited, discontinued, or deleted —
// hence productId has no hard foreign key / cascade.
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});

// Foundation only for Stage 4B's real admin auth. No login/session logic is
// wired up yet in this stage — just the persistent shape it will need.
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
