import React, { useState, useMemo } from 'react';
import { useApp } from '../../services/store';
import { 
  BASELINE_FLOW_PARAMS, 
  FlowSimulationParams, 
  simulateHydraulics 
} from '../../services/flowEnergyEngine';

export const FlowEnergySimulator: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [params, setParams] = useState<FlowSimulationParams>(BASELINE_FLOW_PARAMS);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);

  const results = useMemo(() => simulateHydraulics(params), [params]);

  const handleRunOptimization = () => {
    setParams(results.optimizedParams);
    setIsOptimized(true);
    showToast(`AI Hydraulics Optimization applied: DRA dosage adjusted to 15 ppm, Digboi bath temp set to 52°C. Saved ₹42.8L/month!`, 'success');
  };

  const handleReset = () => {
    setParams(BASELINE_FLOW_PARAMS);
    setIsOptimized(false);
    showToast('Reset to Baseline Pumping Schedule', 'info');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/40 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                COMPUTATIONAL FLUID DYNAMICS (CFD) // 132 KM TRUNKLINE
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                DRAG REDUCING AGENT (DRA) AI TUNER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              Energy-Optimization & Flow Digital Twin Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Physics-based hydraulic grade line (HGL) simulator for high-wax Assam crude. Tunes booster pump dispatch and Drag Reducing Agent (DRA) dosage to prevent wax gelation, save ₹40+ Lakhs monthly, and reduce carbon emissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isOptimized ? (
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-bold transition-all border border-white/20"
              >
                Reset Baseline
              </button>
            ) : (
              <button
                onClick={handleRunOptimization}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                Run AI Energy Optimization
              </button>
            )}

            <button
              onClick={() => setActiveTab('PIPELINE_3D')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-bold transition-all border border-white/10 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              3D Digital Twin
            </button>
          </div>
        </div>

        {/* 4 Key Output Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Total Pumping Power</span>
            <span className="text-lg font-black text-white">{results.totalPowerMw} MW</span>
            <span className="text-[10px] text-teal-300 block mt-0.5">{results.dailyEnergyMwh} MWh/day</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Daily Grid Power Cost</span>
            <span className="text-lg font-black text-amber-300">₹{results.dailyCostInrLakhs} Lakhs</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">@ ₹8.50 / kWh</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase">Carbon Footprint</span>
            <span className="text-lg font-black text-white">{results.co2TonsPerDay} Tons</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">CO₂ Equivalent / Day</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Projected Net Savings</span>
            <span className="text-lg font-black text-emerald-300">₹{results.monthlySavingsInrLakhs}L / mo</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">-{results.co2ReductionTonsPerMonth} Tons CO₂ / mo</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters Sliders & Hydraulic Grade Line Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 1 Col: Interactive Flow & Pumping Controls */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-[20px] text-teal-600">tune</span>
            <h3 className="font-bold text-sm text-slate-900">Hydraulic Operating Setpoints</h3>
          </div>

          {/* Slider 1: Flow Rate */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Crude Throughput:</span>
              <span className="font-bold text-slate-900">{params.flowRateM3H} m³/hr</span>
            </div>
            <input
              type="range"
              min="800"
              max="2200"
              step="50"
              value={params.flowRateM3H}
              onChange={(e) => setParams({ ...params, flowRateM3H: Number(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>800 m³/h</span>
              <span>Nominal: 1420</span>
              <span>2200 m³/h</span>
            </div>
          </div>

          {/* Slider 2: Digboi Inlet Temperature */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Digboi Bath Heating Temp:</span>
              <span className="font-bold text-slate-900">{params.inletTempC}°C</span>
            </div>
            <input
              type="range"
              min="35"
              max="65"
              step="1"
              value={params.inletTempC}
              onChange={(e) => setParams({ ...params, inletTempC: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>35°C</span>
              <span>WAT: 30.5°C</span>
              <span>65°C</span>
            </div>
          </div>

          {/* Slider 3: Drag Reducing Agent (DRA) Dosage */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>DRA Polymer Injection:</span>
              <span className="font-bold text-teal-700">{params.draPpm} PPM</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={params.draPpm}
              onChange={(e) => setParams({ ...params, draPpm: Number(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 PPM (Raw)</span>
              <span>15 PPM (Optimal)</span>
              <span>30 PPM</span>
            </div>
          </div>

          {/* Slider 4: Subsoil Ambient Ground Temp */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Subsoil Monsoon Temp:</span>
              <span className="font-bold text-slate-900">{params.subsoilTempC}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="30"
              step="1"
              value={params.subsoilTempC}
              onChange={(e) => setParams({ ...params, subsoilTempC: Number(e.target.value) })}
              className="w-full accent-slate-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20°C (Cold Winter)</span>
              <span>24°C (Monsoon)</span>
              <span>30°C</span>
            </div>
          </div>

          {/* Quick AI Presets */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono block">
              Pumping Schedule Modes:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setParams({ ...params, flowRateM3H: 1800, draPpm: 20, inletTempC: 56 })}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-left"
              >
                <div className="font-bold">⚡ Max Surge Flow</div>
                <div className="text-[10px] text-slate-500">1800 m³/h • 20 PPM</div>
              </button>
              <button
                onClick={() => setParams({ ...params, flowRateM3H: 1100, draPpm: 12, inletTempC: 45 })}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-left"
              >
                <div className="font-bold">🌱 Eco-Economy</div>
                <div className="text-[10px] text-slate-500">1100 m³/h • Low MW</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: 132KM Hydraulic Grade Line & Temperature Decay Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-teal-600">stacked_line_chart</span>
                  132 KM Hydraulic Grade Line (HGL) & Elevation Profile
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Static head + dynamic friction head loss vs Ground Elevation (Digboi 165m → Duliajan 110m)
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-teal-700">
                  <span className="w-3 h-0.5 bg-teal-600 inline-block"></span> HGL (m Head)
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-3 h-0.5 bg-stone-500 inline-block"></span> Ground Profile
                </span>
              </div>
            </div>

            {/* Custom SVG Responsive Profile Chart */}
            <div className="relative bg-slate-950 rounded-xl p-4 text-white overflow-hidden">
              <svg viewBox="0 0 700 240" className="w-full h-56">
                {/* Elevation Ground Area */}
                <path
                  d={`M 20 220 ` + results.profilePoints.map((p, idx) => {
                    const x = 20 + (p.km / 132) * 660;
                    const y = 220 - (p.elevationM / 200) * 80;
                    return `L ${x} ${y}`;
                  }).join(' ') + ` L 680 220 Z`}
                  fill="#334155"
                  opacity="0.3"
                />

                {/* Ground Line */}
                <path
                  d={`M 20 ` + (220 - (results.profilePoints[0].elevationM / 200) * 80) + results.profilePoints.map((p, idx) => {
                    const x = 20 + (p.km / 132) * 660;
                    const y = 220 - (p.elevationM / 200) * 80;
                    return ` L ${x} ${y}`;
                  }).join('')}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Hydraulic Grade Line (HGL) */}
                <path
                  d={`M 20 ` + (220 - (results.profilePoints[0].hglMeters / 900) * 190) + results.profilePoints.map((p, idx) => {
                    const x = 20 + (p.km / 132) * 660;
                    const y = 220 - (p.hglMeters / 900) * 190;
                    return ` L ${x} ${y}`;
                  }).join('')}
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3.5"
                  className="filter drop-shadow-[0_0_6px_rgba(20,184,166,0.6)]"
                />

                {/* Profile Point Dots & Station Callouts */}
                {results.profilePoints.map((p, idx) => {
                  const x = 20 + (p.km / 132) * 660;
                  const y = 220 - (p.hglMeters / 900) * 190;

                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="3.5" fill="#2dd4bf" stroke="#ffffff" strokeWidth="1" />
                      {p.stationName && (
                        <>
                          <line x1={x} y1={y} x2={x} y2={220} stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
                          <text x={x} y={y - 8} fill="#99f6e4" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                            {p.stationName.split(' ')[0]}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>KM 0.0 (Digboi IPS)</span>
                <span>KM 34.8 (Margherita Booster Kick)</span>
                <span>KM 92.1 (Burhi Dihing)</span>
                <span>KM 132.0 (Duliajan Refinery)</span>
              </div>
            </div>

            {/* Thermal Decay Table along 132km */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono mb-2">
                Corridor Thermal Profile vs Wax Appearance Temperature (30.5°C):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                {results.profilePoints.filter(p => p.stationName).map((p, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-xl border text-center ${
                      p.isWaxRisk ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 truncate">{p.stationName?.split(' ')[0]}</div>
                    <div className="text-sm font-black mt-0.5">{p.temperatureC}°C</div>
                    <div className="text-[9px] font-bold mt-0.5">
                      {p.isWaxRisk ? '⚠️ WAX DEPOSITION RISK' : '✅ SAFE FLUID'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
