import { Calendar } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { FooterActions } from "../components/FooterActions";
import { StepDots } from "../components/StepDots";
import { COLORS, type Screen, type Booking } from "../types";

const today = new Date();
const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return {
    label: d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }),
    value: d.toISOString().slice(0, 10),
    isToday: i === 0,
  };
});

const slots = [
  { id: "m1", time: "08:00", period: "manana" },
  { id: "m2", time: "08:30", period: "manana" },
  { id: "m3", time: "09:00", period: "manana" },
  { id: "m4", time: "09:30", period: "manana" },
  { id: "m5", time: "10:00", period: "manana" },
  { id: "m6", time: "10:30", period: "manana" },
  { id: "m7", time: "11:00", period: "manana" },
  { id: "m8", time: "11:30", period: "manana" },
  { id: "t1", time: "14:00", period: "tarde" },
  { id: "t2", time: "14:30", period: "tarde" },
  { id: "t3", time: "15:00", period: "tarde" },
  { id: "t4", time: "15:30", period: "tarde" },
  { id: "t5", time: "16:00", period: "tarde" },
  { id: "t6", time: "16:30", period: "tarde" },
];

export function FormStep2({
  booking,
  setBooking,
  onNavigate,
}: {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full" style={{ background: COLORS.bg }}>
      <ScreenHeader title="Seleccionar fecha" onBack={() => onNavigate("form-step1")} />

      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} color={COLORS.accentText} />
          <p className="text-[13px] font-semibold" style={{ color: COLORS.fg }}>
            Fecha del appointment
          </p>
        </div>
        <p className="text-[13px]" style={{ color: COLORS.secondary }}>
          Elige un dia de los proximos 7 dias
        </p>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-5">
        {days.map((d) => {
          const selected = booking.slot?.startsWith(d.value);
          return (
            <button
              key={d.value}
              onClick={() => setBooking((prev) => ({ ...prev, slot: `${d.value}_` }))}
              className="flex flex-col items-center justify-center rounded-2xl border transition-all duration-200 active:scale-[0.96] cursor-pointer"
              style={{
                height: 62,
                borderColor: selected ? COLORS.accentText : COLORS.border,
                background: selected ? COLORS.accentBg : COLORS.surface,
                boxShadow: selected ? COLORS.shadow : "none",
              }}
            >
              <span
                className="text-[13px] font-semibold capitalize"
                style={{ color: selected ? COLORS.accentText : COLORS.fg }}
              >
                {d.label.split(" ")[0]}
              </span>
              <span
                className="text-[22px] font-bold leading-none"
                style={{ color: selected ? COLORS.accentText : COLORS.fg }}
              >
                {d.label.split(" ")[1]}
              </span>
              {d.isToday && (
                <span
                  className="text-[9px] font-semibold uppercase tracking-wide mt-0.5"
                  style={{ color: COLORS.accentText }}
                >
                  Hoy
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Time slot selection */}
      {booking.slot && (
        <div className="px-4 mb-5">
          <p
            className="text-[13px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: COLORS.secondary }}
          >
            Horarios disponibles
          </p>

          <p className="text-[13px] font-semibold mb-2" style={{ color: COLORS.fg }}>
            Manana
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {slots
              .filter((s) => s.period === "manana")
              .map((s) => {
                const selected = booking.slot?.endsWith(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      const datePart = booking.slot?.split("_")[0];
                      setBooking((prev) => ({ ...prev, slot: `${datePart}_${s.id}` }));
                    }}
                    className="rounded-2xl border flex items-center justify-center transition-all duration-200 active:scale-[0.96] cursor-pointer"
                    style={{
                      height: 46,
                      borderColor: selected ? COLORS.accentText : COLORS.border,
                      background: selected ? COLORS.accentBg : COLORS.surface,
                      color: selected ? COLORS.accentText : COLORS.fg,
                      fontWeight: selected ? 600 : 500,
                      fontSize: 14,
                      boxShadow: selected ? COLORS.shadow : "none",
                    }}
                  >
                    {s.time}
                  </button>
                );
              })}
          </div>

          <p className="text-[13px] font-semibold mb-2" style={{ color: COLORS.fg }}>
            Tarde
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {slots
              .filter((s) => s.period === "tarde")
              .map((s) => {
                const selected = booking.slot?.endsWith(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      const datePart = booking.slot?.split("_")[0];
                      setBooking((prev) => ({ ...prev, slot: `${datePart}_${s.id}` }));
                    }}
                    className="rounded-2xl border flex items-center justify-center transition-all duration-200 active:scale-[0.96] cursor-pointer"
                    style={{
                      height: 46,
                      borderColor: selected ? COLORS.accentText : COLORS.border,
                      background: selected ? COLORS.accentBg : COLORS.surface,
                      color: selected ? COLORS.accentText : COLORS.fg,
                      fontWeight: selected ? 600 : 500,
                      fontSize: 14,
                      boxShadow: selected ? COLORS.shadow : "none",
                    }}
                  >
                    {s.time}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      <div className="flex-1" />

      <StepDots total={3} current={2} />
      <FooterActions
        onBack={() => onNavigate("form-step1")}
        onNext={() => onNavigate("form-step3")}
        nextEnabled={!!booking.slot && booking.slot.includes("_")}
      />
    </div>
  );
}
