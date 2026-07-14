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
        className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 hover:bg-[#E6F1FB] active:scale-95 border border-[rgba(24,95,165,0.12)]"
      >
        <ArrowLeft size={18} color={COLORS.accentText} />
      </button>
      <h2
        className="text-[19px] font-semibold"
        style={{ color: COLORS.fg, fontFamily: "'Lora', serif" }}
      >
        {title}
      </h2>
    </div>
  );
}
