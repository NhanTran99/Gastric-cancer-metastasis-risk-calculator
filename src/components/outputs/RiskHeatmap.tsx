import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { MODEL_CONFIG } from "../../config/model";
import { HeatmapLegend } from "./HeatmapLegend";
import { PatientMarker } from "./PatientMarker";
import { HeatmapTooltip } from "./HeatmapTooltip";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import type {
  HeatmapCell,
  ContourLine,
  NomogramInputs,
  HeatmapTooltipData,
} from "../../types/nomogram";

// ─── Approved 5-stop color scale: Slate → Amber → Red → Dark Red ─────────────
// Intentionally avoids pale/invisible low-risk end by starting at a visible slate.
const COLOR_STOPS: Array<{ p: number; r: number; g: number; b: number }> = [
  { p: 0.00, r: 100, g: 116, b: 139 }, // slate-500  #64748B
  { p: 0.20, r: 148, g: 163, b: 184 }, // slate-400  #94A3B8 — low/intermediate boundary
  { p: 0.40, r: 245, g: 158, b:  11 }, // amber-500  #F59E0B
  { p: 0.70, r: 220, g:  38, b:  38 }, // red-600    #DC2626
  { p: 1.00, r: 127, g:  29, b:  29 }, // red-900    #7F1D1D
];

/** Interpolate RGB across the 5-stop scale for a given probability 0–1 */
function probabilityToRgb(p: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, p));
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const lo = COLOR_STOPS[i];
    const hi = COLOR_STOPS[i + 1];
    if (clamped >= lo.p && clamped <= hi.p) {
      const t = (clamped - lo.p) / (hi.p - lo.p);
      return [
        Math.round(lo.r + t * (hi.r - lo.r)),
        Math.round(lo.g + t * (hi.g - lo.g)),
        Math.round(lo.b + t * (hi.b - lo.b)),
      ];
    }
  }
  const last = COLOR_STOPS[COLOR_STOPS.length - 1];
  return [last.r, last.g, last.b];
}

// ─── Axis config shorthand ────────────────────────────────────────────────────
const { plr: PLR_AXIS, nlr: NLR_AXIS } = MODEL_CONFIG.heatmapAxes;
const PLR_COLS = Math.round((PLR_AXIS.max - PLR_AXIS.min) / PLR_AXIS.step) + 1; // 36
const NLR_ROWS = Math.round((NLR_AXIS.max - NLR_AXIS.min) / NLR_AXIS.step) + 1; // 21

// Padding inside the canvas allocated for axis tick labels (px, CSS units)
const AXIS_LEFT   = 32; // NLR tick labels
const AXIS_BOTTOM = 20; // PLR tick labels
const AXIS_TOP    = 6;
const AXIS_RIGHT  = 4;

