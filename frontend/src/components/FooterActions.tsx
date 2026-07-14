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
        className="flex items-center justify-center gap-1 rounded-3xl border font-medium text-[16px] transition-all duration-200 active:scale-[0.98] hover:bg-[#E6F1FB]/60 cursor-pointer"
        style={{
          minHeight: 56,
          width: "33%",
          borderColor: COLORS.border,
          color: COLORS.accentText,
        }}
      >
        <ChevronLeft size={18} /> Atras
      </button>
      <button
        onClick={nextEnabled ? onNext : undefined}
        className="flex items-center justify-center gap-2 rounded-3xl font-medium text-[16px] transition-all duration-200 active:scale-[0.98] flex-1 cursor-pointer"
        style={{
          minHeight: 56,
          background: nextEnabled ? COLORS.accentText : COLORS.disabled,
          color: nextEnabled ? "#fff" : COLORS.secondary,
          cursor: nextEnabled ? "pointer" : "not-allowed",
          boxShadow: nextEnabled ? COLORS.shadowMd : "none",
        }}
      >
        {nextLabel} <ChevronRight size={18} />
      </button>
    </div>
  );
}
