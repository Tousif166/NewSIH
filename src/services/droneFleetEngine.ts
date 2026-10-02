// ============================================================================
// SiteSync - Drone Fleet Progress Imaging & Orthophoto Timeline Engine
// Oil India Limited - 132 KM Digboi to Duliajan Crude Oil Trunkline
// ============================================================================

export interface DroneUAV {
  id: string;
  callsign: string;
  sector: string;
  chainageRange: string;
  model: string;
  payload: string;
  batteryPct: number;
  status: 'IN_FLIGHT' | 'CHARGING_DOCK' | 'STANDBY';
  altitudeMeters: number;
  flightSpeedKmh: number;
  gsdResolutionCm: number; // Ground Sampling Distance
  telemetry: {
    lat: number;
    lng: number;
    gpsSatellites: number;
    windSpeedKmh: number;
  };
}

export interface OrthophotoComparisonPoint {
  id: string;
  locationName: string;
  chainageKm: number;
  baselineDate: string;
  currentDate: string;
  baselineStage: string;
  currentStage: string;
  volumetricCutM3: number;
  volumetricFillM3: number;
  trenchDepthDesignM: number;
  trenchDepthMeasuredM: number;
  aiDetections: {
    label: string;
    count: number;
    confidencePct: number;
    category: 'PIPE' | 'EQUIPMENT' | 'HAZARD' | 'ENCROACHMENT';
  }[];
}

export const DRONE_FLEET_DATA: DroneUAV[] = [
  {
    id: 'UAV-ALPHA',
    callsign: 'OIL-SkyGuardian-Alpha',
    sector: 'Sector 1 (Digboi - Margherita)',
    chainageRange: 'Ch. 0.0 to Ch. 34.8',
    model: 'DJI Matrice 350 RTK Enterprise',
    payload: 'Zenmuse P1 45MP Full-Frame Photogrammetry',
    batteryPct: 82,
    status: 'IN_FLIGHT',
    altitudeMeters: 120,
    flightSpeedKmh: 42,
    gsdResolutionCm: 1.15,
    telemetry: {
      lat: 27.3914,
      lng: 95.6289,
      gpsSatellites: 26,
      windSpeedKmh: 11
    }
  },
  {
    id: 'UAV-BRAVO',
    callsign: 'OIL-SkyGuardian-Bravo',
    sector: 'Sector 2 (Margherita - Namrup)',
    chainageRange: 'Ch. 34.8 to Ch. 68.4',
    model: 'DJI Matrice 300 RTK + D-RTK 2 Base',
    payload: 'Zenmuse L2 Airborne LiDAR (240 pts/m²)',
    batteryPct: 67,
    status: 'IN_FLIGHT',
    altitudeMeters: 95,
    flightSpeedKmh: 36,
    gsdResolutionCm: 1.80,
    telemetry: {
      lat: 27.2418,
      lng: 95.4215,
      gpsSatellites: 24,
      windSpeedKmh: 14
    }
  },
  {
    id: 'UAV-GAMMA',
    callsign: 'OIL-RiverScout-Gamma',
    sector: 'Sector 3 (Burhi Dihing River Crossing)',
    chainageRange: 'Ch. 68.4 to Ch. 98.2',
    model: 'Hexacopter Heavy Lift Geotechnical',
    payload: 'Dual RGB + Multibeam Riverbed Bathymetry',
    batteryPct: 94,
    status: 'STANDBY',
    altitudeMeters: 0,
    flightSpeedKmh: 0,
    gsdResolutionCm: 0.85,
    telemetry: {
      lat: 27.1852,
      lng: 95.3104,
      gpsSatellites: 28,
      windSpeedKmh: 8
    }
  },
  {
    id: 'UAV-DELTA',
    callsign: 'OIL-RefineryPatrol-Delta',
    sector: 'Sector 4 (Namrup - Duliajan Refinery)',
    chainageRange: 'Ch. 98.2 to Ch. 132.0',
    model: 'DJI Matrice 350 RTK Dock Version',
    payload: 'Zenmuse H20N Starlight Night Vision + FLIR Thermal',
    batteryPct: 98,
    status: 'CHARGING_DOCK',
    altitudeMeters: 0,
    flightSpeedKmh: 0,
    gsdResolutionCm: 1.50,
    telemetry: {
      lat: 27.3482,
      lng: 95.3195,
      gpsSatellites: 25,
      windSpeedKmh: 6
    }
  }
];

export const ORTHOPHOTO_SECTORS: OrthophotoComparisonPoint[] = [
  {
    id: 'ORTHO-01',
    locationName: 'Burhi Dihing HDD Crossing West Bank',
    chainageKm: 92.4,
    baselineDate: '12-Feb-2026 (Week 06 Baseline)',
    currentDate: '02-Oct-2026 (Week 38 Latest Flight)',
    baselineStage: 'Dense vegetation & unexcavated virgin floodplain',
    currentStage: 'HDD Entry Rig deployed, 24" pipe string welded & hydrotested',
    volumetricCutM3: 16840,
    volumetricFillM3: 13920,
    trenchDepthDesignM: 2.40,
    trenchDepthMeasuredM: 2.38,
    aiDetections: [
      { label: 'Stringed 24" API 5L X65 Pipe Joints', count: 28, confidencePct: 98.4, category: 'PIPE' },
      { label: 'CAT 336 Hydraulic Excavator', count: 2, confidencePct: 96.1, category: 'EQUIPMENT' },
      { label: 'Trench Rainwater Pooling (>0.3m depth)', count: 1, confidencePct: 92.8, category: 'HAZARD' },
      { label: 'Temporary RoW Perimeter Barricade', count: 140, confidencePct: 95.0, category: 'EQUIPMENT' }
    ]
  },
  {
    id: 'ORTHO-02',
    locationName: 'Margherita Tea Estate Corridor Segment',
    chainageKm: 38.6,
    baselineDate: '18-Jan-2026 (Week 03 Baseline)',
    currentDate: '28-Sep-2026 (Week 37 Latest Flight)',
    baselineStage: 'Survey pegs demarcating 30m legal Right of Way',
    currentStage: 'Continuous excavated trench with sand padding laid',
    volumetricCutM3: 9420,
    volumetricFillM3: 8100,
    trenchDepthDesignM: 2.20,
    trenchDepthMeasuredM: 2.19,
    aiDetections: [
      { label: 'API 5L X65 Coated Pipe Joints', count: 34, confidencePct: 99.1, category: 'PIPE' },
      { label: 'Mobile Diesel Welding Generator Skid', count: 3, confidencePct: 94.2, category: 'EQUIPMENT' },
      { label: 'Unauthorized Farmer Tractor in 30m RoW', count: 1, confidencePct: 88.5, category: 'ENCROACHMENT' }
    ]
  }
];
