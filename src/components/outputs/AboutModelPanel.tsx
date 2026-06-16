import { CollapsiblePanel } from "../shared/CollapsiblePanel";

export function AboutModelPanel() {
  return (
    <CollapsiblePanel label="About This Model" defaultOpen={false}>

      {/* Overview paragraph */}
      <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
        This calculator estimates the probability of distant metastasis in gastric
        cancer patients using a multivariable logistic regression model developed
        from a Vietnamese patient cohort.
      </p>

      {/* Model type — NEW */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Model Type
        </p>
        <p className="text-[12px] text-slate-600">
          Multivariable Logistic Regression
        </p>
      </div>

      {/* Predictors */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Predictors
        </p>
        <ul className="space-y-1.5">
          {[
            "Tumor location (Single Site vs Multiple Sites)",
            "Neutrophil-to-Lymphocyte Ratio (NLR)",
            "Platelet-to-Lymphocyte Ratio (PLR)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-[12px] text-slate-600">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Output */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Output
        </p>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2 text-[12px] text-slate-600">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
            Estimated probability of distant metastasis
          </li>
        </ul>
      </div>

      {/* Important notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 mb-1">
          Important
        </p>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          This tool is intended for research and educational purposes and should
          not replace clinical judgement or physician decision-making.
        </p>
      </div>

    </CollapsiblePanel>
  );
}
