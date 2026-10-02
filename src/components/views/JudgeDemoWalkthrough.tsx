import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../services/store';

export const JudgeDemoWalkthrough: React.FC = () => {
  const { 
    setActiveTab, 
    commitScheduleActuals,
    currentRole,
    roleMetadata,
    setCurrentRole,
    openIndicSpeechStudio,
    openRoWGeofence,
    openEMbReconciler,
    openCvcAuditDossier,
    openDroneAuditor,
    openWhatsAppGateway,
    openFloodPredictor,
    openP6XerExport,
    openPipeline3D,
    openBlockchainLedger,
    openDelayCascade,
    openVoiceCommander,
    openIoTPredictive,
    openARInspection,
    openDroneFleet,
    openSafetyTraining,
    openGeofenceGIS,
    openComplianceReport,
    openFlowEnergy,
    setIsCopilotOpen,
    showToast 
  } = useApp();

  const [innovationCategory, setInnovationCategory] = useState<
    'MY_ROLE' | 'SUPERVISOR' | 'PLANNER' | 'PROJECT_MANAGER' | 'ADMIN' | 'ALL'
  >('MY_ROLE');

  const matchesRole = (allowedRoles: ('planner' | 'supervisor' | 'project_manager' | 'admin')[]) => {
    if (innovationCategory === 'ALL') return true;
    if (innovationCategory === 'MY_ROLE') return allowedRoles.includes(currentRole);
    if (innovationCategory === 'SUPERVISOR') return allowedRoles.includes('supervisor');
    if (innovationCategory === 'PLANNER') return allowedRoles.includes('planner');
    if (innovationCategory === 'PROJECT_MANAGER') return allowedRoles.includes('project_manager');
    if (innovationCategory === 'ADMIN') return allowedRoles.includes('admin');
    return false;
  };

  const [activeGate, setActiveGate] = useState<number>(4);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(38);
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [committed, setCommitted] = useState<boolean>(false);
  const [tourRunning, setTourRunning] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.warn('Audio play error, falling back to counter:', err);
          setIsPlayingAudio(true);
        });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setAudioDuration(audioRef.current.duration);
      }
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
  };

  const handleSeek = (fraction: number) => {
    if (audioRef.current && audioDuration > 0) {
      const newTime = fraction * audioDuration;
      audioRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
    }
  };

  const handleStartTour = () => {
    setTourRunning(true);
    let step = 1;
    setActiveGate(1);
    const tourInterval = setInterval(() => {
      step++;
      setTourStep(step);
      if (step <= 5) {
        setActiveGate(step);
      } else {
        clearInterval(tourInterval);
        setTourRunning(false);
        setActiveGate(4);
      }
    }, 1500);
  };

  const handleResetSandbox = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
    setIsCommitting(false);
    setCommitted(false);
    setTourRunning(false);
    setActiveGate(4);
  };

  const handleCommitP6 = () => {
    if (isCommitting || committed) return;
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      setCommitted(true);
      commitScheduleActuals();
    }, 1200);
  };

  const formatAudioTime = (current: number, total: number) => {
    const format = (sec: number) => {
      const clamped = Math.max(0, Math.floor(sec));
      const m = Math.floor(clamped / 60);
      const s = clamped % 60;
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };
    return `${format(current)} / ${format(total || 38)}`;
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Top Header Banner & Actions */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
        <div className="flex flex-col gap-1.5 max-w-4xl">
          {/* Compliance Badges Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-700 text-white font-mono text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[13px]">military_tech</span>
              Hackathon Jury Showcase
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] tracking-wider font-semibold">
              OIL-EXEC-DEMO-V4.8
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-medium border border-blue-200">
              <span className="material-symbols-outlined text-[13px] text-blue-700">verified</span>
              Ministry of Petroleum &amp; Natural Gas Compliant
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
              STRICT AUDIT CVC-SEC-8.4
            </span>
          </div>

          {/* Main Title & Technical Subtitle */}
          <h1 className="text-xl text-slate-900 font-bold tracking-tight mt-1">
            SiteSync AI — 5-Minute Executive Jury &amp; Hackathon Demonstration Console
          </h1>
          <p className="text-xs text-slate-600">
            End-to-End Upstream Construction Intelligence: From Assamese Field Voice Memo to Oracle Primavera P6 Epistemic Ground Truth
          </p>
        </div>

        {/* Top Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetSandbox}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-mono text-xs shadow-xs transition-all cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">restart_alt</span>
            Reset Live Sandbox
          </button>
          <button
            type="button"
            onClick={() => {
              alert('CVC Integrity Verification Package downloaded: SHA-256 Merkle Tree + Sentinel SAR Coherence Matrix.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-mono text-xs shadow-xs transition-all cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">folder_zip</span>
            CVC Integrity Proof (.ZIP)
          </button>
          <button
            type="button"
            onClick={handleStartTour}
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-mono text-xs shadow-xs transition-all cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">
              {tourRunning ? 'record_voice_over' : 'play_circle'}
            </span>
            {tourRunning ? `Tour in Progress (${tourStep}/5)` : 'Start Guided 5-Min Tour'}
          </button>
        </div>
      </div>

      {/* 🌟 SMART INDIA HACKATHON (SIH26122 / OIL) 20-MODULE INNOVATIONS SHOWCASE */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-blue-600/40 animate-entrance">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base text-white tracking-tight">
                  Role-Scoped Operational Modules
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-mono font-bold uppercase shrink-0">
                  {roleMetadata.label}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 font-mono font-semibold shrink-0">
                  SIH26122 SPEC
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Displaying curated capabilities for the active operational clearance. Click a role pill below or in the sidebar to switch views.
              </p>
            </div>
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0 flex-wrap">
            <button
              onClick={() => setInnovationCategory('MY_ROLE')}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                innovationCategory === 'MY_ROLE'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🎯 My Role ({roleMetadata.shortLabel})</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('supervisor', true);
                setInnovationCategory('SUPERVISOR');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                innovationCategory === 'SUPERVISOR' || (innovationCategory === 'MY_ROLE' && currentRole === 'supervisor')
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>👷 Field Ops</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('planner', true);
                setInnovationCategory('PLANNER');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                innovationCategory === 'PLANNER' || (innovationCategory === 'MY_ROLE' && currentRole === 'planner')
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📐 Planner</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('project_manager', true);
                setInnovationCategory('PROJECT_MANAGER');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                innovationCategory === 'PROJECT_MANAGER' || (innovationCategory === 'MY_ROLE' && currentRole === 'project_manager')
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>💼 Manager</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('admin', true);
                setInnovationCategory('ADMIN');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                innovationCategory === 'ADMIN' || (innovationCategory === 'MY_ROLE' && currentRole === 'admin')
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🛡️ Admin</span>
            </button>
            <button
              onClick={() => setInnovationCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                innovationCategory === 'ALL'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🌐 All Modules</span>
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid - Divided strictly per Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 mt-4">
          {/* CARD 1: WebGL 3D Digital Twin Pipeline Corridor */}
          {matchesRole(['supervisor', 'project_manager']) && (
            <div 
              onClick={openPipeline3D}
              className="group relative bg-white/5 hover:bg-blue-950/50 border border-white/10 hover:border-blue-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-blue-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-400/20 text-blue-300 border border-blue-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    THREE.JS 3D
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">3D Pipeline Corridor</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-bold shrink-0">FIELD+PM</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Interactive 3D flythrough across the 132km Digboi–Duliajan route with procedural Assam terrain, Burhi Dihing River HDD crossing, and real-time chainage progress inspection.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-blue-300 group-hover:text-white">
                <span>Launch 3D Flight</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 2: Natural Language P6 Query Copilot */}
          {matchesRole(['planner', 'project_manager']) && (
            <div 
              onClick={() => setIsCopilotOpen(true)}
              className="group relative bg-white/5 hover:bg-emerald-950/50 border border-white/10 hover:border-emerald-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-emerald-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    P6 COPILOT
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Ask SiteSync Copilot</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-mono font-bold shrink-0">HINDI+EN</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Query the schedule in plain English or Hindi: "Kaunsa activity delayed hai?" Gets instant structured P6 activity tables, KPIs, and actionable Gantt links.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-300 group-hover:text-white">
                <span>Ask P6 Question</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 3: Immutable Blockchain Audit Ledger */}
          {matchesRole(['admin', 'project_manager']) && (
            <div 
              onClick={openBlockchainLedger}
              className="group relative bg-white/5 hover:bg-emerald-950/50 border border-white/10 hover:border-emerald-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-emerald-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">enhanced_encryption</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SHA-256
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Blockchain Audit Ledger</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-mono font-bold shrink-0">CVC 2022</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Cryptographic SHA-256 hash chain verifying 1,842 schedule changes. Includes live DB tamper simulation proving zero-tolerance vigilance against retroactive alterations.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-300 group-hover:text-white">
                <span>Inspect Hash Chain</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 4: AI Delay Cascade Propagation Simulator */}
          {matchesRole(['planner', 'project_manager']) && (
            <div 
              onClick={openDelayCascade}
              className="group relative bg-white/5 hover:bg-rose-950/50 border border-white/10 hover:border-rose-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-rose-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-400/20 text-rose-300 border border-rose-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    CPM RIPPLE
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">AI Delay Cascade Ripple</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-400 text-slate-950 font-mono font-bold shrink-0">CLAUSE 27.1</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Animated delay ripple through CPM network showing float absorption vs critical slippage, Clause 27.1 Liquidated Damages (₹1.5L/day), and prescriptive mitigations.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-rose-300 group-hover:text-white">
                <span>Simulate Delay Ripple</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 5: Hands-Free Voice Field Commander */}
          {matchesRole(['supervisor']) && (
            <div 
              onClick={openVoiceCommander}
              className="group relative bg-white/5 hover:bg-amber-950/50 border border-white/10 hover:border-amber-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-amber-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    VOICE HUD
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Voice Field Commander</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-bold shrink-0">GLOVE MODE</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Hands-free field operations for supervisors wearing gloves and safety helmets in muddy Assam terrain. Continuous speech recognition with audio synthesis response.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-amber-300 group-hover:text-white">
                <span>Launch Voice HUD [V]</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 6: Real-time IoT Sensor Dashboard & Predictive Maintenance */}
          {matchesRole(['admin', 'supervisor']) && (
            <div 
              onClick={openIoTPredictive}
              className="group relative bg-white/5 hover:bg-indigo-950/50 border border-white/10 hover:border-indigo-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-indigo-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">sensors</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    SCADA 48H
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">IoT Predictive Maint</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-400 text-slate-950 font-mono font-bold shrink-0">TELEMETRY</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Real-time multi-axial SCADA telemetry from 5 stations. In-browser LSTM forecasts impeller cavitation and wax gelation 48h ahead to auto-generate SAP-PM work orders.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-indigo-300 group-hover:text-white">
                <span>Inspect Telemetry</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 7: AR-Enabled Site Inspection */}
          {matchesRole(['supervisor']) && (
            <div 
              onClick={openARInspection}
              className="group relative bg-white/5 hover:bg-sky-950/50 border border-white/10 hover:border-sky-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-sky-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 border border-sky-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    WEBXR CAM
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">AR Spatial Site Inspection</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-400 text-slate-950 font-mono font-bold shrink-0">INSPECTION</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Subterranean -1.85m pipeline overlay with live device camera support. Interactive AR holographic pins for NDT welds, block valves, and click-to-place defect tagging.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-sky-300 group-hover:text-white">
                <span>Launch AR Camera</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 8: Drone Fleet & Orthophoto Timeline */}
          {matchesRole(['planner', 'supervisor']) && (
            <div 
              onClick={openDroneFleet}
              className="group relative bg-white/5 hover:bg-emerald-950/50 border border-white/10 hover:border-emerald-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-emerald-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    4 SECTORS
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Drone Fleet & Orthophoto</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-mono font-bold shrink-0">LIDAR DEM</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Interactive Before/After orthophoto split comparison slider. Computes volumetric earthwork cut/fill from LiDAR point clouds and reconciles P6 as-built milestones.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-300 group-hover:text-white">
                <span>View UAV Flights</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 9: Gamified Safety Training Hub */}
          {matchesRole(['supervisor']) && (
            <div 
              onClick={openSafetyTraining}
              className="group relative bg-white/5 hover:bg-amber-950/50 border border-white/10 hover:border-amber-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-amber-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">military_tech</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    OISD-141
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Gamified Safety Hub</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-bold shrink-0">DRILLS</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Interactive timed crisis drills on toxic H₂S leaks, monsoon trench collapses, and permit violations. Live peer leaderboard and printable PSU safety certificates.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-amber-300 group-hover:text-white">
                <span>Start Safety Drill</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 10: GIS Corridor Threat Alert */}
          {matchesRole(['project_manager', 'supervisor']) && (
            <div 
              onClick={openGeofenceGIS}
              className="group relative bg-white/5 hover:bg-rose-950/50 border border-white/10 hover:border-rose-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-rose-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-400/20 text-rose-300 border border-rose-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    30M ROW
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">GIS Threat Alerts</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-400 text-slate-950 font-mono font-bold shrink-0">CISF QRT</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Vector GIS corridor map tracking 30m legal RoW and 500m eco-sensitive Dihing Patkai buffer. Detects unauthorized excavators, river scour, and dispatches CISF QRT.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-rose-300 group-hover:text-white">
                <span>Inspect GIS Threats</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 11: AI Compliance Report Generator */}
          {matchesRole(['admin', 'project_manager']) && (
            <div 
              onClick={openComplianceReport}
              className="group relative bg-white/5 hover:bg-yellow-950/50 border border-white/10 hover:border-yellow-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-yellow-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                    STATUTORY
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-yellow-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">CVC / MoP&NG Report AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-yellow-400 text-slate-950 font-mono font-bold shrink-0">DPR</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Converts raw voice logs into formal Ministry of Petroleum & Natural Gas DPRs. Automatically categorizes Force Majeure delays and stamps SHA-256 integrity proofs.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-yellow-300 group-hover:text-white">
                <span>Generate Dossier</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 12: Energy-Optimization & Flow Digital Twin */}
          {matchesRole(['project_manager', 'admin']) && (
            <div 
              onClick={openFlowEnergy}
              className="group relative bg-white/5 hover:bg-teal-950/50 border border-white/10 hover:border-teal-400/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-teal-900/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    DRA OPTIMIZER
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Energy & Flow Twin</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-400 text-slate-950 font-mono font-bold shrink-0">HYDRAULIC</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Hydraulic Grade Line (HGL) simulator for high-wax Digboi crude. AI tunes Drag Reducing Agent (DRA) ppm & pump speeds to save ₹42.8L/month and eliminate wax risk.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-teal-300 group-hover:text-white">
                <span>Optimize Pumping</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 13: Drone & Satellite CV Progress Auditor */}
          {matchesRole(['planner', 'admin']) && (
            <div 
              onClick={openDroneAuditor}
              className="group relative bg-white/5 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-cyan-900/30"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    CV MASK
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Drone CV Progress Auditor</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-normal shrink-0">₹12.4L HELD</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Interactive Before/After orthomosaic aerial slider with CV masks. Directly flags 450m claimed vs 280m detected and withholds ₹12.4L unverified work.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-cyan-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Launch CV Auditor</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 14: WhatsApp & Telegram Webhook Gateway Simulator */}
          {matchesRole(['supervisor', 'planner']) && (
            <div 
              onClick={openWhatsAppGateway}
              className="group relative bg-white/5 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-emerald-900/30"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    EXIF GPS
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">WhatsApp Webhook Gateway</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-normal shrink-0">BOT v2</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Interactive smartphone webhook simulator. Ingests vernacular voice notes, geotagged site photos & contractor dispatches straight into Primavera P6.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Launch Phone Simulator</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 15: Brahmaputra Flood Early Warning Engine */}
          {matchesRole(['project_manager', 'planner']) && (
            <div 
              onClick={openFloodPredictor}
              className="group relative bg-white/5 hover:bg-sky-950/40 border border-white/10 hover:border-sky-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-sky-900/30"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">water</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 border border-sky-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                    CWC RIVER
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Brahmaputra Flood Radar</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono font-normal shrink-0">+104.6M</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Real-time gauge simulation of Burhi Dihing (+104.6m). Detects flash flood RoW breach and executes 1-click preemptive schedule shifts and rig evacuations.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-sky-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Launch Flood Engine</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 16: Native Primavera P6 .XER Bi-Directional Exporter */}
          {matchesRole(['planner', 'admin']) && (
            <div 
              onClick={openP6XerExport}
              className="group relative bg-white/5 hover:bg-violet-950/40 border border-white/10 hover:border-violet-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-violet-900/30"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-400/20 text-violet-300 border border-violet-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                    P6 .XER
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Native P6 .XER Exporter</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-mono font-normal shrink-0">EPPM V24</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Generates authentic industry-standard Oracle Primavera P6 ASCII .XER files with 1-click direct download, syntax inspection & EPPM REST API telemetry.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-violet-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Export .XER / Sync</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 17: Indic Speech Studio */}
          {matchesRole(['supervisor']) && (
            <div 
              onClick={openIndicSpeechStudio}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">translate</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                    BHASHA
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">Indic Speech Studio</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-normal shrink-0">HINDI/AS</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Translates Hinglish, Assamese & Bhojpuri site audio (<em>dhalai, khudai, taanka, solise</em>) directly into Primavera P6 activities.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-amber-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Launch Studio</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 18: Anti-Ghost RoW Geofence */}
          {matchesRole(['supervisor', 'admin']) && (
            <div 
              onClick={openRoWGeofence}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-400/20 text-rose-300 border border-rose-400/30 shrink-0">
                    ANTI-GHOST
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">GPS RoW Geofence</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono font-normal shrink-0">500M RADAR</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  500m Haversine radar across Digboi–Duliajan 132km RoW. Instantly catches and flags off-site fraudulent progress claims.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-rose-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Test GPS Radar</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 19: e-Measurement Book */}
          {matchesRole(['admin', 'planner']) && (
            <div 
              onClick={openEMbReconciler}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                    ₹23.5L HELD
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">e-Measurement Book</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-normal shrink-0">RA BILLS</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Reconciles contractor RA bill % against verified physical actuals. Holds ₹23.50 Lakhs overbilling with digital signing.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Audit RA Bills</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}

          {/* CARD 20: CVC/CAG Audit Dossier */}
          {matchesRole(['admin', 'project_manager']) && (
            <div 
              onClick={openCvcAuditDossier}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-300/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-300/20 text-amber-200 border border-amber-300/30 shrink-0">
                    CVC / FIDIC
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors flex items-center justify-between gap-1.5 min-w-0">
                  <span className="truncate">CVC / CAG Legal Dossier</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-normal shrink-0">MERKLE</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  1-Click delay defense dossier: Force Majeure vs Client vs Contractor Default (₹14.20L LD) with cryptographic Merkle proof.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-amber-200 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Open Legal Dossier</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5-Gate Guided Progression Pipeline Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-3.5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
        {/* Gate 01 */}
        <div
          onClick={() => setActiveGate(1)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 1
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 01</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check</span> DONE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Field Voice Ingestion</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">Audio DPR #8820-03 Assamese/Hindi</div>
        </div>

        {/* Gate 02 */}
        <div
          onClick={() => setActiveGate(2)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 2
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 02</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check</span> DONE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Entity Disambiguation</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">420m laid, 2x PC300 → ACT-TR-4290</div>
        </div>

        {/* Gate 03 */}
        <div
          onClick={() => setActiveGate(3)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 3
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 03</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check</span> DONE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Multi-Sensor Corroboration</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">Sentinel-1 SAR + GNSS hard rock</div>
        </div>

        {/* Gate 04: Active Arbitration */}
        <div
          onClick={() => setActiveGate(4)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 4
              ? 'border-rose-400 bg-rose-50 text-rose-950 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-semibold text-rose-800">Gate 04</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              ARBITRATION
            </span>
          </div>
          <div className="text-xs font-bold text-rose-900">Dispute &amp; Claim Rejection</div>
          <div className="font-mono text-[10px] text-rose-700 truncate">11 dry days disproven: ₹2.10 Cr LD</div>
        </div>

        {/* Gate 05 */}
        <div
          onClick={() => setActiveGate(5)}
          className={`flex flex-col gap-1 p-2.5 rounded cursor-pointer transition-all border ${
            activeGate === 5
              ? 'border-blue-700 bg-blue-50/80 shadow-xs'
              : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Gate 05</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">schedule</span> READY
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">Ledger Sync Oracle P6</div>
          <div className="font-mono text-[10px] text-slate-500 truncate">Merkle Root committed to EPPM</div>
        </div>
      </div>

      {/* 3-Column Demonstration Interactive Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* COLUMN 1: Stage 01 // Edge Ingestion */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 rounded bg-blue-700"></div>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                STAGE 01 // EDGE INGESTION
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-semibold border border-blue-200">
              Assamese-Hindi ASR v3.2
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 -mt-1">
            <span>FIELD TELEMETRY DPR #8820-03</span>
            <span className="text-blue-700 font-mono">MIC LATENCY: 220ms</span>
          </div>

          {/* Audio Player Card */}
          <div className="flex flex-col gap-2.5 p-3 rounded bg-slate-50 border border-slate-200 shadow-2xs">
            {/* HTML5 Audio Element for sihaudio.mp4 */}
            <audio
              ref={audioRef}
              src="/sihaudio.mp4"
              preload="auto"
              onTimeUpdate={handleAudioTimeUpdate}
              onLoadedMetadata={handleAudioLoadedMetadata}
              onEnded={handleAudioEnded}
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs hover:bg-blue-800 active:scale-95 transition-all cursor-pointer shrink-0"
                  title={isPlayingAudio ? 'Pause sihaudio.mp4' : 'Play sihaudio.mp4'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 truncate">sihaudio.mp4</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 font-mono text-[9px] font-bold shrink-0">
                      ACTUAL AUDIO
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 truncate">
                    Assam Field Telemetry Memo • Actual Recording Stream
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-blue-700 font-bold shrink-0">
                {formatAudioTime(audioCurrentTime, audioDuration)}
              </span>
            </div>

            {/* Dynamic Waveform Visualizer & Click-to-Seek Scrubber */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                handleSeek(frac);
              }}
              className="h-10 w-full bg-slate-200 hover:bg-slate-300/80 transition-colors rounded p-1.5 flex items-center gap-1 overflow-hidden cursor-pointer"
              title="Click anywhere along waveform to seek audio playback"
            >
              {[35, 60, 85, 45, 95, 70, 30, 80, 100, 65, 90, 50, 75, 85, 40, 60, 25, 70, 50, 80, 35, 25, 50, 30, 15].map(
                (h, idx) => {
                  const progressFrac = audioDuration > 0 ? audioCurrentTime / audioDuration : 0;
                  const isPassed = idx / 25 <= progressFrac;
                  return (
                    <span
                      key={idx}
                      className={`flex-1 rounded transition-all duration-100 ${
                        isPassed ? 'bg-blue-700' : 'bg-slate-400'
                      } ${isPlayingAudio ? 'waveform-bar active-anim' : ''}`}
                      style={{
                        height: `${h}%`,
                        animationDelay: `${(idx * 0.05).toFixed(2)}s`
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>

          {/* Auto-Transcript Card */}
          <div className="flex flex-col gap-2 p-3 rounded bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                ASR Transcript (Dialect Disambiguated)
              </span>
              <span className="font-mono text-[10px] text-blue-700 font-bold">98.4% Confidence</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              “Encountered subterranean hard rock strata at chainage{' '}
              <span className="bg-amber-100 text-amber-900 font-bold px-1 rounded font-mono">42+650</span>. Deployed two auxiliary{' '}
              <span className="bg-blue-100 text-blue-900 font-bold px-1 rounded font-mono">Komatsu PC300</span> excavators. Completed{' '}
              <span className="bg-emerald-100 text-emerald-900 font-bold px-1 rounded font-mono">420m</span> laid today without safety incident.”
            </p>
          </div>

          {/* Real-Time NLP Entity Tags */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
              Parsed Entity Extraction
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">Action / Phase</span>
                <span className="text-xs text-slate-900 font-bold">Trenching &amp; Stringing</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">Linear Progress</span>
                <span className="text-xs text-blue-700 font-bold font-mono">420 Meters</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">Asset Assignment</span>
                <span className="text-xs text-slate-900 font-bold">2x Komatsu PC300</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500">WBS Mapping Code</span>
                <span className="text-xs text-blue-700 font-bold font-mono">ACT-TR-4290</span>
              </div>
            </div>
          </div>

          {/* Drone Recon Orthophoto Snippet with Live Radar Sweep */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>DRONE RECON ORTHOPHOTO (KM 42+650)</span>
              <span className="text-blue-700 font-mono">GSD: 1.8cm/px</span>
            </div>
            <div className="relative w-full h-36 rounded overflow-hidden shadow-2xs border border-slate-200 group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Aerial orthophoto survey of heavy industrial pipeline excavation trench through dense subtropical terrain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Ezr_RrncvQtbWZI71c9ilTXb4RnPlTEHWZWmLMXEV8ls10HxMGL_HKSuspDRhX26LfmstJoFpDhRnAyiDbdzGRqkZAq7AdgEIp-xHAWGqnxCtGsyjGaUwYsZi-RIMVn-PcN-ViE2Pz8lIHpXRVGRlrrrFb4OzkIqmseGxAvRIqvHmEAIsOE7qruubCfsiHOTWu-NrG7pJaqUu-myaqKj-gXlNQ3cPVs4oEzKUwMHr_QYKkAl4xc"
              />
              <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-blue-400/25 to-blue-500/40 pointer-events-none radar-line"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                <div className="flex items-center justify-between text-white font-mono text-[10px]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    PINCH POINT ANNOTATED: KM 42+650
                  </span>
                  <span className="text-blue-200">BEARING: 042° NNE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Stage 02 // Satellite Arbitration */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 rounded bg-rose-600"></div>
              <span className="font-mono text-[10px] text-rose-700 uppercase tracking-wider font-bold">
                STAGE 02 // SATELLITE ARBITRATION
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-mono text-[10px] font-semibold border border-rose-200">
              Sentinel-1 SAR C-Band
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 -mt-1">
            <span>MULTI-SENSOR DISCREPANCY MATRIX</span>
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
              DISPUTE IDENTIFIED
            </span>
          </div>

          {/* Contractor Claim Card */}
          <div className="p-3 rounded bg-slate-50 flex flex-col gap-1.5 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                Contractor Force Majeure Claim
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                CLAIM CONTESTED
              </span>
            </div>
            <p className="text-xs text-slate-800">
              “14 Days Unworkable Soil Due To Severe Monsoon Flooding &amp; Submersion across Chainage 41+000 to 44+200.”
            </p>
          </div>

          {/* Sentinel-1 SAR Soil Moisture Index Visualization */}
          <div className="flex flex-col gap-2 p-3 rounded bg-slate-50 border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-800 font-semibold">Sentinel-1 SAR Soil Moisture Backscatter</span>
              <span className="text-rose-700 font-bold">11 OF 14 DAYS DRY GROUND</span>
            </div>

            <div className="w-full h-28 bg-white rounded p-2 flex flex-col justify-between border border-slate-200 relative overflow-hidden">
              <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                <span>-5 dB (Dry Soil)</span>
                <span className="text-rose-700 font-bold">FLOOD THRESHOLD: -8.0 dB</span>
              </div>

              {/* Bar Graph */}
              <div className="flex items-end justify-between gap-1 h-14 w-full pt-1">
                <div className="w-full h-12 bg-rose-600 rounded-xs" title="Day 1: -9.1 dB [Flooded]"></div>
                <div className="w-full h-11 bg-rose-600 rounded-xs" title="Day 2: -8.8 dB [Flooded]"></div>
                <div className="w-full h-10 bg-rose-600 rounded-xs" title="Day 3: -8.2 dB [Flooded]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 4: -5.4 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 5: -5.1 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 6: -5.2 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 7: -4.9 dB [Dry Ground]"></div>
                <div className="w-full h-5 bg-blue-700 rounded-xs" title="Day 8: -5.6 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 9: -5.0 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 10: -4.8 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 11: -4.7 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 12: -5.3 dB [Dry Ground]"></div>
                <div className="w-full h-4 bg-blue-700 rounded-xs" title="Day 13: -5.1 dB [Dry Ground]"></div>
                <div className="w-full h-3 bg-blue-700 rounded-xs" title="Day 14: -4.9 dB [Dry Ground]"></div>
              </div>

              <div className="flex justify-between font-mono text-[9px] text-slate-500 pt-1">
                <span>Day 01 (Flooded)</span>
                <span>Day 07 (Dry)</span>
                <span>Day 14 (Dry)</span>
              </div>
            </div>
          </div>

          {/* AI Arbitration Verdict Card */}
          <div className="p-3 rounded bg-rose-50 text-rose-950 flex flex-col gap-1.5 border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-rose-800">
                Autonomous Arbitration Verdict
              </span>
              <span className="font-mono text-[10px] text-rose-700 font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200">
                STATUTORY REJECTION
              </span>
            </div>
            <p className="text-xs font-bold text-rose-900">
              11 Calendar Days Extension Disallowed
            </p>
            <p className="text-[11px] text-rose-800 leading-snug">
              Adhering to Central Vigilance Commission (CVC) Engineering Manual Sec 8.4 Liquidated Damages enforcement.
            </p>
          </div>

          {/* Financial Metric Callout */}
          <div className="p-3 rounded bg-blue-50 flex items-center justify-between border border-blue-200 shadow-2xs">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-600 uppercase font-semibold">
                Liquidated Damages Protected
              </span>
              <span className="text-xl text-blue-800 font-bold font-mono tracking-tight">
                ₹2,10,00,000
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-700 text-white font-mono text-xs font-bold shadow-2xs">
              ₹2.10 Cr SAVED
            </span>
          </div>

          {/* 4D Spatial Corridor Preview Map */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>4D SPATIAL CORRIDOR (CH 41+000 TO 44+200)</span>
              <span className="text-blue-700 font-mono">RTK 1.4cm RMS</span>
            </div>
            <div className="w-full h-32 bg-slate-100 rounded relative overflow-hidden shadow-2xs border border-slate-200">
              <div className="absolute inset-0 bg-[radial-gradient(#1d4ed8_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              <div className="absolute inset-0 bg-blue-700/10 flex items-center justify-center">
                <span className="px-3 py-1 rounded bg-white text-slate-900 font-mono text-[10px] font-bold shadow-sm border border-slate-200">
                  GIS DIGITAL TWIN LIVE CORRIDOR
                </span>
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                GNSS FIX: ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Stage 03 // Enterprise P6 Sync */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xs border border-slate-300 hover-elevate">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 rounded bg-blue-700"></div>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                STAGE 03 // ENTERPRISE P6 SYNC
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-semibold border border-blue-200">
              Oracle EPPM Gateway
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 -mt-1">
            <span>SCHEDULE RECOVERY &amp; MERKLE SEALING</span>
            <span className="text-blue-700 font-mono font-bold">BUFFER RECOVERED</span>
          </div>

          {/* What-If Monte Carlo Analysis */}
          <div className="p-3 rounded bg-slate-50 flex flex-col gap-2 border border-slate-200">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
              Schedule Delta Simulation
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-600">Contractor Baseline Slip:</span>
                <span className="text-rose-600 font-bold">-4.2 Days Projected</span>
              </div>
              <div className="w-full h-2 rounded bg-rose-100 overflow-hidden">
                <div className="w-2/3 h-full bg-rose-600"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-800 font-semibold">SiteSync AI Re-sequencing:</span>
                <span className="text-blue-700 font-bold">+1.8 Days Buffer Secured</span>
              </div>
              <div className="w-full h-2 rounded bg-blue-100 overflow-hidden">
                <div className="w-4/5 h-full bg-blue-700"></div>
              </div>
            </div>

            <div className="mt-1 p-2 rounded bg-white flex items-center justify-between text-slate-900 border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500 font-semibold">NET CRITICAL PATH DELTA</span>
              <span className="font-mono text-xs text-blue-700 font-bold">+6.0 CALENDAR DAYS</span>
            </div>
          </div>

          {/* Action Taken Box */}
          <div className="p-3 rounded bg-slate-50 flex flex-col gap-1 border border-slate-200">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
              Dynamic Resource Auto-Allocation
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Auto-dispatched 2x CAT 336D hydraulic rock breakers from Duliajan Depot to bypass granitic pinch point at KM 42+650.
            </p>
          </div>

          {/* Cryptographic Proof Anchor */}
          <div className="p-3 rounded bg-blue-50/70 flex flex-col gap-1.5 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-600 uppercase font-semibold">
                Cryptographic Ground Truth Anchor
              </span>
              <span className="font-mono text-[10px] text-blue-700 font-bold">SHA-256 + RSA-4096</span>
            </div>
            <div className="font-mono text-[10px] text-slate-900 break-all bg-white p-2 rounded border border-slate-200">
              MERKLE ROOT: 0x9AF572B104...ED312C889104
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
              <span className="material-symbols-outlined text-[13px] text-blue-700">verified_user</span>
              Permanent immutable proof recorded for statutory vigilance audits.
            </div>
          </div>

          {/* 1-Click Commit CTA */}
          <button
            type="button"
            disabled={isCommitting}
            onClick={handleCommitP6}
            className={`w-full py-3 px-4 rounded font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
              committed
                ? 'bg-emerald-600 text-white'
                : isCommitting
                ? 'bg-blue-800 text-white cursor-wait'
                : 'bg-blue-700 hover:bg-blue-800 active:scale-95 text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isCommitting ? 'animate-spin' : ''}`}>
              {isCommitting ? 'sync' : committed ? 'verified' : 'send_time_extension'}
            </span>
            <span>
              {isCommitting
                ? 'Committing SHA-256 Merkle Block to Oracle P6...'
                : committed
                ? 'Synchronized to Oracle EPPM #TR-4290'
                : 'Simulate 1-Click Commit to Oracle P6'}
            </span>
          </button>

          {/* Value Impact Scorecard */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Schedule Saved</span>
              <span className="text-sm text-blue-700 font-bold font-mono">4.2 Days</span>
            </div>
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Funds Protected</span>
              <span className="text-sm text-blue-700 font-bold font-mono">₹2.10 Cr</span>
            </div>
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Latency to Audit</span>
              <span className="text-sm text-slate-900 font-bold font-mono">
                14s <span className="font-mono text-[10px] text-slate-500 font-normal">(was 48h)</span>
              </span>
            </div>
            <div className="shimmer-badge p-2.5 rounded bg-slate-50 flex flex-col border border-slate-200">
              <span className="font-mono text-[10px] text-slate-500">Throughput Gain</span>
              <span className="text-sm text-slate-900 font-bold font-mono">12,342x Faster</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
