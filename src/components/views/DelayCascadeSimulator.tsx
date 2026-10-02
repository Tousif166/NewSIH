import React, { useState, useMemo } from 'react';
import { useApp } from '../../services/store';
import { 
  INITIAL_NETWORK_NODES, 
  runDelayCascadeSimulation, 
  CascadeActivityNode 
} from '../../services/delayCascadeEngine';

export const DelayCascadeSimulator: React.FC = () => {
  const { setActiveTab, showToast } = useApp();

  const [selectedRootId, setSelectedRootId] = useState<string>('ACT-TR-4290');
  const [injectedDelay, setInjectedDelay] = useState<number>(14);
  const [activeMitigations, setActiveMitigations] = useState<string[]>([]);
  const [isExportingDirective, setIsExportingDirective] = useState<boolean>(false);

  // Run simulation reactively
  const simulationResult = useMemo(() => {
    return runDelayCascadeSimulation(selectedRootId, injectedDelay, activeMitigations);
  }, [selectedRootId, injectedDelay, activeMitigations]);

  const toggleMitigation = (id: string) => {
    setActiveMitigations(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
    showToast('Recalculating DAG network ripple & float absorption...', 'info');
  };

  const selectedNode = INITIAL_NETWORK_NODES.find(n => n.id === selectedRootId);

  const formatLakhs = (valInr: number) => {
    const lakhs = valInr / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  const handleExportDirective = () => {
    setIsExportingDirective(true);
    setTimeout(() => {
      setIsExportingDirective(false);
      showToast('P6 Recovery Schedule Directive (Form 14-B) generated and signed.', 'success');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* HEADER BAR */}
      <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col gap-4 hover-elevate">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-blue-700 uppercase tracking-widest font-semibold">
                SIH26122 INNOVATION #4
              </span>
              <span className="font-mono text-[10px] text-slate-300">/</span>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                CPM/PERT Network Intelligence
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[24px]">hub</span>
                AI Delay Cascade Propagation Simulator (DAG Network)
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                STOCHASTIC CPM/PERT
              </span>
              <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold">
                CLAUSE 27.1 LD ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('GANTT_4D')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">waterfall_chart</span>
              <span>View in 4D Gantt</span>
            </button>
            <button
              onClick={handleExportDirective}
              disabled={isExportingDirective}
              className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>{isExportingDirective ? 'Compiling Directive...' : 'Export Recovery Directive'}</span>
            </button>
          </div>
        </div>

        {/* DELAY INJECTION CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
          {/* Root Activity Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-blue-700">radio_button_checked</span>
              1. Select Slippage Trigger Activity:
            </label>
            <select
              value={selectedRootId}
              onChange={(e) => setSelectedRootId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              {INITIAL_NETWORK_NODES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.code}: {n.name} [{n.chainage}]
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 font-mono">
              Contractor: <strong className="text-slate-800">{selectedNode?.contractor}</strong>
            </span>
          </div>

          {/* Delay Slider */}
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-rose-600">hourglass_top</span>
                2. Inject Activity Delay: <strong className="text-rose-700 text-sm">+{injectedDelay} Days</strong>
              </label>
              {/* Presets */}
              <div className="flex items-center gap-1">
                {[7, 14, 21, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setInjectedDelay(d)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer transition-colors ${
                      injectedDelay === d 
                        ? 'bg-rose-700 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    +{d}d
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="45"
              value={injectedDelay}
              onChange={(e) => setInjectedDelay(parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-1"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>+1 Day (Minor Delay)</span>
              <span>+14 Days (Hard Bedrock Hit)</span>
              <span>+45 Days (Severe Siltation)</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMMERCIAL IMPACT & FINANCIAL EXPOSURE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs flex flex-col gap-1 hover-elevate">
          <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Overall Project COD Slip</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-700">+{simulationResult.projectSlipDays} Days</span>
            <span className="text-xs text-rose-800 font-bold font-mono">CRITICAL LAG</span>
          </div>
          <span className="text-[11px] text-slate-600">Commissioning pushes from 31 Mar to {31 + simulationResult.projectSlipDays} Apr</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs flex flex-col gap-1 hover-elevate">
          <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Clause 27.1 Liquidated Damages</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-800">
              {formatLakhs(simulationResult.totalLiquidatedDamages)}
            </span>
          </div>
          <span className="text-[11px] text-slate-600">Rate: ₹1.50L / day of delay beyond milestone</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs flex flex-col gap-1 hover-elevate">
          <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Contractor Demurrage Standing</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-800">
              {formatLakhs(simulationResult.totalDemurrageCost)}
            </span>
          </div>
          <span className="text-[11px] text-slate-600">Idle HDD rig &amp; welding crews demurrage claim</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-300 bg-rose-50/50 shadow-xs flex flex-col gap-1 hover-elevate">
          <span className="font-mono text-[10px] text-rose-800 uppercase font-bold">Total Commercial Exposure</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-900">
              {formatLakhs(simulationResult.totalFinancialExposure)}
            </span>
          </div>
          <span className="text-[11px] text-rose-800 font-medium">Risk of statutory audit non-compliance</span>
        </div>
      </div>

      {/* ANIMATED CASCADE NETWORK VISUALIZER */}
      <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col gap-4 hover-elevate">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 text-[18px]">account_tree</span>
            DYNAMIC DELAY CASCADE RIPPLE WAVE (DIRECTED ACYCLIC GRAPH)
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {simulationResult.affectedNodes.length} activities impacted along the network
          </span>
        </div>

        {/* Step-by-step Cascade Nodes */}
        <div className="flex flex-col gap-2.5">
          {simulationResult.affectedNodes.map((item, idx) => {
            const isRoot = item.nodeId === selectedRootId;

            return (
              <div
                key={item.nodeId}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isRoot
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                    : item.becameCritical
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* Node Identity */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    isRoot 
                      ? 'bg-rose-600 text-white shadow-xs' 
                      : 'bg-blue-100 text-blue-900'
                  }`}>
                    L{item.cascadeLevel}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900">{item.code}</span>
                      <span className="text-xs text-slate-700 font-sans font-semibold">{item.name}</span>
                      {isRoot && (
                        <span className="px-2 py-0.2 rounded bg-rose-200 text-rose-900 font-mono text-[9px] font-bold">
                          ORIGIN OF DELAY
                        </span>
                      )}
                      {item.becameCritical && !isRoot && (
                        <span className="px-2 py-0.2 rounded bg-amber-200 text-amber-950 font-mono text-[9px] font-bold">
                          BECAME CRITICAL (0 FLOAT)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Planned Finish: Day {item.originalFinishDay} → <strong>New Finish: Day {item.newFinishDay}</strong>
                    </span>
                  </div>
                </div>

                {/* Delay Impact Metrics */}
                <div className="flex items-center gap-4 flex-wrap self-end sm:self-center font-mono text-xs">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase">Delay Transmitted</span>
                    <strong className="text-rose-700 font-bold">+{item.delayPushedDays} Days</strong>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase">Float Absorbed</span>
                    <strong className="text-blue-700 font-bold">{item.floatConsumed} Days</strong>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase">Remaining Float</span>
                    <strong className={item.remainingFloat === 0 ? 'text-rose-700' : 'text-emerald-700'}>
                      {item.remainingFloat} Days
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI PRESCRIPTIVE MITIGATION OPTIMIZER */}
      <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-xs flex flex-col gap-4 hover-elevate">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[22px]">auto_fix_high</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                AI Prescriptive Mitigation &amp; Crash Scheduling Optimizer
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Select targeted interventions to compress critical path and recover lost project float
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            {activeMitigations.length} MITIGATIONS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {simulationResult.mitigationOptions.map((opt) => {
            const isApplied = activeMitigations.includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => toggleMitigation(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between gap-3 ${
                  isApplied
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{opt.title}</span>
                    <input
                      type="checkbox"
                      checked={isApplied}
                      onChange={() => {}}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between font-mono text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">Cost:</span>
                    <strong className="text-slate-800">₹{opt.costInLakhs} L</strong>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500">Float Gain:</span>
                    <strong className="text-emerald-700 font-bold">+{opt.daysRecovered} Days</strong>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500">ROI:</span>
                    <strong className="text-blue-700 font-bold">{opt.roiRatio}x</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
