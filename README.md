# Parserbooks

A construction and project management app for tracking project financials, labour, materials, maintenance, and invoice entry. Go backend, React/Vite frontend.

## Features

**Project Management**
- Project Summary — tracks projects, materials, and labour with contract values, variations, costs, and profit/margin.
- Project Summary Entry — create projects, add labour entries, add material entries.
- Maintenance Schedule — add, view, and delete maintenance records.

**Invoice Scanning**
- Upload an invoice PDF and the backend pulls supplier, date, invoice number, and line items out of it using Google Gemini, ready to add to the materials register.

**Operations & Accounting**
- Work Calendar — daily worker hours and project assignments.
- Quotations Register — client quotes, references, statuses, sent-via channels.
- Accounts Payable & Expenses — supplier bills and operating expenses, with GST calculation.
- Payroll — employee records, rates, PAYG, super.

## Known gaps

- Completed Jobs, RFQ, Customer Invoices, Import Costs from Excel, and Xero are not built yet.
- ServiceM8 has a page but no integration logic.
- No Excel import/export.
- No login or user accounts — the app currently runs against a single fixed user.
- Only employees can be edited after creation; everything else can be added or deleted but not edited.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, react-router-dom
- **Backend:** Go, PostgreSQL
- **File storage:** Supabase Storage
- **AI:** Google Gemini

This is a work in progress, not a finished product.
