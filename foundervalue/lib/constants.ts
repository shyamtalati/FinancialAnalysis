import type { Stage, StageSlug } from "./types";

export const STAGE_SLUGS: StageSlug[] = [
  "pre-seed",
  "seed",
  "series-a",
  "series-b-c",
  "growth",
  "acquisition-ipo",
];

export const STAGES: Stage[] = [
  {
    slug: "pre-seed",
    label: "Pre-Seed",
    shortLabel: "Pre-Seed",
    description: "Idea or MVP stage, pre-revenue",
    typicalRange: { min: 500_000, max: 3_000_000 },
    raiseRange: "$50K – $500K",
    methods: ["berkus", "scorecard"],
  },
  {
    slug: "seed",
    label: "Seed",
    shortLabel: "Seed",
    description: "Early traction, beginning revenue",
    typicalRange: { min: 2_000_000, max: 10_000_000 },
    raiseRange: "$500K – $3M",
    methods: ["vc-method", "scorecard"],
  },
  {
    slug: "series-a",
    label: "Series A",
    shortLabel: "Series A",
    description: "Proven model, scaling revenue",
    typicalRange: { min: 5_000_000, max: 30_000_000 },
    raiseRange: "$3M – $15M",
    methods: ["arr-multiples"],
  },
  {
    slug: "series-b-c",
    label: "Series B / C",
    shortLabel: "B / C",
    description: "Significant revenue, expanding markets",
    typicalRange: { min: 20_000_000, max: 200_000_000 },
    raiseRange: "$15M – $100M",
    methods: ["arr-multiples", "dcf"],
  },
  {
    slug: "growth",
    label: "Growth / Late Stage",
    shortLabel: "Growth",
    description: "Mature operations, path to profitability",
    typicalRange: { min: 100_000_000, max: 1_000_000_000 },
    raiseRange: "$50M – $500M",
    methods: ["dcf"],
  },
  {
    slug: "acquisition-ipo",
    label: "Acquisition / IPO",
    shortLabel: "Exit",
    description: "Strategic exit or public listing",
    typicalRange: { min: 200_000_000, max: 10_000_000_000 },
    raiseRange: "$100M+",
    methods: ["dcf", "comparable-company"],
  },
];

export const BERKUS_MAX_PER_FACTOR = 500_000;
export const BERKUS_MAX_TOTAL = 2_500_000;

export const SCORECARD_WEIGHTS = {
  team: 0.3,
  opportunitySize: 0.25,
  productTechnology: 0.15,
  competitiveEnvironment: 0.1,
  salesMarketing: 0.1,
  additionalInvestment: 0.05,
  other: 0.05,
} as const;

export const RULE_OF_40_THRESHOLDS = {
  premium: 60,
  good: 40,
  average: 20,
} as const;

export const RULE_OF_40_MULTIPLES = {
  premium: 15,
  good: 10,
  average: 7,
  below: 5,
} as const;

export const VC_TARGET_IRR: Record<string, number> = {
  "pre-seed": 0.5,
  seed: 0.4,
  "series-a": 0.3,
  "series-b-c": 0.25,
  growth: 0.2,
  "acquisition-ipo": 0.15,
};

export const INDUSTRY_MULTIPLES = {
  saas: {
    evRevenue: { p25: 5, median: 8, p75: 15 },
    evEbitda: { p25: 20, median: 35, p75: 60 },
    pe: { p25: 30, median: 50, p75: 80 },
  },
  fintech: {
    evRevenue: { p25: 4, median: 7, p75: 12 },
    evEbitda: { p25: 18, median: 30, p75: 50 },
    pe: { p25: 20, median: 35, p75: 60 },
  },
  ecommerce: {
    evRevenue: { p25: 1.5, median: 2.5, p75: 4 },
    evEbitda: { p25: 10, median: 18, p75: 28 },
    pe: { p25: 15, median: 22, p75: 35 },
  },
  marketplace: {
    evRevenue: { p25: 3, median: 6, p75: 10 },
    evEbitda: { p25: 15, median: 25, p75: 40 },
    pe: { p25: 20, median: 30, p75: 50 },
  },
  healthtech: {
    evRevenue: { p25: 4, median: 8, p75: 14 },
    evEbitda: { p25: 20, median: 32, p75: 55 },
    pe: { p25: 25, median: 40, p75: 65 },
  },
};

// Dilution thresholds considered excessive by stage
export const EXCESSIVE_DILUTION: Record<StageSlug, number> = {
  "pre-seed": 30,
  seed: 25,
  "series-a": 20,
  "series-b-c": 15,
  growth: 12,
  "acquisition-ipo": 0, // N/A — full exit
};
