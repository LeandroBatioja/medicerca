import {
  CalendarCheck,
  Pill,
  Ambulance,
  Headphones,
  ArrowRight,
  Clock,
  Shield,
} from "lucide-react";
import { C, type Screen } from "../types";

const quickActions = [
  {
    id: "form-step1" as Screen,
    label: "Agendar cita",
    desc: "Reserva tu proxima consulta medica",
    icon: CalendarCheck,
    color: C.brand,
    bg: C.brandLight,
  },
  {
    id: "recetas" as Screen,
    label: "Mis recetas",
    desc: "Consulta tus recetas medicas digitales",
    icon: Pill,
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    id: "asistencia" as Screen,
    label: "Servicios a domicilio",
    desc: "Accede a servicios medicos en tu hogar",
    icon: Ambulance,
    color: "#0284C7",
    bg: "#E0F2FE",
  },
  {
    id: "soporte" as Screen,
    label: "Centro de soporte",
    desc: "Resuelve tus dudas frecuentes",
    icon: Headphones,
    color: "#D97706",
    bg: "#FEF3C7",
  },
];

const stats = [
  { label: "Citas este mes", value: "3", icon: CalendarCheck, color: C.brand },
  { label: "Recetas activas", value: "2", icon: Pill, color: "#7C3AED" },
  { label: "Servicios pendientes", value: "0", icon: Ambulance, color: "#0284C7" },
];

export function ScreenInicio({
  onNavigate,
  userName,
}: {
  onNavigate: (s: Screen) => void;
  userName: string;
}) {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-1" style={{ color: C.textSecondary }}>Bienvenido</p>
        <h1 className="text-3xl font-bold" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
          Hola, {userName}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 p-5 rounded-2xl border"
            style={{ background: C.surface, borderColor: C.border, boxShadow: C.shadow }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${s.color}15` }}
            >
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: C.text }}>{s.value}</p>
              <p className="text-sm" style={{ color: C.textSecondary }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: C.text }}>
          Acciones rapidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => onNavigate(a.id)}
              className="flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group"
              style={{ background: C.surface, borderColor: C.border, boxShadow: C.shadow }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = C.shadowMd; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = "none"; }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: a.bg }}
              >
                <a.icon size={22} color={a.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold" style={{ color: C.text }}>{a.label}</p>
                <p className="text-sm" style={{ color: C.textSecondary }}>{a.desc}</p>
              </div>
              <ArrowRight size={18} style={{ color: C.textMuted }} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Clock, title: "Disponible 24/7", desc: "Accede a tu cuenta cuando lo necesites desde cualquier dispositivo." },
          { icon: Shield, title: "Datos protegidos", desc: "Toda tu informacion medica esta encriptada y segura." },
        ].map((c, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-5 rounded-2xl border"
            style={{ background: C.surface, borderColor: C.border }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.brandLight }}>
              <c.icon size={18} color={C.brand} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: C.text }}>{c.title}</p>
              <p className="text-sm" style={{ color: C.textSecondary }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
