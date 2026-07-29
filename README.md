# 🛡️ PeaceKeeper AI — Autonomous Treaty Compliance & Peacebuilding Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Google%20Sheets%20API%20v4-brightgreen.svg)](https://developers.google.com/sheets/api)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20CSS3%20%7C%20Leaflet.js-cyan.svg)](https://leafletjs.com/)
[![Backend](https://img.shields.io/badge/Backend-Render-purple.svg)](https://peacekeeper-ai.onrender.com)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black.svg)](https://vercel.com)

**PeaceKeeper AI** is a production-ready, dark-themed intelligence dashboard and autonomous treaty compliance monitoring system. It ingests OSINT news, satellite synthetic aperture radar imagery, and field incident reports; computes an AI-derived multi-factor risk score; and surfaces alerts, GIS threat maps, and streaming PDF intelligence reports through an interactive web UI.

---

## 🚀 Live Demo & Deployment Links

- **Live Render Backend**: [`https://peacekeeper-ai.onrender.com`](https://peacekeeper-ai.onrender.com)
- **Local Application Link**: [`http://localhost:5000`](http://localhost:5000)
- **GitHub Repository**: [`https://github.com/ksivakumarkalaiselvan/PeaceKeeper-AI`](https://github.com/ksivakumarkalaiselvan/PeaceKeeper-AI)

---

## ✨ Key Features & Capabilities

### 1. 🗺️ Global Operational GIS Threat Map
- **Interactive GeoJSON Layer**: Polygon overlays highlighting conflict zones and safety indices per country.
- **Hover Tooltips**: Instant country name, current risk percentage, short description, and active war/conflict badge (`🔥 ACTIVE WAR / CONFLICT ZONE` or `🛡️ STABLE / LOW CONFLICT RISK`).
- **Click Details Panel**: Surfaces detailed risk vs. safety progress bars and enables complete country analysis.
- **Country Intelligence Modal**: Synthesizes ground incident reports, satellite scans, OSINT disinformation ratings, and peacekeeper tactical recommendations.
- **PDF Report Exporter**: On-demand authenticated PDF generation streaming complete country analysis briefs.

### 2. 🧠 AI Multi-Factor Conflict Risk Engine
- **Mathematical Risk Index Formula**:
  $$\text{Risk Score} = 0.30(R) + 0.25(S) + 0.15(N) + 0.15(E) + 0.15(T)$$
  - $R$: Ground Report Frequency & Severity
  - $S$: Satellite Military Hardware Detections
  - $N$: OSINT Fake News Inverse Index ($100 - \text{FakeNewsScore}$)
  - $E$: Social Sentiment Negative Ratio
  - $T$: Logged Treaty Violations
- **Recalculation Engine**: Interactive trigger updating regional escalation levels in real-time.

### 3. 🔘 Interactive Status Badges (`BREACH`, `CLEAR`, `YES (FLAGGED)`)
- All status indicators across satellite viewer, tables, and map panels function as **interactive buttons**:
  - **`BREACH`**: Opens Demilitarized Zone Breach Panel with satellite evidence image, risk level (Critical 92%), timestamp, and full details link.
  - **`CLEAR`**: Opens Compliance Panel displaying zero-violation status, 24/7 orbital radar monitoring, and 98.4% safety rating.
  - **`YES (FLAGGED)`**: Opens Buffer Zone Breach Report Modal with 94.2% AI confidence score, 3km nuclear exclusion perimeter breach metrics, and UN Security Council recommended dispatches.
- Includes cursor hover scale, ripple click animations, and `Enter`/`Space` keyboard accessibility.

### 4. 🛰️ Satellite SAR Radar Viewer
- Synthetic aperture radar viewer with bounding boxes for classified military hardware (armored tanks, artillery batteries).
- Demilitarized buffer zone boundary breach detection flags.

### 5. 📰 OSINT Media Ingest & Fake News Ratings
- Automated news ingestion pipeline scoring disinformation risk percentages and media sentiment indices.
- Admin verification workflow.

### 6. 📜 Treaty Compliance Tracker
- Matrix tracking non-proliferation accords, signatory nations, active statuses, and logged violation counters.

### 7. ⚠️ Threat Alerts & Dispatch Log
- Real-time emergency alerts broadcast system with severity badges (Critical, High, Medium, Low) and email notification dispatches.

### 8. 📄 Streaming PDF Intelligence Generator
- Built-in PDFKit document generator creating authenticated PDF intelligence briefs with metadata and threat breakdowns.

### 9. 📊 Platform Analytics Suite
- Multi-dimensional Chart.js visualizations for monthly conflict trends, risk distribution doughnut metrics, and country violation statistics.

### 10. 🔑 Role-Based Access Control (RBAC) & Settings
- **Admin**: Full CRUD capabilities, alert broadcasting, treaty creation, and verification.
- **Observer**: Read-only access and incident report submission.
- Includes a live Role Switcher on the Settings page.

---

## 📊 Google Sheets Persistence Database Architecture

This platform uses **Google Sheets** as its primary system of record via the **Google Apps Script Web App API v4**.

- **Web App Endpoint**: `https://script.google.com/macros/s/AKfycbwncMQnlp8l1XfsmKYjB7-k-LmTPKeR7yi2hveySayWiVYCw6z3HLuO74IFPUXj4cY/exec`

### 8 Tab Schemas:
1. **`users`**: User profiles, roles (Admin/Observer), bcrypt password hashes.
2. **`reports`**: Ground incident logs, coordinates, evidence images, risk ratings.
3. **`alerts`**: Security warnings, severity levels, acknowledgment logs.
4. **`treaties`**: Accord names, signatories, status, violation counts.
5. **`satellite_images`**: Orbital radar URLs, region coordinates, object detection results, buffer zone flags.
6. **`news`**: Ingested OSINT stories, fake news ratings, sentiment scores.
7. **`activities`**: System audit trails and actor logs.
8. **`notifications`**: User alert notifications.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Grid), JavaScript (ES6+ Modules), Leaflet.js (GIS Map), Chart.js (Analytics).
- **Backend**: Node.js, Express.js REST API (`/api/v1/*`), JWT Authentication, Bcrypt.js, PDFKit, Multer (Evidence File Uploads).
- **Database**: Google Sheets API v4 (via Google Apps Script Web App `Code.gs`) with `SheetRepository` abstraction, 60s TTL caching, and write mutex queuing.
- **Hosting / Deployment**: Render (Backend REST API) & Vercel (Frontend & Serverless Rewrites).

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/ksivakumarkalaiselvan/PeaceKeeper-AI.git
cd PeaceKeeper-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set environment variables in `.env`:
```env
PORT=5000
JWT_SECRET=peacekeeper_super_secret_jwt_key_2026
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwncMQnlp8l1XfsmKYjB7-k-LmTPKeR7yi2hveySayWiVYCw6z3HLuO74IFPUXj4cY/exec
```

### 4. Run Locally
```bash
npm run dev
# or
node server/server.js
```
Open [`http://localhost:5000`](http://localhost:5000) in your browser.

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@peacekeeper.ai` | `password123` | Full CRUD, Issue Alerts, Create Treaties, Verify News |
| **Observer** | `observer@peacekeeper.ai` | `password123` | Read Access, Submit Incident Reports |

---

## 🌐 API Route Endpoint Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/v1/dashboard/summary` | Executive summary metrics | Authenticated |
| `GET` | `/api/v1/map/countries-geojson` | GeoJSON country boundary layer | Authenticated |
| `GET` | `/api/v1/map/country-analysis/:country` | Real-data intelligence synthesis | Authenticated |
| `GET` | `/api/v1/map/country-analysis/:country/pdf` | Stream country PDF report | Authenticated |
| `GET` | `/api/v1/reports` | List conflict incident reports | Authenticated |
| `POST` | `/api/v1/reports` | Log new incident report & evidence | Authenticated |
| `GET` | `/api/v1/reports/:id/download` | Stream incident PDF report | Authenticated |
| `POST` | `/api/v1/risk/recalculate` | Trigger AI risk engine calculation | Authenticated |
| `GET` | `/api/v1/news` | List ingested OSINT feeds | Authenticated |
| `POST` | `/api/v1/news` | Ingest new OSINT story & score disinfo | Authenticated |
| `GET` | `/api/v1/satellite` | List satellite SAR captures | Authenticated |
| `POST` | `/api/v1/satellite` | Upload satellite capture & run detection | Authenticated |
| `GET` | `/api/v1/treaties` | List treaty compliance matrix | Authenticated |
| `POST` | `/api/v1/treaties` | Track new treaty accord | Admin Only |
| `GET` | `/api/v1/alerts` | List security alerts log | Authenticated |
| `POST` | `/api/v1/alerts` | Broadcast emergency alert | Admin Only |

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ for Peacebuilding & International Treaty Compliance.
