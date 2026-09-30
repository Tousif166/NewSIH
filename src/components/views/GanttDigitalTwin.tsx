import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';

export const GanttDigitalTwin: React.FC = () => {
  const { activities, setActiveTab } = useApp();

  // Time machine simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(2);
  const [timelineVal, setTimelineVal] = useState<number>(36);
  const [viewMode, setViewMode] = useState<'SPLIT' | 'GANTT' | 'SPATIAL'>('SPLIT');

  // Telemetry layer toggles
  const [layerUav, setLayerUav] = useState<boolean>(true);
  const [layerRtk, setLayerRtk] = useState<boolean>(true);
  const [layerGeo, setLayerGeo] = useState<boolean>(true);
  const [layerCritical, setLayerCritical] = useState<boolean>(true);

  // Selected bottleneck and simulation mitigation state
  const [selectedActId, setSelectedActId] = useState<string>('ACT-TR-4290');
  const [mitigated, setMitigated] = useState<boolean>(false);
  const [isApplyingMitigation, setIsApplyingMitigation] = useState<boolean>(false);

  // Auto-play interval for scrubber
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineVal((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 600 / speedMultiplier);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  const handleApplyMitigation = () => {
    if (isApplyingMitigation) return;
    setIsApplyingMitigation(true);
    setTimeout(() => {
      setIsApplyingMitigation(false);
      setMitigated(!mitigated);
    }, 900);
  };

  const getWeekFromTimeline = (pct: number) => {
    const weekNum = 38 + Math.floor((pct / 100) * 14);
    return `W${weekNum}`;
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* TOP HEADER / TIME MACHINE SCRUBBER BAR */}
      <div className="w-full bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex flex-col gap-3 hover-elevate">
        {/* Row 1: Epoch, Speed, View Switchers, Layer Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Simulation Epoch & Playhead Controls */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 rounded bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
              title="Toggle simulation autoplay"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTimelineVal((prev) => Math.min(100, prev + 7))}
              className="w-7 h-7 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
              title="Step forward 1 week"
            >
              <span className="material-symbols-outlined text-[16px]">fast_forward</span>
            </button>
            <div className="flex flex-col ml-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-mono text-[9px] text-blue-700 font-bold uppercase tracking-wider">
                  SIMULATION EPOCH
                </span>
              </div>
              <span className="font-mono text-xs text-slate-900 font-bold tracking-tight">
                24 OCT 2024 [{getWeekFromTimeline(timelineVal)}]
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* Speed Multipliers */}
            <div className="flex items-center bg-white border border-slate-200 rounded p-0.5 gap-0.5">
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-1.5 py-0.5 rounded font-mono text-[10px] transition-all cursor-pointer ${
                    speedMultiplier === s
                      ? 'text-white bg-blue-700 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* View Modes */}
          <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => setViewMode('SPLIT')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'SPLIT'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-blue-700">view_stream</span>
              <span>4D Split Twin</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('GANTT')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'GANTT'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-slate-500">table_chart</span>
              <span>Gantt Master</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('SPATIAL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'SPATIAL'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-slate-500">satellite_alt</span>
              <span>Spatial Corridor</span>
            </button>
          </div>

          {/* Telemetry Layers Checkboxes */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all select-none">
              <input
                type="checkbox"
                checked={layerUav}
                onChange={(e) => setLayerUav(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-700 focus:ring-0 accent-blue-700 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-slate-700 font-semibold">UAV ORTHOMOSAIC</span>
            </label>
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all select-none">
              <input
                type="checkbox"
                checked={layerRtk}
                onChange={(e) => setLayerRtk(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-700 focus:ring-0 accent-blue-700 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-slate-700 font-semibold">RTK GNSS STRING</span>
            </label>
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all select-none">
              <input
                type="checkbox"
                checked={layerGeo}
                onChange={(e) => setLayerGeo(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-700 focus:ring-0 accent-blue-700 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-slate-700 font-semibold">GEO BOREHOLES</span>
            </label>
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-rose-200 bg-rose-50/70 cursor-pointer hover:bg-rose-50 transition-all select-none">
              <input
                type="checkbox"
                checked={layerCritical}
                onChange={(e) => setLayerCritical(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-rose-300 text-rose-600 focus:ring-0 accent-rose-600 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-rose-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>CRITICAL PATH
              </span>
            </label>
          </div>
        </div>

        {/* Row 2: Synchronized Timeline Slider & Key Phase Markers */}
        <div className="w-full flex flex-col gap-1 pt-1">
          <div className="relative w-full h-8 bg-slate-100 border border-slate-200 rounded-lg px-2 flex items-center">
            {/* Baseline track background */}
            <div className="absolute inset-x-2 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${timelineVal}%` }}
              ></div>
              <div
                className="absolute w-[12%] h-full bg-blue-600"
                style={{ left: `${timelineVal}%` }}
              ></div>
              <div
                className="absolute w-[18%] h-full bg-amber-400"
                style={{ left: `${Math.min(82, timelineVal + 12)}%` }}
              ></div>
            </div>
            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={timelineVal}
              onChange={(e) => setTimelineVal(Number(e.target.value))}
              className="relative z-10 w-full h-2 bg-transparent appearance-none cursor-pointer accent-blue-700"
              title="Slide to scrub project timeline"
            />
            {/* Milestone Pins */}
            <div className="absolute left-[12%] -top-1 font-mono text-[9px] text-slate-500 pointer-events-none select-none">
              KM 00 TERM
            </div>
            <div
              className="absolute -top-1 font-mono text-[9px] text-blue-700 font-bold pointer-events-none select-none transition-all duration-150"
              style={{ left: `${timelineVal}%` }}
            >
              DATA DATE ({getWeekFromTimeline(timelineVal)})
            </div>
            <div className="absolute left-[54%] -top-1 font-mono text-[9px] text-slate-600 font-medium pointer-events-none select-none">
              HDD RIVER CUT
            </div>
            <div className="absolute left-[92%] -top-1 font-mono text-[9px] text-slate-500 pointer-events-none select-none">
              P85 NOV'25
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 px-1">
            <span>OCT 2024 (COMMENCEMENT)</span>
            <span className="text-slate-800 font-semibold">
              OVERALL PIPELINE S-CURVE:{' '}
              <span className="text-emerald-700 font-bold">41.8% ACTUAL</span> vs{' '}
              <span className="text-slate-600 font-bold">46.2% PLAN</span> (
              <span className="text-rose-600 font-bold">{mitigated ? '+1.8d BUFFER' : '-4.4% SLIPPAGE'}</span>)
            </span>
            <span>28 NOV 2025 (P85 COMMERCIAL HANDOVER)</span>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT WORKSPACE */}
      <div className="w-full flex flex-col gap-4">
        {/* UPPER SECTION: GIS CORRIDOR DIGITAL TWIN (Visible in SPLIT and SPATIAL) */}
        {viewMode !== 'GANTT' && (
          <div className="w-full bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex flex-col gap-3 relative overflow-hidden hover-elevate">
            {/* Section Micro Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">maps_ar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-900 font-bold">132KM GIS CORRIDOR DIGITAL TWIN</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    CHAINAGE 00+000 TO 132+000
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-medium">
                    SRTM-30M + UAV 2.5CM/PX
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">SUBSURFACE DEPTH:</span>
                <span className="text-slate-800 font-bold">2.40m TRENCH INCLINE</span>
                <span className="text-slate-300 ml-2">|</span>
                <span className="text-slate-400 ml-2">DATUM:</span>
                <span className="text-slate-700 font-bold">WGS-84 / UTM ZONE 46N</span>
              </div>
            </div>

            {/* Corridor Strip Overview Indicator Bar */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col gap-1.5 z-10">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-emerald-700 font-bold">DIGBOI TERMINAL [KM 00+000]</span>
                <span className="text-blue-700 font-bold">SPREAD 2 WORK-FRONT [KM 42+650]</span>
                <span className="text-slate-600 font-medium">BURHI DIHING HDD [KM 71+200]</span>
                <span className="text-slate-600 font-medium">DULIAJAN REFINERY [KM 132+000]</span>
              </div>

              {/* 4-segment visual strip */}
              <div className="w-full h-3 rounded flex overflow-hidden shadow-inner gap-0.5 bg-slate-200 p-0.5">
                <div
                  className="w-[23%] h-full bg-emerald-600 rounded-xs flex items-center justify-center cursor-pointer hover:brightness-110"
                  title="KM 0-30 Completed"
                >
                  <span className="font-mono text-[8px] text-white font-bold tracking-tight">100% INSTALLED</span>
                </div>
                <div
                  className="w-[26%] h-full bg-blue-600 rounded-xs relative flex items-center justify-center cursor-pointer hover:brightness-110"
                  title="Active Focus Spread"
                >
                  <span className="font-mono text-[8px] text-white font-bold tracking-tight">
                    KM 30-65 ACTIVE TRENCHING
                  </span>
                  <div className="absolute -top-1 left-[45%] w-2 h-4 bg-rose-600 rounded-xs shadow-xs border border-white animate-pulse"></div>
                </div>
                <div
                  className="w-[27%] h-full bg-amber-500 rounded-xs flex items-center justify-center cursor-pointer hover:brightness-110"
                  title="KM 65-100 NDT Verification"
                >
                  <span className="font-mono text-[8px] text-white font-bold tracking-tight">KM 65-100 STRINGING/NDT</span>
                </div>
                <div
                  className="w-[24%] h-full bg-slate-400 rounded-xs flex items-center justify-center cursor-pointer hover:brightness-110"
                  title="KM 100-132 Pre-Commissioning"
                >
                  <span className="font-mono text-[8px] text-white font-bold tracking-tight">KM 100-132 HYDRO-TEST PREP</span>
                </div>
              </div>
            </div>

            {/* High Clarity Technical GIS & Telematics Canvas (Clean Non-Overlapping Layout) */}
            <div className="w-full bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-xl relative overflow-hidden flex flex-col gap-4 p-4 shadow-2xs">
              {/* Engineering Grid Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="light-contour-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300"></path>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#light-contour-grid)"></rect>
                <path
                  d="M 0 160 Q 250 140 450 190 T 800 170 T 1400 200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray="8 4"
                  className="text-blue-600/50"
                ></path>
              </svg>

              {/* Top Header Row: HDD Waterway Crossing Callout + Status Badges */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 border border-slate-200 p-3 rounded-lg shadow-2xs backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-[19px]">water</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">MAJOR WATERWAY CROSSING:</span>
                    <span className="font-mono text-xs text-slate-900 font-bold">
                      BURHI DIHING RIVER HDD - 1,240M [PULLBACK COMPLETED]
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[9px] font-bold">
                      VERIFIED 100%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-[10px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    RTK FIX: ±1.2cm
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>CORRIDOR SPREAD 2</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-blue-700 font-bold">KM 42+650 DATUM</span>
                </div>
              </div>

              {/* 4 Clean Separated Telemetry Cards (Grid of 4 on XL screens - ZERO OVERLAPS) */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
                {/* Card 1: Geotechnical Profile */}
                {layerGeo && (
                  <div className="bg-white/95 border border-slate-200 p-3.5 rounded-lg shadow-2xs flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">
                          GEOTECHNICAL PROFILE @ KM 42+650
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[9px] font-bold">
                          SLOPE INSTABILITY
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-slate-500">Strata Classification:</span>
                        <span className="text-slate-900 font-semibold font-mono text-[11px]">Granite-Sandstone Blend</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-slate-500">Rock Density / Hardness:</span>
                        <span className="text-slate-800 font-mono text-[11px] font-medium">2,650 kg/m³ | RQD 68%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-slate-500">Measured Trench Depth:</span>
                        <span className="text-emerald-700 font-bold font-mono text-[11px]">2.42m (Req. 2.40m min)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-1">
                        <span>TOPSOIL (30%)</span>
                        <span>SANDSTONE (45%)</span>
                        <span>GRANITE (25%)</span>
                      </div>
                      <div className="w-full h-2 rounded bg-slate-100 border border-slate-200 overflow-hidden flex">
                        <div className="w-[30%] bg-amber-200" title="Alluvium topsoil"></div>
                        <div className="w-[45%] bg-amber-400" title="Weathered sandstone"></div>
                        <div className="w-[25%] bg-slate-600" title="Granite bedrock layer"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 2: Machine Telematics Node: Komatsu PC300 with Equipment Photo */}
                <div className="bg-white/95 border border-slate-200 p-3.5 rounded-lg shadow-2xs flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-blue-700 text-[16px]">precision_manufacturing</span>
                        <span className="font-mono text-[10px] text-slate-900 font-bold">KOMATSU PC300-8M0</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[9px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>CAN-BUS LIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="bg-slate-50 border border-slate-200 p-1.5 rounded flex flex-col">
                        <span className="text-slate-500 text-[10px] font-mono">ENGINE LOAD</span>
                        <span className="text-rose-600 font-bold font-mono text-xs">84.2% [PEAK]</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-1.5 rounded flex flex-col">
                        <span className="text-slate-500 text-[10px] font-mono">DIESEL BURN RATE</span>
                        <span className="text-slate-900 font-bold font-mono text-xs">22.4 L/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Hydraulic Pressure:</span>
                      <span className="text-slate-800 font-mono text-[11px] font-semibold">34.8 MPa [Ripper Active]</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <img
                      src="/images/pipeline-ortho-survey.jpg"
                      alt="Komatsu PC300 Heavy Excavator"
                      className="w-12 h-10 object-cover rounded border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="flex flex-col min-w-0 font-mono text-[10px]">
                      <span className="text-slate-800 font-bold truncate">HE-04 SPREAD 2</span>
                      <span className="text-slate-500">Rock Trenching Assigned</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: RTK Positioning Coordinates (RTK Layer) */}
                {layerRtk && (
                  <div className="bg-white/95 border border-slate-200 p-3.5 rounded-lg shadow-2xs flex flex-col justify-between gap-1.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-blue-700 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] animate-pulse">my_location</span>
                          TRIMBLE R12i GNSS BASE
                        </span>
                        <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-1 rounded font-bold border border-emerald-200">
                          DOP 0.7 (FIXED)
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] py-0.5">
                        <span className="text-slate-500">LATITUDE:</span>
                        <span className="text-slate-900 font-bold">27° 23' 21.12" N (27.3892°)</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] py-0.5">
                        <span className="text-slate-500">LONGITUDE:</span>
                        <span className="text-slate-900 font-bold">95° 37' 02.64" E (95.6174°)</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] py-0.5">
                        <span className="text-slate-500">ELEVATION (MSL):</span>
                        <span className="text-blue-700 font-bold">+142.48 m AMSL</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">CHAINAGE OFFSET</span>
                      <span className="font-mono text-xs text-emerald-700 font-bold">CL + 0.12m TOLERANCE</span>
                    </div>
                  </div>
                )}

                {/* Card 4: Dedicated Live UAV Aerial Camera (UAV Layer) - COMPLETELY SEPARATE, ZERO OVERLAP */}
                {layerUav && (
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="relative w-full h-32 bg-slate-900 overflow-hidden group">
                      <img
                        src="/images/pipeline-drone-4k.jpg"
                        alt="UAV Ortho Cam-3 Pipeline Corridor Aerial Drone Photograph"
                        className="w-full h-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-white/95 text-blue-800 font-mono text-[9px] font-bold flex items-center gap-1 shadow-2xs border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        UAV ORTHO CAM-3
                      </div>
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px]">
                        4K RAW
                      </div>
                      <div className="absolute bottom-1.5 left-2 right-2 flex justify-between font-mono text-[9px] text-white">
                        <span className="truncate">SEC-04 ROU: 18M</span>
                        <span className="text-emerald-400 font-semibold font-mono">GSD: 1.8cm • 45M</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between font-mono text-[10px] text-slate-600">
                      <span className="truncate">Corridor Spread 2</span>
                      <span className="text-blue-700 font-bold">11:15 IST</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Twin Status Strip */}
              <div className="relative z-10 flex flex-wrap items-center justify-between pt-2.5 bg-white/95 border-t border-slate-200 px-3 py-2 rounded-lg shadow-2xs">
                <div className="flex items-center gap-3 text-slate-600 font-mono text-[10px]">
                  <span>24" API 5L X70 PSL2 SUBMERGED ARC WELDED</span>
                  <span className="text-slate-300">•</span>
                  <span>WALL THICKNESS: 14.3mm</span>
                  <span className="text-slate-300">•</span>
                  <span>3LPE EXTERNAL COATING</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-500">PHYSICAL COMPLETION:</span>
                  <span className="font-mono text-[11px] text-blue-700 font-bold">54.2 KM / 132.0 KM (41.06%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOWER SECTION: PRIMAVERA P6 SYNCHRONIZED GANTT SCHEDULE GRID (Visible in SPLIT and GANTT) */}
        {viewMode !== 'SPATIAL' && (
          <div className="w-full bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex flex-col gap-3 overflow-hidden hover-elevate">
            {/* Gantt Workspace Control Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900 font-bold">
                      ORACLE PRIMAVERA P6 EPPM SYNCHRONIZED REPOSITORY
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold uppercase">
                      LIVE EPPM REST LINK
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    BASE SCHEDULE: OIL_TRUNK_REV4.8_FINAL • DATA DATE: 24-OCT-2024
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2 bg-slate-300 rounded-xs"></div>
                  <span className="text-slate-600">Baseline Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2 bg-emerald-600 rounded-xs"></div>
                  <span className="text-slate-600">Verified Physical</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2 bg-blue-600 rounded-xs"></div>
                  <span className="text-slate-600">AI Forecast</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2 bg-rose-600 rounded-xs shadow-xs animate-pulse"></div>
                  <span className="text-rose-700 font-bold">Critical Delay Path</span>
                </div>
              </div>
            </div>

            {/* Gantt Dual-Pane Container */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-12 rounded-lg overflow-hidden border border-slate-200 bg-white">
              {/* Left Activity Sheet (5 Columns Span on XL) */}
              <div className="xl:col-span-5 flex flex-col bg-white border-r border-slate-200 overflow-x-auto">
                <div className="grid grid-cols-12 bg-slate-100/80 border-b border-slate-200 py-2.5 px-3 font-mono text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  <div className="col-span-3">Activity ID</div>
                  <div className="col-span-5">Activity Description</div>
                  <div className="col-span-2 text-right">Float</div>
                  <div className="col-span-2 text-right">Phys %</div>
                </div>

                <div className="flex flex-col text-xs divide-y divide-slate-100">
                  {/* Row 1 */}
                  <div
                    onClick={() => setSelectedActId('ACT-RC-0120')}
                    className={`grid grid-cols-12 py-2 px-3 items-center transition-all cursor-pointer ${
                      selectedActId === 'ACT-RC-0120' ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-[11px] text-slate-600">ACT-RC-0120</div>
                    <div className="col-span-5 font-medium text-slate-800 truncate">Row Clearing &amp; Grubbing (Km 30-50)</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-emerald-700 font-bold">+14.0d</div>
                    <div className="col-span-2 text-right">
                      <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        100%
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div
                    onClick={() => setSelectedActId('ACT-SB-2210')}
                    className={`grid grid-cols-12 py-2 px-3 items-center transition-all cursor-pointer ${
                      selectedActId === 'ACT-SB-2210' ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-[11px] text-slate-600">ACT-SB-2210</div>
                    <div className="col-span-5 text-slate-800 truncate">Stringing &amp; Field Bending (Km 30-65)</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-slate-600">+2.0d</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-blue-700 font-bold">84%</div>
                  </div>

                  {/* Row 3 */}
                  <div
                    onClick={() => setSelectedActId('ACT-WD-3105')}
                    className={`grid grid-cols-12 py-2 px-3 items-center transition-all cursor-pointer ${
                      selectedActId === 'ACT-WD-3105' ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-[11px] text-rose-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>ACT-WD-3105
                    </div>
                    <div className="col-span-5 text-slate-800 truncate">Orbital Welding &amp; Auto NDT (Km 42)</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-rose-600 font-bold">-1.5d</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-slate-800 font-bold">62%</div>
                  </div>

                  {/* Row 4 (Selected Bottleneck) */}
                  <div
                    onClick={() => setSelectedActId('ACT-TR-4290')}
                    className={`grid grid-cols-12 py-2.5 px-3 items-center transition-all cursor-pointer shadow-2xs ${
                      mitigated
                        ? 'bg-blue-50/80 border-l-4 border-blue-700'
                        : 'bg-rose-50/70 border-l-4 border-l-rose-600 border-y border-rose-100'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-[11px] text-rose-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>ACT-TR-4290
                    </div>
                    <div className="col-span-5 font-bold text-rose-900 truncate">Trenching &amp; Lowering (Km 42+650)</div>
                    <div className="col-span-2 text-right">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border ${
                          mitigated
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-rose-100 text-rose-700 border-rose-200'
                        }`}
                      >
                        {mitigated ? '+1.8d' : '-4.2d'}
                      </span>
                    </div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-rose-900 font-bold">33%</div>
                  </div>

                  {/* Row 5 */}
                  <div
                    onClick={() => setSelectedActId('ACT-CT-3900')}
                    className={`grid grid-cols-12 py-2 px-3 items-center transition-all cursor-pointer ${
                      selectedActId === 'ACT-CT-3900' ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-[11px] text-slate-600">ACT-CT-3900</div>
                    <div className="col-span-5 text-slate-800 truncate">Joint Coating &amp; Holiday Testing</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-amber-700 font-semibold">-1.0d</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-slate-600">41%</div>
                  </div>

                  {/* Row 6 */}
                  <div
                    onClick={() => setSelectedActId('ACT-HT-1024')}
                    className={`grid grid-cols-12 py-2 px-3 items-center transition-all cursor-pointer ${
                      selectedActId === 'ACT-HT-1024' ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-3 font-mono text-[11px] text-slate-600">ACT-HT-1024</div>
                    <div className="col-span-5 text-slate-800 truncate">Section 2 Hydrostatic Test (Spread 2)</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-rose-600 font-semibold">-3.8d</div>
                    <div className="col-span-2 text-right font-mono text-[10px] text-slate-400">0%</div>
                  </div>
                </div>
              </div>

              {/* Right Gantt Canvas (7 Columns Span on XL) */}
              <div className="xl:col-span-7 flex flex-col bg-slate-50/60 overflow-x-auto relative min-w-[500px]">
                {/* Timeline Calendar Header */}
                <div className="flex w-full bg-slate-100/90 py-2 font-mono text-[10px] text-slate-500 border-b border-slate-200 select-none">
                  {['W38', 'W39', 'W40', 'W41', 'W42', 'W43', 'W44', 'W45', 'W46', 'W47', 'W48', 'W49', 'W50', 'W51', 'W52'].map(
                    (w, i) => (
                      <div
                        key={w}
                        className={`flex-1 text-center font-bold ${
                          w === 'W43' ? 'text-blue-700 bg-blue-100/70 rounded' : ''
                        }`}
                      >
                        {w}
                        <span className="block text-[8px] text-slate-400 font-normal">
                          {16 + (i * 7) % 30} {i < 2 ? 'SEP' : i < 6 ? 'OCT' : i < 10 ? 'NOV' : 'DEC'}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Gantt Grid Rows */}
                <div className="relative flex flex-col w-full flex-1 divide-y divide-slate-100">
                  {/* Data Date Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-20 pointer-events-none flex flex-col items-center transition-all duration-150"
                    style={{ left: `${timelineVal}%` }}
                  >
                    <div className="px-1.5 py-0.5 -mt-2 bg-blue-700 text-white font-mono text-[8px] font-bold rounded shadow-2xs uppercase whitespace-nowrap">
                      DATA DATE: {getWeekFromTimeline(timelineVal)}
                    </div>
                    <div className="h-full w-full bg-blue-600"></div>
                  </div>

                  {/* SVG Dependency Connectors Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <marker id="arrow-red" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="6" refY="5" viewBox="0 0 10 10">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626"></path>
                      </marker>
                      <marker id="arrow-blue" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="6" refY="5" viewBox="0 0 10 10">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"></path>
                      </marker>
                    </defs>
                    <path
                      d="M 230 76 L 255 76 L 255 108 L 270 108"
                      fill="none"
                      markerEnd="url(#arrow-red)"
                      stroke="#dc2626"
                      strokeDasharray="3 3"
                      strokeWidth="1.8"
                    ></path>
                    <path
                      d="M 360 108 L 380 108 L 380 140 L 395 140"
                      fill="none"
                      markerEnd="url(#arrow-blue)"
                      stroke="#2563eb"
                      strokeWidth="1.5"
                    ></path>
                  </svg>

                  {/* Row 1 Bar */}
                  <div className="h-10 w-full flex items-center relative px-2 hover:bg-slate-100/50 transition-colors">
                    <div className="absolute left-[3%] w-[26%] h-1.5 bg-slate-300 rounded-full -top-0.5"></div>
                    <div className="absolute left-[3%] w-[25%] h-5 bg-emerald-600 rounded shadow-xs flex items-center px-2 cursor-pointer">
                      <span className="font-mono text-[9px] text-white font-bold truncate">100% COMPLETE • UAV VERIFIED</span>
                    </div>
                  </div>

                  {/* Row 2 Bar */}
                  <div className="h-10 w-full flex items-center relative px-2 hover:bg-slate-100/50 transition-colors">
                    <div className="absolute left-[15%] w-[32%] h-1.5 bg-slate-300 rounded-full -top-0.5"></div>
                    <div className="absolute left-[15%] w-[22%] h-5 bg-emerald-600 rounded-l flex items-center px-2 shadow-xs cursor-pointer">
                      <span className="font-mono text-[9px] text-white font-bold">84% DONE</span>
                    </div>
                    <div className="absolute left-[37%] w-[7%] h-5 bg-blue-600 rounded-r flex items-center px-1 cursor-pointer">
                      <span className="font-mono text-[8px] text-white font-bold">AI EST</span>
                    </div>
                  </div>

                  {/* Row 3 Bar */}
                  <div className="h-10 w-full flex items-center relative px-2 hover:bg-slate-100/50 transition-colors">
                    <div className="absolute left-[24%] w-[22%] h-1.5 bg-slate-300 rounded-full -top-0.5"></div>
                    <div className="absolute left-[24%] w-[13%] h-5 bg-blue-600 rounded-l flex items-center px-2 shadow-xs cursor-pointer">
                      <span className="font-mono text-[9px] text-white font-bold">WELD 62%</span>
                    </div>
                    <div className="absolute left-[37%] w-[8%] h-5 bg-rose-500 rounded-r flex items-center px-1 cursor-pointer">
                      <span className="font-mono text-[8px] text-white font-bold">-1.5d SLIP</span>
                    </div>
                  </div>

                  {/* Row 4 Bar (Critical Bottleneck) */}
                  <div className="h-11 w-full flex items-center relative px-2 bg-rose-50/40 transition-colors">
                    <div className="absolute left-[28%] w-[24%] h-1.5 bg-slate-300 rounded-full -top-0.5"></div>
                    <div className="absolute left-[28%] w-[8.6%] h-6 bg-blue-700 rounded-l flex items-center px-2 shadow-xs cursor-pointer">
                      <span className="font-mono text-[9px] text-white font-bold">33%</span>
                    </div>
                    {mitigated ? (
                      <div className="absolute left-[36.6%] w-[10%] h-6 bg-emerald-600 rounded-r flex items-center justify-between px-2 shadow-xs cursor-pointer transition-all">
                        <span className="font-mono text-[9px] text-white font-bold uppercase truncate">+1.8d BUFFER</span>
                        <span className="material-symbols-outlined text-[14px] text-white">verified</span>
                      </div>
                    ) : (
                      <div className="absolute left-[36.6%] w-[16%] h-6 rounded-r flex items-center justify-between px-2 shadow-xs cursor-pointer critical-bar-active transition-all">
                        <span className="font-mono text-[9px] text-white font-bold uppercase truncate">
                          4.2d CRITICAL SLIPPAGE
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-white animate-bounce">warning</span>
                      </div>
                    )}
                  </div>

                  {/* Row 5 Bar */}
                  <div className="h-10 w-full flex items-center relative px-2 hover:bg-slate-100/50 transition-colors">
                    <div className="absolute left-[44%] w-[20%] h-1.5 bg-slate-300 rounded-full -top-0.5"></div>
                    <div className="absolute left-[47%] w-[15%] h-5 bg-amber-500 rounded flex items-center px-2 shadow-xs cursor-pointer">
                      <span className="font-mono text-[8px] text-white font-bold">DELAYED START: 06 NOV</span>
                    </div>
                  </div>

                  {/* Row 6 Bar */}
                  <div className="h-10 w-full flex items-center relative px-2 hover:bg-slate-100/50 transition-colors">
                    <div className="absolute left-[62%] w-[22%] h-1.5 bg-slate-300 rounded-full -top-0.5"></div>
                    <div className="absolute left-[66%] w-[20%] h-5 bg-slate-200 border border-slate-300 rounded flex items-center px-2 cursor-pointer">
                      <span className="font-mono text-[8px] text-slate-600 truncate">
                        PRE-COMMISSIONING HYDROTEST 14.5 BAR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM FLOATING TELEMETRY & RE-SEQUENCING MITIGATION PANEL */}
        <div className="w-full bg-white rounded-xl p-4 border border-slate-300 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4 hover-elevate">
          {/* Left Diagnostic */}
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-rose-700 font-bold tracking-wide">
                  SELECTED BOTTLENECK: ACT-TR-4290
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  Trenching &amp; Lowering — Zone B Km 42+650
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-100 text-rose-800 font-bold border border-rose-200">
                  IMPACT: +$42,800/d LIQUIDATED DAMAGES
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <span className="text-slate-900 font-semibold">Corroborated Telemetry Source:</span> Dual Komatsu PC300
                CAN-bus hydraulics (34.8 MPa sustained) + Audio Voice DPR #8820-03 (Shift Eng. B. Gogoi: "Hard granitic
                bench encountered") + Sentinel-2 SAR coherence backscatter shift.
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
            <div className="flex flex-col bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-left sm:text-right w-full sm:w-auto">
              <span className="font-mono text-[10px] text-blue-700 font-bold uppercase flex items-center gap-1 sm:justify-end">
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                {mitigated ? 'MITIGATION ACTIVE' : 'AI MITIGATION READY'}
              </span>
              <span className="text-xs text-slate-800 font-medium">
                {mitigated
                  ? 'Re-sequenced padding absorbed 2.5d + Spread 3 Ripper deployed'
                  : 'Re-sequence padding to absorb 2.5d + deploy Spread 3 Ripper'}
              </span>
            </div>

            <button
              type="button"
              disabled={isApplyingMitigation}
              onClick={handleApplyMitigation}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-xs font-bold shadow-xs transition-all cursor-pointer ${
                mitigated
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : isApplyingMitigation
                  ? 'bg-blue-800 cursor-wait'
                  : 'bg-blue-700 hover:bg-blue-800 active:scale-95'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isApplyingMitigation ? 'animate-spin' : ''}`}>
                {isApplyingMitigation ? 'sync' : mitigated ? 'check_circle' : 'bolt'}
              </span>
              <span>
                {isApplyingMitigation
                  ? 'Applying Simulation...'
                  : mitigated
                  ? 'Re-sequenced (+1.8d Buffer Secured)'
                  : 'Apply AI Re-sequencing Simulation'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
