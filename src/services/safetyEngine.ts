// ============================================================================
// SiteSync - Gamified Safety & HSE Compliance Training Engine
// Oil India Limited - 132 KM Digboi to Duliajan Crude Oil Trunkline
// ============================================================================

export interface SafetyQuestion {
  id: string;
  scenarioTitle: string;
  category: 'OISD-118' | 'OISD-141' | 'PERMIT_TO_WORK' | 'H2S_EMERGENCY';
  location: string;
  description: string;
  timeLimitSec: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    consequenceScore: number;
    explanation: string;
    regulatoryStandard: string;
  }[];
}

export interface SafetyBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  color: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  designation: string;
  station: string;
  score: number;
  badgeCount: number;
}

export const SAFETY_SCENARIOS: SafetyQuestion[] = [
  {
    id: 'SCENARIO-01',
    scenarioTitle: 'Emergency H₂S Gas Release at Margherita Pig Receiver',
    category: 'H2S_EMERGENCY',
    location: 'Margherita Booster Station (Ch. 34.8)',
    description: 'During scheduled scraper pig retrieval, multi-gas detector chirps violently: H₂S concentration surges to 52 PPM. Two contract workers are loosening the quick-opening closure door without SCBA sets.',
    timeLimitSec: 30,
    options: [
      {
        id: 'A',
        text: 'Immediately don 30-minute positive-pressure SCBA, sound the pneumatic evacuation siren, order workers crosswind/upwind, and activate Emergency Shutdown Valve (ESDV).',
        isCorrect: true,
        consequenceScore: 250,
        explanation: 'Correct! At 52 PPM, H₂S causes rapid olfactory fatigue and pulmonary edema. Immediate upwind evacuation and self-contained breathing apparatus donning are mandatory under OISD-118.',
        regulatoryStandard: 'OISD-Standard-118 (Clause 6.4: Toxic Gas Handling & Evacuation)'
      },
      {
        id: 'B',
        text: 'Rush forward with wet cloth handkerchiefs and quickly bolt the pig receiver door closed.',
        isCorrect: false,
        consequenceScore: -150,
        explanation: 'FATAL ERROR! Cloth handkerchiefs offer zero filtration against H₂S. Entering the cloud without breathing apparatus leads to instant loss of consciousness.',
        regulatoryStandard: 'OSHA 1910.134 / OISD-118 Violation'
      },
      {
        id: 'C',
        text: 'Call Digboi Control Room and wait for environmental clearance before taking local action.',
        isCorrect: false,
        consequenceScore: -100,
        explanation: 'CRITICAL DELAY! Waiting for remote permission during an acute toxic release exposes site personnel to lethal gas concentrations.',
        regulatoryStandard: 'OISD-Standard-118 Emergency Response'
      }
    ]
  },
  {
    id: 'SCENARIO-02',
    scenarioTitle: 'Monsoon Trench Wall Slump & Imminent Collapse',
    category: 'OISD-141',
    location: 'Namrup Sector Trunkline Trench (Ch. 64.2)',
    description: 'A 2.4-meter-deep excavation trench in saturated alluvial soil shows tensile fissures along the lip after torrential rainfall. A welder is completing joint #DJ-214 inside the ditch without shoring.',
    timeLimitSec: 25,
    options: [
      {
        id: 'A',
        text: 'Order immediate halt, pull welder via harness escape ladder, and erect hydraulic aluminum shoring cages before re-entry.',
        isCorrect: true,
        consequenceScore: 200,
        explanation: 'Correct! Trenches deeper than 1.5m in saturated soil must have certified shoring or 1:1 benching under OISD-141.',
        regulatoryStandard: 'OISD-141 / DGMS Safety Standards for Excavation'
      },
      {
        id: 'B',
        text: 'Instruct the welder to work faster to finish the joint before the rain resumes.',
        isCorrect: false,
        consequenceScore: -200,
        explanation: 'FATAL! Trench wall slumps happen in fractions of a second with zero warning, crushing occupants under tons of wet earth.',
        regulatoryStandard: 'Gross Negligence under Indian Factories Act 1948'
      },
      {
        id: 'C',
        text: 'Place sandbags on top of the fissure to weigh down the cracking soil.',
        isCorrect: false,
        consequenceScore: -120,
        explanation: 'DANGEROUS! Placing surcharge weight on the trench lip accelerates soil shear failure and catastrophic collapse.',
        regulatoryStandard: 'Civil Geotechnical Engineering Failure'
      }
    ]
  },
  {
    id: 'SCENARIO-03',
    scenarioTitle: 'Hot Tapping Spark Flash & Permit-to-Work Violation',
    category: 'PERMIT_TO_WORK',
    location: 'Digboi Initial Pump Station Tie-In (Ch. 0.2)',
    description: 'Contractor begins cutting a branch stub with an electric angle grinder without cold-work/hot-work explosive gas LEL verification.',
    timeLimitSec: 20,
    options: [
      {
        id: 'A',
        text: 'Immediately pull power isolator, halt grinding, deploy dry chemical fire tender, and confiscate invalid Hot Work Permit.',
        isCorrect: true,
        consequenceScore: 220,
        explanation: 'Correct! Zero hot work is permitted within 15 meters of hydrocarbon equipment without 0.0% LEL gas meter sign-off.',
        regulatoryStandard: 'OISD-STD-105 (Work Permit System)'
      },
      {
        id: 'B',
        text: 'Stand by with a 5-liter bucket of water while they finish the cut.',
        isCorrect: false,
        consequenceScore: -180,
        explanation: 'Water buckets are wholly ineffective against hydrocarbon vapor flash fires and risk electrical shock.',
        regulatoryStandard: 'OISD-STD-117 Fire Protection'
      }
    ]
  }
];

export const INITIAL_SAFETY_BADGES: SafetyBadge[] = [
  {
    id: 'BADGE-OISD',
    title: 'OISD Golden Hardhat',
    icon: 'military_tech',
    description: 'Completed OISD-118 & 141 Emergency Scenarios with 100% compliance',
    unlocked: true,
    color: 'text-amber-500 bg-amber-50 border-amber-200'
  },
  {
    id: 'BADGE-H2S',
    title: 'H₂S Crisis Commander',
    icon: 'masks',
    description: 'Safely evacuated toxic gas manifold under 30 seconds',
    unlocked: true,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'BADGE-CVC',
    title: 'CVC Zero-Violation Auditor',
    icon: 'gavel',
    description: 'Enforced strict Permit-to-Work and prevented ghost sign-offs',
    unlocked: false,
    color: 'text-slate-400 bg-slate-50 border-slate-200'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Er. Ranjit Baruah', designation: 'Senior HSE Manager', station: 'Digboi IPS-01', score: 1420, badgeCount: 5 },
  { rank: 2, name: 'Er. Tarun Gogoi', designation: 'Pipeline Inspector', station: 'Margherita BPS-02', score: 1280, badgeCount: 4 },
  { rank: 3, name: 'Er. Nilakshi Kalita', designation: 'Civil Engineer', station: 'Duliajan Terminal', score: 1150, badgeCount: 3 },
  { rank: 4, name: 'You (Current User)', designation: 'SiteSync Field Lead', station: '132KM Corridor', score: 980, badgeCount: 2 }
];
