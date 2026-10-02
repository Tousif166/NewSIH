// ============================================================================
// SiteSync - GIS Geofencing & Corridor Threat Alert Engine
// Oil India Limited - 132 KM Digboi to Duliajan Crude Oil Trunkline
// ============================================================================

export interface GISCorridorSector {
  id: string;
  name: string;
  chainageStartKm: number;
  chainageEndKm: number;
  terrainType: 'HILLY_FOREST' | 'TEA_ESTATES' | 'RIVER_FLOODPLAIN' | 'INDUSTRIAL_URBAN';
  rowWidthMeters: number;
  ecoBufferMeters: number;
  activeThreatCount: number;
}

export interface GISThreatAlert {
  id: string;
  title: string;
  type: 'UNAUTHORIZED_EXCAVATION' | 'WILDLIFE_MIGRATION' | 'RIVER_SCOUR' | 'ILLEGAL_TAP_ATTEMPT';
  chainageKm: number;
  gpsCoords: { lat: number; lng: number };
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED';
  timestamp: string;
  distanceFromPipeCenterMeters: number;
  description: string;
  immediateAction: string;
  linkedP6Activity: string;
}

export const GIS_SECTORS: GISCorridorSector[] = [
  {
    id: 'SEC-A',
    name: 'Sector A: Digboi Oilfield & Patkai Foot-Hills',
    chainageStartKm: 0.0,
    chainageEndKm: 34.0,
    terrainType: 'HILLY_FOREST',
    rowWidthMeters: 30,
    ecoBufferMeters: 500,
    activeThreatCount: 1
  },
  {
    id: 'SEC-B',
    name: 'Sector B: Margherita Tea Estates & Rural Corridor',
    chainageStartKm: 34.0,
    chainageEndKm: 68.0,
    terrainType: 'TEA_ESTATES',
    rowWidthMeters: 30,
    ecoBufferMeters: 100,
    activeThreatCount: 1
  },
  {
    id: 'SEC-C',
    name: 'Sector C: Burhi Dihing River & Floodplain Crossing',
    chainageStartKm: 68.0,
    chainageEndKm: 98.0,
    terrainType: 'RIVER_FLOODPLAIN',
    rowWidthMeters: 50,
    ecoBufferMeters: 300,
    activeThreatCount: 1
  },
  {
    id: 'SEC-D',
    name: 'Sector D: Namrup Industrial Belt to Duliajan Refinery',
    chainageStartKm: 98.0,
    chainageEndKm: 132.0,
    terrainType: 'INDUSTRIAL_URBAN',
    rowWidthMeters: 30,
    ecoBufferMeters: 50,
    activeThreatCount: 1
  }
];

export const INITIAL_GIS_THREATS: GISThreatAlert[] = [
  {
    id: 'THREAT-01',
    title: 'Unauthorized Heavy Excavator inside 30m RoW Buffer',
    type: 'UNAUTHORIZED_EXCAVATION',
    chainageKm: 58.24,
    gpsCoords: { lat: 27.2842, lng: 95.4912 },
    severity: 'CRITICAL',
    status: 'ACTIVE',
    timestamp: '8 mins ago',
    distanceFromPipeCenterMeters: 8.4,
    description: 'Third-party wheeled JCB excavator detected within 9 meters of live pipeline centerline without OIL excavation permit. High puncture risk!',
    immediateAction: 'Sound RoW field horn, dispatch CISF QRT Margherita, and auto-flag P6 schedule hold.',
    linkedP6Activity: 'ACT-DJ-MAIN-58'
  },
  {
    id: 'THREAT-02',
    title: 'Wild Elephant Herd Crossing Dihing Patkai Corridor',
    type: 'WILDLIFE_MIGRATION',
    chainageKm: 24.4,
    gpsCoords: { lat: 27.3512, lng: 95.5921 },
    severity: 'MEDIUM',
    status: 'ACTIVE',
    timestamp: '22 mins ago',
    distanceFromPipeCenterMeters: 45.0,
    description: 'Herd of 14 wild elephants crossing pipeline RoW corridor. Forest Department protocol mandates temporary speed limit 20 km/h for construction trucks.',
    immediateAction: 'Notify Assam Forest Range Officer, halt pipe lowering crane movements until herd passes.',
    linkedP6Activity: 'ACT-DJ-PIPE-24'
  },
  {
    id: 'THREAT-03',
    title: 'Burhi Dihing Riverbed Scour & Flood Velocity Alarm',
    type: 'RIVER_SCOUR',
    chainageKm: 92.1,
    gpsCoords: { lat: 27.1852, lng: 95.3104 },
    severity: 'HIGH',
    status: 'ACTIVE',
    timestamp: '45 mins ago',
    distanceFromPipeCenterMeters: 0.0,
    description: 'Flash monsoon flow velocity exceeded 3.2 m/s, causing riverbed gravel scour down to depth 1.9m above submerged HDD bundle.',
    immediateAction: 'Deploy bathymetric drone sonar and review riverbank rip-rap rock armor integrity.',
    linkedP6Activity: 'ACT-DJ-HDD-92'
  },
  {
    id: 'THREAT-04',
    title: 'Acoustic Distributed Temperature Sensing (DTS) Metallic Tap Warning',
    type: 'ILLEGAL_TAP_ATTEMPT',
    chainageKm: 114.8,
    gpsCoords: { lat: 27.3195, lng: 95.3402 },
    severity: 'CRITICAL',
    status: 'ACTIVE',
    timestamp: 'Just now',
    distanceFromPipeCenterMeters: 1.2,
    description: 'Fiber-optic vibration sensor registered 3.8 kHz harmonic drilling signature characteristic of unauthorized saddle clamp tapping.',
    immediateAction: 'Dispatch CISF armed escort to Block Valve VS-04 and isolate sectionalizing valve MOV-401.',
    linkedP6Activity: 'ACT-DJ-SCADA-114'
  }
];
