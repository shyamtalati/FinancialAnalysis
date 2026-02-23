"use client";

import { useFormContext } from "react-hook-form";
import { formatCurrency } from "@/lib/utils";

const FACTORS = [
  {
    key: "soundIdea" as const,
    label: "Sound Idea",
    desc: "Basic value / reduces idea risk",
  },
  {
    key: "prototype" as const,
    label: "Prototype",
    desc: "Working prototype / reduces technology risk",
  },
  {
    key: "managementTeam" as const,
    label: "Quality Management Team",
    desc: "Experienced team / reduces execution risk",
  },
  {
    key: "strategicRelationships" as const,
    label: "Strategic Relationships",
    desc: "Key partnerships / reduces market risk",
  },
  {
    key: "productRollout" as const,
    label: "Product Rollout / Sales",
    desc: "Early customers / reduces financial risk",
  },
] as const;

export default function BerkusForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const values = watch(FACTORS.map((f) => f.key));
  const total = values.reduce((sum: number, v: unknown) => sum + (Number(v) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Berkus Method:</strong> Assign up to $500K for each risk factor
        your startup has addressed. Maximum total: $2.5M.
      </div>

      {FACTORS.map((factor, idx) => {
        const val = Number(values[idx]) || 0;
        const fieldName = factor.key;
        const errorMsg = (errors as Record<string, { message?: string }>)[fieldName]?.message;

        return (
          <div key={factor.key} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <label
                  htmlFor={fieldName}
                  className="text-sm font-semibold text-slate-800 block"
                >
                  {factor.label}
                </label>
                <p className="text-xs text-slate-500 mt-0.5">{factor.desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-sm font-mono font-bold text-navy min-w-[80px] text-right"
                  aria-live="polite"
                >
                  {formatCurrency(val)}
                </span>
                <input
                  id={`${fieldName}-num`}
                  type="number"
                  min={0}
                  max={500000}
                  step={10000}
                  className="w-24 border border-slate-300 rounded px-2 py-1 text-sm text-right focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                  value={val}
                  onChange={(e) =>
                    setValue(fieldName, Math.min(Number(e.target.value), 500000), {
                      shouldValidate: true,
                    })
                  }
                  aria-label={`${factor.label} dollar amount`}
                />
              </div>
            </div>
            <input
              id={fieldName}
              type="range"
              min={0}
              max={500000}
              step={10000}
              aria-valuemin={0}
              aria-valuemax={500000}
              aria-valuenow={val}
              aria-valuetext={formatCurrency(val)}
              aria-label={factor.label}
              className="w-full"
              {...register(fieldName, { valueAsNumber: true })}
            />
            {errorMsg && (
              <p className="text-xs text-red-600" role="alert">
                {errorMsg}
              </p>
            )}
          </div>
        );
      })}

      <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Berkus Total
        </span>
        <div className="text-right">
          <span className="text-xl font-bold text-navy">
            {formatCurrency(Math.min(total, 2_500_000))}
          </span>
          {total > 2_500_000 && (
            <p className="text-xs text-amber-600 mt-0.5">Capped at $2.5M</p>
          )}
        </div>
      </div>
    </div>
  );
}
