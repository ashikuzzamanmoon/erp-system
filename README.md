# 🚀 ERP System

An ultra-modern, fully functional Enterprise Resource Planning (ERP) dashboard. 

This application demonstrates a deep understanding of modern web architecture and production-grade UI/UX design.

---

## 🌟 Key Features

* **Secure Authentication:** Complete Login and Registration flow with Protected Routes powered by Supabase Auth.
* **Dynamic Dashboard:** Real-time metrics tracking Revenue, Cost, active Customers, Suppliers, and Inventory. Features responsive Data Visualizations via `recharts`.
* **Management Modules (Full CRUD):** Comprehensive interfaces for managing Products, Customers, and Suppliers with Shadcn's robust DataTables.
* **Automated Inventory Tracking:** 
  * **Purchases:** Automatic stock increments via native PostgreSQL triggers.
  * **Sales:** Automatic stock deductions upon successful sale entries.
* **Printable Invoices:** Beautiful, automatically generated point-of-sale invoices ready for printing or saving as PDF.
* **Reporting & Analytics:** Tabular breakdowns of Inventory, Sales, Purchases, Customers, and Suppliers with one-click **CSV Exports**.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 + Vite
* **Language:** TypeScript (Strict Mode)
* **Styling:** Tailwind CSS + Shadcn UI
* **State & Data Fetching:** `@tanstack/react-query`
* **Routing:** React Router v7
* **Backend as a Service:** Supabase (PostgreSQL, Auth, Storage)

---

## 🏛️ Architecture Explanation

The Mini ERP System is designed with a modern, decoupled client-server architecture. 

**Data Flow & State Management**
Client-side data fetching, caching, and synchronization are handled by `@tanstack/react-query`, which ensures that the UI remains fast and reduces redundant network requests. Global authentication state is managed via a custom React Context (`AuthContext`).

**Database & Security**
The database is structured relationally using PostgreSQL (via Supabase). To ensure data integrity at the database level, inventory management (Stock Auto Update/Deduction) is handled via native PostgreSQL `AFTER INSERT` triggers rather than relying on the frontend. Security is tightly enforced through Supabase Row Level Security (RLS) policies, ensuring that authenticated operations are secure.

---


## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* A Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erp-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the Database**
   Navigate to the Supabase SQL Editor and execute the following scripts (located in the `supabase/` directory):
   * `schema.sql`
   * `triggers.sql`
   * `policies.sql`

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

---
