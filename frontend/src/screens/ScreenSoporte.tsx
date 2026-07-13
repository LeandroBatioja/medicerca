import { useState } from "react";
import { Phone, MessageSquare, ChevronRight } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { COLORS } from "../types";

const FAQS = [
  {
    q: "Como cancelo una cita?",
    a: 'Ve a Mis citas, selecciona la cita y pulsa "Cancelar". Puedes hacerlo hasta 4 horas antes.',
  },
  {
    q: "Puedo cambiar mi medico de cabecera?",
    a: "Si, envia una solicitud desde el menu de perfil. El cambio aplica en 48 h habiles.",
  },
  {
    q: "Donde veo mis resultados de laboratorio?",
    a: "En la seccion Ver recetas encontraras tambien tus estudios y resultados en PDF.",
  },
];

export function ScreenSoporte({ pop }: { pop: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-full max-w-md mx-auto w-full">
      <ScreenHeader title="Soporte" onBack={pop} />
      <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Phone size={20} />, label: "Llamar", sub: "800 123 4567" },
            {
              icon: <MessageSquare size={20} />,
              label: "Chat",
              sub: "Respuesta en ~2 min",
            },
          ].map((btn) => (
            <button
              key={btn.label}
              className="rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all active:scale-[0.97] hover:border-[#185FA5]/30 hover:bg-[#E6F1FB]/30"
              style={{ background: COLORS.surface, borderColor: COLORS.border }}
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: COLORS.accentBg,
                  color: COLORS.accentText,
                }}
              >
                {btn.icon}
              </span>
              <p
                className="text-[15px] font-semibold"
                style={{ color: COLORS.fg }}
              >
                {btn.label}
              </p>
              <p className="text-[12px]" style={{ color: COLORS.secondary }}>
                {btn.sub}
              </p>
            </button>
          ))}
        </div>

        <p
          className="text-[15px] font-semibold mt-2"
          style={{ color: COLORS.fg }}
        >
          Preguntas frecuentes
        </p>

        {FAQS.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border overflow-hidden cursor-pointer"
            style={{
              borderColor: open === i ? COLORS.accentText : COLORS.border,
              background: COLORS.surface,
            }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex items-center justify-between px-4 py-4 gap-3">
              <p
                className="text-[15px] font-medium flex-1 text-left"
                style={{
                  color: open === i ? COLORS.accentText : COLORS.fg,
                }}
              >
                {f.q}
              </p>
              <ChevronRight
                size={18}
                className="shrink-0 transition-transform duration-200"
                style={{
                  color: COLORS.accentText,
                  transform: open === i ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
            </div>
            {open === i && (
              <div className="px-4 pb-4">
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: COLORS.secondary }}
                >
                  {f.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
