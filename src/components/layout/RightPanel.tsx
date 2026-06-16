import { RiskDisplay }            from "../outputs/RiskDisplay";
import { ResearchToolCard }       from "../outputs/ResearchToolCard";
import { RiskGauge }              from "../outputs/RiskGauge";
import { RiskCategoryBadge }      from "../outputs/RiskCategoryBadge";
import { ClinicalInterpretation } from "../outputs/ClinicalInterpretation";
import { ContributionBars }       from "../outputs/ContributionBars";
import { RiskHeatmap }            from "../outputs/RiskHeatmap";
import { ClinicalFormulaPanel }   from "../outputs/ClinicalFormulaPanel";
import { ModelTransparencyPanel } from "../outputs/ModelTransparencyPanel";
import { AboutModelPanel }        from "../outputs/AboutModelPanel";
import { ResearchInfoPanel }      from "../outputs/ResearchInfoPanel";
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
}

export function RightPanel({ inputs, result, heatmapGrid, contourLines }: Props) {
  const { probability, category, isValid, contributions } = result;

  return (
    <main className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="px-6 py-6 flex flex-col gap-4 max-w-2xl">

        {/* 1 ── Dominant risk number */}
        <RiskDisplay
          probability={probability}
          category={category}
          isValid={isValid}
        />

        {/* 2 ── Research identity card (always visible) */}
        <ResearchToolCard />

        {/* 3 ── Gauge */}
        <RiskGauge
          probability={probability}
          category={category}
          isValid={isValid}
        />

        {/* 4 ── Category badges */}
        <RiskCategoryBadge category={category} isValid={isValid} />

        {/* 5 ── Interpretation */}
        <ClinicalInterpretation
          inputs={inputs}
          probability={probability}
          category={category}
          isValid={isValid}
        />

        {/* 6 ── Contribution bars */}
        <ContributionBars contributions={contributions} isValid={isValid} />

        {/* 7 ── Risk landscape heatmap */}
        <RiskHeatmap
          cells={heatmapGrid}
          contourLines={contourLines}
          inputs={inputs}
          probability={probability}
          isValid={isValid}
        />

        {/* 8 ── Clinical formula (collapsible) */}
        <ClinicalFormulaPanel />

        {/* 9 ── Model transparency (collapsible) */}
        <ModelTransparencyPanel />

        {/* 10 ── About this model (collapsible) */}
        <AboutModelPanel />

        {/* 11 ── Research tool information (collapsible) */}
        <ResearchInfoPanel />

      </div>
    </main>
  );
}
