import seedrandom from "seedrandom";

import {
  ARRIVAL_PROBABILITIES_BY_HOUR,
  AVERAGE_DAYS_PER_MONTH,
  CHARGING_DEMAND_DISTRIBUTION,
  QUARTER_HOURS_PER_DAY,
  TICK_DURATION_HOURS,
} from "./constants";
import type {
  DayProfilePoint,
  LoadChartPoint,
  SimulationInputs,
  SimulationResult,
} from "../types";

type ChargerState = {
  remainingEnergyKwh: number;
};

const DETERMINISTIC_SEED = "42";

function hourProbabilityToTickProbability(hourlyProbability: number): number {
  const probability = Math.min(Math.max(hourlyProbability, 0), 1);
  return 1 - Math.pow(1 - probability, 1 / 4);
}

function sampleChargingDemandKm(random: () => number): number {
  const draw = random();
  let cumulative = 0;

  for (const entry of CHARGING_DEMAND_DISTRIBUTION) {
    cumulative += entry.probability;

    if (draw <= cumulative) {
      return entry.distanceKm;
    }
  }

  return CHARGING_DEMAND_DISTRIBUTION.at(-1)?.distanceKm ?? 0;
}

function buildExemplaryDayProfile(
  loadProfile: LoadChartPoint[],
): DayProfilePoint[] {
  const dayToShow = loadProfile.length > QUARTER_HOURS_PER_DAY ? 1 : 0;

  return loadProfile
    .filter((point) => point.day === dayToShow)
    .map((point) => {
      const totalMinutes = point.quarterHourIndex * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        hourLabel: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        activePowerKw: point.activePowerKw,
      };
    });
}

export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const totalTicks = inputs.simulationDays * QUARTER_HOURS_PER_DAY;
  const energyPerTickKwh = inputs.chargingPowerKw * TICK_DURATION_HOURS;

  const random = inputs.useSeededRandomness
    ? seedrandom(DETERMINISTIC_SEED)
    : Math.random;

  const chargers: ChargerState[] = Array.from(
    { length: inputs.chargepoints },
    () => ({ remainingEnergyKwh: 0 }),
  );

  let totalEnergyKwh = 0;
  let actualPeakKw = 0;
  let totalChargingEvents = 0;

  const loadProfile: LoadChartPoint[] = [];

  for (let tick = 0; tick < totalTicks; tick += 1) {
    const quarterHourIndex = tick % QUARTER_HOURS_PER_DAY;
    const day = Math.floor(tick / QUARTER_HOURS_PER_DAY);
    const hourOfDay = Math.floor(quarterHourIndex / 4);

    const baseHourlyProbability =
      ARRIVAL_PROBABILITIES_BY_HOUR[hourOfDay] ??
      ARRIVAL_PROBABILITIES_BY_HOUR[0];

    const scaledHourlyProbability = Math.min(
      baseHourlyProbability * (inputs.arrivalProbabilityScale / 100),
      1,
    );

    const arrivalProbabilityPerTick = hourProbabilityToTickProbability(
      scaledHourlyProbability,
    );

    for (const charger of chargers) {
      if (charger.remainingEnergyKwh > 0) {
        continue;
      }

      if (random() >= arrivalProbabilityPerTick) {
        continue;
      }

      const distanceKm = sampleChargingDemandKm(random);

      if (distanceKm <= 0) {
        continue;
      }

      charger.remainingEnergyKwh =
        (distanceKm / 100) * inputs.carConsumptionKwhPer100Km;

      totalChargingEvents += 1;
    }

    let activeChargepoints = 0;

    for (const charger of chargers) {
      if (charger.remainingEnergyKwh <= 0) {
        charger.remainingEnergyKwh = 0;
        continue;
      }

      activeChargepoints += 1;

      const deliveredEnergyKwh = Math.min(
        charger.remainingEnergyKwh,
        energyPerTickKwh,
      );

      totalEnergyKwh += deliveredEnergyKwh;
      charger.remainingEnergyKwh = Math.max(
        0,
        charger.remainingEnergyKwh - deliveredEnergyKwh,
      );
    }

    const activePowerKw = activeChargepoints * inputs.chargingPowerKw;
    actualPeakKw = Math.max(actualPeakKw, activePowerKw);

    loadProfile.push({
      tick,
      day,
      quarterHourIndex,
      activePowerKw,
    });
  }

  const theoreticalPeakKw = inputs.chargepoints * inputs.chargingPowerKw;
  const concurrencyFactor =
    theoreticalPeakKw > 0 ? actualPeakKw / theoreticalPeakKw : 0;

  const averageChargingEventsPerDay =
    totalChargingEvents / Math.max(inputs.simulationDays, 1);

  return {
    totalEnergyKwh,
    theoreticalPeakKw,
    actualPeakKw,
    concurrencyFactor,
    totalChargingEvents,
    loadProfile,
    exemplaryDayProfile: buildExemplaryDayProfile(loadProfile),
    chargingEvents: {
      perDay: averageChargingEventsPerDay,
      perWeek: averageChargingEventsPerDay * 7,
      perMonth: averageChargingEventsPerDay * AVERAGE_DAYS_PER_MONTH,
      perYear: averageChargingEventsPerDay * 365,
    },
  };
}
