"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StageSlug, OfferEvaluationResult } from "@/lib/types";
import { evaluateOffer } from "@/lib/valuations";
import { offerSchema, type OfferFormValues } from "@/lib/schemas";
import { formatCurrency, formatPercent } from "@/lib/utils";
import DilutionChart from "./DilutionChart";

interface OfferEvaluatorProps {
  fairValueRange: { low: number; high: number };
  stage: StageSlug;
}

const verdictConfig = {
  "significantly-overvalued": {
    label: "Significantly Over Fair Value",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "↑↑",
    desc: "The offer values you well above your calculated fair value — excellent outcome for you.",
  },
  overvalued: {
    label: "Above Fair Value",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: "↑",
    desc: "The offer is above your fair value range — a favorable deal.",
  },
  fair: {
    label: "Fair Value",
    color: "bg-teal-50 text-teal-800 border-teal-200",
    icon: "✓",
    desc: "The offer falls within your calculated fair value range.",
  },
  undervalued: {
    label: "Below Fair Value",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: "↓",
    desc: "The proposed valuation is below fair value — consider negotiating a higher pre-money.",
  },
  "significantly-undervalued": {
    label: "Significantly Below Fair Value",
    color: "bg-red-50 text-red-800 border-red-200",
    icon: "↓↓",
    desc: "The offer significantly undervalues your company — strong grounds to negotiate or decline.",
  },
};

export default function OfferEvaluator({ fairValueRange, stage }: OfferEvaluatorProps) {
  const [result, setResult] = useState<OfferEvaluationResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      investmentAmount: 1_000_000,
      proposedPreMoney: Math.round(fairValueRange.low + (fairValueRange.high - fairValueRange.low) * 0.5),
    },
  });

  const onSubmit = (data: OfferFormValues) => {
    const r = evaluateOffer(data, fairValueRange, stage);
    setResult(r);
    setTimeout(() => {
      document.getElementById("offer-result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const vc = verdictConfig[result?.verdict ?? "fair"];

  return (
    <section
      aria-labelledby="offer-heading"
      className="border border-slate-200 rounded-2xl overflow-hidden"
    >
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <h2 id="offer-heading" className="text-lg font-bold text-navy">
          Offer Evaluator
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Fair value range: {formatCurrency(fairValueRange.low)} –{" "}
          {formatCurrency(fairValueRange.high)}
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="investmentAmount"
                className="text-sm font-semibold text-slate-800 block"
              >
                Investment Amount ($)
              </label>
              <p className="text-xs text-slate-500">How much the investor is putting in</p>
              <input
                id="investmentAmount"
                type="number"
                min={1000}
                step={50000}
                placeholder="e.g. 1000000"
                className="input"
                {...register("investmentAmount", { valueAsNumber: true })}
              />
              {errors.investmentAmount && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.investmentAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="proposedPreMoney"
                className="text-sm font-semibold text-slate-800 block"
              >
                Proposed Pre-Money Valuation ($)
              </label>
              <p className="text-xs text-slate-500">The valuation they&apos;re offering you</p>
              <input
                id="proposedPreMoney"
                type="number"
                min={1000}
                step={100000}
                placeholder="e.g. 5000000"
                className="input"
                {...register("proposedPreMoney", { valueAsNumber: true })}
              />
              {errors.proposedPreMoney && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.proposedPreMoney.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-dark transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Evaluate This Offer
          </button>
        </form>

        {/* Results */}
        {result && (
          <div id="offer-result" className="mt-6 space-y-5">
            {/* Verdict badge */}
            <div
              className={`border rounded-xl p-4 ${verdictConfig[result.verdict].color}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{verdictConfig[result.verdict].icon}</span>
                <div>
                  <p className="font-bold">{verdictConfig[result.verdict].label}</p>
                  <p className="text-sm mt-0.5 opacity-80">
                    {verdictConfig[result.verdict].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Key metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Metric label="Post-Money" value={formatCurrency(result.postMoney)} />
              <Metric
                label="Your Dilution"
                value={`${result.dilutionPercent.toFixed(1)}%`}
                highlight={result.dilutionPercent > 25}
              />
              <Metric
                label="You Retain"
                value={`${result.founderRetainedPercent.toFixed(1)}%`}
              />
              <Metric
                label="Investor IRR"
                value={formatPercent(result.impliedIRR)}
                note="(implied)"
              />
            </div>

            {/* Dilution chart */}
            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Ownership After Investment
              </h3>
              <DilutionChart
                founderPercent={result.founderRetainedPercent}
                investorPercent={result.dilutionPercent}
                postMoney={result.postMoney}
              />
            </div>

            {/* Flags */}
            {(result.redFlags.length > 0 || result.greenFlags.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.redFlags.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-1.5">
                      <span>⚠</span> Watch out
                    </h3>
                    <ul className="space-y-1.5">
                      {result.redFlags.map((flag, i) => (
                        <li key={i} className="text-xs text-red-700 flex gap-1.5">
                          <span className="shrink-0">·</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.greenFlags.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1.5">
                      <span>✓</span> Good signs
                    </h3>
                    <ul className="space-y-1.5">
                      {result.greenFlags.map((flag, i) => (
                        <li key={i} className="text-xs text-green-700 flex gap-1.5">
                          <span className="shrink-0">·</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-red-600" : "text-navy"
        }`}
      >
        {value}
      </p>
      {note && <p className="text-xs text-slate-400 mt-0.5">{note}</p>}
    </div>
  );
}
