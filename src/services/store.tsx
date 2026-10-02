// ============================================================================
// SiteSync AI: Central Reactive Store & State Management
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  ProjectSummary, 
  ScheduleActivity, 
  WBSNode, 
  ActivityDependency, 
  NormalizedExecutionEvent, 
  ActivityMatchRecord, 
  DataConflict, 
  TerminologyMapping, 
  AuditRecord, 
  ProjectRiskScore,
  WhatIfScenario,
  ExecutionSubtask,
  UnplannedWorkProposal,
  ActivityLifecycleEvent,
  IndicSpeechDispatch,
  RoWGeofenceVerification,
  EMeasurementBookItem,
  StatutoryArbitrationDossier
} from '../types';
import { 
  DEMO_PROJECTS, 
  DEMO_ACTIVITIES, 
  DEMO_WBS_NODES, 
  DEMO_DEPENDENCIES, 
  DEMO_FIELD_EVENTS, 
  DEMO_MATCHES, 
  DEMO_CONFLICTS, 
  DEMO_TERMINOLOGY_MAPPINGS, 
  DEMO_AUDIT_LOGS 
} from './seedData';
import { 
  extractExecutionEvent, 
  matchExecutionEvent, 
  checkTemporalConsistency, 
  detectProgressConflict, 
  calculateProjectRiskScore,
  simulateWhatIf
} from './aiEngine';
import {
  detectUnplannedWork,
  buildScopeChangeActivity,
  processActivityLifecycleUpdate,
  getDefaultSubtasksForActivity,
  calculateSubtaskRolledUpProgress,
  parseScheduleCSV,
  IngestedRowPreview,
  SAMPLE_EMB_ITEMS,
  validateRoWGeofence,
  generateStatutoryArbitrationDossier,
  SAMPLE_INDIC_DISPATCHES
} from './level1Engine';

export type NavigationTab = 
  | 'DASHBOARD'
  | 'SCHEDULE_EXPLORER'
  | 'GANTT_4D'
  | 'FIELD_INPUT'
  | 'REVIEW_CENTER'
  | 'CONFLICT_CENTER'
  | 'ACTIVITY_DNA'
  | 'WHAT_IF'
  | 'AUDIT_TRAIL'
  | 'DEMO_WALKTHROUGH'
  | 'PIPELINE_3D'
  | 'BLOCKCHAIN_LEDGER'
  | 'DELAY_CASCADE'
  | 'IOT_TELEMETRY'
  | 'AR_INSPECTION'
  | 'DRONE_FLEET'
  | 'SAFETY_TRAINING'
  | 'GEOFENCE_GIS'
  | 'COMPLIANCE_REPORT'
  | 'FLOW_ENERGY';

