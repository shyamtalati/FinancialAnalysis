"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { MethodResult } from "@/lib/types";

interface ValuationRangeChartProps {
  methods: MethodResult[];
  midpoint: number;
}

function formatAxisVal(val: number): string {
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(0)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val}`;
}

// Colors per method key
const METHOD_COLORS: Record<string, string> = {
  berkus: "#6366f1",
  scorecard: "#8b5cf6",
  "vc-method": "#3E92CC",
  "arr-multiples": "#0A2463",
  dcf: "#16a34a",
  "comparable-company": "#d97706",
};

export default function ValuationRangeChart({
  methods,
  midpoint,
}: ValuationRangeChartProps) {
  const data = methods
    .filter((m) => m.value > 0)
    .map((m) => ({
      name: m.methodLabel.replace("Discounted Cash Flow ", "DCF").replace(" Analysis", ""),
      low: m.range.low,
      point: m.value,
      high: m.range.high,
      key: m.method,
    }));

  if (data.length === 0) return null;

  // For a range bar chart: use stacked bars where first bar = low (invisible), second = range
  const chartData = data.map((d) => ({
    name: d.name,
    key: d.key,
    base: d.low,            // transparent base
    range: d.high - d.low, // visible range
    point: d.point,
  }));

  return (
    <figure aria-label="Valuation range by method">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 80, left: 8, bottom: 8 }}
          >
            <XAxis
              type="number"
              tickFormatter={formatAxisVal}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(val, name) => {
                if (name === "base") return null;
                return [formatCurrency(Number(val)), "Range width"];
              }}
              labelFormatter={(label) => label}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            {/* Invisible base bar */}
            <Bar dataKey="base" stackId="a" fill="transparent" />
            {/* Visible range bar */}
            <Bar dataKey="range" stackId="a" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={METHOD_COLORS[entry.key] ?? "#64748b"}
                  fillOpacity={0.7}
                />
              ))}
            </Bar>
            {/* Midpoint reference line */}
            {midpoint > 0 && (
              <ReferenceLine
                x={midpoint}
                stroke="#FCA311"
                strokeWidth={2}
                strokeDasharray="4 2"
                label={{ value: "Mid", position: "top", fontSize: 11, fill: "#FCA311" }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Screen-reader table */}
      <table className="sr-only">
        <caption>Valuation range by method</caption>
        <thead>
          <tr>
            <th>Method</th>
            <th>Low</th>
            <th>Point Estimate</th>
            <th>High</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <td>{d.name}</td>
              <td>{formatCurrency(d.low)}</td>
              <td>{formatCurrency(d.point)}</td>
              <td>{formatCurrency(d.high)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
