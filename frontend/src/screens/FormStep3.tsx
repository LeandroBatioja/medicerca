import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { C, type Screen, type Booking } from "../types";

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

  const doctors = ["Dra. Maria Lopez", "Dr. Carlos Mendoza", "Dra. Laura Rodriguez"];
  const clinics = ["Centro Medico Norte", "Clinica Sur", "Hospital Central"];
  const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
  const randomClinic = clinics[Math.floor(Math.random() * clinics.length)];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: C.textSecondary }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Inicio</button>
        <span>/</span>
        <button onClick={() => onNavigate("form-step1")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Agendar cita</button>
        <span>/</span>
        <span style={{ color: C.text }}>Confirmar</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
        Confirmar cita
      </h1>
      <p className="text-base mb-8" style={{ color: C.textSecondary }}>
        Revisa los detalles antes de confirmar tu cita
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {["Tipo", "Fecha", "Confirmar"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: C.brand, color: "#fff" }}
              >
                {i + 1}
              </div>
              <span className="text-sm font-medium" style={{ color: C.text }}>{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px" style={{ background: C.brand }} />}
          </div>
        ))}
      </div>

      {/* Summary card */}
      <div
        className="rounded-2xl border overflow-hidden mb-8"
        style={{ background: C.surface, borderColor: C.border, boxShadow: C.shadowMd }}
      >
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: C.border }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.brandLight }}>
            <ClipboardCheck size={20} color={C.brand} />
          </div>
          <div>
            <p className="text-base font-semibold" style={{ color: C.text }}>Resumen de tu cita</p>
            <p className="text-sm" style={{ color: C.textSecondary }}>Verifica que todos los datos sean correctos</p>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Tipo de consulta", value: booking.type || "" },
              { label: "Fecha", value: datePart },
              { label: "Horario", value: timeSlot },
              { label: "Doctor asignado", value: randomDoctor },
              { label: "Sede", value: randomClinic },
              { label: "Estado", value: "Pendiente de confirmacion" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: C.textMuted }}>{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: C.text }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3">
        <button
          onClick={() => onNavigate("form-step2")}
          className="h-12 px-6 rounded-xl border font-medium text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer"
          style={{ borderColor: C.border, color: C.textSecondary, background: C.surface }}
        >
          <ArrowLeft size={18} /> Atras
        </button>
        <button
          onClick={onConfirm}
          className="h-12 px-8 rounded-xl font-semibold text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer"
          style={{ background: C.brand, color: "#fff" }}
        >
          Confirmar cita
        </button>
      </div>
    </div>
  );
}
