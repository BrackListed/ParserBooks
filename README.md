# 🏗️ Parserbooks 
A robust, full-stack construction and project management application built to streamline project financials, labour tracking, material management, maintenance schedules, and AI-powered document parsing.

---

## 🚀 Key Features

### 📊 Project Management & Financials
* **Project Summary:** Real-time tracking of active projects, contract values, variations, material costs, labour costs, profit, and margins (factoring in a standard 10% GST).
* **Interactive Modal View:** Deep-dive into project economics via dedicated tabs:
  * **Cost Summary:** Aggregated totals for materials, variations, and labour alongside a comprehensive financial breakdown.
  * **Materials Tab:** Detailed logs including product codes, suppliers, invoices, descriptions, quantities, ex-GST/GST amounts, and markup-adjusted totals.
  * **Labour Tab:** Worker logs featuring dates, types, rates, hours, totals, and notes.
* **Completed Jobs & Maintenance:** Easily archive completed projects with one-click restoration, alongside comprehensive property maintenance tracking registers.
* **Professional Excel Export:** Generate multi-sheet XML-formatted workbooks containing all projects with custom styling and color coding.

### 🤖 AI-Powered Automation (Groq)
* **AI Invoice Scanner:** Automatically extract material line items from supplier invoices (such as Reece or Samios) regardless of layout.
* **Smart Excel Importers:** Avoid payload timeouts on large datasets by uploading and mapping Project Details, Materials, Labour, and Variations independently.
* **Variation Parsing Engine:** Automatically splits uploaded variation documents, isolating material and labour blocks for independent Groq analysis before saving.
* **Request for Quotation (RFQ) Parser:** Extracts quote details into structured JSON ready to save straight to quotation history.

### 📅 Operations & Accounting
* **Work Calendar:** Track daily worker hours, project assignments, and types against hardcoded rates.
* **Quotations Register:** Monitor client quotes, references, statuses, and sent-via channels.
* **Accounts Payable & Expenses:** Full CRUD registers to monitor supplier bills, due dates, priorities, categories, and payment statuses.

---

## 🔒 Authentication & Access Control

* **Clerk Authentication:** Secure sign-in and user management.
* **Dual-Role System:** New accounts default to standard **User** access. Administrative privileges require manual promotion by an **Admin**.

---

## 🛠️ Tech Stack & Deployment

* **Frontend:** React, Tailwind CSS
* **Backend:** Golang, RabbitMQ, Apache Kafka
* **AI Integration:** Groq(GPT OSS 20B)
* **Authentication:** Clerk

---

## Note: This is not a finished product. Only the outline of the features and the things to be used.
