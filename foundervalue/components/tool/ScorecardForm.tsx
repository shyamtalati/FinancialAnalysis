"use client";

import { useFormContext } from "react-hook-form";
import { SCORECARD_WEIGHTS } from "@/lib/constants";

const FACTORS = [
  {
    key: "teamWeight" as const,
    label: "Management Team",
    weight: SCORECARD_WEIGHTS.team,
    desc: "Experience, domain expertise, track record",
  },
  {
    key: "opportunityWeight" as const,
    label: "Size of Opportunity",
    weight: SCORECARD_WEIGHTS.opportunitySize,
    desc: "Total addressable market size and growth",
  },
  {
    key: "productWeight" as const,
    label: "Product / Technology",
    weight: SCORECARD_WEIGHTS.productTechnology,
    desc: "Defensibility, differentiation, IP",
  },
  {
    key: "competitiveWeight" as const,
    label: "Competitive Environment",
    weight: SCORECARD_WEIGHTS.competitiveEnvironment,
    desc: "Barriers to entry, current competitors",
  },
  {
    key: "salesWeight" as const,
    label: "Sales, Marketing & Partnerships",
    weight: SCORECARD_WEIGHTS.salesMarketing,
    desc: "Go-to-market clarity and strategic relationships",
  },
  {
    key: "additionalInvestmentWeight" as const,
    label: "Need for Additional Investment",
    weight: SCORECARD_WEIGHTS.additionalInvestment,
    desc: "How much runway this round provides",
  },
  {
    key: "otherWeight" as const,
    label: "Other Factors",
    weight: SCORECARD_WEIGHTS.other,
    desc: "Timing, regulatory environment, etc.",
  },
] as const;

function ratingLabel(val: number): string {
  if (val <= 0.5) return "Very Weak";
  if (val <= 0.9) return "Below Average";
  if (val <= 1.1) return "Average";
  if (val <= 1.5) return "Above Average";
  return "Very Strong";
}

function ratingColor(val: number): string {
  if (val <= 0.5) return "text-red-600";
  if (val <= 0.9) return "text-orange-500";
  if (val <= 1.1) return "text-slate-600";
  if (val <= 1.5) return "text-teal-600";
  return "text-green-600";
}

export default function ScorecardForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const baseVal = Number(watch("comparableAvgValuation")) || 0;
  const weightVals = FACTORS.map((f) => Number(watch(f.key)) || 1);
  const composite = FACTORS.reduce(
    (sum, f, i) => sum + weightVals[i] * f.weight,
    0
  );
  const impliedVal = baseVal * composite;

  const baseError = (errors as Record<string, { message?: string }>)["comparableAvgValuation"]?.message;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Scorecard Method:</strong> Start with the average pre-money
        valuation for comparable companies in your region/sector, then score
        your startup against 7 factors (0 = very weak, 1 = average, 2 = very
        strong).
      </div>

      {/* Baseline */}
      <div className="space-y-1">
        <label
          htmlFor="comparableAvgValuation"
          className="text-sm font-semibold text-slate-800 block"
        >
          Comparable Company Average Pre-Money Valuation ($)
        </label>
        <p className="text-xs text-slate-500">
          Average pre-seed / seed valuation in your region and sector
        </p>
        <input
          id="comparableAvgValuation"
          type="number"
          min={100000}
          step={100000}
          placeholder="e.g. 2000000"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          {...register("comparableAvgValuation", { valueAsNumber: true })}
        />
        {baseError && (
          <p className="text-xs text-red-600" role="alert">
            {baseError}
          </p>
        )}
      </div>

      {/* Factor sliders */}
      <div className="space-y-5">
        {FACTORS.map((factor, idx) => {
          const val = weightVals[idx];
          return (
            <div key={factor.key} className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-semibold text-slate-800">
                    {factor.label}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({(factor.weight * 100).toFixed(0)}% weight)
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">{factor.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-bold ${ratingColor(val)}`}
                    aria-live="polite"
                  >
                    {val.toFixed(1)}x
                  </span>
                  <p className={`text-xs ${ratingColor(val)}`}>
                    {ratingLabel(val)}
                  </p>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                aria-valuemin={0}
                aria-valuemax={2}
                aria-valuenow={val}
                aria-valuetext={`${val.toFixed(1)}x — ${ratingLabel(val)}`}
                aria-label={factor.label}
                {...register(factor.key, { valueAsNumber: true })}
              />
            </div>
          );
        })}
      </div>

      {/* Composite summary */}
      <div className="border-t border-slate-200 pt-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Composite multiplier</span>
          <span className="font-semibold text-slate-800">
            {composite.toFixed(2)}x
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Scorecard Valuation</span>
          <span className="text-xl font-bold text-navy">
            {impliedVal > 0
              ? `$${(impliedVal / 1_000_000).toFixed(2)}M`
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
