import { buildInterpretation } from "../../utils/interpretation";
import type { NomogramInputs, RiskCategory } from "../../types/nomogram";

interface Props {
  inputs: NomogramInputs;
  probability: number;
  category: RiskCategory;
  isValid: boolean;
}

export function ClinicalInterpretation({
  inputs,
  probability,
  category,
  isValid,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Clinical Interpretation
      </p>

      {isValid ? (
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {buildInterpretation(inputs, probability, category)}
        </p>
      ) : (
        <p className="text-[13px] text-slate-300 italic">
          Enter valid NLR and PLR values to generate an interpretation.
        </p>
      )}
    </div>
  );
}
