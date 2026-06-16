import { CollapsiblePanel } from "../shared/CollapsiblePanel";

export function ResearchInfoPanel() {
  return (
    <CollapsiblePanel label="Research Tool Information" defaultOpen={false}>

      {/* Tool identity */}
      <div className="mb-4">
        <p className="text-[13px] font-semibold text-slate-800 leading-snug mb-1">
          Gastric Cancer Distant Metastasis Risk Calculator
        </p>
        <p className="text-[11px] text-slate-400">Version v1.0</p>
      </div>

      {/* Metadata tiles */}
      <div className="grid grid-cols-1 gap-2 mb-4">

        {/* Development Cohort */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Development Cohort
          </p>
          <p className="text-[12px] font-medium text-slate-700">
            114 Vietnamese gastric cancer patients
          </p>
        </div>

        {/* Publication Status + Manuscript Year — side by side */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Publication Status
            </p>
            <p className="text-[12px] font-medium text-slate-700">
              Under Review
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Manuscript Year
            </p>
            <p className="text-[12px] font-medium text-slate-700">
              2026
            </p>
          </div>
        </div>

      </div>

      {/* Underlying Study */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Underlying Study
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed italic">
          The Association of Neutrophil-to-Lymphocyte and Platelet-to-Lymphocyte
          Ratios with Distant Metastasis in Vietnamese Gastric Cancer Patients
        </p>
      </div>

      {/* Suggested Citation */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Suggested Citation
        </p>
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-3">
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Tran N, Nguyen HQ, et al.{" "}
            <span className="italic">
              The Association of Neutrophil-to-Lymphocyte and
              Platelet-to-Lymphocyte Ratios with Distant Metastasis in
              Vietnamese Gastric Cancer Patients.
            </span>{" "}
            <span className="text-slate-500">
              Manuscript currently under review. Citation information will be
              updated upon publication.
            </span>
          </p>
        </div>
      </div>

    </CollapsiblePanel>
  );
}
