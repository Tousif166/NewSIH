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
  plannedQuantity?: number;
  
  // Status & Critical Path
  status: ActivityStatus;
  isCriticalPath: boolean;
  isMilestone: boolean;
  isCritical?: boolean;
  wbsCode?: string;
  description?: string;
  
  // Intelligence metrics
  matchConfidence?: number;
  lastUpdateDate?: string;
  lastSourceId?: string;
  lastReportSentence?: string;
  
  // Benchmarking
  historicalBenchmarkDays?: number;
  historicalVarianceDays?: number;
  commonDelayCause?: string;

  // Level 1: Start-Progress-Finish Lifecycle Reconstruction
  lifecycleHistory?: ActivityLifecycleEvent[];

  // Level 1: Granularity Mismatch Resolver (Execution Subtasks)
  subtasks?: ExecutionSubtask[];

  // Level 1: Unplanned Work Tracking
  isUnplanned?: boolean;
  unplannedType?: 'SCOPE_VARIATION' | 'CONTRACTOR_REWORK' | 'NON_SCHEDULE_SUPPORT';
  changeRequestId?: string;
}

export interface ActivityLifecycleEvent {
  id: string;
  activityId: string;
  activityCode: string;
  date: string;
  eventType: 'START' | 'PROGRESS' | 'FINISH' | 'HOLD' | 'INSPECTION' | 'ACTUAL_START' | 'PROGRESS_UPDATE';
  progressPct: number;
  rawReport: string;
  reportedBy: string;
  sourceRef: string;
  durationToDateDays?: number;
  velocityMetric?: string;
  timestamp?: string;
  description?: string;
  progressPercent?: number;
}

export interface ExecutionSubtask {
  id: string;
  activityId: string;
  code: string;
  name: string;
  weightPct: number;
  progressPct: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  lastUpdatedDate?: string;
  lastEventRef?: string;
  weightPercent?: number;
  progressPercent?: number;
  discipline?: string;
  linkedFieldEventsCount?: number;
}

export interface UnplannedWorkProposal {
  id: string;
  eventId: string;
  detectedReason: string;
  suggestedTitle: string;
  suggestedDiscipline: DisciplineType;
  suggestedLocation: string;
  category: 'SCOPE_VARIATION' | 'CONTRACTOR_REWORK' | 'NON_SCHEDULE_SUPPORT';
  status: 'PENDING' | 'APPROVED_AS_NEW_ACTIVITY' | 'MARKED_REWORK' | 'MARKED_SUPPORT' | 'LINKED_MANUALLY' | 'REJECTED';
  createdActivityId?: string;
  estimatedDurationDays: number;
  costImpactINR: number;
  plannerNotes?: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  suggestedActivityName?: string;
  suggestedDurationDays?: number;
}

export interface HistoricalProjectRecord {
  id: string;
  projectCode: string;
  projectName: string;
  activityName: string;
  discipline: DisciplineType;
  plannedDurationDays: number;
  actualDurationDays: number;
  varianceDays: number;
  actualStart: string;
  actualFinish: string;
  contractor: string;
  delayCauses: string[];
  location: string;
  monsoonImpacted: boolean;
  lessonsLearned: string;
  terrainType?: string;
  completionYear?: number;
  costVariancePercent?: number;
  delayFactors?: string[];
}

