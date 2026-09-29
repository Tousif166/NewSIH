import React from 'react';
import { useApp } from '../../services/store';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight, 
  Zap, 
  Layers, 
  ChevronRight,
  Flame,
  Activity
} from 'lucide-react';

export const ProjectDashboard: React.FC = () => {
  const { activeProject, activities, conflicts, riskScore, matches, setActiveTab } = useApp();

  const delayedActivities = activities.filter(a => a.forecastVarianceDays > 0);
  const criticalActivities = activities.filter(a => a.isCriticalPath);
  const completedCount = activities.filter(a => a.actualPercent === 100).length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Welcome & Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {activeProject.code}
            </span>
            <span className="text-xs text-slate-400">• {activeProject.organization}</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {activeProject.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
            <span>📍 {activeProject.location}</span>
            <span>📅 Baseline: {activeProject.startDate} to {activeProject.baselineCompletionDate}</span>
          </p>
        </div>

        {/* Big Health & Risk Summary Pills */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 flex items-center gap-3 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Health Index</div>
              <div className="text-xl font-extrabold text-amber-400 flex items-baseline gap-1">
                {activeProject.healthScore}<span className="text-xs text-slate-500">/100</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Execution Trust</div>
              <div className="text-xl font-extrabold text-emerald-400">
                {activeProject.executionConfidencePct}%
              </div>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 flex items-center gap-3 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Project Risk</div>
              <div className={`text-xl font-extrabold flex items-center gap-1.5 ${
                riskScore.tier === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                <Flame className="w-4 h-4" />
                <span>{riskScore.overallScore}/100</span>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
              riskScore.tier === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {riskScore.tier}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Dimension Project View (Baseline vs Actual vs Forecast vs Variance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Baseline */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase font-semibold text-sky-400">1. Baseline Plan</span>
            <span className="text-[10px] bg-sky-950/60 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/40">Target</span>
          </div>
          <div className="text-2xl font-black text-white">{activeProject.plannedProgressPct}%</div>
          <p className="text-xs text-slate-400 mt-1">Planned completion: <span className="text-slate-200 font-medium">{activeProject.baselineCompletionDate}</span></p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${activeProject.plannedProgressPct}%` }} />
          </div>
        </div>

        {/* Actual */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase font-semibold text-emerald-400">2. Field Actual</span>
            <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">Verified</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">{activeProject.actualProgressPct}%</div>
          <p className="text-xs text-slate-400 mt-1">Verified actuals across <span className="text-slate-200 font-medium">{completedCount}</span> completed nodes</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeProject.actualProgressPct}%` }} />
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase font-semibold text-amber-400">3. Current Forecast</span>
            <span className="text-[10px] bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">CPM Live</span>
          </div>
          <div className="text-2xl font-black text-amber-400">{activeProject.currentForecastCompletionDate}</div>
          <p className="text-xs text-slate-400 mt-1">Projected delay: <span className="text-rose-400 font-semibold">+18 calendar days</span></p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeProject.forecastProgressPct}%` }} />
          </div>
        </div>

        {/* Variance */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono uppercase font-semibold text-rose-400">4. Net Variance</span>
            <span className="text-[10px] bg-rose-950/60 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/40">Slippage</span>
          </div>
          <div className="text-2xl font-black text-rose-400">{activeProject.variancePct}%</div>
          <p className="text-xs text-slate-400 mt-1">Activities delayed: <span className="text-rose-300 font-semibold">{delayedActivities.length}</span> / {activities.length}</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.abs(activeProject.variancePct * 3)}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Attention Queue & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Attention Queue & Daily Digest */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Attention Queue */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Today's Attention Queue
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI prioritized issues requiring planner investigation before today's schedule freeze
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">2 Critical</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">3 Attention</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">7 Normal</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Card 1: Critical Piping Delay */}
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-rose-500/30 hover:border-rose-500/60 transition-colors flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-ping" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400">PIPE-ERECT-L6-0142</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">Critical Path</span>
                      <span className="text-[10px] text-slate-400 font-mono">+7 Days Delay</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">
                      Erection of 12-inch process line at compressor area
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Drivers: Rigging crane constraint & spool delivery hold. Cascades into hydrotest and compressor shaft alignment.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('WHAT_IF')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 flex items-center gap-1 shrink-0"
                >
                  <span>Simulate Fix</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2: Unresolved Data Conflict */}
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-amber-500/30 hover:border-amber-500/60 transition-colors flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">CONFLICT #CNF-001</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">Progress Contradiction</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">
                      Voice update reports 78% vs Subcontractor Excel claims 70%
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      8% variance between reporting channels. SiteSync prevented automatic schedule overwrite pending planner sign-off.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('CONFLICT_CENTER')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 flex items-center gap-1 shrink-0"
                >
                  <span>Adjudicate</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 3: Pending AI Proposal */}
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">ELEC-TRAY-L6-0102</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">92% AI Confidence</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">
                      Cable tray installation in Unit 2 (30 meters completed)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Extracted from supervisor text dispatch. Predecessor structural stanchions verified. Ready for 1-click confirmation.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('REVIEW_CENTER')}
                  className="px-2.5 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800/40 text-emerald-300 text-xs font-medium border border-emerald-600/40 flex items-center gap-1 shrink-0"
                >
                  <span>Review AI Match</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Daily Project Digest ("What Changed Since Yesterday?") */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                What Changed Since Yesterday (28-Sep)
              </h2>
              <span className="text-xs font-mono text-slate-400">Last Synced: 28-Sep 19:30</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center">
                <div className="text-lg font-bold text-white">+4</div>
                <div className="text-[11px] text-slate-400">Activities Updated</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center">
                <div className="text-lg font-bold text-emerald-400">1</div>
                <div className="text-[11px] text-slate-400">Completed (F-102)</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center">
                <div className="text-lg font-bold text-rose-400">+2d</div>
                <div className="text-[11px] text-slate-400">Slippage Added</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center">
                <div className="text-lg font-bold text-amber-400">1</div>
                <div className="text-[11px] text-slate-400">Conflict Flagged</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
              <span className="font-semibold text-white">Daily Operational Brief:</span> Senior piping supervisor voice input advanced 12" compressor header erection from 58% to 78%. Civil foundation F-102 was verified 100% completed following DPR upload (75 m3 concrete). Inclement rainfall caused an early work-at-height stoppage on electrical tray runs. Subcontractor Excel progress mismatch flagged for review.
            </p>
          </div>
        </div>

        {/* Right Col: Explainable Risk Score & Discipline Breakdown */}
        <div className="space-y-6">
          {/* Explainable Risk Score Breakdown */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Explainable Risk Engine
              </span>
              <span className="text-rose-400 font-extrabold text-sm">{riskScore.overallScore}/100</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Additive score based on schedule variance, critical path slippage, and source conflicts. Not a black box.
            </p>

            <div className="space-y-2.5">
              {riskScore.breakdown.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="font-mono font-bold text-amber-400">+{item.points} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Discipline Breakdown */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-sky-400" />
              Discipline Performance
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Civil & Structural</span>
                  <span className="font-mono text-emerald-400 font-bold">92% (On Track)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Process Piping</span>
                  <span className="font-mono text-rose-400 font-bold">58% (-14% delay)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Electrical Subsystems</span>
                  <span className="font-mono text-amber-400 font-bold">65% (-6% delay)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Rotating Equipment</span>
                  <span className="font-mono text-sky-400 font-bold">40% (Upcoming)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '40%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Instrumentation & Controls</span>
                  <span className="font-mono text-emerald-400 font-bold">85% (On Track)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
