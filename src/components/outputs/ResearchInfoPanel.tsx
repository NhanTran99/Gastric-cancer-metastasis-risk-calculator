import { ExternalLink, Github, Linkedin } from "lucide-react";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";

export function ResearchInfoPanel() {
  return (
    <CollapsiblePanel label="Research Software Information" defaultOpen={false}>

      {/* Tool identity */}
      <div className="mb-4">
        <p className="text-[13px] font-semibold text-slate-800 leading-snug mb-1">
          Gastric Cancer Distant Metastasis Risk Calculator
        </p>
        <p className="text-[11px] text-slate-400">Version v1.0</p>
      </div>

      {/* Developer, institution, purpose — metadata tiles */}
      <div className="grid grid-cols-1 gap-2 mb-4">

        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Developer
          </p>
          <p className="text-[12px] font-medium text-slate-700">
            Nhan Tran, MD, MSc
          </p>
        </div>

        {/* Institution — updated to University of Medicine and Pharmacy at Ho Chi Minh City */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Institution
          </p>
          <p className="text-[12px] font-medium text-slate-700 leading-snug">
            University of Medicine and Pharmacy at Ho Chi Minh City
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Purpose
          </p>
          <p className="text-[12px] font-medium text-slate-700">
            Research and educational use only
          </p>
        </div>

        {/* Development cohort — NEW */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Development Cohort
          </p>
          <p className="text-[12px] font-medium text-slate-700">
            114 Vietnamese gastric cancer patients
          </p>
        </div>

        {/* Publication status — NEW */}
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

      {/* Research team — NEW */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Research Team
        </p>
        <div className="rounded-lg bg-slate-50 border border-slate-200 divide-y divide-slate-200">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-700">Nhan Tran</span>
            <span className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5">
              First Author
            </span>
          </div>
          <div className="px-3 py-2.5 flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-700">Hoang Quy Nguyen</span>
            <span className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5">
              Corresponding Author
            </span>
          </div>
        </div>
      </div>

      {/* Underlying study */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Underlying Study
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed italic">
          The Association of Neutrophil-to-Lymphocyte and Platelet-to-Lymphocyte
          Ratios with Distant Metastasis in Vietnamese Gastric Cancer Patients
        </p>
      </div>

      {/* How to cite */}
      <div className="mb-4">
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

      {/* Links */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Links
        </p>
        <div className="flex flex-col gap-2">

          {/* GitHub — live */}
          <a
            href="https://github.com/NhanTran99/Gastric-cancer-metastasis-risk-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="flex-1">GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>

          {/* LinkedIn — live URL added */}
          <a
            href="https://www.linkedin.com/in/nhantran0909/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="flex-1">LinkedIn</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>


        </div>
      </div>

      {/* Copyright footer — NEW */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          © 2026 Nhan Tran. Research software for educational and scientific use.
        </p>
      </div>

    </CollapsiblePanel>
  );
}
