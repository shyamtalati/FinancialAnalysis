"use client";

import { useState } from "react";
import Link from "next/link";
import type { ValuationResults, StageSlug } from "@/lib/types";
import { STAGES } from "@/lib/constants";
import ValuationForm from "./ValuationForm";
import ResultsPanel from "./ResultsPanel";
import OfferEvaluator from "./OfferEvaluator";
import StageSelector from "./StageSelector";
import { formatCurrency } from "@/lib/utils";

interface StageCalculatorProps {
  stage: StageSlug;
}

export default function StageCalculator({ stage }: StageCalculatorProps) {
  const stageMeta = STAGES.find((s) => s.slug === stage)!;
  const [results, setResults] = useState<ValuationResults | null>(null);
  const [showOffer, setShowOffer] = useState(false);

  function handleResults(r: ValuationResults) {
    setResults(r);
    setShowOffer(false);
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  const minLabel =
    stageMeta.typicalRange.min >= 1_000_000
      ? `${formatCurrency(stageMeta.typicalRange.min)}`
      : `${formatCurrency(stageMeta.typicalRange.min)}`;
  const maxLabel = formatCurrency(stageMeta.typicalRange.max);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            href="/tool/"
            className="text-sm text-teal hover:text-teal-dark font-medium flex items-center gap-1 focus-visible:underline"
          >
            ← All Stages
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-700">
            {stageMeta.label}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">{stageMeta.label} Valuation</h1>
          <p className="text-slate-500 mt-1">{stageMeta.description}</p>
          <p className="text-sm text-slate-400 mt-0.5">
            Typical raise: {stageMeta.raiseRange} · Valuation range: {minLabel} – {maxLabel}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: form */}
          <div>
            <ValuationForm stage={stage} onResults={handleResults} />
          </div>

          {/* Right: results */}
          <div className="space-y-6 lg:sticky lg:top-32">
            {results ? (
              <>
                <ResultsPanel
                  results={results}
                  onEvaluateOffer={() => {
                    setShowOffer(true);
                    setTimeout(() => {
                      document.getElementById("offer-evaluator")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                />
                {showOffer && (
                  <div id="offer-evaluator">
                    <OfferEvaluator
                      fairValueRange={{
                        low: results.aggregateLow,
                        high: results.aggregateHigh,
                      }}
                      stage={stage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
                <div className="text-4xl mb-3" aria-hidden="true">📊</div>
                <p className="font-medium text-slate-600">Your valuation will appear here</p>
                <p className="text-sm mt-1">
                  Fill in the form and click &quot;Calculate Valuation&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stage switcher */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            Switch to a Different Stage
          </h2>
          <StageSelector currentStage={stage} />
        </div>
      </main>
    </div>
  );
}
