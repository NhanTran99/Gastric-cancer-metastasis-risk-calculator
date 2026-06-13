import { LeftPanel }  from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import type {
  NomogramInputs,
  RiskResult,
  HeatmapCell,
  ContourLine,
} from "../../types/nomogram";

interface Props {
  inputs: NomogramInputs;
  result: RiskResult;
  heatmapGrid: HeatmapCell[];
  contourLines: ContourLine[];
  onTumorLocationChange: (v: NomogramInputs["tumorLocation"]) => void;
  onNlrChange: (v: number) => void;
  onPlrChange: (v: number) => void;
}

export function NomogramLayout({
  inputs,
  result,
  heatmapGrid,
  contourLines,
  onTumorLocationChange,
  onNlrChange,
  onPlrChange,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
      <LeftPanel
        inputs={inputs}
        result={result}
        onTumorLocationChange={onTumorLocationChange}
        onNlrChange={onNlrChange}
        onPlrChange={onPlrChange}
      />
      <RightPanel
        inputs={inputs}
        result={result}
        heatmapGrid={heatmapGrid}
        contourLines={contourLines}
      />
    </div>
  );
}
