import { TriangleAlert } from "lucide-react";

export function SafetyDisclaimer() {
  return (
    <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <TriangleAlert className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
      <p className="text-[11px] leading-relaxed text-amber-800">
        <span className="font-semibold">For research and educational use only.</span>{" "}
        This calculator is not intended to replace physician judgment or
        clinical decision-making.
      </p>
    </div>
  );
}
