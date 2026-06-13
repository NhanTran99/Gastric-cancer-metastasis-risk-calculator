import type { HeatmapTooltipData } from "../../types/nomogram";
import { MODEL_CONFIG } from "../../config/model";

interface Props {
  data: HeatmapTooltipData;
  /** Pixel position within the SVG overlay, 0–1 normalised */
  xNorm: number;
  yNorm: number;
  svgWidth: number;
  svgHeight: number;
}

const { displayNames: dn } = MODEL_CONFIG;

export function HeatmapTooltip({
  data,
  xNorm,
  yNorm,
  svgWidth,
  svgHeight,
}: Props) {
  const TOOLTIP_W = 178;
  const TOOLTIP_H = 108;
  const MARKER_R  = 10; // keep clear of marker circle
  const PAD       = 8;

  // Pixel position of the marker
  const mx = xNorm * svgWidth;
  const my = yNorm * svgHeight;

  // Default: tooltip above-right of marker
  let tx = mx + MARKER_R + 4;
  let ty = my - TOOLTIP_H - MARKER_R;

  // Clamp to SVG bounds
  if (tx + TOOLTIP_W > svgWidth - PAD) tx = mx - TOOLTIP_W - MARKER_R - 4;
  if (ty < PAD) ty = my + MARKER_R + 4;
  if (ty + TOOLTIP_H > svgHeight - PAD) ty = svgHeight - PAD - TOOLTIP_H;

  return (
    <g role="tooltip" aria-label={`Patient marker: ${data.probabilityPercent} predicted risk`}>
      {/* Card background */}
      <rect
        x={tx}
        y={ty}
        width={TOOLTIP_W}
        height={TOOLTIP_H}
        rx={8}
        fill="white"
        stroke="#CBD5E1"
        strokeWidth={0.5}
      />

      {/* Header */}
      <rect x={tx} y={ty} width={TOOLTIP_W} height={24} rx={8} fill="#0F172A" />
      <rect x={tx} y={ty + 16} width={TOOLTIP_W} height={8} fill="#0F172A" />
      <text
        x={tx + 10}
        y={ty + 15}
        fontSize={9}
        fontWeight="600"
        fill="white"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        letterSpacing="0.05em"
      >
        CURRENT PATIENT
      </text>

      {/* Row helper */}
      {(
        [
          [dn.tumorLocation, data.tumorLocationLabel],
          [dn.nlrShort, data.nlr.toFixed(1)],
          [dn.plrShort, String(Math.round(data.plr))],
          ["Predicted risk", data.probabilityPercent],
        ] as [string, string][]
      ).map(([label, value], i) => {
        const rowY = ty + 36 + i * 17;
        const isRisk = i === 3;
        return (
          <g key={label}>
            <text
              x={tx + 10}
              y={rowY}
              fontSize={9}
              fill="#64748B"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {label}
            </text>
            <text
              x={tx + TOOLTIP_W - 10}
              y={rowY}
              fontSize={isRisk ? 10 : 9}
              fontWeight={isRisk ? "700" : "500"}
              fill={isRisk ? "#0F172A" : "#334155"}
              textAnchor="end"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {value}
            </text>
            {/* Divider between rows */}
            {i < 3 && (
              <line
                x1={tx + 10}
                y1={rowY + 5}
                x2={tx + TOOLTIP_W - 10}
                y2={rowY + 5}
                stroke="#F1F5F9"
                strokeWidth={0.5}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
