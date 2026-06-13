import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { MODEL_CONFIG } from "../../config/model";

export function ModelTransparencyPanel() {
  const { metadata: m, formulaDisplay: fd } = MODEL_CONFIG;

  return (
    <CollapsiblePanel label="Model Transparency" defaultOpen={false}>
      {/* Performance metrics — 2-column grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            AUC
          </p>
          <p className="text-[18px] font-semibold text-slate-800 tabular-nums leading-none">
            {m.auc.toFixed(3)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Brier Score
          </p>
          <p className="text-[18px] font-semibold text-slate-800 tabular-nums leading-none">
            {m.brierScore.toFixed(3)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Cohort size
          </p>
          <p className="text-[18px] font-semibold text-slate-800 tabular-nums leading-none">
            n = {m.cohortN}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Model type
          </p>
          <p className="text-[11px] font-medium text-slate-700 leading-snug mt-0.5">
            {m.modelType}
          </p>
        </div>
      </div>

      {/* Outcome */}
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Outcome
        </p>
        <p className="text-[12px] text-slate-600">{m.outcome}</p>
      </div>

      {/* Predictors */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Predictors
        </p>
        <ul className="space-y-1">
          {fd.terms.map((t) => (
            <li
              key={t.label}
              className="flex items-start gap-1.5 text-[12px] text-slate-600"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
              <span>
                {t.label}
                {t.encoding && (
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({t.encoding})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Citation note */}
      <p className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
        {m.citation}. AUC and Brier Score reflect internal performance only.
        External validation has not been performed.
      </p>
    </CollapsiblePanel>
  );
}
