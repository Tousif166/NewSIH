import React, { useState } from 'react';
import { useApp, NavigationTab } from '../services/store';
import { UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const { 
    theme,
    toggleTheme,
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
    setIsMobileMenuOpen,
    openIndicSpeechStudio,
    openRoWGeofence,
    openEMbReconciler,
    openCvcAuditDossier,
    openDroneAuditor,
    openWhatsAppGateway,
    openFloodPredictor,
    openP6XerExport,
    openVoiceCommander,
    isCopilotOpen,
    setIsCopilotOpen,
    openPipeline3D,
    openBlockchainLedger,
    openDelayCascade,
    openIoTPredictive,
    openARInspection,
    openDroneFleet,
    openSafetyTraining,
    openGeofenceGIS,
    openComplianceReport,
    openFlowEnergy,
    activeDNAMode,
    activeIngestionMode,
    isDossierOpen,
    isDroneAuditorOpen,
    isWhatsAppGatewayOpen,
    isFloodPredictorOpen,
    isXerExportModalOpen
  } = useApp();

  const pendingMatchesCount = matches.filter(m => m.status === 'PENDING_REVIEW').length;
  const unresolvedConflictsCount = conflicts.filter(c => c.status === 'UNRESOLVED').length;

  interface NavItem {
    tab?: NavigationTab;
    label: string;
    icon: string;
    badgeText?: string;
    badgeClass?: string;
    iconColor?: string;
    isActive?: boolean;
    onClick?: () => void;
  }

  interface NavGroup {
    groupName: string;
    badge?: string;
    items: NavItem[];
  }

  // Role-Specific Navigation Definitions (strictly scoped to the active role clearance)
  const getNavGroupsForRole = (): NavGroup[] => {
    switch (currentRole) {
      // 1. SITE SUPERVISOR (Field Operations, Voice, AR, Safety)
      case 'supervisor':
        return [
          {
            groupName: '👷 Field Capture & Ingestion',
            badge: 'FIELD ROLE',
            items: [
              {
                tab: 'FIELD_INPUT',
                label: 'Field Input Center',
                icon: 'mic',
                iconColor: 'text-amber-600',
                badgeText: offlineQueue.length > 0 ? `${offlineQueue.length} Q` : 'VOICE',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300'
              },
              {
                label: 'Voice Field Commander',
                icon: 'keyboard_voice',
                iconColor: 'text-amber-600',
                badgeText: 'GLOVE [V]',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300',
                onClick: openVoiceCommander
              },
              {
                label: 'Indic Speech Studio',
                icon: 'translate',
                iconColor: 'text-amber-600',
                badgeText: 'BHASHA',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300',
                isActive: activeTab === 'FIELD_INPUT' && activeIngestionMode === 'INDIC_BHASHA',
                onClick: openIndicSpeechStudio
              },
              {
                label: 'WhatsApp Field Gateway',
                icon: 'chat',
                iconColor: 'text-emerald-600',
                badgeText: 'BOT v2',
                badgeClass: 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300',
                isActive: isWhatsAppGatewayOpen,
                onClick: openWhatsAppGateway
              }
            ]
          },
          {
            groupName: '🔍 Inspection & Safety Tools',
            badge: 'SITE OPS',
            items: [
              {
                tab: 'AR_INSPECTION',
                label: 'AR Site Inspection',
                icon: 'view_in_ar',
                iconColor: 'text-sky-600',
                badgeText: 'WEBXR',
                badgeClass: 'px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 font-mono text-[9px] font-bold border border-sky-300'
              },
              {
                tab: 'SAFETY_TRAINING',
                label: 'Gamified Safety Hub',
                icon: 'military_tech',
                iconColor: 'text-amber-600',
                badgeText: 'OISD-141',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300'
              },
              {
                label: 'Anti-Ghost RoW Geofence',
                icon: 'radar',
                iconColor: 'text-rose-600',
                badgeText: 'GPS RoW',
                badgeClass: 'px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[9px] font-bold border border-rose-300',
                isActive: activeTab === 'FIELD_INPUT' && activeIngestionMode !== 'INDIC_BHASHA',
                onClick: openRoWGeofence
              },
              {
                tab: 'PIPELINE_3D',
                label: '3D Pipeline Corridor',
                icon: 'deployed_code',
                iconColor: 'text-blue-600',
                badgeText: '132 KM',
                badgeClass: 'px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[9px] font-bold border border-blue-300'
              }
            ]
          }
        ];

      // 2. PROJECT PLANNER (P6, WBS, Schedule actuals, Drone DEM, Delay ripple)
      case 'planner':
        return [
          {
            groupName: '📊 Schedule Controls & Actuals',
            badge: 'PLANNER',
            items: [
              {
                tab: 'REVIEW_CENTER',
                label: 'AI Review Center',
                icon: 'check_circle',
                iconColor: 'text-blue-600',
                badgeText: pendingMatchesCount > 0 ? `${pendingMatchesCount} NEW` : 'SYNCED',
                badgeClass: 'px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[9px] font-bold border border-blue-300'
              },
              {
                tab: 'SCHEDULE_EXPLORER',
                label: 'WBS & Schedule Tree',
                icon: 'account_tree',
                iconColor: 'text-indigo-600',
                badgeText: 'P6 WBS',
                badgeClass: 'px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[9px] font-bold border border-indigo-300'
              },
              {
                tab: 'GANTT_4D',
                label: '4D Gantt Digital Twin',
                icon: 'waterfall_chart',
                iconColor: 'text-teal-600',
                badgeText: '4D TIME',
                badgeClass: 'px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[9px] font-bold border border-teal-300'
              },
              {
                tab: 'DELAY_CASCADE',
                label: 'AI Delay Cascade Ripple',
                icon: 'hub',
                iconColor: 'text-rose-600',
                badgeText: 'DAG CPM',
                badgeClass: 'px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-mono text-[9px] font-bold border border-rose-300'
              }
            ]
          },
          {
            groupName: '🛰️ Planning Intelligence',
            badge: 'RECON',
            items: [
              {
                label: 'Ask SiteSync (NL Copilot)',
                icon: 'smart_toy',
                iconColor: 'text-emerald-600',
                badgeText: 'HINDI+EN',
                badgeClass: 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300',
                isActive: isCopilotOpen,
                onClick: () => setIsCopilotOpen(!isCopilotOpen)
              },
              {
                tab: 'DRONE_FLEET',
                label: 'Drone Fleet & Orthophoto',
                icon: 'flight_takeoff',
                iconColor: 'text-emerald-600',
                badgeText: 'LIDAR DEM',
                badgeClass: 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300'
              },
              {
                label: 'Native Primavera P6 .XER',
                icon: 'download_for_offline',
                iconColor: 'text-orange-600',
                badgeText: '.XER V24',
                badgeClass: 'px-1.5 py-0.5 rounded bg-orange-100 text-orange-950 font-mono text-[9px] font-bold border border-orange-300',
                isActive: isXerExportModalOpen,
                onClick: openP6XerExport
              },
              {
                tab: 'CONFLICT_CENTER',
                label: 'Conflicts & Chronology',
                icon: 'warning',
                iconColor: 'text-rose-500',
                badgeText: unresolvedConflictsCount > 0 ? `${unresolvedConflictsCount}` : '0',
                badgeClass: 'px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono text-[9px] font-bold border border-rose-300'
              }
            ]
          }
        ];

      // 3. PROJECT MANAGER (Executive Dashboard, 3D Twin, What-If, Flow/Energy, Geofence)
      case 'project_manager':
        return [
          {
            groupName: '🏛️ Executive Directorate',
            badge: 'EXEC PM',
            items: [
              {
                tab: 'DASHBOARD',
                label: 'Executive Health',
                icon: 'grid_view',
                iconColor: 'text-blue-600',
                badgeText: 'S-CURVE',
                badgeClass: 'px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[9px] font-bold border border-blue-300'
              },
              {
                tab: 'PIPELINE_3D',
                label: '3D Pipeline Corridor',
                icon: 'view_in_ar',
                iconColor: 'text-blue-600',
                badgeText: 'THREE.JS',
                badgeClass: 'px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[9px] font-bold border border-blue-300'
              },
              {
                tab: 'CONFLICT_CENTER',
                label: 'Dispute Adjudication',
                icon: 'gavel',
                iconColor: 'text-amber-600',
                badgeText: 'CLAIMS',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold border border-amber-300'
              },
              {
                tab: 'WHAT_IF',
                label: 'What-If Risk Simulator',
                icon: 'tune',
                iconColor: 'text-purple-600',
                badgeText: 'P85 RISK',
                badgeClass: 'px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-[9px] font-bold border border-purple-300'
              }
            ]
          },
          {
            groupName: '⚡ Corridor Operations & Geopolitics',
            badge: 'CORRIDOR',
            items: [
              {
                tab: 'FLOW_ENERGY',
                label: 'Energy & Flow Digital Twin',
                icon: 'electric_bolt',
                iconColor: 'text-teal-600',
                badgeText: 'DRA TUNER',
                badgeClass: 'px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[9px] font-bold border border-teal-300'
              },
              {
                tab: 'GEOFENCE_GIS',
                label: 'GIS Threat Alert & CISF',
                icon: 'radar',
                iconColor: 'text-rose-600',
                badgeText: '30M ROW',
                badgeClass: 'px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-mono text-[9px] font-bold border border-rose-300'
              },
              {
                label: 'Brahmaputra Flood Radar',
                icon: 'tsunami',
                iconColor: 'text-cyan-600',
                badgeText: 'IMD RED',
                badgeClass: 'px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-900 font-mono text-[9px] font-bold border border-cyan-300',
                isActive: isFloodPredictorOpen,
                onClick: openFloodPredictor
              },
              {
                tab: 'DEMO_WALKTHROUGH',
                label: '5-Min Judge Demo',
                icon: 'play_circle',
                iconColor: 'text-amber-500',
                badgeText: 'TOUR',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold border border-amber-300'
              }
            ]
          }
        ];

      // 4. SYSTEM ADMIN (Blockchain, CVC Reports, e-MB, IoT Telemetry, Provenance)
      case 'admin':
        return [
          {
            groupName: '🛡️ Statutory Vigilance & Audit',
            badge: 'CVC / CAG',
            items: [
              {
                tab: 'BLOCKCHAIN_LEDGER',
                label: 'Blockchain Audit Ledger',
                icon: 'enhanced_encryption',
                iconColor: 'text-emerald-700',
                badgeText: 'SHA-256',
                badgeClass: 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300'
              },
              {
                tab: 'COMPLIANCE_REPORT',
                label: 'CVC / MoP&NG Report AI',
                icon: 'gavel',
                iconColor: 'text-yellow-600',
                badgeText: 'STATUTORY',
                badgeClass: 'px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-900 font-mono text-[9px] font-bold border border-yellow-300'
              },
              {
                label: 'e-Measurement Book (e-MB)',
                icon: 'receipt_long',
                iconColor: 'text-emerald-600',
                badgeText: '₹23.5L HOLD',
                badgeClass: 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300',
                isActive: activeTab === 'ACTIVITY_DNA' && activeDNAMode === 'EMB_BILLING',
                onClick: openEMbReconciler
              },
              {
                label: 'CVC / CAG Audit Dossier',
                icon: 'shield',
                iconColor: 'text-amber-700',
                badgeText: 'VIGILANCE',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-mono text-[9px] font-bold border border-amber-400',
                isActive: isDossierOpen,
                onClick: openCvcAuditDossier
              }
            ]
          },
          {
            groupName: '⚙️ Infrastructure & Integrity',
            badge: 'ROOT OPS',
            items: [
              {
                tab: 'IOT_TELEMETRY',
                label: 'IoT Predictive Maintenance',
                icon: 'sensors',
                iconColor: 'text-indigo-600',
                badgeText: 'SCADA 48H',
                badgeClass: 'px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[9px] font-bold border border-indigo-300'
              },
              {
                tab: 'AUDIT_TRAIL',
                label: 'Cryptographic Audit Trail',
                icon: 'verified_user',
                iconColor: 'text-emerald-600',
                badgeText: 'TAMPER',
                badgeClass: 'px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold border border-emerald-300'
              },
              {
                tab: 'ACTIVITY_DNA',
                label: 'Activity DNA & Memory',
                icon: 'vital_signs',
                iconColor: 'text-purple-600',
                badgeText: 'GENOME',
                badgeClass: 'px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-[9px] font-bold border border-purple-300'
              },
              {
                tab: 'DEMO_WALKTHROUGH',
                label: '5-Min System Walkthrough',
                icon: 'play_circle',
                iconColor: 'text-amber-500',
                badgeText: 'TOUR',
                badgeClass: 'px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold border border-amber-300'
              }
            ]
          }
        ];
    }
  };

  const navGroups = getNavGroupsForRole();

  const rolePills: { id: UserRole; label: string; icon: string; shortTag: string }[] = [
    { id: 'supervisor', label: 'Field Supervisor', icon: '👷', shortTag: 'Field' },
    { id: 'planner', label: 'Project Planner', icon: '📐', shortTag: 'Planner' },
    { id: 'project_manager', label: 'Project Manager', icon: '💼', shortTag: 'Manager' },
    { id: 'admin', label: 'System Admin', icon: '🛡️', shortTag: 'Admin' }
  ];

  const renderNavContent = () => (
    <div className="flex flex-col min-h-full justify-between">
      <div className="flex flex-col">
        {/* Workspace Brand Badge */}
        <div className="p-3.5 flex flex-col gap-1 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[19px]">precision_manufacturing</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 text-xs tracking-tight uppercase truncate">OIL / SITESYNC</span>
                <span className="font-mono text-[9px] text-slate-500 font-semibold truncate">132 KM TRUNKLINE RUNTIME</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[9px] font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                P6 LIVE
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-amber-400 font-mono text-[10px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                aria-label="Toggle dark and light mode"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-WAY SEGMENTED ROLE SWITCHER TABS */}
        <div className="px-3 pt-3 pb-1">
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>SELECT ACTIVE CLEARANCE:</span>
            <span className="text-blue-700 font-bold">{roleMetadata.shortLabel}</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/80 rounded-xl border border-slate-300/80 shadow-inner">
            {rolePills.map(p => {
              const isSelected = currentRole === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCurrentRole(p.id, true);
                    setIsCopilotOpen(false);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center min-w-0 ${
                    isSelected 
                      ? 'bg-white text-slate-900 font-bold shadow-sm ring-1 ring-slate-300' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                  title={`Switch to ${p.label}`}
                >
                  <span className="text-[12px] leading-none mb-0.5">{p.icon}</span>
                  <span className="text-[9px] font-mono truncate w-full leading-tight font-bold">{p.shortTag}</span>
                </button>
              );
            })}
          </div>

          {/* Current Role Clearance Sub-Banner */}
          <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-[10px] font-mono">
            <span className="text-blue-900 font-bold truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {roleMetadata.label}
            </span>
            <span className="text-[9px] font-semibold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
              {navGroups.reduce((acc, g) => acc + g.items.length, 0)} Role Modules
            </span>
          </div>
        </div>

        {/* Navigation Groups - Clean, Non-Overlapping Layout */}
        <nav className="flex flex-col px-3 py-2.5 gap-2.5">
          {navGroups.map((group, gIdx) => (
            <div 
              key={gIdx} 
              className="flex flex-col rounded-xl bg-slate-50/70 border border-slate-200/90 p-1.5 shadow-2xs"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-200/70">
                <span className="font-mono text-[9.5px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                  <span className="truncate">{group.groupName}</span>
                </span>
                {group.badge && (
                  <span className="font-mono text-[8.5px] text-slate-500 font-semibold bg-white px-1.5 py-0.2 rounded border border-slate-200/60 shrink-0">
                    {group.badge}
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = item.isActive !== undefined 
                    ? item.isActive 
                    : (item.tab ? activeTab === item.tab : false);

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                          if (item.label !== 'Ask SiteSync Copilot' && item.label !== 'Ask SiteSync (NL Copilot)') {
                            setIsCopilotOpen(false);
                          }
                        } else if (item.tab) {
                          setActiveTab(item.tab);
                          setIsCopilotOpen(false);
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer text-left min-w-0 ${
                        isActive
                          ? 'border border-blue-600/40 bg-white text-blue-900 font-bold shadow-xs ring-1 ring-blue-500/20'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-2xs'
                      }`}
                    >
                      {/* Left: Icon + Label (Flex-1 + Truncate to strictly prevent overlapping) */}
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-1.5">
                        <span className={`material-symbols-outlined text-[17px] shrink-0 ${
                          isActive ? 'text-blue-700 font-bold' : (item.iconColor || 'text-slate-400')
                        }`}>
                          {item.icon}
                        </span>
                        <span className="text-[11.5px] truncate min-w-0 font-medium leading-tight">
                          {item.label}
                        </span>
                      </div>

                      {/* Right: Badge (Truncated, Max-Width Constrained, Shrink-0) */}
                      {item.badgeText && (
                        <span className={`shrink-0 max-w-[68px] truncate text-center ${item.badgeClass}`}>
                          {item.badgeText}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Operator Info */}
      <div className="flex flex-col border-t border-slate-200 mt-2">
        <div className="p-2.5 bg-slate-50 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">
              {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PS'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10.5px] font-bold text-slate-800 truncate">
                {currentUser?.name || 'Pranjal Saikia'}
              </span>
              <span className="font-mono text-[8.5px] text-slate-500 truncate">
                {roleMetadata.label}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (w-72 / 288px) */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed top-0 left-0 bg-white border-r border-slate-200 shadow-sm z-30 overflow-y-auto">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="p-2 flex justify-end border-b border-slate-100">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-md"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            {renderNavContent()}
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};
