// ============================================================
// calculator.ts — pure calculation functions
//
// All functions are stateless and dependency-free (no React,
// no DOM). Each function can be unit-tested in isolation.
//
// The only external dependency is MODEL_CONFIG from model.ts.
// No numeric constant appears in this file directly.
// ============================================================

import { MODEL_CONFIG } from "../config/model";
import type {
  NomogramInputs,
  EncodedInputs,
  RiskResult,
  RiskCategory,
  PredictorContribution,
  HeatmapCell,
  ContourLine,
  ContourPoint,
} from "../types/nomogram";

// ------------------------------------------------------------
// Step 1 — encodeInputs()
//
// Converts the user-facing TumorLocation string to the binary
// integer required by the logistic equation.
//
//   "single"   → tumorSingleSiteBinary = 1
//   "multiple" → tumorSingleSiteBinary = 0
// ------------------------------------------------------------
export function encodeInputs(inputs: NomogramInputs): EncodedInputs {
  return {
    tumorSingleSiteBinary: inputs.tumorLocation === "single" ? 1 : 0,
    nlr: inputs.nlr,
    plr: inputs.plr,
  };
}

// ------------------------------------------------------------
// Step 2 — computeLogit()
//
// Computes the linear predictor (log-odds):
//
//   logit(P) = β₀
//            + β₁ × Tumor_SingleSite   (binary 0 or 1)
//            + β₂ × NLR                (continuous)
//            + β₃ × PLR                (continuous)
//
// Where:
//   β₀ = −0.234375109  (intercept)
//   β₁ = −1.848042629  (tumorSingleSite)
//   β₂ =  0.548241496  (nlr)
//   β₃ =  0.002537756  (plr)
//
// Coefficients are read from MODEL_CONFIG — never hardcoded.
// ------------------------------------------------------------
export function computeLogit(encoded: EncodedInputs): number {
  const { intercept, tumorSingleSite, nlr, plr } =
    MODEL_CONFIG.coefficients;

  return (
    intercept +
    tumorSingleSite * encoded.tumorSingleSiteBinary +
    nlr             * encoded.nlr +
    plr             * encoded.plr
  );
}

// ------------------------------------------------------------
// Step 3 — logitToProbability()
//
// Standard logistic (sigmoid) function:
//   P = 1 / (1 + exp(−logit))
//
// Output is always in [0, 1] regardless of logit magnitude.
// As logit → +∞, P → 1. As logit → −∞, P → 0.
// ------------------------------------------------------------
export function logitToProbability(logit: number): number {
  return 1 / (1 + Math.exp(-logit));
}

// ------------------------------------------------------------
// Step 4 — classifyRisk()
//
// Assigns an exploratory risk category from the probability.
// Thresholds are read from MODEL_CONFIG.riskCategories.
//
//   P < lowThreshold  (0.20) → "low"
//   P ≥ highThreshold (0.50) → "high"
//   Otherwise                → "intermediate"
//
// These categories are exploratory display labels only.
// They are NOT externally validated clinical thresholds.
// ------------------------------------------------------------
export function classifyRisk(probability: number): RiskCategory {
  const { lowThreshold, highThreshold } = MODEL_CONFIG.riskCategories;
  if (probability < lowThreshold)   return "low";
  if (probability >= highThreshold) return "high";
  return "intermediate";
}

