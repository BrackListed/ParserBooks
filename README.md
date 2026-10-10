# 🏗️ Parserbooks

A full-stack construction and project management app (Go + React/Vite) for tracking project financials, labour, materials, maintenance, and invoice entry.

---

## 🚀 Features

### 📊 Project Management
* **Project Summary:** Tracks projects, materials, and labour from Postgres, with contract values, variations, material/labour costs, and profit/margin.
* **Project Summary Entry:** Create projects, add labour entries, add material entries.
* **Maintenance Schedule:** Add, view, and delete property maintenance records.

### 🤖 Invoice Scanning
* **AI Invoice Scanner:** Upload an invoice PDF and the backend extracts its text and sends it to Google Gemini to pull out supplier, date, invoice number, and line items, ready to drop into the materials register.

### 📅 Operations & Accounting
* **Work Calendar:** Daily worker hours and project assignments.
* **Quotations Register:** Client quotes, references, statuses, sent-via channels.
* **Accounts Payable & Expenses:** Supplier bills and operating expenses, with GST calculation.
* **Payroll:** Employee records, rates, PAYG, super.

---

## 🧭 Not built yet

* Completed Jobs, Request for Quotation (RFQ), Customer Invoices, Import Costs from Excel, and Xero: no backend routes, dead sidebar links.
* ServiceM8: page exists, no integration logic.
* Excel import/export.
* RFQ parsing and a variation-document parsing engine.
* Login and user accounts. The app currently runs against a single fixed user.
* Editing. Only employees can be edited after creation; everything else can be added or deleted but not edited.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, react-router-dom
* **Backend:** Go, PostgreSQL
* **File storage:** Supabase Storage
* **AI:** Google Gemini
