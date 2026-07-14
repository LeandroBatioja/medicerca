import { useState } from "react";
import { Headphones, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from "lucide-react";
import { C, type Screen } from "../types";

const faqs = [
  {
    q: "Como agendo una cita?",
    a: "Desde el Dashboard, presiona 'Agendar cita', selecciona el tipo de consulta, fecha y horario, y confirma. Recibiras una confirmacion al instante.",
  },
  {
    q: "Puedo cancelar una cita?",
    a: "Si, puedes cancelar desde la seccion de citas pendientes con al menos 24 horas de anticipacion para evitar penalizaciones.",
  },
  {
    q: "Como accedo a mis recetas?",
    a: "En el menu lateral, selecciona 'Mis recetas'. Ahi encontraras todas tus recetas medicas digitales registradas.",
  },
  {
    q: "Que servicios de domicilio ofrecen?",
    a: "Ofrecemos extraccion de muestras, vacunacion, administracion de medicamentos y cuidados basicos a domicilio.",
  },
  {
    q: "Es seguro mis datos personales?",
    a: "Si. Todos los datos se transmiten de forma encriptada y cumplimos con las normativas de proteccion de datos personales.",
  },
];

export function ScreenSoporte({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 text-sm mb-6" style={{ color: C.textSecondary }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Inicio</button>
        <span>/</span>
        <span style={{ color: C.text }}>Soporte</span>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
        Centro de soporte
      </h1>
      <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: C.textSecondary }}>
        Encuentra respuestas a tus preguntas
      </p>

      {/* Hero card */}
      <div
        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8"
        style={{ background: "linear-gradient(135deg, #E0F2FE 0%, #E0F2FE 100%)", border: `1px solid ${C.border}` }}
      >
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.7)" }}>
          <Headphones size={22} color={C.brand} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold" style={{ color: C.text }}>Como podemos ayudarte?</h3>
          <p className="text-xs sm:text-sm" style={{ color: C.textSecondary }}>Busca en nuestras preguntas frecuentes o contacta directamente con nuestro equipo.</p>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-4" style={{ color: C.text }}>Preguntas frecuentes</h2>
      <div className="space-y-2 mb-8 sm:mb-10">
        {faqs.map((f, i) => {
          const isOpen = expanded === i;
          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                background: C.surface,
                border: `1px solid ${isOpen ? C.brand : C.border}`,
                boxShadow: isOpen ? `0 0 0 1px ${C.brand}` : C.shadow,
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 cursor-pointer"
              >
                <span className="text-sm font-semibold text-left pr-4" style={{ color: isOpen ? C.brand : C.text }}>
                  {f.q}
                </span>
                {isOpen ? (
                  <ChevronUp size={18} color={C.brand} className="shrink-0" />
                ) : (
                  <ChevronDown size={18} color={C.textMuted} className="shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-4" style={{ color: C.text }}>Contacto directo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { icon: Phone, label: "Telefono", value: "+56 9 1234 5678", color: C.brand },
          { icon: Mail, label: "Email", value: "soporte@medicerca.cl", color: "#7C3AED" },
          { icon: MessageCircle, label: "WhatsApp", value: "Enviar mensaje", color: "#059669" },
        ].map((c, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200"
            style={{ background: C.surface, borderColor: C.border, boxShadow: C.shadow }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}10` }}>
              <c.icon size={16} color={c.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium" style={{ color: C.textMuted }}>{c.label}</p>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: C.text }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// no local C - uses imported C from types
