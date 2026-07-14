import { useState } from "react";
import { Headphones, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { COLORS, type Screen } from "../types";

const faqs = [
  {
    q: "Como agendo una cita?",
    a: "Desde la pantalla de Inicio, presiona 'Agendar cita', selecciona el tipo, fecha y hora, y confirma. Recibiras una confirmacion al instante.",
  },
  {
    q: "Puedo cancelar una cita?",
    a: "Si, puedes cancelar desde la seccion de citas pendientes con al menos 24 horas de anticipacion.",
  },
  {
    q: "Como accedo a mis recetas?",
    a: "En el menu principal, selecciona 'Mis recetas'. Ahi encontraras todas tus recetas medicas digitales.",
  },
  {
    q: "Que servicios de domicilio ofrecen?",
    a: "Ofrecemos extraccion de muestras, vacunacion, administracion de medicamentos y cuidados basicos a domicilio.",
  },
  {
    q: "Es seguro mis datos personales?",
    a: "Si. Todos los datos se transmiten de forma encriptada y cumplimos con las normativas de proteccion de datos.",
  },
];

export function ScreenSoporte({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full" style={{ background: COLORS.bg }}>
      <ScreenHeader title="Centro de soporte" onBack={() => onNavigate("inicio")} />

      {/* Hero */}
      <div
        className="mx-4 mb-5 rounded-3xl p-5"
        style={{ background: "linear-gradient(135deg, #E6F1FB 0%, #EAF2FC 100%)", border: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: COLORS.accentBg }}
          >
            <Headphones size={24} color={COLORS.accentText} />
          </div>
          <div>
            <p className="text-[17px] font-semibold" style={{ color: COLORS.fg }}>
              Como podemos ayudarte?
            </p>
            <p className="text-[13px]" style={{ color: COLORS.accentText }}>
              Encuentra respuestas rapidas
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <p
        className="text-[13px] font-semibold uppercase tracking-wider mb-3 px-5"
        style={{ color: COLORS.secondary }}
      >
        Preguntas frecuentes
      </p>
      <div className="px-4 flex flex-col gap-2 mb-6">
        {faqs.map((f, i) => {
          const isOpen = expanded === i;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: isOpen ? COLORS.accentBg : COLORS.surface,
                border: `1px solid ${isOpen ? COLORS.accentText : COLORS.border}`,
                boxShadow: isOpen ? COLORS.shadow : "none",
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer"
              >
                <span
                  className="text-[15px] font-semibold text-left pr-4"
                  style={{ color: isOpen ? COLORS.accentText : COLORS.fg }}
                >
                  {f.q}
                </span>
                {isOpen ? (
                  <ChevronUp size={18} color={COLORS.accentText} className="shrink-0" />
                ) : (
                  <ChevronDown size={18} color={COLORS.secondary} className="shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-[14px] leading-relaxed" style={{ color: COLORS.accentText }}>
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <p
        className="text-[13px] font-semibold uppercase tracking-wider mb-3 px-5"
        style={{ color: COLORS.secondary }}
      >
        Contacto directo
      </p>
      <div className="px-4 flex flex-col gap-2 mb-8">
        {[
          { icon: Phone, label: "Telefono", value: "+56 9 1234 5678" },
          { icon: Mail, label: "Email", value: "soporte@medicerca.cl" },
          { icon: MessageCircle, label: "WhatsApp", value: "Envia un mensaje" },
        ].map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: COLORS.accentBg }}
            >
              <c.icon size={18} color={COLORS.accentText} />
            </div>
            <div>
              <p className="text-[13px]" style={{ color: COLORS.secondary }}>
                {c.label}
              </p>
              <p className="text-[14px] font-semibold" style={{ color: COLORS.fg }}>
                {c.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
