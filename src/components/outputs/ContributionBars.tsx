import { MODEL_CONFIG } from "../../config/model";
import type { PredictorContribution } from "../../types/nomogram";

interface Props {
  contributions: PredictorContribution[];
  isValid: boolean;
}

// One distinct, muted colour per predictor — consistent across all renders.
// Slate-blue / sky / violet: subdued palette that reads as "analytical" not "traffic-light".
const BAR_COLORS = ["#475569", "#0EA5E9", "#8B5CF6"] as const;

export function ContributionBars({ contributions, isValid }: Props) {
  const { formulaDisplay } = MODEL_CONFIG;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Predictor Contribution
      </p>

      {isValid ? (
        <div className="flex flex-col gap-3 mb-4">
          {contributions.map((c, i) => {
            const pct = c.percentContribution;
            const color = BAR_COLORS[i % BAR_COLORS.length];

            return (
              <div key={c.label}>
                {/* Label row */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-slate-600 font-medium">
                    {c.label}
                  </span>
                  <span className="text-[12px] font-semibold text-slate-800 tabular-nums">
                    {pct.toFixed(1)}%
                  </span>
                </div>

                {/* Bar track */}
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${pct.toFixed(1)}%`,
                      backgroundColor: color,
                    }}
                    role="meter"
                    aria-valuenow={Math.round(pct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${c.label} contributes ${pct.toFixed(1)} percent`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-3">
              <div className="h-2.5 w-24 rounded bg-slate-100 mb-1.5" />
              <div className="h-1.5 w-full rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Caveat footnote — sourced from model.ts */}
      <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
        {formulaDisplay.contributionNote}
      </p>
    </div>
  );
}
