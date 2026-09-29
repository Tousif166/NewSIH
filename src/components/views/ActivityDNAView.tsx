import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  Dna, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Layers, 
  Users, 
  AlertTriangle, 
  BarChart, 
  History,
  CheckCircle2
} from 'lucide-react';
import { DEMO_ACTIVITY_DNA } from '../../services/seedData';
import { ActivityDNA } from '../../types';

export const ActivityDNAView: React.FC = () => {
  const [selectedDNA, setSelectedDNA] = useState<ActivityDNA>(DEMO_ACTIVITY_DNA[0]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Dna className="w-5 h-5 text-teal-400" />
            Institutional Memory & Activity DNA Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical benchmarking across completed Oil India projects: Typical durations, empirical variance, recurring delay drivers, and contractor performance profiles.
          </p>
        </div>

        <div className="bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Knowledge Base: </span>
          <strong className="text-teal-400">54 Historical Projects Indexed</strong>
        </div>
      </div>

      {/* Main Grid: Activity Selector on Left, Deep DNA Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Activity Archetypes */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 px-1">
            Infrastructure Activity Profiles
          </div>

          <div className="space-y-2">
            {DEMO_ACTIVITY_DNA.map(dna => {
              const isSelected = selectedDNA.activityType === dna.activityType;
              return (
                <button
                  key={dna.activityType}
                  onClick={() => setSelectedDNA(dna)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs space-y-2 ${
                    isSelected 
                      ? 'bg-slate-800 border-teal-400/80 shadow-md ring-1 ring-teal-400/30' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      {dna.discipline}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      {dna.sampleProjectCount} projects sampled
                    </span>
                  </div>

                  <div className="font-bold text-slate-200">
                    {dna.activityType}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                    <span>Typical: <strong className="text-white">{dna.typicalDurationDays}d</strong></span>
                    <span>Median Variance: <strong className="text-amber-400">+{dna.historicalVarianceDays}d</strong></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep DNA Analytics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono font-bold">
                  {selectedDNA.discipline}
                </span>
                <span className="text-xs text-slate-400 font-mono">• Empirical Benchmark Dataset</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {selectedDNA.activityType}
              </h2>
            </div>

            {/* Empirical Duration Distributions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Planned Target Mean</span>
                <span className="text-2xl font-black text-sky-400">{selectedDNA.typicalDurationDays} Days</span>
                <span className="text-[10px] text-slate-500 block mt-1">Based on Oil & Gas standard norms</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Empirical Field Actual Median</span>
                <span className="text-2xl font-black text-white">{selectedDNA.historicalMedianDays} Days</span>
                <span className="text-[10px] text-slate-500 block mt-1">Real historical completions</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Regional Variance Delta</span>
                <span className="text-2xl font-black text-amber-400">+{selectedDNA.historicalVarianceDays} Days</span>
                <span className="text-[10px] text-slate-500 block mt-1">Typical delay expected in Assam</span>
              </div>
            </div>

            {/* Recurring Delay Causes Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Empirical Delay Causes & Frequency in Region
              </h3>
              <div className="space-y-2.5">
                {selectedDNA.primaryDelayCauses.map((c, i) => (
                  <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
                    <div className="flex justify-between text-slate-200 font-medium mb-1.5">
                      <span>{c.cause}</span>
                      <span className="font-mono text-amber-400 font-bold">{c.frequencyPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${c.frequencyPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contractor Performance Profiles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Historical Contractor Execution Reliability
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedDNA.topContractors.map((con, i) => (
                  <div key={i} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-slate-200">{con.name}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Rating: <strong className="text-amber-400">{con.performanceRating} / 5.0</strong></span>
                      <span>Avg Variance: <strong className={con.avgVarianceDays > 1.0 ? 'text-rose-400' : 'text-emerald-400'}>+{con.avgVarianceDays}d</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learned Colloquial Synonyms */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Learned Technical Synonyms (Language Layer)
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedDNA.synonyms.map((syn, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
                    "{syn}"
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
