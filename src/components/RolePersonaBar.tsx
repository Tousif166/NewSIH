import React, { useState } from 'react';
import { useApp } from '../services/store';
import { UserRole } from '../types';
import { 
  HardHat, 
  Compass, 
  Briefcase, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const RolePersonaBar: React.FC = () => {
  const { currentRole, roleMetadata, setCurrentRole, activeTab, setActiveTab } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'supervisor':
        return <HardHat className="w-4 h-4 text-amber-700" />;
      case 'planner':
        return <Compass className="w-4 h-4 text-emerald-700" />;
      case 'project_manager':
        return <Briefcase className="w-4 h-4 text-blue-700" />;
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-purple-700" />;
    }
  };

  const rolesList: { id: UserRole; label: string; icon: React.ReactNode; color: string; border: string; bg: string }[] = [
    {
      id: 'planner',
      label: 'Project Planner',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-700" />,
      color: 'text-emerald-800',
      border: 'border-emerald-300',
      bg: 'bg-emerald-50'
    },
    {
      id: 'supervisor',
      label: 'Site Supervisor',
      icon: <HardHat className="w-3.5 h-3.5 text-amber-700" />,
      color: 'text-amber-900',
      border: 'border-amber-300',
      bg: 'bg-amber-50'
    },
    {
      id: 'project_manager',
      label: 'Project Manager',
      icon: <Briefcase className="w-3.5 h-3.5 text-blue-700" />,
      color: 'text-blue-800',
      border: 'border-blue-300',
      bg: 'bg-blue-50'
    },
    {
      id: 'admin',
      label: 'System Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />,
      color: 'text-purple-800',
      border: 'border-purple-300',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className={`border-b-2 transition-all duration-300 ${roleMetadata.bgColor} ${roleMetadata.borderColor}`}>
      <div className="max-w-[1700px] mx-auto px-3 sm:px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Active Persona Identifier */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-1.5 rounded-lg border-2 ${roleMetadata.borderColor} bg-white shadow-2xs shrink-0 flex items-center justify-center`}>
              {getRoleIcon(currentRole)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5 font-display">
                  <span>{roleMetadata.label}</span>
                </span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold border-2 ${roleMetadata.borderColor} ${roleMetadata.color} bg-white shadow-2xs`}>
                  {roleMetadata.badge}
                </span>
                <span className="text-[11px] text-slate-600 hidden md:inline truncate font-mono font-medium">
                  • {roleMetadata.authority}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Switcher & Shortcut */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
            {/* Quick Primary Tab Shortcut */}
            {activeTab !== roleMetadata.defaultTab && (
              <button
                onClick={() => setActiveTab(roleMetadata.defaultTab)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 ${roleMetadata.borderColor} bg-white hover:bg-slate-50 ${roleMetadata.color} flex items-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer`}
                title={`Open primary workspace for ${roleMetadata.label}`}
              >
                <span>Open {roleMetadata.shortLabel} Desk</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {/* Quick Role Switch Pills */}
            <div className="hidden sm:flex items-center gap-1 bg-white p-0.5 rounded-lg border-2 border-slate-300 shadow-2xs">
              {rolesList.map(r => {
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setCurrentRole(r.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? `${r.bg} ${r.color} font-bold shadow-2xs ring-1 ${r.border}`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span className="hidden lg:inline">{r.label.split(' ')[1] || r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Toggle Info Details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border-2 border-slate-300 transition-colors cursor-pointer"
              title="View Role Persona Permissions & Responsibilities"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Details: Permissions & Authority Breakdown */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t-2 border-slate-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs animate-fadeIn">
            {rolesList.map(r => {
              const isSelected = currentRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? `${r.bg} ${r.border} ring-1 ring-blue-500/30 shadow-xs` 
                      : 'bg-white border-slate-300 hover:border-slate-400 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
                      {r.icon}
                      <span>{r.label}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 font-mono font-bold border-2 border-emerald-400">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-2 mb-2 font-medium">
                    {r.id === 'supervisor' && 'Voice memos, geotagged camera proofs & offline queue. No approval authority.'}
                    {r.id === 'planner' && 'Semantic AI review, vocabulary learning & committing actuals to Primavera/MS Project.'}
                    {r.id === 'project_manager' && 'Executive health S-curves, critical path delay attribution & What-If Monte Carlo simulation.'}
                    {r.id === 'admin' && 'Cryptographic SHA-256 hash provenance, anti-tamper vigilance audit & activity DNA.'}
                  </p>
                  <div className="text-[10px] font-bold text-slate-800 flex items-center justify-between">
                    <span className={`flex items-center gap-1 ${r.color}`}>
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Active Persona</span>
                        </>
                      ) : (
                        <span>Click to Switch Persona</span>
                      )}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
