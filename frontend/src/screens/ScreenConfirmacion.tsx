import { useEffect, useState } from "react";
import { Check, PartyPopper } from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { COLORS, type Screen } from "../types";

export function ScreenConfirmacion({
  onNavigate,
  userName,
}: {
  onNavigate: (s: Screen) => void;
  userName: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center px-4 min-h-screen max-w-md mx-auto w-full"
      style={{
        background: "linear-gradient(180deg, #EAF3DE 0%, #F4F7FB 60%, #F4F7FB 100%)",
      }}
    >
      {/* Animated check */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${show ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        style={{
          background: "linear-gradient(135deg, #3B6D11 0%, #4A8A15 100%)",
          boxShadow: "0 8px 32px rgba(59,109,17,0.3)",
        }}
      >
        <Check size={48} strokeWidth={3} color="#fff" />
      </div>

      {/* Confetti icon */}
      <div
        className={`transition-all duration-700 delay-200 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <PartyPopper size={28} color={COLORS.warningIcon} />
      </div>

      <h2
        className={`text-[26px] font-bold text-center mt-3 mb-2 transition-all duration-500 delay-200 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
      >
        Cita confirmada!
      </h2>

      <p
        className={`text-[15px] text-center leading-relaxed mb-10 px-6 transition-all duration-500 delay-300 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ color: COLORS.accentText }}
      >
        Hola {userName}, tu cita ha sido agendada exitosamente.
      </p>

      {/* Actions */}
      <div
        className={`w-full transition-all duration-500 delay-500 ${show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <ActionButton
          icon={<Check size={20} />}
          label="Volver al inicio"
          variant="primary"
          height={56}
          onClick={() => onNavigate("inicio")}
        />
      </div>
    </div>
  );
}
