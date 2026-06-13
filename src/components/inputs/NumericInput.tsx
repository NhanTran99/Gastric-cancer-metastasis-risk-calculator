import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  label: string;
  shortLabel: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function NumericInput({
  label,
  shortLabel,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  unit = "ratio",
}: Props) {
  // Track the raw string so the user can type freely (e.g. "3." mid-entry).
  const [raw, setRaw] = useState(String(value));
  const [touched, setTouched] = useState(false);

  const parsed = parseFloat(raw);
  const isOutOfRange =
    touched && (!isNaN(parsed)) && (parsed < min || parsed > max);
  const isEmpty = touched && raw.trim() === "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const str = e.target.value;
    setRaw(str);
    const n = parseFloat(str);
    if (!isNaN(n)) {
      onChange(n);
    }
  }

  function handleBlur() {
    setTouched(true);
    const n = parseFloat(raw);
    if (isNaN(n)) {
      // Revert to last valid value on empty/non-numeric blur
      setRaw(String(value));
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  const hasError = isOutOfRange || isEmpty;

  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium text-slate-600">
        {label}
      </label>

      <div
        className={[
          "flex items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 transition-all duration-150",
          hasError
            ? "border-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]"
            : "border-slate-200 focus-within:border-blue-400 focus-within:shadow-[0_0_0_1px_rgba(59,130,246,0.25)]",
        ].join(" ")}
      >
        <input
          type="number"
          inputMode="decimal"
          value={raw}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          step={step}
          min={min}
          max={max}
          aria-label={label}
          className="flex-1 bg-transparent text-[14px] font-medium text-slate-900 outline-none w-0 min-w-0 tabular-nums"
        />
        <span className="text-[11px] text-slate-400 shrink-0">{unit}</span>
      </div>

      <div className="flex items-center justify-between">
        {hasError ? (
          <p className="flex items-center gap-1 text-[11px] text-red-500">
            <AlertCircle className="w-3 h-3" />
            {isEmpty
              ? `${shortLabel} is required`
              : `${shortLabel} must be ${min}–${max}`}
          </p>
        ) : (
          <p className="text-[11px] text-slate-400">
            Valid range: {min} – {max}
          </p>
        )}
      </div>
    </div>
  );
}
