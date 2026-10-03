import React, { useState } from 'react';
import { useApp } from '../../services/store';

export const ConflictCenter: React.FC = () => {
  const { showToast } = useApp();
  const [chronoFilter, setChronoFilter] = useState<'all' | 'critical' | 'claims' | 'equipment' | 'weather'>('all');
  const [card1Endorsed, setCard1Endorsed] = useState(false);
  const [card2Authorized, setCard2Authorized] = useState(false);

  const handleEndorseCard1 = () => {
    setCard1Endorsed(true);
    showToast('Arbitration Order Enacted: WBS OIL.TRUNK.04.B recovery window (+2.1d) synced with EPPM', 'success');
  };

  const handleAuthorizeCard2 = () => {
    setCard2Authorized(true);
    showToast('Extension Capped at 3 Days: Liquidated damages of ₹2.10 Cr legally safeguarded under CVC rules', 'success');
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Top Urgent Alert Protocol Bar: Clean Light Alert Banner */}
      <div className="relative overflow-hidden rounded-xl bg-rose-50 border border-rose-300 p-4 shadow-xs hover-elevate">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-red-600"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pl-2">
          <div className="flex items-start sm:items-center gap-3">
            <div className="relative w-9 h-9 rounded bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px] animate-pulse">warning</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-red-600 text-white font-bold tracking-wider inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  CRITICAL BREACH SEV-1
                </span>
                <span className="font-mono text-[10px] text-slate-600 font-medium">
                  PROTOCOL: <span className="text-slate-900 font-mono font-bold">CONF-2024-OIL-091</span>
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-rose-200 font-medium inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  MILESTONE THREAT: TIE-IN #4
                </span>
              </div>
              <span className="font-bold text-slate-900 text-sm sm:text-base mt-1 tracking-tight">
                2 Unresolved Critical Path Schedule Conflicts Requiring Controls Intervention
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 self-end lg:self-center">
            <div className="text-right hidden sm:block">
              <div className="font-mono text-[10px] text-slate-500 uppercase font-semibold">P6 EXPOSURE WINDOW</div>
              <div className="font-mono text-xs text-red-600 font-bold tracking-wider">-100.8 HRS (CRITICAL SLIP)</div>
            </div>
            <button
              onClick={() => showToast('Tribunal Quorum Summoned: Notice transmitted to Chief Eng & Project Director', 'info')}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-red-600 text-white hover:bg-red-700 active:scale-95 font-mono text-xs font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Emergency Arbitration Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Vitals Bento Grid: Clean White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-xl bg-white p-4 border border-slate-300 shadow-xs hover-elevate flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Conflict Inventory
              </span>
              <span className="text-2xl text-slate-900 font-mono mt-1 font-bold">
                02 <span className="text-sm text-slate-400 font-normal">/ 11 Resolved</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined text-[18px]">difference</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[10px]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> 84.6% Closed &lt;72h
            </span>
            <span className="text-slate-400">90-Day Audit Cycle</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl bg-white p-4 border border-slate-300 shadow-xs hover-elevate flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Critical Path Delay Exposure
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl text-red-600 font-mono font-bold">-4.2</span>
                <span className="text-xs text-slate-500 font-medium font-mono">DAYS</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-rose-50 border border-rose-100 flex items-center justify-center text-red-600">
              <span className="material-symbols-outlined text-[18px]">trending_down</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[10px]">
            <span className="text-red-700 font-bold">₹2.10 Cr LD At Stake</span>
            <span className="text-slate-400">Liquidated Damages</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl bg-white p-4 border border-slate-300 shadow-xs hover-elevate flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Dominant Delay Vector
              </span>
              <span className="text-base text-slate-900 font-bold mt-1 truncate">Geotech & Hydro-Met</span>
            </div>
            <div className="w-8 h-8 rounded bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
              <span className="material-symbols-outlined text-[18px]">storm</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[10px]">
            <span className="text-sky-800 font-medium">Monsoon Runoff (Digboi)</span>
            <span className="text-slate-400">64% Total Variance</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl bg-white p-4 border border-slate-300 shadow-xs hover-elevate flex flex-col justify-between transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                AI Arbitration Benchmark
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl text-emerald-700 font-mono font-bold">84.6%</span>
                <span className="text-xs text-emerald-700 font-semibold font-mono">TRIBUNAL-FREE</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[10px]">
            <span className="text-emerald-700 font-semibold">Zero Litigation Escalations</span>
            <span className="text-slate-400">CVC Clause Comp.</span>
          </div>
        </div>
      </div>

      {/* Primary Detail Section: The 2 Active Critical Disputes */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-blue-700"></span>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Active Discrepancy Forensic Desks</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold ml-1">
              2 IN QUEUE
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">memory</span>
            <span>SYNCHRONIZED WITH ORACLE P6 R19.12 RUNTIME</span>
          </div>
        </div>

        {/* Conflict Card #1 */}
        <div className="rounded-xl bg-white border border-slate-300 shadow-xs hover-elevate overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span className="px-2 py-1 rounded bg-red-600 text-white font-mono text-[10px] font-bold shrink-0">
                CRIT-01
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-blue-700 font-semibold">WBS: OIL.TRUNK.04.B (Spread 2)</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="font-mono text-[10px] text-slate-600">ACT-WD-3105 ⇄ ACT-TR-4290</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-red-700 font-semibold">
                    SPATIAL & RESOURCE COLLISION
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                  Milepost 62 Tie-in vs Automatic Orbital Welding Rig Misalignment
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <div className="px-2.5 py-1 rounded bg-white border border-slate-200 text-right">
                <div className="font-mono text-[10px] text-slate-400">CP IMPACT</div>
                <div className="font-mono text-xs text-red-600 font-bold">-1.5 DAYS SLIP</div>
              </div>
              <span className="material-symbols-outlined text-slate-400">more_vert</span>
            </div>
          </div>

          {/* Card Body: Split Grid */}
          <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Diagnostic & Evidence (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Root Cause Box */}
              <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-700 uppercase font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">psychology</span> Forensic Root Cause Analysis
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    CONFIDENCE: 98.4%
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Trench excavated 1.8m ahead of schedule in Sector A while CRC-Evans M-300 welding head suffered calibration drift (0.4mm root-pass weld defect). Mechanical gang and trenching spread are now physically occupying the same 45-meter corridor without valid safety separation.
                </p>
              </div>

              {/* Field Evidence Strip */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Field Evidence Dossier (NDT Radiography + RTK GNSS)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Evidence 1: NDT Film with Photographic Proof */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 flex flex-col gap-1">
                    <div className="relative w-full h-24 rounded overflow-hidden bg-slate-900 group">
                      <img
                        src="/images/ndt-film-scan.jpg"
                        alt="Radiographic NDT Weld Inspection Joint J-118"
                        className="w-full h-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40"></div>
                      <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded bg-slate-900/80 text-emerald-400 font-mono text-[8px] font-bold border border-emerald-400/40">
                        GAMMA RT SCAN
                      </div>
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-white/95 px-1.5 py-0.5 rounded text-red-600 font-bold border border-red-200 shadow-2xs">
                        DEFECT: 0.4mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-1 mt-0.5 font-mono text-[10px]">
                      <span className="text-slate-800 font-bold truncate">NDT Film #RT-391</span>
                      <span className="text-slate-500">JOINT J-118</span>
                    </div>
                  </div>

                  {/* Evidence 2: Drone Corridor with High-Res Aerial Orthomosaic */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 flex flex-col gap-1">
                    <div className="relative w-full h-24 rounded overflow-hidden bg-slate-900 group">
                      <img
                        src="/images/uav-corridor-ortho.jpg"
                        alt="UAV Orthomosaic Aerial Corridor KM 42+480"
                        className="w-full h-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                      <div className="absolute top-1 left-1.5 px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 font-mono text-[8px] font-bold border border-blue-400/40">
                        ROU SURVEY
                      </div>
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-white/95 px-1.5 py-0.5 rounded text-blue-700 font-bold border border-blue-200 shadow-2xs">
                        CORRIDOR 42+480
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-1 mt-0.5 font-mono text-[10px]">
                      <span className="text-slate-800 font-bold truncate">UAV Orthomosaic</span>
                      <span className="text-slate-500">ALT 45M</span>
                    </div>
                  </div>

                  {/* Evidence 3: GNSS Vector Telemetry */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 flex flex-col justify-between">
                    <div className="flex flex-col gap-0.5 font-mono text-[10px]">
                      <span className="text-slate-800 font-bold uppercase">GNSS Deviation Readout</span>
                      <div className="text-slate-600">LAT: 27.38091° N</div>
                      <div className="text-slate-600">LON: 95.31904° E</div>
                      <div className="text-red-600 font-bold mt-1">Δ LATERAL: +0.42m DRIFT</div>
                    </div>
                    <div className="bg-white border border-slate-200 px-2 py-0.5 rounded text-center mt-1">
                      <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">TRIMBLE RTK VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reconstructed Chronology Mini-Flow */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  AI Reconstructed Incident Chronology
                </span>
                <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                  <div className="flex items-start gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-blue-700 font-bold shrink-0">21 OCT 08:30 IST</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-800">Trench opened by Komatsu PC300 at KM 42+480 (Ahead by 26 hours vs baseline).</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-amber-700 font-bold shrink-0">22 OCT 14:15 IST</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-800">CRC-Evans M-300 welding crew flagged joint #J-118 refusal due to thermal pipe warp.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-rose-50 border border-rose-100">
                    <span className="text-red-700 font-bold shrink-0">23 OCT 09:00 IST</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-red-900 font-medium">P6 baseline slip confirmed: Negative total float (-36h). Resource blockage declared.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI Arbitration Vector & Action Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-lg bg-emerald-50/50 border border-emerald-200 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="font-mono text-[10px] text-emerald-800 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
                    SiteSync Recommended Arbitrament
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    +2.1 DAYS RECOVERY
                  </span>
                </div>

                <div className="rounded-lg bg-white border border-emerald-100 p-3.5 flex flex-col gap-2 shadow-xs">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Immediate Spread Bypass Maneuver</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Re-route heavy orbital welding spread directly to KM 43+100 dry-pad corridor. Deploy manual shielded-metal arc backup crew (Team Assam-B) for tie-in joint rectification at KM 42+480.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <div className="px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] font-semibold">
                      Cost delta: ₹2.4 Lakh
                    </div>
                    <div className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-semibold">
                      Zero Milestone Pen.
                    </div>
                  </div>
                </div>

                {/* Arbitration Impact Gauge */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-slate-600 font-medium">Schedule Float Recovery Probability</span>
                    <span className="text-emerald-700 font-bold">94.2%</span>
                  </div>
                  <div className="w-full h-2 rounded bg-slate-200 overflow-hidden flex">
                    <div className="bg-emerald-600 h-full rounded" style={{ width: '94%' }}></div>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500">
                    Validated against 14 prior Northeast India pipeline monsoonal lay records.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-emerald-200">
                <button
                  onClick={handleEndorseCard1}
                  disabled={card1Endorsed}
                  type="button"
                  className={`w-full py-2.5 px-3 rounded font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs ${
                    card1Endorsed
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {card1Endorsed ? 'verified' : 'check_circle'}
                  </span>
                  <span>{card1Endorsed ? 'Endorsed & Logged to P6' : 'Endorse Arbitration Resolution'}</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => showToast('Dispute Dossier Queued under Contract Clause 67.2', 'info')}
                    type="button"
                    className="py-2 px-2 rounded bg-white hover:bg-rose-50 text-slate-700 hover:text-red-700 hover:border-red-300 active:scale-95 border border-slate-200 font-mono text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-red-600">gavel</span>
                    <span>Dispute Claim</span>
                  </button>
                  <button
                    onClick={() => showToast('Simulating Team Assam-B bypass CPM impact...', 'info')}
                    type="button"
                    className="py-2 px-2 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 hover:border-blue-300 active:scale-95 border border-slate-200 font-mono text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-700">tune</span>
                    <span>Simulate What-If</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Card #2 */}
        <div className="rounded-xl bg-white border border-slate-300 shadow-xs hover-elevate overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span className="px-2 py-1 rounded bg-amber-500 text-white font-mono text-[10px] font-bold shrink-0">
                CRIT-02
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-900 font-bold">
                    CONTRACTOR: L&T HYDROCARBON ENGINEERING
                  </span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="font-mono text-[10px] text-slate-500">CONTRACT PKG: OIL/TR/2023/C-08</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-red-700 font-semibold">
                    FORCE MAJEURE COMMERCIAL CLAIM
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                  Monsoon Rain Extension & Idling Charges Claim (14 Calendar Days)
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <div className="px-2.5 py-1 rounded bg-white border border-slate-200 text-right">
                <div className="font-mono text-[10px] text-slate-400">CLAIM QUANTUM</div>
                <div className="font-mono text-xs text-slate-900 font-bold">14 DAYS / ₹1.85 CR</div>
              </div>
              <span className="material-symbols-outlined text-slate-400">more_vert</span>
            </div>
          </div>

          {/* Card Body: Split Grid */}
          <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Forensic Cross-Audit & Radar (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-700 uppercase font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">satellite_alt</span>
                    Satellite SAR (Sentinel-1) & Digboi Weather Station Cross-Audit
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-100 text-red-800 font-bold">
                    11 DAYS DISPROVED
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Contractor submitted a 14-day schedule relief petition citing unworkable monsoonal inundation between 04 Oct and 17 Oct. Cryptographic telemetry cross-reference against Indian Meteorological Department (IMD) Digboi station radar and European Space Agency SAR soil backscatter data confirms only <span className="text-emerald-700 font-bold font-mono">3 legitimate torrential rain days (&gt;65mm/day)</span>.
                </p>
              </div>

              {/* Table */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Forensic Rainfall & Rig Utilization Matrix
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Date Window</th>
                        <th className="py-2 px-3">Claimed Condition</th>
                        <th className="py-2 px-3">IMD / SAR Telemetry</th>
                        <th className="py-2 px-3">UAV Flyover Evidence</th>
                        <th className="py-2 px-3 text-right">Audit Determination</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold">04–06 Oct</td>
                        <td className="py-2 px-3 text-red-600 font-medium">Heavy Cloudburst (&gt;80mm)</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">72.4mm / Sat Saturation</td>
                        <td className="py-2 px-3 text-slate-500">Standing floodwater 0.6m</td>
                        <td className="py-2 px-3 text-right text-emerald-700 font-bold">LEGITIMATE (3.0d)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold">07–12 Oct</td>
                        <td className="py-2 px-3 text-red-600 font-medium">Saturated Ground Runoff</td>
                        <td className="py-2 px-3 text-blue-700 font-semibold">4.2mm / Dry SAR Scatter</td>
                        <td className="py-2 px-3 text-slate-700">Haul road accessible to 40T</td>
                        <td className="py-2 px-3 text-right text-red-600 font-bold">DISALLOWED (6.0d)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold">13–17 Oct</td>
                        <td className="py-2 px-3 text-red-600 font-medium">Inaccessible RoW Corridor</td>
                        <td className="py-2 px-3 text-blue-700 font-semibold">0.0mm / Clear sky</td>
                        <td className="py-2 px-3 text-slate-700">Contractor excavators demobilized</td>
                        <td className="py-2 px-3 text-right text-red-600 font-bold">DISALLOWED (5.0d)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Drone flight verification callout with Photographic Proof */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="relative w-16 h-12 rounded overflow-hidden border border-slate-200 shadow-2xs shrink-0 group">
                  <img
                    src="/images/dry-haul-survey.jpg"
                    alt="UAV Photogrammetry Flight OIL-SRV-882 Dry Haul Proof"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/20"></div>
                  <span className="absolute bottom-0.5 right-0.5 font-mono text-[7px] bg-slate-900/90 text-amber-300 px-1 py-0.2 rounded font-bold">
                    DRY HAUL
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-xs">
                    UAV Photogrammetry Flight OIL-SRV-882 (11 Oct, 11:42 IST)
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 mt-0.5">
                    Soil compaction index: 96% CBR. Dump trucks operating without track slips. Clear evidence against Force Majeure conditions.
                  </span>
                </div>
              </div>
            </div>

            {/* Right: AI Arbitrated Ruling & Signoff (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-mono text-[10px] text-red-700 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">balance</span>
                    Automated Legal-Engineering Finding
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-100 text-red-800 font-bold">
                    PARTIALLY DISPUTED
                  </span>
                </div>

                <div className="rounded-lg bg-white border border-slate-200 p-3.5 flex flex-col gap-2 shadow-xs">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="text-slate-500">LEGITIMATE RELIEF:</span>
                    <span className="text-emerald-700 font-bold">3.0 CALENDAR DAYS</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="text-slate-500">DISALLOWED DEFICIT:</span>
                    <span className="text-red-600 font-bold">11.0 CALENDAR DAYS</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-blue-50 border border-blue-100 p-2 rounded font-mono text-xs">
                    <span className="text-blue-900 font-bold text-[10px]">LIQUIDATED DAMAGES SAFEGUARDED:</span>
                    <span className="text-blue-700 font-bold text-sm">₹2.10 CRORE</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] mt-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>Awaiting Chief Planning Engineer Authorization (Pranjal Saikia)</span>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-slate-200 p-2.5 flex items-center gap-2.5 shadow-xs">
                  <span className="material-symbols-outlined text-blue-700 text-[22px]">policy</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-900 font-bold">CVC / CAG Vigilance Compliance</span>
                    <span className="font-mono text-[9px] text-slate-500">Forensic chain of custody sealed under SHA-256 for public sector audit defense.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-slate-200">
                <button
                  onClick={handleAuthorizeCard2}
                  disabled={card2Authorized}
                  type="button"
                  className={`w-full py-2.5 px-3 rounded font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs ${
                    card2Authorized
                      ? 'bg-emerald-700 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {card2Authorized ? 'lock' : 'verified'}
                  </span>
                  <span>{card2Authorized ? 'Form 8-B Signed (3-Day Limit)' : 'Authorize 3-Day Extension Only'}</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => showToast('Form 8-B Rejection Issued to L&T Project Director', 'error')}
                    type="button"
                    className="py-2 px-2 rounded bg-white hover:bg-rose-50 text-red-700 hover:border-red-300 active:scale-95 border border-slate-200 font-mono text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-red-600">block</span>
                    <span>Form 8-B Rejection</span>
                  </button>
                  <button
                    onClick={() => showToast('Exporting CVC Cryptographic Dossier...', 'info')}
                    type="button"
                    className="py-2 px-2 rounded bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300 active:scale-95 border border-slate-200 font-mono text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-700">download</span>
                    <span>CVC Audit Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chronological Event Timeline Ribbon */}
      <div className="rounded-xl bg-white border border-slate-300 p-5 shadow-xs hover-elevate flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 text-[20px]">timeline</span>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Telemetry Delay Chronology Strip</span>
            <span className="font-mono text-[10px] text-slate-400 ml-2">OCTOBER 2024 FIELD TRAJECTORY</span>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            {(
              [
                { id: 'all', label: 'All Events (18)' },
                { id: 'critical', label: 'Critical Path Only' },
                { id: 'claims', label: 'Contractor Claims' },
                { id: 'equipment', label: 'Equipment Telemetry' },
                { id: 'weather', label: 'Weather Influx' }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setChronoFilter(f.id)}
                className={`px-2.5 py-1 rounded font-semibold transition-all shadow-xs ${
                  chronoFilter === f.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Horizon View */}
        <div className="relative overflow-x-auto pb-4 pt-2 -mx-2 px-2">
          {/* Mobile scroll hint */}
          <div className="md:hidden flex items-center justify-between text-[10px] font-mono text-slate-500 pb-1 px-1">
            <span>← Swipe horizontally to inspect full timeline →</span>
            <span className="text-blue-700 font-semibold">900px TRACK</span>
          </div>

          <div className="min-w-[900px] flex flex-col gap-4">
            {/* Day Scale */}
            <div className="grid grid-cols-7 gap-2 text-center font-mono text-[10px] text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800">
                01–04 OCT <br />
                <span className="text-slate-500 dark:text-slate-400">W1-TRENCH</span>
              </div>
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40">
                05–08 OCT <br />
                <span className="text-red-700 dark:text-rose-400 font-bold">RAIN-PEAK</span>
              </div>
              <div className="p-2 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-500/40">
                09–12 OCT <br />
                <span className="text-sky-700 dark:text-sky-400 font-bold">SAR-DRY</span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800">
                13–16 OCT <br />
                <span className="text-slate-500 dark:text-slate-400">HAUL-CLEAR</span>
              </div>
              <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40">
                17–20 OCT <br />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">WELD-PREP</span>
              </div>
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40">
                21–24 OCT <br />
                <span className="text-red-700 dark:text-rose-400 font-bold">J-118 DRIFT</span>
              </div>
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/40">
                25–28 OCT <br />
                <span className="text-blue-700 dark:text-blue-400 font-bold">ARBITRATE</span>
              </div>
            </div>

            {/* Horizontal Event Track Ribbon with Ample Vertical Spacing to prevent any tooltip collisions */}
            <div className="relative h-28 my-14 rounded-lg bg-slate-50 dark:bg-[#070c14] border border-slate-200 dark:border-slate-800 flex items-center px-4 overflow-visible">
              {/* Central Baseline Datum Line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-300 dark:bg-slate-700 -translate-y-1/2"></div>

              {/* Event Node 1: Weather */}
              <div
                className={`absolute left-[16%] flex flex-col items-center group cursor-pointer transition-all ${
                  chronoFilter !== 'all' && chronoFilter !== 'weather' ? 'opacity-20' : 'opacity-100'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full bg-sky-100 text-sky-700 border-2 border-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[16px]">water_drop</span>
                </div>
                <div className="absolute top-10 w-36 -left-14 text-center rounded bg-white border border-slate-200 p-1.5 shadow-sm z-10 pointer-events-none">
                  <div className="font-mono text-[9px] text-sky-800 font-bold">05 OCT: 72mm Rain</div>
                  <div className="font-mono text-[9px] text-slate-500 truncate">Flooding Spread 1</div>
                </div>
              </div>

              {/* Event Node 2: L&T Claim Lodged */}
              <div
                className={`absolute left-[38%] flex flex-col items-center group cursor-pointer transition-all ${
                  chronoFilter !== 'all' && chronoFilter !== 'claims' ? 'opacity-20' : 'opacity-100'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full bg-red-100 text-red-700 border-2 border-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </div>
                <div className="absolute -top-14 w-36 -left-14 text-center rounded bg-white border border-slate-200 p-1.5 shadow-sm z-10 pointer-events-none">
                  <div className="font-mono text-[9px] text-red-600 font-bold">14 OCT: 14D Claim</div>
                  <div className="font-mono text-[9px] text-slate-500 truncate">L&T Force Majeure</div>
                </div>
              </div>

              {/* Event Node 3: Trench Advancing */}
              <div
                className={`absolute left-[62%] flex flex-col items-center group cursor-pointer transition-all ${
                  chronoFilter !== 'all' && chronoFilter !== 'equipment' ? 'opacity-20' : 'opacity-100'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 border-2 border-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[16px]">engineering</span>
                </div>
                <div className="absolute top-10 w-36 -left-14 text-center rounded bg-white border border-slate-200 p-1.5 shadow-sm z-10 pointer-events-none">
                  <div className="font-mono text-[9px] text-emerald-800 font-bold">21 OCT: Trench Rush</div>
                  <div className="font-mono text-[9px] text-slate-500 truncate">+1.8m Lead over Weld</div>
                </div>
              </div>

              {/* Event Node 4: Rig Failure & Slip */}
              <div
                className={`absolute left-[78%] flex flex-col items-center group cursor-pointer transition-all ${
                  chronoFilter !== 'all' && chronoFilter !== 'critical' ? 'opacity-20' : 'opacity-100'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full bg-red-600 text-white border-2 border-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                </div>
                <div className="absolute -top-14 w-40 -left-16 text-center rounded bg-white border border-rose-200 p-1.5 shadow-sm z-10 pointer-events-none">
                  <div className="font-mono text-[9px] text-red-600 font-bold">22 OCT: M-300 Rig Drift</div>
                  <div className="font-mono text-[9px] text-slate-500 truncate">0.4mm NDT Root Refusal</div>
                </div>
              </div>

              {/* Event Node 5: Current Arbitration Marker */}
              <div className="absolute left-[92%] flex flex-col items-center">
                <div className="w-3 h-12 bg-blue-700 rounded shadow-xs"></div>
                <div className="absolute top-14 w-32 -left-14 text-center rounded bg-blue-700 text-white p-1 shadow-sm z-10">
                  <div className="font-mono text-[9px] font-bold uppercase tracking-wider">TODAY: ARBITRATION</div>
                </div>
              </div>
            </div>

            {/* Legend Ribbon */}
            <div className="flex flex-wrap items-center justify-between text-slate-500 font-mono text-[10px] pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>Sev-1 Unresolved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-700"></span>Pending Endorsement
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>Telemetry Validated
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>Atmospheric Sensor
                </span>
              </div>
              <span className="text-slate-500">CHRONO-ENGINE: SITESYNC-VERITAS-4.8 // 128 SENSOR CHANNELS ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
