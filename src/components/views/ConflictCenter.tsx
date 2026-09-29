import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Mic, 
  FileSpreadsheet, 
  ShieldAlert, 
  Scale, 
  Check, 
  X,
  ChevronRight
} from 'lucide-react';
import { DataConflict } from '../../types';

export const ConflictCenter: React.FC = () => {
  const { currentRole, roleMetadata, setCurrentRole, conflicts, resolveConflict, activities } = useApp();

  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);
  const [resolutionChoice, setResolutionChoice] = useState<string>('SOURCE_1');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'LIST' | 'ADJUDICATE'>('LIST');

  const unresolved = conflicts.filter(c => c.status === 'UNRESOLVED');
  const activeConflict = conflicts.find(c => c.id === (selectedConflictId || unresolved[0]?.id)) || conflicts[0];

  const handleResolve = () => {
    if (!activeConflict) return;
    resolveConflict(
      activeConflict.id,
      resolutionChoice === 'SOURCE_1' ? activeConflict.sources[0]?.sourceRef : activeConflict.sources[1]?.sourceRef,
      resolutionNotes || 'Planner investigated and verified ground truth.'
    );
    setResolutionNotes('');
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            Data Conflict & Chronology Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconciliation layer: Detects contradictory progress percentages across disparate channels and blocks chronological sequence violations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Open Conflicts</div>
              <div className="text-xs font-bold text-rose-400">
                {unresolved.length} Adjudications Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjudication Authority Banner */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        currentRole === 'project_manager' || currentRole === 'planner'
          ? 'bg-sky-500/10 border-sky-500/30 text-sky-200'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⚖️</span>
          <div>
            <span className="font-bold text-white">Dispute Adjudication Authority: </span>
            {currentRole === 'project_manager' ? (
              <span className="text-sky-300 font-semibold">Project Manager (Executive Binding Resolution Authority)</span>
            ) : currentRole === 'planner' ? (
              <span className="text-emerald-300 font-semibold">Lead Project Planner (Schedule Ground Truth Authority)</span>
            ) : (
              <span>Site Supervisor Persona (Read-Only Status — Disputes must be ratified by PM or Planner)</span>
            )}
          </div>
        </div>
        {currentRole === 'supervisor' && (
          <button
            onClick={() => setCurrentRole('project_manager')}
            className="text-[11px] px-3 py-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-lg hover:bg-sky-500 hover:text-slate-950 font-bold transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Switch to Project Manager to Adjudicate
          </button>
        )}
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setMobileTab('LIST')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'LIST'
              ? 'bg-slate-800 text-white shadow font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Conflict Queue ({conflicts.length})</span>
          {unresolved.length > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {unresolved.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileTab('ADJUDICATE')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'ADJUDICATE'
              ? 'bg-rose-600 text-white shadow font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Adjudicate</span>
        </button>
      </div>

      {/* Main Grid: Conflict List on Left, Resolution Workbench on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Col: Conflict Cards */}
        <div className={`lg:col-span-5 space-y-3 ${mobileTab === 'ADJUDICATE' ? 'hidden lg:block' : 'block'}`}>
          <div className="text-xs font-mono uppercase text-slate-400 px-1">
            Detected Contradictions ({conflicts.length})
          </div>

          <div className="space-y-2.5">
            {conflicts.map(cnf => {
              const isSelected = activeConflict?.id === cnf.id;
              const isUnresolved = cnf.status === 'UNRESOLVED';

              return (
                <button
                  key={cnf.id}
                  onClick={() => {
                    setSelectedConflictId(cnf.id);
                    setMobileTab('ADJUDICATE');
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs space-y-2 ${
                    isSelected 
                      ? 'bg-slate-800/90 border-rose-500/80 shadow-md ring-1 ring-rose-500/30' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      cnf.severity === 'CRITICAL' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {cnf.conflictType.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${
                      isUnresolved ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {cnf.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-200 line-clamp-1">
                    {cnf.title}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {cnf.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                    <span className="text-amber-400">{cnf.activityCode}</span>
                    <span>{cnf.detectedAt.split('T')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Cross-Examination & Reconciliation Workbench */}
        <div className={`lg:col-span-7 ${mobileTab === 'LIST' ? 'hidden lg:block' : 'block'}`}>
          {activeConflict ? (
            <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4 sm:space-y-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
                    {activeConflict.severity} SEVERITY
                  </span>
                  <span className="text-slate-400 text-xs font-mono">• Node: <strong className="text-white">{activeConflict.activityCode}</strong></span>
                </div>
                <h2 className="text-base font-bold text-white">
                  {activeConflict.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {activeConflict.description}
                </p>
              </div>

              {/* Side-by-Side Contradictory Sources */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Cross-Channel Source Discrepancy Evidence
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeConflict.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                        idx === 0 
                          ? 'bg-slate-950 border-amber-500/40' 
                          : 'bg-slate-950 border-sky-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-850 text-slate-300 border border-slate-700">
                          SOURCE #{idx + 1} ({src.sourceType})
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{src.timestamp}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-slate-400 text-[10px] uppercase font-mono">Reported Claim:</div>
                        <div className="text-lg font-black text-white">{src.reportedValue}</div>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <div>Channel: <span className="text-slate-200 font-mono">{src.sourceRef}</span></div>
                        <div>Submitter: <span className="text-slate-200">{src.reporter}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Adjudication Controls */}
              {activeConflict.status === 'UNRESOLVED' ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <div className="text-xs font-mono font-bold text-white uppercase">
                    Planner Adjudication & Schedule Resolution
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 block font-mono">Select Verified Ground Truth:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setResolutionChoice('SOURCE_1')}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          resolutionChoice === 'SOURCE_1'
                            ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        ✓ Accept Source 1 ({activeConflict.sources[0]?.reportedValue})
                      </button>

                      <button
                        type="button"
                        onClick={() => setResolutionChoice('SOURCE_2')}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          resolutionChoice === 'SOURCE_2'
                            ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        ✓ Accept Source 2 ({activeConflict.sources[1]?.reportedValue || 'Alternative'})
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-mono">Resolution Justification (Recorded in Immutable Audit Trail):</label>
                    <input
                      type="text"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g. Physical site inspection verified 18m erected today (78% total complete)."
                      className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {currentRole === 'supervisor' ? (
                    <button
                      onClick={() => setCurrentRole('project_manager')}
                      className="w-full py-2.5 rounded-lg bg-slate-800 border border-amber-500/50 text-amber-300 hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-98 cursor-pointer"
                    >
                      <span>🔒 Requires PM Authority (Click to Switch to Project Manager & Adjudicate)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleResolve}
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-98 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Adjudication & Log Schedule Resolution ({roleMetadata.shortLabel})</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-600/40 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Conflict Adjudicated & Resolved</span>
                  </div>
                  <p className="text-slate-300">{activeConflict.resolutionNotes}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Resolved by: {activeConflict.resolvedBy || 'Lead Project Planner'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              Select a conflict from the left column.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
