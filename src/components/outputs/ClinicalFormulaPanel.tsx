import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { MODEL_CONFIG } from "../../config/model";

/** Format a coefficient with explicit sign, e.g. −1.8480 or +0.5482 */
function formatCoef(value: number, dp = 4): string {
  const abs = Math.abs(value).toFixed(dp);
  return value < 0 ? `\u2212${abs}` : `+${abs}`; // − (minus sign) vs +
}

export function ClinicalFormulaPanel() {
  const { formulaDisplay: fd } = MODEL_CONFIG;

  return (
    <CollapsiblePanel label="Clinical Formula" defaultOpen={false}>
      {/* Equation display */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-relaxed">
        {/* Outcome label */}
        <p className="text-slate-500 mb-2 not-italic font-sans text-[10px] uppercase tracking-wider font-medium">
          {fd.outcome}
        </p>

        {/* logit line */}
        <p className="text-slate-700 mb-1">
          <span className="text-slate-500">logit(P) =</span>
          {"  "}
          <span className="text-slate-800 font-medium">
            {formatCoef(fd.intercept)}
          </span>
        </p>

        {/* Each predictor term */}
        {fd.terms.map((term) => (
          <p key={term.label} className="text-slate-700 pl-4">
            {formatCoef(term.coefficient)}{" "}
            <span className="text-slate-500">×</span>{" "}
            <span className="text-slate-800">{term.label}</span>
            {term.encoding && (
              <span className="text-[9.5px] text-slate-400 ml-1 not-italic font-sans">
                ({term.encoding})
              </span>
            )}
          </p>
        ))}

        {/* Probability conversion */}
        <p className="text-slate-500 mt-3 pt-3 border-t border-slate-200 not-italic font-sans text-[10px]">
          {fd.probabilityFormula}
        </p>
      </div>

      {/* Model type line */}
      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
        {fd.modelType} · {fd.outcome}
      </p>
    </CollapsiblePanel>
  );
}
