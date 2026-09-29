import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  Layers, 
  MapPin, 
  Check, 
  X,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';

export const ReviewCenter: React.FC = () => {
  const { 
    currentRole,
    roleMetadata,
    setCurrentRole,
    matches, 
    fieldEvents, 
    activities, 
    approveMatch, 
    rejectMatch, 
    addTerminologyMapping,
    terminologyMappings,
    setActiveTab
  } = useApp();

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [plannerNote, setPlannerNote] = useState('');
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [newTermField, setNewTermField] = useState('');
  const [newTermActivityCode, setNewTermActivityCode] = useState('');
  const [mobileTab, setMobileTab] = useState<'QUEUE' | 'INSPECTION'>('QUEUE');

  const pendingMatches = matches.filter(m => m.status === 'PENDING_REVIEW');
  const activeMatch = matches.find(m => m.matchId === (selectedMatchId || pendingMatches[0]?.matchId)) || matches[0];
  const relatedEvent = activeMatch ? fieldEvents.find(e => e.eventId === activeMatch.eventId) : null;

  return (
    <div className="p-3.5 sm:p-6 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner & Learning Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            AI Review Center (Human-in-the-Loop)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explainable AI decision gate: Planners verify semantic linkages, inspect evidence checklists, and teach the system project-specific vocabulary.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
          <div className="bg-slate-950 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-800 flex items-center gap-2 flex-1 sm:flex-initial">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Memory Rules</div>
              <div className="text-xs font-bold text-slate-200">
                <span className="text-amber-400">{terminologyMappings.length}</span> Active
              </div>
            </div>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-800 flex items-center gap-2 flex-1 sm:flex-initial">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Pending Review</div>
              <div className="text-xs font-bold text-emerald-400">
                {pendingMatches.length} Proposals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Authority Context Banner */}
      {currentRole === 'supervisor' ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-xl">👷</span>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Site Supervisor Persona (Field Submissions View)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">READ-ONLY AUDIT</span>
              </div>
              <p className="text-amber-300/80 text-[11px] mt-0.5">
                Viewing field proposal status. Oil India Vigilance requires Project Planner or PM sign-off to update schedule actuals.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentRole('planner')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow shrink-0 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Switch to Planner Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className={`p-2.5 px-3.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${roleMetadata.bgColor} ${roleMetadata.borderColor}`}>
          <div className="flex items-center gap-2">
            <span className="text-base">{roleMetadata.emoji}</span>
            <span className="font-semibold text-white">{roleMetadata.label}:</span>
            <span className={roleMetadata.color}>{roleMetadata.authority}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${roleMetadata.borderColor} ${roleMetadata.color} bg-slate-950/80 hidden sm:inline-block`}>
            FULL APPROVAL AUTHORITY
          </span>
        </div>
      )}

      {/* Mobile Tab Switcher (Visible only on < lg screens) */}
      <div className="lg:hidden grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setMobileTab('QUEUE')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'QUEUE'
              ? 'bg-slate-800 text-white shadow font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Queue ({matches.length})</span>
          {pendingMatches.length > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingMatches.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileTab('INSPECTION')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'INSPECTION'
              ? 'bg-amber-500 text-slate-950 shadow font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Candidate Match</span>
        </button>
      </div>

      {/* Main Grid: Queue on Left, Inspection Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Col: Review Queue List */}
        <div className={`lg:col-span-4 space-y-3 ${mobileTab === 'INSPECTION' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 px-1">
            <span>Review Queue ({matches.length})</span>
            <span>Sorted by Priority</span>
          </div>

          <div className="space-y-2">
            {matches.map((m) => {
              const evt = fieldEvents.find(e => e.eventId === m.eventId);
              const topCand = m.candidates[0];
              const isSelected = activeMatch?.matchId === m.matchId;

              return (
                <button
                  key={m.matchId}
                  onClick={() => {
                    setSelectedMatchId(m.matchId);
                    setMobileTab('INSPECTION');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                    isSelected 
                      ? 'bg-slate-800/90 border-amber-400/80 shadow-md ring-1 ring-amber-400/30' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      m.status === 'APPROVED' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : m.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {m.status.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px] font-semibold">
                      {topCand?.finalConfidence ?? m.confidence}% Confidence
                    </span>
                  </div>

                  <div className="font-semibold text-slate-200 line-clamp-1">
                    {evt?.rawText || 'Field event report'}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="font-mono text-amber-400/90 truncate mr-2">{topCand?.activityCode || 'No candidate'}</span>
                    <span className="shrink-0">{evt?.sourceType} • {evt?.reportedDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Inspection & Human Adjudication Panel */}
        <div className={`lg:col-span-8 ${mobileTab === 'QUEUE' ? 'hidden lg:block' : 'block'}`}>
          {activeMatch && relatedEvent ? (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-sm">
              {/* Event Extraction Header */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono font-bold">
                      {relatedEvent.sourceType} INPUT
                    </span>
                    <span className="text-slate-400 font-mono">Reported by: <strong className="text-slate-200">{relatedEvent.reportedBy}</strong></span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">{relatedEvent.reportedDate}</span>
                </div>

                <div className="text-sm font-medium text-slate-100 italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  "{relatedEvent.rawText}"
                </div>

                {/* Structured Extraction Metadata Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">DISCIPLINE</span>
                    <span className="text-white font-semibold">{relatedEvent.discipline}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">ACTION</span>
                    <span className="text-white font-semibold">{relatedEvent.action}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">QUANTITY / UNIT</span>
                    <span className="text-white font-semibold">{relatedEvent.quantity || '--'} {relatedEvent.unit || ''}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">PROGRESS CLAIMED</span>
                    <span className="text-emerald-400 font-semibold">{relatedEvent.percentComplete ?? 100}%</span>
                  </div>
                </div>
              </div>

              {/* Proposed Candidate Matches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    AI Proposed L5/L6 Candidates ({activeMatch.candidates.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Multi-Stage Calibrated Reranking</span>
                </div>

                <div className="space-y-3">
                  {activeMatch.candidates.map((cand, idx) => {
                    const isTop = idx === 0;
                    return (
                      <div
                        key={cand.activityId}
                        className={`p-4 rounded-xl border transition-all text-xs space-y-3 ${
                          isTop 
                            ? 'bg-slate-950 border-amber-500/50 ring-1 ring-amber-500/20' 
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px] text-amber-400">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-white text-xs">{cand.activityCode}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  cand.confidenceTier === 'HIGH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}>
                                  {cand.confidenceTier} ({cand.finalConfidence}%)
                                </span>
                              </div>
                              <div className="text-slate-300 font-medium mt-0.5">{cand.activityName}</div>
                            </div>
                          </div>

                          {/* Quick Score Bars */}
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
                            <span>Lexical: {Math.round(cand.lexicalScore * 100)}%</span>
                            <span>Fuzzy: {Math.round(cand.fuzzyScore * 100)}%</span>
                            <span>Context: {Math.round(cand.contextScore * 100)}%</span>
                          </div>
                        </div>

                        {/* Explainable Checklist (MANDATORY REQUIREMENT) */}
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                          <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold mb-1">
                            Why the AI matched this activity:
                          </div>
                          {cand.explanationPoints.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2 text-[11px]">
                              {pt.passed ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              )}
                              <span className={pt.passed ? 'text-slate-300' : 'text-slate-400'}>{pt.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons for this candidate */}
                        {activeMatch.status === 'PENDING_REVIEW' && (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => {
                                setNewTermField(relatedEvent.rawText.split('.')[0]);
                                setNewTermActivityCode(cand.activityCode);
                                setTermModalOpen(true);
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center justify-center sm:justify-start gap-1 font-medium py-1"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Teach Vocabulary ("{cand.activityCode}")</span>
                            </button>

                            {currentRole === 'supervisor' ? (
                              <button
                                onClick={() => setCurrentRole('planner')}
                                className="w-full sm:w-auto px-4 py-2.5 sm:py-1.5 rounded-lg bg-slate-800 border border-amber-500/50 text-amber-300 hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
                                title="Site Supervisors have view-only access. Click to switch to Project Planner to authorize & commit to Primavera baseline."
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Switch to Planner to Approve</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => approveMatch(activeMatch.matchId, cand.activityId, plannerNote)}
                                className="w-full sm:w-auto px-4 py-2.5 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve & Update Schedule Actuals ({roleMetadata.shortLabel})</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status or Rejection Controls */}
              {activeMatch.status === 'PENDING_REVIEW' ? (
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-800">
                  <input
                    type="text"
                    value={plannerNote}
                    onChange={(e) => setPlannerNote(e.target.value)}
                    placeholder="Optional planner verification notes for audit log..."
                    className="bg-slate-950 text-slate-200 text-xs px-3 py-2.5 rounded-lg border border-slate-700 w-full sm:w-2/3 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => rejectMatch(activeMatch.matchId, plannerNote || 'Rejected by planner')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Proposal</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">Status: {activeMatch.status}</span>
                    <span className="text-slate-400">• Reviewed by: {activeMatch.reviewedBy || 'Lead Planner'}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{activeMatch.reviewedAt}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              No proposal selected.
            </div>
          )}
        </div>
      </div>

      {/* Teach Terminology Modal */}
      {termModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-5 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Add to Project Terminology Memory
              </h3>
              <button onClick={() => setTermModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              The AI will store this colloquial site phrasing into project memory so future field dispatches automatically map to this schedule node with high confidence.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">Field / Subcontractor Phrase</label>
                <input
                  type="text"
                  value={newTermField}
                  onChange={(e) => setNewTermField(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-sans text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-mono uppercase text-[10px]">Target Schedule Activity Code</label>
                <input
                  type="text"
                  value={newTermActivityCode}
                  onChange={(e) => setNewTermActivityCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTermModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTermField && newTermActivityCode) {
                    addTerminologyMapping(newTermField, newTermActivityCode);
                    setTermModalOpen(false);
                  }
                }}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Terminology Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
