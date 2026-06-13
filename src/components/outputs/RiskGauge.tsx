import { useMemo } from "react";
import type { RiskCategory } from "../../types/nomogram";

interface Props {
  probability: number;
  category: RiskCategory;
  isValid: boolean;
}

const CX = 150;
const CY = 130;
const R = 95;
const SW = 12;
const NEEDLE_LEN = 72;

const SEMICIRCLE = `
M ${CX - R} ${CY}
A ${R} ${R} 0 0 1 ${CX + R} ${CY}
`;

const TOTAL_LENGTH = Math.PI * R;

function dashArray(probability: number): string {
  const visible =
    Math.max(0, Math.min(1, probability)) * TOTAL_LENGTH;

  return `${visible} ${TOTAL_LENGTH}`;
}

function needleTip(probability: number) {
  const angle =
    Math.PI * (1 - Math.max(0, Math.min(1, probability)));

  return {
    x: CX + NEEDLE_LEN * Math.cos(angle),
    y: CY - NEEDLE_LEN * Math.sin(angle),
  };
}

const FILL_COLOR: Record<RiskCategory, string> = {
  low: "#475569",
  intermediate: "#F59E0B",
  high: "#DC2626",
};

export function RiskGauge({
  probability,
  category,
  isValid,
}: Props) {
  const displayP = isValid
    ? Math.max(0, Math.min(1, probability))
    : 0;

  const fillColor = isValid
    ? FILL_COLOR[category]
    : "#CBD5E1";

  const tip = useMemo(
    () => needleTip(displayP),
    [displayP]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Risk Gauge
      </p>

      <svg
        viewBox="0 0 300 180"
        width="100%"
        role="img"
        aria-label={
          isValid
            ? `Risk gauge showing ${(probability * 100).toFixed(1)} percent`
            : "Risk gauge"
        }
      >
        {/* Background track */}
        <path
          d={SEMICIRCLE}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={SW}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        {displayP > 0.001 && (
          <path
            d={SEMICIRCLE}
            fill="none"
            stroke={fillColor}
            strokeWidth={SW}
            strokeLinecap="round"
            strokeDasharray={dashArray(displayP)}
            style={{
              transition:
                "stroke-dasharray 0.35s ease, stroke 0.35s ease",
            }}
          />
        )}

        {/* Labels */}
        <text
          x={35}
          y={140}
          fontSize={10}
          fill="#94A3B8"
        >
          0%
        </text>

        <text
          x={150}
          y={16}
          textAnchor="middle"
          fontSize={10}
          fill="#94A3B8"
        >
          50%
        </text>

        <text
          x={265}
          y={140}
          textAnchor="end"
          fontSize={10}
          fill="#94A3B8"
        >
          100%
        </text>

        {/* Needle */}
        <line
          x1={CX}
          y1={CY}
          x2={tip.x}
          y2={tip.y}
          stroke={fillColor}
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transition:
              "x2 0.35s ease, y2 0.35s ease, stroke 0.35s ease",
          }}
        />

        {/* Pivot */}
        <circle
          cx={CX}
          cy={CY}
          r={5}
          fill={fillColor}
        />

        <circle
          cx={CX}
          cy={CY}
          r={2.5}
          fill="white"
        />

        {/* Percentage */}
        {isValid && (
          <text
            x={CX}
            y={168}
            textAnchor="middle"
            fontSize={20}
            fontWeight={700}
            fill={fillColor}
          >
            {(probability * 100).toFixed(1)}%
          </text>
        )}
      </svg>
    </div>
  );
}