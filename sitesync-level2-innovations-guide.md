# 🚀 SiteSync: Level-2 Breakthrough Innovations Guide
## Oil India Limited (Ministry of Petroleum & Natural Gas, Govt. of India)
### 132.0 KM Digboi Initial Pump Station (IPS) to Duliajan Refinery Crude Oil Trunkline
### Problem Statement: 260122 / 26122 (Smart India Hackathon)

---

## 🏆 Executive Summary of the 7 New Level-2 Innovations

All seven innovations are fully implemented, compiled, and live in the application. They can be launched directly from:
1. **Sidebar Navigation**: Under the **`🌟 Level-2 Breakthrough Suite`** group.
2. **Project Dashboard Showcase**: Switch the category filter to **`🌟 Level-2 Suite (7)`** to see cards with direct launch buttons.
3. **Hands-Free Voice Field Commander**: Press `V` anywhere to open the voice HUD and say e.g., *"Open IoT Telemetry"*, *"Launch AR Inspection"*, *"Open Drone Fleet"*, etc.

---

### Quick Feature Matrix

| # | Innovation | Category | Key Technologies | Regulatory / Industry Standard |
|---|------------|----------|------------------|--------------------------------|
| **1** | **IoT Predictive Maintenance** | Edge AI & SCADA | LSTM Neural Network, MQTT, ISO 10816-3 | OISD-118, API 1130 CPM, ISO 10816-3 |
| **2** | **AR Spatial Site Inspection** | WebXR & Vision | Subterranean Projection, Device Camera, NDT Tags | ASME B31.4, API 1104, NACE SP0169 |
| **3** | **Drone Fleet & Orthophoto Timeline** | UAV Photogrammetry | LiDAR DEM, YOLOv11 CV, Dual Split Slider | DGCA Drone Rules 2021, CVC Quantity Audit |
| **4** | **Gamified Safety & HSE Hub** | Simulation & Gamification | Timed Drills, Peer Leaderboard, Digital Certificate | OISD-118, OISD-141, DGMS Excavation |
| **5** | **GIS Corridor Threat Alerts** | Vector GIS & Defense | Spatial Buffer Engine, Acoustic DTS, CISF Dispatch | 30m Statutory RoW, Dihing Patkai Eco-Buffer |
| **6** | **AI Statutory Compliance Generator** | NLP & Vigilance | Indian PSU Grammar Engine, WBS Mappings, SHA-256 | CVC OM 005/VGL/4, MoP&NG IPMD DPR |
| **7** | **Energy & Flow Digital Twin** | Hydraulics & CFD | Colebrook-White, Non-Newtonian Assam Wax Model | PNGRB T4S, Power Tariff Optimization |

---

## 1️⃣ Feature 1: Real-time IoT Sensor Dashboard & Predictive Maintenance
- **Path**: `src/components/views/IoTPredictiveMaintenance.tsx` & `src/services/iotEngine.ts`
- **Navigation**: Click **IoT Predictive Maintenance** in the Sidebar or choose **Level-2 Suite** on the Dashboard.
- **Why It Wins the Hackathon**:
  - Monitors the entire 132KM corridor across 5 key asset stations: Digboi Initial Pump Station (IPS-01), Margherita Booster (BPS-02), Namrup Valve Station (VS-03), Burhi Dihing River HDD Crossing (HDD-04), and Duliajan Refinery Intake (RIT-05).
  - Integrates an in-browser **LSTM Autoencoder** predicting Remaining Useful Life (RUL) and vibration drift **48 hours ahead**.
  - **Interactive Fault Injection Testbench**: Judges can click *“Pump Cavitation & Bearing Fatigue”*, *“Paraffin Wax Deposition”*, or *“River Scour Strain Spike”* to watch vibration gauges turn red, RUL collapse from 1,240 hrs to 18 hrs, and trigger an automated **SAP-PM Work Order** linked to Primavera P6.
- **Judge Demo Script**:
  1. Click on *“BPS-02 Margherita Booster Station”*.
  2. Click the preset **🔴 Pump P-201 Impeller Cavitation**.
  3. Point out how vibration spikes to `9.4 mm/s RMS` (exceeding ISO 10816 limit 4.5 mm/s) and failure probability reaches `94%`.
  4. Click **Trigger Preventive SAP-PM Work Order** to show autonomous dispatch to Margherita Field Crew A.

---

