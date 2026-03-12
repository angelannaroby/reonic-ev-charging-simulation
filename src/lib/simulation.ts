import {
  ARRIVAL_PROBABILITIES_BY_HOUR,
  AVERAGE_DAYS_PER_MONTH,
  CHARGING_DEMAND_DISTRIBUTION,
  QUARTER_HOURS_PER_DAY,
  TICK_DURATION_HOURS,
} from "./constants"
import type {
  DayProfilePoint,
  LoadChartPoint,
  SimulationInputs,
  SimulationResult,
} from "../types"

type ChargerState = {
  remainingTicks: number
}

const DETERMINISTIC_SEED = 42

function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return function random() {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hourProbabilityToTickProbability(hourProbability: number) {
  const clamped = Math.min(Math.max(hourProbability, 0), 1)
  return 1 - Math.pow(1 - clamped, 1 / 4)
}

function getArrivalProbabilityPerTick(hour: number, scalePercent: number) {
  const baseHourlyProbability =
    ARRIVAL_PROBABILITIES_BY_HOUR[hour] ?? ARRIVAL_PROBABILITIES_BY_HOUR[0]

  const scaledHourlyProbability = Math.min(
    baseHourlyProbability * (scalePercent / 100),
    1,
  )

  return hourProbabilityToTickProbability(scaledHourlyProbability)
}

function sampleChargingDistanceKm(random: () => number) {
  const draw = random()
  let cumulative = 0

  for (const entry of CHARGING_DEMAND_DISTRIBUTION) {
    cumulative += entry.probability

    if (draw <= cumulative) {
      return entry.distanceKm
    }
  }

  return CHARGING_DEMAND_DISTRIBUTION[CHARGING_DEMAND_DISTRIBUTION.length - 1]?.distanceKm ?? 0
}

function formatHourLabel(quarterHourIndex: number) {
  const totalMinutes = quarterHourIndex * 15
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function buildExemplaryDayProfile(loadProfile: LoadChartPoint[]): DayProfilePoint[] {
  const targetDay = loadProfile.length > QUARTER_HOURS_PER_DAY ? 1 : 0
  const points = loadProfile.filter((point) => point.day === targetDay)

  return points.map((point) => ({
    hourLabel: formatHourLabel(point.quarterHourIndex),
    activePowerKw: point.activePowerKw,
  }))
}

export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const totalTicks = inputs.simulationDays * QUARTER_HOURS_PER_DAY

  const random: () => number = inputs.useSeededRandomness
    ? createSeededRandom(DETERMINISTIC_SEED)
    : Math.random

  const chargers: ChargerState[] = Array.from({ length: inputs.chargepoints }, () => ({
    remainingTicks: 0,
  }))

  let totalEnergyKwh = 0
  let actualPeakKw = 0
  let totalChargingEvents = 0

  const loadProfile: LoadChartPoint[] = []

  for (let tick = 0; tick < totalTicks; tick += 1) {
    const quarterHourIndex = tick % QUARTER_HOURS_PER_DAY
    const day = Math.floor(tick / QUARTER_HOURS_PER_DAY)
    const hour = Math.floor(quarterHourIndex / 4)

    const arrivalProbabilityPerTick = getArrivalProbabilityPerTick(
      hour,
      inputs.arrivalProbabilityScale,
    )

    for (const charger of chargers) {
      if (charger.remainingTicks > 0) {
        continue
      }

      const carArrives = random() < arrivalProbabilityPerTick

      if (!carArrives) {
        continue
      }

      const distanceKm = sampleChargingDistanceKm(random)

      if (distanceKm <= 0) {
        continue
      }

      const energyNeededKwh =
        (distanceKm / 100) * inputs.carConsumptionKwhPer100Km
      const chargingDurationHours = energyNeededKwh / inputs.chargingPowerKw
      const requiredTicks = Math.max(
        1,
        Math.ceil(chargingDurationHours / TICK_DURATION_HOURS),
      )

      charger.remainingTicks = requiredTicks
      totalEnergyKwh += energyNeededKwh
      totalChargingEvents += 1
    }

    const activeChargers = chargers.filter((charger) => charger.remainingTicks > 0).length
    const activePowerKw = activeChargers * inputs.chargingPowerKw

    if (activePowerKw > actualPeakKw) {
      actualPeakKw = activePowerKw
    }

    loadProfile.push({
      tick,
      day,
      quarterHourIndex,
      activePowerKw,
    })

    for (const charger of chargers) {
      if (charger.remainingTicks > 0) {
        charger.remainingTicks -= 1
      }
    }
  }

  const theoreticalPeakKw = inputs.chargepoints * inputs.chargingPowerKw
  const concurrencyFactor =
    theoreticalPeakKw > 0 ? actualPeakKw / theoreticalPeakKw : 0

  const averageEventsPerDay =
    totalChargingEvents / Math.max(inputs.simulationDays, 1)

  return {
    totalEnergyKwh,
    theoreticalPeakKw,
    actualPeakKw,
    concurrencyFactor,
    totalChargingEvents,
    loadProfile,
    exemplaryDayProfile: buildExemplaryDayProfile(loadProfile),
    chargingEvents: {
      perDay: averageEventsPerDay,
      perWeek: averageEventsPerDay * 7,
      perMonth: averageEventsPerDay * AVERAGE_DAYS_PER_MONTH,
      perYear: averageEventsPerDay * 365,
    },
  }
}