export interface ScheduleImportPreview {
  fileName: string;
  rowCount: number;
  validCount: number;
  errorCount: number;
  activities: ScheduleActivity[];
  errors: { row: number; column: string; message: string }[];
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
  geofenceStatus?: 'VERIFIED' | 'WARNING_BUFFER' | 'GEOFENCE_ANOMALY';
  geofenceDistanceMeters?: number;
  indicTranscript?: string;
  detectedDialect?: string;
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
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'REASSIGNED' | 'MARKED_NEW' | 'UNPLANNED_WORK';
  isUnplanned?: boolean;
  unplannedCategory?: 'SCOPE_VARIATION' | 'CONTRACTOR_REWORK' | 'NON_SCHEDULE_SUPPORT';
  unplannedProposal?: Partial<UnplannedWorkProposal>;
  matchedSubtaskId?: string;
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

// ============================================================================
// UNIQUE SIH HACKATHON INNOVATION TYPES (OIL INDIA LIMITED SPECIFIC)
// ============================================================================

export interface IndicSpeechDispatch {
  id: string;
  label: string;
  dialect: 'Hinglish' | 'Assamese' | 'Hindi/Bhojpuri' | 'English';
  rawVoiceTranscript: string;
  translatedEnglishText: string;
  detectedTerms: {
    vernacular: string;
    canonicalMeaning: string;
    discipline: DisciplineType;
  }[];
  matchedP6ActivityCode: string;
  suggestedPercent: number;
}

export interface RoWGeofenceVerification {
  latitude: number;
  longitude: number;
  chainageKm: number;
  distanceFromRoWCenterlineMeters: number;
  status: 'VERIFIED' | 'WARNING_BUFFER' | 'GEOFENCE_ANOMALY';
  integrityScore: number;
  details: string;
}

export interface EMeasurementBookItem {
  id: string;
  boqItemCode: string;
  description: string;
  discipline: DisciplineType;
  contractor: string;
  totalOrderValueINR: number;
  contractorClaimedPercent: number;
  contractorClaimedAmountINR: number;
  aiVerifiedSchedulePercent: number;
  aiVerifiedAmountINR: number;
  overbillingRiskINR: number;
  auditStatus: 'APPROVED' | 'AUDIT_HOLD' | 'DISPUTED';
  evidenceCount: number;
  latestInspectionDate: string;
}

export interface StatutoryArbitrationDossier {
  dossierId: string;
  projectCode: string;
  projectName: string;
  organization: string;
  contractRef: string;
  generatedDate: string;
  baselineFinishDate: string;
  currentForecastDate: string;
  totalScheduleVarianceDays: number;
  delayAttribution: {
    category: 'FORCE_MAJEURE' | 'CLIENT_DELAY' | 'CONTRACTOR_DEFAULT';
    title: string;
    days: number;
    financialExposureINR: number;
    primaryCause: string;
    excusable: boolean;
  }[];
  statutoryCompliance: {
    clause: string;
    standard: string;
    status: 'COMPLIANT' | 'FLAGGED';
    proofHash: string;
  }[];
  contemporaneousLedgerCount: number;
  liquidatedDamagesINR: number;
}

// ============================================================================
// FRONTIER INNOVATIONS (SIH26122 / OIL INDIA SPECIAL):
// 1. Drone & Satellite CV Progress Auditor
// 2. WhatsApp & Telegram Enterprise Field Webhook Gateway
// 3. Brahmaputra Basin Hydrology & IMD Flood Predictor
// 4. Native Primavera P6 .XER Exporter & Oracle EPPM Sync
// ============================================================================

export interface DroneAuditMission {
  id: string;
  missionName: string;
  chainageKm: number;
  surveyDate: string;
  targetActivityCode: string;
  targetActivityName: string;
  contractorClaimedLinearMeters: number;
  cvDetectedLinearMeters: number;
  discrepancyMeters: number;
  confidenceScore: number;
  beforeImageUrl: string;
  afterImageUrl: string;
  segmentationMasks: {
    type: 'TRENCH' | 'PIPE_STRINGING' | 'BACKFILL';
    label: string;
    color: string;
    linearMeters: number;
    areaSqMeters: number;
  }[];
  auditStatus: 'VERIFIED_MATCH' | 'DISCREPANCY_FLAGGED' | 'SUPERVISOR_HOLD';
  notes: string;
}

export interface WhatsAppMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  senderRole: string;
  timestamp: string;
  text: string;
  voiceNoteSeconds?: number;
  mediaUrl?: string;
  mediaType?: 'photo' | 'audio' | 'document';
  exifGps?: { lat: number; lon: number; accuracyM: number };
  status: 'received' | 'parsing' | 'reconciled' | 'flagged';
  parsedDiscipline?: string;
  matchedActivityCode?: string;
  reportedProgress?: number;
  rowVerificationStatus?: 'ON_ROW' | 'OFF_ROW' | 'PENDING';
  aiNotes?: string;
}

export interface HydrologicalStation {
  stationId: string;
  name: string;
  river: string;
  currentWaterLevelM: number;
  dangerLevelM: number;
  warningLevelM: number;
  rainfall24hMm: number;
  trend: 'RISING' | 'FALLING' | 'STEADY';
  chainageImpactKm: string;
  floodRiskStatus: 'LOW' | 'MODERATE' | 'SEVERE' | 'FLASH_FLOOD_CREST';
}

export interface FloodMitigationPlan {
  recommendationId: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  affectedChainage: string;
  affectedActivities: string[];
  actionPlan: string;
  potentialEquipmentSavedINR: number;
  scheduleRecoveryDays: number;
}

export interface OracleEppmSyncStatus {
  endpoint: string;
  connectionStatus: 'CONNECTED' | 'SYNCING' | 'STANDBY';
  lastSyncTimestamp: string;
  tokenExpiry: string;
  mirrorLatencyMs: number;
  activitiesSyncedCount: number;
  lastCommittedBatchId: string;
}