## 2️⃣ Feature 2: AR-Enabled Site Inspection (Spatial Digital Overlay)
- **Path**: `src/components/views/ARInspectionView.tsx` & `src/services/arEngine.ts`
- **Navigation**: Click **AR Site Inspection** in the Sidebar.
- **Why It Wins the Hackathon**:
  - Projected underground wireframe displays the 24" crude trunkline at depth `-1.85m` with real-time GPS coordinates, chainage (`Ch. 42+380`), and compass heading HUD.
  - **Live Device Camera Integration**: Field engineers can click *“ATTACH DEVICE CAMERA”* to activate their phone/laptop webcam and render the holographic pipeline over physical terrain!
  - **Holographic Inspection Pins**: Click on floating pins like `Joint Weld #DJ-142` to reveal ASNT Level III Phased Array Ultrasonic Testing (PAUT) records and ASME B31.4 compliance.
  - **Interactive AR Defect Tagging**: Click *“PLACE AR DEFECT TAG”* and tap anywhere on the viewport to drop a geo-anchored defect marker (Coating Holiday, RoW Encroachment, Trench Erosion).
- **Judge Demo Script**:
  1. Click **AR Site Inspection**.
  2. Click on the pin **Joint Weld #DJ-142** to show non-destructive test certifications.
  3. Toggle **AR Vision Filter** to *FLIR Thermal* or *Subsurface X-Ray*.
  4. Click **Place AR Defect Tag** and click on the canvas to place a defect anchor.

---

## 3️⃣ Feature 3: Drone Fleet Integration & Orthophoto Timeline
- **Path**: `src/components/views/DroneFleetView.tsx` & `src/services/droneFleetEngine.ts`
- **Navigation**: Click **Drone Fleet & Orthophoto** in the Sidebar.
- **Why It Wins the Hackathon**:
  - Manages 4 autonomous UAV sectors (DJI Matrice 350 RTK with LiDAR Zenmuse L2 and 45MP full-frame photogrammetry).
  - **Interactive Before/After Split Slider**: Drag the slider handle horizontally across the Burhi Dihing River HDD crossing to compare baseline virgin terrain vs current excavated trench and welded pipe stringing.
  - **Volumetric Earthwork LiDAR Engine**: Computes cut volume (16,840 m³), fill volume (13,920 m³), and verifies trench depth conformance (99.1% against 2.40m design).
  - **AI Object Detection**: Counts stringed pipes, excavators, waterlogging puddles, and RoW barricades.
  - **Primavera P6 Reconciliation**: One-click *“SYNC TO PRIMAVERA P6 WBS”* button.
- **Judge Demo Script**:
  1. Open **Drone Fleet & Orthophoto**.
  2. Drag the slider left and right to show the transition between baseline forest clearing and excavated pipe stringing.
  3. Point out the automated LiDAR net earthwork calculation (+2,920 m³).
  4. Click **SYNC TO PRIMAVERA P6 WBS** and observe the live confirmation toast.

---

## 4️⃣ Feature 4: Gamified Safety & HSE Compliance Training Hub
- **Path**: `src/components/views/SafetyTrainingHub.tsx` & `src/services/safetyEngine.ts`
- **Navigation**: Click **Gamified Safety Hub** in the Sidebar.
- **Why It Wins the Hackathon**:
  - Solves the critical training bottleneck for public sector undertakings (PSUs) by converting dense OISD safety manuals into interactive, timed emergency crisis drills.
  - **Real Scenarios**: Toxic H₂S gas release at Margherita pig receiver (OISD-118), monsoon trench wall collapse (OISD-141), and hot tapping flash fires.
  - **Real-time Scoring & Badges**: Awards XP, maintains safety streaks, and ranks engineers on the regional corridor leaderboard.
  - **Official Certificate Generator**: Includes an interactive modal that renders a printable **Government of India / Oil India Limited Certificate of Safety Excellence** with unique verification hashes.
- **Judge Demo Script**:
  1. Open **Gamified Safety Hub**.
  2. Answer Scenario 1 by selecting option **A** (immediate positive-pressure SCBA donning and ESDV trip).
  3. Highlight the regulatory citation (OISD-Standard-118 Clause 6.4) and +250 XP gain.
  4. Click **View Certificate** in the header to display the official printable credential.

---

## 5️⃣ Feature 5: GIS Geofencing & Corridor Threat Alert System
- **Path**: `src/components/views/CorridorGeofenceGIS.tsx` & `src/services/geofenceGISEngine.ts`
- **Navigation**: Click **GIS Corridor Threat Alert** in the Sidebar.
- **Why It Wins the Hackathon**:
  - Full vector GIS corridor representation of the 132KM Digboi-to-Duliajan route with EPSG:4326 coordinates.
  - Multi-layer spatial buffer toggles: **30m Statutory Legal Right of Way (RoW)** and **500m Eco-Sensitive Dihing Patkai Wildlife Buffer**.
  - **Live Threat Beacons**: Displays pulsating alerts for unauthorized heavy excavators, wild elephant herd crossings, Burhi Dihing riverbed scour, and acoustic pipe tapping attempts.
  - **Direct Enforcement**: One-click **Dispatch CISF Quick Reaction Team** sends armed security units to the coordinates and notifies the P6 schedule planner.
