# 🏗️ Parserbooks

A full-stack construction and project management app for tracking project financials, labour, materials, maintenance, and invoice entry.

---

## ⚡ Getting Started

1. Install [Docker](https://www.docker.com/products/docker-desktop/).
2. From the project root, run:

   ```bash
   docker compose up --build
   ```

   This starts the database, Adminer, the backend API, and the frontend.

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

### 🤖 AI-Assisted Entry
* **Invoice Scanner** — upload an invoice PDF and the backend extracts its text and sends it to Google Gemini to pull out supplier, date, invoice number, and line items, ready to drop into the materials register.
* **Excel Ingestion (early)** — uploading a Project Details spreadsheet on the Import from Excel page parses every cell and sends it to Gemini to extract project name, client, contract amounts, actual costs, and profit/margin. This currently logs the extracted result to the console rather than saving it; Materials, Labour, and Variation uploads don't parse yet.

### 📅 Operations & Accounting
* **Work Calendar** — daily worker hours and project assignments.
* **Quotations Register** — client quotes, references, statuses, sent-via channels.
* **Request for Quotation (RFQ)** — a page for pasting client emails and drafting a quote from them; currently a static layout, not wired to extraction or the Quotations register yet.
* **Accounts Payable & Expenses** — supplier bills and operating expenses, with GST calculation.
* **Payroll** — employee records, rates, PAYG, super.

---

## 🗺️ Roadmap

* **Full Excel ingestion** — extend the Project Details parsing to Materials, Labour, and Variation sheets, and save the extracted data straight into Project Summary instead of just logging it.
* **Goroutines** — run that ingestion/dissection work concurrently so large spreadsheets don't block the request.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, react-router-dom
* **Backend:** Go, PostgreSQL
* **File storage:** Supabase Storage
* **AI:** Google Gemini
* **Excel parsing:** tealeg/xlsx
* **Infra:** Docker, Docker Compose

---

## 🧭 Not built yet

* Completed Jobs, Customer Invoices, and Xero: no backend routes, dead sidebar links.
* ServiceM8: page exists, no integration logic.
* RFQ email parsing and a variation-document parsing engine.
* Login and user accounts. The app currently runs against a single fixed user.
* Editing. Only employees can be edited after creation; everything else can be added or deleted but not edited.
