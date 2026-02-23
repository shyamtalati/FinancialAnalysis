"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { StageSlug, ValuationResults } from "@/lib/types";
import {
  aggregateResults,
  calculateBerkus,
  calculateScorecard,
  calculateVCMethod,
  calculateARRMultiples,
  calculateDCF,
  calculateComparableCompany,
} from "@/lib/valuations";
import BerkusForm from "./BerkusForm";
import ScorecardForm from "./ScorecardForm";
import VCMethodForm from "./VCMethodForm";
import ARRMultiplesForm from "./ARRMultiplesForm";
import DCFForm from "./DCFForm";
import ComparableCompanyForm from "./ComparableCompanyForm";

// ============================================================
// Default values per stage
// ============================================================
function getDefaults(stage: StageSlug) {
  const common = {
    // berkus
    soundIdea: 0, prototype: 0, managementTeam: 0,
    strategicRelationships: 0, productRollout: 0,
    // scorecard
    comparableAvgValuation: 2_000_000,
    teamWeight: 1, opportunityWeight: 1, productWeight: 1,
    competitiveWeight: 1, salesWeight: 1,
    additionalInvestmentWeight: 1, otherWeight: 1,
    // vc
    projectedYear5Revenue: 0, industryRevenueMultiple: 8,
    targetIRR: 0.4, investmentAmount: 500_000, yearsToExit: 5,
    // arr
    currentARR: 0, revenueGrowthRate: 0.8, netProfitMargin: -0.2,
    customMultiple: undefined,
    // dcf
    freeCashFlows: [-500_000, -200_000, 200_000, 800_000, 2_000_000] as [number,number,number,number,number],
    wacc: 0.15, terminalGrowthRate: 0.03,
    // comparable
    annualRevenue: 0, ebitda: 0, netIncome: 0,
    evRevenueMultiple: 8, evEbitdaMultiple: 35, peMultiple: 50,
  };

  const stageOverrides: Partial<Record<StageSlug, object>> = {
    seed: { targetIRR: 0.4, investmentAmount: 1_000_000 },
    "series-a": { currentARR: 0, revenueGrowthRate: 1.5, netProfitMargin: -0.3 },
    "series-b-c": { currentARR: 0, revenueGrowthRate: 0.8, netProfitMargin: -0.1,
      wacc: 0.12, freeCashFlows: [0, 500_000, 2_000_000, 5_000_000, 10_000_000] as [number,number,number,number,number] },
    growth: { wacc: 0.1, terminalGrowthRate: 0.04,
      freeCashFlows: [5_000_000, 10_000_000, 18_000_000, 28_000_000, 40_000_000] as [number,number,number,number,number] },
    "acquisition-ipo": { wacc: 0.09, terminalGrowthRate: 0.03,
      freeCashFlows: [10_000_000, 20_000_000, 35_000_000, 55_000_000, 80_000_000] as [number,number,number,number,number] },
  };

  return { ...common, ...(stageOverrides[stage] ?? {}) };
}

// ============================================================
// Sections per stage
// ============================================================
interface Section {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType;
}

const STAGE_SECTIONS: Record<StageSlug, Section[]> = {
  "pre-seed": [
    { id: "berkus", title: "Berkus Method", subtitle: "Risk-factor valuation for pre-revenue startups", component: BerkusForm },
    { id: "scorecard", title: "Scorecard Method", subtitle: "Weighted comparison to regional comps", component: ScorecardForm },
  ],
  seed: [
    { id: "vcmethod", title: "VC Method", subtitle: "IRR-based backwards valuation from exit", component: VCMethodForm },
    { id: "scorecard", title: "Scorecard Method", subtitle: "Weighted comparison to regional comps", component: ScorecardForm },
  ],
  "series-a": [
    { id: "arr", title: "ARR / Revenue Multiples", subtitle: "Rule of 40 driven SaaS valuation", component: ARRMultiplesForm },
  ],
  "series-b-c": [
    { id: "arr", title: "ARR / Revenue Multiples", subtitle: "Rule of 40 driven SaaS valuation", component: ARRMultiplesForm },
    { id: "dcf", title: "Discounted Cash Flow (DCF)", subtitle: "5-year FCF projections with terminal value", component: DCFForm },
  ],
  growth: [
    { id: "dcf", title: "Discounted Cash Flow (DCF)", subtitle: "5-year FCF projections with terminal value", component: DCFForm },
  ],
  "acquisition-ipo": [
    { id: "dcf", title: "Discounted Cash Flow (DCF)", subtitle: "5-year FCF projections with terminal value", component: DCFForm },
    { id: "comparable", title: "Comparable Company Analysis", subtitle: "EV/Revenue, EV/EBITDA, and P/E multiples", component: ComparableCompanyForm },
  ],
};

