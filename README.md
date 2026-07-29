# PeaceKeeper AI — Autonomous Treaty Compliance & Peacebuilding Platform

PeaceKeeper AI is a production-ready, dark-themed intelligence command platform designed for monitoring global conflict zones, tracking non-proliferation treaty compliance, analyzing OSINT feeds and satellite synthetic aperture radar imagery, and computing multi-factor AI risk indices.

---

## 🌟 Key Features

1. **Dual Operational Roles (RBAC)**:
   - **Admin**: Full CRUD capabilities across reports, treaties, satellite analysis, OSINT verification, and alert triggers.
   - **Observer**: Submit conflict incident reports, inspect satellite imagery, view GIS maps, and export PDF intelligence briefings.
2. **AI Multi-Factor Risk Calculation Engine**:
   - Computes dynamic 0–100% regional risk indices based on:
     - Ground Report Frequency ($30\%$)
     - Satellite Asset Detection ($25\%$)
     - OSINT Disinformation / Fake News Score ($15\%$)
     - Negative Media & Social Sentiment ($15\%$)
     - Active Treaty Violations ($15\%$)
3. **OSINT Disinformation Monitor**:
   - Automated credibility rating and sentiment analysis for incoming news feeds.
4. **Satellite Synthetic Aperture Radar Viewer**:
   - Object detection classification for armored columns, mobile artillery, and demilitarized buffer zone boundary flags.
5. **Interactive GIS Threat Map**:
   - Leaflet.js dark mode map with risk color-coded markers and demilitarized buffer zone circles.
6. **PDF Intelligence Briefing Generator**:
   - Streaming PDF generation with official authentication verification stamps using PDFKit.
7. **Analytics Center**:
   - Interactive Chart.js charts for monthly trends, country risk breakdown, and treaty violation metrics.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Launch the Application
```bash
npm start
```
The server will boot on `http://localhost:5000`.

### 3. Demo Credentials
- **Admin**: `admin@peacekeeper.ai` | Password: `password123`
- **Observer**: `observer@peacekeeper.ai` | Password: `password123`

---

## 🔒 Architecture & Phase 1 Mock Layer

In accordance with Phase 1 instructions, the application frontend and Node/Express REST API are fully built and functional using an **in-memory mock repository layer**. All repository operations (`find`, `findById`, `create`, `updateById`, `deleteById`) operate seamlessly on pre-seeded sample data. No external database is connected yet.
