// ============================================================================
// SiteSync - Energy-Optimization & Flow Digital Twin Simulator Engine
// Oil India Limited - 132 KM Digboi to Duliajan Crude Oil Trunkline
// ============================================================================

export interface FlowSimulationParams {
  flowRateM3H: number;         // 800 - 2200 m3/h
  inletTempC: number;          // 35 - 65 °C
  draPpm: number;              // 0 - 30 ppm (Drag Reducing Agent)
  subsoilTempC: number;        // 22 - 28 °C
  powerTariffPerKwh: number;   // ₹8.50 / kWh
}

export interface HydraulicProfilePoint {
  km: number;
  stationName?: string;
  elevationM: number;
  pressureBar: number;
  temperatureC: number;
  isWaxRisk: boolean;
  hglMeters: number;
}

export interface EnergyOptimizationResult {
  totalPowerMw: number;
  dailyEnergyMwh: number;
  dailyCostInrLakhs: number;
  co2TonsPerDay: number;
  optimizedParams: FlowSimulationParams;
  monthlySavingsInrLakhs: number;
  co2ReductionTonsPerMonth: number;
  profilePoints: HydraulicProfilePoint[];
}

export const BASELINE_FLOW_PARAMS: FlowSimulationParams = {
  flowRateM3H: 1420,
  inletTempC: 48,
  draPpm: 5,
  subsoilTempC: 24,
  powerTariffPerKwh: 8.5
};

export function simulateHydraulics(params: FlowSimulationParams): EnergyOptimizationResult {
  const { flowRateM3H, inletTempC, draPpm, subsoilTempC, powerTariffPerKwh } = params;

  // Assam Crude properties (API 32, Paraffinic Wax Appearance Temp WAT = 30.5°C)
  const pipeDiameterM = 0.584; // 24" OD with 11.1mm wall
  const pipeAreaM2 = Math.PI * Math.pow(pipeDiameterM / 2, 2);
  const velocityMS = (flowRateM3H / 3600) / pipeAreaM2;

  // Drag reduction percentage from DRA polymer
  const draFrictionReductionPct = Math.min(48, draPpm * 2.8);
  const frictionFactorBase = 0.018 * (1 - draFrictionReductionPct / 100);

  const profilePoints: HydraulicProfilePoint[] = [];
  const totalKm = 132;
  const numSteps = 14;

  let currentPressure = 64.0; // Bar at Digboi IPS discharge
  let currentTemp = inletTempC;

  for (let i = 0; i <= numSteps; i++) {
    const km = +(i * (totalKm / numSteps)).toFixed(1);
    
    // Elevation profile from Digboi (165m) to Duliajan (110m)
    let elev = 165 - (km / 132) * 55;
    if (km >= 30 && km <= 40) elev += 15; // Margherita hill spur
    if (km >= 85 && km <= 95) elev -= 25; // Burhi Dihing riverbed

    // Thermal decay across ground
    const tempDecay = (inletTempC - subsoilTempC) * Math.exp(-0.016 * km);
    currentTemp = +(subsoilTempC + tempDecay).toFixed(1);

    // Dynamic viscosity increase as crude cools towards WAT
    const viscosityMultiplier = currentTemp < 30.5 ? 1.65 : 1.0;
    const pressDropPerKm = (frictionFactorBase * 0.42 * Math.pow(velocityMS, 2) * viscosityMultiplier);

    if (km > 0) {
      currentPressure = Math.max(8.0, +(currentPressure - pressDropPerKm * (totalKm / numSteps)).toFixed(1));
    }

    // Intermediate booster pump pressure kick at Margherita KM 34.8
    if (km >= 34 && km <= 38) {
      currentPressure += 16.5; // Booster pump add
    }

    let stationName: string | undefined;
    if (km === 0) stationName = 'Digboi IPS-01';
    if (km >= 34 && km <= 38) stationName = 'Margherita BPS-02';
    if (km >= 68 && km <= 72) stationName = 'Namrup VS-03';
    if (km >= 90 && km <= 94) stationName = 'Burhi Dihing River';
    if (km === 132) stationName = 'Duliajan Refinery RIT-05';

    profilePoints.push({
      km,
      stationName,
      elevationM: Math.round(elev),
      pressureBar: currentPressure,
      temperatureC: currentTemp,
      isWaxRisk: currentTemp < 30.5,
      hglMeters: Math.round(elev + currentPressure * 10.2) // Hydraulic Grade Line in meters head
    });
  }

  // Energy & Power Calculations
  const totalHeadDeltaBar = 56.0 * (1 - draFrictionReductionPct / 180);
  const pumpEfficiency = 0.78;
  const powerKw = (totalHeadDeltaBar * 100000 * (flowRateM3H / 3600)) / (pumpEfficiency * 1000);
  const totalPowerMw = +(powerKw / 1000).toFixed(2);
  const dailyEnergyMwh = +(totalPowerMw * 24).toFixed(1);
  const dailyCostInrLakhs = +((dailyEnergyMwh * 1000 * powerTariffPerKwh) / 100000).toFixed(2);
  const co2TonsPerDay = +(dailyEnergyMwh * 0.82).toFixed(1); // 0.82 kg CO2 / kWh grid factor

  // Optimization comparison
  const monthlySavingsInrLakhs = +(dailyCostInrLakhs * 30 * 0.165).toFixed(1);
  const co2ReductionTonsPerMonth = +(co2TonsPerDay * 30 * 0.165).toFixed(0);

  return {
    totalPowerMw,
    dailyEnergyMwh,
    dailyCostInrLakhs,
    co2TonsPerDay,
    monthlySavingsInrLakhs,
    co2ReductionTonsPerMonth,
    optimizedParams: {
      ...params,
      draPpm: 15,
      inletTempC: 52
    },
    profilePoints
  };
}
