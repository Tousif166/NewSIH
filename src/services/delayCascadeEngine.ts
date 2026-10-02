// ============================================================================
// SiteSync AI: AI Delay Cascade Propagation Simulator (DAG Network Theory)
// Models CPM/PERT schedule ripple effects, float absorption, and commercial LD exposure
// Problem Statement SIH26122 (Oil India Limited)
// ============================================================================

export interface CascadeActivityNode {
  id: string;
  code: string;
  name: string;
  wbs: string;
  chainage: string;
  plannedDurationDays: number;
  earlyStartDay: number;
  earlyFinishDay: number;
  totalFloat: number;
  isCritical: boolean;
  predecessors: string[]; // activity IDs
  successors: string[];   // activity IDs
  contractor: string;
  dailyDemurrageRate: number; // in INR
}

export interface CascadeSimulationResult {
  simulatedNodeId: string;
  injectedDelayDays: number;
  projectSlipDays: number;
  totalLiquidatedDamages: number; // in INR
  totalDemurrageCost: number;     // in INR
  totalFinancialExposure: number; // in INR
  affectedNodes: Array<{
    nodeId: string;
    code: string;
    name: string;
    originalFinishDay: number;
    newFinishDay: number;
    delayPushedDays: number;
    floatConsumed: number;
    remainingFloat: number;
    becameCritical: boolean;
    cascadeLevel: number;
  }>;
  mitigationOptions: Array<{
    id: string;
    title: string;
    description: string;
    costInLakhs: number;
    daysRecovered: number;
    roiRatio: number;
    applied: boolean;
  }>;
}

export const INITIAL_NETWORK_NODES: CascadeActivityNode[] = [
  {
    id: 'ACT-ROW-01',
    code: 'ACT-ROW-01',
    name: 'Forest & RoW Statutory Clearance KM 38-46',
    wbs: 'WBS 1.1 Land & Statutory',
    chainage: 'KM 38+000 - KM 46+000',
    plannedDurationDays: 14,
    earlyStartDay: 0,
    earlyFinishDay: 14,
    totalFloat: 0,
    isCritical: true,
    predecessors: [],
    successors: ['ACT-TR-4290'],
    contractor: 'OIL RoW Department',
    dailyDemurrageRate: 25000
  },
  {
    id: 'ACT-TR-4290',
    code: 'ACT-TR-4290',
    name: 'Trenching & Rock Excavation KM 42+650',
    wbs: 'WBS 1.2 Pipeline Trenching',
    chainage: 'KM 42+650 - KM 44+200',
    plannedDurationDays: 20,
    earlyStartDay: 14,
    earlyFinishDay: 34,
    totalFloat: 0,
    isCritical: true,
    predecessors: ['ACT-ROW-01'],
    successors: ['ACT-HDD-104', 'ACT-WLD-102'],
    contractor: 'Punj Lloyd Infrastructure',
    dailyDemurrageRate: 140000
  },
  {
    id: 'ACT-WLD-102',
    code: 'ACT-WLD-102',
    name: 'Mainline Orbital Pipe Welding Spread 02',
    wbs: 'WBS 1.3 Mechanical Fabrication',
    chainage: 'KM 42+650 - KM 48+000',
    plannedDurationDays: 25,
    earlyStartDay: 30, // Start-to-Start lag
    earlyFinishDay: 55,
    totalFloat: 4,
    isCritical: false,
    predecessors: ['ACT-TR-4290'],
    successors: ['ACT-LOW-205'],
    contractor: 'Kalpataru Power EPC',
    dailyDemurrageRate: 95000
  },
  {
    id: 'ACT-HDD-104',
    code: 'ACT-HDD-104',
    name: 'Burhi Dihing River HDD Directional Crossing',
    wbs: 'WBS 1.4 Special River Crossings',
    chainage: 'KM 44+800 (Riverbed Section)',
    plannedDurationDays: 32,
    earlyStartDay: 34,
    earlyFinishDay: 66,
    totalFloat: 0,
    isCritical: true,
    predecessors: ['ACT-TR-4290'],
    successors: ['ACT-LOW-205', 'ACT-TIE-301'],
    contractor: 'Corrtech Energy HDD Division',
    dailyDemurrageRate: 210000
  },
  {
    id: 'ACT-LOW-205',
    code: 'ACT-LOW-205',
    name: 'Pipe Lowering & Buoyancy Anchor Sinking',
    wbs: 'WBS 1.5 Laying & Lowering',
    chainage: 'KM 42+650 - KM 46+000',
    plannedDurationDays: 12,
    earlyStartDay: 66,
    earlyFinishDay: 78,
    totalFloat: 0,
    isCritical: true,
    predecessors: ['ACT-HDD-104', 'ACT-WLD-102'],
    successors: ['ACT-TIE-301'],
    contractor: 'Punj Lloyd Infrastructure',
    dailyDemurrageRate: 80000
  },
  {
    id: 'ACT-TIE-301',
    code: 'ACT-TIE-301',
    name: 'Golden Weld Tie-In & NDT Radiography at SV-02',
    wbs: 'WBS 1.6 Sectional Integration',
    chainage: 'KM 46+100 (Sectional Valve 02)',
    plannedDurationDays: 8,
    earlyStartDay: 78,
    earlyFinishDay: 86,
    totalFloat: 0,
    isCritical: true,
    predecessors: ['ACT-LOW-205', 'ACT-HDD-104'],
    successors: ['ACT-HYD-401'],
    contractor: 'Kalpataru Power EPC',
    dailyDemurrageRate: 65000
  },
  {
    id: 'ACT-HYD-401',
    code: 'ACT-HYD-401',
    name: 'Sectional Hydrotesting 48-Hour Pressure Hold',
    wbs: 'WBS 1.7 QA & Hydrostatic Testing',
    chainage: 'KM 38+000 - KM 56+000',
    plannedDurationDays: 14,
    earlyStartDay: 86,
    earlyFinishDay: 100,
    totalFloat: 0,
    isCritical: true,
    predecessors: ['ACT-TIE-301'],
    successors: ['ACT-COM-501'],
    contractor: 'OIL QA / Hydrotest Crew',
    dailyDemurrageRate: 45000
  },
  {
    id: 'ACT-COM-501',
    code: 'ACT-COM-501',
    name: 'Nitrogen Purging & Crude Line Commissioning',
    wbs: 'WBS 1.8 Final Handover',
    chainage: 'KM 00+000 - KM 132+000',
    plannedDurationDays: 10,
    earlyStartDay: 100,
    earlyFinishDay: 110,
    totalFloat: 0,
    isCritical: true,
    predecessors: ['ACT-HYD-401'],
    successors: [],
    contractor: 'OIL Production Operations Duliajan',
    dailyDemurrageRate: 150000
  }
];

