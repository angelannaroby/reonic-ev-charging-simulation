import type { SimulationInputs } from "../types";

export const defaultSimulationInputs: SimulationInputs = {
  simulationDays: 365,
  chargepoints: 20,
  arrivalProbabilityScale: 100,
  carConsumptionKwhPer100Km: 18,
  chargingPowerKw: 11,
  useSeededRandomness: true,
};