// ------------------------------------------------------------
// Step 5 — computeContributions()
//
// For each predictor i:
//   rawContribution_i = |β_i × value_i|
//
// All raw contributions are then normalized so they sum to 100%:
//   percentContribution_i = (raw_i / Σ raw) × 100
//
// The intercept (β₀) is excluded: it is a constant shift
// applied equally to every patient and conveys no information
// about which predictor is driving this individual's score.
//
// NOTE: percentContribution reflects the predictor's share of
// the absolute linear predictor magnitude only.
// It does NOT represent causal importance, effect size, or
// clinical significance.
// ------------------------------------------------------------
export function computeContributions(
  encoded: EncodedInputs
): PredictorContribution[] {
  const c = MODEL_CONFIG.coefficients;
  const dn = MODEL_CONFIG.displayNames;

  const raw: PredictorContribution[] = [
    {
      label:               dn.tumorLocation,
      coefficient:         c.tumorSingleSite,
      value:               encoded.tumorSingleSiteBinary,
      rawContribution:     Math.abs(c.tumorSingleSite * encoded.tumorSingleSiteBinary),
      percentContribution: 0, // computed below
    },
    {
      label:               dn.nlrShort,
      coefficient:         c.nlr,
      value:               encoded.nlr,
      rawContribution:     Math.abs(c.nlr * encoded.nlr),
      percentContribution: 0,
    },
    {
      label:               dn.plrShort,
      coefficient:         c.plr,
      value:               encoded.plr,
      rawContribution:     Math.abs(c.plr * encoded.plr),
      percentContribution: 0,
    },
  ];

  const total = raw.reduce((sum, p) => sum + p.rawContribution, 0);

  // Edge case: all contributions are zero (e.g. multiple sites tumor,
  // NLR = 0, PLR = 0). Avoid division by zero; return 0% for all.
  if (total === 0) {
    return raw.map((p) => ({ ...p, percentContribution: 0 }));
  }

  return raw.map((p) => ({
    ...p,
    percentContribution: (p.rawContribution / total) * 100,
  }));
}

// ------------------------------------------------------------
// Step 6 — validateInputs()
//
// Returns null if inputs are valid; returns an error message
// string if not. Called by the UI hook before calculateRisk().
// ------------------------------------------------------------
export function validateInputs(inputs: NomogramInputs): string | null {
  const { nlr: nlrRange, plr: plrRange } = MODEL_CONFIG.validation;

  if (
    isNaN(inputs.nlr) ||
    inputs.nlr < nlrRange.min ||
    inputs.nlr > nlrRange.max
  ) {
    return `NLR must be between ${nlrRange.min} and ${nlrRange.max}.`;
  }
  if (
    isNaN(inputs.plr) ||
    inputs.plr < plrRange.min ||
    inputs.plr > plrRange.max
  ) {
    return `PLR must be between ${plrRange.min} and ${plrRange.max}.`;
  }
  return null;
}

// ------------------------------------------------------------
// calculateRisk() — main export
//
// Orchestrates steps 1–5. This is the only function that UI
// components and hooks should call.
//
// Returns a complete RiskResult including logit, probability,
// formatted percentage, risk category, and contributions.
// ------------------------------------------------------------
export function calculateRisk(inputs: NomogramInputs): RiskResult {
  const validationError = validateInputs(inputs);
  const isValid = validationError === null;

  const encoded       = encodeInputs(inputs);
  const logit         = computeLogit(encoded);
  const probability   = logitToProbability(logit);
  const category      = classifyRisk(probability);
  const contributions = computeContributions(encoded);

  return {
    logit,
    probability,
    probabilityPercent: (probability * 100).toFixed(2) + "%",
    category,
    contributions,
    isValid,
  };
}

