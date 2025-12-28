### 2. REPO BACKEND (`BE-ecommerce`)

```markdown
# ⚙️ Foodies - Backend (Transactional & Payment Engine)

[![Backend Status](https://img.shields.io/badge/API-Active-brightgreen)](https://be-circle-theta.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/Frontend-Source_Code-blue)](https://github.com/hanif411/Ecommerce-food)

> **Reliable Payment Processing.** The core engine handling product management, order processing, and Midtrans payment integration.

---

## 🌟 Executive Summary

Backend ini adalah pusat kontrol transaksi, mulai dari manajemen data produk hingga verifikasi pembayaran otomatis. Dibangun dengan fokus pada integritas data transaksi dan keamanan integrasi pihak ketiga.

- **Automation:** Verifikasi pembayaran otomatis menggunakan Webhooks.
- **Security:** Manajemen transaksi yang aman untuk mencegah *double-payment* atau data yang tidak valid.

---

## 🛠️ Technical Deep Dive (English)

Built to handle robust transactional logic and financial API integrations:
- **Runtime & Framework:** Node.js with Express.js (TypeScript).
- **Payment Gateway:** **Midtrans API** integration for generating transaction tokens and handling callbacks.
- **Automated Workflows:** Implementing **Webhooks** to listen for "settlement" events, ensuring order status updates automatically without manual admin intervention.
- **Database & ORM:** PostgreSQL for persistent data, managed via Prisma ORM for high-level data consistency.

---

## 🚀 Key Features & Logic

1. **Transaction Management:** Generating unique order IDs and handling total price calculations securely on the server-side.
2. **Midtrans Webhook Handler:** Secure endpoint to receive payment notifications and update the database in real-time.
3. **Product & Order API:** Robust CRUD for food menus and comprehensive order logging.
4. **Data Integrity:** Ensuring stock and payment statuses are always synchronized.

---

## 💻 Tech Stack
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Payment:** Midtrans Server SDK

---