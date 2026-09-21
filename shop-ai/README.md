# 🛍️ Shop AI — AI-Powered E-Commerce Platform

A modern, responsive e-commerce platform designed to provide a polished online shopping experience with an AI-powered shopping experience planned as part of the project's later development stages.

> **Portfolio Project:** Built to demonstrate modern full-stack web development, scalable component architecture, e-commerce functionality, and AI integration.

---

## 🚀 Project Overview

**Shop AI** is a modern e-commerce platform built with **Next.js, React, TypeScript, and Tailwind CSS**.

The project is being developed progressively, starting with a polished customer-facing storefront and expanding toward a complete e-commerce platform with product management, authentication, orders, and AI-powered shopping features.

The current implementation focuses on the **Customer Interface and Storefront experience**.

---

## ✨ Current Features

### 🏠 Customer Storefront

* Modern responsive homepage
* Hero section
* Featured products
* New arrivals
* Sale section
* Product categories
* Promotional sections
* Trust/service features
* Newsletter section
* Responsive navigation and footer

### 🛒 Shopping Experience

* Product catalog
* Product cards
* Product categories
* Shop page
* Cart interface
* Wishlist interface
* Product browsing experience
* Dummy product catalog for development and testing

### 👤 Customer Account Interface

* Login page
* Registration page
* Account-related UI
* Wishlist interface

### 📱 Responsive Design

The interface is designed to provide a consistent experience across:

* Desktop
* Tablet
* Mobile

---

## 🧩 Project Structure

The project uses a reusable component-based architecture.

```text
shop-ai/
├── app/
│   ├── about/
│   ├── admin/               # Admin Dashboard (protected)
│   │   ├── login/           # Admin sign-in page
│   │   └── (dashboard)/     # Everything behind admin auth
│   │       ├── layout.tsx   # Sidebar shell + session check
│   │       ├── page.tsx     # Overview / stats
│   │       ├── products/    # List, add, edit
│   │       └── orders/      # List + status/tracking updates
│   ├── api/
│   │   └── admin/           # Admin login/logout routes
│   ├── cart/
│   ├── categories/
│   ├── checkout/
│   ├── login/
│   ├── order-confirmation/
│   ├── product/[slug]/
│   ├── register/
│   ├── sale/
│   ├── shop/
│   ├── wishlist/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── account/
│   ├── admin/               # Admin dashboard UI (sidebar, tables, forms)
│   ├── brand/
│   ├── cart/
│   ├── checkout/
│   ├── home/
│   ├── layout/
│   ├── product/
│   ├── shop/
│   └── ui/
│
├── context/
│   └── StoreProvider.tsx   # Client-side cart/wishlist (localStorage) —
│                           # fetches the product catalog from /api/products
│
├── lib/
│   ├── admin/
│   │   └── stats.ts         # Dashboard statistics (real DB queries)
│   ├── auth/
│   │   ├── password.ts      # bcrypt hashing
│   │   ├── session.ts       # Signed session tokens (jose)
│   │   └── dal.ts           # Session checks for pages & API routes
│   ├── db/
│   │   ├── client.ts        # Drizzle/Postgres connection (server-only)
│   │   ├── schema.ts        # Table definitions
│   │   ├── admin.ts         # Admin user queries
│   │   ├── seed-data.ts     # The original 18 products / 6 categories
│   │   ├── seed.ts          # Seed script (npm run db:seed)
│   │   ├── seed-admin.ts    # Admin account seed script (npm run db:seed-admin)
│   │   ├── migrate.ts       # Migration runner (npm run db:migrate)
│   │   └── orders.ts        # Server-side order repository
│   ├── categories.ts       # DB-backed category functions (server-only)
│   ├── category-labels.ts  # Client-safe category label map
│   ├── cn.ts
│   ├── format.ts
│   ├── nav.ts
│   ├── orders.ts           # Client-safe "place order" API wrapper
│   ├── products.ts         # DB-backed product functions (server-only)
│   ├── shipping.ts
│   └── types.ts
│
├── drizzle/                 # Generated SQL migrations (committed)
├── drizzle.config.ts
├── proxy.ts                 # Optimistic /admin route protection
├── .env.example
│
├── public/
│   └── brand/
│
└── package.json
```

---

## 🛠️ Tech Stack

* **Next.js** (App Router)
* **React**
* **TypeScript**
* **Tailwind CSS**
* **PostgreSQL** — relational database for products, categories, orders, and admin accounts
* **Drizzle ORM** — type-safe schema, queries, and migrations
* **bcrypt** + signed session cookies (**jose**) — admin authentication
* **React Context** — client-side cart/wishlist state
* **Lucide / custom UI icons**
* **Git & GitHub**

