// ============================================================================
// SiteSync AI — Core Domain Types (SIH26122: Oil India Limited)
// Intelligent Planning-to-Execution Bridge
// ============================================================================

export type UserRole = 'planner' | 'supervisor' | 'project_manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  discipline?: string;
}

export type DisciplineType = 
  | 'Civil'
  | 'Piping'
  | 'Electrical'
  | 'Instrumentation'
  | 'Mechanical'
  | 'Static Equipment'
  | 'Rotating Equipment'
  | 'HSE';

export type ActivityLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export type ActivityStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CRITICAL';

export interface WBSNode {
  id: string;
  projectId: string;
  code: string;
  name: string;
  level: ActivityLevel;
  parentId?: string;
  discipline: DisciplineType;
  children?: WBSNode[];
}

export interface ActivityDependency {
  id: string;
  predecessorId: string;
  successorId: string;
  type: 'FS' | 'SS' | 'FF' | 'SF';
  lagDays: number;
}

export interface ScheduleActivity {
  id: string;
  projectId: string;
  wbsId: string;
  activityCode: string;
  name: string;
  level: ActivityLevel;
  discipline: DisciplineType;
  location: string;
  responsibleContractor: string;
  
  // Planned Dates (Baseline)
  plannedStart: string; // ISO date YYYY-MM-DD
  plannedFinish: string;
  plannedDurationDays: number;
  baselinePercent: number;
  
  // Actual Progress
  actualStart?: string;
  actualFinish?: string;
  actualDurationDays?: number;
  actualPercent: number;
  
  // Forecast & Variance
  forecastFinish: string;
  forecastVarianceDays: number; // positive = delayed
  
  // Quantities
  quantity?: number;
  unit?: string;
  installedQuantity?: number;
  
  // Status & Critical Path
  status: ActivityStatus;
  isCriticalPath: boolean;
  isMilestone: boolean;
  
  // Intelligence metrics
  matchConfidence?: number;
  lastUpdateDate?: string;
  lastSourceId?: string;
  lastReportSentence?: string;
  
  // Benchmarking
  historicalBenchmarkDays?: number;
  historicalVarianceDays?: number;
  commonDelayCause?: string;
}

export interface NormalizedExecutionEvent {
  eventId: string;
  projectId: string;
  sourceId: string;
  sourceType: 'VOICE' | 'TEXT' | 'DPR' | 'SPREADSHEET' | 'SCANNED_DIARY' | 'PHOTO';
  reportedBy: string;
  reporterRole: UserRole;
  reportedDate: string;
  
  // Extracted Event Properties
  rawText: string;
  activityDescription: string;
  discipline: DisciplineType;
  action: string;
  assetOrComponent: string;
  location: string;
  startTime?: string;
  endTime?: string;
  
  quantity?: number;
  unit?: string;
  percentComplete?: number;
  statusReported: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'IMPEDED';
  
  contractor?: string;
  equipment?: string[];
  manpowerCount?: number;
  delayReason?: string;
  
  photoUrl?: string;
  extractionConfidence: number;
  createdAt: string;
}

export interface CandidateMatch {
  activityId: string;
  activityCode: string;
  activityName: string;
  discipline: DisciplineType;
  wbsHierarchy: string;
  
  // Calibrated Component Scores (0 to 1)
  lexicalScore: number;
  fuzzyScore: number;
  semanticScore: number;
  contextScore: number;
  temporalScore: number;
  finalConfidence: number; // 0 - 100%
  
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW';
  
  explanationPoints: {
    passed: boolean;
    text: string;
  }[];
}

export interface ActivityMatchRecord {
  matchId: string;
  eventId: string;
  selectedActivityId: string;
  candidates: CandidateMatch[];
  confidence: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'REASSIGNED' | 'MARKED_NEW';
  plannerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  appliedToSchedule: boolean;
}

export interface TerminologyMapping {
  id: string;
  projectId: string;
  discipline: DisciplineType;
  contractor?: string;
  fieldTerm: string;
  canonicalActivityCode: string;
  canonicalActivityName: string;
  confidenceBoost: number;
  approvedBy: string;
  learnedAt: string;
  timesApplied: number;
}

export interface DataConflict {
  id: string;
  projectId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  conflictType: 'PROGRESS_CONFLICT' | 'TEMPORAL_CONFLICT' | 'DUPLICATE_EVENT' | 'PREDECESSOR_VIOLATION';
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  status: 'UNRESOLVED' | 'RESOLVED' | 'IGNORED';
  title: string;
  description: string;
  detectedAt: string;
  
  sources: {
    sourceType: string;
    sourceRef: string;
    reportedValue: string | number;
    reporter: string;
    timestamp: string;
  }[];
  
  resolutionNotes?: string;
  resolvedBy?: string;
}

export interface ProjectRiskScore {
  overallScore: number; // 0 - 100
  tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  breakdown: {
    name: string;
    points: number;
    description: string;
  }[];
  
  topEarlyWarnings: {
    activityId: string;
    activityCode: string;
    title: string;
    impactDays: number;
    confidence: number;
    drivers: string[];
  }[];
}

export interface ActivityDNA {
  activityType: string;
  discipline: DisciplineType;
  typicalDurationDays: number;
  historicalMedianDays: number;
  historicalVarianceDays: number;
  primaryDelayCauses: { cause: string; frequencyPct: number }[];
  topContractors: { name: string; performanceRating: number; avgVarianceDays: number }[];
  synonyms: string[];
  sampleProjectCount: number;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    additionalWorkers: number;
    shiftExtensionHours: number;
    expediteMaterials: boolean;
    parallelizePiping: boolean;
  };
  baselineFinish: string;
  currentForecastFinish: string;
  simulatedFinish: string;
  daysRecovered: number;
  riskReductionPoints: number;
  costImpactINR: number;
}

export interface DailyProjectDigest {
  date: string;
  activitiesUpdatedCount: number;
  activitiesStartedCount: number;
  activitiesCompletedCount: number;
  activitiesDelayedCount: number;
  conflictsDetectedCount: number;
  criticalPathRisksCount: number;
  executionConfidencePct: number;
  highlightText: string;
  attentionQueue: {
    priority: 'CRITICAL' | 'ATTENTION' | 'REVIEW' | 'NORMAL';
    activityCode: string;
    activityName: string;
    reason: string;
    actionRequired: string;
  }[];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  entityType: 'ACTIVITY' | 'MATCH' | 'EVENT' | 'CONFLICT' | 'SCHEDULE';
  entityId: string;
  action: string;
  performedBy: string;
  role: UserRole;
  details: string;
  modelVersion?: string;
  sourceDoc?: string;
  sourcePage?: number;
  oldValue?: string;
  newValue?: string;
}

export interface ProjectSummary {
  id: string;
  code: string;
  name: string;
  organization: string;
  location: string;
  startDate: string;
  baselineCompletionDate: string;
  currentForecastCompletionDate: string;
  status: 'ACTIVE' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
  budgetINR: number;
  healthScore: number;
  plannedProgressPct: number;
  actualProgressPct: number;
  forecastProgressPct: number;
  variancePct: number;
  executionConfidencePct: number;
  totalActivitiesCount: number;
  delayedActivitiesCount: number;
  criticalPathActivitiesCount: number;
  unresolvedConflictsCount: number;
  pendingReviewsCount: number;
}
