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
    <header className="bg-[#0B0F19] border-b border-slate-800/90 sticky top-0 z-40 px-3 sm:px-4 py-2 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 max-w-[1750px] mx-auto">
        {/* Left: Hamburger (mobile) + Corporate Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-850 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-base sm:text-lg shadow-md ring-1 ring-amber-400/40 shrink-0">
            S
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-display">
                SiteSync <span className="text-amber-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 font-mono text-slate-300 uppercase tracking-widest font-semibold">
                OIL INDIA LIMITED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden lg:block font-mono tracking-tight">
              Intelligent Execution Bridge • PS-ID 26122 • Real-Time Actual Progress Layer
            </p>
          </div>
        </div>

        {/* Center: Live P6 Telemetry Indicator + Project Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Oracle Primavera P6 Live Sync Indicator */}
          <div className="hidden xl:flex items-center gap-2 bg-[#0E1422] px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-400">PRIMAVERA P6:</span>
            <span className="text-emerald-400 font-bold">SYNCHRONIZED (v24.12)</span>
          </div>

          {/* Project Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0E1422] px-2.5 py-1.5 rounded-lg border border-slate-800 max-w-[240px] md:max-w-[280px]">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
        </div>

        {/* Right: Controls & Persona HUD */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 5-Min Judge Demo Button */}
          <button
            onClick={() => setActiveTab('DEMO_WALKTHROUGH')}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition-all font-sans ring-1 ring-amber-300/40 active:scale-[0.97] shrink-0 cursor-pointer"
            title="Start step-by-step interactive 11-step hackathon judge demo"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Judge Demo</span>
            <span className="sm:hidden">Demo</span>
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
            className={`flex items-center gap-1.5 text-xs font-mono font-medium px-2 py-1.5 rounded-lg border transition-all ${
              isOnline 
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/40' 
                : 'bg-rose-950/60 border-rose-600/60 text-rose-300 hover:bg-rose-900/40 animate-pulse'
            }`}
            title="Simulate remote site connectivity state and offline SQLite queue"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            {offlineQueue.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded-full">
                {offlineQueue.length}
              </span>
            )}
          </button>

          {/* AI Project Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
              isCopilotOpen 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold' 
                : 'bg-[#0E1422] hover:bg-slate-800 text-amber-300 border-amber-500/30'
            }`}
            title="Open AI Project Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono text-[11px]">Copilot</span>
          </button>

          {/* Professional Role Switcher (Zero Emojis, Crisp SVG Icons) */}
          <div className={`flex items-center gap-1.5 bg-[#0E1422] px-2.5 py-1 rounded-lg border transition-all ${roleMetadata.borderColor} ${roleMetadata.bgColor} shadow-sm ring-1 ring-white/5`}>
            {currentRole === 'planner' && <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {currentRole === 'supervisor' && <HardHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            {currentRole === 'project_manager' && <Briefcase className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
            {currentRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />}

            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className={`bg-transparent text-[11px] sm:text-xs font-bold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none ${roleMetadata.color}`}
              aria-label="Active Persona Selector"
            >
              <option value="planner" className="bg-slate-900 text-emerald-400">Project Planner (Controls)</option>
              <option value="supervisor" className="bg-slate-900 text-amber-400">Site Supervisor (Field Ops)</option>
              <option value="project_manager" className="bg-slate-900 text-sky-400">Project Manager (Executive)</option>
              <option value="admin" className="bg-slate-900 text-purple-400">System Admin (Vigilance)</option>
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
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-900/50 cursor-pointer"
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
