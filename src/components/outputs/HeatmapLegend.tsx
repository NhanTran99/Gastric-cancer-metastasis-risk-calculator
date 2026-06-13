interface Props {
  backgroundLabel: string; // e.g. "Background: Single Site"
}

export function HeatmapLegend({ backgroundLabel }: Props) {
  return (
    <div className="flex items-center justify-between mt-3 flex-wrap gap-y-2">
      {/* Color scale */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
          Lower risk
        </span>
        <div
          className="h-2 flex-1 min-w-[80px] rounded-full"
          style={{
            background:
              "linear-gradient(to right, #64748B, #94A3B8, #F59E0B, #DC2626, #7F1D1D)",
          }}
          aria-hidden="true"
        />
        <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
          Higher risk
        </span>
      </div>

      {/* Background label pill */}
      <div className="ml-3 shrink-0">
        <span className="text-[10px] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 whitespace-nowrap">
          {backgroundLabel}
        </span>
      </div>

      {/* Contour key */}
      <div className="w-full flex items-center gap-4 mt-1.5">
        <div className="flex items-center gap-1.5">
          <svg width="20" height="8" aria-hidden="true">
            <line
              x1="0" y1="4" x2="20" y2="4"
              stroke="white" strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </svg>
          <span className="text-[10px] text-slate-400">50% threshold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="20" height="8" aria-hidden="true">
            <line
              x1="0" y1="4" x2="20" y2="4"
              stroke="rgba(255,255,255,0.55)" strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
          <span className="text-[10px] text-slate-400">20% threshold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="#374151" strokeWidth="2"/>
            <circle cx="7" cy="7" r="2" fill="#374151"/>
          </svg>
          <span className="text-[10px] text-slate-400">Current patient</span>
        </div>
      </div>
    </div>
  );
}