- **Judge Demo Script**:
  1. Open **GIS Corridor Threat Alert**.
  2. Toggle between *“30m Legal RoW”* and *“500m Eco-Buffer”* layers on the vector map.
  3. Click on the pulsating red beacon **THREAT-01** (Unauthorized JCB inside 30m RoW at KM 58.24).
  4. Click **Dispatch CISF Quick Reaction Team** to trigger instant incident escalation.

---

## 6️⃣ Feature 6: AI Statutory Compliance Report Generator (CVC & MoP&NG Standards)
- **Path**: `src/components/views/ComplianceReportGenerator.tsx` & `src/services/complianceEngine.ts`
- **Navigation**: Click **CVC / MoP&NG Report AI** in the Sidebar.
- **Why It Wins the Hackathon**:
  - Tackles the #1 administrative overhead in government infrastructure: converting rough field notes into legally compliant Daily Progress Reports (DPR).
  - Aligns strictly with **Central Vigilance Commission (CVC) OM 005/VGL/4** and **Ministry of Petroleum & Natural Gas (MoP&NG)** project monitoring guidelines.
  - **Automatic Fraud & Variance Detection**: Compares billed contractor quantities against Primavera P6 baselines and flags discrepancies for vigilance review.
  - **Force Majeure Analysis**: Distinguishes between monsoon rain stoppages (Force Majeure, no liquidated damages) and contractor negligence.
  - **Blockchain Cryptographic Stamping**: Embeds a SHA-256 integrity hash on every report for audit tamper-proofing.
- **Judge Demo Script**:
  1. Open **CVC / MoP&NG Report AI**.
  2. Type or dictate field notes into the input box and click **SYNTHESIZE STATUTORY REPORT**.
  3. Scroll down the official Government of India letterhead dossier, pointing out the WBS progress table and CVC audit status pills.
  4. Click **Print / Export PDF** to trigger the formatted print preview.

---

## 7️⃣ Feature 7: Energy-Optimization & Flow Digital Twin Simulator
- **Path**: `src/components/views/FlowEnergySimulator.tsx` & `src/services/flowEnergyEngine.ts`
- **Navigation**: Click **Energy & Flow Digital Twin** in the Sidebar.
- **Why It Wins the Hackathon**:
  - Implements physics-based hydraulics modeling specifically calibrated for high-wax **Assam crude oil** (WAT: 30.5°C, Pour Point: 28°C).
  - Calculates the **Hydraulic Grade Line (HGL)** and friction head loss using Colebrook-White equations across the 132KM elevation profile.
  - **Thermal Decay Model**: Monitors temperature drop across subsoil to warn against wax deposition and pipeline blockage.
  - **AI Energy Optimizer**: Tunes booster pump RPM and Drag Reducing Agent (DRA) dosage to achieve:
    - **₹42.8 Lakhs / month in electricity bill savings**.
    - **310 Tons / month CO₂ carbon emission reduction**.
    - Complete elimination of wax freeze risk along the corridor.
- **Judge Demo Script**:
  1. Open **Energy & Flow Digital Twin**.
  2. Adjust the **Throughput Flow Rate** slider to `1800 m³/hr` and watch power consumption rise.
  3. Point out the HGL elevation graph and the red wax risk alert at Duliajan terminal.
  4. Click **Run AI Energy Optimization** to watch DRA dosage automatically adjust to 15 ppm, eliminating the wax hazard and unlocking ₹42.8L in monthly power savings.

---

## 🎤 Hands-Free Voice Field Commander Quick Reference

Press `V` on your keyboard anywhere in the application to launch the Voice Commander, then speak or click any of the voice actions:

```
"Open IoT Telemetry"         -> Navigates to Feature 1
"Launch AR Inspection"       -> Navigates to Feature 2
"Open Drone Fleet"           -> Navigates to Feature 3
"Open Safety Training"       -> Navigates to Feature 4
"Open Geofence GIS"          -> Navigates to Feature 5
"Open Compliance Report"     -> Navigates to Feature 6
"Open Flow Energy Simulator" -> Navigates to Feature 7
```

---
*Created for Smart India Hackathon // Problem Statement 260122 & 26122 // Oil India Limited*
