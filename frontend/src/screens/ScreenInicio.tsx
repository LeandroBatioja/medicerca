import {
  CalendarCheck,
  Pill,
  Ambulance,
  Headphones,
  ArrowRight,
  Clock,
  Bell,
  Activity,
} from "lucide-react";
import { type Screen } from "../types";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos dias";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const quickActions = [
  { id: "form-step1" as Screen, label: "Agendar", icon: CalendarCheck, color: "#0369A1", bg: "#E0F2FE" },
  { id: "recetas" as Screen, label: "Recetas", icon: Pill, color: "#7C3AED", bg: "#EDE9FE" },
  { id: "asistencia" as Screen, label: "Servicios", icon: Ambulance, color: "#0284C7", bg: "#E0F2FE" },
  { id: "soporte" as Screen, label: "Soporte", icon: Headphones, color: "#D97706", bg: "#FEF3C7" },
];

const stats = [
  { label: "Citas", value: "3", sub: "este mes", color: "#0369A1", bg: "#E0F2FE" },
  { label: "Recetas", value: "2", sub: "activas", color: "#7C3AED", bg: "#EDE9FE" },
  { label: "Servicios", value: "0", sub: "pendientes", color: "#0284C7", bg: "#E0F2FE" },
];

const activity = [
  { text: "Cita agendada - Consulta general", time: "Hace 2 dias", color: "#0369A1" },
  { text: "Receta recibida - Ibuprofeno 400mg", time: "Hace 5 dias", color: "#7C3AED" },
  { text: "Sesion iniciada", time: "Hoy, 09:15", color: "#64748B" },
];

export function ScreenInicio({
  onNavigate,
  userName,
}: {
  onNavigate: (s: Screen) => void;
  userName: string;
}) {
  return (
    <div className="min-h-screen" style={{ background: "#F1F5F9" }}>
      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#E0F2FE", color: "#0369A1" }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: "#64748B" }}>{getGreeting()}</p>
              <p className="text-sm font-bold" style={{ color: "#1E293B" }}>{userName}</p>
            </div>
          </div>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#E0F2FE" }}
          >
            <Bell size={16} color="#0369A1" />
          </button>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => onNavigate(a.id)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150 cursor-pointer"
              style={{ background: "#FFFFFF", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: a.bg }}
              >
                <a.icon size={16} color={a.color} />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: "#64748B" }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Upcoming appointment */}
        <div
          className="p-4 rounded-xl mb-5"
          style={{
            background: "linear-gradient(135deg, #0369A1 0%, #075985 100%)",
            boxShadow: "0 4px 12px rgba(3,105,161,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.7)" }}>
              Proxima cita
            </span>
            <CalendarCheck size={14} color="rgba(255,255,255,0.7)" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
              DL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "#fff" }}>Dr. Carlos Mendoza</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Consulta general</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold" style={{ color: "#fff" }}>15 Jul</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.7)" }}>10:30 AM</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("form-step1")}
            className="w-full mt-3 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            Ver detalles <ArrowRight size={12} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-3.5 rounded-xl"
              style={{ background: "#FFFFFF", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: s.bg }}>
                <Activity size={14} color={s.color} />
              </div>
              <p className="text-xl font-bold" style={{ color: "#1E293B", lineHeight: 1 }}>{s.value}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: "#64748B" }}>{s.label}</p>
              <p className="text-[9px]" style={{ color: "#94A3B8" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#FFFFFF", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
            <Clock size={14} color="#64748B" />
            <span className="text-xs font-semibold" style={{ color: "#1E293B" }}>Actividad reciente</span>
          </div>
          <div>
            {activity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < activity.length - 1 ? "1px solid #F1F5F9" : "none" }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                <span className="text-xs flex-1 min-w-0 truncate" style={{ color: "#1E293B" }}>{a.text}</span>
                <span className="text-[10px] shrink-0" style={{ color: "#94A3B8" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
