import { Stethoscope, HeartPulse, Baby, Bone, Microscope, Thermometer } from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { ScreenHeader } from "../components/ScreenHeader";
import { COLORS, type Screen, type Booking } from "../types";

export function FormStep1({
  booking,
  setBooking,
  onNavigate,
}: {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  onNavigate: (s: Screen) => void;
}) {
  const options = [
    { label: "Consulta general", icon: Stethoscope },
    { label: "Especialidad", icon: HeartPulse },
    { label: "Pediatria", icon: Baby },
    { label: "Traumatologia", icon: Bone },
    { label: "Laboratorio clinico", icon: Microscope },
    { label: "Urgencias", icon: Thermometer },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full" style={{ background: COLORS.bg }}>
      <ScreenHeader title="Agendar cita" onBack={() => onNavigate("inicio")} />

      <p
        className="px-5 text-[14px] leading-relaxed mb-5"
        style={{ color: COLORS.fg, fontWeight: 500 }}
      >
        Elige el tipo de cita que necesitas
      </p>

      <div className="flex flex-col gap-3 px-4 mb-6">
        {options.map((o) => {
          const selected = booking.type === o.label;
          return (
            <ActionButton
              key={o.label}
              icon={<o.icon size={20} />}
              label={o.label}
              variant={selected ? "selected" : "default"}
              height={64}
              onClick={() =>
                setBooking((prev) => ({
                  ...prev,
                  type: selected ? null : o.label,
                }))
              }
            />
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="flex gap-3 px-4 pb-8">
        <button
          onClick={() => onNavigate("inicio")}
          className="rounded-3xl border font-medium text-[16px] transition-all duration-200 active:scale-[0.98] hover:bg-[#E6F1FB]/60 flex items-center justify-center cursor-pointer"
          style={{
            height: 56,
            width: "33%",
            borderColor: COLORS.border,
            color: COLORS.accentText,
          }}
        >
          Atras
        </button>
        <button
          onClick={() => onNavigate("form-step2")}
          className="flex-1 rounded-3xl font-medium text-[16px] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          style={{
            height: 56,
            background: booking.type ? COLORS.accentText : COLORS.disabled,
            color: booking.type ? "#fff" : COLORS.secondary,
            cursor: booking.type ? "pointer" : "not-allowed",
            boxShadow: booking.type ? COLORS.shadowMd : "none",
          }}
        >
          Continuar &rarr;
        </button>
      </div>
    </div>
  );
}
