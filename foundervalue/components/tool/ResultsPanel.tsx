"use client";

import { useState } from "react";
import type { ValuationResults } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import ValuationRangeChart from "./ValuationRangeChart";

interface ResultsPanelProps {
  results: ValuationResults;
  onEvaluateOffer: () => void;
}

const confidenceBadge = {
  low: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-green-100 text-green-700",
};

const methodColors: Record<string, string> = {
  berkus: "border-l-indigo-400",
  scorecard: "border-l-violet-400",
  "vc-method": "border-l-teal",
  "arr-multiples": "border-l-navy",
  dcf: "border-l-green-500",
  "comparable-company": "border-l-amber",
};

export default function ResultsPanel({ results, onEvaluateOffer }: ResultsPanelProps) {
  const [showNotes, setShowNotes] = useState<string | null>(null);

  const validMethods = results.methods.filter((m) => m.value > 0);

  return (
    <section
      id="results-section"
      aria-labelledby="results-heading"
      className="space-y-6"
    >
      {/* Summary hero */}
      <div className="bg-navy text-white rounded-2xl p-6 md:p-8">
        <p className="text-teal text-sm font-semibold uppercase tracking-wider mb-1">
          Fair Value Range
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <h2
            id="results-heading"
            className="text-3xl md:text-4xl font-bold"
          >
            {formatCurrency(results.aggregateLow)} – {formatCurrency(results.aggregateHigh)}
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
          <span>Midpoint:</span>
          <span className="text-white font-semibold text-lg">
            {formatCurrency(results.aggregateMidpoint)}
          </span>
        </div>
        <p className="text-white/50 text-xs mt-2">
          Based on {validMethods.length} valuation method{validMethods.length !== 1 ? "s" : ""} ·{" "}
          Calculated {results.calculatedAt.toLocaleTimeString()}
        </p>
      </div>

      {/* Range chart */}
      {validMethods.length > 1 && (
        <div className="border border-slate-200 rounded-xl p-5 bg-white">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Valuation Range by Method
          </h3>
          <ValuationRangeChart
            methods={results.methods}
            midpoint={results.aggregateMidpoint}
          />
        </div>
      )}

      {/* Per-method cards */}
      <div className="space-y-3">
        {results.methods.map((m) => (
          <div
            key={m.method}
            className={`border-l-4 ${methodColors[m.method] ?? "border-l-slate-300"} border border-slate-200 rounded-xl p-5 bg-white`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-800">{m.methodLabel}</h3>
                <p className="text-2xl font-bold text-navy mt-1">
                  {m.value > 0 ? formatCurrency(m.value) : "—"}
                </p>
                {m.value > 0 && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Range: {formatCurrency(m.range.low)} – {formatCurrency(m.range.high)}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                  confidenceBadge[m.confidence]
                }`}
              >
                {m.confidence} confidence
              </span>
            </div>

            {m.notes.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowNotes(showNotes === m.method ? null : m.method)
                  }
                  className="text-xs text-teal hover:text-teal-dark font-medium focus-visible:underline"
                  aria-expanded={showNotes === m.method}
                >
                  {showNotes === m.method ? "Hide" : "Show"} methodology notes
                </button>
                {showNotes === m.method && (
                  <ul className="mt-2 space-y-1">
                    {m.notes.map((note, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                        <span className="text-slate-400 shrink-0">·</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA to offer evaluator */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">
            Have an investor offer?
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Enter the proposed terms to see if the offer is fair and how much
            equity you&apos;d be giving up.
          </p>
        </div>
        <button
          type="button"
          onClick={onEvaluateOffer}
          className="shrink-0 bg-amber text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-dark transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 text-sm whitespace-nowrap"
        >
          Evaluate an Offer
        </button>
      </div>
    </section>
  );
}
