import {
  LayoutDashboard,
  CalendarCheck,
  Pill,
  Ambulance,
  Headphones,
  LogOut,
  Activity,
} from "lucide-react";
import type { Screen } from "../types";

const navItems: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "inicio", label: "Dashboard", icon: LayoutDashboard },
  { id: "form-step1", label: "Agendar cita", icon: CalendarCheck },
  { id: "recetas", label: "Mis recetas", icon: Pill },
  { id: "asistencia", label: "Servicios", icon: Ambulance },
  { id: "soporte", label: "Soporte", icon: Headphones },
];

export function Sidebar({
  current,
  onNavigate,
  onLogout,
  userName,
}: {
  current: Screen;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
  userName: string;
}) {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r"
      style={{ background: C.surface, borderColor: C.border }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: C.brandLight }}
        >
          <Activity size={18} color={C.brand} strokeWidth={2.5} />
        </div>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: C.text, fontFamily: "'Lora', serif" }}
        >
          MediCerca
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = current === item.id || (item.id === "form-step1" && ["form-step1", "form-step2", "form-step3", "confirmacion"].includes(current));
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
              style={{
                background: active ? C.brandLight : "transparent",
                color: active ? C.brand : C.textSecondary,
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3 px-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: C.brandLight, color: C.brand }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{userName}</p>
            <p className="text-xs truncate" style={{ color: C.textMuted }}>Paciente</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{ color: C.textSecondary }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.errorLight; e.currentTarget.style.color = C.error; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textSecondary; }}
        >
          <LogOut size={18} />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}

const C = {
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  brand: "#0F766E",
  brandLight: "#CCFBF1",
  error: "#DC2626",
  errorLight: "#FEE2E2",
} as const;
