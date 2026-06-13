import { MODEL_CONFIG } from "../../config/model";
import type { TumorLocation } from "../../types/nomogram";

interface Props {
  value: TumorLocation;
  onChange: (v: TumorLocation) => void;
}

const { displayNames: dn } = MODEL_CONFIG;

const OPTIONS: { value: TumorLocation; label: string; description: string }[] = [
  {
    value: "single",
    label: dn.tumorSingleSite,
    description: "Tumor confined to one gastric sub-region",
  },
  {
    value: "multiple",
    label: dn.tumorMultipleSites,
    description: "Tumor spanning two or more sub-regions",
  },
];

export function TumorLocationSelect({ value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium text-slate-600">
        {dn.tumorLocation}
      </label>
      <div className="space-y-1.5">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "w-full text-left rounded-lg border px-3.5 py-2.5 transition-all duration-150",
                active
                  ? "border-blue-500 bg-blue-50 shadow-[0_0_0_1px_rgba(59,130,246,0.35)]"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "text-[13px] font-medium",
                    active ? "text-blue-700" : "text-slate-800",
                  ].join(" ")}
                >
                  {opt.label}
                </span>
                {active && (
                  <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