---

## 🗄️ Backend & Database

Products, categories, and orders are persisted in **PostgreSQL** via **Drizzle ORM**. The cart and wishlist remain client-side (`localStorage`), unchanged from earlier stages.

**Why Postgres + Drizzle:** a relational database is a natural fit for products/categories/orders' fixed, related shape, and both are widely supported by managed hosts (Neon, Supabase, Vercel Postgres, Railway, RDS) with a straightforward path from local development to production. Drizzle was chosen over Prisma for this project specifically because it has no separate native "engine" binary to download — it talks to Postgres directly through the `postgres` driver — which also keeps the toolchain lighter for serverless/edge deployment.

### Setup

1. Provision a Postgres database (locally, or with a managed provider).
2. Copy the environment template and fill in your connection string:
   ```bash
   cp .env.example .env
   # then edit .env and set DATABASE_URL
   ```
3. Install dependencies, then generate/apply the schema and seed the original catalog:
   ```bash
   npm install
   npm run db:generate   # generate SQL migrations from lib/db/schema.ts (only needed after a schema change)
   npm run db:migrate    # apply migrations to your database
   npm run db:seed       # load the 18 products / 6 categories
   npm run db:seed-admin # create your admin account — see "Admin Dashboard & Authentication" below
   ```
4. `npm run dev` as usual.

`npm run db:studio` opens Drizzle Studio, a local GUI for browsing/editing the database.

### Data flow

* Server Components / route handlers read and write the database directly through `lib/products.ts`, `lib/categories.ts`, and `lib/db/orders.ts` — no data lives in hardcoded arrays anymore.
* The client-side cart (`context/StoreProvider.tsx`) can't query the database directly, so it fetches the catalog once from `GET /api/products` and caches it in memory.
* Checkout (`components/checkout/CheckoutForm.tsx`) submits to `POST /api/orders`, which persists the order and its line items in a single transaction. The confirmation page reads the order back from the database by order number (`?order=...`), rather than from `localStorage`.

### API routes

