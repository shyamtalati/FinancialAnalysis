import { z } from "zod";

// ============================================================
// BERKUS
// ============================================================
export const berkusSchema = z.object({
  soundIdea: z.number().min(0).max(500_000),
  prototype: z.number().min(0).max(500_000),
  managementTeam: z.number().min(0).max(500_000),
  strategicRelationships: z.number().min(0).max(500_000),
  productRollout: z.number().min(0).max(500_000),
});
export type BerkusFormValues = z.infer<typeof berkusSchema>;

// ============================================================
// SCORECARD
// ============================================================
export const scorecardSchema = z.object({
  comparableAvgValuation: z
    .number()
    .min(100_000, "Must be at least $100K")
    .max(100_000_000, "Must be at most $100M"),
  teamWeight: z.number().min(0).max(2),
  opportunityWeight: z.number().min(0).max(2),
  productWeight: z.number().min(0).max(2),
  competitiveWeight: z.number().min(0).max(2),
  salesWeight: z.number().min(0).max(2),
  additionalInvestmentWeight: z.number().min(0).max(2),
  otherWeight: z.number().min(0).max(2),
});
export type ScorecardFormValues = z.infer<typeof scorecardSchema>;

// ============================================================
// VC METHOD
// ============================================================
export const vcMethodSchema = z.object({
  projectedYear5Revenue: z.number().min(1, "Must be greater than 0"),
  industryRevenueMultiple: z
    .number()
    .min(1, "Minimum 1x")
    .max(50, "Maximum 50x"),
  targetIRR: z.number().min(0.05, "Minimum 5%").max(0.99, "Maximum 99%"),
  investmentAmount: z.number().min(10_000, "Minimum $10K"),
  yearsToExit: z
    .number()
    .int()
    .min(1, "Minimum 1 year")
    .max(15, "Maximum 15 years"),
});
export type VCMethodFormValues = z.infer<typeof vcMethodSchema>;

// ============================================================
// ARR MULTIPLES
// ============================================================
export const arrMultiplesSchema = z.object({
  currentARR: z.number().min(1, "Must be greater than 0"),
  revenueGrowthRate: z.number().min(0, "Minimum 0%").max(10, "Maximum 1000%"),
  netProfitMargin: z.number().min(-5, "Minimum -500%").max(1, "Maximum 100%"),
  customMultiple: z.number().min(1).max(100).optional(),
});
export type ARRMultiplesFormValues = z.infer<typeof arrMultiplesSchema>;

// ============================================================
// DCF
// ============================================================
export const dcfSchema = z.object({
  freeCashFlows: z.tuple([
    z.number(),
    z.number(),
    z.number(),
    z.number(),
    z.number(),
  ]),
  wacc: z.number().min(0.01, "Minimum 1%").max(0.5, "Maximum 50%"),
  terminalGrowthRate: z
    .number()
    .min(0, "Minimum 0%")
    .max(0.1, "Maximum 10%"),
});
export type DCFFormValues = z.infer<typeof dcfSchema>;

// ============================================================
// COMPARABLE COMPANY
// ============================================================
export const comparableSchema = z.object({
  annualRevenue: z.number().min(1, "Must be greater than 0"),
  ebitda: z.number(),
  netIncome: z.number(),
  evRevenueMultiple: z.number().min(0.1).max(100),
  evEbitdaMultiple: z.number().min(0.1).max(200),
  peMultiple: z.number().min(0.1).max(500),
});
export type ComparableFormValues = z.infer<typeof comparableSchema>;

// ============================================================
// OFFER EVALUATOR
// ============================================================
export const offerSchema = z.object({
  investmentAmount: z.number().min(1_000, "Minimum $1K"),
  proposedPreMoney: z.number().min(1_000, "Minimum $1K"),
});
export type OfferFormValues = z.infer<typeof offerSchema>;
