# 🏗️ Parserbooks

A full-stack construction and project management app for tracking project financials, labour, materials, maintenance, and invoice entry.

---

## ⚡ Getting Started

The whole stack runs in Docker, database included.

1. Install [Docker](https://www.docker.com/products/docker-desktop/).
2. From the project root, run:

   ```bash
   docker compose up --build
   ```

That starts the frontend, backend, and database together.

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Postgres | localhost:5432 |
| Adminer (DB UI) | http://localhost:8081 |

---

## 🚀 Features

### 📊 Project Management
* **Project Summary** — tracks projects, materials, and labour from Postgres, with contract values, variations, material/labour costs, and profit/margin.
* **Project Summary Entry** — create projects, add labour entries, add material entries.
* **Maintenance Schedule** — add, view, and delete property maintenance records.

### 🤖 Invoice Scanning
* **AI Invoice Scanner** — upload an invoice PDF and the backend extracts its text and sends it to Google Gemini to pull out supplier, date, invoice number, and line items, ready to drop into the materials register.

### 📅 Operations & Accounting
* **Work Calendar** — daily worker hours and project assignments.
* **Quotations Register** — client quotes, references, statuses, sent-via channels.
* **Accounts Payable & Expenses** — supplier bills and operating expenses, with GST calculation.
* **Payroll** — employee records, rates, PAYG, super.

---

## 🧭 Not built yet

* Completed Jobs, Request for Quotation (RFQ), Customer Invoices, Import Costs from Excel, and Xero: no backend routes, dead sidebar links.
* ServiceM8: page exists, no integration logic.
* Excel import/export.
* RFQ parsing and a variation-document parsing engine.
* Login and user accounts. The app currently runs against a single fixed user.
* Editing. Only employees can be edited after creation; everything else can be added or deleted but not edited.

---

## 🗺️ Roadmap

* **Excel ingestion** — automatically ingest uploaded Excel files, dissect them, and populate Project Summary without manual mapping.
* **RabbitMQ & Kafka** — queue and stream that ingestion/dissection work so large spreadsheets don't block the request.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, react-router-dom
* **Backend:** Go, PostgreSQL
* **File storage:** Supabase Storage
* **AI:** Google Gemini
* **Infra:** Docker, Docker Compose
