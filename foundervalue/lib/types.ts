// ============================================================
// STAGE TYPES
// ============================================================
export type StageSlug =
  | "pre-seed"
  | "seed"
  | "series-a"
  | "series-b-c"
  | "growth"
  | "acquisition-ipo";

export interface Stage {
  slug: StageSlug;
  label: string;
  shortLabel: string;
  description: string;
  typicalRange: { min: number; max: number };
  methods: ValuationMethodKey[];
  raiseRange: string;
}

// ============================================================
// VALUATION METHOD KEYS
// ============================================================
export type ValuationMethodKey =
  | "berkus"
  | "scorecard"
  | "vc-method"
  | "arr-multiples"
  | "dcf"
  | "comparable-company";

// ============================================================
// INPUT TYPES
// ============================================================
export interface BerkusInputs {
  soundIdea: number;           // 0–500_000
  prototype: number;           // 0–500_000
  managementTeam: number;      // 0–500_000
  strategicRelationships: number; // 0–500_000
  productRollout: number;      // 0–500_000
}

export interface ScorecardInputs {
  comparableAvgValuation: number; // regional/sector baseline $
  teamWeight: number;             // 0–2
  opportunityWeight: number;      // 0–2
  productWeight: number;          // 0–2
  competitiveWeight: number;      // 0–2
  salesWeight: number;            // 0–2
  additionalInvestmentWeight: number; // 0–2
  otherWeight: number;            // 0–2
}

export interface VCMethodInputs {
  projectedYear5Revenue: number;  // $
  industryRevenueMultiple: number; // e.g. 8
  targetIRR: number;               // e.g. 0.30
  investmentAmount: number;        // $
  yearsToExit: number;             // e.g. 5
}

export interface ARRMultiplesInputs {
  currentARR: number;             // $
  revenueGrowthRate: number;      // e.g. 0.80 (80%)
  netProfitMargin: number;        // e.g. -0.20 (-20%)
  customMultiple?: number;        // override if provided
}

export interface DCFInputs {
  freeCashFlows: [number, number, number, number, number]; // Year 1–5
  wacc: number;                   // e.g. 0.12 (12%)
  terminalGrowthRate: number;     // e.g. 0.03 (3%)
}

export interface ComparableCompanyInputs {
  annualRevenue: number;          // $
  ebitda: number;                 // $ (can be negative)
  netIncome: number;              // $ (can be negative)
  evRevenueMultiple: number;      // from comparables
  evEbitdaMultiple: number;       // from comparables
  peMultiple: number;             // from comparables
}

// ============================================================
// RESULT TYPES
// ============================================================
export interface MethodResult {
  method: ValuationMethodKey;
  methodLabel: string;
  value: number;
  range: { low: number; high: number };
  confidence: "low" | "medium" | "high";
  notes: string[];
}

export interface ValuationResults {
  stage: StageSlug;
  methods: MethodResult[];
  aggregateLow: number;
  aggregateHigh: number;
  aggregateMidpoint: number;
  calculatedAt: Date;
}

// ============================================================
// OFFER EVALUATOR TYPES
// ============================================================
export interface OfferInputs {
  investmentAmount: number;
  proposedPreMoney: number;
}

export interface OfferEvaluationResult {
  proposedPreMoney: number;
  postMoney: number;
  fairValueRange: { low: number; high: number };
  verdict:
    | "fair"
    | "undervalued"
    | "overvalued"
    | "significantly-undervalued"
    | "significantly-overvalued";
  dilutionPercent: number;
  founderRetainedPercent: number;
  impliedIRR: number;
  redFlags: string[];
  greenFlags: string[];
}

// ============================================================
// RULE OF 40
// ============================================================
export interface RuleOf40Result {
  score: number;
  passes: boolean;
  tier: "premium" | "good" | "average" | "below";
  suggestedMultiple: number;
}
