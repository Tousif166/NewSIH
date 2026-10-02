import React from 'react';
import { ScheduleActivity } from '../../../types';
import { queryHistoricalBenchmarks } from '../../../services/level1Engine';

interface HistoricalBenchmarkTabProps {
  matchedActivity: ScheduleActivity | null;
}

export const HistoricalBenchmarkTab: React.FC<HistoricalBenchmarkTabProps> = ({ matchedActivity }) => {
  const benchmarks = queryHistoricalBenchmarks(matchedActivity);

  return (
    <div className="flex flex-col gap-5">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-amber-700">analytics</span>
            Institutional Execution Memory &amp; Historical Benchmarking (Level 1 • Feature 6)
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold">
            CALIBRATED OIL ARCHIVE
          </span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed font-sans">
          Cross-references past completed pipeline projects across Upper Assam and Brahmaputra floodplains. 
          Calibrates duration forecasts and provides empirical lessons-learned for Activity <strong className="font-mono">{matchedActivity?.activityCode || 'P6 Target'}</strong>.
        </p>
      </div>

      {/* Benchmark Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Historical Mean Duration</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {benchmarks.avgHistoricalDurationDays} Days
          </div>
          <span className="text-[10px] text-slate-500">Planned Target: 14 Days</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Empirical Duration Variance</span>
          <div className="text-lg font-bold text-amber-700 mt-1">
            +{benchmarks.avgVariancePercent}%
          </div>
          <span className="text-[10px] text-amber-700">Historically stretched by monsoon &amp; soil</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Historical Projects Matched</span>
          <div className="text-lg font-bold text-blue-700 mt-1">
            {benchmarks.matchedRecords.length} Completed Projects
          </div>
          <span className="text-[10px] text-slate-500">Oil India Limited Archive</span>
        </div>
      </div>

      {/* Institutional Memory Recommendation Card */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
        <span className="material-symbols-outlined text-[20px] text-blue-700 shrink-0 mt-0.5">psychology</span>
        <div>
          <div className="text-xs font-bold text-blue-950 font-mono">
            AI Schedule Calibration Advisory for Lead Planner:
          </div>
          <p className="text-xs text-blue-900 mt-0.5 leading-relaxed font-sans">
            Based on {benchmarks.matchedRecords.length} historical completions in similar alluvial soil, 
            actual duration runs {benchmarks.avgVariancePercent}% longer than baseline. 
            Recommend scheduling a <strong>2.5-day weather and spool fit-up buffer</strong> prior to critical milestone inspection.
          </p>
        </div>
      </div>

      {/* Matched Historical Projects Dossier */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
          Comparable Historical Records in Upper Assam:
        </span>

        <div className="flex flex-col gap-3">
          {benchmarks.matchedRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all flex flex-col gap-2.5 font-mono text-xs shadow-2xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-sm font-sans">{rec.projectName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold">
                    YEAR {rec.completionYear}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {rec.terrainType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400">Planned Duration:</span>{' '}
                  <span className="font-bold text-slate-800">{rec.plannedDurationDays}d</span>
                </div>
                <div>
                  <span className="text-slate-400">Actual Duration:</span>{' '}
                  <span className="font-bold text-amber-700">{rec.actualDurationDays}d</span>
                </div>
                <div>
                  <span className="text-slate-400">Duration Variance:</span>{' '}
                  <span className="font-bold text-rose-700">+{rec.varianceDays}d ({Math.round((rec.varianceDays / (rec.plannedDurationDays || 1)) * 100)}%)</span>
                </div>
                <div>
                  <span className="text-slate-400">Contractor:</span>{' '}
                  <span className="font-bold text-slate-800">{rec.contractor}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs font-sans text-slate-700 mt-1 leading-relaxed">
                <strong className="font-mono text-amber-800">Lessons Learned &amp; Root Cause:</strong>{' '}
                {rec.lessonsLearned}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
