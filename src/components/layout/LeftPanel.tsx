import { TumorLocationSelect } from "../inputs/TumorLocationSelect";
import { NLRInput }            from "../inputs/NLRInput";
import { PLRInput }            from "../inputs/PLRInput";
import { ExportPanel }         from "../export/ExportPanel";
import { SafetyDisclaimer }    from "../shared/SafetyDisclaimer";
import type { NomogramInputs, RiskResult } from "../../types/nomogram";

interface Props {
  inputs: NomogramInputs;
  result: RiskResult;
  onTumorLocationChange: (v: NomogramInputs["tumorLocation"]) => void;
  onNlrChange: (v: number) => void;
  onPlrChange: (v: number) => void;
}

export function LeftPanel({
  inputs,
  result,
  onTumorLocationChange,
  onNlrChange,
  onPlrChange,
}: Props) {
  return (
    <aside className="flex flex-col gap-0 border-r border-slate-200 bg-white w-full lg:w-[288px] shrink-0">
      {/* Section heading */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Patient Parameters
        </p>
      </div>

      {/* Input fields */}
      <div className="px-5 py-5 flex flex-col gap-5 flex-1">
        <TumorLocationSelect
          value={inputs.tumorLocation}
          onChange={onTumorLocationChange}
        />
        <div className="h-px bg-slate-100" />
        <NLRInput value={inputs.nlr} onChange={onNlrChange} />
        <div className="h-px bg-slate-100" />
        <PLRInput value={inputs.plr} onChange={onPlrChange} />
      </div>

      {/* Export buttons */}
      <ExportPanel inputs={inputs} result={result} />

      {/* Safety disclaimer */}
      <div className="px-5 pb-5">
        <SafetyDisclaimer />
      </div>
    </aside>
  );
}
