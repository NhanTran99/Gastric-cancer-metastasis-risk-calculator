import { MODEL_CONFIG } from "../../config/model";
import type { RiskCategory } from "../../types/nomogram";

interface Props {
  probability: number;
  category: RiskCategory;
  isValid: boolean;
}

// Slate-blue for low (avoids implying clinical safety), amber for intermediate, red for high.
const CATEGORY_COLOR: Record<RiskCategory, string> = {
  low:          "text-slate-600",
  intermediate: "text-amber-600",
  high:         "text-red-600",
};

const { metadata: md } = MODEL_CONFIG;

export function RiskDisplay({ probability, category, isValid }: Props) {
  if (!isValid) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Predicted Distant Metastasis Risk
        </p>
        <p className="text-[18px] text-slate-300 font-light">
          Enter valid parameters
        </p>
        <p className="text-[11px] text-slate-300 mt-2">
          Check NLR and PLR values
        </p>
      </div>
    );
  }

  // Split into whole and decimal parts for typographic hierarchy.
  const pct = (probability * 100).toFixed(1);
  const [whole, decimal] = pct.split(".");
  const colorClass = CATEGORY_COLOR[category];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Predicted Distant Metastasis Risk
      </p>

      {/* The dominant number — sized to be unmissable at a glance */}
      <div
        className={`flex items-start justify-center leading-none ${colorClass}`}
        aria-label={`${pct} percent`}
      >
        <span className="text-[80px] font-bold tabular-nums tracking-tighter">
          {whole}
        </span>
        <span className="text-[36px] font-light mt-[14px] ml-0.5 opacity-80">
          .{decimal}%
        </span>
      </div>

      {/* Two-line footer per spec */}
      <div className="mt-4 space-y-0.5">
        <p className="text-[11px] text-slate-400">
          Based on a multivariable logistic regression model
        </p>
        <p className="text-[11px] text-slate-400">
          Development cohort: n&nbsp;=&nbsp;{md.cohortN}
        </p>
      </div>
    </div>
  );
}
