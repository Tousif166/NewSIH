// ============================================================================
// SiteSync - AR Field Inspection Engine
// Oil India Limited - 132 KM Digboi to Duliajan Crude Oil Trunkline
// ============================================================================

export interface ARAnchorNode {
  id: string;
  label: string;
  type: 'WELD_JOINT' | 'BLOCK_VALVE' | 'CP_POST' | 'DEFECT_ANOMALY';
  screenPosition: { xPct: number; yPct: number }; // Relative position on AR viewport
  chainageKm: number;
  depthMeters: number;
  subsurface: boolean;
  status: 'VERIFIED' | 'WARNING' | 'CRITICAL' | 'PENDING';
  details: {
    title: string;
    spec: string;
    inspectionDate: string;
    inspector: string;
    p6ActivityId: string;
    metrics: Record<string, string>;
  };
}

export interface ARDefectTag {
  id: string;
  type: 'COATING_DAMAGE' | 'UNAUTHORIZED_ENCROACHMENT' | 'TRENCH_EROSION' | 'CP_LEAD_DISCONNECTED' | 'WELD_UNDERCUT';
  xPct: number;
  yPct: number;
  timestamp: string;
  notes: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  remedialSop: string;
}

export const INITIAL_AR_NODES: ARAnchorNode[] = [
  {
    id: 'AR-WELD-142',
    label: 'Joint Weld #DJ-142',
    type: 'WELD_JOINT',
    screenPosition: { xPct: 48, yPct: 56 },
    chainageKm: 42.38,
    depthMeters: 1.85,
    subsurface: true,
    status: 'VERIFIED',
    details: {
      title: '24" OD API 5L X65 Butt Weld',
      spec: 'ASME B31.4 / API 1104 Manual Shielded Metal Arc (SMAW)',
      inspectionDate: 'Today, 08:30 IST',
      inspector: 'Er. P. Gogoi (Level III ASNT)',
      p6ActivityId: 'ACT-DJ-WELD-42',
      metrics: {
        'Ultrasonic Testing (PAUT)': '100% ACCEPTED (No inclusions)',
        'Radiographic Film': 'PASS (Density 2.4 - ISO 17636)',
        'Preheat Temp': '145°C (Low Hydrogen)',
        'Joint Coating': '3M Scotchkote 206N Fusion Bonded Epoxy'
      }
    }
  },
  {
    id: 'AR-VALVE-12',
    label: 'Mainline Block Valve MOV-12',
    type: 'BLOCK_VALVE',
    screenPosition: { xPct: 76, yPct: 38 },
    chainageKm: 42.45,
    depthMeters: 0.0,
    subsurface: false,
    status: 'VERIFIED',
    details: {
      title: 'Valvitalia 24" Class 600 Slab Gate Valve',
      spec: 'Rotork IQ3 Multi-turn Intelligent Actuator',
      inspectionDate: 'Yesterday, 16:45 IST',
      inspector: 'SCADA Telemetry Autonomous Polling',
      p6ActivityId: 'ACT-DJ-VALV-12',
      metrics: {
        'Actuator Position': '100.0% FULL OPEN',
        'Line Pressure': '58.4 bar (Upstream) / 58.2 bar (Downstream)',
        'Stem Seal Torque': '48 Nm (Nominal)',
        'Emergency Shutdown': 'ARMED (SIL-3 Certified)'
      }
    }
  },
  {
    id: 'AR-CP-28',
    label: 'Cathodic Protection Test Post CP-28',
    type: 'CP_POST',
    screenPosition: { xPct: 24, yPct: 48 },
    chainageKm: 42.32,
    depthMeters: 0.0,
    subsurface: false,
    status: 'VERIFIED',
    details: {
      title: 'Deep Well Impressed Current Anode Bed Lead',
      spec: 'NACE SP0169 External Corrosion Direct Assessment',
      inspectionDate: 'Today, 07:15 IST',
      inspector: 'OIL Pipeline Integrity Unit',
      p6ActivityId: 'ACT-DJ-CP-08',
      metrics: {
        'Polarization Potential': '-1,165 mV (vs CSE - OISD Valid)',
        'Soil Resistivity': '4,920 ohm-cm (Moist Assam clay)',
        'Stray Current AC Interference': '1.2 V (Safe < 15V AC)'
      }
    }
  },
  {
    id: 'AR-ANOMALY-01',
    label: 'Coating Holiday Anomaly',
    type: 'DEFECT_ANOMALY',
    screenPosition: { xPct: 58, yPct: 65 },
    chainageKm: 42.39,
    depthMeters: 1.82,
    subsurface: true,
    status: 'WARNING',
    details: {
      title: 'External FBE Coating Holiday (0.4mm Pin Hole)',
      spec: 'Detected via 15kV High Voltage Holiday Detector',
      inspectionDate: 'Just now',
      inspector: 'Automated AR Computer Vision Detector',
      p6ActivityId: 'ACT-DJ-REPAIR-42',
      metrics: {
        'Defect Type': '3M Epoxy Coating Disbondment Pin-hole',
        'Holiday Voltage': '15.0 kV Spark Arc Registered',
        'Remedial SOP': 'Apply Canusa-CPS Heat Shrink Repair Patch',
        'CVC Non-Conformance Report': 'Auto-logged to Vigilance Ledger'
      }
    }
  }
];

export const SAMPLE_DEFECT_TEMPLATES = [
  {
    type: 'COATING_DAMAGE' as const,
    label: 'FBE Coating Holiday / Scratch',
    severity: 'MEDIUM' as const,
    remedialSop: 'Clean surface to Sa 2.5 and apply Canusa WrapidSleeve'
  },
  {
    type: 'UNAUTHORIZED_ENCROACHMENT' as const,
    label: 'Unauthorized Heavy Vehicle in 30m RoW',
    severity: 'HIGH' as const,
    remedialSop: 'Issue CISF eviction notice and pause trenching operations'
  },
  {
    type: 'TRENCH_EROSION' as const,
    label: 'Monsoon Rain Soil Slump / Subsidence',
    severity: 'HIGH' as const,
    remedialSop: 'Erect timber shoring cage before personnel re-entry'
  },
  {
    type: 'CP_LEAD_DISCONNECTED' as const,
    label: 'Test Post Anode Wire Snapped',
    severity: 'LOW' as const,
    remedialSop: 'Exothermic cad-weld new copper lead to trunkline wall'
  }
];
