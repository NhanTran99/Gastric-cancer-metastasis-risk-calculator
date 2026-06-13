import { useCallback } from "react";
import { CopyButton } from "./CopyButton";
import { PDFButton }  from "./PDFButton";
import { buildReportData, buildClipboardText } from "../../utils/export";
import type { NomogramInputs, RiskResult } from "../../types/nomogram";

interface Props {
  inputs: NomogramInputs;
  result: RiskResult;
}

export function ExportPanel({ inputs, result }: Props) {
  // Both buttons receive lazy getters so report data is assembled at click-time,
  // capturing the very latest input values rather than values at render time.
  const getClipboardText = useCallback(
    () => buildClipboardText(buildReportData(inputs, result)),
    [inputs, result]
  );

  const getReportData = useCallback(
    () => buildReportData(inputs, result),
    [inputs, result]
  );

  // Disable export when inputs are invalid
  if (!result.isValid) {
    return (
      <div className="px-5 pb-4">
        <div className="h-px bg-slate-100 mb-4" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Export
        </p>
        <p className="text-[11px] text-slate-300 italic">
          Enter valid parameters to enable export.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-4">
      <div className="h-px bg-slate-100 mb-4" />
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Export
      </p>
      <div className="flex flex-col gap-2">
        <CopyButton getText={getClipboardText} />
        <PDFButton  getReportData={getReportData} />
      </div>
    </div>
  );
}
