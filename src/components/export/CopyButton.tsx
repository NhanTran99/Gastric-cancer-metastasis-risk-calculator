import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "../../utils/export";

interface Props {
  getText: () => string;
}

type State = "idle" | "success" | "error";

export function CopyButton({ getText }: Props) {
  const [state, setState] = useState<State>("idle");

  const handleClick = useCallback(async () => {
    if (state !== "idle") return;
    const ok = await copyToClipboard(getText());
    setState(ok ? "success" : "error");
    setTimeout(() => setState("idle"), 2000);
  }, [state, getText]);

  const isSuccess = state === "success";
  const isError   = state === "error";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      aria-live="polite"
      aria-label={
        isSuccess ? "Results copied to clipboard" :
        isError   ? "Copy failed — please try again" :
        "Copy results to clipboard"
      }
      className={[
        "flex items-center justify-center gap-2 w-full rounded-lg border px-3 py-2.5",
        "text-[12px] font-medium transition-all duration-200",
        isSuccess
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : isError
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {isSuccess ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {isSuccess ? "Copied" : isError ? "Copy failed" : "Copy results"}
    </button>
  );
}
