import { LayoutDashboard, CalendarCheck, Pill, Headphones, FileText } from "lucide-react";
import type { Screen, UserRole } from "../types";

const patientTabs: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "inicio", label: "Inicio", icon: LayoutDashboard },
  { id: "form-step1", label: "Citas", icon: CalendarCheck },
  { id: "recetas", label: "Recetas", icon: Pill },
  { id: "soporte", label: "Soporte", icon: Headphones },
];

const doctorTabs: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "inicio", label: "Inicio", icon: LayoutDashboard },
  { id: "crear-receta", label: "Receta", icon: FileText },
  { id: "recetas", label: "Recetas", icon: Pill },
  { id: "soporte", label: "Soporte", icon: Headphones },
];

export function MobileTabBar({
  current,
  onNavigate,
  userRole,
}: {
  current: Screen;
  onNavigate: (s: Screen) => void;
  userRole: UserRole;
}) {
  const tabs = userRole === "doctor" ? doctorTabs : patientTabs;
  const bookingScreens = ["form-step1", "form-step2", "form-step3", "confirmacion"];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t"
      style={{
        background: "#FFFFFF",
        borderColor: "#E2E8F0",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const active = current === tab.id || (tab.id === "form-step1" && bookingScreens.includes(current));
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer transition-colors"
              style={{
                background: "transparent",
                color: active ? "#0F766E" : "#94A3B8",
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label={tab.label}
            >
              <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold" style={{ lineHeight: 1.2 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
