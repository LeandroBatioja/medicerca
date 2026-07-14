import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { C, type Screen, type Booking } from "../types";

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
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: C.textSecondary }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Inicio</button>
        <span>/</span>
        <button onClick={() => onNavigate("form-step1")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Agendar cita</button>
        <span>/</span>
        <span style={{ color: C.text }}>Fecha y hora</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
        Seleccionar fecha y hora
      </h1>
      <p className="text-base mb-8" style={{ color: C.textSecondary }}>
        Elige el dia y horario que mejor se adapte a ti
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {["Tipo", "Fecha", "Confirmar"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i <= 1 ? C.brand : C.surface,
                  color: i <= 1 ? "#fff" : C.textMuted,
                  border: i <= 1 ? "none" : `1px solid ${C.border}`,
                }}
              >
                {i + 1}
              </div>
              <span className="text-sm font-medium" style={{ color: i <= 1 ? C.text : C.textMuted }}>{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px" style={{ background: i <= 0 ? C.brand : C.border }} />}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} color={C.brand} />
          <h3 className="text-base font-semibold" style={{ color: C.text }}>Selecciona un dia</h3>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {days.map((d) => {
            const selected = booking.slot?.startsWith(d.value);
            return (
              <button
                key={d.value}
                onClick={() => setBooking((prev) => ({ ...prev, slot: `${d.value}_` }))}
                className="flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer"
                style={{
                  minHeight: 72,
                  borderColor: selected ? C.brand : C.border,
                  background: selected ? C.brandLight : C.surface,
                  boxShadow: selected ? `0 0 0 1px ${C.brand}` : C.shadow,
                }}
              >
                <span className="text-xs font-medium capitalize" style={{ color: selected ? C.brand : C.textSecondary }}>
                  {d.label.split(" ")[0]}
                </span>
                <span className="text-xl font-bold" style={{ color: selected ? C.brand : C.text }}>
                  {d.label.split(" ")[1]}
                </span>
                {d.isToday && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: C.brand }}>
                    Hoy
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {booking.slot && (
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4" style={{ color: C.text }}>Selecciona un horario</h3>

          <p className="text-sm font-medium mb-2" style={{ color: C.textSecondary }}>Manana</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
            {slots.filter((s) => s.period === "manana").map((s) => {
              const selected = booking.slot?.endsWith(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    const datePart = booking.slot?.split("_")[0];
                    setBooking((prev) => ({ ...prev, slot: `${datePart}_${s.id}` }));
                  }}
                  className="h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: selected ? C.brand : C.border,
                    background: selected ? C.brand : C.surface,
                    color: selected ? "#fff" : C.text,
                    boxShadow: selected ? `0 0 0 1px ${C.brand}` : "none",
                  }}
                >
                  {s.time}
                </button>
              );
            })}
          </div>

          <p className="text-sm font-medium mb-2" style={{ color: C.textSecondary }}>Tarde</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
            {slots.filter((s) => s.period === "tarde").map((s) => {
              const selected = booking.slot?.endsWith(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    const datePart = booking.slot?.split("_")[0];
                    setBooking((prev) => ({ ...prev, slot: `${datePart}_${s.id}` }));
                  }}
                  className="h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: selected ? C.brand : C.border,
                    background: selected ? C.brand : C.surface,
                    color: selected ? "#fff" : C.text,
                    boxShadow: selected ? `0 0 0 1px ${C.brand}` : "none",
                  }}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex gap-3">
        <button
          onClick={() => onNavigate("form-step1")}
          className="h-12 px-6 rounded-xl border font-medium text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer"
          style={{ borderColor: C.border, color: C.textSecondary, background: C.surface }}
        >
          <ArrowLeft size={18} /> Atras
        </button>
        <button
          onClick={() => onNavigate("form-step3")}
          className="h-12 px-8 rounded-xl font-semibold text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer"
          style={{
            background: booking.slot && booking.slot.includes("_") ? C.brand : C.disabled,
            color: booking.slot && booking.slot.includes("_") ? "#fff" : C.textSecondary,
            cursor: booking.slot && booking.slot.includes("_") ? "pointer" : "not-allowed",
          }}
        >
          Continuar <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
