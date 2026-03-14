export type SimulationInputs = {
  simulationDays: number
  chargepoints: number
  arrivalProbabilityScale: number
  carConsumptionKwhPer100Km: number
  chargingPowerKw: number
  useSeededRandomness: boolean
}

export type SummaryMetric = {
  label: string
  value: number | null
  unit?: string
  icon: 'energy' | 'theoretical' | 'actual' | 'concurrency'
  maximumFractionDigits?: number
}

export type LoadChartPoint = {
  tick: number
  day: number
  quarterHourIndex: number
  activePowerKw: number
}

export type DayProfilePoint = {
  hourLabel: string
  activePowerKw: number
}

export type ChargingEventSummary = {
  perYear: number
  perMonth: number
  perWeek: number
  perDay: number
}

export type SimulationResult = {
  totalEnergyKwh: number
  theoreticalPeakKw: number
  actualPeakKw: number
  concurrencyFactor: number
  totalChargingEvents: number
  loadProfile: LoadChartPoint[]
  exemplaryDayProfile: DayProfilePoint[]
  chargingEvents: ChargingEventSummary
}
