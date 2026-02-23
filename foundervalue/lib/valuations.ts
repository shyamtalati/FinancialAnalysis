import {
  BERKUS_MAX_TOTAL,
  EXCESSIVE_DILUTION,
  RULE_OF_40_MULTIPLES,
  RULE_OF_40_THRESHOLDS,
  SCORECARD_WEIGHTS,
} from "./constants";
import type {
  ARRMultiplesInputs,
  BerkusInputs,
  ComparableCompanyInputs,
  DCFInputs,
  MethodResult,
  OfferEvaluationResult,
  OfferInputs,
  RuleOf40Result,
  ScorecardInputs,
  StageSlug,
  ValuationResults,
  VCMethodInputs,
} from "./types";
import { formatCurrency } from "./utils";

// ============================================================
// BERKUS METHOD
// ============================================================
export function calculateBerkus(inputs: BerkusInputs): MethodResult {
  const raw =
    inputs.soundIdea +
    inputs.prototype +
    inputs.managementTeam +
    inputs.strategicRelationships +
    inputs.productRollout;

  const value = Math.min(raw, BERKUS_MAX_TOTAL);
  const notes: string[] = [];
  if (raw > BERKUS_MAX_TOTAL)
    notes.push("Capped at Berkus Method maximum of $2.5M");
  if (value === 0)
    notes.push(
      "Assign values to each risk-reduction factor to calculate valuation"
    );

  return {
    method: "berkus",
    methodLabel: "Berkus Method",
    value,
    range: { low: value * 0.8, high: Math.min(value * 1.2, BERKUS_MAX_TOTAL) },
    confidence: value > 0 ? "medium" : "low",
    notes,
  };
}

// ============================================================
// SCORECARD METHOD
// ============================================================
export function calculateScorecard(inputs: ScorecardInputs): MethodResult {
  const composite =
    inputs.teamWeight * SCORECARD_WEIGHTS.team +
    inputs.opportunityWeight * SCORECARD_WEIGHTS.opportunitySize +
    inputs.productWeight * SCORECARD_WEIGHTS.productTechnology +
    inputs.competitiveWeight * SCORECARD_WEIGHTS.competitiveEnvironment +
    inputs.salesWeight * SCORECARD_WEIGHTS.salesMarketing +
    inputs.additionalInvestmentWeight * SCORECARD_WEIGHTS.additionalInvestment +
    inputs.otherWeight * SCORECARD_WEIGHTS.other;

  const value = inputs.comparableAvgValuation * composite;

  return {
    method: "scorecard",
    methodLabel: "Scorecard Method",
    value,
    range: { low: value * 0.85, high: value * 1.15 },
    confidence: "medium",
    notes: [`Composite multiplier: ${composite.toFixed(2)}x`],
  };
}

// ============================================================
// VC METHOD (IRR-based)
// ============================================================
export function calculateVCMethod(inputs: VCMethodInputs): MethodResult {
  const terminalValue =
    inputs.projectedYear5Revenue * inputs.industryRevenueMultiple;
  const postMoney =
    terminalValue / Math.pow(1 + inputs.targetIRR, inputs.yearsToExit);
  const preMoney = Math.max(postMoney - inputs.investmentAmount, 0);
  const ownershipPct = inputs.investmentAmount / postMoney;

  const irrHigh = inputs.targetIRR * 0.8;
  const irrLow = inputs.targetIRR * 1.2;
  const rangeHigh = Math.max(
    (terminalValue / Math.pow(1 + irrHigh, inputs.yearsToExit)) -
      inputs.investmentAmount,
    0
  );
  const rangeLow = Math.max(
    (terminalValue / Math.pow(1 + irrLow, inputs.yearsToExit)) -
      inputs.investmentAmount,
    0
  );

  return {
    method: "vc-method",
    methodLabel: "VC Method (IRR-based)",
    value: preMoney,
    range: { low: rangeLow, high: rangeHigh },
    confidence: "medium",
    notes: [
      `Terminal Value: ${formatCurrency(terminalValue)}`,
      `Post-money: ${formatCurrency(postMoney)}`,
      `Investor ownership: ${(ownershipPct * 100).toFixed(1)}%`,
    ],
  };
}

