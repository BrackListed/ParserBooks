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
  * **Project Details** — the spreadsheet is parsed cell by cell and sent to Gemini, which returns project name, client, address, dates, contract amounts, actual costs, and profit/margin as JSON. The backend encodes it into a Go struct and sends it to the frontend, where it fills in the project preview form. Dates are converted to `yyyy-mm-dd` so the date inputs can show them. Every field in the form can be edited before saving.
  * **Materials** — each row is read with its cells kept together, then the rows are split into 15 chunks and sent to Gemini at the same time using goroutines. Gemini returns product code, date, supplier, invoice, quantity, description, unit price, total, whether the total includes GST, and the sheet's markup. The first and last rows of the sheet are sent along as context only, so Gemini can find the markup without turning those rows into items.
    * The rows appear in a table with Ex GST, Net Ex GST, GST, Total, and Total With Markup worked out per item, plus cards for Total Ex GST, Total Inc GST, and Total Inc GST With Markup.
    * The table shows 10 items per page, with Prev/Next buttons and a page number box, and can be searched by description.
    * Date, product code, supplier, invoice, description, quantity, and markup can be edited in place. The cells look like plain text, and the worked-out columns and totals update as you edit.
  * **Labour** — the labour sheet goes through the same pipeline as Materials: rows are kept whole, split into 15 chunks, and sent to Gemini in parallel goroutines. Gemini returns date, worker, rate, hours, total, type, and notes for each row, using a labour-specific prompt with the same strict rules (no guessing between columns, `""` or `0` for missing fields, never null).
    * The rows appear in a table that shows 10 items per page, with the same page controls as Materials.
    * A Total card adds up every row's total, so it matches the sheet.
    * Every field can be edited in place, and Type is a dropdown of Normal or Overtime.
  * **Normal and variation uploads** — the Materials and Labour upload cards each have a Normal / Variation toggle. Its setting is sent with the file, and the backend tags every item from that upload as variation or not. Materials and labour uploaded as variation also show up under the Variation tab:
    * **Variation materials** get the same three totals cards as Materials (Total Ex GST, Total Inc GST, Total Inc GST With Markup), can be searched by description, and show Ex GST, GST, and Total for each item.
    * **Variation labour** gets the same Total card as Labour.
  * **Upload cooldown** — while a materials or labour file is processing, its card shows a loading spinner. Once the results arrive, every upload card is locked for 60 seconds behind a countdown bar, so the next upload doesn't go over Gemini's 15 requests per minute.
  * **Exact math** — totals are worked out from unrounded values and only rounded to 2 decimals when shown on screen, so they stay as close to the spreadsheet as possible. Expenses are stored unrounded for the same reason.

### 📅 Operations & Accounting
* **Work Calendar** — daily worker hours and project assignments.
* **Quotations Register** — client quotes, references, statuses, sent-via channels.
* **Request for Quotation (RFQ)** — a page for pasting client emails and drafting a quote from them; currently a static layout, not wired to extraction or the Quotations register yet.
* **Accounts Payable & Expenses** — supplier bills and operating expenses, with GST calculation.
* **Payroll** — employee records, rates, PAYG, super.

---

## ⏱️ Milestone: Materials ingestion 80% faster

Materials ingestion used to send the whole sheet to Gemini in one request, and a single test sheet took **35–38 seconds** to come back.

| | Before | After |
|---|---|---|
| Requests to Gemini | 1 | 15, in parallel |
| Wait on the same test sheet | **35–38s** | **7s** |

It now works like this:

```mermaid
flowchart LR
    A["📄 .xlsx upload"] --> B["Read every cell<br/>Row: r Col: c Value: v"]
    B --> C["Join each row's cells<br/>and end it with *"]
    C --> D["Split rows into<br/>15 chunks"]
    D --> G1["goroutine 1<br/>+150 ms"]
    D --> G2["goroutine 2<br/>+300 ms"]
    D --> G3["…"]
    D --> G15["goroutine 15<br/>+2.25 s"]
    G1 --> AI["🤖 Gemini<br/>one request per chunk"]
    G2 --> AI
    G3 --> AI
    G15 --> AI
    AI --> W["sync.WaitGroup<br/>waits for all 15"]
    W --> J["Combined JSON"]
    J --> F["⚛️ Frontend tables<br/>and totals"]
```

1. **Rows are kept whole.** Each row's cells are joined and marked with a `*` separator, so a chunk never cuts a row in half.
2. **The sheet is split into 15 chunks**, one for each request Gemini's free tier allows per minute.
3. **Each chunk runs in its own goroutine.** The requests are staggered 150 ms apart so they don't all land at once, and a `sync.WaitGroup` waits for all of them before the combined results are sent to the frontend.

On the same sheet, the wait went from **35s to 7s, an 80% decrease**.

**Trade-off:** one upload uses up the free tier's 15 requests for that minute, so uploads are locked for 60 seconds afterwards while Gemini resets.

Labour ingestion was built on the same pipeline, so labour sheets get the same speed-up.

---

## 🔀 How an upload flows

Every materials or labour upload follows the same path, from the Normal / Variation toggle to the 60-second lock:

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Import from Excel page
    participant BE as Go backend
    participant AI as Gemini

    U->>FE: Pick Normal or Variation, then upload a sheet
    FE->>FE: Show loading spinner on the card
    FE->>BE: POST /analyze/materials or /analyze/labour<br/>(file + type = normal or variation)
    BE->>BE: Read cells, keep rows whole, split into 15 chunks
    par 15 goroutines, 150 ms apart
        BE->>AI: Chunk + first and last rows as context
        AI-->>BE: JSON items
    end
    BE->>BE: Tag every item with isVariation
    BE-->>FE: All items combined
    FE->>FE: Fill tables, work out totals
    FE->>FE: Lock every upload card for 60 s
    Note over FE,AI: Gemini's free tier allows 15 requests per minute,<br/>so the lock lets it reset before the next upload
```

Once the items arrive, the `isVariation` tag decides which tabs they show up in:

```mermaid
flowchart TD
    M["Materials items"] --> MT["Materials tab<br/>all items · 3 totals cards<br/>search · 10 per page · editable"]
    M -- "isVariation" --> VM["Variation → Materials<br/>3 totals cards · search"]
    L["Labour items"] --> LT["Labour tab<br/>all items · Total card<br/>10 per page · editable"]
    L -- "isVariation" --> VL["Variation → Labour<br/>Total card"]
```

---

## 🗺️ Roadmap

* **Save to Project Summary** — write the extracted project, materials, and labour data into Postgres.
* **Variation tab** — add editing and 10-per-page paging to the variation tables, and decide whether variation items should also stay in the main Materials and Labour tabs.

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
* Editing saved records. Only employees can be edited after creation; everything else can be added or deleted but not edited. (Imported project, materials, and labour data can be edited on the Import from Excel page before it's saved.)
