import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  DRONE_FLEET_DATA, 
  ORTHOPHOTO_SECTORS, 
  DroneUAV, 
  OrthophotoComparisonPoint 
} from '../../services/droneFleetEngine';

export const DroneFleetView: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [drones, setDrones] = useState<DroneUAV[]>(DRONE_FLEET_DATA);
  const [selectedOrtho, setSelectedOrtho] = useState<OrthophotoComparisonPoint>(ORTHOPHOTO_SECTORS[0]);
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [isSyncingP6, setIsSyncingP6] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  const handleSyncP6 = () => {
    setIsSyncingP6(true);
    setTimeout(() => {
      setIsSyncingP6(false);
      setIsSynced(true);
      showToast(`Drone orthophoto progress (98.4% trench compliance) synced to Primavera P6 Activity ACT-DJ-HDD-92.`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                UAV AUTONOMOUS FLIGHT FLEET // 132 KM CORRIDOR
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                LIDAR + 45MP PHOTOGRAMMETRY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              Drone Fleet Progress Imaging & Orthophoto Timeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Survey-grade aerial monitoring across 4 UAV sectors. Dual-layer orthophoto timeline slider with automated volumetric earthwork computation and AI object detection for Primavera P6 as-built reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('PIPELINE_3D')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-bold transition-all border border-white/10 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              3D Digital Twin
            </button>
          </div>
        </div>

        {/* 4 Drones Live Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          {drones.map(drone => (
            <div 
              key={drone.id}
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    drone.status === 'IN_FLIGHT' ? 'bg-emerald-400 animate-ping' :
                    drone.status === 'CHARGING_DOCK' ? 'bg-amber-400' : 'bg-slate-400'
                  }`}></span>
                  {drone.callsign.split('-')[1]}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  drone.status === 'IN_FLIGHT' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-slate-300'
                }`}>
                  {drone.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 font-medium truncate">{drone.sector}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">{drone.chainageRange}</div>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span>BATTERY: {drone.batteryPct}%</span>
                <span>ALT: {drone.altitudeMeters > 0 ? `${drone.altitudeMeters}m` : 'GROUND'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Orthophoto Timeline & Volumetrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive Before/After Split Slider */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#0b111e] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/40">
                    CHAINAGE KM {selectedOrtho.chainageKm}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Dual Orthophoto Alignment</span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">{selectedOrtho.locationName}</h3>
              </div>

              {/* Sector Selector */}
              <div className="flex rounded-lg bg-slate-100 dark:bg-[#070c14] p-0.5 border border-slate-200 dark:border-slate-800">
                {ORTHOPHOTO_SECTORS.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedOrtho(sec)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                      selectedOrtho.id === sec.id 
                        ? 'bg-white dark:bg-[#0f172a] text-slate-900 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-emerald-500/30' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Ch. {sec.chainageKm}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Image Canvas Area */}
            <div className="relative w-full h-[380px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner select-none bg-slate-950">
              {/* Background (After / Current Flight Image) */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/pipeline-drone-4k.jpg"
                  alt="Current Flight UAV Photogrammetry"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40"></div>

                {/* Pipeline Trench Callout Ribbon */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-12 bg-black/60 backdrop-blur-xs border-y-2 border-amber-500/80 shadow-2xl flex items-center justify-around pointer-events-none">
                  <span className="font-mono text-[10px] text-amber-300 font-bold tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    24" Welded Pipe Stringing in Trench
                  </span>
                </div>

                {/* Current Flight Telemetry HUD (Fixed on Top-Right & Bottom-Right to PREVENT collisions) */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-slate-950/85 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-bold backdrop-blur-xs shadow-md">
                    CURRENT FLIGHT: {selectedOrtho.currentDate}
                  </span>
                  <span className="text-right font-mono text-[9px] text-slate-300 bg-black/75 px-2 py-0.5 rounded border border-white/10 backdrop-blur-xs">
                    GSD 1.15 cm/px • Zenmuse P1 Photogrammetry
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-emerald-200 bg-black/80 border border-emerald-500/40 p-2 rounded-lg backdrop-blur-xs max-w-xs text-right shadow-md pointer-events-none">
                  {selectedOrtho.currentStage}
                </div>
              </div>

              {/* Foreground (Before / Baseline Survey Image) with Clipping Mask based on Slider */}
              <div 
                className="absolute inset-0 overflow-hidden border-r-2 border-emerald-400 shadow-2xl"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="relative h-full" style={{ width: '100%', minWidth: '700px' }}>
                  <img
                    src="/images/pipeline-ortho-survey.jpg"
                    alt="Baseline Virgin RoW Survey"
                    className="w-full h-full object-cover filter saturate-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40"></div>

                  {/* Baseline Telemetry HUD (Fixed on Top-Left & Bottom-Left) */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded bg-slate-950/85 text-slate-200 border border-white/30 text-[10px] font-mono font-bold backdrop-blur-xs shadow-md">
                      BASELINE SURVEY: {selectedOrtho.baselineDate}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-slate-200 bg-black/80 border border-white/20 p-2 rounded-lg backdrop-blur-xs max-w-xs shadow-md pointer-events-none">
                    {selectedOrtho.baselineStage}
                  </div>
                </div>
              </div>

              {/* Slider Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl flex items-center justify-center z-30 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-2xl flex items-center justify-center font-bold text-xs border-2 border-emerald-400">
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                </div>
              </div>

              {/* Interactive Range Input Invisible Overlay */}
              <input 
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-40"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
              <span>← Drag slider left to reveal Today's Excavation &amp; Pipe Stringing</span>
              <span>Slide right to view Virgin Baseline →</span>
            </div>
          </div>

          {/* AI Object Detection Bounding Boxes */}
          <div className="bg-white dark:bg-[#0b111e] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">center_focus_strong</span>
              Automated Computer Vision Detections (YOLOv11 Drone-Trained)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedOrtho.aiDetections.map((det, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{det.label}</div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      Confidence: {det.confidencePct}% • Category: {det.category}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 font-mono font-bold text-sm">
                    {det.count}x
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Volumetric Earthwork & P6 Sync Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0b111e] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400">terrain</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">LiDAR Volumetric Earthwork</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Excavation Cut Volume:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedOrtho.volumetricCutM3.toLocaleString()} m³</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070c14] border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Backfill Fill Volume:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedOrtho.volumetricFillM3.toLocaleString()} m³</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex justify-between items-center">
                <span className="text-emerald-800 dark:text-emerald-300 font-semibold">Net Balance:</span>
                <span className="font-black text-emerald-900 dark:text-emerald-200">
                  +{(selectedOrtho.volumetricCutM3 - selectedOrtho.volumetricFillM3).toLocaleString()} m³
                </span>
              </div>
            </div>

            {/* Trench Depth Conformance Metric */}
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#070c14] border border-slate-800 text-white space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Trench Depth Conformance:</span>
                <span className="font-bold text-emerald-400">99.1% (PASSED)</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Design: {selectedOrtho.trenchDepthDesignM.toFixed(2)}m • Measured: {selectedOrtho.trenchDepthMeasuredM.toFixed(2)}m
              </div>
              <div className="w-full bg-slate-700 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '99.1%' }}></div>
              </div>
            </div>

            {/* P6 Milestone As-Built Reconciliation Action */}
            <div className="pt-2">
              <button
                disabled={isSyncingP6}
                onClick={handleSyncP6}
                className={`w-full py-2.5 px-4 rounded-xl font-mono font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isSynced 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isSyncingP6 ? 'sync' : isSynced ? 'check_circle' : 'published_with_changes'}
                </span>
                {isSyncingP6 ? 'CALCULATING AS-BUILT DELTAS...' : isSynced ? 'SYNCED TO PRIMAVERA P6' : 'SYNC TO PRIMAVERA P6 WBS'}
              </button>
            </div>
          </div>

          {/* CVC Vigilance Compliance Tag */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-2xl text-amber-950 dark:text-amber-200 text-xs font-mono space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">verified_user</span>
              CVC Fraud Prevention Seal
            </div>
            <p className="text-[11px] text-amber-900 dark:text-amber-300/90 leading-relaxed">
              Orthophoto point cloud automatically prevents subcontractor ghost billing on earthwork excavation quantities by cross-verifying with e-MB claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
