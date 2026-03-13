import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LoadProfileChartProps = {
  data: Array<{
    label: string;
    activePowerKw: number;
  }>;
};

export function LoadProfileChart({ data }: LoadProfileChartProps) {
  return (
    <div className="h-[360px] w-full lg:h-[440px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id="loadFillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22} />
              <stop
                offset="100%"
                stopColor="var(--accent)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            minTickGap={32}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            width={42}
            unit=" kW"
          />

          <Tooltip
            cursor={{ stroke: "var(--accent)", strokeDasharray: "4 4" }}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow)",
              fontSize: 12,
              color: "var(--text)",
            }}
            formatter={(value) => [
              `${Number(value ?? 0).toFixed(1)} kW`,
              "Power",
            ]}
            labelFormatter={(label) => `Time: ${label}`}
          />

          <Area
            type="monotone"
            dataKey="activePowerKw"
            stroke="var(--accent)"
            fill="url(#loadFillGradient)"
            strokeWidth={2.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
