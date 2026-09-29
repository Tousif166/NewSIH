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
  WhatIfScenario
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
  | 'DEMO_WALKTHROUGH';

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
    emoji: '📐',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/40',
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
    emoji: '👷',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/40',
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
    emoji: '👔',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/40',
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
    emoji: '🛡️',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/40',
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
  
  // What-If
  currentWhatIf: WhatIfScenario;
  updateWhatIfParams: (params: Partial<WhatIfScenario['parameters']>) => void;
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('sitesync_current_role');
    return (saved as UserRole) || 'planner';
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
    return saved ? JSON.parse(saved) : DEMO_FIELD_EVENTS;
  });

  const [matches, setMatches] = useState<ActivityMatchRecord[]>(() => {
    const saved = localStorage.getItem('sitesync_matches');
    return saved ? JSON.parse(saved) : DEMO_MATCHES;
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
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const setCurrentRole = (newRole: UserRole, autoNavigate: boolean = true) => {
    setCurrentRoleState(newRole);
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
      showToast(`${meta.emoji} Switched to ${meta.label} mode — ${meta.description}`);
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

    // Semantic L5/L6 Matching
    const candidates = matchExecutionEvent(newEvent, activities, dependencies, terminologyMappings);
    const topCandidate = candidates[0];

    const newMatch: ActivityMatchRecord = {
      matchId: `match-${Date.now().toString(36)}`,
      eventId: newEvent.eventId,
      selectedActivityId: topCandidate ? topCandidate.activityId : '',
      confidence: topCandidate ? topCandidate.finalConfidence : 0,
      status: topCandidate && topCandidate.finalConfidence >= 90 ? 'PENDING_REVIEW' : 'PENDING_REVIEW',
      candidates,
      appliedToSchedule: false
    };

    // Conflict Check
    if (topCandidate) {
      const targetAct = activities.find(a => a.id === topCandidate.activityId);
      if (targetAct) {
        const conflict = detectProgressConflict(targetAct, newEvent, fieldEvents);
        if (conflict) {
          setConflicts(prev => [conflict, ...prev]);
          showToast(`⚠️ Conflict detected on ${targetAct.activityCode}: Discrepant progress reports flagged for review.`);
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
      action: 'FIELD_EVENT_INGESTED',
      performedBy: newEvent.reportedBy,
      role: currentRole,
      details: `Ingested ${sourceType} field event: "${rawText.slice(0, 60)}..."`,
      modelVersion: 'Hybrid-Matcher-v2.4'
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Execution event extracted! Matched to ${topCandidate?.activityCode || 'L6 Activity'} (${topCandidate?.finalConfidence}% confidence)`);
    return newEvent.eventId;
  };

  // Approve Match in Human-in-the-Loop Review Center
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

    // Update Schedule Actuals
    if (event && chosenCandidate) {
      setActivities(prev => prev.map(a => {
        if (a.id === chosenActId) {
          const newActualPercent = Math.max(a.actualPercent, event.percentComplete ?? 100);
          const isFinished = newActualPercent >= 100;
          return {
            ...a,
            actualPercent: newActualPercent,
            actualStart: a.actualStart || event.reportedDate,
            actualFinish: isFinished ? (a.actualFinish || event.reportedDate) : undefined,
            status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
            lastUpdateDate: event.reportedDate,
            lastSourceId: event.sourceId,
            lastReportSentence: event.rawText,
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
        details: `Approved schedule link to ${chosenCandidate.activityCode}. Schedule actuals updated to ${event.percentComplete ?? 100}%.`,
        modelVersion: 'Hybrid-Matcher-v2.4'
      };
      setAuditLogs(prev => [audit, ...prev]);

      showToast(`Schedule updated! ${chosenCandidate.activityCode} updated to ${event.percentComplete ?? 100}% actual progress.`);
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
        toastMessage,
        showToast,
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
