import { ChevronRight } from "lucide-react";
import { COLORS } from "../types";

type BtnVariant = "default" | "selected" | "primary" | "ghost";

export function ActionButton({
  icon,
  label,
  variant = "default",
  onClick,
  height = 68,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: BtnVariant;
  onClick?: () => void;
  height?: number;
  disabled?: boolean;
}) {
  const base =
    "flex items-center gap-3.5 rounded-2xl transition-all duration-150 select-none pl-4 pr-3 font-medium text-[17px] leading-snug w-full";

  const styles: Record<BtnVariant, string> = {
    default:
      "bg-white border border-[rgba(24,95,165,0.12)] text-[#1A1C20] hover:border-[#185FA5]/30 hover:bg-[#E6F1FB]/40 active:scale-[0.98]",
    selected:
      "bg-[#E6F1FB] border-2 border-[#185FA5] text-[#185FA5] active:scale-[0.98]",
    primary:
      "bg-[#185FA5] text-white shadow-md shadow-[#185FA5]/25 hover:bg-[#145088] active:scale-[0.98]",
    ghost:
      "bg-transparent border border-[rgba(24,95,165,0.2)] text-[#185FA5] hover:bg-[#E6F1FB]/60 active:scale-[0.98]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ minHeight: `${height}px` }}
    >
      <span
        className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0"
        style={{
          background:
            variant === "primary"
              ? "rgba(255,255,255,0.15)"
              : variant === "selected"
                ? COLORS.accentText
                : COLORS.accentBg,
          color:
            variant === "primary" || variant === "selected"
              ? "#fff"
              : COLORS.accentText,
        }}
      >
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight
        size={18}
        className="shrink-0 opacity-40"
        style={{ color: variant === "primary" ? "#fff" : COLORS.accentText }}
      />
    </button>
  );
}
