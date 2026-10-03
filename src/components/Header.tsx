import React from 'react';
import { useApp } from '../services/store';
import { UserRole } from '../types';

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
    commitScheduleActuals,
    setIsDossierOpen,
    openP6XerExport,
    openVoiceCommander,
    openPipeline3D,
    openBlockchainLedger,
    showToast,
    theme,
    toggleTheme
  } = useApp();

  const handleExportAudit = () => {
    setIsDossierOpen(true);
    showToast('Opening CVC & CAG Statutory Delay Defense & Arbitration Dossier...', 'info');
  };

  const handleCommitP6 = () => {
    commitScheduleActuals();
  };

  return (
    <header className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-white/95 dark:bg-[#080d17]/95 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 z-40 px-2 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Project Branding & WBS Info (Guaranteed overflow-hidden to prevent overlapping) */}
      <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 flex-1 overflow-hidden mr-2 sm:mr-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none shrink-0 cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Project Branding & WBS Header */}
        <div className="flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-base tracking-tight truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
              {activeProject.name || 'Digboi–Duliajan 132km Crude Trunkline'}
            </span>
            <span className="hidden xs:inline px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111a2d] border border-slate-300 dark:border-slate-700 font-mono text-[9px] sm:text-[10px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
              WBS-4.8
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10.5px] text-slate-500 truncate">
            <span className="truncate font-medium text-slate-600 dark:text-slate-400">OIL-INFRA-TRUNKLINE</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium shrink-0">132 KM ASSAM</span>
          </div>
        </div>

        {/* Telemetry pill (strictly visible only on 2XL screens to never crowd header) */}
        <div className="hidden 2xl:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 font-mono text-[10px] shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            18ms
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-sky-950/60 text-blue-800 dark:text-sky-300 border border-blue-200 dark:border-sky-700/50 font-semibold shadow-2xs">
            <span className="material-symbols-outlined text-[12px]">lock</span>
            LEDGER
          </div>
        </div>
      </div>

      {/* Right Controls: Role-Scoped Quick Actions (No overlap, clean layout) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* ROLE SPECIFIC ACTIONS: Field Supervisor */}
        {currentRole === 'supervisor' && (
          <>
            <button
              onClick={openVoiceCommander}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-300 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Open Hands-Free Voice Field Commander (Hotkey: V)"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-700 dark:text-amber-400 animate-pulse">mic</span>
              <span className="hidden sm:inline text-[11px] font-bold">Voice [V]</span>
            </button>
            <button
              onClick={() => {
                const nextOnline = !isOnline;
                setIsOnline(nextOnline);
                if (nextOnline && offlineQueue.length > 0) syncOfflineQueue();
              }}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-md text-xs font-mono border transition-all font-semibold shrink-0 cursor-pointer ${
                isOnline 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 animate-pulse'
              }`}
              title="Simulate network connectivity & offline queue"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isOnline ? 'wifi' : 'wifi_off'}
              </span>
              <span className="text-[10px] hidden xs:inline">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              {offlineQueue.length > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                  {offlineQueue.length}
                </span>
              )}
            </button>
          </>
        )}

        {/* ROLE SPECIFIC ACTIONS: Project Planner */}
        {currentRole === 'planner' && (
          <>
            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                isCopilotOpen 
                  ? 'bg-blue-700 text-white border-blue-800 shadow-sm' 
                  : 'bg-white dark:bg-[#0b1220] text-slate-700 dark:text-slate-200 border-slate-300 dark:border-amber-500/20 hover:bg-slate-50 dark:hover:bg-white/5 shadow-2xs'
              }`}
              title="Open Ask SiteSync NL Copilot"
            >
              <span className="material-symbols-outlined text-[15px] text-blue-600 dark:text-amber-400">psychology</span>
              <span className="hidden sm:inline text-[11px] font-bold">Copilot</span>
            </button>
            <button
              onClick={openP6XerExport}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md bg-blue-50 dark:bg-sky-950/40 hover:bg-blue-100 dark:hover:bg-sky-900/50 text-blue-900 dark:text-sky-300 border border-blue-300 dark:border-sky-700 font-mono text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Export authentic Oracle Primavera P6 .XER ASCII file"
            >
              <span className="material-symbols-outlined text-[15px] text-blue-700 dark:text-sky-400">file_download</span>
              <span className="hidden sm:inline text-[11px]">.XER</span>
            </button>
          </>
        )}

        {/* ROLE SPECIFIC ACTIONS: Project Manager */}
        {currentRole === 'project_manager' && (
          <>
            <button
              onClick={openPipeline3D}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold border border-blue-300 dark:border-sky-700 bg-blue-50 dark:bg-sky-950/40 hover:bg-blue-100 dark:hover:bg-sky-900/50 text-blue-900 dark:text-sky-300 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Launch WebGL 3D Pipeline Digital Twin"
            >
              <span className="material-symbols-outlined text-[15px] text-blue-700 dark:text-sky-400">view_in_ar</span>
              <span className="hidden sm:inline text-[11px] font-bold">3D Twin</span>
            </button>
            <button
              onClick={handleExportAudit}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md bg-amber-100/90 dark:bg-amber-950/40 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-600/50 font-mono text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Open CVC & CAG Statutory Delay Defense Dossier"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-800 dark:text-amber-400">gavel</span>
              <span className="hidden sm:inline text-[11px]">CVC Dossier</span>
            </button>
          </>
        )}

        {/* ROLE SPECIFIC ACTIONS: System Admin */}
        {currentRole === 'admin' && (
          <>
            <button
              onClick={openBlockchainLedger}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Open Immutable Blockchain Audit Ledger"
            >
              <span className="material-symbols-outlined text-[15px] text-emerald-700 dark:text-emerald-400">enhanced_encryption</span>
              <span className="hidden sm:inline text-[11px] font-bold">Ledger</span>
            </button>
            <button
              onClick={handleExportAudit}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md bg-amber-100/90 dark:bg-amber-950/40 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-600/50 font-mono text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Open CVC & CAG Statutory Delay Defense Dossier"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-800 dark:text-amber-400">gavel</span>
              <span className="hidden sm:inline text-[11px]">CVC Dossier</span>
            </button>
          </>
        )}

        {/* Persona Selector (Compact, No text collisions) */}
        <div className="relative hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-left shadow-2xs shrink-0">
          <span className="material-symbols-outlined text-slate-500 text-[16px]">switch_account</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="font-mono text-[10px] text-slate-700 bg-transparent border-0 p-0 focus:outline-none cursor-pointer leading-tight font-semibold"
            aria-label="Select Active Persona"
          >
            <option value="supervisor">👷 Field Supervisor</option>
            <option value="planner">📐 Project Planner</option>
            <option value="project_manager">💼 Project Manager</option>
            <option value="admin">🛡️ System Admin</option>
          </select>
        </div>

        {/* Commit to P6 Button */}
        <button
          onClick={handleCommitP6}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold shadow-xs btn-tactile cursor-pointer shrink-0"
          type="button"
          title="Commit Schedule Actuals to Oracle Primavera P6"
        >
          <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
          <span className="hidden sm:inline text-[11px]">Commit</span>
        </button>

        {/* Dark / Light Mode Capsule Pill (Obsidian Amber Theme) */}
        <div 
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTheme()}
          title={theme === 'dark' ? 'Active: Dark Mode (Click for Light Mode)' : 'Active: Light Mode (Click for Dark Mode)'}
          className="flex items-center gap-0.5 p-1 rounded-full bg-slate-100 dark:bg-[#070c16] border border-slate-200 dark:border-amber-500/30 cursor-pointer shadow-inner transition-colors shrink-0"
          aria-label="Toggle dark and light mode"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            theme === 'light' 
              ? 'bg-white text-amber-500 shadow-xs' 
              : 'text-slate-400 hover:text-slate-200'
          }`}>
            <span className="material-symbols-outlined text-[15px]">light_mode</span>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.6)]' 
              : 'text-slate-400 hover:text-slate-600'
          }`}>
            <span className="material-symbols-outlined text-[15px]">dark_mode</span>
          </div>
        </div>

        {/* User Avatar Circle */}
        <div 
          onClick={logout}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer shrink-0"
          title="Click to Sign Out"
        >
          {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PS'}
        </div>
      </div>
    </header>
  );
};
