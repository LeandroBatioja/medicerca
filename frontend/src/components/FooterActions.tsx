import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../types";

export function FooterActions({
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextEnabled = true,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextEnabled?: boolean;
}) {
  return (
    <div className="flex gap-3 px-4 pb-8">
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-1 rounded-2xl border font-medium text-[16px] transition-all active:scale-[0.98] hover:bg-[#E6F1FB]/60"
        style={{
          minHeight: 56,
          width: "33%",
          borderColor: "rgba(24,95,165,0.2)",
          color: COLORS.accentText,
        }}
      >
        <ChevronLeft size={18} /> Atrás
      </button>
      <button
        onClick={nextEnabled ? onNext : undefined}
        className="flex items-center justify-center gap-2 rounded-2xl font-medium text-[16px] transition-all active:scale-[0.98] flex-1"
        style={{
          minHeight: 56,
          background: nextEnabled ? COLORS.accentText : "#D5DFE8",
          color: nextEnabled ? "#fff" : COLORS.secondary,
          cursor: nextEnabled ? "pointer" : "not-allowed",
          boxShadow: nextEnabled
            ? "0 4px 16px rgba(24,95,165,0.22)"
            : "none",
        }}
      >
        {nextLabel} <ChevronRight size={18} />
      </button>
    </div>
  );
}
