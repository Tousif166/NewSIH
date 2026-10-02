import React, { useState } from 'react';
import { ActivityMatchRecord, NormalizedExecutionEvent, ScheduleActivity } from '../../../types';

interface UnplannedResolutionDeskProps {
  activeMatch: ActivityMatchRecord;
  relatedEvent: NormalizedExecutionEvent;
  activities: ScheduleActivity[];
  onApproveUnplanned: (
    matchId: string, 
    action: 'SCOPE_CHANGE' | 'REWORK' | 'SUPPORT' | 'MANUAL_LINK', 
    opts?: { activityName?: string; duration?: number; targetActivityId?: string; notes?: string }
  ) => void;
  onReject: () => void;
  onBackToQueue: () => void;
}

export const UnplannedResolutionDesk: React.FC<UnplannedResolutionDeskProps> = ({
  activeMatch,
  relatedEvent,
  activities,
  onApproveUnplanned,
  onReject,
  onBackToQueue,
}) => {
  const proposal = activeMatch.unplannedProposal;
  const [unplannedCategory, setUnplannedCategory] = useState<'SCOPE_VARIATION' | 'CONTRACTOR_REWORK' | 'NON_SCHEDULE_SUPPORT' | 'MANUAL_LINK'>(
    proposal?.category || 'SCOPE_VARIATION'
  );
  const [proposedTitle, setProposedTitle] = useState(
    proposal?.suggestedActivityName || 'Temporary Stormwater Drainage Trench (Unit 4)'
  );
  const [proposedDuration, setProposedDuration] = useState(proposal?.suggestedDurationDays || 4);
  const [proposedCost, setProposedCost] = useState('₹2,80,000');
  const [plannerNote, setPlannerNote] = useState('');
  const [selectedExistingActivityId, setSelectedExistingActivityId] = useState(activities[0]?.id || '');

  const isApproved = activeMatch.status === 'APPROVED';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-rose-300 shadow-xs flex flex-col gap-6 hover-elevate transition-all">
      {/* Header Details with Mobile Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToQueue}
              className="lg:hidden text-xs font-mono text-rose-700 font-bold flex items-center gap-0.5 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Queue
            </button>
            <span className="lg:hidden text-slate-300">•</span>
            <span className="font-mono text-[11px] text-rose-700 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              UNPLANNED WORK DETECTOR (LEVEL 1 • FEATURE 2)
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[10px] text-slate-500">EVENT ID: {relatedEvent.eventId}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            Out-of-Scope Field Execution Adjudication Desk
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            OUT-OF-SCOPE WORK DETECTED
          </span>
        </div>
      </div>

      {/* Unplanned Root Cause Alert */}
      <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            AI Classification: Field Observation Lacks Scheduled Activity in Primavera P6 Baseline
          </span>
          <span className="font-mono text-[10px] text-rose-700 font-bold bg-white px-2 py-0.5 rounded border border-rose-200">
            OIL VIGILANCE SAFEGUARD
          </span>
        </div>
        <p className="text-xs text-rose-950 font-sans leading-relaxed">
          {proposal?.detectedReason || activeMatch.plannerNotes || 
           'Raw dispatch specifies localized emergency or uncontracted work (e.g. temporary drainage, rework, erosion mitigation) not represented in the active Level 6 schedule.'}
        </p>
      </div>

      {/* Raw Field Observation Card */}
      <div className="rounded-xl bg-[#f8faff] border border-slate-200 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
            Raw Field Dispatch Telemetry ({relatedEvent.sourceType})
          </span>
          <span className="font-mono text-[10px] text-slate-500">{relatedEvent.reportedDate}</span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 font-sans italic leading-relaxed">
          "{relatedEvent.rawText}"
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-[11px]">
          <div className="p-2 bg-white rounded border border-slate-200">
            <span className="text-slate-400">Reporter:</span>{' '}
            <span className="font-bold text-slate-900">{relatedEvent.reportedBy}</span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <span className="text-slate-400">Location:</span>{' '}
            <span className="font-bold text-slate-900">{relatedEvent.location}</span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <span className="text-slate-400">Observed Qty:</span>{' '}
            <span className="font-bold text-rose-700">{relatedEvent.quantity || 120} {relatedEvent.unit || 'm'}</span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <span className="text-slate-400">Discipline:</span>{' '}
            <span className="font-bold text-slate-900">{relatedEvent.discipline}</span>
          </div>
        </div>
      </div>

      {/* Adjudication Mode Selector Cards */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase font-bold text-slate-700 tracking-wider">
          Select Planner Resolution Protocol:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setUnplannedCategory('SCOPE_VARIATION')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
              unplannedCategory === 'SCOPE_VARIATION'
                ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-blue-700">post_add</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">RECOMMENDED</span>
            </div>
            <div className="font-bold text-xs text-slate-900 font-mono">P6 Scope Change</div>
            <p className="text-[11px] text-slate-600 leading-tight">Create formal P6 Change Request activity with duration &amp; cost.</p>
          </button>

          <button
            type="button"
            onClick={() => setUnplannedCategory('CONTRACTOR_REWORK')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
              unplannedCategory === 'CONTRACTOR_REWORK'
                ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-amber-700">build_circle</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">NON-PAYABLE</span>
            </div>
            <div className="font-bold text-xs text-slate-900 font-mono">Contractor Rework</div>
            <p className="text-[11px] text-slate-600 leading-tight">Assign to contractor defect log. No baseline extension granted.</p>
          </button>

          <button
            type="button"
            onClick={() => setUnplannedCategory('NON_SCHEDULE_SUPPORT')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
              unplannedCategory === 'NON_SCHEDULE_SUPPORT'
                ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-purple-700">support</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">SITE LOG</span>
            </div>
            <div className="font-bold text-xs text-slate-900 font-mono">Routine Support</div>
            <p className="text-[11px] text-slate-600 leading-tight">Log as enabling work in daily shift record. Non-critical.</p>
          </button>

          <button
            type="button"
            onClick={() => setUnplannedCategory('MANUAL_LINK')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
              unplannedCategory === 'MANUAL_LINK'
                ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[20px] text-emerald-700">link</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">OVERRIDE</span>
            </div>
            <div className="font-bold text-xs text-slate-900 font-mono">Manual Link</div>
            <p className="text-[11px] text-slate-600 leading-tight">Override AI &amp; map to an existing scheduled P6 activity.</p>
          </button>
        </div>
      </div>

      {/* Mode Specific Form Parameters */}
      {unplannedCategory === 'SCOPE_VARIATION' && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 flex flex-col gap-3 font-mono text-xs">
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-700">edit_note</span>
              Primavera P6 Scope Change Generator Parameters
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Auto-Generates Activity ID: UNP-VAR-{(activeMatch.matchId || '001').slice(-3).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Proposed Activity Name</label>
              <input
                type="text"
                value={proposedTitle}
                onChange={(e) => setProposedTitle(e.target.value)}
                className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target WBS Node</label>
              <input
                type="text"
                readOnly
                value="OIL-PL-WBS-VAR-01 (Spread 2 Variations)"
                className="bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 text-xs font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Estimated Duration (Days)</label>
              <input
                type="number"
                value={proposedDuration}
                onChange={(e) => setProposedDuration(Number(e.target.value))}
                min="1"
                max="60"
                className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Estimated Budget Impact</label>
              <input
                type="text"
                value={proposedCost}
                onChange={(e) => setProposedCost(e.target.value)}
                className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>
          </div>
        </div>
      )}

      {unplannedCategory === 'MANUAL_LINK' && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 flex flex-col gap-3 font-mono text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">link</span>
            <span>Manual Schedule Activity Target</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Select Target P6 Activity</label>
            <select
              value={selectedExistingActivityId}
              onChange={(e) => setSelectedExistingActivityId(e.target.value)}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-700 cursor-pointer"
            >
              {activities.map(a => (
                <option key={a.id} value={a.id}>
                  {a.activityCode} • {a.name} ({a.discipline})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Decision Notes */}
      <div className="flex flex-col gap-1 font-mono text-xs">
        <label className="text-[10px] font-bold text-slate-500 uppercase">
          Lead Planning Engineer Resolution Notes (P6 &amp; Audit Log)
        </label>
        <input
          type="text"
          value={plannerNote}
          onChange={(e) => setPlannerNote(e.target.value)}
          placeholder="e.g., Unprecedented localized flooding required 120m emergency bypass channel to protect foundation..."
          className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-700"
        />
      </div>

      {/* Adjudication Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={onReject}
          disabled={isApproved}
          className="px-4 py-2 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-mono text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">cancel</span>
          <span>Reject Outright</span>
        </button>

        <button
          type="button"
          disabled={isApproved}
          onClick={() => {
            if (unplannedCategory === 'SCOPE_VARIATION') {
              onApproveUnplanned(activeMatch.matchId, 'SCOPE_CHANGE', {
                activityName: proposedTitle,
                duration: proposedDuration,
                notes: plannerNote || 'Approved as formal P6 variation order.'
              });
            } else if (unplannedCategory === 'CONTRACTOR_REWORK') {
              onApproveUnplanned(activeMatch.matchId, 'REWORK', {
                notes: plannerNote || 'Classified as contractor non-conformity rework.'
              });
            } else if (unplannedCategory === 'NON_SCHEDULE_SUPPORT') {
              onApproveUnplanned(activeMatch.matchId, 'SUPPORT', {
                notes: plannerNote || 'Classified as temporary non-schedule supporting work.'
              });
            } else {
              onApproveUnplanned(activeMatch.matchId, 'MANUAL_LINK', {
                targetActivityId: selectedExistingActivityId,
                notes: plannerNote || 'Manually linked to existing P6 schedule item.'
              });
            }
          }}
          className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[17px]">
            {unplannedCategory === 'SCOPE_VARIATION' ? 'add_task' : 'verified'}
          </span>
          <span>
            {isApproved 
              ? 'P6 Variation Committed' 
              : unplannedCategory === 'SCOPE_VARIATION' 
              ? 'Approve as P6 Scope Change (Generate Activity)' 
              : unplannedCategory === 'CONTRACTOR_REWORK'
              ? 'Record as Contractor Rework'
              : unplannedCategory === 'NON_SCHEDULE_SUPPORT'
              ? 'Log as Non-Schedule Support'
              : 'Link to Selected P6 Activity'}
          </span>
        </button>
      </div>
    </div>
  );
};
