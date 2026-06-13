interface Props {
  xNorm: number;
  yNorm: number;
  svgWidth: number;
  svgHeight: number;
  probability: number;
  isValid: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function ringColor(p: number): string {
  if (p < 0.2)  return "#475569";
  if (p < 0.5)  return "#F59E0B";
  return "#DC2626";
}

export function PatientMarker({
  xNorm,
  yNorm,
  svgWidth,
  svgHeight,
  probability,
  isValid,
  onClick,
}: Props) {
  if (!isValid) return null;

  const cx   = xNorm * svgWidth;
  const cy   = yNorm * svgHeight;
  const ring = ringColor(probability);

  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={`Patient marker. Predicted risk ${(probability * 100).toFixed(1)}%. Click for details.`}
    >
      {/* Outer pulse ring */}
      <circle cx={cx} cy={cy} r={14} fill="none" stroke={ring} strokeWidth={1} opacity={0.25} />
      {/* White outer ring */}
      <circle
        cx={cx} cy={cy} r={9}
        fill="white" stroke={ring} strokeWidth={2.5}
        style={{ transition: "cx 0.35s ease, cy 0.35s ease, stroke 0.35s ease" }}
      />
      {/* Coloured inner dot */}
      <circle
        cx={cx} cy={cy} r={4}
        fill={ring}
        style={{ transition: "cx 0.35s ease, cy 0.35s ease, fill 0.35s ease" }}
      />
      {/* Enlarged tap target */}
      <circle cx={cx} cy={cy} r={18} fill="transparent" />
    </g>
  );
}
