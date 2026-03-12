export const QUARTER_HOURS_PER_DAY = 96
export const TICK_DURATION_HOURS = 0.25
export const AVERAGE_DAYS_PER_MONTH = 365 / 12

export const ARRIVAL_PROBABILITIES_BY_HOUR: number[] = [
  0.0094, // 00:00 - 01:00
  0.0094, // 01:00 - 02:00
  0.0094, // 02:00 - 03:00
  0.0094, // 03:00 - 04:00
  0.0094, // 04:00 - 05:00
  0.0094, // 05:00 - 06:00
  0.0094, // 06:00 - 07:00
  0.0094, // 07:00 - 08:00
  0.0283, // 08:00 - 09:00
  0.0283, // 09:00 - 10:00
  0.0566, // 10:00 - 11:00
  0.0566, // 11:00 - 12:00
  0.0566, // 12:00 - 13:00
  0.0755, // 13:00 - 14:00
  0.0755, // 14:00 - 15:00
  0.0755, // 15:00 - 16:00
  0.1038, // 16:00 - 17:00
  0.1038, // 17:00 - 18:00
  0.1038, // 18:00 - 19:00
  0.0472, // 19:00 - 20:00
  0.0472, // 20:00 - 21:00
  0.0472, // 21:00 - 22:00
  0.0094, // 22:00 - 23:00
  0.0094, // 23:00 - 24:00
]

export const CHARGING_DEMAND_DISTRIBUTION: Array<{
  probability: number
  distanceKm: number
}> = [
  { probability: 0.3431, distanceKm: 0 },
  { probability: 0.049, distanceKm: 5 },
  { probability: 0.098, distanceKm: 10 },
  { probability: 0.1176, distanceKm: 20 },
  { probability: 0.0882, distanceKm: 30 },
  { probability: 0.1176, distanceKm: 50 },
  { probability: 0.1078, distanceKm: 100 },
  { probability: 0.049, distanceKm: 200 },
  { probability: 0.0294, distanceKm: 300 },
]