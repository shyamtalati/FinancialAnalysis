"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { formatCurrency } from "@/lib/utils";
import { calculateDCF } from "@/lib/valuations";

export default function DCFForm() {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields } = useFieldArray({ control, name: "freeCashFlows" });
  const e = errors as Record<string, { message?: string } | { [key: string]: { message?: string } }[]>;

  const fcfVals = watch("freeCashFlows") as number[] ?? [0, 0, 0, 0, 0];
  const wacc = Number(watch("wacc")) || 0.12;
  const tgr = Number(watch("terminalGrowthRate")) || 0.03;

  const liveDCF =
    wacc > tgr && fcfVals.length === 5
      ? calculateDCF({
          freeCashFlows: fcfVals as [number, number, number, number, number],
          wacc,
          terminalGrowthRate: tgr,
        })
      : null;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>DCF Method:</strong> Projects your free cash flows over 5 years,
        then adds a terminal value discounted back at your WACC. Negative cash
        flows are fine for high-growth companies.
      </div>

      {/* FCF table */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Free Cash Flow Projections ($)
        </h3>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 text-slate-600 font-medium">Year</th>
                <th className="text-right px-4 py-2 text-slate-600 font-medium">Free Cash Flow ($)</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                const fcfError = Array.isArray(e["freeCashFlows"])
                  ? (e["freeCashFlows"] as Array<{ message?: string } | undefined>)[idx]?.message
                  : undefined;
                return (
                  <tr key={field.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-700 font-medium">
                      Year {idx + 1}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step={100000}
                        placeholder="e.g. -500000 or 1000000"
                        className="w-full border border-slate-300 rounded px-2 py-1 text-right text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                        aria-label={`Year ${idx + 1} free cash flow`}
                        {...register(`freeCashFlows.${idx}`, {
                          valueAsNumber: true,
                        })}
                      />
                      {fcfError && (
                        <p className="text-xs text-red-600 mt-1" role="alert">
                          {fcfError}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WACC slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-start">
          <div>
            <label htmlFor="wacc" className="text-sm font-semibold text-slate-800 block">
              WACC (Weighted Avg. Cost of Capital)
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Typically 10–20% for high-growth startups
            </p>
          </div>
          <span className="text-lg font-bold text-navy" aria-live="polite">
            {(wacc * 100).toFixed(0)}%
          </span>
        </div>
        <input
          id="wacc"
          type="range"
          min={0.05}
          max={0.4}
          step={0.01}
          aria-valuemin={5}
          aria-valuemax={40}
          aria-valuenow={Math.round(wacc * 100)}
          aria-valuetext={`${(wacc * 100).toFixed(0)}%`}
          aria-label="WACC"
          {...register("wacc", { valueAsNumber: true })}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>5%</span><span>40%</span>
        </div>
        {(e["wacc"] as { message?: string })?.message && (
          <p className="text-xs text-red-600" role="alert">{(e["wacc"] as { message?: string }).message}</p>
        )}
      </div>

      {/* Terminal growth rate slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-start">
          <div>
            <label htmlFor="terminalGrowthRate" className="text-sm font-semibold text-slate-800 block">
              Terminal Growth Rate
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Long-term sustainable growth rate (typically 2–4%)
            </p>
          </div>
          <span className="text-lg font-bold text-navy" aria-live="polite">
            {(tgr * 100).toFixed(1)}%
          </span>
        </div>
        <input
          id="terminalGrowthRate"
          type="range"
          min={0}
          max={0.08}
          step={0.005}
          aria-valuemin={0}
          aria-valuemax={8}
          aria-valuenow={Math.round(tgr * 100)}
          aria-valuetext={`${(tgr * 100).toFixed(1)}%`}
          aria-label="Terminal Growth Rate"
          {...register("terminalGrowthRate", { valueAsNumber: true })}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>0%</span><span>8%</span>
        </div>
        {wacc <= tgr && (
          <p className="text-xs text-red-600" role="alert">
            WACC must be greater than the terminal growth rate
          </p>
        )}
      </div>

      {/* Live preview */}
      {liveDCF && liveDCF.value > 0 && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Live DCF Preview
          </p>
          <p className="text-2xl font-bold text-navy">
            {formatCurrency(liveDCF.value)}
          </p>
          {liveDCF.notes.map((n, i) => (
            <p key={i} className="text-xs text-slate-500">{n}</p>
          ))}
        </div>
      )}
    </div>
  );
}
