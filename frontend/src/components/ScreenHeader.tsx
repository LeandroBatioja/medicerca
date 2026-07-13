import { ArrowLeft } from "lucide-react";
import { COLORS } from "../types";

export function ScreenHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 pt-10 pb-2">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:bg-[#E6F1FB] active:scale-95"
        style={{ border: `1px solid ${COLORS.border}` }}
      >
        <ArrowLeft size={18} color={COLORS.accentText} />
      </button>
      <h2
        className="text-[18px] font-semibold"
        style={{ color: COLORS.fg, fontFamily: "'Lora', serif" }}
      >
        {title}
      </h2>
    </div>
  );
}
