import React from 'react';
import { useApp, NavigationTab } from '../services/store';
import { 
  LayoutDashboard, 
  Mic, 
  CheckCircle2, 
  FolderTree, 
  BarChart3, 
  AlertCircle, 
  Dna, 
  Sliders, 
  History, 
  PlayCircle,
  X,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentRole, 
    roleMetadata,
    currentUser,
    logout,
    setCurrentRole,
    matches, 
    conflicts, 
    offlineQueue,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const pendingMatchesCount = matches.filter(m => m.status === 'PENDING_REVIEW').length;
  const unresolvedConflictsCount = conflicts.filter(c => c.status === 'UNRESOLVED').length;

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { 
      tab: 'DASHBOARD', 
      label: 'Executive Health', 
      icon: <LayoutDashboard className="w-4 h-4 text-amber-400" /> 
    },
    { 
      tab: 'FIELD_INPUT', 
      label: 'Field Input Center', 
      icon: <Mic className="w-4 h-4 text-amber-400" />,
      badge: offlineQueue.length > 0 ? offlineQueue.length : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    { 
      tab: 'REVIEW_CENTER', 
      label: 'AI Review Center', 
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: pendingMatchesCount > 0 ? pendingMatchesCount : undefined,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold'
    },
    { 
      tab: 'SCHEDULE_EXPLORER', 
      label: 'WBS & Schedule Tree', 
      icon: <FolderTree className="w-4 h-4 text-sky-400" /> 
    },
    { 
      tab: 'GANTT_4D', 
      label: '4D Gantt Digital Twin', 
      icon: <BarChart3 className="w-4 h-4 text-indigo-400" /> 
    },
    { 
      tab: 'CONFLICT_CENTER', 
      label: 'Conflicts & Chronology', 
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
      badge: unresolvedConflictsCount > 0 ? unresolvedConflictsCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold animate-pulse'
    },
    { 
      tab: 'ACTIVITY_DNA', 
      label: 'Activity DNA & Memory', 
      icon: <Dna className="w-4 h-4 text-teal-400" /> 
    },
    { 
      tab: 'WHAT_IF', 
      label: 'What-If Simulator', 
      icon: <Sliders className="w-4 h-4 text-amber-300" /> 
    },
    { 
      tab: 'AUDIT_TRAIL', 
      label: 'Audit & Provenance', 
      icon: <History className="w-4 h-4 text-slate-400" /> 
    },
    { 
      tab: 'DEMO_WALKTHROUGH', 
      label: '5-Min Judge Demo', 
      icon: <PlayCircle className="w-4 h-4 text-amber-400" />,
      badge: 11,
      badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
    },
  ];

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = activeTab === item.tab;
    const isPrimaryDesk = item.tab === roleMetadata.defaultTab;

    return (
      <button
        key={item.tab}
        onClick={() => {
          setActiveTab(item.tab);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
          isActive
            ? 'bg-slate-800 text-white border-l-2 border-amber-400 shadow-sm'
            : isPrimaryDesk
            ? 'text-slate-200 hover:text-white bg-slate-800/40 border border-amber-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {item.icon}
          <span className="truncate">{item.label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {isPrimaryDesk && (
            <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
              DESK
            </span>
          )}
          {item.badge !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
              {item.badge}
            </span>
          )}
        </div>
      </button>
    );
  };

  const renderNavContent = () => (
    <>
      {/* Role banner for context awareness */}
      <div className={`p-3 border-b transition-all ${roleMetadata.bgColor} ${roleMetadata.borderColor}`}>
        <div className="text-[10px] font-mono uppercase tracking-wider mb-1 flex items-center justify-between text-slate-400">
          <span>Active Persona</span>
          <span className={`flex items-center gap-1 font-bold text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-950/80 border ${roleMetadata.borderColor} ${roleMetadata.color}`}>
            {roleMetadata.badge}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
            <span>{roleMetadata.emoji}</span>
            <span className="truncate">{roleMetadata.label}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
          {roleMetadata.authority}
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Execution Intelligence
        </div>
        {navItems.slice(0, 3).map(renderNavItem)}

        <div className="px-3 pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Schedule & Controls
        </div>
        {navItems.slice(3, 6).map(renderNavItem)}

        <div className="px-3 pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Analytics & Memory
        </div>
        {navItems.slice(6).map(renderNavItem)}
      </nav>

      {/* Enterprise User Profile & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm shrink-0">
            {currentUser?.name.charAt(0) || 'P'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Pranjal Saikia'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {currentUser?.employeeId || 'OIL-PLN-4421'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-900/50 shrink-0"
          title="Sign Out of Oil India Portal"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-slate-400 text-[11px] space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-mono text-[10px]">
          <span>ENGINE VERSION</span>
          <span className="text-amber-400">v2.4 (Oil-Assam)</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Calibrated for Primavera P6 & MS Project WBS L1-L6 schemas.
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 border-r border-slate-800 flex-col shrink-0 min-h-[calc(100vh-61px)]">
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <span className="font-bold text-white text-xs font-mono">ALL MODULES</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavContent()}
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
