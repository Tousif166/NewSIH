// ============================================================================
// SiteSync AI: Hands-Free Voice Command Engine for Field Operations
// Web Speech API recognition + intent extraction + spoken synthesis
// Designed for glove-wearing supervisors in harsh Assam monsoon oilfield terrain
// Problem Statement SIH26122 (Oil India Limited)
// ============================================================================

export interface ParsedVoiceCommand {
  rawTranscript: string;
  intent: 'LOG_PROGRESS' | 'NAVIGATE' | 'QUERY' | 'APPROVE' | 'UNKNOWN';
  confidence: number;
  extractedParams: {
    discipline?: string;
    action?: string;
    locationOrChainage?: string;
    progressPercent?: number;
    activityCode?: string;
    targetTab?: string;
  };
  spokenFeedback: string;
  executionStatus: 'READY_TO_EXECUTE' | 'EXECUTED' | 'NEEDS_CONFIRMATION' | 'UNRECOGNIZED';
}

export function parseVoiceFieldTranscript(transcript: string): ParsedVoiceCommand {
  const t = transcript.trim();
  const lower = t.toLowerCase();

  // 1. Navigation Intent
  if (lower.includes('go to') || lower.includes('open') || lower.includes('show') || lower.includes('navigate')) {
    let targetTab = 'DASHBOARD';
    let tabName = 'Dashboard';

    if (lower.includes('3d') || lower.includes('twin') || lower.includes('corridor') || lower.includes('pipeline')) {
      targetTab = 'PIPELINE_3D';
      tabName = '3D Digital Twin Pipeline Corridor';
    } else if (lower.includes('blockchain') || lower.includes('audit') || lower.includes('ledger')) {
      targetTab = 'BLOCKCHAIN_LEDGER';
      tabName = 'Immutable Blockchain Audit Ledger';
    } else if (lower.includes('delay') || lower.includes('cascade') || lower.includes('ripple')) {
      targetTab = 'DELAY_CASCADE';
      tabName = 'AI Delay Cascade Simulator';
    } else if (lower.includes('review') || lower.includes('desk') || lower.includes('reconcil')) {
      targetTab = 'REVIEW_CENTER';
      tabName = 'AI Review Center';
    } else if (lower.includes('conflict')) {
      targetTab = 'CONFLICT_CENTER';
      tabName = 'Conflict Center';
    } else if (lower.includes('gantt') || lower.includes('4d')) {
      targetTab = 'GANTT_4D';
      tabName = '4D Gantt Digital Twin';
    } else if (lower.includes('field') || lower.includes('input')) {
      targetTab = 'FIELD_INPUT';
      tabName = 'Field Input Center';
    } else if (lower.includes('dna') || lower.includes('memory')) {
      targetTab = 'ACTIVITY_DNA';
      tabName = 'Activity DNA & Historical Memory';
    } else if (lower.includes('iot') || lower.includes('telemetry') || lower.includes('predictive') || lower.includes('sensor')) {
      targetTab = 'IOT_TELEMETRY';
      tabName = 'IoT Predictive Maintenance Dashboard';
    } else if (lower.includes('ar') || lower.includes('spatial') || lower.includes('camera inspection')) {
      targetTab = 'AR_INSPECTION';
      tabName = 'AR Site Inspection';
    } else if (lower.includes('drone') || lower.includes('orthophoto') || lower.includes('uav')) {
      targetTab = 'DRONE_FLEET';
      tabName = 'Drone Fleet & Orthophoto Timeline';
    } else if (lower.includes('safety') || lower.includes('training') || lower.includes('oisd') || lower.includes('drill')) {
      targetTab = 'SAFETY_TRAINING';
      tabName = 'Gamified Safety & HSE Hub';
    } else if (lower.includes('geofence') || lower.includes('threat') || lower.includes('gis') || lower.includes('row')) {
      targetTab = 'GEOFENCE_GIS';
      tabName = 'GIS Corridor Threat Alert';
    } else if (lower.includes('compliance') || lower.includes('report') || lower.includes('dpr') || lower.includes('cvc')) {
      targetTab = 'COMPLIANCE_REPORT';
      tabName = 'CVC / MoP&NG Compliance Report AI';
    } else if (lower.includes('energy') || lower.includes('flow') || lower.includes('hydraulic') || lower.includes('dra')) {
      targetTab = 'FLOW_ENERGY';
      tabName = 'Energy & Flow Digital Twin Simulator';
    }

    return {
      rawTranscript: t,
      intent: 'NAVIGATE',
      confidence: 0.94,
      extractedParams: { targetTab },
      spokenFeedback: `Navigating to ${tabName}.`,
      executionStatus: 'READY_TO_EXECUTE'
    };
  }

  // 2. Quick Approval Intent
  if (lower.includes('approve') || lower.includes('accept') || lower.includes('pass')) {
    return {
      rawTranscript: t,
      intent: 'APPROVE',
      confidence: 0.91,
      extractedParams: {},
      spokenFeedback: 'Approval authorization acknowledged. Opening review queue.',
      executionStatus: 'READY_TO_EXECUTE'
    };
  }

  // 3. Query Intent
  if (
    lower.includes('what') || 
    lower.includes('which') || 
    lower.includes('status') || 
    lower.includes('check') || 
    lower.includes('how much') ||
    lower.includes('kya') ||
    lower.includes('kaun')
  ) {
    return {
      rawTranscript: t,
      intent: 'QUERY',
      confidence: 0.88,
      extractedParams: {},
      spokenFeedback: 'Dispatching query to SiteSync Natural Language P6 Copilot.',
      executionStatus: 'READY_TO_EXECUTE'
    };
  }

  // 4. Progress Logging Intent (Field update)
  // Example: "Log 80% progress on welding at KM 45"
  let progressPercent: number | undefined;
  const pctMatch = lower.match(/(\d+)\s*(?:%|percent|pratishat)/);
  if (pctMatch) {
    progressPercent = parseInt(pctMatch[1], 10);
  } else if (lower.includes('complete') || lower.includes('finished') || lower.includes('ho gaya')) {
    progressPercent = 100;
  } else if (lower.includes('half') || lower.includes('aadha')) {
    progressPercent = 50;
  }

  // Location / Chainage extraction
  let locationOrChainage = 'Spread 02 Pipeline Route';
  const kmMatch = lower.match(/(?:km|chainage|kilometer)\s*(\d+(?:\+\d+)?)/i);
  if (kmMatch) {
    locationOrChainage = `KM ${kmMatch[1]}`;
  } else if (lower.includes('burhi dihing') || lower.includes('river')) {
    locationOrChainage = 'Burhi Dihing River Crossing (KM 44+800)';
  } else if (lower.includes('sv-02') || lower.includes('valve 2')) {
    locationOrChainage = 'Valve Station SV-02 (KM 46+100)';
  }

  // Discipline & Action extraction
  let discipline = 'Piping';
  let action = 'Progress updated';

  if (lower.includes('weld') || lower.includes('joint') || lower.includes('fitup')) {
    discipline = 'Piping';
    action = 'Mainline Pipe Welding';
  } else if (lower.includes('trench') || lower.includes('excavat') || lower.includes('dig')) {
    discipline = 'Civil';
    action = 'Trenching & Rock Excavation';
  } else if (lower.includes('hdd') || lower.includes('bore') || lower.includes('drilling')) {
    discipline = 'HDD Crossing';
    action = 'HDD Directional Drilling';
  } else if (lower.includes('hydro') || lower.includes('test') || lower.includes('pressure')) {
    discipline = 'Testing';
    action = 'Hydrostatic Pressure Test';
  } else if (lower.includes('lower') || lower.includes('stringing')) {
    discipline = 'Piping';
    action = 'Pipe Lowering & Stringing';
  }

  const pVal = progressPercent !== undefined ? `${progressPercent}%` : 'field update';

  return {
    rawTranscript: t,
    intent: 'LOG_PROGRESS',
    confidence: 0.92,
    extractedParams: {
      discipline,
      action,
      locationOrChainage,
      progressPercent
    },
    spokenFeedback: `Logged ${pVal} for ${action} at ${locationOrChainage}. Ready to queue into SiteSync reconciliation buffer.`,
    executionStatus: 'READY_TO_EXECUTE'
  };
}

export function speakSpokenFeedback(text: string, lang: 'en-IN' | 'hi-IN' = 'en-IN') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // cancel previous utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick an Indian English or Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
    if (indVoice) utterance.voice = indVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
