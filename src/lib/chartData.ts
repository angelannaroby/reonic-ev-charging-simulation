import type { LoadChartPoint } from "../types";

type SampledLoadPoint = {
  label: string;
  activePowerKw: number;
};

type DayChartPoint = {
  label: string;
  activePowerKw: number;
};

export function buildLoadProfileChartData(
  loadProfile: LoadChartPoint[],
  targetPoints = 96,
): SampledLoadPoint[] {
  if (loadProfile.length <= targetPoints) {
    return loadProfile.map((point) => ({
      label: `Day ${point.day + 1}`,
      activePowerKw: Number(point.activePowerKw.toFixed(1)),
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
      label: `Day ${peakPoint.day + 1}`,
      activePowerKw: Number(peakPoint.activePowerKw.toFixed(1)),
    });
  }

  return sampled;
}

export function buildExemplaryDayProfile(
  loadProfile: LoadChartPoint[],
): DayChartPoint[] {
  // one full simulated day = 96 quarter-hour points
  const targetDay = loadProfile.length > 96 ? 1 : 0;
  const dayPoints = loadProfile.filter((point) => point.day === targetDay);

  return dayPoints.map((point) => ({
    label: formatQuarterHour(point.quarterHourIndex),
    activePowerKw: Number(point.activePowerKw.toFixed(1)),
  }));
}

function formatQuarterHour(quarterHourIndex: number) {
  const totalMinutes = quarterHourIndex * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
