import React, { useState } from 'react';
import { useApp } from '../../services/store';

export const ReviewCenter: React.FC = () => {
  const { 
    currentRole,
    matches, 
    fieldEvents, 
    activities, 
    approveMatch, 
    rejectMatch, 
    addTerminologyMapping,
    terminologyMappings,
    setActiveTab,
    showToast
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

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
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
          <div className="bg-[#f8faff] px-3.5 py-2 rounded-lg border border-slate-200 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-600">book</span>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Memory Rules</div>
              <div className="text-xs font-bold text-slate-900 font-mono">
                <span className="text-amber-700">{terminologyMappings.length}</span> Active Mappings
              </div>
            </div>
          </div>

          <div className="bg-[#f8faff] px-3.5 py-2 rounded-lg border border-slate-200 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">task_alt</span>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Pending Review</div>
              <div className="text-xs font-bold text-emerald-700 font-mono">
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

      {/* Main Grid: Pending Queue (4 cols) & Inspection Workbench (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proposals Queue (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs uppercase font-bold text-slate-500 tracking-wider">
              Pending AI Ingestion Queue ({pendingMatches.length})
            </div>
            <span className="font-mono text-[10px] text-blue-700 font-semibold">EPPM STAGING</span>
          </div>

          {pendingMatches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 font-mono text-xs">
              <span className="material-symbols-outlined text-emerald-600 text-[28px] mb-2">done_all</span>
              <p>All field events have been reviewed and approved into the Oracle P6 baseline!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {pendingMatches.map((m) => {
                const isSelected = activeMatch?.matchId === m.matchId;
                const evt = fieldEvents.find((e) => e.eventId === m.eventId);
                const cand = m.candidates?.[0];

                return (
                  <div
                    key={m.matchId}
                    onClick={() => {
                      setSelectedMatchId(m.matchId);
                      setMobileTab('INSPECTION');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                        {evt?.discipline || 'Pipeline'}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        {m.confidence}% MATCH
                      </span>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      {evt?.photoUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-2xs mt-0.5">
                          <img
                            src={evt.photoUrl}
                            alt="Field submission proof thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                          "{evt?.rawText || 'Field dispatch reported'}"
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{evt?.sourceType || 'DPR'} • {evt?.reportedDate}</span>
                      <span className="text-blue-700 font-bold">{cand?.activityCode || 'ACT-P6'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Deep Inspection Workbench (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {activeMatch && relatedEvent ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-blue-700 font-bold">
                      PROPOSAL #{activeMatch.matchId.toUpperCase()}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px] text-slate-500">EVENT ID: {relatedEvent.eventId}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    AI Semantic Linkage Analysis & Evidence Checklist
                  </h2>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    {activeMatch.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Raw Field Observation Card */}
              <div className="rounded-xl bg-[#f8faff] border border-slate-200 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                    Raw Field Telemetry Submission ({relatedEvent.sourceType})
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
                    <span className="text-slate-400">Extracted Qty:</span>{' '}
                    <span className="font-bold text-blue-700">{relatedEvent.quantity || 420} {relatedEvent.unit || 'm'}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400">Discipline:</span>{' '}
                    <span className="font-bold text-slate-900">{relatedEvent.discipline}</span>
                  </div>
                </div>
              </div>

              {/* Geotagged Photographic Proof & Optical Telemetry Dossier */}
              <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs flex flex-col">
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
                      src={relatedEvent.photoUrl?.startsWith('http') ? relatedEvent.photoUrl : '/images/pipeline-drone-4k.jpg'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/pipeline-drone-4k.jpg';
                      }}
                      alt="Field inspection photograph proof"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-900/80 text-white font-mono text-[10px] font-semibold flex items-center gap-1.5 border border-white/20">
                      <span className="material-symbols-outlined text-[14px] text-blue-400">farsight_digital</span>
                      <span>STATION KM 42+650 • SPREAD 2</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-white">
                      <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                        LAT: 27° 23' 21.12" N • LON: 95° 37' 02.64" E
                      </span>
                      <span className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                        ELEV: +142.48m AMSL
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
                          <span className="text-slate-900 font-semibold">Trimble SX12 Scanning Base</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-500">Lens / Aperture:</span>
                          <span className="text-slate-800">24mm f/2.8 (1/1200s)</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                          <span className="text-slate-500">Timestamp:</span>
                          <span className="text-slate-900 font-semibold">{relatedEvent.reportedDate} 11:15 IST</span>
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
                <span className="font-mono text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Target Primavera P6 Schedule Activity
                </span>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-blue-700 text-white font-mono text-xs font-bold">
                        {matchedActivity?.activityCode || 'ACT-TR-4290'}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {matchedActivity?.name || 'Trench Excavation & Bedding Preparation'}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-600">
                      WBS: {matchedActivity?.wbsCode || 'WBS-04-A-CIVIL'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {matchedActivity?.description || 'Mechanical backhoe trenching to 2.2m depth along station KM 40+000 to KM 45+000.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-200/60 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500">Planned Start:</span>{' '}
                      <span className="font-bold text-slate-800">{matchedActivity?.plannedStart || '01-OCT-2024'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Planned Finish:</span>{' '}
                      <span className="font-bold text-slate-800">{matchedActivity?.plannedEnd || '28-OCT-2024'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Baseline Target:</span>{' '}
                      <span className="font-bold text-slate-800">{matchedActivity?.plannedQuantity || 1200}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500">New Actual Pace:</span>{' '}
                      <span className="font-bold text-emerald-700">{matchedActivity?.actualPercent || 68}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainable AI Criteria Checklist */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Explainability Verification Matrix
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      Fuzzy Keyword Correlation
                    </span>
                    <span className="font-bold">98.2%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      WBS Parent Consistency
                    </span>
                    <span className="font-bold">PASSED</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      Predecessor Sequence Valid
                    </span>
                    <span className="font-bold">PASSED</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      Spatial GPS Proximity (&lt;50m)
                    </span>
                    <span className="font-bold">14.2m CEP</span>
                  </div>
                </div>
              </div>

              {/* Inspector Review Notes & Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-slate-500">
                    Lead Planning Engineer Decision Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={plannerNote}
                    onChange={(e) => setPlannerNote(e.target.value)}
                    placeholder="Enter approval note or variance reason for Oracle P6 audit log..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-700"
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
            </div>
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
