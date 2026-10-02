import React from 'react';
import { ScheduleActivity } from '../../../types';
import { getDefaultSubtasksForActivity, calculateSubtaskRolledUpProgress } from '../../../services/level1Engine';

interface SubtasksRollupTabProps {
  matchedActivity: ScheduleActivity | null;
  onUpdateSubtask: (activityId: string, subtaskId: string, progress: number) => void;
}

export const SubtasksRollupTab: React.FC<SubtasksRollupTabProps> = ({
  matchedActivity,
  onUpdateSubtask,
}) => {
  if (!matchedActivity) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        No active P6 activity linked for subtask decomposition.
      </div>
    );
  }

  const currentSubtasks = matchedActivity.subtasks && matchedActivity.subtasks.length > 0
    ? matchedActivity.subtasks
    : getDefaultSubtasksForActivity(matchedActivity);

  const rolledUpPercent = calculateSubtaskRolledUpProgress(currentSubtasks);

  return (
    <div className="flex flex-col gap-5">
      {/* Banner / Explanation */}
      <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-xs font-bold text-purple-950 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-purple-700">splitscreen</span>
            Granularity Mismatch Resolver (Level 1 • Feature 4)
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-bold">
            N-to-1 MICRO-TASK ROLLUP
          </span>
        </div>
        <p className="text-xs text-purple-950 leading-relaxed font-sans">
          Field execution dispatches describe granular, shift-level operations (e.g. trench excavation, bedding, pipe stringing, joint fit-up). 
          SiteSync bridges the granularity gap by maintaining weighted execution subtasks under Primavera P6 Activity <strong className="font-mono">{matchedActivity.activityCode}</strong> and computing deterministic master progress.
        </p>
      </div>

      {/* Parent Rolled-Up Progress Bar Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
              Parent P6 Activity Physical Actual
            </span>
            <div className="text-lg font-bold text-slate-900 font-mono flex items-center gap-2">
              <span>{matchedActivity.activityCode}</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="text-purple-700">{rolledUpPercent}% Rolled Up</span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
            Formula: Σ(Subtask Weight × Progress) = {rolledUpPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 flex">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${rolledUpPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Subtasks Interactive Sliders Table */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>Decomposed Execution Subtasks ({currentSubtasks.length}):</span>
          <span className="text-[10px] text-slate-500 font-normal">Adjust slider or tap presets to calibrate progress</span>
        </span>

        <div className="flex flex-col gap-3">
          {currentSubtasks.map((st) => (
            <div
              key={st.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800">
                    {st.code}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{st.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-500">Weight: <strong>{st.weightPct ?? st.weightPercent ?? 20}%</strong></span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    (st.progressPct ?? st.progressPercent ?? 0) === 100
                      ? 'bg-emerald-100 text-emerald-800'
                      : (st.progressPct ?? st.progressPercent ?? 0) > 0
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {(st.progressPct ?? st.progressPercent ?? 0) === 100 ? 'COMPLETED' : (st.progressPct ?? st.progressPercent ?? 0) > 0 ? 'IN PROGRESS' : 'PENDING'}
                  </span>
                  <span className="font-bold text-purple-700 text-xs">{st.progressPct ?? st.progressPercent ?? 0}%</span>
                </div>
              </div>

              {/* Interactive Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={st.progressPct ?? st.progressPercent ?? 0}
                  onChange={(e) => onUpdateSubtask(matchedActivity.id, st.id, Number(e.target.value))}
                  className="flex-1 accent-purple-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => onUpdateSubtask(matchedActivity.id, st.id, 0)}
                    className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    0%
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSubtask(matchedActivity.id, st.id, 50)}
                    className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSubtask(matchedActivity.id, st.id, 100)}
                    className="px-2 py-0.5 rounded bg-purple-100 border border-purple-300 hover:bg-purple-200 text-purple-800 font-bold cursor-pointer"
                  >
                    100%
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                <span>Discipline: {st.discipline || matchedActivity.discipline || 'Piping'}</span>
                <span>{st.linkedFieldEventsCount || 1} Field DPRs Linked</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