// ------------------------------------------------------------
// computeHeatmapGrid() — called ONCE on component mount
//
// Pre-generates all (PLR, NLR) grid cells with their predicted
// probability. The patient marker is overlaid separately in
// the component, so only the marker re-renders on input change.
//
// Grid dimensions are derived entirely from MODEL_CONFIG:
//   plrCols = (plrAxis.max − plrAxis.min) / plrAxis.step + 1
//   nlrRows = (nlrAxis.max − nlrAxis.min) / nlrAxis.step + 1
//
// The background is fixed to "multiple" (tumorSingleSiteBinary = 0),
// representing the higher-risk reference state. A persistent
// label in the UI component informs the user of this assumption.
// ------------------------------------------------------------
export function computeHeatmapGrid(): HeatmapCell[] {
  const { plr: plrAxis, nlr: nlrAxis } = MODEL_CONFIG.heatmapAxes;
  const cells: HeatmapCell[] = [];

  for (
    let plrVal = plrAxis.min;
    plrVal <= plrAxis.max + 1e-9; // floating-point safe upper bound
    plrVal = Math.round((plrVal + plrAxis.step) * 1e6) / 1e6
  ) {
    for (
      let nlrVal = nlrAxis.min;
      nlrVal <= nlrAxis.max + 1e-9;
      nlrVal = Math.round((nlrVal + nlrAxis.step) * 1e6) / 1e6
    ) {
      const result = calculateRisk({
        tumorLocation: "multiple", // fixed reference state for background
        nlr: nlrVal,
        plr: plrVal,
      });
      cells.push({
        plr: plrVal,
        nlr: nlrVal,
        probability: result.probability,
      });
    }
  }

  return cells;
}

// ------------------------------------------------------------
// computeHeatmapGridForLocation() — dynamic version
//
// Generates the 756-cell grid for a specific tumor location.
// Called inside useNomogram whenever tumorLocation changes,
// not on every NLR/PLR keystroke.
// ------------------------------------------------------------
export function computeHeatmapGridForLocation(
  tumorLocation: "single" | "multiple"
): HeatmapCell[] {
  const { plr: plrAxis, nlr: nlrAxis } = MODEL_CONFIG.heatmapAxes;
  const cells: HeatmapCell[] = [];

  for (
    let plrVal = plrAxis.min;
    plrVal <= plrAxis.max + 1e-9;
    plrVal = Math.round((plrVal + plrAxis.step) * 1e6) / 1e6
  ) {
    for (
      let nlrVal = nlrAxis.min;
      nlrVal <= nlrAxis.max + 1e-9;
      nlrVal = Math.round((nlrVal + nlrAxis.step) * 1e6) / 1e6
    ) {
      const result = calculateRisk({ tumorLocation, nlr: nlrVal, plr: plrVal });
      cells.push({ plr: plrVal, nlr: nlrVal, probability: result.probability });
    }
  }

  return cells;
}

// ------------------------------------------------------------
// computeContourLines() — exact iso-line computation
//
// For each threshold, solves for PLR analytically at fine NLR
// steps (0.1 intervals). Pure math — no grid sampling needed.
//
// For a given NLR and tumor location, the PLR where P = target:
//   logit_T = log(target / (1 - target))
//   PLR = (logit_T - β0 - β1·bin - β2·NLR) / β3
//
// Points outside the configured axis bounds are excluded.
// ------------------------------------------------------------
export function computeContourLines(
  tumorLocation: "single" | "multiple"
): ContourLine[] {
  const { intercept, tumorSingleSite, nlr: bNlr, plr: bPlr } =
    MODEL_CONFIG.coefficients;
  const { plr: plrAxis, nlr: nlrAxis } = MODEL_CONFIG.heatmapAxes;
  const bin = tumorLocation === "single" ? 1 : 0;

  const thresholds = [
    { probability: 0.2, label: "20%" },
    { probability: 0.5, label: "50%" },
  ];

  return thresholds.map(({ probability, label }) => {
    const logitT = Math.log(probability / (1 - probability));
    const points: ContourPoint[] = [];

    for (
      let nlrVal = nlrAxis.min;
      nlrVal <= nlrAxis.max + 1e-9;
      nlrVal = Math.round((nlrVal + 0.1) * 1e6) / 1e6
    ) {
      const plrVal =
        (logitT - intercept - tumorSingleSite * bin - bNlr * nlrVal) / bPlr;

      if (plrVal >= plrAxis.min && plrVal <= plrAxis.max) {
        points.push({ nlr: nlrVal, plr: plrVal });
      }
    }

    return { probability, label, points };
  });
}
