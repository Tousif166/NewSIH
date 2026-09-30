import React from 'react';
import { useApp, NavigationTab } from '../services/store';

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

  const navGroups: {
    groupName: string;
    items: {
      tab: NavigationTab;
      label: string;
      icon: string;
      badgeText?: string;
      badgeClass?: string;
      iconColor?: string;
    }[];
  }[] = [
    {
      groupName: 'Execution Intelligence',
      items: [
        {
          tab: 'DASHBOARD',
          label: 'Executive Health',
          icon: 'grid_view',
          badgeText: 'KPI',
          badgeClass: 'font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold'
        },
        {
          tab: 'FIELD_INPUT',
          label: 'Field Input Center',
          icon: 'mic',
          badgeText: offlineQueue.length > 0 ? `${offlineQueue.length} Q` : 'TELEMETRY',
          badgeClass: offlineQueue.length > 0 
            ? 'font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold' 
            : 'font-mono text-[10px] text-slate-500'
        },
        {
          tab: 'REVIEW_CENTER',
          label: 'AI Review Center',
          icon: 'check_circle',
          badgeText: pendingMatchesCount > 0 ? `${pendingMatchesCount}` : 'DESK 1',
          badgeClass: 'px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold'
        }
      ]
    },
    {
      groupName: 'Schedule & Controls',
      items: [
        {
          tab: 'SCHEDULE_EXPLORER',
          label: 'WBS & Schedule Tree',
          icon: 'account_tree'
        },
        {
          tab: 'GANTT_4D',
          label: '4D Gantt Digital Twin',
          icon: 'waterfall_chart',
          badgeText: '4D-V',
          badgeClass: 'font-mono text-[10px] text-slate-400 font-medium'
        },
        {
          tab: 'CONFLICT_CENTER',
          label: 'Conflicts & Chronology',
          icon: 'warning',
          iconColor: 'text-rose-500',
          badgeText: unresolvedConflictsCount > 0 ? `${unresolvedConflictsCount}` : '2',
          badgeClass: 'px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono text-[10px] font-bold'
        }
      ]
    },
    {
      groupName: 'Analytics & Memory',
      items: [
        {
          tab: 'ACTIVITY_DNA',
          label: 'Activity DNA & Memory',
          icon: 'vital_signs'
        },
        {
          tab: 'WHAT_IF',
          label: 'What-If Simulator',
          icon: 'tune'
        },
        {
          tab: 'AUDIT_TRAIL',
          label: 'Audit & Provenance',
          icon: 'verified_user',
          iconColor: 'text-emerald-600',
          badgeText: 'SHA-256',
          badgeClass: 'font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded'
        },
        {
          tab: 'DEMO_WALKTHROUGH',
          label: '5-Min Judge Demo',
          icon: 'play_circle',
          iconColor: 'text-amber-500',
          badgeText: '11',
          badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold'
        }
      ]
    }
  ];

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col">
        {/* Workspace Brand Badge */}
        <div className="p-4 flex flex-col gap-1 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105 duration-200">
                <span className="material-symbols-outlined text-[19px]">precision_manufacturing</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm tracking-tight leading-snug uppercase">OIL / SITESYNC</span>
                <span className="font-mono text-[10px] text-slate-500 font-semibold tracking-wide">ENTERPRISE RUNTIME v4.8</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-semibold transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 radar-beacon"></span>
              P6 LIVE
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-500 font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-slate-400">hub</span>
              NODE-AS04 // SECURE
            </span>
            <span className="text-blue-700 font-semibold">ORACLE EPPM SYNCED</span>
          </div>
        </div>

        {/* Active Persona Strip */}
        <div className="px-3.5 py-2.5 bg-blue-50/40 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[16px] text-blue-700">shield_person</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-900 truncate">{roleMetadata.label}</span>
              <span className="text-[10px] text-slate-500 font-mono truncate">{roleMetadata.shortLabel} Clearance</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-white text-blue-800 border border-blue-200 font-mono text-[9px] font-bold shrink-0">
            {roleMetadata.badge}
          </span>
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col px-3 py-4 gap-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-1">
              <div className="px-2.5 py-1 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.groupName}
              </div>
              {group.items.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? 'border border-blue-200 bg-blue-50/90 text-blue-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:pl-3'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`material-symbols-outlined text-[18px] ${
                        isActive ? 'text-blue-700' : (item.iconColor || 'text-slate-400')
                      }`}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] truncate">{item.label}</span>
                    </div>
                    {item.badgeText && (
                      <span className={`shrink-0 ml-1.5 ${item.badgeClass}`}>
                        {item.badgeText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Security Badge & User Info */}
      <div className="flex flex-col border-t border-slate-200">
        <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-[11px]">
              {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PS'}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
                {currentUser?.name || 'Pranjal Saikia'}
              </span>
              <span className="font-mono text-[9px] text-slate-500">
                {currentUser?.employeeId || 'OIL-PLN-4421'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>

        <div className="p-3 bg-slate-50/50 flex flex-col gap-0.5">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
            <span>SECURITY LEVEL</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">IL-5 RESTRICTED</span>
          </div>
          <div className="font-mono text-[10px] text-slate-600 truncate mt-0.5">
            SEAL: OIL-EXP-994821
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (matches Stitch layout) */}
      <aside className="hidden md:flex md:w-72 bg-white border-r border-slate-200 fixed left-0 top-0 h-full z-50 flex-col justify-between overflow-y-auto shadow-xs">
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-white border-r border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-slate-800 text-xs font-mono uppercase">NAVIGATION WORKSPACE</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-900"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderNavContent()}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
