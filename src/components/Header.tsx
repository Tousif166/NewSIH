import React from 'react';
import { useApp } from '../services/store';
import { UserRole } from '../types';
import { 
  Building2, 
  HardHat, 
  Compass, 
  Briefcase, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  PlayCircle, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    activeProject, 
    allProjects, 
    setActiveProject, 
    isOnline, 
    setIsOnline, 
    offlineQueue, 
    syncOfflineQueue,
    isCopilotOpen, 
    setIsCopilotOpen,
    setActiveTab,
    resetToDefaultDemo
  } = useApp();

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
    supervisor: { 
      label: 'Site Supervisor', 
      icon: <HardHat className="w-4 h-4 text-amber-400" />, 
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      desc: 'Mobile-first Voice & Field Progress'
    },
    planner: { 
      label: 'Project Planner', 
      icon: <Compass className="w-4 h-4 text-emerald-400" />, 
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      desc: 'AI Review, Mappings & 4D Gantt'
    },
    project_manager: { 
      label: 'Project Manager', 
      icon: <Briefcase className="w-4 h-4 text-sky-400" />, 
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      desc: 'What-If, Digital Twin & Delays'
    },
    admin: { 
      label: 'System Admin', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />, 
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      desc: 'Audit Provenance & Configurations'
    },
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-2.5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1700px] mx-auto">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg ring-1 ring-amber-400/50">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                SiteSync <span className="text-amber-400">AI</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300 uppercase tracking-wider">
                SIH26122 • Oil India Limited
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Planning-to-Execution Bridge: Unstructured field data to trusted actual progress
            </p>
          </div>
        </div>

        {/* Center: Project Selector */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <select 
            value={activeProject.id}
            onChange={(e) => {
              const p = allProjects.find(x => x.id === e.target.value);
              if (p) setActiveProject(p);
            }}
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer max-w-[280px] truncate"
          >
            {allProjects.map(p => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Controls & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* 5-Min Judge Demo Button */}
          <button
            onClick={() => setActiveTab('DEMO_WALKTHROUGH')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all font-sans ring-1 ring-amber-300/40 active:scale-95"
            title="Start step-by-step interactive 11-step hackathon judge demo"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Judge Demo (5 Min)</span>
          </button>

          {/* Online/Offline Toggle */}
          <button
            onClick={() => {
              const nextOnline = !isOnline;
              setIsOnline(nextOnline);
              if (nextOnline && offlineQueue.length > 0) {
                syncOfflineQueue();
              }
            }}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
              isOnline 
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/40' 
                : 'bg-rose-950/50 border-rose-600/50 text-rose-400 hover:bg-rose-900/40 animate-pulse'
            }`}
            title="Simulate poor site network connectivity and offline syncing"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
            {offlineQueue.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">
                {offlineQueue.length}
              </span>
            )}
          </button>

          {/* AI Project Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isCopilotOpen 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
            }`}
            title="Open AI Project Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 hidden xl:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="planner" className="bg-slate-900 text-emerald-400">📐 Project Planner</option>
              <option value="supervisor" className="bg-slate-900 text-amber-400">👷 Site Supervisor</option>
              <option value="project_manager" className="bg-slate-900 text-sky-400">👔 Project Manager</option>
              <option value="admin" className="bg-slate-900 text-purple-400">🛡️ System Admin</option>
            </select>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetToDefaultDemo}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
