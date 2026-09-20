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
│   ├── api/                # Route handlers: products, categories, orders
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
│   ├── db/
│   │   ├── client.ts       # Drizzle/Postgres connection (server-only)
│   │   ├── schema.ts       # Table definitions
│   │   ├── seed-data.ts    # The original 18 products / 6 categories
│   │   ├── seed.ts         # Seed script (npm run db:seed)
│   │   ├── migrate.ts      # Migration runner (npm run db:migrate)
│   │   └── orders.ts       # Server-side order repository
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
* **PostgreSQL** — relational database for products, categories, and orders
* **Drizzle ORM** — type-safe schema, queries, and migrations
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
   ```
4. `npm run dev` as usual.

`npm run db:studio` opens Drizzle Studio, a local GUI for browsing/editing the database.

### Data flow

* Server Components / route handlers read and write the database directly through `lib/products.ts`, `lib/categories.ts`, and `lib/db/orders.ts` — no data lives in hardcoded arrays anymore.
* The client-side cart (`context/StoreProvider.tsx`) can't query the database directly, so it fetches the catalog once from `GET /api/products` and caches it in memory.
* Checkout (`components/checkout/CheckoutForm.tsx`) submits to `POST /api/orders`, which persists the order and its line items in a single transaction. The confirmation page reads the order back from the database by order number (`?order=...`), rather than from `localStorage`.

### API routes

`/api/products`, `/api/products/[id]`, `/api/categories`, `/api/categories/[slug]`, `/api/orders`, `/api/orders/[orderNumber]` — read endpoints are used by the storefront today; the write endpoints (create/update/delete) are foundation for the upcoming Admin Dashboard and are **not yet authentication-protected**.

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

### Stage 3 — Admin & Product Management

Planned:

* Admin dashboard
* Product management
* Inventory management
* Order management
* Customer management
* Basic analytics

### Stage 4 — Authentication & Users

Planned:

* User authentication
* Protected routes
* Customer accounts
* Persistent user data
* Account management

### Stage 5 — Backend, Orders & Checkout 🔄

* Database integration ✅ (PostgreSQL + Drizzle ORM)
* Product/category persistence ✅
* Order system (server-side persistence) ✅
* Checkout flow ✅
* Backend APIs (products/categories/orders foundation) ✅
* Admin authentication & authorization — planned
* Admin dashboard UI — planned
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

**Stage 1 (Customer Interface), product detail pages, cart/checkout, and the backend/database foundation are complete.**

The storefront reads products, categories, and orders from a real PostgreSQL database instead of hardcoded arrays or `localStorage`. See **Backend & Database** above for setup and architecture. Admin authentication and the Admin Dashboard UI are the next planned stage.

---

## 👩‍💻 Development

Built as a portfolio project using modern web development technologies and an AI-assisted development workflow.

**Developer:** Zunaira Siddique

---

## 📄 License

This project is developed for portfolio and educational purposes.
