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
    "flex items-center gap-3.5 rounded-3xl transition-all duration-200 select-none pl-4 pr-3 font-medium text-[17px] leading-snug w-full cursor-pointer active:scale-[0.98]";

  const styles: Record<BtnVariant, string> = {
    default: "bg-white border border-[rgba(24,95,165,0.12)] text-[#1A1C20] hover:border-[#185FA5]/30 hover:bg-[#E6F1FB]/40 hover:shadow-sm",
    selected: "bg-[#E6F1FB] border-2 border-[#185FA5] text-[#185FA5] shadow-sm",
    primary: "bg-[#185FA5] text-white shadow-md shadow-[#185FA5]/25 hover:bg-[#145088] hover:shadow-lg",
    ghost: "bg-transparent border border-[rgba(24,95,165,0.2)] text-[#185FA5] hover:bg-[#E6F1FB]/60",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-40 cursor-not-allowed active:scale-100" : ""}`}
      style={{ minHeight: `${height}px` }}
    >
      <span
        className="flex items-center justify-center rounded-2xl w-11 h-11 shrink-0 transition-colors duration-200"
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
        className="shrink-0 opacity-40 transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ color: variant === "primary" ? "#fff" : COLORS.accentText }}
      />
    </button>
  );
}
