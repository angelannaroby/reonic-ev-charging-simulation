import type { SimulationResult } from '../types'

export type SummaryValues = {
  totalEnergyKwh: number | null
  theoreticalPeakKw: number | null
  actualPeakKw: number | null
  concurrencyPercent: number | null
}

export const EMPTY_SUMMARY: SummaryValues = {
  totalEnergyKwh: null,
  theoreticalPeakKw: null,
  actualPeakKw: null,
  concurrencyPercent: null,
}

export function getSummaryValues(result: SimulationResult): SummaryValues {
  return {
    totalEnergyKwh: result.totalEnergyKwh,
    theoreticalPeakKw: result.theoreticalPeakKw,
    actualPeakKw: result.actualPeakKw,
    concurrencyPercent: result.concurrencyFactor * 100,
  }
}
