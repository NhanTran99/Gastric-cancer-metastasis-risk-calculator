import { useState, useMemo } from "react";
import {
  calculateRisk,
  validateInputs,
  computeHeatmapGridForLocation,
  computeContourLines,
} from "../utils/calculator";
import type {
  NomogramInputs,
  RiskResult,
  HeatmapCell,
  ContourLine,
} from "../types/nomogram";

const DEFAULT_INPUTS: NomogramInputs = {
  tumorLocation: "single",
  nlr: 3.7,
  plr: 168,
};

export interface NomogramState {
  inputs: NomogramInputs;
  result: RiskResult;
  validationError: string | null;
  // Heatmap — recomputed only when tumorLocation changes, not on NLR/PLR changes.
  heatmapGrid: HeatmapCell[];
  contourLines: ContourLine[];
  setTumorLocation: (v: NomogramInputs["tumorLocation"]) => void;
  setNlr: (v: number) => void;
  setPlr: (v: number) => void;
}

export function useNomogram(): NomogramState {
  const [inputs, setInputs] = useState<NomogramInputs>(DEFAULT_INPUTS);

  const validationError = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => calculateRisk(inputs), [inputs]);

  // Grid and contours depend only on tumorLocation — stable across NLR/PLR edits.
  const heatmapGrid = useMemo(
    () => computeHeatmapGridForLocation(inputs.tumorLocation),
    [inputs.tumorLocation]
  );
  const contourLines = useMemo(
    () => computeContourLines(inputs.tumorLocation),
    [inputs.tumorLocation]
  );

  function setTumorLocation(v: NomogramInputs["tumorLocation"]) {
    setInputs((prev) => ({ ...prev, tumorLocation: v }));
  }
  function setNlr(v: number) {
    setInputs((prev) => ({ ...prev, nlr: v }));
  }
  function setPlr(v: number) {
    setInputs((prev) => ({ ...prev, plr: v }));
  }

  return {
    inputs,
    result,
    validationError,
    heatmapGrid,
    contourLines,
    setTumorLocation,
    setNlr,
    setPlr,
  };
}
