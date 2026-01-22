# Restaurant Website & QR Menu

A fast, mobile-first restaurant website with a QR-friendly digital menu.  
Built as a **static site** for reliability, performance, and zero ongoing maintenance.

This project includes:
- A public landing page
- A QR-optimized menu page
- A contact page with map and reviews
- A simple data-driven menu system powered by Google Sheets

---

## 🔍 Overview

This website is designed primarily for **in-restaurant QR scanning** while also serving as a standard public website.

**Key goals**
- Instant loading on mobile devices
- Simple menu browsing (search + collapsible categories)
- Easy menu updates without redeploying the site
- No paid APIs or backend services
- Minimal long-term maintenance

---

## 🧱 Pages

### 1. Home (`/`)
- Restaurant introduction and imagery
- Primary entry point for Google listings
- Links to Menu and Contact pages

### 2. Menu (`/menu/`)
- QR code destination
- Live search
- Collapsible categories
- Menu items rendered dynamically from Google Sheets
- Light/Dark theme toggle

### 3. Contact (`/contact/`)
- Address and phone number (click-to-call)
- Opening hours
- Embedded Google Map (free iframe embed)
- Google Reviews links
- Website support contact

---

## 🛠️ Tech Stack

**Frontend**
- HTML (static pages)
- Tailwind CSS (via CDN)
- Vanilla JavaScript

**Data**
- Google Sheets (published endpoint)
- No backend server required

**Hosting**
- Cloudflare Pages (static hosting + CDN)
- HTTPS enabled by default

---

## 📁 Project Structure

```text
project-root/
├─ assets/
│  ├─ css/
│  │  └─ custom.css           # Small overrides on top of Tailwind
│  │
│  ├─ images/                 # Image assets
│  │
│  └─ js/
│     ├─ config.js            # Shared configuration (sheet URL, cache rules)
│     ├─ site.js              # Site-wide logic (theme, shared UI)
│     ├─ menu.js              # Menu page logic only
│     └─ menu-mock-data.js    # Optional mock data for development
│
├─ contact/
│  └─ index.html              # Contact page
│
├─ menu/
│  └─ index.html              # Menu page (QR destination)
│
├─ docs/
│  ├─ data-contract.md
│  ├─ page-map-and-flows.md
│  └─ frontend-structure.md
│
├─ index.html                 # Home page
└─ README.md
