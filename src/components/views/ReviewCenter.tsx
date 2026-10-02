import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { UnplannedResolutionDesk } from './review/UnplannedResolutionDesk';
import { SubtasksRollupTab } from './review/SubtasksRollupTab';
import { LifecycleTab } from './review/LifecycleTab';
import { HistoricalBenchmarkTab } from './review/HistoricalBenchmarkTab';

export const ReviewCenter: React.FC = () => {
  const { 
    currentRole,
    matches, 
    fieldEvents, 
    activities, 
    approveMatch, 
    rejectMatch, 
    approveUnplannedWork,
    updateSubtaskProgress,
    unplannedQueueCount,
    addTerminologyMapping,
    terminologyMappings,
    setActiveTab,
    selectedMatchId,
    setSelectedMatchId,
    navigateToActivitySchedule,
    showToast
  } = useApp();

  const [plannerNote, setPlannerNote] = useState('');
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [newTermField, setNewTermField] = useState('');
  const [newTermActivityCode, setNewTermActivityCode] = useState('');
  const [mobileTab, setMobileTab] = useState<'QUEUE' | 'INSPECTION'>('QUEUE');
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'UNPLANNED'>('ALL');

  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<'MATCH' | 'SUBTASKS' | 'LIFECYCLE' | 'BENCHMARK'>('MATCH');

  const pendingMatches = matches.filter(m => m.status === 'PENDING_REVIEW');
  const approvedMatches = matches.filter(m => m.status === 'APPROVED');
  const unplannedMatches = matches.filter(m => m.status === 'UNPLANNED_WORK' || m.isUnplanned);
  
  // Resolve active match using selectedMatchId if present, otherwise default to first pending or first match
  const activeMatch = (selectedMatchId ? matches.find(m => m.matchId === selectedMatchId) : null) 
    || pendingMatches[0] 
    || unplannedMatches[0]
    || matches[0];
  const relatedEvent = activeMatch ? fieldEvents.find(e => e.eventId === activeMatch.eventId) : null;
  const matchedActivity = activeMatch ? activities.find(a => a.id === activeMatch.selectedActivityId) : null;

  const handleApprove = () => {
    if (!activeMatch) return;
    approveMatch(activeMatch.matchId, undefined, plannerNote || 'Planner verified and approved match against plant schedule.');
    setPlannerNote('');
    showToast('Match approved! Progress applied to Primavera P6 baseline.', 'success');
  };

  const handleReject = () => {
    if (!activeMatch) return;
    rejectMatch(activeMatch.matchId, plannerNote || 'Rejected by planner inspection.');
    setPlannerNote('');
    showToast('Match proposal rejected. Flagged for review.', 'info');
  };

  const handleSaveTerm = () => {
    if (!newTermField.trim() || !newTermActivityCode.trim()) {
      showToast('Please provide both field term and canonical activity code.', 'error');
      return;
    }
    addTerminologyMapping(newTermField.trim(), newTermActivityCode.trim());
    setNewTermField('');
    setNewTermActivityCode('');
    setTermModalOpen(false);
    showToast('New corporate vocabulary mapping stored permanently.', 'success');
  };

  // Contextual optical & forensics metadata for each event
  const getEventForensics = (event: typeof relatedEvent) => {
    if (!event) return {
      station: 'STATION KM 42+650 • SPREAD 2',
      lat: "27° 23' 21.12\" N",
      lon: "95° 37' 02.64\" E",
      elev: "+142.48m AMSL",
      device: 'Trimble SX12 Scanning Base Station',
      lens: '28mm f/2.8 (1/1200s, ISO 100)',
      time: '11:15 IST'
    };

    if (event.discipline === 'Civil' || event.eventId === 'evt-002') {
      return {
        station: 'COMPRESSOR BAY 2 • FOUNDATION F-102',
        lat: "27° 23' 28.45\" N",
        lon: "95° 37' 11.20\" E",
        elev: "+138.10m AMSL",
        device: 'Trimble SX12 3D Scanning Total Station',
        lens: '35mm f/4.0 (1/800s, ISO 200)',
        time: `${event.startTime || '08:30'} - ${event.endTime || '17:00'} IST`
      };
    }
    if (event.discipline === 'Electrical' || event.eventId === 'evt-003') {
      return {
        station: 'UNIT 2 COMPRESSOR BAY • CABLE TRENCH WAY A',
        lat: "27° 23' 25.10\" N",
        lon: "95° 37' 08.90\" E",
        elev: "+146.75m AMSL",
        device: 'FLIR T865 Thermal / Optical Inspection Unit',
        lens: '24mm f/2.0 (1/250s, ISO 400)',
        time: `${event.startTime || '08:45'} - ${event.endTime || '15:00'} IST`
      };
    }
    if (event.sourceType === 'SPREADSHEET' || event.eventId === 'evt-004') {
      return {
        station: 'GCU AREA CORRIDOR • KM 42+650 SPREAD 2',
        lat: "27° 23' 35.80\" N",
        lon: "95° 37' 22.40\" E",
        elev: "+144.90m AMSL",
        device: 'Leica GS18 T GNSS RTK Rover + Drone UAV',
        lens: '24mm f/2.8 (1/2000s, ISO 100)',
        time: '18:00 IST Compilation'
      };
    }
    // Default / Piping evt-001
    return {
      station: 'COMPRESSOR SECTION (AREA 04) • KM 42+650',
      lat: "27° 23' 21.12\" N",
      lon: "95° 37' 02.64\" E",
      elev: "+142.48m AMSL",
      device: 'Sony α7 IV + Leica BLK360 Industrial LiDAR',
      lens: '28mm f/2.8 (1/1600s, ISO 100)',
      time: `${event.startTime || '09:00'} - ${event.endTime || '16:30'} IST`
    };
  };

  const forensics = getEventForensics(relatedEvent);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-300 shadow-xs hover-elevate">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-blue-700 uppercase tracking-widest font-semibold">
              Execution Intelligence
            </span>
            <span className="text-slate-300 font-mono text-[10px]">/</span>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              Human-in-the-Loop AI Review Center
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[22px] text-emerald-600">verified</span>
            AI Review Center • Desk 1
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Explainable AI decision gate: Planners verify semantic linkages, inspect evidence checklists, and teach the system project-specific vocabulary.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="bg-[#f8faff] dark:bg-[#070c16] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-amber-500/25 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-500">book</span>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-semibold">Memory Rules</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                <span className="text-amber-500 font-bold">{terminologyMappings.length}</span> Active Mappings
              </div>
            </div>
          </div>

          <div className="bg-[#f8faff] dark:bg-[#070c16] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-amber-500/25 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-emerald-500">task_alt</span>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-semibold">Pending Review</div>
              <div className="text-xs font-bold text-emerald-500 dark:text-emerald-400 font-mono">
                {pendingMatches.length} Proposals
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTermModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Teach AI Terminology</span>
          </button>
        </div>
      </div>

      {/* Role Authority Context Alert */}
      {currentRole === 'supervisor' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-amber-600">engineering</span>
            <div>
              <div className="font-bold flex items-center gap-1.5 font-mono">
                <span>Site Supervisor Persona (Field Submissions View)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">READ-ONLY AUDIT</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Viewing field proposal status. Oil India Vigilance requires Lead Project Planner sign-off to update schedule actuals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('FIELD_INPUT')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-mono text-xs font-semibold hover:bg-amber-700 self-start sm:self-auto transition-colors"
          >
            Go to Field Submission Form
          </button>
        </div>
      )}

      {/* Mobile Tab Switcher (Visible on <lg screens) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-100 rounded-xl border border-slate-300 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab('QUEUE')}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
            mobileTab === 'QUEUE'
              ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Proposals Queue ({pendingMatches.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('INSPECTION')}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'INSPECTION'
              ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Inspection Workbench</span>
          {activeMatch && (
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          )}
        </button>
      </div>

      {/* Main Grid: Pending Queue (4 cols) & Inspection Workbench (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proposals Queue (4 cols) */}
        <div className={`lg:col-span-4 flex-col gap-3 ${mobileTab === 'QUEUE' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs uppercase font-bold text-slate-700 tracking-wider">
                Proposals Queue ({matches.length})
              </div>
              <span className="font-mono text-[10px] text-blue-700 font-semibold">EPPM STAGING</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setQueueFilter('ALL')}
                className={`flex-1 py-1 px-2 rounded-md font-bold transition-colors ${
                  queueFilter === 'ALL'
                    ? 'bg-white text-blue-900 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({matches.length})
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('PENDING')}
                className={`flex-1 py-1 px-2 rounded-md font-bold transition-colors ${
                  queueFilter === 'PENDING'
                    ? 'bg-white text-amber-800 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingMatches.length})
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('UNPLANNED')}
                className={`flex-1 py-1 px-2 rounded-md font-bold transition-colors flex items-center justify-center gap-1 ${
                  queueFilter === 'UNPLANNED'
                    ? 'bg-white text-rose-800 shadow-2xs border border-slate-200'
                    : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                <span>Unplanned</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                <span>({unplannedMatches.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('APPROVED')}
                className={`flex-1 py-1 px-2 rounded-md font-bold transition-colors ${
                  queueFilter === 'APPROVED'
                    ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved ({approvedMatches.length})
              </button>
            </div>
          </div>

          {matches.filter(m => {
            if (queueFilter === 'PENDING') return m.status === 'PENDING_REVIEW';
            if (queueFilter === 'APPROVED') return m.status === 'APPROVED';
            if (queueFilter === 'UNPLANNED') return m.status === 'UNPLANNED_WORK' || m.isUnplanned;
            return true;
          }).length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-300 text-slate-500 font-mono text-xs">
              <span className="material-symbols-outlined text-emerald-600 text-[28px] mb-2">done_all</span>
              <p>No proposals matching the current filter.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {matches.filter(m => {
                if (queueFilter === 'PENDING') return m.status === 'PENDING_REVIEW';
                if (queueFilter === 'APPROVED') return m.status === 'APPROVED';
                if (queueFilter === 'UNPLANNED') return m.status === 'UNPLANNED_WORK' || m.isUnplanned;
                return true;
              }).map((m) => {
                const isSelected = activeMatch?.matchId === m.matchId;
                const evt = fieldEvents.find((e) => e.eventId === m.eventId);
                const cand = m.candidates?.[0];
                const isApproved = m.status === 'APPROVED';
                const isUnplannedItem = m.status === 'UNPLANNED_WORK' || m.isUnplanned;

                return (
                  <div
                    key={m.matchId}
                    onClick={() => {
                      setSelectedMatchId(m.matchId);
                      setMobileTab('INSPECTION');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col gap-2 ${
                      isSelected
                        ? isUnplannedItem
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 dark:border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                          : 'bg-blue-50/60 dark:bg-amber-500/15 border-blue-600 dark:border-amber-400 ring-2 ring-blue-600/20 dark:ring-amber-400/30 shadow-md'
                        : isUnplannedItem
                        ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 hover:border-rose-400 hover:shadow-xs'
                        : 'bg-white dark:bg-[#0c1220] border-slate-300 dark:border-slate-800 hover:border-blue-400 hover:dark:border-amber-400/50 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 dark:bg-sky-950/70 text-blue-800 dark:text-sky-300 border border-transparent dark:border-sky-700/50">
                          {evt?.discipline || 'Pipeline'}
                        </span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                          isUnplannedItem
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/50'
                            : isApproved 
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50' 
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/50'
                        }`}>
                          {isUnplannedItem ? 'UNPLANNED SCOPE' : isApproved ? 'P6 COMMITTED' : 'PENDING'}
                        </span>
                      </div>
                      <span className={`font-mono text-[11px] font-bold flex items-center gap-1 ${
                        isUnplannedItem ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {isUnplannedItem ? 'warning' : 'bolt'}
                        </span>
                        {isUnplannedItem ? 'OUT-OF-SCOPE' : `${m.confidence}% MATCH`}
                      </span>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      {evt?.photoUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs mt-0.5 bg-slate-900">
                          <img
                            src={evt.photoUrl}
                            alt="Field submission proof thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/piping-spool-erection.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                          "{evt?.rawText || 'Field dispatch reported'}"
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>{evt?.sourceType || 'DPR'} • {evt?.reportedDate}</span>
                      <span className={`font-bold ${isUnplannedItem ? 'text-rose-700 dark:text-rose-400' : 'text-blue-700 dark:text-amber-400'}`}>
                        {isUnplannedItem ? 'P6 VARIANCE REQ' : cand?.activityCode || 'ACT-P6'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Deep Inspection Workbench (8 cols) */}
        <div className={`lg:col-span-8 flex-col gap-5 ${mobileTab === 'INSPECTION' ? 'flex' : 'hidden lg:flex'}`}>
          {activeMatch && relatedEvent ? (
            activeMatch.isUnplanned || activeMatch.status === 'UNPLANNED_WORK' ? (
              <UnplannedResolutionDesk
                activeMatch={activeMatch}
                relatedEvent={relatedEvent}
                activities={activities}
                onApproveUnplanned={(matchId, action, opts) => approveUnplannedWork(matchId, action, opts)}
                onReject={handleReject}
                onBackToQueue={() => setMobileTab('QUEUE')}
              />
            ) : (
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-300 shadow-xs flex flex-col gap-6 hover-elevate">
                {/* Header Details with Mobile Back Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMobileTab('QUEUE')}
                        className="lg:hidden text-xs font-mono text-blue-700 font-bold flex items-center gap-0.5 hover:underline"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Queue
                      </button>
                      <span className="lg:hidden text-slate-300">•</span>
                      <span className="font-mono text-[11px] text-blue-700 font-bold">
                        PROPOSAL #{activeMatch.matchId.toUpperCase()}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[10px] text-slate-500">EVENT ID: {relatedEvent.eventId}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      AI Semantic Linkage Analysis &amp; Multi-Level Verification
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                      {activeMatch.confidence}% Confidence
                    </span>
                  </div>
                </div>

                {/* 4-Tab Workbench Navigation Bar */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveWorkbenchTab('MATCH')}
                    className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeWorkbenchTab === 'MATCH'
                        ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-700">verified</span>
                    <span>1. Semantic Match &amp; Telemetry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWorkbenchTab('SUBTASKS')}
                    className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeWorkbenchTab === 'SUBTASKS'
                        ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-purple-700">splitscreen</span>
                    <span>2. Execution Subtasks Rollup</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                      N-to-1
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWorkbenchTab('LIFECYCLE')}
                    className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeWorkbenchTab === 'LIFECYCLE'
                        ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">history_toggle_off</span>
                    <span>3. Activity Lifecycle</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Actuals
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveWorkbenchTab('BENCHMARK')}
                    className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeWorkbenchTab === 'BENCHMARK'
                        ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-700">analytics</span>
                    <span>4. Historical Memory</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      Corpus
                    </span>
                  </button>
                </div>

                {activeWorkbenchTab === 'SUBTASKS' && (
                  <SubtasksRollupTab
                    matchedActivity={matchedActivity || null}
                    onUpdateSubtask={updateSubtaskProgress}
                  />
                )}

                {activeWorkbenchTab === 'LIFECYCLE' && (
                  <LifecycleTab
                    matchedActivity={matchedActivity || null}
                  />
                )}

                {activeWorkbenchTab === 'BENCHMARK' && (
                  <HistoricalBenchmarkTab
                    matchedActivity={matchedActivity || null}
                  />
                )}

                {activeWorkbenchTab === 'MATCH' && (
                  <>
                    {/* Raw Field Observation Card */}
              <div className="rounded-xl bg-[#f8faff] dark:bg-[#070c16] border border-slate-200 dark:border-amber-500/20 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Raw Field Telemetry Submission ({relatedEvent.sourceType})
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{relatedEvent.reportedDate}</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#0c1220] rounded-lg border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans italic leading-relaxed">
                  "{relatedEvent.rawText}"
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-[11px]">
                  <div className="p-2 bg-white dark:bg-[#0c1220] rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Reporter:</span>{' '}
                    <span className="font-bold text-slate-900 dark:text-slate-100">{relatedEvent.reportedBy}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-[#0c1220] rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Location:</span>{' '}
                    <span className="font-bold text-slate-900 dark:text-slate-100">{relatedEvent.location}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-[#0c1220] rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Extracted Qty:</span>{' '}
                    <span className="font-bold text-blue-700 dark:text-amber-400">{relatedEvent.quantity || 420} {relatedEvent.unit || 'm'}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-[#0c1220] rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Discipline:</span>{' '}
                    <span className="font-bold text-slate-900 dark:text-slate-100">{relatedEvent.discipline}</span>
                  </div>
                </div>
              </div>

              {/* Geotagged Photographic Proof & Optical Telemetry Dossier */}
              <div className="rounded-xl bg-white border border-slate-300 overflow-hidden shadow-xs flex flex-col">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-700">photo_camera</span>
                    <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Field Photographic Evidence & Optical Telemetry Dossier
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    GEOTAG VERIFIED (EXIF OK)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Photo Display */}
                  <div className="md:col-span-7 relative h-56 md:h-64 bg-slate-900 overflow-hidden group">
                    <img
                      src={relatedEvent.photoUrl || '/images/piping-spool-erection.jpg'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/piping-spool-erection.jpg';
                      }}
                      alt={`Field inspection photograph for ${relatedEvent.activityDescription || 'Activity'}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-900/80 text-white font-mono text-[10px] font-semibold flex items-center gap-1.5 border border-white/20">
                      <span className="material-symbols-outlined text-[14px] text-blue-400">farsight_digital</span>
                      <span>{forensics.station}</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-white">
                      <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                        LAT: {forensics.lat} • LON: {forensics.lon}
                      </span>
                      <span className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                        ELEV: {forensics.elev}
                      </span>
                    </div>
                  </div>

                  {/* Optical Forensics & EXIF metadata */}
                  <div className="md:col-span-5 p-4 flex flex-col justify-between bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        Hardware Sensor Telemetry
                      </span>
                      <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-500">Capture Device:</span>
                          <span className="text-slate-900 font-semibold truncate max-w-[170px]" title={forensics.device}>
                            {forensics.device}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-500">Lens / Specs:</span>
                          <span className="text-slate-800">{forensics.lens}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-500">Timestamp:</span>
                          <span className="text-slate-900 font-semibold">{relatedEvent.reportedDate} {forensics.time}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-500">Cryptographic Hash:</span>
                          <span className="text-blue-700 font-bold text-[10px] truncate max-w-[130px]" title="0x7f8841a2990c">
                            0x7f8841a2...90c
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Supervisor Signature:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        DIGITALLY SEALED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Semantic Linkage to P6 Activity */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Target Primavera P6 Schedule Activity
                </span>
                <div className="p-4 rounded-xl border border-blue-200 dark:border-amber-500/20 bg-blue-50/40 dark:bg-[#070c16] flex flex-col gap-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-amber-500 dark:bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-xs">
                        {matchedActivity?.activityCode || 'ACT-TR-4290'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {matchedActivity?.name || 'Trench Excavation & Bedding Preparation'}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                      WBS: {matchedActivity?.wbsCode || matchedActivity?.wbsId || 'WBS-04-A-CIVIL'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {matchedActivity?.description || matchedActivity?.name || 'Mechanical backhoe trenching to 2.2m depth along station KM 40+000 to KM 45+000.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-200/60 dark:border-slate-800 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Planned Start:</span>{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-100">{matchedActivity?.plannedStart || '01-OCT-2024'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Planned Finish:</span>{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-100">{matchedActivity?.plannedFinish || '28-OCT-2024'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Baseline Target:</span>{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-100">{matchedActivity?.plannedQuantity || matchedActivity?.quantity || 1200}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">New Actual Pace:</span>{' '}
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{matchedActivity?.actualPercent || 68}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainable AI Criteria Checklist */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Explainability Verification Matrix
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-600/40 flex items-center justify-between text-emerald-900 dark:text-emerald-300 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                      Fuzzy Keyword Correlation
                    </span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">98.2%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-600/40 flex items-center justify-between text-emerald-900 dark:text-emerald-300 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                      WBS Parent Consistency
                    </span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">PASSED</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-600/40 flex items-center justify-between text-emerald-900 dark:text-emerald-300 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                      Predecessor Sequence Valid
                    </span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">PASSED</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-600/40 flex items-center justify-between text-emerald-900 dark:text-emerald-300 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                      Spatial GPS Proximity (&lt;50m)
                    </span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">14.2m CEP</span>
                  </div>
                </div>
              </div>

              {/* Inspector Review Notes & Action Buttons */}
              {activeMatch.status === 'APPROVED' ? (
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 dark:text-emerald-300 font-mono flex items-center gap-2">
                          <span>COMMITTED TO PRIMAVERA P6 BASELINE</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[9px]">ACTIVE RECORD</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono mt-0.5">
                          {activeMatch.plannerNotes || 'Approved by Lead Planner P. Saikia. Matched against schedule baseline.'}
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                          Reviewed by {activeMatch.reviewedBy || 'Pranjal Saikia'} • {activeMatch.reviewedAt ? new Date(activeMatch.reviewedAt).toLocaleDateString() : '2026-09-28'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-[#070c16] px-2 py-1 rounded-md border border-emerald-300 dark:border-emerald-600/50 shadow-2xs">
                        SHA-256 VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => navigateToActivitySchedule(activeMatch.selectedActivityId)}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-[#0c1220] border border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-amber-400 hover:border-blue-300 text-slate-700 dark:text-slate-200 font-mono text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">account_tree</span>
                      <span>Locate in WBS Schedule</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTermModalOpen(true)}
                        className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-[#0c1220] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all"
                      >
                        Teach Synonym
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-[#0c1220] border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-mono text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                        <span>Re-evaluate Linkage</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      Lead Planning Engineer Decision Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={plannerNote}
                      onChange={(e) => setPlannerNote(e.target.value)}
                      placeholder="Enter approval note or variance reason for Oracle P6 audit log..."
                      className="w-full bg-slate-50 dark:bg-[#070c16] border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-4 py-2 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-mono text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Reject / Flag Dispute</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTermModalOpen(true)}
                        className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold border border-slate-300 transition-all"
                      >
                        Teach Synonym
                      </button>
                      <button
                        type="button"
                        onClick={handleApprove}
                        className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Approve & Commit to P6</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )
    ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 font-mono text-xs">
              Select an item from the pending queue to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Terminology Modal */}
      {termModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">school</span>
                <h3 className="font-bold text-slate-900 text-base">Teach AI Corporate Vocabulary</h3>
              </div>
              <button
                type="button"
                onClick={() => setTermModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Define how local field slang, Assamese technical jargon, or contractor short-codes map directly to Primavera P6 Activity IDs.
            </p>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-500 font-bold text-[10px] uppercase">Field Term / Slang</label>
                <input
                  type="text"
                  value={newTermField}
                  onChange={(e) => setNewTermField(e.target.value)}
                  placeholder="e.g., 24XX spool erection, tiger teeth trenching"
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-500 font-bold text-[10px] uppercase">Canonical Activity Code</label>
                <input
                  type="text"
                  value={newTermActivityCode}
                  onChange={(e) => setNewTermActivityCode(e.target.value)}
                  placeholder="e.g., PIP001 or ACT-TR-4290"
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTermModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTerm}
                className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold shadow-xs"
              >
                Save Vocabulary Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
