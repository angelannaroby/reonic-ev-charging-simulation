import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DayProfileChartProps = {
  data: Array<{
    label: string;
    activePowerKw: number;
  }>;
};

export function DayProfileChart({ data }: DayProfileChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 4 }}
        >
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
            minTickGap={20}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            width={42}
            unit=" kW"
          />

          <Tooltip
            cursor={{ stroke: "var(--success)", strokeDasharray: "4 4" }}
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

          <Line
            type="monotone"
            dataKey="activePowerKw"
            stroke="var(--success)"
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
