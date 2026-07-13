import { Calendar, Clock } from "lucide-react";
import { StepDots } from "../components/StepDots";
import { FooterActions } from "../components/FooterActions";
import { COLORS, type Screen, type Booking } from "../types";

const SLOTS = [
  { id: "1", date: "Mar 8 jul", time: "9:00 AM" },
  { id: "2", date: "Mar 8 jul", time: "10:30 AM" },
  { id: "3", date: "Mar 8 jul", time: "12:00 PM" },
  { id: "4", date: "Jue 10 jul", time: "8:30 AM" },
  { id: "5", date: "Jue 10 jul", time: "11:00 AM" },
  { id: "6", date: "Vie 11 jul", time: "3:00 PM" },
];

export { SLOTS };

export function FormStep2({
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
          2
        </span>
        <div>
          <p className="text-[13px]" style={{ color: COLORS.secondary }}>
            Paso 2 de 3
          </p>
          <p className="text-[17px] font-medium" style={{ color: COLORS.fg }}>
            Selecciona fecha y hora
          </p>
        </div>
      </div>
      <StepDots total={3} current={2} />

      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map((s) => {
          const sel = booking.slot === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setBooking({ ...booking, slot: s.id })}
              className="flex flex-col items-start gap-1 rounded-2xl p-4 border text-left transition-all active:scale-[0.97]"
              style={{
                background: sel ? COLORS.accentBg : COLORS.surface,
                borderColor: sel ? COLORS.accentText : COLORS.border,
                borderWidth: sel ? 2 : 1,
              }}
            >
              <span
                className="text-[13px] font-medium"
                style={{ color: sel ? COLORS.accentText : COLORS.secondary }}
              >
                <Calendar
                  size={12}
                  className="inline mr-1 -mt-0.5"
                />
                {s.date}
              </span>
              <span
                className="text-[17px] font-semibold"
                style={{ color: sel ? COLORS.accentText : COLORS.fg }}
              >
                <Clock
                  size={14}
                  className="inline mr-1 -mt-0.5"
                />
                {s.time}
              </span>
              {sel && (
                <span
                  className="text-[11px] font-semibold rounded-full px-2 py-0.5 mt-1"
                  style={{ background: COLORS.accentText, color: "#fff" }}
                >
                  Seleccionado
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
      <FooterActions
        onBack={pop}
        onNext={() => push("form-step3")}
        nextEnabled={!!booking.slot}
      />
    </div>
  );
}
