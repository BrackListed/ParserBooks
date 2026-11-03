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
* **Excel Ingestion** — on the Import from Excel page:
  * **Project Details** — the spreadsheet is parsed cell by cell and sent to Gemini, which returns project name, client, address, dates, contract amounts, actual costs, and profit/margin as JSON. The backend encodes it into a Go struct and sends it to the frontend, where it fills in the project preview form. Dates are converted to `yyyy-mm-dd` so the date inputs can show them.
  * **Materials** — each row is read with its cells kept together, then the rows are split into 15 chunks and sent to Gemini at the same time using goroutines. Gemini returns product code, date, supplier, invoice, quantity, description, unit price, total, and whether the total includes GST. The backend collects the results and sends them to the frontend, which currently logs them to the console.
  * Labour and Variation uploads don't parse yet.

---

## ⏱️ Milestone: Materials ingestion 80% faster

Materials ingestion used to send the whole sheet to Gemini in one request, and a single test sheet took **35–38 seconds** to come back.

It now works like this:

1. **Rows are kept whole.** Each row's cells are joined and marked with a `*` separator, so a chunk never cuts a row in half.
2. **The sheet is split into 15 chunks**, one for each request Gemini's free tier allows per minute.
3. **Each chunk runs in its own goroutine.** The requests are staggered 150 ms apart so they don't all land at once, and a `sync.WaitGroup` waits for all of them before the combined results are sent to the frontend.

On the same sheet, the wait went from **35s to 7s, an 80% decrease**.

**Trade-off:** one upload uses up the free tier's 15 requests for that minute. The plan is to make users wait about a minute between uploads so Gemini has time to reset.

### 📅 Operations & Accounting
* **Work Calendar** — daily worker hours and project assignments.
* **Quotations Register** — client quotes, references, statuses, sent-via channels.
* **Request for Quotation (RFQ)** — a page for pasting client emails and drafting a quote from them; currently a static layout, not wired to extraction or the Quotations register yet.
* **Accounts Payable & Expenses** — supplier bills and operating expenses, with GST calculation.
* **Payroll** — employee records, rates, PAYG, super.

---

## 🗺️ Roadmap

* **Display materials** — show the extracted materials rows on the Import from Excel page instead of logging them.
* **Save to Project Summary** — write the extracted project and materials data into Postgres.
* **Labour and Variation ingestion** — reuse the chunked goroutine pipeline for the remaining sheets.
* **Upload cooldown** — stop users from uploading again within a minute so the app stays under Gemini's 15 requests per minute.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, react-router-dom
* **Backend:** Go (goroutines + `sync.WaitGroup` for concurrent Gemini requests), PostgreSQL
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
