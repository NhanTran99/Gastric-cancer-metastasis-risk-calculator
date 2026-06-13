import { NumericInput } from "./NumericInput";
import { MODEL_CONFIG } from "../../config/model";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const { displayNames: dn, validation } = MODEL_CONFIG;

export function NLRInput({ value, onChange }: Props) {
  return (
    <NumericInput
      label={dn.nlr}
      shortLabel={dn.nlrShort}
      value={value}
      onChange={onChange}
      min={validation.nlr.min}
      max={validation.nlr.max}
      step={0.1}
      unit="ratio"
    />
  );
}
