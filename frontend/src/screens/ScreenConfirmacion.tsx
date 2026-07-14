import { useEffect, useState } from "react";
import { Check, PartyPopper, Home } from "lucide-react";
import { C, type Screen } from "../types";

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
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="text-center max-w-md">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${show ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          style={{ background: C.successLight, boxShadow: "0 8px 32px rgba(5,150,105,0.2)" }}
        >
          <Check size={44} strokeWidth={3} color={C.success} />
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <PartyPopper size={28} color={C.warning} className="mx-auto mb-3" />
        </div>

        <h2
          className={`text-3xl font-bold mb-3 transition-all duration-500 delay-200 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ color: C.text, fontFamily: "'Lora', serif" }}
        >
          Cita confirmada
        </h2>

        <p
          className={`text-base leading-relaxed mb-8 transition-all duration-500 delay-300 ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ color: C.textSecondary }}
        >
          Hola {userName}, tu cita ha sido agendada exitosamente. Recibiras un recordatorio antes de tu consulta.
        </p>

        <div
          className={`transition-all duration-500 delay-500 ${show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <button
            onClick={() => onNavigate("inicio")}
            className="h-12 px-8 rounded-xl font-semibold text-[15px] inline-flex items-center gap-2 transition-all duration-200 cursor-pointer"
            style={{ background: C.brand, color: "#fff" }}
          >
            <Home size={18} />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

// no local C - uses imported C from types