// ============================================================
// Compute results from form values
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function computeResults(stage: StageSlug, data: any): ValuationResults {
  const methods = [];

  if (stage === "pre-seed" || stage === "seed") {
    methods.push(calculateScorecard({
      comparableAvgValuation: data.comparableAvgValuation,
      teamWeight: data.teamWeight,
      opportunityWeight: data.opportunityWeight,
      productWeight: data.productWeight,
      competitiveWeight: data.competitiveWeight,
      salesWeight: data.salesWeight,
      additionalInvestmentWeight: data.additionalInvestmentWeight,
      otherWeight: data.otherWeight,
    }));
  }

  if (stage === "pre-seed") {
    methods.push(calculateBerkus({
      soundIdea: data.soundIdea,
      prototype: data.prototype,
      managementTeam: data.managementTeam,
      strategicRelationships: data.strategicRelationships,
      productRollout: data.productRollout,
    }));
  }

  if (stage === "seed") {
    methods.push(calculateVCMethod({
      projectedYear5Revenue: data.projectedYear5Revenue,
      industryRevenueMultiple: data.industryRevenueMultiple,
      targetIRR: data.targetIRR,
      investmentAmount: data.investmentAmount,
      yearsToExit: data.yearsToExit,
    }));
  }

  if (stage === "series-a" || stage === "series-b-c") {
    methods.push(calculateARRMultiples({
      currentARR: data.currentARR,
      revenueGrowthRate: data.revenueGrowthRate,
      netProfitMargin: data.netProfitMargin,
      customMultiple: data.customMultiple || undefined,
    }));
  }

  if (stage === "series-b-c" || stage === "growth" || stage === "acquisition-ipo") {
    methods.push(calculateDCF({
      freeCashFlows: data.freeCashFlows as [number,number,number,number,number],
      wacc: data.wacc,
      terminalGrowthRate: data.terminalGrowthRate,
    }));
  }

  if (stage === "acquisition-ipo") {
    methods.push(calculateComparableCompany({
      annualRevenue: data.annualRevenue,
      ebitda: data.ebitda,
      netIncome: data.netIncome,
      evRevenueMultiple: data.evRevenueMultiple,
      evEbitdaMultiple: data.evEbitdaMultiple,
      peMultiple: data.peMultiple,
    }));
  }

  return aggregateResults(stage, methods);
}

// ============================================================
// Main component
// ============================================================
interface ValuationFormProps {
  stage: StageSlug;
  onResults: (results: ValuationResults) => void;
}

export default function ValuationForm({ stage, onResults }: ValuationFormProps) {
  const sections = STAGE_SECTIONS[stage] ?? [];
  const defaults = getDefaults(stage);

  const methods = useForm({ defaultValues: defaults });
  const { control } = methods;

  // Register freeCashFlows field array with initial values
  useFieldArray({ control, name: "freeCashFlows" as never });

  // Reset defaults when stage changes
  useEffect(() => {
    methods.reset(getDefaults(stage));
  }, [stage, methods]);

  const onSubmit = methods.handleSubmit((data) => {
    const results = computeResults(stage, data);
    onResults(results);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <div className="space-y-8">
          {sections.map((section) => {
            const Component = section.component;
            return (
              <div
                key={section.id}
                className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm"
              >
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-navy">{section.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{section.subtitle}</p>
                </div>
                <Component />
              </div>
            );
          })}

          <button
            type="submit"
            className="w-full bg-navy text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-navy-light transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 text-base"
          >
            Calculate Valuation
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
