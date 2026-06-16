export function ResearchToolCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Research Tool
        </p>
      </div>

      {/* Description */}
      <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
        Based on a multivariable logistic regression model developed from 114
        Vietnamese gastric cancer patients.
      </p>

      {/* Two-column metadata grid */}
      <div className="grid grid-cols-1 gap-2">

        {/* Research Team */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Research Team
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-700">
                Nhan Tran, MD, MSc
              </span>
              <span className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5 shrink-0 ml-2">
                First Author
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-700">
                Hoang Quy Nguyen, MD, PhD
              </span>
              <span className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5 shrink-0 ml-2">
                Corresponding
              </span>
            </div>
          </div>
        </div>

        {/* Institution */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Institution
          </p>
          <p className="text-[12px] font-medium text-slate-700 leading-snug">
            University of Medicine and Pharmacy at Ho Chi Minh City
          </p>
        </div>

      </div>
    </div>
  );
}
