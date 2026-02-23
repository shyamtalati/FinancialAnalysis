"use client";

import { useFormContext } from "react-hook-form";
import { formatCurrency } from "@/lib/utils";

export default function VCMethodForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const e = errors as Record<string, { message?: string }>;
  const irrRaw = Number(watch("targetIRR")) || 0.4;
  const irrDisplay = (irrRaw * 100).toFixed(0);

  const projRev = Number(watch("projectedYear5Revenue")) || 0;
  const multiple = Number(watch("industryRevenueMultiple")) || 0;
  const investment = Number(watch("investmentAmount")) || 0;
  const years = Number(watch("yearsToExit")) || 5;
  const termVal = projRev * multiple;
  const postMoney = termVal > 0 && years > 0
    ? termVal / Math.pow(1 + irrRaw, years)
    : 0;
  const preMoney = Math.max(postMoney - investment, 0);

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>VC Method:</strong> Works backwards from your expected exit
        value, discounted by the investor&apos;s target return (IRR), to derive
        today&apos;s pre-money valuation.
      </div>

      <Field
        id="projectedYear5Revenue"
        label="Projected Year 5 Revenue ($)"
        desc="Your expected annual revenue 5 years from now"
        error={e["projectedYear5Revenue"]?.message}
      >
        <input
          type="number"
          min={0}
          step={100000}
          placeholder="e.g. 10000000"
          className="input"
          {...register("projectedYear5Revenue", { valueAsNumber: true })}
        />
      </Field>

      <Field
        id="industryRevenueMultiple"
        label="Industry Revenue Multiple (x)"
        desc="Expected exit EV/Revenue multiple for your sector at exit"
        error={e["industryRevenueMultiple"]?.message}
      >
        <input
          type="number"
          min={1}
          max={50}
          step={0.5}
          placeholder="e.g. 8"
          className="input"
          {...register("industryRevenueMultiple", { valueAsNumber: true })}
        />
      </Field>

      <Field
        id="investmentAmount"
        label="Investment Amount ($)"
        desc="How much the investor is putting in this round"
        error={e["investmentAmount"]?.message}
      >
        <input
          type="number"
          min={10000}
          step={50000}
          placeholder="e.g. 1000000"
          className="input"
          {...register("investmentAmount", { valueAsNumber: true })}
        />
      </Field>

      <Field
        id="yearsToExit"
        label="Years to Exit"
        desc="Expected years until acquisition or IPO"
        error={e["yearsToExit"]?.message}
      >
        <input
          type="number"
          min={1}
          max={15}
          step={1}
          placeholder="e.g. 5"
          className="input"
          {...register("yearsToExit", { valueAsNumber: true })}
        />
      </Field>

      {/* IRR slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div>
            <label htmlFor="targetIRR" className="text-sm font-semibold text-slate-800 block">
              Target IRR (investor&apos;s required return)
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Seed investors typically target 40–60% IRR; Series A: 25–35%
            </p>
          </div>
          <span className="text-lg font-bold text-navy" aria-live="polite">
            {irrDisplay}%
          </span>
        </div>
        <input
          id="targetIRR"
          type="range"
          min={0.05}
          max={0.99}
          step={0.01}
          aria-valuemin={5}
          aria-valuemax={99}
          aria-valuenow={Number(irrDisplay)}
          aria-valuetext={`${irrDisplay}%`}
          aria-label="Target IRR"
          {...register("targetIRR", { valueAsNumber: true })}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>5%</span>
          <span>99%</span>
        </div>
        {e["targetIRR"]?.message && (
          <p className="text-xs text-red-600" role="alert">
            {e["targetIRR"].message}
          </p>
        )}
      </div>

      {/* Live preview */}
      {projRev > 0 && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Live Preview
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-slate-500">Terminal Value</p>
              <p className="font-bold text-slate-800">{formatCurrency(termVal)}</p>
            </div>
            <div>
              <p className="text-slate-500">Post-money</p>
              <p className="font-bold text-slate-800">{formatCurrency(postMoney)}</p>
            </div>
            <div>
              <p className="text-slate-500">Pre-money</p>
              <p className="font-bold text-navy">{formatCurrency(preMoney)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  desc,
  error,
  children,
}: {
  id: string;
  label: string;
  desc: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800 block">
        {label}
      </label>
      <p className="text-xs text-slate-500">{desc}</p>
      {children}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
