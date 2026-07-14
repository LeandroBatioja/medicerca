import {
  Stethoscope,
  Pill,
  Ambulance,
  Calendar,
  LogOut,
  Activity,
} from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { COLORS, type Screen } from "../types";

export function ScreenInicio({
  onNavigate,
  onLogout,
  userName,
}: {
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
  userName: string;
}) {
  return (
    <div
      className="flex flex-col px-4 pt-14 pb-10 min-h-screen max-w-md mx-auto w-full"
      style={{ background: COLORS.bg }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: COLORS.accentBg }}
          >
            <Activity size={22} color={COLORS.accentText} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[13px]" style={{ color: COLORS.secondary }}>
              Bienvenido
            </p>
            <h1
              className="text-[22px] font-bold"
              style={{ color: COLORS.fg, fontFamily: "'Lora', serif" }}
            >
              Hola, {userName}
            </h1>
          </div>
        </div>
      </div>

      {/* Main CTA */}
      <div className="mb-6">
        <ActionButton
          icon={<Calendar size={20} />}
          label="Agendar cita"
          variant="primary"
          height={68}
          onClick={() => onNavigate("form-step1")}
        />
      </div>

      {/* Section title */}
      <p
        className="text-[13px] font-semibold uppercase tracking-wider mb-3 px-1"
        style={{ color: COLORS.secondary }}
      >
        Secciones
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        <ActionButton
          icon={<Stethoscope size={20} />}
          label="Servicios a domicilio"
          variant="default"
          height={68}
          onClick={() => onNavigate("asistencia")}
        />
        <ActionButton
          icon={<Pill size={20} />}
          label="Mis recetas"
          variant="default"
          height={68}
          onClick={() => onNavigate("recetas")}
        />
        <ActionButton
          icon={<Ambulance size={20} />}
          label="Centro de soporte"
          variant="default"
          height={68}
          onClick={() => onNavigate("soporte")}
        />
      </div>

      <div className="flex-1" />

      {/* Logout */}
      <ActionButton
        icon={<LogOut size={20} />}
        label="Cerrar sesion"
        variant="ghost"
        height={54}
        onClick={onLogout}
      />
    </div>
  );
}