// ============================================================
// RULE OF 40
// ============================================================
export function calculateRuleOf40(
  growthRate: number,
  profitMargin: number
): RuleOf40Result {
  const score = growthRate * 100 + profitMargin * 100;
  let tier: RuleOf40Result["tier"];
  let suggestedMultiple: number;

  if (score >= RULE_OF_40_THRESHOLDS.premium) {
    tier = "premium";
    suggestedMultiple = RULE_OF_40_MULTIPLES.premium;
  } else if (score >= RULE_OF_40_THRESHOLDS.good) {
    tier = "good";
    suggestedMultiple = RULE_OF_40_MULTIPLES.good;
  } else if (score >= RULE_OF_40_THRESHOLDS.average) {
    tier = "average";
    suggestedMultiple = RULE_OF_40_MULTIPLES.average;
  } else {
    tier = "below";
    suggestedMultiple = RULE_OF_40_MULTIPLES.below;
  }

  return { score, passes: score >= 40, tier, suggestedMultiple };
}

// ============================================================
// ARR MULTIPLES
// ============================================================
export function calculateARRMultiples(inputs: ARRMultiplesInputs): MethodResult {
  const rof40 = calculateRuleOf40(inputs.revenueGrowthRate, inputs.netProfitMargin);
  const multiple = inputs.customMultiple ?? rof40.suggestedMultiple;
  const value = inputs.currentARR * multiple;

  return {
    method: "arr-multiples",
    methodLabel: "ARR / Revenue Multiples",
    value,
    range: {
      low: inputs.currentARR * (multiple * 0.75),
      high: inputs.currentARR * (multiple * 1.25),
    },
    confidence: "high",
    notes: [
      `Rule of 40 Score: ${rof40.score.toFixed(0)} (${rof40.tier})`,
      `Applied Multiple: ${multiple}x`,
    ],
  };
}

