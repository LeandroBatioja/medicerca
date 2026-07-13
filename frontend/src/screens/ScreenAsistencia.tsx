import { useState } from "react";
import { Stethoscope, Activity, User, MapPin, Check, ChevronRight } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { COLORS } from "../types";

const SERVICIOS = [
  { icon: <Stethoscope size={20} />, label: "Consulta domiciliaria", desc: "Medico a tu hogar en 2-4 h" },
  { icon: <Activity size={20} />, label: "Toma de muestras", desc: "Laboratorio en casa - lunes a sabado" },
  { icon: <User size={20} />, label: "Enfermeria", desc: "Cuidado post-operatorio y curacion" },
];

export function ScreenAsistencia({ pop }: { pop: () => void }) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="flex flex-col min-h-full max-w-md mx-auto w-full">
      <ScreenHeader title="Asistencia en casa" onBack={pop} />
      <div className="flex flex-col gap-3 px-4 pt-4 pb-8">
        <p className="text-[14px]" style={{ color: COLORS.secondary }}>
          Selecciona el servicio que necesitas y un medico o enfermero llegara a tu domicilio registrado.
        </p>

        <div
          className="rounded-2xl border p-3 flex items-center gap-3"
          style={{ borderColor: COLORS.border, background: COLORS.surface }}
        >
          <MapPin size={18} color={COLORS.accentText} className="shrink-0" />
          <div>
            <p className="text-[13px]" style={{ color: COLORS.secondary }}>
              Direccion registrada
            </p>
            <p className="text-[15px] font-medium" style={{ color: COLORS.fg }}>
              Av. Insurgentes 1234, Col. Del Valle
            </p>
          </div>
        </div>

        {SERVICIOS.map((s) => {
          const active = sel === s.label;
          return (
            <button
              key={s.label}
              onClick={() => setSel(active ? null : s.label)}
              className="rounded-2xl border p-4 flex gap-3 items-center text-left transition-all active:scale-[0.98]"
              style={{
                background: active ? COLORS.accentBg : COLORS.surface,
                borderColor: active ? COLORS.accentText : COLORS.border,
                borderWidth: active ? 2 : 1,
              }}
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: active ? COLORS.accentText : COLORS.accentBg,
                }}
              >
                <span style={{ color: active ? "#fff" : COLORS.accentText }}>
                  {s.icon}
                </span>
              </span>
              <div className="flex-1">
                <p
                  className="text-[16px] font-semibold"
                  style={{ color: active ? COLORS.accentText : COLORS.fg }}
                >
                  {s.label}
                </p>
                <p
                  className="text-[13px] mt-0.5"
                  style={{ color: COLORS.secondary }}
                >
                  {s.desc}
                </p>
              </div>
              {active && (
                <Check size={18} color={COLORS.accentText} className="shrink-0" />
              )}
            </button>
          );
        })}

        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl font-medium text-[16px] mt-2 active:scale-[0.98] transition-all"
          style={{
            minHeight: 56,
            background: sel ? COLORS.accentText : "#D5DFE8",
            color: sel ? "#fff" : COLORS.secondary,
            cursor: sel ? "pointer" : "not-allowed",
            boxShadow: sel ? "0 4px 16px rgba(24,95,165,0.2)" : "none",
          }}
        >
          Solicitar servicio <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
