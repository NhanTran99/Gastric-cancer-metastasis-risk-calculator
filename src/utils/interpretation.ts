// ============================================================
// interpretation.ts — single source of truth for interpretation text
//
// Both ClinicalInterpretation component and export.ts import
// from here. The text is generated exactly once and never
// duplicated or diverged between screen and PDF.
// ============================================================

import { MODEL_CONFIG } from "../config/model";
import type { NomogramInputs, RiskCategory } from "../types/nomogram";

const { displayNames: dn, riskCategories } = MODEL_CONFIG;

export function buildInterpretation(
  inputs: NomogramInputs,
  probability: number,
  category: RiskCategory
): string {
  const pct = (probability * 100).toFixed(1);
  const location =
    inputs.tumorLocation === "single"
      ? dn.tumorSingleSite.toLowerCase()
      : dn.tumorMultipleSites.toLowerCase();
  const nlrVal = inputs.nlr.toFixed(1);
  const plrVal = Math.round(inputs.plr);

  switch (category) {
    case "low":
      return (
        `The model predicts a low probability (${pct}%) of distant metastasis ` +
        `based on the entered parameters. ${
          inputs.tumorLocation === "single"
            ? "Single-site tumor location contributes a protective direction in this model. "
            : ""
        }` +
        `An NLR of ${nlrVal} and PLR of ${plrVal} support this estimate. ` +
        `These results should be interpreted alongside full clinical assessment.`
      );

    case "intermediate":
      return (
        `The model predicts an intermediate probability (${pct}%) of distant metastasis. ` +
        `The entered combination of ${location} tumor location, NLR of ${nlrVal}, ` +
        `and PLR of ${plrVal} places this estimate in the ${riskCategories.lowThreshold * 100}–` +
        `${riskCategories.highThreshold * 100}% range. Clinical correlation and ` +
        `multidisciplinary review are recommended.`
      );

    case "high":
      return (
        `The model predicts a high probability (${pct}%) of distant metastasis. ` +
        `An NLR of ${nlrVal} and PLR of ${plrVal} with ${location} tumor location ` +
        `contribute to this elevated estimate. This result may warrant closer clinical ` +
        `evaluation and should be considered in the context of all available staging information.`
      );
  }
}
