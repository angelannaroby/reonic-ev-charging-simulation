import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type LoadProfileChartProps = {
  data: Array<{
    label: string
    activePowerKw: number
  }>
  actualPeakKw: number
}

export function LoadProfileChart({ data, actualPeakKw }: LoadProfileChartProps) {
  const yAxisUpperBound =
    Math.max(...data.map((point) => point.activePowerKw), actualPeakKw, 0) + 10

  return (
    <div className="h-[360px] w-full lg:h-[440px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
          <defs>
            <linearGradient id="loadFillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            minTickGap={36}
            height={36}
            label={{
              value: 'Simulation timeline (sampled)',
              position: 'insideBottom',
              offset: -4,
              style: { fill: 'var(--text-muted)', fontSize: 11 },
            }}
          />

          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            width={56}
            unit=" kW"
            domain={[0, yAxisUpperBound]}
          />

          <Tooltip
            cursor={{ stroke: 'var(--accent)', strokeDasharray: '4 4' }}
            contentStyle={{
              borderRadius: 14,
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              boxShadow: 'var(--shadow)',
              fontSize: 12,
              color: 'var(--text)',
            }}
            formatter={(value) => [`${Number(value ?? 0).toFixed(1)} kW`, 'Load']}
            labelFormatter={(label) => `${label}`}
          />

          <ReferenceLine
            y={actualPeakKw}
            stroke="var(--warning)"
            strokeDasharray="4 4"
            ifOverflow="extendDomain"
            label={{
              value: `Peak ${actualPeakKw.toFixed(1)} kW`,
              position: 'insideTopRight',
              fill: 'var(--warning)',
              fontSize: 11,
            }}
          />

          <Area
            type="monotone"
            dataKey="activePowerKw"
            stroke="var(--accent)"
            fill="url(#loadFillGradient)"
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
