import React from 'react';
import { useApp } from '../../services/store';
import { 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { currentWhatIf, updateWhatIfParams, activeProject } = useApp();

  return (
    <div className="p-3.5 sm:p-6 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400 shrink-0" />
            What-If Schedule Recovery Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic scenario modeling: Simulate adding craft manpower, extending shifts, or fast-tracking parallel paths to recover critical-path schedule slippage.
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-amber-300 text-xs font-mono font-semibold self-start sm:self-auto flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive CPM Simulation Engine</span>
        </div>
      </div>

      {/* Main Comparison Banner: Baseline vs Current vs Scenario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline Plan */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-center space-y-2">
          <span className="text-[10px] font-mono uppercase text-sky-400 font-bold bg-sky-950/60 px-2.5 py-0.5 rounded border border-sky-800/40">
            1. Contractual Baseline
          </span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {currentWhatIf.baselineFinish}
          </div>
          <p className="text-xs text-slate-400">Baseline Target Completion</p>
          <div className="text-xs font-mono text-slate-500 pt-2 border-t border-slate-800">
            Variance: 0 Days
          </div>
        </div>

        {/* Current Forecast (Delayed) */}
        <div className="bg-slate-900 p-5 rounded-xl border border-rose-500/40 text-center space-y-2">
          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/40">
            2. Current Unmitigated Forecast
          </span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            {currentWhatIf.currentForecastFinish}
          </div>
          <p className="text-xs text-slate-400">Projected Slippage: <strong className="text-rose-400">+18 Days</strong></p>
          <div className="text-xs font-mono text-rose-300 pt-2 border-t border-slate-800">
            Risk Score: 68/100 (HIGH)
          </div>
        </div>

        {/* Simulated Scenario */}
        <div className="bg-slate-900 p-5 rounded-xl border border-emerald-500/50 text-center space-y-2 ring-1 ring-emerald-500/30">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
            3. Simulated Mitigated Plan
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {currentWhatIf.simulatedFinish}
          </div>
          <p className="text-xs text-emerald-300 font-semibold">
            Recovered: <strong className="text-white">+{currentWhatIf.daysRecovered} Calendar Days</strong>
          </p>
          <div className="text-xs font-mono text-emerald-400 pt-2 border-t border-slate-800 font-bold">
            Risk Reduced by -{currentWhatIf.riskReductionPoints} pts
          </div>
        </div>
      </div>

      {/* Interactive Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders & Toggles */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-sm">
          <h2 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Adjust Scenario Levers
          </h2>

          {/* Manpower Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Additional Piping / Rigging Workers</span>
              <span className="font-mono text-amber-400 font-bold">+{currentWhatIf.parameters.additionalWorkers} Craftsmen</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={5}
              value={currentWhatIf.parameters.additionalWorkers}
              onChange={(e) => updateWhatIfParams({ additionalWorkers: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Status Quo)</span>
              <span>15 (Recommended)</span>
              <span>30 (Double Crew)</span>
            </div>
          </div>

          {/* Shift Extension Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Shift Extension / Daily Overtime</span>
              <span className="font-mono text-amber-400 font-bold">+{currentWhatIf.parameters.shiftExtensionHours} Hours / Day</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={currentWhatIf.parameters.shiftExtensionHours}
              onChange={(e) => updateWhatIfParams({ shiftExtensionHours: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 hrs (Standard 8h)</span>
              <span>2 hrs (Extended 10h)</span>
              <span>4 hrs (Double Shift)</span>
            </div>
          </div>

          {/* Fast-Tracking Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div className="text-xs">
                <div className="font-semibold text-white">Expedite Spool Logistics</div>
                <p className="text-[11px] text-slate-400">Airfreight priority valves & prefabricated bends directly from Guwahati vendor.</p>
              </div>
              <input
                type="checkbox"
                checked={currentWhatIf.parameters.expediteMaterials}
                onChange={(e) => updateWhatIfParams({ expediteMaterials: e.target.checked })}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div className="text-xs">
                <div className="font-semibold text-white">Parallelize Piping & Electrical Cable Trays</div>
                <p className="text-[11px] text-slate-400">Run cable tray supports concurrently with piping spool rigging in Area 04.</p>
              </div>
              <input
                type="checkbox"
                checked={currentWhatIf.parameters.parallelizePiping}
                onChange={(e) => updateWhatIfParams({ parallelizePiping: e.target.checked })}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Cost & Operational Feasibility Summary */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Scenario Trade-Off & Budget Impact
            </h2>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Estimated Acceleration Cost:</span>
                <span className="font-mono font-bold text-lg text-emerald-400">
                  ₹{(currentWhatIf.costImpactINR / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>LD (Liquidated Damages) Avoided:</span>
                <span className="font-mono font-semibold text-white">
                  ₹{((currentWhatIf.daysRecovered * 1800000) / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                <span>Net Commercial Benefit:</span>
                <span className="font-mono font-bold text-amber-400">
                  ₹{(((currentWhatIf.daysRecovered * 1800000) - currentWhatIf.costImpactINR) / 100000).toFixed(2)} Lakhs Positive
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Recommended Operational Action:
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Deploying 15 additional riggers from AIES standby gang combined with expedited spool transport compresses the Area 04 critical path by 13 calendar days, shifting forecasted plant commissioning back to 05-Dec.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            * All simulation outputs are engineering forecasts calibrated against historical Oil India execution velocities.
          </div>
        </div>
      </div>
    </div>
  );
};
