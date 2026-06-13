import { useState, useCallback } from "react";
import { Download, Loader } from "lucide-react";
import { generateAndDownloadPDF } from "../../utils/export";
import type { ReportData } from "../../utils/export";

interface Props {
  getReportData: () => ReportData;
}

type State = "idle" | "loading" | "error";

export function PDFButton({ getReportData }: Props) {
  const [state, setState] = useState<State>("idle");

  const handleClick = useCallback(async () => {
    if (state !== "idle") return;
    setState("loading");
    try {
      await generateAndDownloadPDF(getReportData());
      setState("idle");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }, [state, getReportData]);

  const isLoading = state === "loading";
  const isError   = state === "error";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-live="polite"
      aria-label={
        isLoading ? "Generating PDF, please wait" :
        isError   ? "PDF generation failed — please try again" :
        "Export results as PDF"
      }
      className={[
        "flex items-center justify-center gap-2 w-full rounded-lg border px-3 py-2.5",
        "text-[12px] font-medium transition-all duration-200",
        isError
          ? "border-red-300 bg-red-50 text-red-600"
          : isLoading
          ? "border-slate-200 bg-slate-50 text-slate-400 cursor-wait"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {isLoading ? (
        <Loader className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {isLoading ? "Generating…" : isError ? "Export failed" : "Export PDF"}
    </button>
  );
}
