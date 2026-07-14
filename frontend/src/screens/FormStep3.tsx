import { ClipboardCheck } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { FooterActions } from "../components/FooterActions";
import { StepDots } from "../components/StepDots";
import { COLORS, type Screen, type Booking } from "../types";

export function FormStep3({
  booking,
  onNavigate,
  onConfirm,
}: {
  booking: Booking;
  onNavigate: (s: Screen) => void;
  onConfirm: () => void;
}) {
  const datePart = booking.slot?.split("_")[0] || "";
  const timeSlot = booking.slot?.split("_")[1] || "";
  const slotLabel = `${datePart} - ${timeSlot}`;

  const doctors = [
    "Dra. Maria Lopez",
    "Dr. Carlos Mendoza",
    "Dra. Laura Rodriguez",
  ];
  const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full" style={{ background: COLORS.bg }}>
      <ScreenHeader title="Confirmar cita" onBack={() => onNavigate("form-step2")} />

      <p
        className="px-5 text-[14px] leading-relaxed mb-5"
        style={{ color: COLORS.fg, fontWeight: 500 }}
      >
        Revisa los detalles de tu cita antes de confirmar.
      </p>

      {/* Summary card */}
      <div
        className="mx-4 rounded-3xl p-5 mb-6"
        style={{ background: COLORS.surface, boxShadow: COLORS.shadowMd, border: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: COLORS.accentBg }}
          >
            <ClipboardCheck size={20} color={COLORS.accentText} />
          </div>
          <div>
            <p className="text-[17px] font-semibold" style={{ color: COLORS.fg }}>
              Resumen de tu cita
            </p>
            <p className="text-[13px]" style={{ color: COLORS.secondary }}>
              Verifica los datos
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ background: COLORS.accentBg }}
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: COLORS.secondary }}>Tipo</span>
              <span className="text-[14px] font-semibold" style={{ color: COLORS.accentText }}>
                {booking.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: COLORS.secondary }}>Fecha y hora</span>
              <span className="text-[14px] font-semibold" style={{ color: COLORS.accentText }}>
                {slotLabel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: COLORS.secondary }}>Doctor</span>
              <span className="text-[14px] font-semibold" style={{ color: COLORS.accentText }}>
                {randomDoctor}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <StepDots total={3} current={3} />
      <FooterActions
        onBack={() => onNavigate("form-step2")}
        onNext={onConfirm}
        nextLabel="Confirmar cita"
        nextEnabled={true}
      />
    </div>
  );
}
