# SiteSync AI — Intelligent Planning-to-Execution Bridge
### SIH26122: Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management
**Organization:** Oil India Limited (OIL)  
**Theme:** Smart Automation  
**Core Tagline:** *From field information to trusted project progress — automatically.*

---

## 🏆 Project Highlights

- **Autonomous Schedule Linking:** Bridges unstructured site progress (voice dispatches, DPRs, spreadsheets, site diaries, photos) directly into structured Primavera P6 and MS Project L5/L6 schedules.
- **Explainable Multi-Stage AI Matcher:** 8-stage hybrid semantic matcher combining lexical overlap, fuzzy string similarity, discipline constraints, physical plant locations, and predecessor verification with calibrated confidence.
- **Human-in-the-Loop AI Review Center:** Planners inspect clear, bulleted evidence checklists proving *why* the AI linked an activity, approving actual schedule updates with 1 click.
- **Project Terminology Memory:** Self-learning vocabulary dictionary that captures colloquial site phrases and contractor jargon, eliminating repetitive manual mapping.
- **Conflict & Chronology Guardrails:** Detects contradictory progress percentages across disparate channels and blocks chronological sequence violations.
- **4D Digital Twin & Downstream Domino Impact:** Visualizes baseline (blue) vs actual (green) vs CPM forecast (orange) and traces the domino effect of upstream delays through downstream milestones.
- **What-If Scenario Simulator:** Allows project managers to test acceleration levers (+craft workers, overtime shifts, fast-tracking) to recover slipped commissioning dates.
- **Grounded AI Project Copilot:** An interactive, conversational project controls assistant grounded strictly in live database facts with zero hallucinations.
- **5-Minute Interactive Judge Demo:** Guided 11-step narrative walkthrough built directly into the UI for hackathon evaluations.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18+ (tested on Node v24.12.0)
- **Package Manager:** `npm` (v10+)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/sitesync-ai.git
cd sitesync-ai

# Install dependencies
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://127.0.0.1:5173/`.

### 4. Production Build Verification
```bash
npm run build
```

---

## 🗄️ Supabase Backend & Database Setup

The backend schema is defined in [supabase/migrations/20260929_sitesync_schema.sql](supabase/migrations/20260929_sitesync_schema.sql).

### Using the Configured Supabase Project
The project is configured to use Supabase project reference `adxpihqwesglpbavspow`:
- Server URL: `https://adxpihqwesglpbavspow.supabase.co`

To apply the schema migrations directly in your Supabase project:
1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Paste the contents of `supabase/migrations/20260929_sitesync_schema.sql`.
3. Click **Run**.
4. Set your environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://adxpihqwesglpbavspow.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

*Note: If no Supabase credentials are provided, SiteSync AI automatically falls back to an offline-first persistent store pre-loaded with realistic Oil India Limited synthetic datasets, ensuring seamless zero-friction evaluation for judges.*

---

## 📱 Role-Based Personas

Use the **Role Selector** in the top navigation bar to test the application from all 4 user perspectives:

| Persona | Primary Focus | Key Screens |
| :--- | :--- | :--- |
| 👷 **Site Supervisor** | Minimal typing, voice dispatches, offline field entry | Field Input Center, Voice Time Agent, Photo Upload |
| 📐 **Project Planner** | Semantic validation, terminology memory, schedule actuals | AI Review Center, WBS Schedule Explorer, 4D Gantt |
| 👔 **Project Manager** | Executive health, risk mitigation, schedule compression | Executive Dashboard, What-If Simulator, Activity DNA |
| 🛡️ **System Admin** | Vigilance compliance, immutable data provenance | Immutable Audit Trail, System Configuration |

---

## 🎯 Five-Minute Judge Walkthrough

To review the complete SIH narrative story in under 5 minutes:
1. Click the golden **"Judge Demo (5 Min)"** button in the header.
2. Step through the 11-step guided walkthrough:
   - **Step 1:** Executive Dashboard (Baseline vs Actual vs Forecast vs Variance)
   - **Step 2:** Voice Time Agent ("12 inch spool erected near compressor...")
   - **Step 3:** AI proposes `PIPE-ERECT-L6-0142` with 94% confidence & explainability checklist
   - **Step 4:** Planner approves proposal -> actual progress updates in real-time
   - **Step 5:** Subcontractor spreadsheet mismatch flagged as `PROGRESS CONFLICT`
   - **Step 6:** Temporal validator blocks out-of-order testing claims
   - **Step 7:** Delay intelligence compares against 54 regional historical benchmarks
   - **Step 8:** Downstream Change Impact Graph traces domino delay on milestones
   - **Step 9:** What-If simulator tests +15 riggers to recover 13 calendar days
   - **Step 10:** Colloquial phrase saved into Project Terminology Memory
   - **Step 11:** Forensic audit trail traces schedule forecast down to exact audio transcript

---

## 🔒 Security & Data Provenance

- **Row Level Security (RLS):** All public tables enforce granular role-based policies.
- **Data Provenance:** Every actual date and progress percentage records source document filename, page/row number, submitter timestamp, and verifying planner.
- **Synthetic Data Context:** All demonstration data is synthetic and tailored to Oil India Limited's North-East Process Facility Expansion (Duliajan Complex).

---

## 📚 Technical Documentation

For in-depth architectural specifications, ER diagrams, matching formulas, and requirement mapping tables, please refer to:
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [supabase/migrations/20260929_sitesync_schema.sql](supabase/migrations/20260929_sitesync_schema.sql)
