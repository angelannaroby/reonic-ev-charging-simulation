import type { DayProfilePoint, LoadChartPoint } from "../types"

type SampledLoadPoint = {
  label: string
  activePowerKw: number
}

export function sampleLoadProfile(
  loadProfile: LoadChartPoint[],
  targetPoints = 96,
): SampledLoadPoint[] {
  if (loadProfile.length <= targetPoints) {
    return loadProfile.map((point) => ({
      label: `D${point.day + 1} ${formatQuarterHour(point.quarterHourIndex)}`,
      activePowerKw: point.activePowerKw,
    }))
  }

  const bucketSize = Math.ceil(loadProfile.length / targetPoints)
  const sampled: SampledLoadPoint[] = []

  for (let start = 0; start < loadProfile.length; start += bucketSize) {
    const bucket = loadProfile.slice(start, start + bucketSize)

    if (bucket.length === 0) {
      continue
    }

    const averagePower =
      bucket.reduce((sum, point) => sum + point.activePowerKw, 0) / bucket.length

    const first = bucket[0]

    sampled.push({
      label: `D${first.day + 1} ${formatQuarterHour(first.quarterHourIndex)}`,
      activePowerKw: Number(averagePower.toFixed(1)),
    })
  }

  return sampled
}

export function mapDayProfile(dayProfile: DayProfilePoint[]) {
  return dayProfile.map((point) => ({
    label: point.hourLabel,
    activePowerKw: point.activePowerKw,
  }))
}

function formatQuarterHour(quarterHourIndex: number) {
  const totalMinutes = quarterHourIndex * 15
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}