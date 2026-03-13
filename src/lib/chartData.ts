import type { LoadChartPoint } from "../types";

type SampledLoadPoint = {
  label: string;
  activePowerKw: number;
};

type DayChartPoint = {
  label: string;
  activePowerKw: number;
};

export function sampleLoadProfile(
  loadProfile: LoadChartPoint[],
  targetPoints = 96,
): SampledLoadPoint[] {
  if (loadProfile.length <= targetPoints) {
    return loadProfile.map((point) => ({
      label: `D${point.day + 1} ${formatQuarterHour(point.quarterHourIndex)}`,
      activePowerKw: point.activePowerKw,
    }));
  }

  const bucketSize = Math.ceil(loadProfile.length / targetPoints);
  const sampled: SampledLoadPoint[] = [];

  for (let start = 0; start < loadProfile.length; start += bucketSize) {
    const bucket = loadProfile.slice(start, start + bucketSize);

    if (bucket.length === 0) {
      continue;
    }

    let peakPoint = bucket[0];

    for (const point of bucket) {
      if (point.activePowerKw > peakPoint.activePowerKw) {
        peakPoint = point;
      }
    }

    sampled.push({
      label: `D${peakPoint.day + 1} ${formatQuarterHour(peakPoint.quarterHourIndex)}`,
      activePowerKw: Number(peakPoint.activePowerKw.toFixed(1)),
    });
  }

  return sampled;
}

export function buildAverageDayProfile(
  loadProfile: LoadChartPoint[],
): DayChartPoint[] {
  const slotsPerDay = 96;
  const totals = new Array(slotsPerDay).fill(0);
  const counts = new Array(slotsPerDay).fill(0);

  for (const point of loadProfile) {
    const slot = point.quarterHourIndex;

    if (slot < 0 || slot >= slotsPerDay) {
      continue;
    }

    totals[slot] += point.activePowerKw;
    counts[slot] += 1;
  }

  return totals.map((total, slot) => ({
    label: formatQuarterHour(slot),
    activePowerKw:
      counts[slot] > 0 ? Number((total / counts[slot]).toFixed(1)) : 0,
  }));
}

function formatQuarterHour(quarterHourIndex: number) {
  const totalMinutes = quarterHourIndex * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
