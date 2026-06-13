// ============================================================
// model.ts — single source of truth for the logistic model
//
// To update coefficients, thresholds, display names, or axis
// ranges, edit ONLY this file. No other file contains numeric
// model constants or user-facing label strings.
// ============================================================

import type { ModelConfig } from "../types/nomogram";

export const MODEL_CONFIG: ModelConfig = {

  // ----------------------------------------------------------
  // Display names
  // All user-facing strings for predictor labels live here.
  // UI components read these; they never hardcode label text.
  // ----------------------------------------------------------
  displayNames: {
    tumorLocation:      "Tumor Location",
    tumorSingleSite:    "Single Site",
    tumorMultipleSites: "Multiple Sites",
    nlr:                "Neutrophil-to-Lymphocyte Ratio (NLR)",
    nlrShort:           "NLR",
    plr:                "Platelet-to-Lymphocyte Ratio (PLR)",
    plrShort:           "PLR",
  },

  // ----------------------------------------------------------
  // Logistic regression coefficients
  // Outcome: Distant Metastasis (Metastasis_TNM)
  // Model:   Multivariable Logistic Regression
  // ----------------------------------------------------------
  coefficients: {
    intercept:        -0.234375109,
    tumorSingleSite:  -1.848042629, // negative: single-site → lower metastasis risk
    nlr:               0.548241496, // positive: higher NLR → higher risk
    plr:               0.002537756, // positive: higher PLR → higher risk (small magnitude)
  },

  // ----------------------------------------------------------
  // Input validation ranges
  // Values outside these bounds block calculation and trigger
  // a validation message in the UI.
  // ----------------------------------------------------------
  validation: {
    nlr: { min: 0.1,  max: 50   },
    plr: { min: 1,    max: 1000 },
  },

  // ----------------------------------------------------------
  // Risk category thresholds
  //
  // IMPORTANT: These are exploratory visualization thresholds
  // chosen for display purposes only. They are NOT externally
  // validated clinical decision boundaries.
  //
  //   P < 0.20            → Low
  //   0.20 ≤ P < 0.50     → Intermediate
  //   P ≥ 0.50            → High
  // ----------------------------------------------------------
  riskCategories: {
    lowThreshold:  0.20,
    highThreshold: 0.50,
    exploratoryLabel:
      "Exploratory visualization category — thresholds not externally validated",
  },

  // ----------------------------------------------------------
  // Heatmap axis configuration
  //
  // Grid dimensions are derived at runtime:
  //   cols = (max − min) / step + 1
  //
  // The background heatmap is fixed to Multiple Sites
  // (tumorSingleSiteBinary = 0), representing the higher-risk
  // reference state. The patient marker moves in real time
  // regardless of the selected tumor location.
  // ----------------------------------------------------------
  heatmapAxes: {
    plr: { min: 50,  max: 400, step: 10,  label: "PLR" },
    nlr: { min: 0,   max: 10,  step: 0.5, label: "NLR" },
  },

  // ----------------------------------------------------------
  // Formula display block
  //
  // Drives ClinicalFormulaPanel rendering and the
  // ContributionBars footnote. The terms array must match
  // the coefficients block above in order and sign.
  // ----------------------------------------------------------
  formulaDisplay: {
    outcome:   "Distant Metastasis (Metastasis_TNM)",
    modelType: "Multivariable Logistic Regression",
    intercept: -0.234375109,
    terms: [
      {
        label:       "Tumor Location (Single Site)",
        coefficient: -1.848042629,
        encoding:    "Single Site = 1, Multiple Sites = 0",
      },
      {
        label:       "Neutrophil-to-Lymphocyte Ratio (NLR)",
        coefficient:  0.548241496,
      },
      {
        label:       "Platelet-to-Lymphocyte Ratio (PLR)",
        coefficient:  0.002537756,
      },
    ],
    probabilityFormula: "P = 1 / (1 + exp(−logit(P)))",
    contributionNote:
      "Bar width reflects each predictor's share of |β × value| " +
      "within the linear predictor. This represents relative " +
      "mathematical contribution only — not causal importance, " +
      "clinical significance, or effect size.",
  },

  // ----------------------------------------------------------
  // Model performance metadata
  // Displayed in the ModelTransparency collapsible panel.
  // ----------------------------------------------------------
  metadata: {
    outcome:    "Distant Metastasis",
    modelType:  "Multivariable Logistic Regression",
    auc:         0.736,
    brierScore:  0.204,
    cohortN:     114,
    citation:    "Development cohort, n = 114",
  },
};
