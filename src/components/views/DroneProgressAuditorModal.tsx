import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { SAMPLE_DRONE_MISSIONS } from '../../services/frontierEngine';
import { DroneAuditMission } from '../../types/index';

export const DroneProgressAuditorModal: React.FC = () => {
  const { isDroneAuditorOpen, setIsDroneAuditorOpen, showToast } = useApp();
  const [selectedMission, setSelectedMission] = useState<DroneAuditMission>(SAMPLE_DRONE_MISSIONS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [showTrenchMask, setShowTrenchMask] = useState<boolean>(true);
  const [showPipeMask, setShowPipeMask] = useState<boolean>(true);
  const [showBackfillMask, setShowBackfillMask] = useState<boolean>(true);
  const [isDeductionApplied, setIsDeductionApplied] = useState<boolean>(false);

  if (!isDroneAuditorOpen) return null;

  const handleApplyDeduction = () => {
    setIsDeductionApplied(true);
    showToast(`Deduction Applied: -${Math.abs(selectedMission.discrepancyMeters)}m unverified work withheld from Contractor RA Bill.`, 'warning');
  };

  const handleExportDroneCert = () => {
    showToast('Exporting Drone Orthomosaic CV Verification Certificate (.PDF)...', 'info');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setIsDroneAuditorOpen(false)}
      aria-hidden="true"
    >
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0c1220] rounded-2xl shadow-2xl border border-slate-300 dark:border-amber-500/20 overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Drone Orthomosaic & Satellite CV Progress Auditor
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono font-bold">
                  AI SEGMENTATION v4.2
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono font-bold">
                  SIH26122 INNOVATION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pixel-calibrated spatial progress verification comparing contractor claimed DPR linear advance against high-resolution aerial imagery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDroneCert}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
              <span>Audit Certificate</span>
            </button>
            <button
              onClick={() => setIsDroneAuditorOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
              title="Close Modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Sub-Header: Mission Selector & Vital Vitals */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-600 uppercase">Mission:</span>
            <select
              value={selectedMission.id}
              onChange={(e) => {
                const found = SAMPLE_DRONE_MISSIONS.find(m => m.id === e.target.value);
                if (found) {
                  setSelectedMission(found);
                  setIsDeductionApplied(false);
                }
              }}
              className="font-mono text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {SAMPLE_DRONE_MISSIONS.map(m => (
                <option key={m.id} value={m.id}>{m.missionName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
              <span className="text-slate-400 font-bold">CHAINAGE:</span>
              <span className="font-bold text-blue-700">KM {selectedMission.chainageKm}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
              <span className="text-slate-400 font-bold">TARGET:</span>
              <span className="font-bold text-slate-900">{selectedMission.targetActivityCode}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              <span>CV CONFIDENCE:</span>
              <span>{selectedMission.confidenceScore}%</span>
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">

          {/* Alert Banner if Discrepancy Flagged */}
          {selectedMission.discrepancyMeters < 0 && (
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDeductionApplied 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[24px] ${isDeductionApplied ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isDeductionApplied ? 'verified' : 'warning'}
                </span>
                <div>
                  <div className="font-bold text-sm">
                    {isDeductionApplied
                      ? 'Contractor Progress Deduction Enforced in e-MB Ledger'
                      : `Spatial Discrepancy Detected: ${Math.abs(selectedMission.discrepancyMeters)}m Claimed Without Visual Evidence`}
                  </div>
                  <div className="text-xs mt-0.5 opacity-90">
                    {selectedMission.notes}
                  </div>
                </div>
              </div>
              {!isDeductionApplied && (
                <button
                  onClick={handleApplyDeduction}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-mono text-xs font-bold shadow-xs shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  Hold ₹12.4L & Apply Deduction
                </button>
              )}
            </div>
          )}

          {/* Interactive Before vs After Drone Orthomosaic Split Viewer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-blue-600">compare</span>
                <span>Interactive Temporal Split Slider (Drag horizontally)</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500">← BEFORE (Pre-Trenching Ground)</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-700 font-bold">AFTER (Active Lowering & Backfill) →</span>
              </div>
            </div>

            {/* Split Image Canvas Container */}
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md select-none">
              
              {/* After Image (Full background) */}
              <img 
                src={selectedMission.afterImageUrl} 
                alt="After Orthomosaic" 
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* CV Segmentation Overlays (rendered on top of After image) */}
              <div className="absolute inset-0 pointer-events-none">
                {showTrenchMask && (
                  <div className="absolute top-[28%] left-[10%] w-[65%] h-[32px] bg-amber-500/40 border-2 border-amber-400 rounded-sm flex items-center justify-center backdrop-blur-2xs">
                    <span className="bg-amber-950/80 text-amber-200 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                      🟡 DETECTED TRENCH: 280m
                    </span>
                  </div>
                )}
                {showPipeMask && (
                  <div className="absolute top-[38%] left-[12%] w-[60%] h-[16px] bg-blue-500/40 border-2 border-blue-400 rounded-sm flex items-center justify-center">
                    <span className="bg-blue-950/80 text-blue-200 font-mono text-[9px] font-bold px-1 rounded">
                      🔵 PIPE STRING: 260m
                    </span>
                  </div>
                )}
                {showBackfillMask && (
                  <div className="absolute top-[28%] left-[10%] w-[22%] h-[32px] bg-emerald-500/45 border-2 border-emerald-400 rounded-sm flex items-center justify-center">
                    <span className="bg-emerald-950/80 text-emerald-200 font-mono text-[9px] font-bold px-1 rounded">
                      🟢 BACKFILL: 90m
                    </span>
                  </div>
                )}
              </div>

              {/* Before Image (Clipped by slider position) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-xl"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={selectedMission.beforeImageUrl} 
                  alt="Before Orthomosaic" 
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white font-mono text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xs">
                  BASELINE: {selectedMission.surveyDate} (Pre-work)
                </div>
              </div>

              {/* Slider Handle Line */}
              <div 
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-xs border border-slate-300">
                  <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
                </div>
              </div>

              {/* Transparent Slider Input overlay */}
              <input 
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                aria-label="Before-After slider control"
              />

              {/* Right Tag */}
              <div className="absolute top-3 right-3 bg-blue-900/80 text-white font-mono text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xs">
                AI DETECTED ORTHOMOSAIC (Current)
              </div>
            </div>

            {/* Slider percentage text */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Drag slider left/right to reveal before vs current condition</span>
              <span>Split Position: {sliderPosition}%</span>
            </div>
          </div>

          {/* CV Layer Toggles & Analytical Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1: AI Segmentation Mask Toggles */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Computer Vision Masks
                </span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      Open Trench Bed (280m)
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showTrenchMask} 
                      onChange={(e) => setShowTrenchMask(e.target.checked)}
                      className="rounded text-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Pipe String on Skids (260m)
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showPipeMask} 
                      onChange={(e) => setShowPipeMask(e.target.checked)}
                      className="rounded text-blue-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      Backfilled Trench (90m)
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showBackfillMask} 
                      onChange={(e) => setShowBackfillMask(e.target.checked)}
                      className="rounded text-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                Segment Anything Model (SAM) + YOLOv8 Pipeline Trained
              </div>
            </div>

            {/* Column 2: Linear Meters Reconciliation */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Physical Advance Metrics
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Contractor Claimed in DPR:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedMission.contractorClaimedLinearMeters} meters</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">CV Detected Ground Truth:</span>
                  <span className="font-mono font-bold text-blue-700">{selectedMission.cvDetectedLinearMeters} meters</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-800 font-bold">Unverified Discrepancy:</span>
                  <span className="font-mono font-bold text-rose-700">{selectedMission.discrepancyMeters} meters</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                RTK GPS Accuracy: ±1.8 cm RMSE
              </div>
            </div>

            {/* Column 3: Audit Determination */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Audit Disposition
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Audit Status:</span>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedMission.discrepancyMeters < 0
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {selectedMission.auditStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Financial Exposure:</span>
                  <span className="font-mono font-bold text-rose-800">
                    {selectedMission.discrepancyMeters < 0 ? '₹12.40 Lakhs' : '₹0.00 (Cleared)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">e-MB Sign-off:</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {isDeductionApplied ? 'Deduction Held' : 'Pending Resolution'}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                CVC Circular 02/01/2022 Compliant Proof
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-blue-600">flight_takeoff</span>
            <span>UAV Survey Flight ID: OIL-UAV-DIGBOI-2026-F14 // Autonomous Mission</span>
          </div>

          <button
            onClick={() => setIsDroneAuditorOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer transition-all"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
