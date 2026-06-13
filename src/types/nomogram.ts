// ============================================================
// nomogram.ts — shared TypeScript interfaces
// All components and utilities import types from this file.
// ============================================================

/** Tumor location encoding per the original logistic model */
export type TumorLocation = "single" | "multiple";

/** Raw user inputs — exactly what the clinician enters */
export interface NomogramInputs {
  tumorLocation: TumorLocation;
  nlr: number;
  plr: number;
}

/** Validated inputs with the binary encoding used in the equation */
export interface EncodedInputs {
  tumorSingleSiteBinary: 0 | 1; // Single Site = 1, Multiple Sites = 0
  nlr: number;
  plr: number;
}

/** Full calculation result returned by calculateRisk() */
export interface RiskResult {
  /** Raw linear predictor value */
  logit: number;
  /** Probability 0–1 */
  probability: number;
  /** Probability as percentage string, e.g. "34.82%" */
  probabilityPercent: string;
  /** Risk category derived from thresholds in model.ts */
  category: RiskCategory;
  /** Per-predictor absolute contributions, normalized to 100% */
  contributions: PredictorContribution[];
  /** Whether the inputs passed validation at time of calculation */
  isValid: boolean;
}

export type RiskCategory = "low" | "intermediate" | "high";

export interface PredictorContribution {
  label: string;
  /** |β × value| — raw absolute contribution to the linear predictor */
  rawContribution: number;
  /** Fraction of total |β × value| sum, expressed 0–100 */
  percentContribution: number;
  /** The coefficient β used */
  coefficient: number;
  /** The encoded value used */
  value: number;
}

/** One cell in the pre-computed heatmap grid */
export interface HeatmapCell {
  plr: number;
  nlr: number;
  probability: number;
}

/** Axis configuration for the heatmap — sourced from model.ts */
export interface AxisConfig {
  min: number;
  max: number;
  step: number;
  label: string;
}

/** Shape of MODEL_CONFIG exported from model.ts */
export interface ModelConfig {
  displayNames: {
    /** Field label shown in the input panel */
    tumorLocation: string;
    /** Option label for binary = 1 */
    tumorSingleSite: string;
    /** Option label for binary = 0 */
    tumorMultipleSites: string;
    /** Full display name for NLR */
    nlr: string;
    /** Short abbreviation for NLR (axis labels, badges) */
    nlrShort: string;
    /** Full display name for PLR */
    plr: string;
    /** Short abbreviation for PLR (axis labels, badges) */
    plrShort: string;
  };
  coefficients: {
    intercept: number;
    tumorSingleSite: number;
    nlr: number;
    plr: number;
  };
  validation: {
    nlr: { min: number; max: number };
    plr: { min: number; max: number };
  };
  riskCategories: {
    lowThreshold: number;
    highThreshold: number;
    exploratoryLabel: string;
  };
  heatmapAxes: {
    plr: AxisConfig;
    nlr: AxisConfig;
  };
  formulaDisplay: {
    outcome: string;
    modelType: string;
    intercept: number;
    terms: Array<{
      label: string;
      coefficient: number;
      encoding?: string;
    }>;
    probabilityFormula: string;
    contributionNote: string;
  };
  metadata: {
    outcome: string;
    modelType: string;
    auc: number;
    brierScore: number;
    cohortN: number;
    citation: string;
  };
}

/** Tooltip data shown when the physician inspects the patient marker */
export interface HeatmapTooltipData {
  tumorLocationLabel: string;
  nlr: number;
  plr: number;
  probability: number;
  probabilityPercent: string;
}

/** A single point on a probability iso-contour line */
export interface ContourPoint {
  nlr: number;
  plr: number;
}

/** One named contour line at a given probability threshold */
export interface ContourLine {
  probability: number;
  label: string;
  points: ContourPoint[];
}
