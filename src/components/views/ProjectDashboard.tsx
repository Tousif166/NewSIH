import React, { useState } from 'react';
import { useApp } from '../../services/store';

export const ProjectDashboard: React.FC = () => {
  const { 
    currentRole, 
    roleMetadata, 
    setCurrentRole, 
    activeProject, 
    activities, 
    conflicts, 
    riskScore, 
    matches, 
    setActiveTab,
    commitScheduleActuals,
    openIndicSpeechStudio,
    openRoWGeofence,
    openEMbReconciler,
    openCvcAuditDossier,
    openDroneAuditor,
    openWhatsAppGateway,
    openFloodPredictor,
    openP6XerExport,
    openPipeline3D,
    openBlockchainLedger,
    openDelayCascade,
    openVoiceCommander,
    openIoTPredictive,
    openARInspection,
    openDroneFleet,
    openSafetyTraining,
    openGeofenceGIS,
    openComplianceReport,
    openFlowEnergy,
    setIsCopilotOpen,
    showToast 
  } = useApp();

  const [scrubberWeek, setScrubberWeek] = useState<number>(43);
  const [selectedFilter, setSelectedFilter] = useState<'P50' | 'P85' | 'P95'>('P85');

  // Dynamic mapped horizontal position for the data-date scrubber (Week 43 default = 480)
  const currentDataX = Math.min(940, Math.max(60, 480 + (scrubberWeek - 43) * 14));
  const currentBadgePct = (currentDataX / 1000) * 100;

  const delayedActivities = activities.filter(a => a.forecastVarianceDays > 0);
  const criticalActivities = activities.filter(a => a.isCriticalPath);
  const completedCount = activities.filter(a => a.actualPercent === 100);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Operational Persona Header Bar (Stitch Screen 3) */}
      <div className="animate-entrance delay-1 flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-sky-950/60 border border-blue-200 dark:border-sky-500/40 flex items-center justify-center text-blue-700 dark:text-sky-400 shadow-2xs transition-transform duration-300 hover:rotate-6">
              <span className="material-symbols-outlined text-[26px]">shield_person</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0b111e] radar-beacon"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">Rajiv K. Sharma</span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111a2d] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-semibold uppercase tracking-wider">
                CGM — Infrastructure Directorate
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 radar-beacon"></span>
                ACTIVE CLEARANCE TIER-1
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              <span>CLEARANCE ID: <strong className="text-slate-900 dark:text-slate-100 font-semibold">OIL-EXEC-0042-KS</strong></span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>REPORT CYCLE: <strong className="text-blue-900 dark:text-sky-400 font-semibold">WEEK {scrubberWeek} / OCT 2026</strong></span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>BASIS: <strong className="text-slate-800 dark:text-slate-200 font-semibold">ORACLE EPPM P6.24 LIVE MIRROR</strong></span>
            </div>
          </div>
        </div>

        {/* Rapid Telemetry Counters */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 w-full xl:w-auto no-scrollbar shrink-0">
          <div className="flex flex-col px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070c16] border border-slate-200 dark:border-amber-500/20 min-w-[110px] transition-all hover:bg-white dark:hover:bg-[#0c1424] hover:border-slate-300 dark:hover:border-amber-500/40 shadow-2xs">
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Corridor Length</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">132.0 <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">KM</span></span>
          </div>
          <div className="flex flex-col px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070c16] border border-slate-200 dark:border-amber-500/20 min-w-[125px] transition-all hover:bg-white dark:hover:bg-[#0c1424] hover:border-slate-300 dark:hover:border-amber-500/40 shadow-2xs">
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Spread Crews</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">4 Spreads / <span className="text-blue-800 dark:text-sky-400 font-semibold">680 FTE</span></span>
          </div>
          <div className="flex flex-col px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070c16] border border-slate-200 dark:border-amber-500/20 min-w-[115px] transition-all hover:bg-white dark:hover:bg-[#0c1424] hover:border-slate-300 dark:hover:border-amber-500/40 shadow-2xs">
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">P6 Baseline Rev</span>
            <span className="font-mono text-sm font-semibold text-blue-800 dark:text-sky-400">WBS-B4.8 (Q3)</span>
          </div>
          <div className="flex flex-col px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070c16] border border-slate-200 dark:border-amber-500/20 min-w-[110px] transition-all hover:bg-white dark:hover:bg-[#0c1424] hover:border-slate-300 dark:hover:border-amber-500/40 shadow-2xs">
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Block Valve Stns</span>
            <span className="font-mono text-sm font-semibold text-emerald-800 dark:text-emerald-400">7 / 7 Active</span>
          </div>
        </div>
      </div>

      {/* Quick Access to 5-Min Judge Demonstration Console */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border border-blue-200/80 dark:border-amber-500/25 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                Smart India Hackathon SIH26122 Innovations Showcase
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-400 text-slate-950 font-mono font-bold uppercase shrink-0">
                JURY READY
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
              All 20 role-scoped modules and deep-dive technical engines have been moved to the 5-Minute Jury Demonstration Console.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('DEMO_WALKTHROUGH')}
          className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
        >
          <span>Open 5-Min Judge Demo</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* 2. Executive KPI Summary Cards (Grid of 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 animate-entrance delay-2">
        {/* SPI Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-blue-800 dark:group-hover:text-amber-400 transition-colors">
                Schedule Index (SPI)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-mono text-[11px] font-semibold flex items-center gap-1 transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-[13px] font-bold">arrow_downward</span>-0.02 wk
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">0.94</span>
              <span className="font-mono text-xs text-rose-700 dark:text-rose-400 font-semibold">Critical Path Lag: -4.2d</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] font-medium">
              <span className="material-symbols-outlined text-amber-500 text-[15px]">timer</span>
              <span>Earned: 61.4% / Plan: 65.3%</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-mono text-[10px] font-semibold">
              TIE-IN HOLD
            </span>
          </div>
        </div>

        {/* CPI Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-blue-800 dark:group-hover:text-amber-400 transition-colors">
                Cost Index (CPI)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-1 transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-[13px] font-bold">arrow_upward</span>+0.01 wk
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">1.02</span>
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold">+$1.40M Favourable</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] font-medium">
              <span className="material-symbols-outlined text-emerald-600 text-[15px]">account_balance_wallet</span>
              <span>ACWP: ₹412.8 Cr / BCWP: ₹421.1 Cr</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-semibold">
              EPC UNDER BUDGET
            </span>
          </div>
        </div>

        {/* Milestone Delivery Health */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-blue-800 dark:group-hover:text-amber-400 transition-colors">
                Milestone Progress
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#111a2d] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-mono text-[11px] font-semibold">
                TOTAL: 28
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                24<span className="text-slate-400 dark:text-slate-500 font-medium text-lg">/28</span>
              </span>
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold">On Track (85.7%)</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>24 Done
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>3 Risk
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>1 Bottleneck
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[16px] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </div>

        {/* AI Field Telemetry Confidence */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all group">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-blue-800 dark:group-hover:text-amber-400 transition-colors">
                Telemetry Verification
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] font-bold">verified</span>TAMPER-PROOF
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-blue-800 dark:text-sky-400 tracking-tight">96.8%</span>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">AI Confidence Score</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] font-medium">
              <span className="material-symbols-outlined text-blue-700 dark:text-sky-400 text-[15px]">dataset</span>
              <span>142 Field Logs • 0 Disputes</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-sky-950/60 border border-blue-200 dark:border-sky-500/40 text-blue-800 dark:text-sky-300 font-mono text-[10px] font-semibold">
              SYNCD
            </span>
          </div>
        </div>
      </div>

      {/* 3. High-Density Interactive S-Curves Section */}
      <div className="animate-entrance delay-3 flex flex-col p-5 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 dark:text-sky-400 text-[22px]">ssid_chart</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">Earned Value S-Curve Telemetry & P85 Monte Carlo Projection</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#111a2d] border border-slate-200 dark:border-slate-800 font-mono text-[10px] font-semibold text-slate-700 dark:text-amber-400">10,000 RUNS</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Dual-envelope simulation measuring baseline variance against live daily drone surveys and certified weld joints.</span>
          </div>

          {/* Legends & Filter Toggles */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400 border-dashed border-t border-slate-500 dark:border-slate-400"></span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">P6 Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 shadow-sm shadow-sky-500/50"></span>
              <span className="text-blue-800 dark:text-sky-400 font-semibold">Earned Value (Actual: 61.4%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm shadow-amber-500/50"></span>
              <span className="text-amber-800 dark:text-amber-400 font-semibold">AI {selectedFilter} Forecast (Nov 22, 2026)</span>
            </div>
            <div 
              onClick={() => setSelectedFilter(selectedFilter === 'P85' ? 'P95' : selectedFilter === 'P95' ? 'P50' : 'P85')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#131b2e] border border-slate-300 dark:border-amber-500/30 text-slate-700 dark:text-amber-300 font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-[#1a253e] transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>{selectedFilter} Active (Click to Cycle)</span>
            </div>
          </div>
        </div>

        {/* S-Curve SVG Chart Container */}
        <div className="relative w-full h-84 bg-slate-50/80 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 mt-3 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-80">
            <div className="w-full border-b border-slate-200 dark:border-slate-800/60 flex justify-end"><span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-semibold -mt-3.5">100%</span></div>
            <div className="w-full border-b border-slate-200 dark:border-slate-800/60 flex justify-end"><span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-semibold -mt-3.5">75%</span></div>
            <div className="w-full border-b border-slate-200 dark:border-slate-800/60 flex justify-end"><span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-semibold -mt-3.5">50%</span></div>
            <div className="w-full border-b border-slate-200 dark:border-slate-800/60 flex justify-end"><span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-semibold -mt-3.5">25%</span></div>
            <div className="w-full border-b border-slate-200 dark:border-slate-800/60 flex justify-end"><span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-semibold -mt-3.5">0%</span></div>
          </div>

          {/* Live SVG Paths */}
          <div className="relative w-full h-full z-10">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 240">
              <defs>
                <linearGradient id="actualGradientS" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28"></stop>
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.01"></stop>
                </linearGradient>
                <linearGradient id="p85GradientS" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22"></stop>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01"></stop>
                </linearGradient>
              </defs>

              {/* P6 Baseline Curve (Dashed Slate) */}
              <path d="M 40 220 C 200 215, 320 185, 480 120 C 640 55, 800 25, 960 20" fill="none" opacity="0.85" stroke="#94a3b8" strokeDasharray="6,6" strokeWidth="2.5"></path>

              {/* Actual Earned Value Area & Path */}
              <path d="M 40 220 C 180 216, 290 192, 420 152 C 455 142, 480 135, 480 135 L 480 220 L 40 220 Z" fill="url(#actualGradientS)"></path>
              <path d="M 40 220 C 180 216, 290 192, 420 152 C 455 142, 480 135, 480 135" fill="none" stroke="#0284c7" strokeLinecap="round" strokeWidth="3.5"></path>

              {/* AI Forecast Projection Curve */}
              <path d="M 480 135 C 560 115, 680 70, 820 40 C 890 28, 940 22, 985 20 L 985 220 L 480 220 Z" fill="url(#p85GradientS)"></path>
              <path d="M 480 135 C 560 115, 680 70, 820 40 C 890 28, 940 22, 985 20" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3"></path>

              {/* Data-Date Vertical Marker */}
              <line 
                opacity="0.95" 
                stroke="#f59e0b" 
                strokeDasharray="4,4" 
                strokeWidth="2" 
                x1={currentDataX} 
                x2={currentDataX} 
                y1="10" 
                y2="225"
                style={{ transition: 'x1 0.1s ease-out, x2 0.1s ease-out' }}
              />

              {/* Milestone Markers */}
              <circle cx="270" cy="196" fill="#10b981" r="5.5" stroke="#ffffff" strokeWidth="2.5">
                <title>HDD River Crossing Cleared</title>
              </circle>
              <circle cx="430" cy="148" fill="#0284c7" r="5.5" stroke="#ffffff" strokeWidth="2.5">
                <title>Stringing Complete (72km)</title>
              </circle>
              
              {/* Milestone Marker 3: Orbital Tie-in MP 62 Bottleneck Indicator (In-place radial beacon, zero coordinate translation) */}
              <circle cx="480" cy="135" fill="#ef4444" opacity="0.4" r="7">
                <animate attributeName="r" values="7;18;7" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="480" cy="135" fill="#ef4444" r="7" stroke="#ffffff" strokeWidth="2.5" className="cursor-pointer">
                <title>MP 62 Tie-in Lag Bottleneck (-4.2d)</title>
              </circle>

              <circle cx="710" cy="65" fill="#f59e0b" r="5.5" stroke="#ffffff" strokeWidth="2.5">
                <title>Section 1 Hydrotest</title>
              </circle>
            </svg>

            {/* Tooltip Pill - Clean border & high contrast */}
            <div 
              className="absolute top-1 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-amber-100 dark:bg-[#1a1309] border border-amber-300 dark:border-amber-500/60 text-amber-900 dark:text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold shadow-md z-20 transition-all duration-100 ease-out pointer-events-none whitespace-nowrap"
              style={{ left: `${Math.min(Math.max(currentBadgePct, 12), 88)}%` }}
            >
              DATA-DATE: 24 OCT 2026 (WEEK {scrubberWeek})
            </div>

            {/* Floating Milestone Badges - Clean non-overlapping layout */}
            <div className="absolute left-[20%] bottom-10 px-2.5 py-1 rounded-md bg-white/95 dark:bg-[#071912]/95 border border-emerald-300 dark:border-emerald-500/40 shadow-md text-emerald-800 dark:text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold hidden md:flex items-center gap-1.5 pointer-events-none backdrop-blur-sm">
              <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-emerald-400 font-bold">done_all</span>
              HDD River Crossing Cleared
            </div>
            <div className="absolute left-[30%] top-6 px-2.5 py-1 rounded-md bg-white/95 dark:bg-[#08182b]/95 border border-sky-300 dark:border-sky-500/40 shadow-md text-sky-800 dark:text-sky-300 font-mono text-[10px] sm:text-[11px] font-bold hidden md:flex items-center gap-1.5 pointer-events-none backdrop-blur-sm">
              <span className="material-symbols-outlined text-[15px] text-sky-600 dark:text-sky-400 font-bold">check</span>
              Stringing Complete (72km)
            </div>
            <div className="absolute left-[47%] top-1 px-2.5 py-1 rounded-md bg-rose-100 dark:bg-[#200a0e] border border-rose-300 dark:border-rose-500/70 text-rose-800 dark:text-rose-300 font-mono text-[10px] sm:text-[11px] font-bold shadow-md shadow-rose-950/20 flex items-center gap-1 sm:gap-1.5 transition-transform hover:scale-105 cursor-pointer whitespace-nowrap z-10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-rose-600 dark:text-rose-400 font-bold">report_problem</span>
              MP 62 Tie-in Lag (-4.2d)
            </div>
            <div className="absolute left-[67%] top-6 px-2.5 py-1 rounded-md bg-white/95 dark:bg-[#1b1408]/95 border border-amber-300 dark:border-amber-500/40 shadow-md text-amber-800 dark:text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold hidden lg:flex items-center gap-1.5 pointer-events-none backdrop-blur-sm">
              <span className="material-symbols-outlined text-[15px] text-amber-600 dark:text-amber-400 font-bold">schedule</span>
              Section 1 Hydrotest (P85: Mar 15)
            </div>
          </div>

          {/* Timeline Labels */}
          <div className="w-full flex justify-between font-mono text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-2.5 border-t border-slate-200 dark:border-slate-800">
            <span>OCT '26<span className="hidden sm:inline"> (Start)</span></span>
            <span className="hidden sm:inline">DEC '26</span>
            <span>FEB '27</span>
            <span className="text-blue-800 dark:text-sky-400 font-bold">APR '27<span className="hidden sm:inline"> (P6 Target)</span></span>
            <span className="hidden sm:inline">JUN '27</span>
            <span className="hidden sm:inline">AUG '27</span>
            <span className="text-amber-800 dark:text-amber-400 font-bold">NOV '27<span className="hidden sm:inline"> (AI {selectedFilter} Forecast)</span></span>
          </div>
        </div>

        {/* Date Range Interactive Scrubber */}
        <div className="mt-3.5 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-[#070c16] p-3.5 rounded-xl border border-slate-200 dark:border-amber-500/20 shadow-2xs">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 uppercase font-semibold whitespace-nowrap">Time Scrubber</span>
            <input 
              type="range" 
              min={1} 
              max={60} 
              value={scrubberWeek}
              onChange={(e) => setScrubberWeek(Number(e.target.value))}
              className="w-full accent-amber-500 dark:accent-amber-400 bg-slate-200 dark:bg-slate-800 rounded h-2 cursor-pointer"
            />
            <span className="font-mono text-xs text-blue-900 dark:text-sky-300 font-semibold whitespace-nowrap px-2.5 py-1 bg-blue-50 dark:bg-sky-950/60 border border-blue-200 dark:border-sky-500/40 rounded-md shadow-2xs">
              Week {scrubberWeek} / 60
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-medium">AI Delay Dampening:</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 font-mono text-[11px] text-emerald-900 dark:text-emerald-300 font-semibold shadow-2xs">
              +1.8d Buffer Recovery
            </span>
          </div>
        </div>
      </div>

      {/* 4. Critical Path Corridor Risk Heatmap & Key Machinery Deployment */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-entrance delay-4">
        {/* Pipeline Corridor Risk Heatmap (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col p-5 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 dark:text-sky-400 text-[20px]">linear_scale</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Pipeline Corridor Risk Heatmap (132 KM)</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">5 Technical Sectors</span>
          </div>

          {/* Visual Heatmap Track */}
          <div className="w-full grid grid-cols-12 h-3.5 rounded overflow-hidden mb-4 border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-[#060a14]">
            <div className="col-span-3 bg-emerald-500" title="MP 0-30: Nominal"></div>
            <div className="col-span-3 bg-rose-500 relative" title="MP 30-65: Critical Bottleneck">
              <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
            </div>
            <div className="col-span-3 bg-amber-400" title="MP 65-100: Weather Watch"></div>
            <div className="col-span-2 bg-emerald-500" title="MP 100-120: Nominal"></div>
            <div className="col-span-1 bg-slate-300 dark:bg-slate-700" title="MP 120-132: Survey Staging"></div>
          </div>

          {/* Segment Details with Corridor Pictures */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070c16] hover:bg-slate-50 dark:hover:bg-[#0d1424] transition-colors gap-3 cursor-pointer shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src="/images/uav-corridor-ortho.jpg"
                  alt="Milepost 0-30 Digboi Corridor"
                  className="w-14 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">Milepost 00.0 → 30.0 (Digboi Terminal Origin)</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Spread A: Trenching, Lowering & Padding complete. Pre-commission ready.</span>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 font-mono text-[11px] shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">+2.0 Days Float</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-[10px]">Progress: 98.4%</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-semibold">OPTIMAL</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl border-l-4 border-l-rose-600 border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/25 hover:bg-rose-50 dark:hover:bg-rose-950/35 transition-colors gap-3 cursor-pointer shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src="/images/pipeline-drone-4k.jpg"
                  alt="Milepost 30-65 Burhi Dihing Basin"
                  className="w-14 h-12 rounded-lg object-cover border border-rose-200 dark:border-rose-800/60 shrink-0 shadow-2xs"
                />
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 animate-pulse"></span>
                    <span className="font-mono text-xs font-semibold text-rose-950 dark:text-rose-200">Milepost 30.0 → 65.0 (Burhi Dihing Basin)</span>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-semibold shadow-xs">CRITICAL PATH</span>
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">Hard rock strata at KM 42+650. Automated orbital welding head misalignment at MP 62 tie-in.</span>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 font-mono text-[11px] shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t border-rose-100 dark:border-slate-800 md:border-t-0">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-rose-700 dark:text-rose-400 font-semibold">-4.2 Days Slip</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-[10px]">Progress: 52.1%</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-semibold">BOTTLENECK</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070c16] hover:bg-slate-50 dark:hover:bg-[#0d1424] transition-colors gap-3 cursor-pointer shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src="/images/dry-haul-survey.jpg"
                  alt="Milepost 65-100 Tea Garden Corridor"
                  className="w-14 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">Milepost 65.0 → 100.0 (Tea Garden Reserve Corridor)</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Monsoon mud inundation at culvert crossings. Earthworks de-watering active.</span>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 font-mono text-[11px] shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">0.0d Float (Amber)</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-[10px]">Progress: 64.8%</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-semibold">WEATHER WATCH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Machinery Deployment Status with Pictures (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col p-5 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md justify-between hover-elevate transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 dark:text-sky-400 text-[20px]">precision_manufacturing</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Key Machinery Live Status</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111a2d] border border-slate-200 dark:border-slate-800 font-mono text-[10px] font-semibold text-slate-700 dark:text-amber-400">TELEMETRY</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Machine 1: Komatsu PC300 with Photo */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070c16] flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/pipeline-ortho-survey.jpg"
                      alt="Komatsu PC300 Excavator"
                      className="w-10 h-9 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">Komatsu PC300-8M0</span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-medium">HE-04 • SPREAD 2</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-semibold">92% UTIL</span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Assigned: Rock Trenching KM 42+650. Ripper attachment engaged.</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-0.5 border border-slate-200 dark:border-slate-800">
                  <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              {/* Machine 2: CRC-Evans M-300 with Photo */}
              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/ndt-film-scan.jpg"
                      alt="CRC-Evans Orbital Welding Rig"
                      className="w-10 h-9 rounded object-cover border border-rose-200 dark:border-rose-800/60 shrink-0 shadow-2xs"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">CRC-Evans M-300 System</span>
                      <span className="font-mono text-[10px] text-rose-800 dark:text-rose-400 font-semibold">AUTOMATIC ORBITAL WELD</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 font-mono text-[10px] font-semibold">CALIBRATION REQ</span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Assigned: MP 62 Mainline Tie-in. Root-pass weld drift detected (0.4mm).</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-0.5 border border-slate-200 dark:border-slate-800">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              {/* Machine 3: Herrenknecht HDD with Photo */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070c16] flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/pipeline-drone-4k.jpg"
                      alt="Herrenknecht HK250 HDD Rig"
                      className="w-10 h-9 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">Herrenknecht HK250 Rig</span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-medium">HDD RIVER CROSSING</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-sky-950/60 border border-blue-200 dark:border-sky-500/40 text-blue-800 dark:text-sky-300 font-mono text-[10px] font-semibold">100% STANDBY</span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Assigned: Burhi Dihing Crossing #2. Pilot bore completed successfully.</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-0.5 border border-slate-200 dark:border-slate-800">
                  <div className="bg-blue-600 dark:bg-sky-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Contractor Variance & Commercial Compliance Table */}
      <div className="animate-entrance delay-4 p-5 rounded-2xl bg-white dark:bg-[#0b111e] border border-slate-300 dark:border-amber-500/20 shadow-md hover-elevate transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 dark:text-sky-400 text-[20px]">engineering</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Contractor Schedule Variance & Commercial Compliance</span>
          </div>
          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#111a2d] border border-slate-200 dark:border-slate-800">Oracle Contract Baseline v4.8</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-[#060a14] text-slate-700 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Contractor EPC Agency</th>
                <th className="py-2.5 px-3">Scope Sector</th>
                <th className="py-2.5 px-3">SPI</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Contract Value</th>
                <th className="py-2.5 px-3">Disputes</th>
                <th className="py-2.5 px-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-[#0c1424] transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 font-sans">Larsen & Toubro Hydrocarbon</td>
                <td className="py-3 px-3">Spread 1 (MP 0-30)</td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">1.04</td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-medium">+1.8d Float</td>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">₹184.2 Cr</td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">0 Active</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-semibold text-[10px]">
                    NOMINAL
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-[#0c1424] transition-colors bg-rose-50/30 dark:bg-rose-950/20">
                <td className="py-3 px-3 font-semibold text-rose-950 dark:text-rose-200 font-sans">Punj Lloyd Pipeline Div</td>
                <td className="py-3 px-3">Spread 2 (MP 30-65)</td>
                <td className="py-3 px-3 text-rose-700 dark:text-rose-400 font-semibold">0.88</td>
                <td className="py-3 px-3 text-rose-700 dark:text-rose-400 font-semibold">-4.2d Slip</td>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">₹142.6 Cr</td>
                <td className="py-3 px-3 text-rose-700 dark:text-rose-400 font-semibold">2 Claims</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 font-semibold text-[10px]">
                    ROOT PASS DRIFT
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-[#0c1424] transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 font-sans">Kalpataru Projects Intl</td>
                <td className="py-3 px-3">Spread 3 (MP 65-100)</td>
                <td className="py-3 px-3 text-amber-700 dark:text-amber-400 font-semibold">0.99</td>
                <td className="py-3 px-3 text-amber-700 dark:text-amber-400 font-medium">-0.4d Float</td>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">₹94.0 Cr</td>
                <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">0 Active</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 font-semibold text-[10px]">
                    WEATHER CAUTION
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