`/api/products`, `/api/products/[id]`, `/api/categories`, `/api/categories/[slug]`, `/api/orders`, `/api/orders/[orderNumber]` — the `GET` endpoints used by the storefront (product/category browsing, catalog loading) remain public. Every write operation (create/update/delete on products and categories, listing all orders, and updating an order's status/tracking) now requires an authenticated admin session, enforced on the server — see **Admin Dashboard & Authentication** below.

---

## 🔐 Admin Dashboard & Authentication

Stage 4B adds a real, database-backed admin area for managing the store.

### How it works

* **Passwords** are hashed with `bcrypt` before they ever reach the database — the plaintext password is never stored, logged, or sent back to the browser.
* **Sessions** are signed, `httpOnly` cookies (following the pattern in Next.js's own App Router authentication guide). Signing in issues a 7-day session; logging out clears the cookie in that browser.
* **Every admin page and every write API route checks the session on the server.** The UI also hides admin controls from logged-out visitors, but that's a convenience, not the security boundary — hitting the API routes directly without a valid session returns `401 Unauthorized`, even if you already know a product or order ID.
* Unauthenticated visits to any `/admin/*` page redirect to `/admin/login`. Signing in redirects back to the dashboard.

**Honest limitation:** sessions are stateless signed tokens, not rows in a database. That keeps the implementation simple and is a normal, secure approach for a project at this stage, but it means logging out invalidates the session only in the browser you logged out from — there's no server-side "kill switch" for a token before it naturally expires. A production system handling sensitive data at scale would typically add a server-side session store or short-lived tokens with refresh, on top of what's here.

### Setting up your admin account

There is no public sign-up for the admin area — you create the first (and, in this stage, only) admin account from environment variables:

```bash
cp .env.example .env
# edit .env and set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
npm run db:seed-admin
```

`SESSION_SECRET` should be a long random string (e.g. the output of `openssl rand -base64 32`) — it's what signs and verifies session cookies. `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME` are only read by this one script, never shown in any UI, and re-running the script after changing `ADMIN_PASSWORD` updates that account's password. If any of these variables are missing, the script stops with a clear message telling you what to set.

Then sign in at **`/admin/login`** with that email and password.

### What the dashboard covers

* **Overview** (`/admin`) — total products, in-stock vs. sold-out counts, products currently on sale, total orders, and pending orders — all computed live from the database, not hardcoded.
* **Products** (`/admin/products`) — search and filter the catalog, add a product, edit any field, toggle sold-out status with one click, or delete a product (with a confirmation step). Stock, discount, and sold-out changes are reflected on the storefront immediately, since both read from the same database.
  * Sold-out status stays coherent with stock: a product with 0 stock always shows as sold out, regardless of any manual flag. The manual "force sold out" toggle only matters while stock remains above zero (e.g. temporarily pulling a product from sale).
  * The product form only lets you choose from categories that already exist — this stage doesn't add a separate category-management screen, in keeping with the project's existing category system.
* **Orders** (`/admin/orders`) — view every order placed through checkout (customer details, shipping address, items, payment method) and update its status or tracking ID. This reuses the existing order database and checkout flow entirely; nothing about the customer-facing checkout changed.

### Known limitations, stated plainly

* There's currently no UI for creating additional admin accounts or roles beyond the one seeded via `db:seed-admin` — every admin shares the same `"admin"` role.
* The admin product image field accepts URLs from `images.unsplash.com` only, matching the image host this project is already configured to allow (see `next.config.ts`). Fixing the handful of broken seed-data image URLs was out of scope for this stage.
* As noted above, logging out clears the session cookie but doesn't revoke the underlying token server-side.

---

## 📈 Development Roadmap

The project is being developed in multiple stages.

### Stage 1 — Customer Interface ✅

Completed.

Includes:

* Customer storefront
* Homepage
* Navigation
* Product catalog foundation
* Categories
* Shop page
* Cart interface
* Wishlist interface
* Login/register interface
* Responsive UI
* Reusable components
* Dummy product data

### Stage 2 — Advanced Product & Catalog Experience 🔄

Planned:

* Product detail pages
* Improved product data structure
* Product image galleries
* Search
* Filtering
* Sorting
* Product variants
* Stock/availability states
* Related products
* Improved catalog experience

### Stage 3 — Admin & Product Management ✅

Completed (Stage 4B):

* Admin dashboard
* Product management (create, edit, delete)
* Inventory management (stock, sold-out status)
* Order management (view orders, update status/tracking)
* Admin authentication protecting all of the above

Not in this stage: customer management and analytics beyond the dashboard's live product/order counts — see **Admin Dashboard & Authentication** above for exactly what's covered.

### Stage 4 — Customer Authentication & Accounts

Planned. (Admin authentication is complete — see Stage 3 above. This stage is about real customer sign-in, replacing the current placeholder `/login` and `/register` pages.)

* Customer authentication
* Protected customer routes
* Persistent customer accounts
* Account management

### Stage 5 — Backend, Orders & Checkout 🔄

* Database integration ✅ (PostgreSQL + Drizzle ORM)
* Product/category persistence ✅
* Order system (server-side persistence) ✅
* Checkout flow ✅
* Backend APIs (products/categories/orders) ✅
* Admin authentication & authorization ✅
* Admin dashboard UI ✅
* Payment integration — planned

### Stage 6 — AI Shopping Features

Planned:

* AI shopping assistant
* AI product recommendations
* Natural-language product discovery
* Personalized shopping experience
* AI-powered product assistance

### Stage 7 — Production & Portfolio Polish

Planned:

* Full testing
* Performance optimization
* Final responsive refinements
* Deployment
* Screenshots/demo
* Portfolio presentation
* Final documentation

---

## 🎯 Project Goals

Shop AI is being developed to demonstrate practical skills in:

* Modern React development
* Next.js application architecture
* TypeScript
* Responsive UI development
* Component-based design
* E-commerce application development
* State management
* API/backend integration
* Database integration
* AI application development
* Git/GitHub workflow

---

## 💼 Portfolio & Client Use

This project is being developed as a portfolio-quality e-commerce application to demonstrate the ability to build modern web experiences for potential clients.

Potential applications include:

* E-commerce websites
* Online stores
* Product catalogs
* Custom shopping platforms
* Business websites
* AI-enhanced web applications

---

## 📌 Current Status

**Stage 1 (Customer Interface), product detail pages, cart/checkout, the backend/database foundation, and the Admin Dashboard with admin authentication are complete.**

The storefront reads products, categories, and orders from a real PostgreSQL database instead of hardcoded arrays or `localStorage`. Store staff can sign in at `/admin/login` to manage products, inventory, discounts, and orders through a dedicated dashboard, with every write operation enforced server-side. See **Backend & Database** and **Admin Dashboard & Authentication** above for setup and architecture. Real customer authentication (as opposed to admin authentication) is the next planned stage.

---

## 👩‍💻 Development

Built as a portfolio project using modern web development technologies and an AI-assisted development workflow.

**Developer:** Zunaira Siddique

---

## 📄 License

This project is developed for portfolio and educational purposes.