// ============================================================
// DCF
// ============================================================
export function calculateDCF(inputs: DCFInputs): MethodResult {
  const { freeCashFlows, wacc, terminalGrowthRate } = inputs;

  if (wacc <= terminalGrowthRate) {
    return {
      method: "dcf",
      methodLabel: "DCF",
      value: 0,
      range: { low: 0, high: 0 },
      confidence: "low",
      notes: ["Error: WACC must be greater than the terminal growth rate."],
    };
  }

  const pvFCFs = freeCashFlows.map(
    (fcf, i) => fcf / Math.pow(1 + wacc, i + 1)
  );
  const sumPV = pvFCFs.reduce((a, b) => a + b, 0);

  const fcfYear5 = freeCashFlows[4];
  const terminalValue =
    (fcfYear5 * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
  const pvTerminal = terminalValue / Math.pow(1 + wacc, 5);

  const ev = Math.max(sumPV + pvTerminal, 0);
  const tvShare =
    ev > 0 ? ((pvTerminal / ev) * 100).toFixed(0) : "0";

  return {
    method: "dcf",
    methodLabel: "Discounted Cash Flow (DCF)",
    value: ev,
    range: { low: ev * 0.75, high: ev * 1.35 },
    confidence: "high",
    notes: [
      `PV of FCFs: ${formatCurrency(sumPV)}`,
      `PV of Terminal Value: ${formatCurrency(pvTerminal)}`,
      `Terminal value represents ${tvShare}% of enterprise value`,
    ],
  };
}

// ============================================================
// COMPARABLE COMPANY ANALYSIS
// ============================================================
export function calculateComparableCompany(
  inputs: ComparableCompanyInputs
): MethodResult {
  const evFromRevenue = inputs.annualRevenue * inputs.evRevenueMultiple;
  const evFromEBITDA =
    inputs.ebitda > 0 ? inputs.ebitda * inputs.evEbitdaMultiple : null;
  const equityFromPE =
    inputs.netIncome > 0 ? inputs.netIncome * inputs.peMultiple : null;

  const validValues = [evFromRevenue, evFromEBITDA, equityFromPE].filter(
    (v): v is number => v !== null && v > 0
  );

  const value =
    validValues.length > 0
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length
      : 0;

  const notes = [
    `EV/Revenue implied: ${formatCurrency(evFromRevenue)}`,
    evFromEBITDA
      ? `EV/EBITDA implied: ${formatCurrency(evFromEBITDA)}`
      : "EBITDA negative — EV/EBITDA not applicable",
    equityFromPE
      ? `P/E implied: ${formatCurrency(equityFromPE)}`
      : "Net income negative — P/E not applicable",
  ];

  return {
    method: "comparable-company",
    methodLabel: "Comparable Company Analysis",
    value,
    range: {
      low: validValues.length > 0 ? Math.min(...validValues) : 0,
      high: validValues.length > 0 ? Math.max(...validValues) : 0,
    },
    confidence: "high",
    notes,
  };
}

// ============================================================
// AGGREGATE RESULTS
// ============================================================
export function aggregateResults(
  stage: StageSlug,
  methodResults: MethodResult[]
): ValuationResults {
  const validResults = methodResults.filter((r) => r.value > 0);
  const allLows = validResults.map((r) => r.range.low);
  const allHighs = validResults.map((r) => r.range.high);
  const allValues = validResults.map((r) => r.value);

  const midpoint =
    allValues.length > 0
      ? allValues.reduce((a, b) => a + b, 0) / allValues.length
      : 0;

  return {
    stage,
    methods: methodResults,
    aggregateLow: allLows.length > 0 ? Math.min(...allLows) : 0,
    aggregateHigh: allHighs.length > 0 ? Math.max(...allHighs) : 0,
    aggregateMidpoint: midpoint,
    calculatedAt: new Date(),
  };
}

// ============================================================
// OFFER EVALUATOR
// ============================================================
export function evaluateOffer(
  offer: OfferInputs,
  fairValueRange: { low: number; high: number },
  stage: StageSlug,
  yearsToExit = 5
): OfferEvaluationResult {
  const postMoney = offer.proposedPreMoney + offer.investmentAmount;
  const dilutionPercent = (offer.investmentAmount / postMoney) * 100;
  const founderRetainedPercent = 100 - dilutionPercent;

  const fairMidpoint = (fairValueRange.low + fairValueRange.high) / 2;
  const ratio = fairMidpoint > 0 ? offer.proposedPreMoney / fairMidpoint : 1;

  // Investor's implied IRR: they exit at their ownership share of fair midpoint
  const investorExitValue = (dilutionPercent / 100) * fairMidpoint;
  const impliedIRR =
    offer.investmentAmount > 0
      ? Math.pow(investorExitValue / offer.investmentAmount, 1 / yearsToExit) - 1
      : 0;

  const verdict = deriveVerdict(ratio);
  const { redFlags, greenFlags } = deriveFlags(
    offer,
    fairValueRange,
    dilutionPercent,
    impliedIRR,
    stage
  );

  return {
    proposedPreMoney: offer.proposedPreMoney,
    postMoney,
    fairValueRange,
    verdict,
    dilutionPercent,
    founderRetainedPercent,
    impliedIRR,
    redFlags,
    greenFlags,
  };
}

function deriveVerdict(ratio: number): OfferEvaluationResult["verdict"] {
  if (ratio >= 1.25) return "significantly-overvalued";
  if (ratio >= 1.1) return "overvalued";
  if (ratio >= 0.9) return "fair";
  if (ratio >= 0.75) return "undervalued";
  return "significantly-undervalued";
}

function deriveFlags(
  offer: OfferInputs,
  fairRange: { low: number; high: number },
  dilution: number,
  impliedIRR: number,
  stage: StageSlug
): { redFlags: string[]; greenFlags: string[] } {
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  const threshold = EXCESSIVE_DILUTION[stage] ?? 20;

  if (offer.proposedPreMoney < fairRange.low) {
    redFlags.push(
      "Proposed valuation is below the low end of your fair value range"
    );
  }
  if (dilution > threshold) {
    redFlags.push(
      `Dilution of ${dilution.toFixed(1)}% exceeds the typical ${threshold}% ceiling for this stage`
    );
  }
  if (impliedIRR > 0.5) {
    redFlags.push(
      `Investor's implied IRR is very high (${(impliedIRR * 100).toFixed(0)}%) — may signal strong expectation of under-valuation`
    );
  }

  if (
    offer.proposedPreMoney >= fairRange.low &&
    offer.proposedPreMoney <= fairRange.high
  ) {
    greenFlags.push("Pre-money valuation falls within your fair value range");
  }
  if (dilution <= threshold * 0.75) {
    greenFlags.push(
      `Dilution (${dilution.toFixed(1)}%) is comfortably within range for this stage`
    );
  }
  if (impliedIRR >= 0.2 && impliedIRR <= 0.35) {
    greenFlags.push(
      `Investor's implied IRR (${(impliedIRR * 100).toFixed(0)}%) is market-standard for this stage`
    );
  }
  if (offer.proposedPreMoney > fairRange.high) {
    greenFlags.push(
      "Investor is offering above your calculated fair value — favorable for you"
    );
  }

  return { redFlags, greenFlags };
}