// ─── Canvas draw function ─────────────────────────────────────────────────────
function drawGrid(
  canvas: HTMLCanvasElement,
  cells: HeatmapCell[],
  dpr: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // CSS dimensions
  const cssW = canvas.offsetWidth;
  const cssH = canvas.offsetHeight;
  // Physical dimensions (retina-sharp)
  canvas.width  = Math.round(cssW  * dpr);
  canvas.height = Math.round(cssH  * dpr);
  ctx.scale(dpr, dpr);

  const plotW = cssW - AXIS_LEFT - AXIS_RIGHT;
  const plotH = cssH - AXIS_TOP  - AXIS_BOTTOM;
  const cellW = plotW / PLR_COLS;
  const cellH = plotH / NLR_ROWS;

  // Draw each cell
  for (const cell of cells) {
    const col = Math.round((cell.plr - PLR_AXIS.min) / PLR_AXIS.step);
    // NLR increases upward, canvas Y increases downward → invert
    const row = NLR_ROWS - 1 - Math.round((cell.nlr - NLR_AXIS.min) / NLR_AXIS.step);

    const x = AXIS_LEFT + col * cellW;
    const y = AXIS_TOP  + row * cellH;

    const [r, g, b] = probabilityToRgb(cell.probability);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    // +0.5 overlap to prevent 1px gaps between cells at non-integer zoom levels
    ctx.fillRect(x, y, Math.ceil(cellW) + 0.5, Math.ceil(cellH) + 0.5);
  }

  // NLR axis tick labels (left)
  ctx.fillStyle = "rgba(148,163,184,0.9)";
  ctx.font      = `9px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const nlrTicks = [0, 2, 4, 6, 8, 10];
  for (const nlr of nlrTicks) {
    const row = NLR_ROWS - 1 - Math.round((nlr - NLR_AXIS.min) / NLR_AXIS.step);
    const y   = AXIS_TOP + row * cellH + cellH / 2;
    ctx.fillText(String(nlr), AXIS_LEFT - 4, y);
  }

  // PLR axis tick labels (bottom)
  ctx.textAlign    = "center";
  ctx.textBaseline = "top";
  const plrTicks = [50, 100, 150, 200, 250, 300, 350, 400];
  for (const plr of plrTicks) {
    const col = Math.round((plr - PLR_AXIS.min) / PLR_AXIS.step);
    const x   = AXIS_LEFT + col * cellW + cellW / 2;
    ctx.fillText(String(plr), x, cssH - AXIS_BOTTOM + 2);
  }
}

// ─── Coordinate conversion helpers ───────────────────────────────────────────
/** Convert NLR value to normalised Y (0 = top of plot area = NLR_MAX) */
function nlrToYNorm(nlr: number): number {
  return 1 - (nlr - NLR_AXIS.min) / (NLR_AXIS.max - NLR_AXIS.min);
}
/** Convert PLR value to normalised X (0 = left = PLR_MIN) */
function plrToXNorm(plr: number): number {
  return (plr - PLR_AXIS.min) / (PLR_AXIS.max - PLR_AXIS.min);
}
/**
 * Map normalised coordinates (0–1 within plot area) to absolute SVG
 * coordinates, accounting for axis padding.
 */
function normToSvg(
  xNorm: number,
  yNorm: number,
  svgW: number,
  svgH: number
): [number, number] {
  const plotW = svgW - AXIS_LEFT - AXIS_RIGHT;
  const plotH = svgH - AXIS_TOP  - AXIS_BOTTOM;
  return [
    AXIS_LEFT  + xNorm * plotW,
    AXIS_TOP   + yNorm * plotH,
  ];
}

// ─── Contour path builder ─────────────────────────────────────────────────────
function buildContourPath(
  points: ContourLine["points"],
  svgW: number,
  svgH: number
): string {
  if (points.length < 2) return "";
  return points
    .map((pt, i) => {
      const [sx, sy] = normToSvg(plrToXNorm(pt.plr), nlrToYNorm(pt.nlr), svgW, svgH);
      return `${i === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
    })
    .join(" ");
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  cells: HeatmapCell[];
  contourLines: ContourLine[];
  inputs: NomogramInputs;
  probability: number;
  isValid: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RiskHeatmap({
  cells,
  contourLines,
  inputs,
  probability,
  isValid,
}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize]     = useState({ w: 400, h: 220 });
  const [showTooltip, setShowTooltip] = useState(false);

  const { displayNames: dn } = MODEL_CONFIG;

  // ── Draw canvas whenever cells change (= tumor location changed) ────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    drawGrid(canvas, cells, dpr);
  }, [cells]);

  // ── Track container size for SVG overlay and canvas redraw on resize ────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSvgSize({ w: width, h: height });
      // Redraw canvas at new size
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        drawGrid(canvas, cells, dpr);
      }
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [cells]);

  // ── Patient marker position in SVG coordinates ──────────────────────────────
  const markerPos = useMemo(() => {
    const xNorm = plrToXNorm(inputs.plr);
    const yNorm = nlrToYNorm(inputs.nlr);
    return { xNorm, yNorm };
  }, [inputs.nlr, inputs.plr]);

  // ── Tooltip data ─────────────────────────────────────────────────────────────
  const tooltipData: HeatmapTooltipData = {
    tumorLocationLabel:
      inputs.tumorLocation === "single"
        ? dn.tumorSingleSite
        : dn.tumorMultipleSites,
    nlr:       inputs.nlr,
    plr:       inputs.plr,
    probability,
    probabilityPercent: (probability * 100).toFixed(1) + "%",
  };

  // Background label
  const bgLabel =
    "Background: " +
    (inputs.tumorLocation === "single" ? dn.tumorSingleSite : dn.tumorMultipleSites);

  const handleMarkerClick = useCallback(() => {
    setShowTooltip((v) => !v);
  }, []);

  const content = (
    <div>
      <div style={{ fontSize: 11, color: "#546E7A", marginBottom: 10 }}>
        How inflammatory biomarkers influence predicted metastasis risk
      </div>

      {/* Canvas + SVG overlay wrapper */}
      <div
        ref={wrapperRef}
        className="relative w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: "4 / 2.2" }}
      >
        {/* Layer 1 — background canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Layer 2 — SVG overlay: marker, contours, tooltip */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
          preserveAspectRatio="none"
          onClick={() => setShowTooltip(false)}
          aria-label="Risk landscape heatmap with patient marker"
        >
          {/* Contour lines */}
          {contourLines.map((cl) => {
            const d = buildContourPath(cl.points, svgSize.w, svgSize.h);
            if (!d) return null;
            const is50 = cl.probability >= 0.5;
            return (
              <g key={cl.probability}>
                <path
                  d={d}
                  fill="none"
                  stroke="white"
                  strokeWidth={is50 ? 1.5 : 1}
                  strokeDasharray={is50 ? "5 3" : "3 4"}
                  strokeOpacity={is50 ? 0.85 : 0.55}
                  strokeLinecap="round"
                />
                {/* Label on the contour line — placed at the midpoint */}
                {cl.points.length > 0 && (() => {
                  const mid = cl.points[Math.floor(cl.points.length / 2)];
                  const [lx, ly] = normToSvg(
                    plrToXNorm(mid.plr),
                    nlrToYNorm(mid.nlr),
                    svgSize.w,
                    svgSize.h
                  );
                  return (
                    <text
                      x={lx}
                      y={ly - 5}
                      fontSize={8}
                      fill="white"
                      fillOpacity={is50 ? 0.9 : 0.7}
                      textAnchor="middle"
                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                      fontWeight="600"
                    >
                      {cl.label}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Patient marker */}
          <PatientMarker
            xNorm={markerPos.xNorm}
            yNorm={markerPos.yNorm}
            svgWidth={svgSize.w}
            svgHeight={svgSize.h}
            probability={probability}
            isValid={isValid}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleMarkerClick();
            }}
          />

          {/* Tooltip — shown when marker is clicked */}
          {showTooltip && isValid && (
            <HeatmapTooltip
              data={tooltipData}
              xNorm={markerPos.xNorm}
              yNorm={markerPos.yNorm}
              svgWidth={svgSize.w}
              svgHeight={svgSize.h}
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <HeatmapLegend backgroundLabel={bgLabel} />

      {/* Exploratory note */}
      <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">
        Tap the patient marker to see details. Dashed lines mark the 20% and 50%
        exploratory category boundaries. These boundaries are visualization aids
        and are not externally validated clinical thresholds. Background calculated
        for the currently selected tumor location.
      </p>
    </div>
  );

  // ── On mobile (< sm breakpoint) wrap in CollapsiblePanel ────────────────────
  // We use a CSS approach: always render both, show/hide with breakpoint classes.
  return (
    <>
      {/* Desktop — always open */}
      <div className="hidden sm:block rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Risk Landscape
        </p>
        {content}
      </div>

      {/* Mobile — collapsed by default */}
      <div className="sm:hidden">
        <CollapsiblePanel label="Risk Landscape" defaultOpen={false}>
          {content}
        </CollapsiblePanel>
      </div>
    </>
  );
}
