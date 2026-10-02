// ============================================================================
// SiteSync - IoT Telemetry & Predictive Maintenance Engine
// Oil India Limited - 132 KM Digboi to Duliajan Crude Oil Trunkline
// ============================================================================

export interface IoTTelemetryPoint {
  timestamp: string;
  pressureBar: number;
  temperatureC: number;
  vibrationMmS: number;
  flowM3H: number;
  viscosityCSt: number;
  acousticLeakDb: number;
}

export interface IoTAssetStation {
  id: string;
  name: string;
  chainageKm: number;
  type: 'PUMP_STATION' | 'BOOSTER' | 'BLOCK_VALVE' | 'HDD_CROSSING' | 'TERMINAL';
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  rulHours: number; // Remaining Useful Life
  failureRiskPct: number;
  dominantFailureMode: string;
  currentTelemetry: IoTTelemetryPoint;
  history: IoTTelemetryPoint[];
  forecast48h: {
    hoursAhead: number;
    predictedVibration: number;
    predictedPressure: number;
    upperConfidence: number;
    lowerConfidence: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  specifications: {
    equipmentModel: string;
    powerRatingKw?: number;
    maopBar: number; // Max Allowable Operating Pressure
    isoVibrationLimitMmS: number;
    waxAppearanceTempC: number;
  };
}

export interface IoTAnomalyPreset {
  id: 'BEARING_CAVITATION' | 'PARAFFIN_WAXING' | 'HDD_RIVER_SCOUR' | 'NORMAL';
  title: string;
  targetStationId: string;
  description: string;
  expectedAlert: string;
}

export const IOT_ANOMALY_PRESETS: IoTAnomalyPreset[] = [
  {
    id: 'NORMAL',
    title: 'Baseline Normal Operations',
    targetStationId: 'IPS-01',
    description: 'Steady crude oil pumping from Digboi Initial Pump Station at 1,420 m³/hr with all vibration and thermal metrics well inside OISD norms.',
    expectedAlert: 'All 5 supervisory nodes report NOMINAL telemetry.'
  },
  {
    id: 'BEARING_CAVITATION',
    title: 'Pump P-201 Impeller Cavitation & Bearing Fatigue',
    targetStationId: 'BPS-02',
    description: 'Booster pump inlet pressure drops below crude vapor pressure, inducing micro-implosions and triaxial vibration spike on outboard bearing.',
    expectedAlert: 'CRITICAL ALERT: BPS-02 Outboard bearing vibration at 9.4 mm/s RMS (ISO 10816 Limit: 4.5 mm/s). RUL collapsed to 18 hours.'
  },
  {
    id: 'PARAFFIN_WAXING',
    title: 'Severe Crude Oil Paraffin Wax Gelation Risk',
    targetStationId: 'RIT-05',
    description: 'Cold monsoon subsoil chills heavy Assam crude below 28°C Wax Appearance Temperature (WAT), causing rapid viscosity escalation and pressure throttling.',
    expectedAlert: 'WARNING: Duliajan terminal crude viscosity escalated to 52 cSt. Paraffin deposition probability: 89%. Scraper pig launch advised.'
  },
  {
    id: 'HDD_RIVER_SCOUR',
    title: 'Burhi Dihing Riverbed Scour & Pipe Bending Strain',
    targetStationId: 'HDD-04',
    description: 'Flash monsoon currents wash riverbed gravel, uncovering 24" HDD casing and creating longitudinal bending strain exceeding design elasticity.',
    expectedAlert: 'CRITICAL GEOTECHNICAL: Ch. 92.1 Submerged HDD strain jumped to 885 µε. Pipeline deflection alert!'
  }
];

export const INITIAL_IOT_STATIONS: IoTAssetStation[] = [
  {
    id: 'IPS-01',
    name: 'Digboi Initial Pump Station (IPS-01)',
    chainageKm: 0.0,
    type: 'PUMP_STATION',
    status: 'OPTIMAL',
    rulHours: 1240,
    failureRiskPct: 8,
    dominantFailureMode: 'Mechanical Seal Micro-Wear',
    specifications: {
      equipmentModel: 'Sulzer MSD-II 6x10x14 Multistage Centrifugal (2+1)',
      powerRatingKw: 1850,
      maopBar: 74.0,
      isoVibrationLimitMmS: 4.5,
      waxAppearanceTempC: 30.5
    },
    currentTelemetry: {
      timestamp: 'Just now',
      pressureBar: 64.2,
      temperatureC: 46.8,
      vibrationMmS: 2.1,
      flowM3H: 1420,
      viscosityCSt: 16.5,
      acousticLeakDb: 14.2
    },
    history: [
      { timestamp: '12m ago', pressureBar: 63.8, temperatureC: 47.1, vibrationMmS: 2.0, flowM3H: 1415, viscosityCSt: 16.4, acousticLeakDb: 14.0 },
      { timestamp: '9m ago', pressureBar: 64.0, temperatureC: 46.9, vibrationMmS: 2.1, flowM3H: 1422, viscosityCSt: 16.6, acousticLeakDb: 14.1 },
      { timestamp: '6m ago', pressureBar: 64.1, temperatureC: 46.8, vibrationMmS: 2.2, flowM3H: 1418, viscosityCSt: 16.5, acousticLeakDb: 14.3 },
      { timestamp: '3m ago', pressureBar: 64.3, temperatureC: 46.7, vibrationMmS: 2.1, flowM3H: 1420, viscosityCSt: 16.5, acousticLeakDb: 14.2 },
      { timestamp: 'Now', pressureBar: 64.2, temperatureC: 46.8, vibrationMmS: 2.1, flowM3H: 1420, viscosityCSt: 16.5, acousticLeakDb: 14.2 }
    ],
    forecast48h: [
      { hoursAhead: 6, predictedVibration: 2.15, predictedPressure: 64.1, upperConfidence: 2.4, lowerConfidence: 1.9, riskLevel: 'LOW' },
      { hoursAhead: 12, predictedVibration: 2.22, predictedPressure: 64.0, upperConfidence: 2.5, lowerConfidence: 1.9, riskLevel: 'LOW' },
      { hoursAhead: 24, predictedVibration: 2.30, predictedPressure: 63.9, upperConfidence: 2.7, lowerConfidence: 2.0, riskLevel: 'LOW' },
      { hoursAhead: 36, predictedVibration: 2.38, predictedPressure: 63.8, upperConfidence: 2.8, lowerConfidence: 2.1, riskLevel: 'LOW' },
      { hoursAhead: 48, predictedVibration: 2.45, predictedPressure: 63.7, upperConfidence: 3.0, lowerConfidence: 2.1, riskLevel: 'LOW' }
    ]
  },
  {
    id: 'BPS-02',
    name: 'Margherita Booster Station (BPS-02)',
    chainageKm: 34.8,
    type: 'BOOSTER',
    status: 'WARNING',
    rulHours: 114,
    failureRiskPct: 62,
    dominantFailureMode: 'Non-Drive End Bearing Cage Fatigue',
    specifications: {
      equipmentModel: 'Flowserve 8x10 DMX Booster Train BP-201',
      powerRatingKw: 1200,
      maopBar: 68.0,
      isoVibrationLimitMmS: 4.5,
      waxAppearanceTempC: 30.5
    },
    currentTelemetry: {
      timestamp: 'Just now',
      pressureBar: 56.4,
      temperatureC: 38.2,
      vibrationMmS: 4.8,
      flowM3H: 1395,
      viscosityCSt: 21.0,
      acousticLeakDb: 19.8
    },
    history: [
      { timestamp: '12m ago', pressureBar: 57.2, temperatureC: 38.6, vibrationMmS: 4.2, flowM3H: 1400, viscosityCSt: 20.4, acousticLeakDb: 18.2 },
      { timestamp: '9m ago', pressureBar: 56.9, temperatureC: 38.5, vibrationMmS: 4.4, flowM3H: 1398, viscosityCSt: 20.7, acousticLeakDb: 18.9 },
      { timestamp: '6m ago', pressureBar: 56.6, temperatureC: 38.3, vibrationMmS: 4.6, flowM3H: 1396, viscosityCSt: 20.8, acousticLeakDb: 19.4 },
      { timestamp: '3m ago', pressureBar: 56.5, temperatureC: 38.2, vibrationMmS: 4.7, flowM3H: 1395, viscosityCSt: 21.0, acousticLeakDb: 19.6 },
      { timestamp: 'Now', pressureBar: 56.4, temperatureC: 38.2, vibrationMmS: 4.8, flowM3H: 1395, viscosityCSt: 21.0, acousticLeakDb: 19.8 }
    ],
    forecast48h: [
      { hoursAhead: 6, predictedVibration: 5.2, predictedPressure: 55.8, upperConfidence: 5.7, lowerConfidence: 4.8, riskLevel: 'MEDIUM' },
      { hoursAhead: 12, predictedVibration: 5.8, predictedPressure: 55.1, upperConfidence: 6.4, lowerConfidence: 5.3, riskLevel: 'HIGH' },
      { hoursAhead: 24, predictedVibration: 6.9, predictedPressure: 53.9, upperConfidence: 7.8, lowerConfidence: 6.1, riskLevel: 'HIGH' },
      { hoursAhead: 36, predictedVibration: 8.1, predictedPressure: 52.4, upperConfidence: 9.2, lowerConfidence: 7.0, riskLevel: 'HIGH' },
      { hoursAhead: 48, predictedVibration: 9.4, predictedPressure: 50.8, upperConfidence: 10.8, lowerConfidence: 8.2, riskLevel: 'HIGH' }
    ]
  },
  {
    id: 'VS-03',
    name: 'Namrup Sectionalizing Valve Station (VS-03)',
    chainageKm: 68.4,
    type: 'BLOCK_VALVE',
    status: 'OPTIMAL',
    rulHours: 3200,
    failureRiskPct: 4,
    dominantFailureMode: 'Stem Packing Wear (Negligible)',
    specifications: {
      equipmentModel: 'Valvitalia 24" Class 600 Full Bore Slab Gate MOV-301',
      maopBar: 74.0,
      isoVibrationLimitMmS: 2.8,
      waxAppearanceTempC: 30.5
    },
    currentTelemetry: {
      timestamp: 'Just now',
      pressureBar: 51.2,
      temperatureC: 34.6,
      vibrationMmS: 0.9,
      flowM3H: 1390,
      viscosityCSt: 24.2,
      acousticLeakDb: 13.5
    },
    history: [
      { timestamp: '12m ago', pressureBar: 51.4, temperatureC: 34.7, vibrationMmS: 0.8, flowM3H: 1392, viscosityCSt: 24.0, acousticLeakDb: 13.4 },
      { timestamp: '9m ago', pressureBar: 51.3, temperatureC: 34.7, vibrationMmS: 0.9, flowM3H: 1391, viscosityCSt: 24.1, acousticLeakDb: 13.5 },
      { timestamp: '6m ago', pressureBar: 51.2, temperatureC: 34.6, vibrationMmS: 0.9, flowM3H: 1390, viscosityCSt: 24.2, acousticLeakDb: 13.6 },
      { timestamp: '3m ago', pressureBar: 51.2, temperatureC: 34.6, vibrationMmS: 0.9, flowM3H: 1390, viscosityCSt: 24.2, acousticLeakDb: 13.5 },
      { timestamp: 'Now', pressureBar: 51.2, temperatureC: 34.6, vibrationMmS: 0.9, flowM3H: 1390, viscosityCSt: 24.2, acousticLeakDb: 13.5 }
    ],
    forecast48h: [
      { hoursAhead: 6, predictedVibration: 0.9, predictedPressure: 51.1, upperConfidence: 1.1, lowerConfidence: 0.7, riskLevel: 'LOW' },
      { hoursAhead: 12, predictedVibration: 0.9, predictedPressure: 51.0, upperConfidence: 1.2, lowerConfidence: 0.7, riskLevel: 'LOW' },
      { hoursAhead: 24, predictedVibration: 1.0, predictedPressure: 50.9, upperConfidence: 1.3, lowerConfidence: 0.8, riskLevel: 'LOW' },
      { hoursAhead: 36, predictedVibration: 1.0, predictedPressure: 50.8, upperConfidence: 1.3, lowerConfidence: 0.8, riskLevel: 'LOW' },
      { hoursAhead: 48, predictedVibration: 1.0, predictedPressure: 50.7, upperConfidence: 1.4, lowerConfidence: 0.8, riskLevel: 'LOW' }
    ]
  },
  {
    id: 'HDD-04',
    name: 'Burhi Dihing River HDD Crossing Node (HDD-04)',
    chainageKm: 92.1,
    type: 'HDD_CROSSING',
    status: 'OPTIMAL',
    rulHours: 4800,
    failureRiskPct: 12,
    dominantFailureMode: 'Riverbed Scour Induced Bending Stress',
    specifications: {
      equipmentModel: 'API 5L X65 Heavy Wall 24" 19.1mm WT Submerged Segment',
      maopBar: 74.0,
      isoVibrationLimitMmS: 3.5,
      waxAppearanceTempC: 30.5
    },
    currentTelemetry: {
      timestamp: 'Just now',
      pressureBar: 44.8,
      temperatureC: 32.1,
      vibrationMmS: 1.4,
      flowM3H: 1385,
      viscosityCSt: 27.4,
      acousticLeakDb: 16.2
    },
    history: [
      { timestamp: '12m ago', pressureBar: 45.1, temperatureC: 32.3, vibrationMmS: 1.3, flowM3H: 1388, viscosityCSt: 27.1, acousticLeakDb: 15.9 },
      { timestamp: '9m ago', pressureBar: 45.0, temperatureC: 32.2, vibrationMmS: 1.3, flowM3H: 1386, viscosityCSt: 27.2, acousticLeakDb: 16.0 },
      { timestamp: '6m ago', pressureBar: 44.9, temperatureC: 32.1, vibrationMmS: 1.4, flowM3H: 1385, viscosityCSt: 27.3, acousticLeakDb: 16.1 },
      { timestamp: '3m ago', pressureBar: 44.8, temperatureC: 32.1, vibrationMmS: 1.4, flowM3H: 1385, viscosityCSt: 27.4, acousticLeakDb: 16.2 },
      { timestamp: 'Now', pressureBar: 44.8, temperatureC: 32.1, vibrationMmS: 1.4, flowM3H: 1385, viscosityCSt: 27.4, acousticLeakDb: 16.2 }
    ],
    forecast48h: [
      { hoursAhead: 6, predictedVibration: 1.5, predictedPressure: 44.7, upperConfidence: 1.8, lowerConfidence: 1.2, riskLevel: 'LOW' },
      { hoursAhead: 12, predictedVibration: 1.6, predictedPressure: 44.5, upperConfidence: 2.0, lowerConfidence: 1.3, riskLevel: 'LOW' },
      { hoursAhead: 24, predictedVibration: 1.8, predictedPressure: 44.2, upperConfidence: 2.3, lowerConfidence: 1.4, riskLevel: 'LOW' },
      { hoursAhead: 36, predictedVibration: 2.0, predictedPressure: 44.0, upperConfidence: 2.6, lowerConfidence: 1.5, riskLevel: 'MEDIUM' },
      { hoursAhead: 48, predictedVibration: 2.2, predictedPressure: 43.8, upperConfidence: 2.9, lowerConfidence: 1.6, riskLevel: 'MEDIUM' }
    ]
  },
  {
    id: 'RIT-05',
    name: 'Duliajan Refinery Receiving Terminal (RIT-05)',
    chainageKm: 132.0,
    type: 'TERMINAL',
    status: 'OPTIMAL',
    rulHours: 2150,
    failureRiskPct: 15,
    dominantFailureMode: 'Paraffin Wax Sludge Buildup in Slug Catcher',
    specifications: {
      equipmentModel: 'FMC Custody Transfer Ultrasonic Metering Skid & Slug Catcher',
      maopBar: 49.0,
      isoVibrationLimitMmS: 3.0,
      waxAppearanceTempC: 30.5
    },
    currentTelemetry: {
      timestamp: 'Just now',
      pressureBar: 24.6,
      temperatureC: 29.8,
      vibrationMmS: 1.1,
      flowM3H: 1380,
      viscosityCSt: 32.5,
      acousticLeakDb: 12.8
    },
    history: [
      { timestamp: '12m ago', pressureBar: 25.1, temperatureC: 30.2, vibrationMmS: 1.0, flowM3H: 1385, viscosityCSt: 31.8, acousticLeakDb: 12.5 },
      { timestamp: '9m ago', pressureBar: 24.9, temperatureC: 30.0, vibrationMmS: 1.1, flowM3H: 1382, viscosityCSt: 32.1, acousticLeakDb: 12.7 },
      { timestamp: '6m ago', pressureBar: 24.8, temperatureC: 29.9, vibrationMmS: 1.1, flowM3H: 1381, viscosityCSt: 32.3, acousticLeakDb: 12.8 },
      { timestamp: '3m ago', pressureBar: 24.7, temperatureC: 29.8, vibrationMmS: 1.1, flowM3H: 1380, viscosityCSt: 32.4, acousticLeakDb: 12.8 },
      { timestamp: 'Now', pressureBar: 24.6, temperatureC: 29.8, vibrationMmS: 1.1, flowM3H: 1380, viscosityCSt: 32.5, acousticLeakDb: 12.8 }
    ],
    forecast48h: [
      { hoursAhead: 6, predictedVibration: 1.2, predictedPressure: 24.3, upperConfidence: 1.5, lowerConfidence: 1.0, riskLevel: 'LOW' },
      { hoursAhead: 12, predictedVibration: 1.3, predictedPressure: 24.0, upperConfidence: 1.7, lowerConfidence: 1.0, riskLevel: 'LOW' },
      { hoursAhead: 24, predictedVibration: 1.5, predictedPressure: 23.5, upperConfidence: 2.0, lowerConfidence: 1.1, riskLevel: 'LOW' },
      { hoursAhead: 36, predictedVibration: 1.7, predictedPressure: 23.0, upperConfidence: 2.3, lowerConfidence: 1.2, riskLevel: 'MEDIUM' },
      { hoursAhead: 48, predictedVibration: 1.9, predictedPressure: 22.4, upperConfidence: 2.6, lowerConfidence: 1.3, riskLevel: 'MEDIUM' }
    ]
  }
];

export function applyIoTAnomaly(stations: IoTAssetStation[], presetId: IoTAnomalyPreset['id']): IoTAssetStation[] {
  if (presetId === 'NORMAL') {
    return INITIAL_IOT_STATIONS;
  }

  return stations.map(station => {
    if (presetId === 'BEARING_CAVITATION' && station.id === 'BPS-02') {
      return {
        ...station,
        status: 'CRITICAL',
        rulHours: 18,
        failureRiskPct: 94,
        dominantFailureMode: 'Catastrophic Bearing Seizure & Impeller Cavitation',
        currentTelemetry: {
          ...station.currentTelemetry,
          pressureBar: 48.2,
          vibrationMmS: 9.4,
          acousticLeakDb: 29.4
        },
        forecast48h: [
          { hoursAhead: 6, predictedVibration: 10.8, predictedPressure: 45.0, upperConfidence: 12.4, lowerConfidence: 9.5, riskLevel: 'HIGH' },
          { hoursAhead: 12, predictedVibration: 13.5, predictedPressure: 41.2, upperConfidence: 15.0, lowerConfidence: 11.2, riskLevel: 'HIGH' },
          { hoursAhead: 24, predictedVibration: 16.0, predictedPressure: 36.0, upperConfidence: 18.5, lowerConfidence: 13.8, riskLevel: 'HIGH' },
          { hoursAhead: 36, predictedVibration: 18.5, predictedPressure: 30.0, upperConfidence: 21.0, lowerConfidence: 15.0, riskLevel: 'HIGH' },
          { hoursAhead: 48, predictedVibration: 22.0, predictedPressure: 22.0, upperConfidence: 25.0, lowerConfidence: 18.0, riskLevel: 'HIGH' }
        ]
      };
    }

    if (presetId === 'PARAFFIN_WAXING' && station.id === 'RIT-05') {
      return {
        ...station,
        status: 'WARNING',
        rulHours: 42,
        failureRiskPct: 88,
        dominantFailureMode: 'Severe Paraffin Wax Deposition & Pipe Bore Constriction',
        currentTelemetry: {
          ...station.currentTelemetry,
          temperatureC: 25.4,
          viscosityCSt: 58.0,
          pressureBar: 38.6
        },
        forecast48h: [
          { hoursAhead: 6, predictedVibration: 1.8, predictedPressure: 41.0, upperConfidence: 2.2, lowerConfidence: 1.4, riskLevel: 'HIGH' },
          { hoursAhead: 12, predictedVibration: 2.1, predictedPressure: 43.5, upperConfidence: 2.6, lowerConfidence: 1.7, riskLevel: 'HIGH' },
          { hoursAhead: 24, predictedVibration: 2.5, predictedPressure: 47.0, upperConfidence: 3.1, lowerConfidence: 2.0, riskLevel: 'HIGH' },
          { hoursAhead: 36, predictedVibration: 2.9, predictedPressure: 51.2, upperConfidence: 3.6, lowerConfidence: 2.3, riskLevel: 'HIGH' },
          { hoursAhead: 48, predictedVibration: 3.4, predictedPressure: 56.0, upperConfidence: 4.2, lowerConfidence: 2.7, riskLevel: 'HIGH' }
        ]
      };
    }

    if (presetId === 'HDD_RIVER_SCOUR' && station.id === 'HDD-04') {
      return {
        ...station,
        status: 'CRITICAL',
        rulHours: 36,
        failureRiskPct: 91,
        dominantFailureMode: 'Excessive Flexural Bending & Loss of Bed Support',
        currentTelemetry: {
          ...station.currentTelemetry,
          vibrationMmS: 5.6,
          pressureBar: 42.1,
          acousticLeakDb: 26.8
        },
        forecast48h: [
          { hoursAhead: 6, predictedVibration: 6.2, predictedPressure: 41.5, upperConfidence: 7.0, lowerConfidence: 5.4, riskLevel: 'HIGH' },
          { hoursAhead: 12, predictedVibration: 7.1, predictedPressure: 40.8, upperConfidence: 8.2, lowerConfidence: 6.0, riskLevel: 'HIGH' },
          { hoursAhead: 24, predictedVibration: 8.4, predictedPressure: 39.5, upperConfidence: 9.8, lowerConfidence: 7.1, riskLevel: 'HIGH' },
          { hoursAhead: 36, predictedVibration: 9.9, predictedPressure: 38.0, upperConfidence: 11.5, lowerConfidence: 8.4, riskLevel: 'HIGH' },
          { hoursAhead: 48, predictedVibration: 11.5, predictedPressure: 36.2, upperConfidence: 13.2, lowerConfidence: 9.8, riskLevel: 'HIGH' }
        ]
      };
    }

    return station;
  });
}
