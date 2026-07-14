import {
  FileText,
  Clock,
  Bell,
  Pill,
  Headphones,
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
  { id: "crear-receta" as Screen, label: "Crear receta", icon: FileText, color: "#7C3AED", bg: "#EDE9FE" },
  { id: "recetas" as Screen, label: "Ver recetas", icon: Pill, color: "#0369A1", bg: "#E0F2FE" },
  { id: "soporte" as Screen, label: "Soporte", icon: Headphones, color: "#D97706", bg: "#FEF3C7" },
];

const stats = [
  { label: "Pacientes", value: "12", sub: "+3 este mes", color: "#0369A1", bg: "#E0F2FE" },
  { label: "Recetas", value: "28", sub: "5 esta semana", color: "#7C3AED", bg: "#EDE9FE" },
  { label: "Consultas", value: "4", sub: "hoy", color: "#059669", bg: "#D1FAE5" },
];

const activity = [
  { text: "Receta creada - Maria Lopez", time: "Hace 1 hora", color: "#7C3AED" },
  { text: "Consulta completada - Carlos M.", time: "Hace 3 horas", color: "#0369A1" },
  { text: "Sesion iniciada", time: "Hoy, 08:30", color: "#64748B" },
];

export function ScreenDoctorDashboard({
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
              style={{ background: "#EDE9FE", color: "#7C3AED" }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: "#64748B" }}>{getGreeting()}</p>
              <p className="text-sm font-bold" style={{ color: "#1E293B" }}>Dr(a). {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("crear-receta")}
              className="h-8 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
              style={{ background: "#0369A1", color: "#fff" }}
            >
              <FileText size={12} />
              Nueva receta
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "#E0F2FE" }}
            >
              <Bell size={16} color="#0369A1" />
            </button>
          </div>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
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
