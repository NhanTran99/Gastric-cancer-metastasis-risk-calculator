import { NumericInput } from "./NumericInput";
import { MODEL_CONFIG } from "../../config/model";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const { displayNames: dn, validation } = MODEL_CONFIG;

export function PLRInput({ value, onChange }: Props) {
  return (
    <NumericInput
      label={dn.plr}
      shortLabel={dn.plrShort}
      value={value}
      onChange={onChange}
      min={validation.plr.min}
      max={validation.plr.max}
      step={1}
      unit="ratio"
    />
  );
}
