import { COLORS } from "../types";

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 flex-1 rounded-full transition-colors duration-300"
          style={{ background: i < current ? COLORS.accentText : "#D5DFE8" }}
        />
      ))}
    </div>
  );
}