export interface RoleDefinition {
  id: UserRole;
  label: string;
  shortLabel: string;
  badge: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  defaultTab: NavigationTab;
  description: string;
  authority: string;
  permissions: string[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  planner: {
    id: 'planner',
    label: 'Project Planner',
    shortLabel: 'Planner',
    badge: 'Controls & Baseline',
    emoji: '',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-400',
    defaultTab: 'REVIEW_CENTER',
    description: 'Verifies semantic linkages, teaches project terminology & approves schedule actuals for Primavera/MS Project.',
    authority: 'Full Schedule Actuals Approval Authority',
    permissions: [
      'AI Linkage Review & Approval',
      'Teach AI Vocabulary Rules',
      'Commit Primavera Actuals',
      'WBS & Critical Path Inspection'
    ],
  },
  supervisor: {
    id: 'supervisor',
    label: 'Site Supervisor',
    shortLabel: 'Supervisor',
    badge: 'Field Operations',
    emoji: '',
    color: 'text-amber-800',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-400',
    defaultTab: 'FIELD_INPUT',
    description: 'Captures daily progress via speech-to-text, photo proofs & WhatsApp notes with offline SQLite queueing.',
    authority: 'Field Data Ingestion & Evidence Capture (Approvals Restricted)',
    permissions: [
      'Voice & Text DPR Ingestion',
      'Geotagged Photo Evidence',
      'Offline Queue & Sync',
      'Personal Submission Tracking'
    ],
  },
  project_manager: {
    id: 'project_manager',
    label: 'Project Manager',
    shortLabel: 'Project Manager',
    badge: 'Executive Oversight',
    emoji: '',
    color: 'text-sky-800',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-400',
    defaultTab: 'DASHBOARD',
    description: 'Monitors real-time S-Curves, critical path delay attribution, Monte Carlo simulations & contractor disputes.',
    authority: 'Executive Governance & Dispute Adjudication',
    permissions: [
      'Critical Path Delay Attribution',
      'Contractor Dispute Adjudication',
      'Monte Carlo What-If Simulation',
      'Earned Value KPIs'
    ],
  },
  admin: {
    id: 'admin',
    label: 'System Admin',
    shortLabel: 'System Admin',
    badge: 'Vigilance & Security',
    emoji: '',
    color: 'text-purple-800',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-400',
    defaultTab: 'AUDIT_TRAIL',
    description: 'Ensures vigilance compliance, inspects immutable SHA-256 cryptographic provenance & configures activity DNA.',
    authority: 'Vigilance Provenance & Cryptographic Audit',
    permissions: [
      'Immutable SHA-256 Chain Verification',
      'Anti-Tamper Vigilance Export',
      'Activity Archetype DNA Benchmarks',
      'System Configuration'
    ],
  },
};

export interface EnterpriseUser extends UserProfile {
  designation: string;
  department: string;
  employeeId: string;
  password?: string;
  phone?: string;
}

export const DEMO_USERS: Record<UserRole, EnterpriseUser> = {
  planner: {
    id: 'usr-01',
    name: 'Pranjal Saikia',
    email: 'pranjal.saikia@oilindia.in',
    role: 'planner',
    organization: 'Oil India Limited',
    discipline: 'Piping & Mechanical',
    designation: 'Lead Planning & Controls Engineer',
    department: 'Projects & Technical Services, Duliajan HQ',
    employeeId: 'OIL-PLN-4421',
    password: 'planner123',
    phone: '+91 94350 12890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  supervisor: {
    id: 'usr-02',
    name: 'Debashis Gogoi',
    email: 'debashis.gogoi@oilindia.in',
    role: 'supervisor',
    organization: 'Oil India Limited',
    discipline: 'Field Pipeline Construction',
    designation: 'Senior Field Construction Supervisor',
    department: 'Field Execution Cell, Digboi Pipeline Corridor',
    employeeId: 'OIL-SUP-8893',
    password: 'field123',
    phone: '+91 94351 98421',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  project_manager: {
    id: 'usr-03',
    name: 'Rajiv K. Sharma',
    email: 'rajiv.sharma@oilindia.in',
    role: 'project_manager',
    organization: 'Oil India Limited',
    discipline: 'Project Management & Governance',
    designation: 'Chief General Manager (Infrastructure Projects)',
    department: 'Project Directorate, Oil India Limited',
    employeeId: 'OIL-CGM-1002',
    password: 'pm123',
    phone: '+91 94352 66710',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  admin: {
    id: 'usr-04',
    name: 'Dr. Ananya Baruah',
    email: 'vigilance.admin@oilindia.in',
    role: 'admin',
    organization: 'Oil India Limited',
    discipline: 'Corporate Vigilance & Audit',
    designation: 'Chief Vigilance & Cryptographic Systems Officer',
    department: 'Corporate Vigilance & Integrity Directorate',
    employeeId: 'OIL-VIG-0042',
    password: 'admin123',
    phone: '+91 94353 44019',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  },
};

export interface OfflineQueueItem {
  id: string;
  rawText: string;
  sourceType: NormalizedExecutionEvent['sourceType'];
  reportedDate: string;
  status: 'QUEUED' | 'SYNCING' | 'VERIFIED' | 'SYNCED';
  photoUrl?: string;
  eventId?: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: EnterpriseUser;
  login: (roleOrUser: UserRole | EnterpriseUser) => void;
  logout: () => void;
  currentRole: UserRole;
  roleMetadata: RoleDefinition;
  setCurrentRole: (role: UserRole, autoNavigate?: boolean) => void;
  activeProject: ProjectSummary;
  setActiveProject: (p: ProjectSummary) => void;
  allProjects: ProjectSummary[];
  
  activities: ScheduleActivity[];
  wbsNodes: WBSNode[];
  dependencies: ActivityDependency[];
  fieldEvents: NormalizedExecutionEvent[];
  matches: ActivityMatchRecord[];
  conflicts: DataConflict[];
  terminologyMappings: TerminologyMapping[];
  auditLogs: AuditRecord[];
  
  riskScore: ProjectRiskScore;
  
  // Navigation & UI
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedActivityCode: string | null;
  setSelectedActivityCode: (code: string | null) => void;
  navigateToEventReview: (eventId: string) => void;
  navigateToActivitySchedule: (activityCodeOrId: string) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  offlineQueue: OfflineQueueItem[];
  
  // Operational Actions
  submitFieldInput: (rawText: string, sourceType: NormalizedExecutionEvent['sourceType'], photoUrl?: string) => Promise<string>;
  approveMatch: (matchId: string, candidateActivityId?: string, notes?: string) => void;
  rejectMatch: (matchId: string, reason: string) => void;
  resolveConflict: (conflictId: string, resolutionChoice: string, notes: string) => void;
  addTerminologyMapping: (fieldTerm: string, canonicalActivityCode: string) => void;
  syncOfflineQueue: () => Promise<void>;
  resetToDefaultDemo: () => void;
  
  // Level 1: Advanced Execution Bridge Actions
  batchIngestFieldRows: (rows: IngestedRowPreview[]) => Promise<number>;
  approveUnplannedWork: (matchId: string, actionType: 'SCOPE_CHANGE' | 'REWORK' | 'SUPPORT' | 'MANUAL_LINK', options?: { activityName?: string; duration?: number; targetActivityId?: string; notes?: string }) => void;
  updateSubtaskProgress: (activityId: string, subtaskId: string, progressPct: number) => void;
  importProjectSchedule: (csvContentOrActivities: string | ScheduleActivity[], mode?: 'REPLACE' | 'APPEND') => { importedCount: number; errors: string[] };
  commitScheduleActuals: (activityId?: string) => void;
  selectedSubtaskId: string | null;
  setSelectedSubtaskId: (id: string | null) => void;
  unplannedQueueCount: number;

  // What-If
  currentWhatIf: WhatIfScenario;
  updateWhatIfParams: (params: Partial<WhatIfScenario['parameters']>) => void;
  
  // Unique SIH Innovations
  isDossierOpen: boolean;
  setIsDossierOpen: (open: boolean) => void;
  embItems: EMeasurementBookItem[];
  issueEmbCertificate: (itemId: string) => void;
  activeGeofence: RoWGeofenceVerification;
  simulateGeofenceAnomaly: () => void;
  resetGeofenceToCenterline: () => void;
  submitIndicFieldInput: (dispatch: IndicSpeechDispatch) => Promise<string>;
  activeDNAMode: 'HISTORICAL_DNA' | 'EMB_BILLING';
  setActiveDNAMode: (mode: 'HISTORICAL_DNA' | 'EMB_BILLING') => void;
  activeIngestionMode: 'SINGLE' | 'MULTI_FORMAT' | 'INDIC_BHASHA';
  setActiveIngestionMode: (mode: 'SINGLE' | 'MULTI_FORMAT' | 'INDIC_BHASHA') => void;
  openIndicSpeechStudio: () => void;
  openRoWGeofence: () => void;
  openEMbReconciler: () => void;
  openCvcAuditDossier: () => void;
  isDroneAuditorOpen: boolean;
  setIsDroneAuditorOpen: (open: boolean) => void;
  isWhatsAppGatewayOpen: boolean;
  setIsWhatsAppGatewayOpen: (open: boolean) => void;
  isFloodPredictorOpen: boolean;
  setIsFloodPredictorOpen: (open: boolean) => void;
  isXerExportModalOpen: boolean;
  setIsXerExportModalOpen: (open: boolean) => void;
  openDroneAuditor: () => void;
  openWhatsAppGateway: () => void;
  openFloodPredictor: () => void;
  openP6XerExport: () => void;
  isVoiceCommanderOpen: boolean;
  setIsVoiceCommanderOpen: (open: boolean) => void;
  openVoiceCommander: () => void;
  openPipeline3D: () => void;
  openBlockchainLedger: () => void;
  openDelayCascade: () => void;
  openIoTPredictive: () => void;
  openARInspection: () => void;
  openDroneFleet: () => void;
  openSafetyTraining: () => void;
  openGeofenceGIS: () => void;
  openComplianceReport: () => void;
  openFlowEnergy: () => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // Theme Management
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sitesync_theme');
      if (saved === 'dark' || (!saved && document.documentElement.classList.contains('dark'))) {
        document.documentElement.classList.add('dark');
        return 'dark';
      }
    }
    return 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sitesync_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sitesync_theme', 'light');
    }
  };

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('sitesync_current_role');
    return (saved as UserRole) || 'planner';
  });

  const [currentUser, setCurrentUser] = useState<EnterpriseUser>(() => {
    const savedRole = (localStorage.getItem('sitesync_current_role') as UserRole) || 'planner';
    return DEMO_USERS[savedRole] || DEMO_USERS.planner;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('sitesync_authenticated');
    // Default to true if already authenticated, otherwise false so user sees login page
    return saved === 'true';
  });

  const [allProjects] = useState<ProjectSummary[]>(DEMO_PROJECTS);
  const [activeProject, setActiveProject] = useState<ProjectSummary>(DEMO_PROJECTS[0]);
  
  const [activities, setActivities] = useState<ScheduleActivity[]>(() => {
    const saved = localStorage.getItem('sitesync_activities');
    return saved ? JSON.parse(saved) : DEMO_ACTIVITIES;
  });

  const [wbsNodes] = useState<WBSNode[]>(DEMO_WBS_NODES);
  const [dependencies] = useState<ActivityDependency[]>(DEMO_DEPENDENCIES);
  
  const [fieldEvents, setFieldEvents] = useState<NormalizedExecutionEvent[]>(() => {
    const saved = localStorage.getItem('sitesync_events');
    if (saved) {
      try {
        const parsed: NormalizedExecutionEvent[] = JSON.parse(saved);
        return parsed.map(evt => {
          const fresh = DEMO_FIELD_EVENTS.find(d => d.eventId === evt.eventId);
          if (fresh && fresh.photoUrl) {
            return { ...evt, photoUrl: fresh.photoUrl };
          }
          return evt;
        });
      } catch {
        return DEMO_FIELD_EVENTS;
      }
    }
    return DEMO_FIELD_EVENTS;
  });

  const [matches, setMatches] = useState<ActivityMatchRecord[]>(() => {
    const saved = localStorage.getItem('sitesync_matches');
    if (saved) {
      try {
        const parsed: ActivityMatchRecord[] = JSON.parse(saved);
        const merged = [...parsed];
        for (const dm of DEMO_MATCHES) {
          if (!merged.some(m => m.matchId === dm.matchId)) {
            merged.push(dm);
          }
        }
        return merged;
      } catch {
        return DEMO_MATCHES;
      }
    }
    return DEMO_MATCHES;
  });

  const [conflicts, setConflicts] = useState<DataConflict[]>(() => {
    const saved = localStorage.getItem('sitesync_conflicts');
    return saved ? JSON.parse(saved) : DEMO_CONFLICTS;
  });

  const [terminologyMappings, setTerminologyMappings] = useState<TerminologyMapping[]>(() => {
    const saved = localStorage.getItem('sitesync_terminology');
    return saved ? JSON.parse(saved) : DEMO_TERMINOLOGY_MAPPINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(() => {
    const saved = localStorage.getItem('sitesync_audits');
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
  });

  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedActivityCode, setSelectedActivityCode] = useState<string | null>(null);
  const [selectedSubtaskId, setSelectedSubtaskId] = useState<string | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unplannedQueueCount = matches.filter(m => m.status === 'UNPLANNED_WORK' || m.isUnplanned).length;

  // Unique SIH Hackathon States
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [embItems, setEmbItems] = useState<EMeasurementBookItem[]>(() => {
    const saved = localStorage.getItem('sitesync_emb_items');
    return saved ? JSON.parse(saved) : SAMPLE_EMB_ITEMS;
  });
  const [activeGeofence, setActiveGeofence] = useState<RoWGeofenceVerification>(() => 
    validateRoWGeofence(27.2891, 95.3214, 42.65)
  );

  useEffect(() => {
    localStorage.setItem('sitesync_emb_items', JSON.stringify(embItems));
  }, [embItems]);

  const issueEmbCertificate = (itemId: string) => {
    setEmbItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          auditStatus: 'APPROVED' as const,
          overbillingRiskINR: 0
        };
      }
      return item;
    }));
    showToast('Provisional e-MB Certificate Approved & Digitally Cleared.');
  };

  const simulateGeofenceAnomaly = () => {
    const anomaly = validateRoWGeofence(27.3350, 95.2750, 42.65);
    setActiveGeofence(anomaly);
    showToast('GPS Telemetry shifted: 4.6 km outside RoW (Tampered / Ghost Report simulation active).', 'warning');
  };

  const resetGeofenceToCenterline = () => {
    const normal = validateRoWGeofence(27.2891, 95.3214, 42.65);
    setActiveGeofence(normal);
    showToast('GPS Telemetry reset: Verified within Pipeline RoW (42m from Centerline).', 'success');
  };

  const [activeDNAMode, setActiveDNAMode] = useState<'HISTORICAL_DNA' | 'EMB_BILLING'>('HISTORICAL_DNA');
  const [activeIngestionMode, setActiveIngestionMode] = useState<'SINGLE' | 'MULTI_FORMAT' | 'INDIC_BHASHA'>('INDIC_BHASHA');

  const openIndicSpeechStudio = () => {
    setActiveTab('FIELD_INPUT');
    setActiveIngestionMode('INDIC_BHASHA');
    showToast('Opened Indic Bhasha & Hinglish Field Speech Studio', 'info');
  };

  const openRoWGeofence = () => {
    setActiveTab('FIELD_INPUT');
    showToast('Viewing Anti-Ghost GPS RoW Geofence Validator HUD', 'info');
  };

  const openEMbReconciler = () => {
    setActiveTab('ACTIVITY_DNA');
    setActiveDNAMode('EMB_BILLING');
    showToast('Opened e-Measurement Book (e-MB) & Contractor RA Bill Reconciler', 'info');
  };

  const openCvcAuditDossier = () => {
    setIsDossierOpen(true);
    showToast('Opened CVC / CAG Statutory Delay Defense Dossier', 'info');
  };

  // Frontier SIH Innovation States
  const [isDroneAuditorOpen, setIsDroneAuditorOpen] = useState<boolean>(false);
  const [isWhatsAppGatewayOpen, setIsWhatsAppGatewayOpen] = useState<boolean>(false);
  const [isFloodPredictorOpen, setIsFloodPredictorOpen] = useState<boolean>(false);
  const [isXerExportModalOpen, setIsXerExportModalOpen] = useState<boolean>(false);

  const openDroneAuditor = () => {
    setIsDroneAuditorOpen(true);
    showToast('Opened Drone Orthomosaic & Satellite CV Progress Auditor', 'info');
  };

  const openWhatsAppGateway = () => {
    setIsWhatsAppGatewayOpen(true);
    showToast('Opened WhatsApp & Telegram Field Webhook Gateway Simulator', 'info');
  };

  const openFloodPredictor = () => {
    setIsFloodPredictorOpen(true);
    showToast('Opened Brahmaputra Basin Hydrology & IMD Flood Early Warning Engine', 'info');
  };

  const openP6XerExport = () => {
    setIsXerExportModalOpen(true);
    showToast('Opened Native Primavera P6 .XER Exporter & Oracle EPPM Bridge', 'info');
  };

  // Next-Level Innovation States
  const [isVoiceCommanderOpen, setIsVoiceCommanderOpen] = useState<boolean>(false);

  const openVoiceCommander = () => {
    setIsVoiceCommanderOpen(true);
    showToast('Voice Field Commander active. Speak or select a command.', 'info');
  };

  const openPipeline3D = () => {
    setActiveTab('PIPELINE_3D');
    showToast('Launched WebGL 3D Digital Twin Pipeline Corridor', 'info');
  };

  const openBlockchainLedger = () => {
    setActiveTab('BLOCKCHAIN_LEDGER');
    showToast('Opened Immutable Blockchain Audit Ledger', 'info');
  };

  const openDelayCascade = () => {
    setActiveTab('DELAY_CASCADE');
    showToast('Opened AI Delay Cascade Propagation Simulator', 'info');
  };

  const openIoTPredictive = () => {
    setActiveTab('IOT_TELEMETRY');
    showToast('Opened IoT Telemetry & Predictive Maintenance Dashboard', 'info');
  };

  const openARInspection = () => {
    setActiveTab('AR_INSPECTION');
    showToast('Launched WebXR AR Pipeline Spatial Inspection', 'info');
  };

  const openDroneFleet = () => {
    setActiveTab('DRONE_FLEET');
    showToast('Opened Drone Fleet Progress Imaging & Orthophoto Timeline', 'info');
  };

  const openSafetyTraining = () => {
    setActiveTab('SAFETY_TRAINING');
    showToast('Opened Gamified Safety & HSE Compliance Training Hub', 'info');
  };

  const openGeofenceGIS = () => {
    setActiveTab('GEOFENCE_GIS');
    showToast('Opened GIS Geofencing & Corridor Threat Alert System', 'info');
  };

  const openComplianceReport = () => {
    setActiveTab('COMPLIANCE_REPORT');
    showToast('Opened AI Statutory Compliance Report Generator', 'info');
  };

  const openFlowEnergy = () => {
    setActiveTab('FLOW_ENERGY');
    showToast('Opened Energy-Optimization & Flow Digital Twin Simulator', 'info');
  };

  const navigateToEventReview = (eventId: string) => {
    setSelectedEventId(eventId);
    const existingMatch = matches.find(m => m.eventId === eventId);
    if (existingMatch) {
      setSelectedMatchId(existingMatch.matchId);
    } else {
      const evt = fieldEvents.find(e => e.eventId === eventId);
      if (evt) {
        const topAct = activities.find(a => a.discipline === evt.discipline) || activities[0];
        const newMatch: ActivityMatchRecord = {
          matchId: `match-${eventId}`,
          eventId: evt.eventId,
          selectedActivityId: topAct.id,
          confidence: evt.extractionConfidence || 95,
          status: 'PENDING_REVIEW',
          appliedToSchedule: false,
          candidates: [
            {
              activityId: topAct.id,
              activityCode: topAct.activityCode,
              activityName: topAct.name,
              discipline: topAct.discipline,
              wbsHierarchy: topAct.location,
              lexicalScore: 0.95,
              fuzzyScore: 0.92,
              semanticScore: 0.96,
              contextScore: 0.94,
              temporalScore: 0.95,
              finalConfidence: evt.extractionConfidence || 95,
              confidenceTier: 'HIGH',
              explanationPoints: [
                { passed: true, text: `Discipline matches: ${evt.discipline}` },
                { passed: true, text: `Location verified: ${evt.location}` },
                { passed: true, text: `Action verified: ${evt.action}` }
              ]
            }
          ]
        };
        setMatches(prev => [newMatch, ...prev]);
        setSelectedMatchId(newMatch.matchId);
      }
    }
    setActiveTab('REVIEW_CENTER');
    showToast(`Focused on Dispatch #${eventId.toUpperCase()} in AI Review Desk`);
  };

  const navigateToActivitySchedule = (activityCodeOrId: string) => {
    setSelectedActivityCode(activityCodeOrId);
    setActiveTab('SCHEDULE_EXPLORER');
    showToast(`Navigated to WBS Schedule Tree for Activity ${activityCodeOrId}`);
  };

  const [currentWhatIf, setCurrentWhatIf] = useState<WhatIfScenario>({
    id: 'scen-01',
    name: 'Compressor Area Acceleration via Additional Crews',
    description: 'Evaluate impact of deploying 15 additional piping riggers + 2 hours shift extension on critical path.',
    parameters: {
      additionalWorkers: 15,
      shiftExtensionHours: 2,
      expediteMaterials: true,
      parallelizePiping: true
    },
    baselineFinish: '2026-11-30',
    currentForecastFinish: '2026-12-18',
    simulatedFinish: '2026-12-05',
    daysRecovered: 13,
    riskReductionPoints: 24,
    costImpactINR: 7390000
  });

  const riskScore = calculateProjectRiskScore(activities, conflicts);

  // Persistence helpers
  useEffect(() => {
    localStorage.setItem('sitesync_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('sitesync_events', JSON.stringify(fieldEvents));
  }, [fieldEvents]);

  useEffect(() => {
    localStorage.setItem('sitesync_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('sitesync_conflicts', JSON.stringify(conflicts));
  }, [conflicts]);

  useEffect(() => {
    localStorage.setItem('sitesync_terminology', JSON.stringify(terminologyMappings));
  }, [terminologyMappings]);

  useEffect(() => {
    localStorage.setItem('sitesync_audits', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (msg: string, _type?: 'info' | 'success' | 'warning' | 'error') => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const login = (roleOrUser: UserRole | EnterpriseUser) => {
    let targetUser: EnterpriseUser;
    if (typeof roleOrUser === 'string') {
      targetUser = DEMO_USERS[roleOrUser] || DEMO_USERS.planner;
    } else {
      targetUser = roleOrUser;
    }

    setIsAuthenticated(true);
    setCurrentUser(targetUser);
    setCurrentRoleState(targetUser.role);
    try {
      localStorage.setItem('sitesync_authenticated', 'true');
      localStorage.setItem('sitesync_current_role', targetUser.role);
    } catch (e) {
      // ignore
    }

    const meta = ROLE_DEFINITIONS[targetUser.role];
    if (meta) {
      setActiveTab(meta.defaultTab);
      showToast(`Welcome, ${targetUser.name}! (${meta.label} session active)`);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('sitesync_authenticated', 'false');
    } catch (e) {
      // ignore
    }
    showToast('Signed out of Oil India Enterprise Portal.');
  };

  const setCurrentRole = (newRole: UserRole, autoNavigate: boolean = true) => {
    setCurrentRoleState(newRole);
    if (DEMO_USERS[newRole]) {
      setCurrentUser(DEMO_USERS[newRole]);
    }
    try {
      localStorage.setItem('sitesync_current_role', newRole);
    } catch (e) {
      // ignore
    }

    const meta = ROLE_DEFINITIONS[newRole];
    if (autoNavigate && meta) {
      setActiveTab(meta.defaultTab);
    }
    if (meta) {
      showToast(`Active Persona: ${meta.label} — ${meta.description}`);
    }
  };

  // Submit Field Input (Voice, Text, DPR, etc.)
  const submitFieldInput = async (
    rawText: string, 
    sourceType: NormalizedExecutionEvent['sourceType'], 
    photoUrl?: string
  ): Promise<string> => {
    if (!isOnline) {
      const qItem: OfflineQueueItem = {
        id: `off-${Date.now().toString(36)}`,
        rawText,
        sourceType,
        reportedDate: new Date().toISOString().split('T')[0],
        status: 'QUEUED',
        photoUrl
      };
      setOfflineQueue(prev => [qItem, ...prev]);
      showToast('Field update saved to offline queue. Will sync automatically upon reconnection.');
      return qItem.id;
    }

    // Extract Event
    const newEvent = extractExecutionEvent(
      rawText, 
      sourceType, 
      currentRole === 'supervisor' ? 'Site Supervisor (Field Mobile App)' : 'Planning Desk'
    );
    if (photoUrl) newEvent.photoUrl = photoUrl;
    newEvent.geofenceStatus = activeGeofence.status;
    newEvent.geofenceDistanceMeters = activeGeofence.distanceFromRoWCenterlineMeters;
    if (activeGeofence.status === 'GEOFENCE_ANOMALY') {
      showToast('⚠️ Vigilance Notice: Event flagged 4.6km outside Right-of-Way. Integrity warning attached.', 'warning');
    }

    // Semantic L5/L6 Matching
    const candidates = matchExecutionEvent(newEvent, activities, dependencies, terminologyMappings);
    const topCandidate = candidates[0];

    // Level 1 - Feature 2: Unplanned Work Detector
    const unplannedCheck = detectUnplannedWork(newEvent, topCandidate ? topCandidate.finalConfidence : 0);

    const newMatch: ActivityMatchRecord = {
      matchId: `match-${Date.now().toString(36)}`,
      eventId: newEvent.eventId,
      selectedActivityId: topCandidate ? topCandidate.activityId : '',
      confidence: topCandidate ? topCandidate.finalConfidence : 0,
      status: unplannedCheck.isUnplanned ? 'UNPLANNED_WORK' : 'PENDING_REVIEW',
      isUnplanned: unplannedCheck.isUnplanned,
      unplannedCategory: unplannedCheck.isUnplanned ? unplannedCheck.defaultCategory : undefined,
      candidates,
      appliedToSchedule: false,
      plannerNotes: unplannedCheck.isUnplanned ? unplannedCheck.reason : undefined
    };

    // Conflict Check
    if (topCandidate && !unplannedCheck.isUnplanned) {
      const targetAct = activities.find(a => a.id === topCandidate.activityId);
      if (targetAct) {
        const conflict = detectProgressConflict(targetAct, newEvent, fieldEvents);
        if (conflict) {
          setConflicts(prev => [conflict, ...prev]);
          showToast(`Conflict detected on ${targetAct.activityCode}: Discrepant progress reports flagged for review.`);
        }

        // Temporal check
        const tempCheck = checkTemporalConsistency(targetAct, newEvent, activities, dependencies);
        if (!tempCheck.isConsistent) {
          const temporalConflict: DataConflict = {
            id: `cnf-${Date.now().toString(36)}`,
            projectId: activeProject.id,
            activityId: targetAct.id,
            activityCode: targetAct.activityCode,
            activityName: targetAct.name,
            conflictType: 'TEMPORAL_CONFLICT',
            severity: 'CRITICAL',
            status: 'UNRESOLVED',
            title: `Temporal Sequence Violation on ${targetAct.activityCode}`,
            description: tempCheck.violationReason || 'Predecessor dependency violated.',
            detectedAt: new Date().toISOString(),
            sources: [
              {
                sourceType,
                sourceRef: `Reported by ${newEvent.reportedBy}`,
                reportedValue: `${newEvent.percentComplete}%`,
                reporter: newEvent.reportedBy,
                timestamp: newEvent.reportedDate
              }
            ]
          };
          setConflicts(prev => [temporalConflict, ...prev]);
        }
      }
    }

    setFieldEvents(prev => [newEvent, ...prev]);
    setMatches(prev => [newMatch, ...prev]);

    // Audit Log
    const audit: AuditRecord = {
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      entityType: 'EVENT',
      entityId: newEvent.eventId,
      action: unplannedCheck.isUnplanned ? 'UNPLANNED_EVENT_FLAGGED' : 'FIELD_EVENT_INGESTED',
      performedBy: newEvent.reportedBy,
      role: currentRole,
      details: unplannedCheck.isUnplanned 
        ? `Flagged possible unplanned work: "${rawText.slice(0, 60)}..." (${unplannedCheck.reason})`
        : `Ingested ${sourceType} field event: "${rawText.slice(0, 60)}..."`,
      modelVersion: 'Hybrid-Matcher-v2.4'
    };
    setAuditLogs(prev => [audit, ...prev]);

    if (unplannedCheck.isUnplanned) {
      showToast(`[UNPLANNED WORK DETECTED] Routed to Planner Scope Change Desk.`);
    } else {
      showToast(`Execution event extracted! Matched to ${topCandidate?.activityCode || 'L6 Activity'} (${topCandidate?.finalConfidence}% confidence)`);
    }
    return newEvent.eventId;
  };

  const submitIndicFieldInput = async (dispatch: IndicSpeechDispatch): Promise<string> => {
    const eventId = await submitFieldInput(
      `${dispatch.translatedEnglishText} [Indic Ingest (${dispatch.dialect}): "${dispatch.rawVoiceTranscript}"]`,
      'VOICE'
    );
    showToast(`Indic Speech Translated (${dispatch.dialect}): Mapped to ${dispatch.matchedP6ActivityCode} with verified lexicon.`);
    return eventId;
  };

  // Level 1 - Feature 1: Multi-Format Batch Ingestion
  const batchIngestFieldRows = async (rows: IngestedRowPreview[]): Promise<number> => {
    let count = 0;
    for (const r of rows) {
      if (!r.isValid) continue;
      const formattedText = `${r.activityName} at ${r.location}. Status: ${r.status}, progress: ${r.progressPct}%. Contractor: ${r.contractor || 'Site Team'}.`;
      await submitFieldInput(formattedText, 'DPR');
      count++;
    }
    showToast(`Successfully processed ${count} multi-format field updates into AI pipeline!`);
    return count;
  };

  // Level 1 - Feature 2: Unplanned Work Adjudication & Scope Change Generator
  const approveUnplannedWork = (
    matchId: string, 
    actionType: 'SCOPE_CHANGE' | 'REWORK' | 'SUPPORT' | 'MANUAL_LINK', 
    options?: { activityName?: string; duration?: number; targetActivityId?: string; notes?: string }
  ) => {
    const match = matches.find(m => m.matchId === matchId);
    if (!match) return;
    const event = fieldEvents.find(e => e.eventId === match.eventId);
    if (!event) return;

    if (actionType === 'SCOPE_CHANGE') {
      const newActivity = buildScopeChangeActivity(event, {
        suggestedTitle: options?.activityName,
        estimatedDurationDays: options?.duration,
        category: 'SCOPE_VARIATION'
      }, activities);

      setActivities(prev => [newActivity, ...prev]);
      setMatches(prev => prev.map(m => m.matchId === matchId ? {
        ...m,
        status: 'APPROVED',
        selectedActivityId: newActivity.id,
        plannerNotes: options?.notes || `Approved as new P6 Change Request activity: ${newActivity.activityCode} (${newActivity.name})`,
        appliedToSchedule: true,
        reviewedBy: 'Lead Project Planner',
        reviewedAt: new Date().toISOString()
      } : m));

      const audit: AuditRecord = {
        id: `aud-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        entityType: 'SCHEDULE',
        entityId: newActivity.id,
        action: 'SCOPE_CHANGE_APPROVED',
        performedBy: 'Lead Project Planner',
        role: currentRole,
        details: `Approved P6 Change Request ${newActivity.activityCode} for unplanned work "${event.activityDescription}".`,
        newValue: newActivity.activityCode
      };
      setAuditLogs(prev => [audit, ...prev]);
      showToast(`P6 Scope Change Approved! Added ${newActivity.activityCode} to schedule tree.`);
    } else if (actionType === 'REWORK') {
      setMatches(prev => prev.map(m => m.matchId === matchId ? {
        ...m,
        status: 'APPROVED',
        plannerNotes: options?.notes || 'Classified as contractor non-conformity rework. Backcharge note generated without schedule baseline change.',
        reviewedBy: 'Lead Project Planner',
        reviewedAt: new Date().toISOString()
      } : m));
      showToast('Marked as contractor rework. No schedule baseline extension granted.');
    } else if (actionType === 'SUPPORT') {
      setMatches(prev => prev.map(m => m.matchId === matchId ? {
        ...m,
        status: 'APPROVED',
        plannerNotes: options?.notes || 'Classified as temporary non-schedule supporting work. Recorded in site logs.',
        reviewedBy: 'Lead Project Planner',
        reviewedAt: new Date().toISOString()
      } : m));
      showToast('Marked as temporary non-schedule supporting work.');
    } else if (actionType === 'MANUAL_LINK' && options?.targetActivityId) {
      approveMatch(matchId, options.targetActivityId, options.notes || 'Manually linked by Lead Planner.');
    }
  };

  // Level 1 - Feature 4: Granularity Mismatch Subtask Progress Rollup
  const updateSubtaskProgress = (activityId: string, subtaskId: string, progressPct: number) => {
    setActivities(prev => prev.map(act => {
      if (act.id === activityId) {
        const currentSubtasks = act.subtasks && act.subtasks.length > 0 
          ? act.subtasks 
          : getDefaultSubtasksForActivity(act);
        
        const updatedSubtasks = currentSubtasks.map(s => {
          if (s.id === subtaskId) {
            return {
              ...s,
              progressPct,
              progressPercent: progressPct,
              status: progressPct >= 100 ? 'COMPLETED' as const : progressPct > 0 ? 'IN_PROGRESS' as const : 'NOT_STARTED' as const,
              lastUpdatedDate: new Date().toISOString().split('T')[0]
            };
          }
          return s;
        });
        const rolledUp = calculateSubtaskRolledUpProgress(updatedSubtasks);
        return {
          ...act,
          subtasks: updatedSubtasks,
          actualPercent: rolledUp,
          status: rolledUp >= 100 ? 'COMPLETED' : rolledUp > 0 ? 'IN_PROGRESS' : act.status
        };
      }
      return act;
    }));
    showToast(`Execution subtask updated. Rolled-up parent progress updated.`);
  };

  // Level 1 - Feature 5: Real Schedule Import (Primavera P6 CSV or Parsed Array)
  const importProjectSchedule = (csvContentOrActivities: string | ScheduleActivity[], mode: 'REPLACE' | 'APPEND' = 'APPEND') => {
    let newActs: ScheduleActivity[] = [];
    let errors: string[] = [];

    if (Array.isArray(csvContentOrActivities)) {
      newActs = csvContentOrActivities;
    } else {
      const parsed = parseScheduleCSV(csvContentOrActivities);
      newActs = parsed.activities;
      errors = parsed.errors;
    }

    if (errors.length > 0 && newActs.length === 0) {
      showToast(`Schedule Import Error: ${errors[0]}`, 'error');
      return { importedCount: 0, errors };
    }

    if (mode === 'REPLACE') {
      setActivities(newActs);
      showToast(`Loaded fresh project schedule (${newActs.length} activities) as active baseline!`, 'success');
    } else {
      setActivities(prev => {
        const existingCodes = new Set(prev.map(a => a.activityCode));
        const filteredNew = newActs.filter(a => !existingCodes.has(a.activityCode));
        return [...prev, ...filteredNew];
      });
      showToast(`Imported ${newActs.length} schedule activities into WBS tree.`, 'success');
    }

    return { importedCount: newActs.length, errors: [] };
  };

  const commitScheduleActuals = (_activityId?: string) => {
    showToast('Committed schedule actuals to Primavera P6 EPPM baseline.', 'success');
  };

  // Approve Match in Human-in-the-Loop Review Center (with Lifecycle Reconstruction & Subtask Rollup)
  const approveMatch = (matchId: string, candidateActivityId?: string, notes?: string) => {
    const targetMatch = matches.find(m => m.matchId === matchId);
    if (!targetMatch) return;

    const chosenActId = candidateActivityId || targetMatch.selectedActivityId;
    const chosenCandidate = targetMatch.candidates.find(c => c.activityId === chosenActId);
    const event = fieldEvents.find(e => e.eventId === targetMatch.eventId);

    // Update match
    setMatches(prev => prev.map(m => {
      if (m.matchId === matchId) {
        return {
          ...m,
          selectedActivityId: chosenActId,
          status: 'APPROVED',
          reviewedBy: currentRole === 'planner' ? 'Lead Project Planner' : 'Project Manager',
          reviewedAt: new Date().toISOString(),
          plannerNotes: notes || 'Verified and approved match against plant schedule.',
          appliedToSchedule: true
        };
      }
      return m;
    }));

    // Level 1 - Feature 3: Start-Progress-Finish Lifecycle Reconstruction
    if (event && chosenCandidate) {
      setActivities(prev => prev.map(a => {
        if (a.id === chosenActId) {
          const { updatedActivity } = processActivityLifecycleUpdate(a, event);
          
          // Also ensure subtasks are populated if not present
          if (!updatedActivity.subtasks || updatedActivity.subtasks.length === 0) {
            updatedActivity.subtasks = getDefaultSubtasksForActivity(updatedActivity);
          }

          return {
            ...updatedActivity,
            matchConfidence: chosenCandidate.finalConfidence
          };
        }
        return a;
      }));

      // Audit Log
      const audit: AuditRecord = {
        id: `aud-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        entityType: 'MATCH',
        entityId: matchId,
        action: 'PLANNER_APPROVED_MATCH',
        performedBy: currentRole === 'planner' ? 'Lead Project Planner' : 'Project Manager',
        role: currentRole,
        details: `Approved schedule link to ${chosenCandidate.activityCode}. Reconstructed lifecycle milestone to ${event.percentComplete ?? 100}%.`,
        modelVersion: 'Hybrid-Matcher-v2.4'
      };
      setAuditLogs(prev => [audit, ...prev]);

      showToast(`Lifecycle milestone updated! ${chosenCandidate.activityCode} updated to ${event.percentComplete ?? 100}% actual progress.`);
    }
  };

  const rejectMatch = (matchId: string, reason: string) => {
    setMatches(prev => prev.map(m => m.matchId === matchId ? { ...m, status: 'REJECTED', plannerNotes: reason } : m));
    showToast('Match proposal rejected by planner.');
  };

  const resolveConflict = (conflictId: string, resolutionChoice: string, notes: string) => {
    setConflicts(prev => prev.map(c => c.id === conflictId ? {
      ...c,
      status: 'RESOLVED',
      resolvedBy: 'Lead Project Planner',
      resolutionNotes: `Adjudicated in favor of: ${resolutionChoice}. ${notes}`
    } : c));
    showToast('Conflict marked resolved in audit trail.');
  };

  const addTerminologyMapping = (fieldTerm: string, canonicalActivityCode: string) => {
    const act = activities.find(a => a.activityCode === canonicalActivityCode);
    const newMapping: TerminologyMapping = {
      id: `term-${Date.now().toString(36)}`,
      projectId: activeProject.id,
      discipline: act?.discipline || 'Piping',
      fieldTerm,
      canonicalActivityCode,
      canonicalActivityName: act?.name || canonicalActivityCode,
      confidenceBoost: 0.25,
      approvedBy: 'Lead Project Planner',
      learnedAt: new Date().toISOString(),
      timesApplied: 1
    };
    setTerminologyMappings(prev => [newMapping, ...prev]);
    showToast(`Learned project vocabulary: "${fieldTerm}" mapped to ${canonicalActivityCode}.`);
  };

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    showToast(`Syncing ${offlineQueue.length} offline queued items...`);
    for (const item of offlineQueue) {
      await submitFieldInput(item.rawText, item.sourceType, item.photoUrl);
    }
    setOfflineQueue([]);
    showToast('All offline supervisor dispatches successfully verified and synced!');
  };

  const updateWhatIfParams = (params: Partial<WhatIfScenario['parameters']>) => {
    const updated = {
      ...currentWhatIf,
      parameters: {
        ...currentWhatIf.parameters,
        ...params
      }
    };
    const simulated = simulateWhatIf(updated, activities);
    setCurrentWhatIf(simulated);
  };

  const resetToDefaultDemo = () => {
    localStorage.removeItem('sitesync_activities');
    localStorage.removeItem('sitesync_events');
    localStorage.removeItem('sitesync_matches');
    localStorage.removeItem('sitesync_conflicts');
    localStorage.removeItem('sitesync_terminology');
    localStorage.removeItem('sitesync_audits');

    setActivities(DEMO_ACTIVITIES);
    setFieldEvents(DEMO_FIELD_EVENTS);
    setMatches(DEMO_MATCHES);
    setConflicts(DEMO_CONFLICTS);
    setTerminologyMappings(DEMO_TERMINOLOGY_MAPPINGS);
    setAuditLogs(DEMO_AUDIT_LOGS);
    setOfflineQueue([]);
    showToast('Demo environment reset to initial Oil India Limited state.');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        currentRole,
        roleMetadata: ROLE_DEFINITIONS[currentRole],
        setCurrentRole,
        activeProject,
        setActiveProject,
        allProjects,
        activities,
        wbsNodes,
        dependencies,
        fieldEvents,
        matches,
        conflicts,
        terminologyMappings,
        auditLogs,
        riskScore,
        activeTab,
        setActiveTab,
        selectedMatchId,
        setSelectedMatchId,
        selectedEventId,
        setSelectedEventId,
        selectedActivityCode,
        setSelectedActivityCode,
        navigateToEventReview,
        navigateToActivitySchedule,
        isCopilotOpen,
        setIsCopilotOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isOnline,
        setIsOnline,
        offlineQueue,
        submitFieldInput,
        approveMatch,
        rejectMatch,
        resolveConflict,
        addTerminologyMapping,
        syncOfflineQueue,
        resetToDefaultDemo,
        currentWhatIf,
        updateWhatIfParams,
        batchIngestFieldRows,
        approveUnplannedWork,
        updateSubtaskProgress,
        importProjectSchedule,
        commitScheduleActuals,
        selectedSubtaskId,
        setSelectedSubtaskId,
        unplannedQueueCount,
        isDossierOpen,
        setIsDossierOpen,
        embItems,
        issueEmbCertificate,
        activeGeofence,
        simulateGeofenceAnomaly,
        resetGeofenceToCenterline,
        submitIndicFieldInput,
        activeDNAMode,
        setActiveDNAMode,
        activeIngestionMode,
        setActiveIngestionMode,
        openIndicSpeechStudio,
        openRoWGeofence,
        openEMbReconciler,
        openCvcAuditDossier,
        isDroneAuditorOpen,
        setIsDroneAuditorOpen,
        isWhatsAppGatewayOpen,
        setIsWhatsAppGatewayOpen,
        isFloodPredictorOpen,
        setIsFloodPredictorOpen,
        isXerExportModalOpen,
        setIsXerExportModalOpen,
        openDroneAuditor,
        openWhatsAppGateway,
        openFloodPredictor,
        openP6XerExport,
        isVoiceCommanderOpen,
        setIsVoiceCommanderOpen,
        openVoiceCommander,
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
        toastMessage,
        showToast,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
