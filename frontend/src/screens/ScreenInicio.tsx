import {
  CalendarCheck,
  Pill,
  Ambulance,
  Headphones,
  ArrowRight,
  Clock,
  Sun,
  Moon,
  Sunset,
  TrendingUp,
  FileText,
} from "lucide-react";
import { type Screen } from "../types";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Buenos dias", icon: Sun };
  if (h < 19) return { text: "Buenas tardes", icon: Sunset };
  return { text: "Buenas noches", icon: Moon };
}

function getFormattedDate() {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const stats = [
  { label: "Citas este mes", value: "3", change: "+1 vs mes anterior", icon: CalendarCheck, color: "#0F766E", bg: "#CCFBF1" },
  { label: "Recetas activas", value: "2", change: "1 proxima a vencer", icon: FileText, color: "#7C3AED", bg: "#EDE9FE" },
  { label: "Servicios domicilio", value: "0", change: "Sin pendientes", icon: Ambulance, color: "#0284C7", bg: "#E0F2FE" },
];

const quickActions = [
  {
    id: "form-step1" as Screen,
    label: "Agendar cita",
    desc: "Reserva tu proxima consulta medica de forma rapida y sencilla",
    icon: CalendarCheck,
    color: "#0F766E",
    bg: "#CCFBF1",
    featured: true,
  },
  {
    id: "recetas" as Screen,
    label: "Mis recetas",
    desc: "Consulta tus recetas medicas digitales",
    icon: Pill,
    color: "#7C3AED",
    bg: "#EDE9FE",
    featured: false,
  },
  {
    id: "asistencia" as Screen,
    label: "Servicios a domicilio",
    desc: "Accede a servicios medicos en tu hogar",
    icon: Ambulance,
    color: "#0284C7",
    bg: "#E0F2FE",
    featured: false,
  },
  {
    id: "soporte" as Screen,
    label: "Centro de soporte",
    desc: "Resuelve tus dudas frecuentes",
    icon: Headphones,
    color: "#D97706",
    bg: "#FEF3C7",
    featured: false,
  },
];

export function ScreenInicio({
  onNavigate,
  userName,
}: {
  onNavigate: (s: Screen) => void;
  userName: string;
}) {
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const featured = quickActions.find((a) => a.featured)!;
  const others = quickActions.filter((a) => !a.featured);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "48px 48px" }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GreetingIcon size={20} color="#D97706" />
              <p className="text-sm font-medium" style={{ color: "#64748B" }}>
                {greeting.text}
              </p>
            </div>
            <h1
              className="mb-2"
              style={{ color: "#0F172A", fontFamily: "'Lora', serif", fontSize: 36, fontWeight: 700 }}
            >
              Hola, {userName}
            </h1>
            <p className="text-base" style={{ color: "#94A3B8" }}>
              {getFormattedDate()}
            </p>
          </div>

          <button
            onClick={() => onNavigate("form-step1")}
            className="mt-6 sm:mt-0 h-12 px-6 rounded-xl font-semibold text-[15px] flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0"
            style={{ background: "#0F766E", color: "#fff", boxShadow: "0 4px 12px rgba(15,118,110,0.25)" }}
          >
            <CalendarCheck size={18} />
            Nueva cita
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 rounded-2xl border transition-all duration-200"
              style={{ background: "#FFFFFF", borderColor: "#E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <s.icon size={22} color={s.color} />
                </div>
                <TrendingUp size={16} color="#94A3B8" />
              </div>
              <p
                style={{ color: "#0F172A", fontSize: 32, fontWeight: 700, lineHeight: 1 }}
                className="mb-1"
              >
                {s.value}
              </p>
              <p className="text-sm font-medium mb-1" style={{ color: "#0F172A" }}>{s.label}</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* Featured action */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-5" style={{ color: "#0F172A" }}>
            Acciones rapidas
          </h2>
          <button
            onClick={() => onNavigate(featured.id)}
            className="w-full flex items-center gap-6 p-7 rounded-2xl border text-left transition-all duration-200 cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #CCFBF1 0%, #E0F2FE 100%)",
              borderColor: "#B2DFDB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,118,110,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "#0F766E", boxShadow: "0 4px 12px rgba(15,118,110,0.3)" }}
            >
              <featured.icon size={28} color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold mb-1" style={{ color: "#0F172A" }}>{featured.label}</p>
              <p className="text-sm" style={{ color: "#64748B" }}>{featured.desc}</p>
            </div>
            <ArrowRight size={22} color="#0F766E" className="shrink-0 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Other actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {others.map((a) => (
            <button
              key={a.id}
              onClick={() => onNavigate(a.id)}
              className="flex flex-col items-start gap-4 p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer group"
              style={{ background: "#FFFFFF", borderColor: "#E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: a.bg }}
              >
                <a.icon size={22} color={a.color} />
              </div>
              <div>
                <p className="text-[15px] font-semibold mb-1" style={{ color: "#0F172A" }}>{a.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{a.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Activity section */}
        <div
          className="p-6 rounded-2xl border"
          style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} color="#64748B" />
            <h3 className="text-base font-bold" style={{ color: "#0F172A" }}>Actividad reciente</h3>
          </div>
          <div className="space-y-3">
            {[
              { text: "Cita agendada - Consulta general", time: "Hace 2 dias", color: "#0F766E" },
              { text: "Receta recibida - Ibuprofeno 400mg", time: "Hace 5 dias", color: "#7C3AED" },
              { text: "Sesion iniciada desde navegador web", time: "Hoy, 09:15", color: "#64748B" },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                  <span className="text-sm" style={{ color: "#0F172A" }}>{a.text}</span>
                </div>
                <span className="text-xs shrink-0 ml-4" style={{ color: "#94A3B8" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
