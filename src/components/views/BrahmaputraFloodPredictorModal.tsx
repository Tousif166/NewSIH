import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { SAMPLE_HYDROLOGICAL_STATIONS, SAMPLE_FLOOD_MITIGATION_PLANS } from '../../services/frontierEngine';

export const BrahmaputraFloodPredictorModal: React.FC = () => {
  const { isFloodPredictorOpen, setIsFloodPredictorOpen, showToast } = useApp();
  const [stations] = useState(SAMPLE_HYDROLOGICAL_STATIONS);
  const [mitigations, setMitigations] = useState(SAMPLE_FLOOD_MITIGATION_PLANS);
  const [executedPlans, setExecutedPlans] = useState<string[]>([]);

  if (!isFloodPredictorOpen) return null;

  const handleExecuteMitigation = (planId: string) => {
    setExecutedPlans(prev => [...prev, planId]);
    showToast('Preemptive Mitigation Executed: Heavy rigging equipment evacuated to high ground at KP 18. Schedule revised.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-blue-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">tsunami</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Brahmaputra Basin Hydrology & IMD Monsoon Early Warning Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono font-bold">
                  HYDROLOGICAL AI
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-mono font-bold">
                  SIH26122 INNOVATION
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Ingests live Central Water Commission (CWC) river gauge telemetry and IMD precipitation models across the 132km Digboi-Duliajan corridor to forecast flash floods and protect critical assets.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFloodPredictorOpen(false)}
            className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 transition-all cursor-pointer"
            title="Close Modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
          
          {/* Active Flood Alert Banner */}
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-500/60 shadow-lg shadow-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-700 dark:text-rose-400 text-[28px] animate-pulse">flood</span>
              <div>
                <div className="font-bold text-sm text-rose-950 dark:text-rose-100 flex items-center gap-2">
                  <span>FLASH FLOOD WARNING: Burhi Dihing River Gauge Exceeded Danger Level (+0.34m)</span>
                  <span className="px-2 py-0.5 rounded bg-rose-700 text-white font-mono text-[10px] font-bold">
                    IMD RED ALERT
                  </span>
                </div>
                <div className="text-xs text-rose-800 dark:text-rose-200 mt-0.5">
                  68.4mm rainfall recorded in last 24h at Khowang. Flash flood cresting in active trenching sector at KM 42+650 within 18 hours.
                </div>
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-rose-900 dark:text-rose-200 bg-white dark:bg-[#070c16] px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/40 shadow-2xs shrink-0">
              ₹42.0L Equipment At Risk
            </div>
          </div>

          {/* River Gauge Telemetry Grid */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-sky-400">water_drop</span>
              <span>CWC River Gauges & IMD Rainfall Radar (132km RoW Crossings)</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {stations.map((station) => {
                const isOverDanger = station.currentWaterLevelM >= station.dangerLevelM;
                const isOverWarning = station.currentWaterLevelM >= station.warningLevelM;
                return (
                  <div 
                    key={station.stationId}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isOverDanger 
                        ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40 ring-2 ring-rose-500/20' 
                        : isOverWarning 
                        ? 'bg-amber-50/80 dark:bg-amber-950/25 border-amber-300 dark:border-amber-500/40' 
                        : 'bg-slate-50 dark:bg-[#070c14] border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">{station.stationId}</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                          isOverDanger 
                            ? 'bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 border border-rose-300/60 dark:border-rose-500/40' 
                            : isOverWarning 
                            ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-500/40' 
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-500/40'
                        }`}>
                          {station.floodRiskStatus}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{station.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 block">{station.chainageImpactKm}</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[10px]">Water Level:</span>
                        <span className={`font-bold ${isOverDanger ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {station.currentWaterLevelM} m
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 dark:text-slate-500">Danger Mark:</span>
                        <span className="text-slate-700 dark:text-slate-300">{station.dangerLevelM} m</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 dark:text-slate-500">24h Rainfall:</span>
                        <span className="font-bold text-blue-700 dark:text-sky-400">{station.rainfall24hMm} mm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Preemptive Mitigation Plans */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-600">psychology</span>
              <span>AI Proactive Schedule Shift & Equipment Evacuation Advisory</span>
            </span>

            <div className="space-y-3">
              {mitigations.map((plan) => {
                const isExecuted = executedPlans.includes(plan.recommendationId);
                return (
                  <div 
                    key={plan.recommendationId}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          {plan.severity}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{plan.affectedChainage}</span>
                        <span className="text-xs font-mono text-slate-500">
                          (Activities: {plan.affectedActivities.join(', ')})
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-sans leading-relaxed">
                        {plan.actionPlan}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-600">
                        <span>Equipment Protected: <strong className="text-emerald-700">₹{(plan.potentialEquipmentSavedINR / 100000).toFixed(1)} Lakhs</strong></span>
                        <span>•</span>
                        <span>Schedule Recovery: <strong className="text-blue-700">{plan.scheduleRecoveryDays} Days</strong></span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isExecuted ? (
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Mitigation Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleExecuteMitigation(plan.recommendationId)}
                          className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          Execute Evacuation Shift
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-blue-600">cloud_sync</span>
            <span>Central Water Commission (CWC) Assam Regional Hydrology Feed // Last Ping: 2m ago</span>
          </div>

          <button
            onClick={() => setIsFloodPredictorOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer transition-all"
          >
            Close Predictor
          </button>
        </div>

      </div>
    </div>
  );
};
