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
  Menu,
  X,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    roleMetadata,
    currentUser,
    logout,
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
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setActiveTab,
    resetToDefaultDemo
  } = useApp();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-4 py-2 shadow-md">
      <div className="flex items-center justify-between gap-2 max-w-[1700px] mx-auto">
        {/* Left: Hamburger (mobile) + Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-base sm:text-lg shadow-lg ring-1 ring-amber-400/50 shrink-0">
            S
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                SiteSync <span className="text-amber-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300 uppercase tracking-wider">
                OIL INDIA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              Planning-to-Execution Bridge: Unstructured field data to trusted actual progress
            </p>
          </div>
        </div>

        {/* Center: Project Selector (hidden on smallest screens, compact on tablet) */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 max-w-[240px] md:max-w-[300px]">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select 
            value={activeProject.id}
            onChange={(e) => {
              const p = allProjects.find(x => x.id === e.target.value);
              if (p) setActiveProject(p);
            }}
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer truncate w-full"
          >
            {allProjects.map(p => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Controls & Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 5-Min Judge Demo Button */}
          <button
            onClick={() => setActiveTab('DEMO_WALKTHROUGH')}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all font-sans ring-1 ring-amber-300/40 active:scale-95 shrink-0"
            title="Start step-by-step interactive 11-step hackathon judge demo"
          >
            <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Demo</span>
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
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg border transition-colors ${
              isOnline 
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/40' 
                : 'bg-rose-950/50 border-rose-600/50 text-rose-400 hover:bg-rose-900/40 animate-pulse'
            }`}
            title="Simulate poor site network connectivity and offline syncing"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {offlineQueue.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded-full">
                {offlineQueue.length}
              </span>
            )}
          </button>

          {/* AI Project Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-1 text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg border transition-all ${
              isCopilotOpen 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
            }`}
            title="Open AI Project Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Role Switcher */}
          <div className={`flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border transition-all ${roleMetadata.borderColor} ${roleMetadata.bgColor} shadow-sm ring-1 ring-white/5`}>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 hidden lg:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className={`bg-transparent text-[11px] sm:text-xs font-bold focus:outline-none cursor-pointer max-w-[125px] sm:max-w-none ${roleMetadata.color}`}
              aria-label="Active Persona Selector"
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
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[11px] font-bold text-slate-200 leading-tight truncate max-w-[110px]">
                {currentUser?.name || 'Pranjal Saikia'}
              </span>
              <span className="text-[9px] font-mono text-slate-400 leading-tight">
                {currentUser?.employeeId || 'OIL-PLN-4421'}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-900/50"
              title={`Sign Out (${currentUser?.name})`}
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
