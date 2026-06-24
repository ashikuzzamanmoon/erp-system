# 🚀 Code Bondhu Mini ERP System

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
* **The "Wow" Factor (UI/UX):** 
  * Premium, responsive design system.
  * Native **Dark Mode** toggle integrated with system preferences.
  * Space-saving **Collapsible Sidebar** inspired by modern desktop applications.

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

## 🤖 Prompting Workflow Summary

My approach to utilizing AI for this assessment was highly iterative, utilizing the AI as a true "Pair Programmer" and "Tech Lead". Rather than attempting zero-shot generation of the entire application, the prompts were broken down into modular, domain-specific tasks.

1. **Foundation & Scaffolding:** Initial prompts were focused on configuring the boilerplate (Vite + React + TS), setting up the Tailwind/Shadcn design tokens, and establishing the Supabase connection.
2. **Schema & Triggers:** I utilized AI to generate strict SQL schemas, including the complex PostgreSQL trigger functions required to handle the automated stock deductions and additions dynamically.
3. **Component Iteration:** Prompts were scoped to individual modules (e.g., *"Build a CRUD interface for Suppliers using Shadcn DataTables"*). This ensured that code context windows were kept minimal and the AI produced highly accurate code.
4. **Refinement & Polish:** Once core requirements were met, I used conversational prompting to audit the codebase for missing edge cases (missing dashboard metrics, fast-refresh bugs, or missing RLS policies). Finally, I prompted the AI to implement premium UI features, such as Recharts data visualization and a fluid Dark Mode toggle, elevating the project to production-grade quality.

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
