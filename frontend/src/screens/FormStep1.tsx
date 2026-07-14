import { Stethoscope, HeartPulse, Baby, Bone, Microscope, Thermometer, ArrowLeft, ArrowRight } from "lucide-react";
import { C, type Screen, type Booking } from "../types";

const options = [
  { label: "Consulta general", desc: "Atencion medica general", icon: Stethoscope },
  { label: "Especialidad", desc: "Consulta con especialista", icon: HeartPulse },
  { label: "Pediatria", desc: "Atencion para los mas pequenos", icon: Baby },
  { label: "Traumatologia", desc: "Huesos, articulaciones y musculos", icon: Bone },
  { label: "Laboratorio clinico", desc: "Examenes y pruebas de laboratorio", icon: Microscope },
  { label: "Urgencias", desc: "Atencion medica urgente", icon: Thermometer },
];

export function FormStep1({
  booking,
  setBooking,
  onNavigate,
}: {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: C.textSecondary }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Inicio</button>
        <span>/</span>
        <span style={{ color: C.text }}>Agendar cita</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
        Agendar cita
      </h1>
      <p className="text-base mb-8" style={{ color: C.textSecondary }}>
        Selecciona el tipo de consulta que necesitas
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {["Tipo", "Fecha", "Confirmar"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i === 0 ? C.brand : C.surface,
                  color: i === 0 ? "#fff" : C.textMuted,
                  border: i === 0 ? "none" : `1px solid ${C.border}`,
                }}
              >
                {i + 1}
              </div>
              <span className="text-sm font-medium" style={{ color: i === 0 ? C.text : C.textMuted }}>{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px" style={{ background: C.border }} />}
          </div>
        ))}
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {options.map((o) => {
          const selected = booking.type === o.label;
          return (
            <button
              key={o.label}
              onClick={() => setBooking((prev) => ({ ...prev, type: selected ? null : o.label }))}
              className="flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer"
              style={{
                background: selected ? C.brandLight : C.surface,
                borderColor: selected ? C.brand : C.border,
                boxShadow: selected ? `0 0 0 1px ${C.brand}` : C.shadow,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: selected ? C.brand : `${C.brand}10` }}
              >
                <o.icon size={20} color={selected ? "#fff" : C.brand} />
              </div>
              <div>
                <p className="text-[15px] font-semibold mb-0.5" style={{ color: selected ? C.brand : C.text }}>{o.label}</p>
                <p className="text-sm" style={{ color: C.textSecondary }}>{o.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex gap-3">
        <button
          onClick={() => onNavigate("inicio")}
          className="h-12 px-6 rounded-xl border font-medium text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer"
          style={{ borderColor: C.border, color: C.textSecondary, background: C.surface }}
        >
          <ArrowLeft size={18} /> Volver
        </button>
        <button
          onClick={() => onNavigate("form-step2")}
          className="h-12 px-8 rounded-xl font-semibold text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer"
          style={{
            background: booking.type ? C.brand : C.disabled,
            color: booking.type ? "#fff" : C.textSecondary,
            cursor: booking.type ? "pointer" : "not-allowed",
          }}
        >
          Continuar <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
