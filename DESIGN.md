# Design System: Obsidian Amber Ember (SiteSync AI)
*Calibrated from the Gamified Safety & HSE Compliance Training Hub reference for Oil India Limited (SIH26122)*

## 1. Visual Theme & Atmosphere
An ultra-high-density industrial command center environment engineered for critical national petroleum infrastructure, capital megaprojects, and crude pipeline telemetry under the aegis of Oil India Limited. The visual aesthetic synthesizes Bloomberg-terminal density, aerospace telemetry, and high-heat industrial pipeline engineering.

The emotional tone balances absolute structural certainty, executive authority, and operational urgency:
- **Atmospheric Ember Radiance**: Deep midnight obsidian canvas bathed in warm copper/amber ember radial gradients along the top and right perimeters.
- **Obsidian Titanium Glass**: Elevated command panels and data cards recede into obsidian (`#0e1626` to `#080d19`) with crisp 1px amber-titanium hairline borders (`rgba(245, 158, 11, 0.2)`).
- **Incandescent Amber Primary Action Buttons**: High-contrast, tactile brass/amber triggers (`#f59e0b` to `#d97706`) paired with bold `#070b14` jet-black typography and warm 20px amber glows.
- **Luminous Statutory Certifications**: Vibrant mint-emerald (`#34d399`) pills with dark translucent wells for zero-harm compliance and P6 synchronization.
- **Telemetry Score Readouts**: Monospaced gold readouts (`#fbbf24`) with glowing borders for HSE scores and performance metrics.

## 2. Color Palette & Roles
- **Deep Obsidian Sub-base Canvas** (`#070B14`): Primary light-absorbing canvas baseline with fixed warm atmospheric ember radial gradients.
- **Obsidian Glass Panel** (`#0E1626` to `#080D19`): Elevated command cards, real-time data grids, and P6 milestone boards with amber hairline borders (`rgba(245, 158, 11, 0.2)`).
- **Recessed Carbon Wells** (`#060A12`): Secondary containers, table matrices, and nested toolbars.
- **Incandescent Amber CTA Accent** (`#F59E0B` / `#D97706`): Primary operator action buttons with `#070B14` bold text and golden amber drop shadows.
- **Glowing Amber Telemetry** (`#FBBF24` / `#FDE68A`): Score indicators, WBS markers, OISD gamified badges, and critical path warnings.
- **Precision Statutory Emerald** (`#34D399` / `#10B981`): Zero-harm statutory certifications, P6 sync status, SHA-256 ledger validation seals, and active spread clearances.
- **SCADA Telemetry Cyan** (`#38BDF8` / `#0EA5E9`): Non-blocking RTK positioning, geofencing, and pipeline corridor telemetry.
- **Precision Titanium Gridlines** (`rgba(245, 158, 11, 0.16)`): Hairline divisions maintaining readability without visual occlusion.

### Semantic Status Matrix
- **Critical / Alert:** `#EF4444` / `#F87171` (Weld integrity breach, unverified hash, major delay > 10d)
- **Warning / Critical Path:** `#F59E0B` / `#FBBF24` (Primavera schedule slip > 5 days, thermal deviation)
- **Nominal / Verified:** `#10B981` / `#34D399` (P6 sync active, SHA-256 valid, statutory zero-harm cert)
- **SCADA Live Stream:** `#38BDF8` (RTK GPS, drone telemetry, SCADA registers)

## 3. Typography Architecture
1. **Space Grotesk** (Structural Display): Panel headers, operational titles, and terminal cluster markers. Track-tight (`letter-spacing: -0.02em`), confident weight-driven hierarchy.
2. **Plus Jakarta Sans** (Human Factors Body): Neutral, hyper-legible sans-serif deployed for narrative reporting, technical annotations, and field logs.
3. **JetBrains Mono** (Telemetry & Ledger): Monospaced engine for all numbers, WBS codes (`wbs-1.1.2.1.1`), SCADA registers, pipeline chaining stations (`CH: 142+200`), P6 activity identifiers (`PIPE-ERECT-L6-0142`), and SHA-256 verification strings (`a9f2...e41c`).
- All numbers use tabular alignment (`tabular-nums`) to eradicate visual jumping during live updates.

## 4. Component Behaviors
- **Buttons & Telemetry Triggers:** Solid `#F59E0B` brass background with `#090D14` high-contrast bold typography for primary actions. Tactile active press state (`active:scale-[0.98]`). Secondary buttons use transparent backgrounds with crisp 1px borders.
- **Data Badges & Linkage Tokens:** Compact rectangular badge, dark charcoal background, 1px titanium border, and a micro-status dot (e.g. `P6: SYNCED • 94% CONFIDENCE`).
- **Telemetry Matrices & Tables:** Row height locked to dense 28px–32px. Alternating subtle zebra striping (`#0C1322` vs `#101726`). Right-aligned monospaced numeric columns.
- **Field Viewfinder & Voice Visualizer:** Audio amplitude bar and geotag coordinates overlay for authentic rugged field reporting.

## 5. Anti-Patterns (Banned AI Tells)
- **NO emojis anywhere**: Replaced with clean, professional SVG vector icons (Lucide/Radix).
- **NO purple/neon gradients**: No rainbow text or glowing buttons.
- **NO pure black (`#000000`)**: Layered deep obsidian and charcoal panels.
- **NO fake round numbers**: Real industrial figures with decimals (e.g., `74.5%`, `37.5 meters`, `+7 Days`).
- **NO centered generic hero templates**: Real command and control docked layouts.
