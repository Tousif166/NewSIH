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
    showToast
  } = useApp();

  const handleExportAudit = () => {
    showToast('Audit Package Generated: Verified SHA-256 ledger proof bundle ready for export.');
  };

  const handleCommitP6 = () => {
    commitScheduleActuals();
  };

  return (
    <header className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 px-3 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 mr-2">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Project Branding & WBS Header */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-slate-900 text-xs sm:text-base tracking-tight truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
              {activeProject.name || 'Digboi–Duliajan 132km Crude Trunkline'}
            </span>
            <span className="hidden xs:inline px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 font-mono text-[9px] sm:text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0">
              WBS-REV-4.8
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 font-mono text-[11px] text-slate-500 truncate">
            <span className="truncate font-medium text-slate-600">PIPELINE REINFORCEMENT SEGMENT 04-A</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium shrink-0">LAT: 27.3805° N, 95.3182° E</span>
          </div>
        </div>

        {/* Live Network & Ledger Validation Telemetry */}
        <div className="hidden xl:flex items-center gap-2.5 pl-4 border-l border-slate-200 font-mono text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 radar-beacon"></span>
            18ms LATENCY
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-semibold shadow-2xs">
            <span className="material-symbols-outlined text-[13px]">lock</span>
            LEDGER VALIDATED
          </div>
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Offline Queue Toggle if disconnected */}
        <button
          onClick={() => {
            const nextOnline = !isOnline;
            setIsOnline(nextOnline);
            if (nextOnline && offlineQueue.length > 0) syncOfflineQueue();
          }}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono border transition-all font-semibold ${
            isOnline 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
          }`}
          title="Simulate network connectivity & offline queue"
        >
          <span className="material-symbols-outlined text-[14px]">
            {isOnline ? 'wifi' : 'wifi_off'}
          </span>
          <span className="text-[10px]">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          {offlineQueue.length > 0 && (
            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 rounded-full">
              {offlineQueue.length}
            </span>
          )}
        </button>

        {/* AI Copilot Toggle */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold border transition-all ${
            isCopilotOpen 
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
          title="Open AI Project Copilot"
        >
          <span className="material-symbols-outlined text-[16px] text-blue-600">psychology</span>
          <span className="hidden lg:inline text-[11px]">Copilot</span>
        </button>

        {/* Operator Pill with Role Switcher Dropdown (desktop) */}
        <div className="relative hidden md:flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-md text-left hover:bg-slate-100/80 transition-colors shadow-2xs">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">switch_account</span>
          <div className="flex flex-col">
            <span className="font-mono text-[11px] font-bold text-slate-800 leading-tight">
              {currentUser?.name || 'Pranjal Saikia'}
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="font-mono text-[10px] text-slate-600 bg-transparent border-0 p-0 focus:outline-none cursor-pointer leading-tight font-semibold"
              aria-label="Select Active Persona"
            >
              <option value="planner">Chief Eng (Planner)</option>
              <option value="supervisor">Site Supervisor (Field)</option>
              <option value="project_manager">Project Manager (Exec)</option>
              <option value="admin">System Admin (Vigilance)</option>
            </select>
          </div>
        </div>

        {/* Export Audit PKG Button */}
        <button
          onClick={handleExportAudit}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-mono text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-500">inventory_2</span>
          <span>Export Audit PKG</span>
        </button>

        {/* Commit to P6 Button */}
        <button
          onClick={handleCommitP6}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold shadow-xs btn-tactile cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px] sm:text-[16px]">cloud_upload</span>
          <span className="hidden sm:inline">Commit to P6</span>
          <span className="sm:hidden text-[10px]">Commit</span>
        </button>

        {/* User Avatar Circle */}
        <div 
          onClick={logout}
          className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer shrink-0"
          title="Click to Sign Out"
        >
          {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PS'}
        </div>
      </div>
    </header>
  );
};
