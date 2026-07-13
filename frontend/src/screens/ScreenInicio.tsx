import { Calendar, Pill, Home, HeadphonesIcon, LogOut } from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { COLORS, type Screen } from "../types";
import { api } from "../api";

export function ScreenInicio({
  push,
  userName,
  onLogout,
}: {
  push: (s: Screen) => void;
  userName: string;
  onLogout: () => void;
}) {
  const handleLogout = () => {
    api.logout();
    onLogout();
  };

  return (
    <div className="flex flex-col gap-3 px-4 pt-14 pb-8 max-w-md mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: COLORS.accentBg }}
        >
          <Calendar size={26} color={COLORS.accentText} />
        </div>
        <h1
          className="text-[22px] font-semibold leading-tight"
          style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
        >
          Hola, {userName}
        </h1>
        <p className="mt-1 text-[16px] leading-relaxed" style={{ color: COLORS.secondary }}>
          Que deseas hacer hoy?
        </p>
      </div>

      <ActionButton icon={<Calendar size={20} />} label="Agendar cita" variant="primary" onClick={() => push("form-step1")} />
      <ActionButton icon={<Pill size={20} />} label="Ver recetas" variant="default" onClick={() => push("recetas")} />
      <ActionButton icon={<Home size={20} />} label="Asistencia en casa" variant="default" onClick={() => push("asistencia")} />
      <ActionButton icon={<HeadphonesIcon size={20} />} label="Soporte" variant="default" onClick={() => push("soporte")} />

      <div className="flex flex-col items-center gap-3 mt-4">
        <p className="text-[13px]" style={{ color: COLORS.secondary }}>
          Ultima visita: 12 de junio, 2026
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[14px] font-medium transition-opacity hover:opacity-70"
          style={{ color: COLORS.secondary }}
        >
          <LogOut size={16} /> Cerrar sesion
        </button>
      </div>
    </div>
  );
}
