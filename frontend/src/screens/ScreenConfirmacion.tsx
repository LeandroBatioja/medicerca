import { Calendar, Check } from "lucide-react";
import { useEffect } from "react";
import { COLORS, type Booking } from "../types";
import { api } from "../api";
import { APPT_TYPES } from "./FormStep1";
import { SLOTS } from "./FormStep2";

export function ScreenConfirmacion({
  booking,
  goHome,
}: {
  booking: Booking;
  goHome: () => void;
}) {
  const slot = SLOTS.find((s) => s.id === booking.slot);
  const type = APPT_TYPES.find((t) => t.id === booking.type);
  const details = [
    { label: "Tipo", value: type?.label ?? "—" },
    { label: "Fecha", value: slot ? slot.date : "—" },
    { label: "Hora", value: slot ? slot.time : "—" },
    { label: "Medico", value: "Dra. Adriana Solis" },
    { label: "Clinica", value: "Centro Medico Norte, Sala 3" },
  ];

  useEffect(() => {
    if (booking.type && booking.slot) {
      api
        .createAppointment(booking.type, booking.slot, "Dra. Adriana Solis", "Centro Medico Norte, Sala 3")
        .catch(() => {});
    }
  }, [booking.type, booking.slot]);

  return (
    <div className="flex flex-col items-center px-4 pt-12 pb-8 gap-6 max-w-md mx-auto w-full">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: COLORS.successBg, boxShadow: `0 0 0 8px ${COLORS.successBg}` }}
      >
        <Check size={36} strokeWidth={2.5} color={COLORS.successText} />
      </div>

      <div className="text-center">
        <h2
          className="text-[22px] font-semibold"
          style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
        >
          Cita confirmada!
        </h2>
        <p className="text-[15px] mt-1 leading-relaxed" style={{ color: COLORS.secondary }}>
          Recibiras un recordatorio 24h antes.
        </p>
      </div>

      <div
        className="w-full rounded-2xl border divide-y overflow-hidden"
        style={{ borderColor: COLORS.border }}
      >
        {details.map((d) => (
          <div
            key={d.label}
            className="flex justify-between items-center px-4 py-3.5"
            style={{ lineHeight: "160%" }}
          >
            <span className="text-[14px]" style={{ color: COLORS.secondary }}>{d.label}</span>
            <span className="text-[14px] font-medium text-right max-w-[55%]" style={{ color: COLORS.fg }}>
              {d.value}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-3 mt-auto">
        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl font-medium text-[16px] text-white transition-all active:scale-[0.98]"
          style={{ minHeight: 56, background: COLORS.accentText, boxShadow: "0 4px 16px rgba(24,95,165,0.22)" }}
        >
          <Calendar size={18} /> Agregar al calendario
        </button>
        <button
          onClick={goHome}
          className="w-full flex items-center justify-center rounded-2xl font-medium text-[16px] transition-all active:scale-[0.98] hover:bg-[#E6F1FB]/60"
          style={{ minHeight: 56, border: `1px solid rgba(24,95,165,0.2)`, color: COLORS.accentText }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
