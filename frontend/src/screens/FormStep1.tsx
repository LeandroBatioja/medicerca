import { Stethoscope, Activity, FileText } from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { StepDots } from "../components/StepDots";
import { FooterActions } from "../components/FooterActions";
import { COLORS, type Screen, type Booking } from "../types";

export const APPT_TYPES: { id: string; icon: React.ReactNode; label: string }[] = [
  { id: "general", icon: <Stethoscope size={20} />, label: "Consulta general" },
  { id: "especialista", icon: <Activity size={20} />, label: "Especialista" },
  { id: "laboratorio", icon: <FileText size={20} />, label: "Laboratorio" },
];

export function FormStep1({
  push,
  pop,
  booking,
  setBooking,
}: {
  push: (s: Screen) => void;
  pop: () => void;
  booking: Booking;
  setBooking: (b: Booking) => void;
}) {
  return (
    <div className="flex flex-col gap-5 px-4 pt-10 pb-8 min-h-full max-w-md mx-auto w-full">
      <div className="flex items-center gap-3">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 text-white"
          style={{ background: COLORS.accentText }}
        >
          1
        </span>
        <div>
          <p className="text-[13px]" style={{ color: COLORS.secondary }}>
            Paso 1 de 3
          </p>
          <p className="text-[17px] font-medium" style={{ color: COLORS.fg }}>
            Elige el tipo de cita
          </p>
        </div>
      </div>
      <StepDots total={3} current={1} />

      <div className="flex flex-col gap-3">
        {APPT_TYPES.map((t) => (
          <ActionButton
            key={t.id}
            icon={t.icon}
            label={t.label}
            variant={booking.type === t.id ? "selected" : "default"}
            onClick={() => setBooking({ ...booking, type: t.id })}
          />
        ))}
      </div>

      <div className="flex-1" />
      <FooterActions
        onBack={pop}
        onNext={() => push("form-step2")}
        nextEnabled={!!booking.type}
      />
    </div>
  );
}
