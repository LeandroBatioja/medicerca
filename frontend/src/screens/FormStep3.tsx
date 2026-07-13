import { AlertCircle } from "lucide-react";
import { StepDots } from "../components/StepDots";
import { FooterActions } from "../components/FooterActions";
import { COLORS, type Screen, type Booking } from "../types";
import { APPT_TYPES } from "./FormStep1";
import { SLOTS } from "./FormStep2";

export function FormStep3({
  push,
  pop,
  booking,
}: {
  push: (s: Screen) => void;
  pop: () => void;
  booking: Booking;
}) {
  const slot = SLOTS.find((s) => s.id === booking.slot);
  const type = APPT_TYPES.find((t) => t.id === booking.type);
  const rows = [
    { label: "Tipo", value: type?.label ?? "—" },
    { label: "Fecha", value: slot ? `${slot.date}, ${slot.time}` : "—" },
    { label: "Medico", value: "Dra. Adriana Solis" },
    { label: "Clinica", value: "Centro Medico Norte, Sala 3" },
  ];

  return (
    <div className="flex flex-col gap-5 px-4 pt-10 pb-8 min-h-full max-w-md mx-auto w-full">
      <div className="flex items-center gap-3">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 text-white"
          style={{ background: COLORS.accentText }}
        >
          3
        </span>
        <div>
          <p className="text-[13px]" style={{ color: COLORS.secondary }}>
            Paso 3 de 3
          </p>
          <p className="text-[17px] font-medium" style={{ color: COLORS.fg }}>
            Revisa y confirma
          </p>
        </div>
      </div>
      <StepDots total={3} current={3} />

      <div
        className="rounded-2xl border overflow-hidden divide-y"
        style={{ borderColor: COLORS.border }}
      >
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between items-center px-4 py-3.5"
            style={{ lineHeight: "160%" }}
          >
            <span className="text-[14px]" style={{ color: COLORS.secondary }}>
              {r.label}
            </span>
            <span
              className="text-[14px] font-medium text-right max-w-[55%]"
              style={{ color: COLORS.fg }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4 flex gap-3 items-start"
        style={{ background: "#FFF8E6" }}
      >
        <AlertCircle
          size={18}
          color="#B07A00"
          className="mt-0.5 shrink-0"
        />
        <p className="text-[13px]" style={{ color: "#7A5400" }}>
          Recibiras un recordatorio por SMS 24 horas antes de tu cita.
        </p>
      </div>

      <div className="flex-1" />
      <FooterActions
        onBack={pop}
        onNext={() => push("confirmacion")}
        nextLabel="Confirmar cita"
        nextEnabled
      />
    </div>
  );
}
