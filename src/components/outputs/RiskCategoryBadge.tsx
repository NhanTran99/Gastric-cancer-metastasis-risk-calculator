import { MODEL_CONFIG } from "../../config/model";
import type { RiskCategory } from "../../types/nomogram";

interface Props {
  category: RiskCategory;
  isValid: boolean;
}

const { riskCategories } = MODEL_CONFIG;
const LOW_PCT  = Math.round(riskCategories.lowThreshold * 100);
const HIGH_PCT = Math.round(riskCategories.highThreshold * 100);

interface CategoryDef {
  key: RiskCategory;
  label: string;
  range: string;
  active: string;
  inactive: string;
}

// Slate-blue / amber / red — avoids green so low-risk is not read as clinically safe.
const CATEGORIES: CategoryDef[] = [
  {
    key:      "low",
    label:    "Low",
    range:    `< ${LOW_PCT}%`,
    active:   "bg-slate-100 text-slate-700 border-slate-400 ring-1 ring-slate-500",
    inactive: "bg-white text-slate-400 border-slate-200",
  },
  {
    key:      "intermediate",
    label:    "Intermediate",
    range:    `${LOW_PCT}–${HIGH_PCT}%`,
    active:   "bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-400",
    inactive: "bg-white text-slate-400 border-slate-200",
  },
  {
    key:      "high",
    label:    "High",
    range:    `≥ ${HIGH_PCT}%`,
    active:   "bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400",
    inactive: "bg-white text-slate-400 border-slate-200",
  },
];

export function RiskCategoryBadge({ category, isValid }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Risk Category
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((c) => {
          const isActive = isValid && category === c.key;
          return (
            <div
              key={c.key}
              className={[
                "rounded-full border px-4 py-1.5 transition-all duration-200",
                isActive ? c.active : c.inactive,
              ].join(" ")}
            >
              <span className="text-[12px] font-medium">{c.label}</span>
              <span
                className={[
                  "text-[10px] ml-1.5",
                  isActive ? "opacity-70" : "opacity-50",
                ].join(" ")}
              >
                {c.range}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        {riskCategories.exploratoryLabel}.
      </p>
    </div>
  );
}
