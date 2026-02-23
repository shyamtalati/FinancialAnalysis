"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DilutionChartProps {
  founderPercent: number;    // remaining founder ownership %
  investorPercent: number;   // new investor %
  otherPercent?: number;     // option pool / existing investors
  postMoney: number;
}

export default function DilutionChart({
  founderPercent,
  investorPercent,
  otherPercent = 0,
  postMoney,
}: DilutionChartProps) {
  const data = [
    { name: "Founder", value: founderPercent, color: "#0A2463" },
    { name: "New Investor", value: investorPercent, color: "#3E92CC" },
    ...(otherPercent > 0
      ? [{ name: "Other / Pool", value: otherPercent, color: "#94a3b8" }]
      : []),
  ].filter((d) => d.value > 0);

  return (
    <figure aria-label={`Dilution chart: Founder retains ${founderPercent.toFixed(1)}%, investor receives ${investorPercent.toFixed(1)}%`}>
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => [`${Number(val).toFixed(1)}%`]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-navy">
            {founderPercent.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-500">You keep</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-slate-600">
              {d.name}: {d.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Screen-reader accessible table */}
      <table className="sr-only">
        <caption>Equity ownership breakdown</caption>
        <thead>
          <tr>
            <th>Stakeholder</th>
            <th>Ownership %</th>
            <th>Implied Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}>
              <td>{d.name}</td>
              <td>{d.value.toFixed(1)}%</td>
              <td>{formatCurrency((d.value / 100) * postMoney)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
