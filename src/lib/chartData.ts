import type { LoadChartPoint } from '../types'

type SampledLoadPoint = {
  label: string
  activePowerKw: number
}

export function buildLoadProfileChartData(
  loadProfile: LoadChartPoint[],
  targetPoints = 96,
): SampledLoadPoint[] {
  if (loadProfile.length <= targetPoints) {
    return loadProfile.map((point) => ({
      label: `Day ${point.day + 1}`,
      activePowerKw: Number(point.activePowerKw.toFixed(1)),
    }))
  }

  const bucketSize = Math.ceil(loadProfile.length / targetPoints)
  const sampled: SampledLoadPoint[] = []

  for (let start = 0; start < loadProfile.length; start += bucketSize) {
    const bucket = loadProfile.slice(start, start + bucketSize)

    if (bucket.length === 0) {
      continue
    }

    let peakPoint = bucket[0]

    for (const point of bucket) {
      if (point.activePowerKw > peakPoint.activePowerKw) {
        peakPoint = point
      }
    }

    sampled.push({
      label: `Day ${peakPoint.day + 1}`,
      activePowerKw: Number(peakPoint.activePowerKw.toFixed(1)),
    })
  }

  return sampled
}