export function runDelayCascadeSimulation(
  targetNodeId: string,
  injectedDelay: number,
  activeMitigationIds: string[] = []
): CascadeSimulationResult {
  const nodesMap = new Map<string, CascadeActivityNode>();
  INITIAL_NETWORK_NODES.forEach(n => nodesMap.set(n.id, { ...n }));

  // Mitigation definitions
  const mitigations = [
    {
      id: 'MIT-01',
      title: 'Deploy Auxiliary Hydraulic Rock Ripper at KM 42+650',
      description: 'Mobilize 35-ton CAT Ripper with dual operator shifts to crush hard sandstone bedrock at 2x penetration rate.',
      costInLakhs: 19.25,
      daysRecovered: 6,
      roiRatio: 3.4,
      applied: activeMitigationIds.includes('MIT-01')
    },
    {
      id: 'MIT-02',
      title: 'Dual-Rig Parallel HDD Bore from North Riverbank',
      description: 'Second Vermeer 330 HDD rig deployed simultaneously from Burhi Dihing North bank to meet pilot hole at mid-river.',
      costInLakhs: 28.50,
      daysRecovered: 10,
      roiRatio: 2.8,
      applied: activeMitigationIds.includes('MIT-02')
    },
    {
      id: 'MIT-03',
      title: 'Fast-Track Automatic Orbital Welding 24h Night-Shift',
      description: 'Provide high-output floodlight mobile trailers and acoustic shelter to sustain 24-hr orbital welding on Spread 2.',
      costInLakhs: 14.80,
      daysRecovered: 5,
      roiRatio: 4.1,
      applied: activeMitigationIds.includes('MIT-03')
    }
  ];

  // Net delay after applying active mitigations
  let netDelay = injectedDelay;
  mitigations.forEach(m => {
    if (m.applied) {
      netDelay = Math.max(0, netDelay - m.daysRecovered);
    }
  });

  // Directed DAG ripple traversal using BFS queue
  const finishDelays = new Map<string, number>();
  finishDelays.set(targetNodeId, netDelay);

  const queue: { id: string; level: number }[] = [{ id: targetNodeId, level: 0 }];
  const visited = new Set<string>();

  const affectedNodes: CascadeSimulationResult['affectedNodes'] = [];

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const currentNode = nodesMap.get(id);
    if (!currentNode) continue;

    const delayOnCurrent = finishDelays.get(id) || 0;
    const floatConsumed = Math.min(currentNode.totalFloat, delayOnCurrent);
    const remainingFloat = Math.max(0, currentNode.totalFloat - delayOnCurrent);
    const downstreamPush = Math.max(0, delayOnCurrent - currentNode.totalFloat);

    affectedNodes.push({
      nodeId: currentNode.id,
      code: currentNode.code,
      name: currentNode.name,
      originalFinishDay: currentNode.earlyFinishDay,
      newFinishDay: currentNode.earlyFinishDay + delayOnCurrent,
      delayPushedDays: delayOnCurrent,
      floatConsumed,
      remainingFloat,
      becameCritical: remainingFloat === 0,
      cascadeLevel: level
    });

    // Ripple to successors
    currentNode.successors.forEach(succId => {
      const existingSuccDelay = finishDelays.get(succId) || 0;
      if (downstreamPush > existingSuccDelay) {
        finishDelays.set(succId, downstreamPush);
        queue.push({ id: succId, level: level + 1 });
      }
    });
  }

  // Calculate project-level impact at final milestone
  const finalNode = nodesMap.get('ACT-COM-501');
  const projectSlipDays = finalNode ? (finishDelays.get(finalNode.id) || 0) : netDelay;

  // Clause 27.1 Liquidated Damages: ₹1,50,000 / day of COD delay
  const totalLiquidatedDamages = projectSlipDays * 150000;

  // Demurrage on idle contractor equipment across delayed days
  let totalDemurrageCost = 0;
  affectedNodes.forEach(item => {
    const node = nodesMap.get(item.nodeId);
    if (node && item.delayPushedDays > 0) {
      totalDemurrageCost += (item.delayPushedDays * node.dailyDemurrageRate * 0.4); // 40% idle retention
    }
  });

  const totalFinancialExposure = totalLiquidatedDamages + totalDemurrageCost;

  return {
    simulatedNodeId: targetNodeId,
    injectedDelayDays: injectedDelay,
    projectSlipDays,
    totalLiquidatedDamages,
    totalDemurrageCost,
    totalFinancialExposure,
    affectedNodes,
    mitigationOptions: mitigations
  };
}
