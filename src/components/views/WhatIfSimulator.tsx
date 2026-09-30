import React, { useState } from 'react';
import { useApp } from '../../services/store';

export const WhatIfSimulator: React.FC = () => {
  const { currentWhatIf, updateWhatIfParams, setActiveTab } = useApp();

  // Parameter state
  const [ripperUnits, setRipperUnits] = useState<number>(2);
  const [dualShift, setDualShift] = useState<boolean>(true);
  const [rainfall, setRainfall] = useState<number>(75);
  const [directiveGenerated, setDirectiveGenerated] = useState<boolean>(false);
  const [exportingXer, setExportingXer] = useState<boolean>(false);

  // Financial calculations
  const ripperCost = ripperUnits * 19.25; // in Lakhs
  const shiftCost = dualShift ? 24.0 : 0.0;
  const totalSurgeCost = ripperCost + shiftCost;
  const avoidedLd = 210.0; // 2.10 Cr = 210 Lakhs
  const netPreservedLakhs = avoidedLd - totalSurgeCost;
  const netPreservedCrore = (netPreservedLakhs / 100).toFixed(3);
  const roi = totalSurgeCost > 0 ? (avoidedLd / totalSurgeCost).toFixed(2) : '3.36';

  // Float calculations
  const ripperFloat = ripperUnits * 1.4;
  const shiftGain = dualShift ? 1.9 : 0.0;
  const rainDelay = ((rainfall - 20) * 0.05).toFixed(1);
  const netFloatRecovered = (ripperFloat + shiftGain - parseFloat(rainDelay)).toFixed(1);

  const handleAdjustRipper = (delta: number) => {
    setRipperUnits((prev) => Math.max(0, Math.min(4, prev + delta)));
  };

  const handleDirective = () => {
    setDirectiveGenerated(true);
    setTimeout(() => {
      alert('P6 Change Directive (Form 14-B) generated and cryptographically signed. WBS Node ACT-TR-4290 amended in EPPM buffer.');
    }, 400);
  };

  const handleExportXer = () => {
    setExportingXer(true);
    setTimeout(() => {
      setExportingXer(false);
      const xerData = `ERPROJECT\nOIL_TRUNK_REV4.9_C03\nACT_TR_4290\tTrenching & Lowering\tFloat: +${netFloatRecovered}d\tSurgeCost: ₹${totalSurgeCost}L`;
      const blob = new Blob([xerData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'OIL_TRUNK_REV4.9_C03.xer';
      a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* TOP BAR: BREADCRUMB, STATUS & SCENARIO ACTION HEADER */}
      <section className="bg-white p-4 rounded shadow-xs border border-slate-200 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              ANALYTICS &amp; MEMORY
            </span>
            <span className="text-slate-300 font-mono text-[10px]">/</span>
            <span className="font-mono text-[10px] text-blue-700 font-semibold tracking-wider">
              WHAT-IF SCHEDULE &amp; COST PERTURBATION SANDBOX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-semibold shadow-2xs border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              CONVERGED (10,000 MONTE CARLO)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-blue-700 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">memory</span>
              DIGBOI-STOCHASTIC-CORE // REV-4.8
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg text-slate-900 font-bold tracking-tight">
                SCENARIO C-03: Deploy Auxiliary Ripper at KM 42+650 + Re-sequence Trenching Padding
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold shadow-2xs">
                +{netFloatRecovered}d FLOAT RECOVERED
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Simulating hard rock excavation acceleration vs monsoon front trajectory with orbital welding dual-shift mitigation.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('GANTT_TWIN')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-800 font-mono text-xs font-semibold shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-500">compare_arrows</span>
              Compare vs P6 Baseline
            </button>
            <button
              type="button"
              onClick={() => alert('Sensitivity Tornado coefficients re-calculated based on live site telemetry.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-800 font-mono text-xs font-semibold shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-500">tornado</span>
              Tornado Sensitivity
            </button>
            <button
              type="button"
              onClick={() => alert('Scenario C-03 successfully saved as Candidate Revision 4.9 in Oracle EPPM.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-mono text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
              Save as Rev 4.9 Candidate
            </button>
          </div>
        </div>
      </section>

      {/* PARAMETER COCKPIT: 4 CLEAN TECHNICAL CONTROL CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Parameter 01: Critical Path */}
        <div className="bg-white p-3.5 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 font-bold tracking-wider">
                PARAM 01 // CRITICAL PATH
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                +{ripperFloat.toFixed(1)}d FLOAT
              </span>
            </div>
            <div className="text-sm text-slate-900 font-semibold">Auxiliary Ripper Allocation</div>
            <p className="text-xs text-slate-600">
              Komatsu PC300 Hydraulic with rock chisel for KM 42+650 hard shale segment.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-blue-100 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-600 font-semibold">FLEET ASSETS:</span>
              <span className="text-slate-900 font-bold font-mono text-xs text-blue-700">
                +{ripperUnits} UNITS ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjustRipper(-1)}
                className="w-7 h-7 rounded bg-white border border-slate-200 shadow-2xs text-slate-900 font-mono font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
              >
                -
              </button>
              <input
                type="range"
                min="0"
                max="4"
                value={ripperUnits}
                onChange={(e) => setRipperUnits(Number(e.target.value))}
                className="w-full accent-blue-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleAdjustRipper(1)}
                className="w-7 h-7 rounded bg-white border border-slate-200 shadow-2xs text-slate-900 font-mono font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-slate-500">
              <span>MOBILIZATION COST:</span>
              <span className="font-bold text-slate-900 font-mono">+₹{ripperCost.toFixed(1)} Lakhs</span>
            </div>
          </div>
        </div>

        {/* Parameter 02: Manpower Dual-Shift */}
        <div className="bg-white p-3.5 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 font-bold tracking-wider">
                PARAM 02 // MANPOWER
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                +{shiftGain.toFixed(1)}d GAIN
              </span>
            </div>
            <div className="text-sm text-slate-900 font-semibold">Orbital Welding Dual-Shift</div>
            <p className="text-xs text-slate-600">
              Night shift activation: 19:00 - 04:00 with specialized LED lighting towers.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-blue-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-600 font-semibold">DUAL-SHIFT WELDING:</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dualShift}
                  onChange={(e) => setDualShift(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-700 transition-colors duration-200"></div>
                <div
                  className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 shadow-sm border border-slate-200 transition-transform duration-200 ${
                    dualShift ? 'translate-x-5' : ''
                  }`}
                ></div>
              </label>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>NDT DEFECT RISK:</span>
              <span className="text-amber-700 font-bold font-mono">
                {dualShift ? '+1.2% (NDT Acceptable)' : '0.0% Nominal'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-slate-500">
              <span>OVERTIME SURCHARGE:</span>
              <span className="font-bold text-slate-900 font-mono">+₹{shiftCost.toFixed(1)} Lakhs / Mo</span>
            </div>
          </div>
        </div>

        {/* Parameter 03: Meteorology */}
        <div className="bg-white p-3.5 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-3 hover:border-amber-300 transition-all">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 font-bold tracking-wider">
                PARAM 03 // METEOROLOGY
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                -{rainDelay}d DELAY
              </span>
            </div>
            <div className="text-sm text-slate-900 font-semibold">Monsoon Saturation Event</div>
            <p className="text-xs text-slate-600">
              Simulated extreme precipitation window across Brahmaputra valley basin.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-blue-100 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-600 font-semibold">RAINFALL DENSITY:</span>
              <span className="text-rose-700 font-bold font-mono">{rainfall}mm / 24HR</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full accent-rose-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-slate-500">
              <span>SOIL BEARING LOAD:</span>
              <span className="font-bold text-amber-800 font-mono">
                {rainfall > 80 ? '95 kPa (Severely Degraded)' : '120 kPa (Degraded)'}
              </span>
            </div>
          </div>
        </div>

        {/* Parameter 04: River Crossing Milestone */}
        <div className="bg-white p-3.5 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 font-bold tracking-wider">
                PARAM 04 // MILESTONE LOCK
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold flex items-center gap-1 shadow-2xs">
                <span className="material-symbols-outlined text-[11px]">lock</span> LOCKED
              </span>
            </div>
            <div className="text-sm text-slate-900 font-semibold">River HDD Pullback Window</div>
            <p className="text-xs text-slate-600">
              Burhi Dihing flood discharge threshold requires pullback completion prior to crest.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-blue-100 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-500">ORIGINAL BASELINE:</span>
              <span className="text-slate-500 line-through font-mono font-medium">12 Nov 2024</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-600 font-semibold">COMPRESSED TARGET:</span>
              <span className="text-blue-700 font-bold font-mono">08 Nov 2024</span>
            </div>
            <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-slate-500">
              <span>HYDROLOGIC BUFFER:</span>
              <span className="font-bold text-emerald-700 font-mono">+4 Calendar Days</span>
            </div>
          </div>
        </div>
      </section>

      {/* MID SECTION SPLIT: 65% DUAL-GANTT TIMELINE vs 35% TORNADO DRIVERS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT CARD: DUAL-GANTT TIMELINE (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-4 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">waterfall_chart</span>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-900 font-bold">Dual-Gantt Timeline Perturbation Model</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    P6 BASELINE REV 4.8 vs STOCHASTIC SCENARIO C-03 RUN
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1.5 rounded-xs bg-slate-300"></span>
                  <span className="text-slate-600">Baseline Path</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-2 rounded-xs bg-blue-700"></span>
                  <span className="text-blue-700 font-bold">Scenario C-03</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rotate-45 bg-emerald-600"></span>
                  <span className="text-emerald-700 font-bold">Milestone Win</span>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-slate-50 px-3 py-2 rounded flex items-center justify-between text-slate-900 font-mono text-[10px] border border-blue-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[18px]">verified</span>
                <span>Deterministic Critical Path safely bypassed at KM 42+650. Schedule float regained across 3 downstream chains.</span>
              </div>
              <span className="font-bold text-blue-700 font-mono shrink-0">94.2% CONFIDENCE</span>
            </div>
          </div>

          {/* Gantt Canvas */}
          <div className="flex flex-col gap-3.5 pt-1">
            <div className="grid grid-cols-12 gap-1 text-center font-mono text-[10px] text-slate-500 bg-slate-50 py-1.5 px-2 rounded border border-blue-100">
              <div className="col-span-4 text-left font-semibold">ACTIVITY / WBS NODE</div>
              <div className="col-span-2">OCT W3</div>
              <div className="col-span-2">OCT W4</div>
              <div className="col-span-2">NOV W1</div>
              <div className="col-span-2 font-bold text-blue-700">NOV W2 [CRITICAL]</div>
            </div>

            {/* Activity 1 */}
            <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded border border-slate-200">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700">ACT-TR-4290</span>
                  <span className="font-semibold text-slate-900">Trenching &amp; Lowering (KM 42-48 Hard Rock)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  +{netFloatRecovered}d Buffer Secured
                </span>
              </div>
              <div className="relative w-full h-5 bg-slate-200 rounded overflow-hidden flex items-center">
                <div className="absolute left-[8%] w-[68%] h-3 bg-slate-400/50 rounded-xs flex items-center px-2">
                  <span className="text-[9px] font-mono text-slate-600 font-semibold">Rev 4.8: -4.2d Critical Slip (Baseline)</span>
                </div>
              </div>
              <div className="relative w-full h-6 bg-slate-200 rounded overflow-hidden flex items-center">
                <div className="absolute left-[8%] w-[52%] h-4 bg-blue-700 rounded-xs flex items-center justify-between px-2 text-white">
                  <span className="text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">speed</span>
                    C-03: Expedited Float +{netFloatRecovered}d
                  </span>
                  <span className="text-[9px] font-mono opacity-80">Ripper + Dual Shift</span>
                </div>
                <div className="absolute left-[60%] w-[16%] h-4 bg-emerald-500/20 rounded-xs flex items-center px-1">
                  <span className="text-[9px] font-mono text-emerald-800 font-bold">Saved 6.0d</span>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded border border-slate-200">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700">ACT-HD-1024</span>
                  <span className="font-semibold text-slate-900">Burhi Dihing River HDD Crossing (1,240m Section)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Compressed to 08-Nov
                </span>
              </div>
              <div className="relative w-full h-5 bg-slate-200 rounded overflow-hidden flex items-center">
                <div className="absolute left-[38%] w-[50%] h-3 bg-slate-400/50 rounded-xs flex items-center px-2">
                  <span className="text-[9px] font-mono text-slate-600 font-semibold">12-Nov Pullback Window End</span>
                </div>
              </div>
              <div className="relative w-full h-6 bg-slate-200 rounded overflow-hidden flex items-center">
                <div className="absolute left-[34%] w-[42%] h-4 bg-blue-700 rounded-xs flex items-center justify-between px-2 text-white">
                  <span className="text-[10px] font-mono font-bold">Pilot Rig Dual Crew Ready</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-200">08-Nov Target</span>
                </div>
                <div className="absolute left-[76%] w-2.5 h-2.5 rotate-45 bg-emerald-600 shadow-2xs" title="Milestone Met"></div>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded border border-slate-200">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700">MLS-TI-04</span>
                  <span className="font-semibold text-slate-900">Golden Tie-In &amp; Hydrotest Hydrostatic Pack</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  LD Risk Eliminated
                </span>
              </div>
              <div className="relative w-full h-5 bg-slate-200 rounded overflow-hidden flex items-center">
                <div className="absolute left-[70%] w-[28%] h-3 bg-rose-200 rounded-xs flex items-center px-2">
                  <span className="text-[9px] font-mono text-rose-800 font-semibold">Contract Breach Risk (28-Nov)</span>
                </div>
              </div>
              <div className="relative w-full h-6 bg-slate-200 rounded overflow-hidden flex items-center">
                <div className="absolute left-[64%] w-[20%] h-4 bg-emerald-600 rounded-xs flex items-center px-2 text-white">
                  <span className="text-[10px] font-mono font-bold">24-Nov P85 Completion</span>
                </div>
                <div className="absolute left-[84%] -top-1 bottom-0 flex items-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500 font-mono text-[10px]">
            <span>P6 EPPM NETWORK ENGINE // CPM METHODOLOGY: FORWARD PASS / BACKWARD PASS DETERMINISTIC</span>
            <span className="text-blue-700 font-bold">P6 ACTIVITY RE-CALCULATION DURATION: 18ms</span>
          </div>
        </div>

        {/* RIGHT CARD: SENSITIVITY TORNADO DRIVERS (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">tornado</span>
                <span className="text-sm text-slate-900 font-bold">Sensitivity Tornado Drivers</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">RANKED BY VARIANCE</span>
            </div>
            <p className="text-xs text-slate-600">Primary schedule perturbation coefficients affecting overall commissioning milestone.</p>
          </div>

          {/* Tornado Horizontal Bars */}
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 px-2">
              <span>-5d (OPTIMISTIC)</span>
              <span className="font-bold text-slate-900">BASELINE (0d)</span>
              <span>+5d (PESSIMISTIC)</span>
            </div>

            {/* Factor 1 */}
            <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded border border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-slate-900">1. Hard Rock Ripper Penetration</span>
                <span className="font-mono font-bold text-blue-700">±4.6 Days</span>
              </div>
              <div className="relative w-full h-4 bg-slate-200 rounded flex items-center">
                <div className="w-1/2 flex justify-end">
                  <div className="tornado-bar-left h-3 bg-emerald-600 rounded-l" style={{ width: '92%' }}></div>
                </div>
                <div className="w-0.5 h-4 bg-slate-600 z-10"></div>
                <div className="w-1/2 flex justify-start">
                  <div className="tornado-bar-right h-3 bg-rose-600 rounded-r" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Komatsu Ripping Rate</span>
                <span>Unconfined Compressive Str.</span>
              </div>
            </div>

            {/* Factor 2 */}
            <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded border border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-slate-900">2. Burhi Dihing HDD Reaming Stability</span>
                <span className="font-mono font-bold text-blue-700">±3.8 Days</span>
              </div>
              <div className="relative w-full h-4 bg-slate-200 rounded flex items-center">
                <div className="w-1/2 flex justify-end">
                  <div className="tornado-bar-left h-3 bg-emerald-600 rounded-l" style={{ width: '76%' }}></div>
                </div>
                <div className="w-0.5 h-4 bg-slate-600 z-10"></div>
                <div className="w-1/2 flex justify-start">
                  <div className="tornado-bar-right h-3 bg-rose-600 rounded-r" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Bentonite Gel Pressure</span>
                <span>Fracture Zone Ingress</span>
              </div>
            </div>

            {/* Factor 3 */}
            <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded border border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-slate-900">3. API 5L X70 Pipe String Freight</span>
                <span className="font-mono font-bold text-blue-700">±2.4 Days</span>
              </div>
              <div className="relative w-full h-4 bg-slate-200 rounded flex items-center">
                <div className="w-1/2 flex justify-end">
                  <div className="tornado-bar-left h-3 bg-emerald-600 rounded-l" style={{ width: '48%' }}></div>
                </div>
                <div className="w-0.5 h-4 bg-slate-600 z-10"></div>
                <div className="w-1/2 flex justify-start">
                  <div className="tornado-bar-right h-3 bg-rose-600 rounded-r" style={{ width: '48%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Kolkata Port Clearance</span>
                <span>Rail Siding Congestion</span>
              </div>
            </div>

            {/* Factor 4 */}
            <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded border border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-slate-900">4. NDT Radiography Clearance Speed</span>
                <span className="font-mono font-bold text-blue-700">±1.5 Days</span>
              </div>
              <div className="relative w-full h-4 bg-slate-200 rounded flex items-center">
                <div className="w-1/2 flex justify-end">
                  <div className="tornado-bar-left h-3 bg-emerald-600 rounded-l" style={{ width: '30%' }}></div>
                </div>
                <div className="w-0.5 h-4 bg-slate-600 z-10"></div>
                <div className="w-1/2 flex justify-start">
                  <div className="tornado-bar-right h-3 bg-rose-600 rounded-r" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Level III Inspector Turn</span>
                <span>Film Digitization Lead</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-blue-100 flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-600 font-semibold">TORNADO SENSITIVITY COEFFICIENT (R²):</span>
            <span className="font-bold text-slate-900 font-mono">0.891 (STRONG)</span>
          </div>
        </div>
      </section>

      {/* LOWER SECTION SPLIT: 60% MONTE CARLO PDF vs 40% VALUE PRESERVATION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT CARD: MONTE CARLO (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-4 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 text-[20px]">analytics</span>
              <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">Monte Carlo Probability Density Function</span>
                <span className="font-mono text-[10px] text-slate-500">
                  10,000 ITERATIONS RUN ON DIGBOI P6 LIVE NETWORK
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
              NORMAL-LOG LOGISTIC
            </span>
          </div>

          {/* Gaussian Distribution SVG Curve */}
          <div className="relative w-full h-48 bg-slate-50/50 rounded p-3 flex flex-col justify-end overflow-hidden shadow-2xs border border-slate-200">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 160">
              <defs>
                <linearGradient id="curveShimmer" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#eff4ff" stopOpacity="0.3"></stop>
                  <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.75"></stop>
                  <stop offset="100%" stopColor="#eff4ff" stopOpacity="0.3"></stop>
                </linearGradient>
              </defs>
              <line x1="0" x2="500" y1="40" y2="40" stroke="#e2e8f0" strokeDasharray="3,3" strokeWidth="1"></line>
              <line x1="0" x2="500" y1="80" y2="80" stroke="#e2e8f0" strokeDasharray="3,3" strokeWidth="1"></line>
              <line x1="0" x2="500" y1="120" y2="120" stroke="#e2e8f0" strokeDasharray="3,3" strokeWidth="1"></line>
              <path d="M 40,150 Q 150,150 200,90 T 260,25 T 320,80 T 360,110 L 360,150 Z" fill="url(#curveShimmer)"></path>
              <path d="M 40,150 Q 150,150 200,90 T 260,25 T 320,80 T 420,145 L 480,150" fill="none" stroke="#1d4ed8" strokeWidth="2.5"></path>
              <line x1="260" x2="260" y1="20" y2="150" stroke="#1d4ed8" strokeDasharray="4,2" strokeWidth="1.5"></line>
              <circle cx="260" cy="25" fill="#1d4ed8" r="4"></circle>
              <line x1="360" x2="360" y1="80" y2="150" stroke="#059669" strokeWidth="2"></line>
              <circle cx="360" cy="110" fill="#059669" r="4.5" stroke="#ffffff" strokeWidth="1.5"></circle>
              <line x1="450" x2="450" y1="130" y2="150" stroke="#b91c1c" strokeDasharray="2,2" strokeWidth="1.5"></line>
              <circle cx="450" cy="148" fill="#b91c1c" r="3"></circle>
            </svg>

            {/* Dynamic Labels Overlay */}
            <div className="absolute top-4 left-[46%] -translate-x-1/2 flex flex-col items-center">
              <span className="px-1.5 py-0.5 rounded bg-blue-700 text-white font-mono text-[10px] font-bold shadow-xs">
                P50: 12 NOV
              </span>
              <span className="text-[9px] font-mono text-slate-500">Most Likely</span>
            </div>
            <div className="absolute top-12 left-[68%] -translate-x-1/2 flex flex-col items-center">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>P85: 24 NOV</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-800 font-bold bg-white/90 px-1 rounded shadow-2xs mt-0.5">
                Contract Goal (94.2%)
              </span>
            </div>
            <div className="absolute top-24 left-[86%] -translate-x-1/2 flex flex-col items-center">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold shadow-xs">
                P99: 15 JAN
              </span>
              <span className="text-[9px] font-mono text-rose-700">Tail-Risk</span>
            </div>
          </div>

          {/* Probability Milestone Summary Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono text-[10px]">
            <div className="bg-slate-50 p-2 rounded border border-blue-100 flex flex-col gap-0.5">
              <span className="text-slate-500">P50 BASELINE ESTIMATE</span>
              <span className="text-sm font-bold text-slate-900 font-mono">12 NOV 2025</span>
              <span className="text-blue-700 font-semibold">Kurtosis: 3.12 (Normal)</span>
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-200 flex flex-col gap-0.5 shadow-2xs">
              <span className="text-emerald-800 font-semibold">P85 COMMODITY WINDOW</span>
              <span className="text-sm font-bold text-emerald-900 font-mono">24 NOV 2025</span>
              <span className="text-emerald-700 font-bold">94.2% In-Budget Target</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-blue-100 flex flex-col gap-0.5">
              <span className="text-slate-500">P99 EXTREME TAIL</span>
              <span className="text-sm font-bold text-rose-700 font-mono">15 JAN 2026</span>
              <span className="text-rose-700 font-semibold">Risk Exposure: 4.8%</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: EXECUTIVE VALUE PRESERVATION (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded shadow-xs border border-slate-200 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700 text-[20px]">account_balance</span>
              <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">Executive Value Preservation</span>
                <span className="font-mono text-[10px] text-slate-500">CONTRACT ARBITRAGE CALCULATOR</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold shadow-2xs border border-emerald-200">
              ROI {roi}x
            </span>
          </div>

          {/* Financial Metrics Stack */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-blue-100 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[16px]">add_circle</span>
                <span className="text-slate-600">Surge Execution Cost (Aux Ripper + W12)</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-xs">₹{totalSurgeCost.toFixed(1)} Lakhs</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-blue-100 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[16px]">shield_with_heart</span>
                <span className="text-slate-600">Avoided LD Penalties (Clause 48.2)</span>
              </div>
              <span className="font-bold font-mono text-emerald-700 text-xs">₹2.10 Crore</span>
            </div>

            {/* Net Calculation Pill */}
            <div className="flex items-center justify-between p-3 rounded bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[11px]">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">NET ECONOMIC VALUE PRESERVED</span>
                <span className="text-[10px] text-slate-500">Float recovery ratio +4.8x investment</span>
              </div>
              <span className="text-lg font-bold text-blue-700 font-mono">
                +₹{netPreservedCrore} Crore
              </span>
            </div>
          </div>

          {/* Recommendation Callout */}
          <div className="bg-slate-50 p-2.5 rounded border border-blue-100 flex items-start gap-2 text-xs text-slate-700">
            <span className="material-symbols-outlined text-blue-700 text-[18px] shrink-0 mt-0.5">lightbulb</span>
            <div>
              <span className="font-semibold text-slate-900">Engineering Intelligence:</span> Proceed with Scenario C-03 mobilization immediately. Re-deployment eliminates ₹35K/hr equipment standby burn at golden tie-in base.
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleDirective}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded text-white font-mono text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                directiveGenerated ? 'bg-emerald-600' : 'bg-blue-700 hover:bg-blue-800 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {directiveGenerated ? 'done_all' : 'draw'}
              </span>
              <span>
                {directiveGenerated ? 'Directive Generated & Signed' : 'Generate P6 Change Directive (Form 14-B)'}
              </span>
            </button>
            <button
              type="button"
              disabled={exportingXer}
              onClick={handleExportXer}
              className="inline-flex items-center justify-center px-3 py-2 rounded bg-white text-slate-800 font-mono text-xs font-semibold shadow-xs border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${exportingXer ? 'animate-spin' : ''}`}>
                {exportingXer ? 'sync' : 'download'}
              </span>
              <span>Export Raw XER</span>
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM BAR: TELEMETRY RUNTIME METADATA & REPRODUCIBILITY */}
      <section className="bg-white px-4 py-2.5 rounded shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-500 font-mono text-[10px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-slate-800 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            SANDBOX AIR-GAP ISOLATED
          </span>
          <span className="text-slate-300">•</span>
          <span>RUNTIME SEED: <span className="font-mono text-slate-800 font-bold">0xDEADBEEF4829</span></span>
          <span className="text-slate-300">•</span>
          <span>GPU ACCELERATED EXECUTION: <span className="font-mono text-slate-800 font-bold">1.42s</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span>DIGBOI COMPLIANCE HASH: <span className="font-mono text-blue-700 font-bold">e7c1...89b4 (SHA-256 VALIDATED)</span></span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            READY TO COMMIT
          </span>
        </div>
      </section>
    </div>
  );
};
