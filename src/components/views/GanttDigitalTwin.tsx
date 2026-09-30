import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  BarChart3, 
  GitCommit, 
  ArrowRight, 
  Clock, 
  Layers, 
  ShieldAlert, 
  Filter, 
  Calendar,
  AlertOctagon,
  ChevronRight
} from 'lucide-react';
import { DisciplineType, ScheduleActivity } from '../../types';

export const GanttDigitalTwin: React.FC = () => {
  const { activities, dependencies, activeProject, setActiveTab } = useApp();

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [onlyCriticalPath, setOnlyCriticalPath] = useState<boolean>(false);
  const [selectedAct, setSelectedAct] = useState<ScheduleActivity | null>(activities[0]);

  const filteredActivities = activities.filter(a => {
    if (selectedDiscipline !== 'ALL' && a.discipline !== selectedDiscipline) return false;
    if (onlyCriticalPath && !a.isCriticalPath) return false;
    return true;
  });

  // Calculate downstream impact for selected activity
  const downstreamImpacts: ScheduleActivity[] = [];
  if (selectedAct) {
    const directSuccessors = dependencies
      .filter(d => d.predecessorId === selectedAct.id)
      .map(d => activities.find(a => a.id === d.successorId))
      .filter(Boolean) as ScheduleActivity[];

    downstreamImpacts.push(...directSuccessors);

    // 2nd degree successors
    for (const ds of directSuccessors) {
      const secondDegree = dependencies
        .filter(d => d.predecessorId === ds.id)
        .map(d => activities.find(a => a.id === d.successorId))
        .filter(Boolean) as ScheduleActivity[];
      downstreamImpacts.push(...secondDegree);
    }
  }

  // Reference date bounds for timeline (Sept 15 - Oct 25 2026)
  const timelineStart = new Date('2026-09-12').getTime();
  const timelineEnd = new Date('2026-10-22').getTime();
  const totalDays = Math.round((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24));

  const getPositionStyle = (startDateStr: string, finishDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const finish = new Date(finishDateStr).getTime();

    const leftPct = Math.max(0, Math.min(100, ((start - timelineStart) / (timelineEnd - timelineStart)) * 100));
    const widthPct = Math.max(2, Math.min(100 - leftPct, ((finish - start) / (timelineEnd - timelineStart)) * 100));

    return { left: `${leftPct}%`, width: `${widthPct}%` };
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-[1700px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0" />
            4D Progress Digital Twin & Interactive Gantt
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time overlay of baseline schedule (blue), actual progress (green), and CPM forecast (orange) with critical-path impact propagation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono bg-slate-950 px-3 py-2 sm:px-3.5 sm:py-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-sky-500" />
            <span className="text-slate-300">Baseline Plan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-emerald-500" />
            <span className="text-slate-300">Actual Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-amber-500" />
            <span className="text-slate-300">Forecast Slip</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-rose-400">Critical Path</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono uppercase">Filter:</span>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Disciplines</option>
              <option value="Piping">Piping</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Rotating Equipment">Rotating Equipment</option>
              <option value="Instrumentation">Instrumentation</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyCriticalPath}
              onChange={(e) => setOnlyCriticalPath(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0"
            />
            <span>Critical Path Only ({activities.filter(a => a.isCriticalPath).length})</span>
          </label>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <strong>{filteredActivities.length}</strong> of {activities.length} nodes
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex items-center justify-between bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
        <span>Timeline Canvas</span>
        <span className="text-amber-400 font-semibold flex items-center gap-1">
          <span>Scroll horizontally</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>

      {/* Gantt Timeline Canvas */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            {/* Timeline Header Dates */}
            <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-950/80 py-2.5 px-4 text-[10px] font-mono text-slate-400">
              <div className="col-span-4 font-semibold text-slate-300">Activity & Scope Code</div>
              <div className="col-span-8 flex justify-between pr-4">
                <span>15-Sep</span>
                <span>22-Sep</span>
                <span>29-Sep</span>
                <span>06-Oct</span>
                <span>13-Oct</span>
                <span>20-Oct</span>
              </div>
            </div>

        {/* Timeline Rows */}
        <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
          {filteredActivities.map((act) => {
            const isSelected = selectedAct?.id === act.id;
            const baselinePos = getPositionStyle(act.plannedStart, act.plannedFinish);
            const actualPos = getPositionStyle(act.actualStart || act.plannedStart, act.actualFinish || act.forecastFinish);
            const isDelayed = act.forecastVarianceDays > 0;

            return (
              <div
                key={act.id}
                onClick={() => setSelectedAct(act)}
                className={`grid grid-cols-12 py-3 px-4 items-center cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-850/50'
                }`}
              >
                {/* Left: Code, Name, Discipline */}
                <div className="col-span-4 pr-3 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{act.activityCode}</span>
                    {act.isCriticalPath && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Critical Path Activity" />
                    )}
                    <span className="text-[10px] text-slate-400 truncate">{act.discipline}</span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium truncate mt-0.5">{act.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Act: <span className="text-emerald-400 font-bold">{act.actualPercent}%</span> • Var: 
                    <span className={isDelayed ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {act.forecastVarianceDays > 0 ? ` +${act.forecastVarianceDays}d` : ' 0d'}
                    </span>
                  </div>
                </div>

                {/* Right: Gantt Bars Container */}
                <div className="col-span-8 relative h-10 flex flex-col justify-center">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                    <div className="w-px h-full bg-slate-600" />
                    <div className="w-px h-full bg-slate-600" />
                    <div className="w-px h-full bg-slate-600" />
                    <div className="w-px h-full bg-slate-600" />
                    <div className="w-px h-full bg-slate-600" />
                    <div className="w-px h-full bg-slate-600" />
                  </div>

                  {/* Baseline Bar (Blue) */}
                  <div
                    className="absolute h-2.5 rounded bg-sky-500/70 border border-sky-400/50 top-1"
                    style={baselinePos}
                    title={`Baseline: ${act.plannedStart} to ${act.plannedFinish}`}
                  />

                  {/* Actual / Forecast Bar (Green with Orange Extension) */}
                  <div
                    className={`absolute h-3 rounded bottom-1 transition-all ${
                      isDelayed 
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-500 to-amber-500 border border-amber-400/60 shadow-sm' 
                        : 'bg-emerald-500 border border-emerald-400/60'
                    }`}
                    style={actualPos}
                    title={`Actual: ${act.actualPercent}% • Forecast: ${act.forecastFinish}`}
                  >
                    {/* Inner Progress Fill */}
                    <div
                      className="h-full bg-emerald-600/90 rounded-l"
                      style={{ width: `${act.actualPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </div>
        </div>
      </div>

      {/* Downstream Change Impact Domino Graph (Standout Feature) */}
      {selectedAct && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-rose-400" />
                Downstream Change Impact Graph: {selectedAct.activityCode}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                When this activity experiences delay, the dependency network propagates schedule shifts through all connected downstream nodes.
              </p>
            </div>
            {selectedAct.forecastVarianceDays > 0 && (
              <span className="text-xs px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                +{selectedAct.forecastVarianceDays} Days Slippage Cascading
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 overflow-x-auto py-2">
            {/* Source Activity */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/50 min-w-[220px] text-xs space-y-1 shrink-0">
              <span className="font-mono text-amber-400 text-[10px] font-bold block">TRIGGER NODE</span>
              <div className="font-bold text-white">{selectedAct.activityCode}</div>
              <div className="text-slate-300 text-[11px] truncate">{selectedAct.name}</div>
              <div className="text-rose-400 font-mono text-[11px] font-bold">Variance: +{selectedAct.forecastVarianceDays}d</div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />

            {/* Direct & Indirect Downstream Successors */}
            {downstreamImpacts.length > 0 ? (
              downstreamImpacts.map((succ, idx) => (
                <React.Fragment key={succ.id}>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 min-w-[220px] text-xs space-y-1 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sky-400 text-[10px] font-bold">IMPACT #{idx + 1}</span>
                      {succ.isMilestone && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                          Milestone
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white">{succ.activityCode}</div>
                    <div className="text-slate-300 text-[11px] truncate">{succ.name}</div>
                    <div className="text-amber-400 font-mono text-[11px]">Shifted to: {succ.forecastFinish}</div>
                  </div>
                  {idx < downstreamImpacts.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic p-3">
                No active successor dependencies registered for this activity.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
