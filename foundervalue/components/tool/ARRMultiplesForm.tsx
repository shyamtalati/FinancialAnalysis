"use client";

import { useFormContext } from "react-hook-form";
import { calculateRuleOf40 } from "@/lib/valuations";
import { formatCurrency } from "@/lib/utils";

const tierColors = {
  premium: "text-green-600 bg-green-50 border-green-200",
  good: "text-teal-700 bg-teal-50 border-teal-200",
  average: "text-amber-700 bg-amber-50 border-amber-200",
  below: "text-red-600 bg-red-50 border-red-200",
};

const tierLabels = {
  premium: "Premium (60+)",
  good: "Good (40–60)",
  average: "Average (20–40)",
  below: "Below Average (<20)",
};

export default function ARRMultiplesForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const e = errors as Record<string, { message?: string }>;
  const arr = Number(watch("currentARR")) || 0;
  const growthRate = Number(watch("revenueGrowthRate")) || 0;
  const margin = Number(watch("netProfitMargin")) || 0;
  const customMultiple = watch("customMultiple");

  const rof40 = calculateRuleOf40(growthRate, margin);
  const multiple = customMultiple ? Number(customMultiple) : rof40.suggestedMultiple;
  const valuation = arr * multiple;

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>ARR Multiples:</strong> SaaS companies are valued as a multiple
        of Annual Recurring Revenue. The multiple is driven by your Rule of 40
        score (growth rate + profit margin).
      </div>

      <div className="space-y-1">
        <label htmlFor="currentARR" className="text-sm font-semibold text-slate-800 block">
          Current ARR ($)
        </label>
        <p className="text-xs text-slate-500">Annual Recurring Revenue</p>
        <input
          id="currentARR"
          type="number"
          min={1}
          step={10000}
          placeholder="e.g. 1000000"
          className="input"
          {...register("currentARR", { valueAsNumber: true })}
        />
        {e["currentARR"]?.message && (
          <p className="text-xs text-red-600" role="alert">{e["currentARR"].message}</p>
        )}
      </div>

      {/* Growth rate slider */}
      <SliderField
        id="revenueGrowthRate"
        label="Annual Revenue Growth Rate"
        desc="YoY revenue growth (e.g. 1.0 = 100% growth)"
        min={0}
        max={5}
        step={0.05}
        value={growthRate}
        displayValue={`${(growthRate * 100).toFixed(0)}%`}
        register={register("revenueGrowthRate", { valueAsNumber: true })}
        minLabel="0%"
        maxLabel="500%"
        error={e["revenueGrowthRate"]?.message}
      />

      {/* Profit margin slider */}
      <SliderField
        id="netProfitMargin"
        label="Net Profit Margin"
        desc="Net income / revenue (negative for unprofitable companies)"
        min={-1}
        max={0.5}
        step={0.01}
        value={margin}
        displayValue={`${(margin * 100).toFixed(0)}%`}
        register={register("netProfitMargin", { valueAsNumber: true })}
        minLabel="-100%"
        maxLabel="+50%"
        error={e["netProfitMargin"]?.message}
      />

      {/* Rule of 40 display */}
      <div className={`border rounded-lg p-4 ${tierColors[rof40.tier]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">Rule of 40</p>
            <p className="text-2xl font-bold mt-1">{rof40.score.toFixed(0)}</p>
            <p className="text-xs mt-0.5">{tierLabels[rof40.tier]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide">Suggested Multiple</p>
            <p className="text-2xl font-bold mt-1">{rof40.suggestedMultiple}x</p>
          </div>
        </div>
      </div>

      {/* Optional custom multiple */}
      <div className="space-y-1">
        <label htmlFor="customMultiple" className="text-sm font-semibold text-slate-800 block">
          Custom Multiple Override (optional)
        </label>
        <p className="text-xs text-slate-500">
          Leave blank to use Rule of 40 suggested multiple
        </p>
        <input
          id="customMultiple"
          type="number"
          min={1}
          max={100}
          step={0.5}
          placeholder={`Default: ${rof40.suggestedMultiple}x`}
          className="input"
          {...register("customMultiple", { valueAsNumber: true })}
        />
      </div>

      {/* Live result */}
      {arr > 0 && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">
                ARR × {multiple}x multiple
              </p>
              <p className="text-2xl font-bold text-navy">
                {formatCurrency(valuation)}
              </p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Range</p>
              <p className="font-semibold">
                {formatCurrency(arr * multiple * 0.75)} – {formatCurrency(arr * multiple * 1.25)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderField({
  id,
  label,
  desc,
  min,
  max,
  step,
  value,
  displayValue,
  register,
  minLabel,
  maxLabel,
  error,
}: {
  id: string;
  label: string;
  desc: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  register: object;
  minLabel: string;
  maxLabel: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-start">
        <div>
          <label htmlFor={id} className="text-sm font-semibold text-slate-800 block">
            {label}
          </label>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
        <span className="text-lg font-bold text-navy" aria-live="polite">
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        aria-label={label}
        {...(register as object)}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}
