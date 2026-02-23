"use client";

import { useFormContext } from "react-hook-form";
import { INDUSTRY_MULTIPLES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

const INDUSTRIES = [
  { key: "saas", label: "SaaS" },
  { key: "fintech", label: "Fintech" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "marketplace", label: "Marketplace" },
  { key: "healthtech", label: "Healthtech" },
] as const;

type IndustryKey = keyof typeof INDUSTRY_MULTIPLES;

export default function ComparableCompanyForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const e = errors as Record<string, { message?: string }>;
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>("saas");

  const revenue = Number(watch("annualRevenue")) || 0;
  const ebitda = Number(watch("ebitda")) || 0;
  const netIncome = Number(watch("netIncome")) || 0;
  const evRevMult = Number(watch("evRevenueMultiple")) || 0;
  const evEbMult = Number(watch("evEbitdaMultiple")) || 0;
  const peMult = Number(watch("peMultiple")) || 0;

  function applyIndustryMedians(industry: IndustryKey) {
    const m = INDUSTRY_MULTIPLES[industry];
    setValue("evRevenueMultiple", m.evRevenue.median);
    setValue("evEbitdaMultiple", m.evEbitda.median);
    setValue("peMultiple", m.pe.median);
  }

  const evFromRev = revenue * evRevMult;
  const evFromEB = ebitda > 0 ? ebitda * evEbMult : null;
  const eqFromPE = netIncome > 0 ? netIncome * peMult : null;
  const validVals = [evFromRev, evFromEB, eqFromPE].filter((v): v is number => v !== null && v > 0);
  const avg = validVals.length > 0 ? validVals.reduce((a, b) => a + b, 0) / validVals.length : 0;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Comparable Company Analysis:</strong> Values your company using
        EV/Revenue, EV/EBITDA, and P/E multiples from publicly traded peers.
      </div>

      {/* Industry preset */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          Load Industry Median Multiples
        </p>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.key}
              type="button"
              onClick={() => {
                setSelectedIndustry(ind.key);
                applyIndustryMedians(ind.key);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                selectedIndustry === ind.key
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-slate-600 border-slate-300 hover:border-navy"
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Company financials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="annualRevenue"
          label="Annual Revenue ($)"
          placeholder="e.g. 10000000"
          error={e["annualRevenue"]?.message}
          register={register("annualRevenue", { valueAsNumber: true })}
        />
        <InputField
          id="ebitda"
          label="EBITDA ($)"
          placeholder="e.g. 2000000"
          error={e["ebitda"]?.message}
          register={register("ebitda", { valueAsNumber: true })}
        />
        <InputField
          id="netIncome"
          label="Net Income ($)"
          placeholder="e.g. 1500000"
          error={e["netIncome"]?.message}
          register={register("netIncome", { valueAsNumber: true })}
        />
      </div>

      {/* Multiples */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="evRevenueMultiple"
          label="EV / Revenue Multiple"
          placeholder="e.g. 8"
          step={0.1}
          error={e["evRevenueMultiple"]?.message}
          register={register("evRevenueMultiple", { valueAsNumber: true })}
        />
        <InputField
          id="evEbitdaMultiple"
          label="EV / EBITDA Multiple"
          placeholder="e.g. 35"
          step={0.5}
          error={e["evEbitdaMultiple"]?.message}
          register={register("evEbitdaMultiple", { valueAsNumber: true })}
        />
        <InputField
          id="peMultiple"
          label="P/E Multiple"
          placeholder="e.g. 50"
          step={1}
          error={e["peMultiple"]?.message}
          register={register("peMultiple", { valueAsNumber: true })}
        />
      </div>

      {/* Implied valuations */}
      {revenue > 0 && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 text-slate-600 font-medium">Method</th>
                <th className="text-right px-4 py-2 text-slate-600 font-medium">Implied Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">EV / Revenue</td>
                <td className="px-4 py-2 text-right font-semibold">{formatCurrency(evFromRev)}</td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">EV / EBITDA</td>
                <td className="px-4 py-2 text-right font-semibold">
                  {evFromEB ? formatCurrency(evFromEB) : <span className="text-slate-400 font-normal">N/A (EBITDA ≤ 0)</span>}
                </td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">P / E</td>
                <td className="px-4 py-2 text-right font-semibold">
                  {eqFromPE ? formatCurrency(eqFromPE) : <span className="text-slate-400 font-normal">N/A (Net income ≤ 0)</span>}
                </td>
              </tr>
              <tr className="border-t-2 border-slate-300 bg-slate-50">
                <td className="px-4 py-2 font-semibold text-slate-800">Average</td>
                <td className="px-4 py-2 text-right font-bold text-navy text-base">
                  {avg > 0 ? formatCurrency(avg) : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InputField({
  id,
  label,
  placeholder,
  step = 1,
  error,
  register,
}: {
  id: string;
  label: string;
  placeholder: string;
  step?: number;
  error?: string;
  register: object;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-700 block">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        placeholder={placeholder}
        className="input w-full"
        {...(register as object)}
      />
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}
