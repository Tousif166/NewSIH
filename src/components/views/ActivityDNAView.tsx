import React, { useState } from 'react';
import { useApp } from '../../services/store';

export const ActivityDNAView: React.FC = () => {
  const { showToast } = useApp();
  const [selectedDiscipline, setSelectedDiscipline] = useState<'ALL' | 'TRENCH' | 'WELD' | 'HDD'>('ALL');
  const [selectedCase, setSelectedCase] = useState<number | null>(0);
  const [activeTooltip, setActiveTooltip] = useState<{ day: string; km: string; val: string } | null>(null);

  const handleExportCSV = () => {
    showToast('Exporting Historical DNA Corpus (.CSV)...', 'info');
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Top Command & Header Zone */}
      <div className="flex flex-col gap-3">
        {/* Breadcrumb & System State */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Analytics & Memory</span>
            <span className="text-slate-300 font-mono text-[10px]">/</span>
            <span className="font-mono text-[10px] text-blue-700 font-semibold uppercase tracking-wider">
              Activity DNA & Historical Ground Truth
            </span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              SHA-256 VERIFIED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-slate-500">CORPUS INGEST LATENCY: 22ms</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-mono text-[10px] text-slate-900 font-semibold">EPOCH 2025.04_v2</span>
          </div>
        </div>

        {/* Title and Action Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-300 shadow-xs hover-elevate">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-700 flex items-center justify-center text-white transition-transform hover:rotate-6 duration-200 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">biotech</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">Digboi–Duliajan 132km Trunkline Engine</h1>
              <p className="font-mono text-[10px] text-slate-500 font-semibold">
                CALIBRATED ON-THE-FLY AGAINST 11 MAJOR UPSTREAM PIPELINE SECTORS
              </p>
            </div>
          </div>

          {/* Controls & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value as any)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 font-mono text-xs font-semibold py-1.5 pl-3 pr-8 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="ALL">All Disciplines & Sectors</option>
                <option value="TRENCH">Trenching & Rock Blasting</option>
                <option value="WELD">CRC-Evans Orbital Welding</option>
                <option value="HDD">HDD Riverbed Crossing</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 text-[14px] text-slate-500 pointer-events-none">
                expand_more
              </span>
            </div>

            <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs text-slate-700 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-slate-500 mr-1.5">date_range</span>
              2014–2025 ALL CYCLES
            </div>

            <div className="flex items-center bg-blue-50 border border-blue-200 px-2 py-1.5 rounded gap-1 cursor-default">
              <span className="font-mono text-[10px] text-blue-700 font-bold">.ONNX WEIGHTS</span>
              <span className="font-mono text-[10px] text-slate-500">(v14.9)</span>
            </div>

            <button
              onClick={handleExportCSV}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-mono text-xs font-semibold shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>EXPORT CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corpus Intelligence Vitals (4 Metric Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-300 flex flex-col justify-between hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">Corpus Depth</span>
            <span className="material-symbols-outlined text-[18px] text-blue-700">database</span>
          </div>
          <div className="mt-2">
            <div className="font-bold text-slate-900 text-2xl font-mono">
              48,240 <span className="text-xs font-semibold text-slate-500">SHIFTS</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Brahmaputra Floodplain & Naga Hill Footwall empirical records.</p>
          </div>
          <div className="mt-3 pt-2 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[10px]">
            <span>SIG HASH</span>
            <span className="text-slate-900 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              0x4d7A...E891
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-300 flex flex-col justify-between hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">Prediction Confidence</span>
            <span className="material-symbols-outlined text-[18px] text-blue-700">speed</span>
          </div>
          <div className="mt-2">
            <div className="font-bold text-slate-900 text-2xl font-mono">
              ±18m/d <span className="text-xs font-semibold text-slate-500">MAE</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">97.4% NOMINAL across alluvial sectors; Naga hills under recalibration.</p>
          </div>
          <div className="mt-3 pt-2 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[10px]">
            <span>DRIFT INDEX</span>
            <span className="text-emerald-700 font-bold">0.021 (HEALTHY)</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-300 flex flex-col justify-between hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">Strata Resistance</span>
            <span className="material-symbols-outlined text-[18px] text-rose-600">terrain</span>
          </div>
          <div className="mt-2">
            <div className="font-bold text-rose-600 text-2xl font-mono">
              -46.2% <span className="text-xs font-semibold text-slate-500">vs ALLUVIUM</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">1.84x DRAG: Granitic Gneiss at Duliajan Formation KM 38–54.</p>
          </div>
          <div className="mt-3 pt-2 bg-rose-50 px-2 py-1 rounded border border-rose-100 flex items-center justify-between text-rose-900 font-mono text-[10px]">
            <span>UCS STRENGTH</span>
            <span className="font-bold">142.6 MPa (HARD)</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-300 flex flex-col justify-between hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">Anomaly Patterns</span>
            <span className="material-symbols-outlined text-[18px] text-blue-700">auto_fix_high</span>
          </div>
          <div className="mt-2">
            <div className="font-bold text-slate-900 text-2xl font-mono">
              14 <span className="text-xs font-semibold text-slate-500">PREVENTION MODES</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Monsoon slurry influx & Crawler track drift patterns cataloged.</p>
          </div>
          <div className="mt-3 pt-2 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center justify-between text-blue-700 font-mono text-[10px]">
            <span className="font-semibold">PRECEDENT RETRIEVAL</span>
            <span className="font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              AUTO-LINKED
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Activity Productivity DNA Velocity Curves */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-300 flex flex-col gap-4 hover-elevate">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 bg-slate-50 -mx-5 -mt-5 px-5 py-3.5 rounded-t-xl border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-700">timeline</span>
                <span className="font-bold text-slate-900 text-sm tracking-tight">Activity Productivity DNA Velocity Curves</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
                  <span className="w-2.5 h-1 bg-slate-400 rounded"></span> P50 HISTORICAL
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-blue-700 font-semibold">
                  <span className="w-2.5 h-1 bg-blue-700 rounded"></span> PREDICTED
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-900 font-bold">
                  <span className="w-2.5 h-1 bg-slate-900 rounded"></span> CURRENT RUN
                </span>
              </div>
            </div>

            {/* Velocity Benchmarking Cards Grid */}
            <div className="flex flex-col gap-2.5">
              {/* Activity Row 1: Alluvial Loam */}
              {(selectedDiscipline === 'ALL' || selectedDiscipline === 'TRENCH') && (
                <div className="group p-3 bg-slate-50 hover:bg-blue-50/50 rounded flex flex-col gap-2 border border-slate-200/70 hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                        Trenching in Alluvial Loam (Sector 1 to 3)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-mono text-[10px] font-semibold">
                        1,420 PRECEDENT SHIFTS
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-blue-700 font-bold">+3.6% VELOCITY BOOST</span>
                      <span className="text-[10px] text-slate-500">425m/d vs 410m/d P50</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded overflow-hidden flex">
                    <div className="bg-slate-500 h-full" style={{ width: '78%' }}></div>
                    <div className="bg-blue-700 h-full" style={{ width: '8%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>Ground condition: Soft-sandy alluvial matrix</span>
                    <span className="text-blue-700 font-medium">Observed Variance: ±12m/d (Nominal envelope)</span>
                  </div>
                </div>
              )}

              {/* Activity Row 2: Hard Granitic Strata (The Anomaly) */}
              {(selectedDiscipline === 'ALL' || selectedDiscipline === 'TRENCH') && (
                <div className="group p-3 bg-rose-50/40 hover:bg-rose-50/70 rounded flex flex-col gap-2 border border-rose-200 transition-all cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-rose-600 animate-pulse">report_problem</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-rose-700 transition-colors">
                        Trenching in Hard Granitic Strata (REFUSAL KM 42+650)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                        ANOMALY SLIP
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-rose-600 font-bold">-38.8% CRITICAL DRAG</span>
                      <span className="text-[10px] text-slate-800 font-semibold">110m/d vs 180m/d EXPECTED</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded overflow-hidden flex">
                    <div className="bg-rose-600 h-full" style={{ width: '32%' }}></div>
                    <div className="bg-slate-300 h-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1">
                    <span className="text-slate-800">
                      Drill teeth refusal detected: Compressive strength &gt;140 MPa. Flagged: Unpredicted hard basement rock layer.
                    </span>
                    <span className="font-mono text-[10px] text-rose-700 font-semibold flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[13px]">build</span>
                      REC: Ripper Shank Swap (99.2% Conf.)
                    </span>
                  </div>
                </div>
              )}

              {/* Activity Row 3: CRC-Evans M-300 */}
              {(selectedDiscipline === 'ALL' || selectedDiscipline === 'WELD') && (
                <div className="group p-3 bg-slate-50 hover:bg-blue-50/50 rounded flex flex-col gap-2 border border-slate-200/70 hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                        CRC-Evans M-300 Auto Orbital Welding (24" Trunk)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-semibold">
                        GIRTH WELDING AUTO
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-slate-900 font-bold">29.4 joints/d (Var ±3.2)</span>
                      <span className="text-[10px] text-slate-500">Target 35 j/d</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded overflow-hidden flex">
                    <div className="bg-blue-700 h-full" style={{ width: '84%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>Root pass cycle time: 11m 42s avg</span>
                    <span className="text-blue-700 font-semibold">Ultrasonic Defect Rate: 0.38% (Institutional Baseline: 0.85%)</span>
                  </div>
                </div>
              )}

              {/* Activity Row 4: 24" Stringing & Bending */}
              {(selectedDiscipline === 'ALL' || selectedDiscipline === 'TRENCH') && (
                <div className="group p-3 bg-slate-50 hover:bg-blue-50/50 rounded flex flex-col gap-2 border border-slate-200/70 hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                        24" Pipe Stringing & Cold Field Bending
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-semibold">
                        LOGISTICS & ALIGNMENT
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-slate-700 font-bold">545m/d (-12.1% seasonal dip)</span>
                      <span className="text-[10px] text-slate-500">Benchmark 620m/d</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded overflow-hidden flex">
                    <div className="bg-slate-500 h-full" style={{ width: '71%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>Right-of-Way access constrained by heavy pre-monsoon muddy access roads</span>
                    <span className="text-slate-800 font-semibold">Bog mats deployed: 180 panels</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 30-Day Linear Progression Velocity Chart */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-300 flex flex-col gap-3 hover-elevate">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-slate-900 text-sm tracking-tight">
                  30-Day Linear Progression Velocity (Km Advancement vs Shifts)
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  STATION KM 30+000 TO KM 60+000 CHRONOLOGY TELEMETRY
                </span>
              </div>
              <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[10px] font-semibold rounded flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                ANOMALY PINPOINTED KM 42+650
              </span>
            </div>

            {/* Inline Visual Chart Graphic with interactive nodes and animations */}
            <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
              {activeTooltip && (
                <div className="absolute top-2 right-4 bg-white border border-slate-200 text-slate-900 font-mono text-xs px-2.5 py-1 rounded shadow-md z-30 flex items-center gap-2">
                  <span className="text-blue-700 font-bold">{activeTooltip.day}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">{activeTooltip.km}</span>
                  <span className="text-emerald-700 font-bold">{activeTooltip.val}</span>
                </div>
              )}

              <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 160">
                {/* Grid lines */}
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="760" y1="30" y2="30"></line>
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="760" y1="70" y2="70"></line>
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="760" y1="110" y2="110"></line>
                <line stroke="#cbd5e1" strokeWidth="1" x1="0" x2="760" y1="150" y2="150"></line>

                {/* Historical Expected Baseline Curve (Gray dotted) */}
                <path
                  d="M 10 145 Q 200 120 380 80 T 750 20"
                  fill="none"
                  opacity="0.85"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                ></path>

                {/* Predictive AI Model Velocity Curve (Cobalt) */}
                <path
                  d="M 10 145 Q 180 115 360 85 T 750 32"
                  fill="none"
                  stroke="#2151da"
                  strokeWidth="2"
                ></path>

                {/* Real Telemetry Ground Truth Curve (Showing the drop at KM 42+650) */}
                <path
                  d="M 10 145 L 120 130 L 220 112 L 310 95 L 390 88 L 440 92 L 490 94 L 540 85 L 620 70 L 710 52"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3"
                ></path>

                {/* Interactive Telemetry Data Points */}
                {[
                  { cx: 120, cy: 130, day: 'Day 10', km: 'KM 36.8', val: '380m/d' },
                  { cx: 220, cy: 112, day: 'Day 14', km: 'KM 39.5', val: '395m/d' },
                  { cx: 310, cy: 95, day: 'Day 17', km: 'KM 41.8', val: '320m/d' },
                  { cx: 490, cy: 94, day: 'Day 22', km: 'KM 44.1', val: '140m/d (Shank Replace)' },
                  { cx: 620, cy: 70, day: 'Day 26', km: 'KM 48.0', val: '285m/d (Restored)' },
                  { cx: 710, cy: 52, day: 'Day 30', km: 'KM 52.4', val: '310m/d' }
                ].map((pt, idx) => (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveTooltip({ day: pt.day, km: pt.km, val: pt.val })}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <circle cx={pt.cx} cy={pt.cy} fill="#0f172a" r="3.5" className="hover:r-5 transition-all"></circle>
                    <circle cx={pt.cx} cy={pt.cy} fill="transparent" r="14"></circle>
                  </g>
                ))}

                {/* Anomaly Marker at KM 42+650 */}
                <circle cx="440" cy="92" fill="#dc2626" r="5" className="animate-pulse"></circle>
                <circle cx="440" cy="92" fill="none" opacity="0.6" r="9" stroke="#dc2626" strokeWidth="1.5"></circle>
                <line stroke="#dc2626" strokeDasharray="2 2" strokeWidth="1.5" x1="440" x2="440" y1="20" y2="150"></line>

                {/* Anomaly Badge */}
                <rect
                  className="transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
                  fill="#ffffff"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
                  height="38"
                  rx="4"
                  stroke="#dc2626"
                  strokeWidth="1"
                  width="165"
                  x="445"
                  y="24"
                ></rect>
                <text fill="#dc2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" x="452" y="38">
                  KM 42+650 ANOMALY
                </text>
                <text fill="#475569" fontFamily="Inter" fontSize="9" x="452" y="52">
                  Basement Rock Refusal (110m/d)
                </text>
              </svg>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mt-2 px-1">
                <span>DAY 1 (KM 31.2)</span>
                <span>DAY 10 (KM 36.8)</span>
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                  DAY 18: REFUSAL HIT (KM 42.6)
                </span>
                <span>DAY 24: RECOVERY</span>
                <span>DAY 30 (KM 52.4)</span>
              </div>
            </div>
          </div>

          {/* Terrain & Soil Geological Learning Matrix */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-300 flex flex-col gap-3 hover-elevate">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-700">layers</span>
                <span className="font-bold text-slate-900 text-sm tracking-tight">Terrain & Soil Geological Learning Matrix</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                NAGA THRUST FAULT LINE CORRELATION
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                    <th className="p-2.5">Sector Corridor</th>
                    <th className="p-2.5">Primary Strata</th>
                    <th className="p-2.5 text-right">Rock RQD%</th>
                    <th className="p-2.5 text-right">Moisture Sat%</th>
                    <th className="p-2.5 text-right">Excavator Wear</th>
                    <th className="p-2.5">Confirmed Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="p-2.5 font-mono font-bold text-blue-700">Numaligarh–Siliguri</td>
                    <td className="p-2.5">Silty Alluvial Clay</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">12%</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">42.4%</td>
                    <td className="p-2.5 text-right font-mono">1.1x</td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-600">Standard Tiger Teeth Bucket</td>
                  </tr>
                  <tr className="bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer">
                    <td className="p-2.5 font-mono font-bold text-rose-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Duliajan–Guwahati (Sec 4)
                    </td>
                    <td className="p-2.5 font-bold text-rose-700">Granitic Gneiss / Sandstone</td>
                    <td className="p-2.5 text-right font-mono font-bold text-rose-700">88%</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">18.2%</td>
                    <td className="p-2.5 text-right font-mono font-bold text-rose-700">3.4x</td>
                    <td className="p-2.5 font-mono text-[10px] text-blue-700 font-bold">
                      Hydraulic Breaker + Ripper Shank
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="p-2.5 font-mono font-bold text-blue-700">Barauni–Guwahati Spur</td>
                    <td className="p-2.5">Compact River Boulder Alluvium</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">45%</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">31.0%</td>
                    <td className="p-2.5 text-right font-mono">1.9x</td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-600">Heavy-Duty V-Bottom Ditcher</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Field Operational Recommendation Callout with Core Sample Photo */}
            <div className="bg-blue-50/60 p-3 rounded-lg flex flex-col sm:flex-row items-start gap-3 border border-blue-200/80">
              <img
                src="/images/pipeline-ortho-survey.jpg"
                alt="Granitic Rock Strata Trench Sample"
                className="w-full sm:w-20 h-16 rounded object-cover border border-blue-200 shrink-0 shadow-2xs"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-blue-700 animate-pulse">lightbulb</span>
                  <span className="font-mono text-[11px] text-slate-900 font-bold uppercase">
                    Empirical Synthesis for KM 42+650:
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Neural corpus detects a 98.4% match with 2018 Duliajan Spur Sector 2 hard boulder ledge. Deploying heavy single-point ripper shanks before trenching restores velocity from 110m/d to 260m/d within 36 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Institutional Memory Engine */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-300 flex flex-col gap-3 hover-elevate">
            <div className="flex items-center justify-between pb-2 bg-slate-50 -mx-5 -mt-5 px-5 py-3.5 rounded-t-xl border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-700">history_edu</span>
                <span className="font-bold text-slate-900 text-sm tracking-tight">Institutional Memory Engine</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                SHA-256 LEDGER
              </span>
            </div>

            {/* Search Bar with Query Match Badge */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <input
                  className="w-full bg-slate-50 text-slate-800 font-mono text-xs rounded px-3 py-2 pr-16 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  readOnly
                  type="text"
                  value="Monsoon mud influx & Granitic Refusal"
                />
                <span className="absolute right-2 top-2 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  MATCH: 3
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                Neural Semantic Retrieval Across 11 Historic OIL Pipelines
              </span>
            </div>

            {/* Historical Case Cards */}
            <div className="flex flex-col gap-2.5 mt-1">
              {/* Card 1 */}
              <div
                onClick={() => setSelectedCase(selectedCase === 0 ? null : 0)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedCase === 0 ? 'bg-blue-50/60 border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-700 font-bold">#HIST-2019-BR04</span>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                      +4.5d SAVED
                    </span>
                    <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${selectedCase === 0 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="font-bold text-slate-900 text-xs mt-1">Burhi Dihing HDD Riverbed Cobble Collapse</div>
                {selectedCase === 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-2">
                    <p>
                      Drill string stuck in gravel bed at 34m depth. Retrieved countermeasure: Sodium Bentonite slurry dosage increased by 22% with high-vis polymer plug. Bore freed in 14 hours.
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>LOCATION: Burhi Dihing Crossing</span>
                      <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">verified</span> OIL-TECH-88
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2 */}
              <div
                onClick={() => setSelectedCase(selectedCase === 1 ? null : 1)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedCase === 1 ? 'bg-rose-50/60 border-rose-200 shadow-xs' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-700 font-bold">#HIST-2022-NG18</span>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                      ₹4.2 Cr CLAIM NEGATED
                    </span>
                    <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${selectedCase === 1 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="font-bold text-slate-900 text-xs mt-1">
                  Monsoon Idle Claim Disallowance via Telemetry Cross-Audit
                </div>
                {selectedCase === 1 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-2">
                    <p>
                      Contractor claimed 18 days idle rain stoppage. Telematics cross-audited IMD Doppler radar and excavator engine runtimes: dry shifts demonstrated, saving dispute arbitration cost.
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>LEGAL AUDIT: DISALLOWED</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">gavel</span> EVIDENTIAL GRADE
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3 */}
              <div
                onClick={() => setSelectedCase(selectedCase === 2 ? null : 2)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedCase === 2 ? 'bg-blue-50/60 border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-700 font-bold">#HIST-2023-DJ09</span>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
                      QUALITY CONTROL
                    </span>
                    <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${selectedCase === 2 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="font-bold text-slate-900 text-xs mt-1">Orbital Weld Heat-Affected Zone Porosity Spike</div>
                {selectedCase === 2 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-2">
                    <p>
                      Humidity at 96% caused hydrogen cracking risk in API 5L X70 pipe ends. Enclosed pre-heating bands sustained at 160°C eliminated all weld rejection anomalies.
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>METALLURGY REPORT</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span> 100% UT PASS
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Equipment & Operator Ground Truth Benchmarks */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-300 flex flex-col gap-3 hover-elevate">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-700">engineering</span>
                <span className="font-bold text-slate-900 text-sm tracking-tight">Equipment & Operator Benchmarks</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                TELEMATICS FEED
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Machine 1 */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-lg flex items-center justify-between border border-slate-200 transition-all cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/pipeline-drone-4k.jpg"
                    alt="Komatsu PC300 Excavator"
                    className="w-10 h-9 rounded object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-xs">Komatsu PC300-8MO (#EX-442)</span>
                    <span className="font-mono text-[10px] text-slate-500">Operator: Debashis Gogoi (14 yrs exp)</span>
                  </div>
                </div>
                <div className="flex flex-col items-end font-mono">
                  <span className="text-xs text-blue-700 font-bold">108% EFF</span>
                  <span className="text-[10px] text-slate-500">22.4 L/hr burn</span>
                </div>
              </div>

              {/* Machine 2 */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-lg flex items-center justify-between border border-slate-200 transition-all cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/ndt-film-scan.jpg"
                    alt="CRC-Evans Welder"
                    className="w-10 h-9 rounded object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-xs">CRC-Evans Dual-Head Internal Welder</span>
                    <span className="font-mono text-[10px] text-slate-500">Crew: Lead Tech Sunil Barua</span>
                  </div>
                </div>
                <div className="flex flex-col items-end font-mono">
                  <span className="text-xs text-slate-900 font-bold">94% UPTIME</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">0.4% defect rate</span>
                </div>
              </div>

              {/* Machine 3 */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-lg flex items-center justify-between border border-slate-200 transition-all cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/pipeline-ortho-survey.jpg"
                    alt="Caterpillar 336D Excavator"
                    className="w-10 h-9 rounded object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-xs">Caterpillar 336D Excavator</span>
                    <span className="font-mono text-[10px] text-slate-500">Crew: Sub-Contractor Squad 2</span>
                  </div>
                </div>
                <div className="flex flex-col items-end font-mono">
                  <span className="text-xs text-slate-700 font-bold">92% EFF</span>
                  <span className="text-[10px] text-slate-500">26.8 L/hr burn</span>
                </div>
              </div>
            </div>

            <div className="mt-1 pt-2 bg-slate-50 p-2 rounded flex items-center justify-between font-mono text-[10px] border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                ACTIVE SENSORS: 48 UNITS
              </span>
              <span className="text-blue-700 font-bold">DATA SYNCED WITH OIL P6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
