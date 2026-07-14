import { useEffect, useState } from "react";
import { Ambulance, AlertCircle, MapPin, Home } from "lucide-react";
import { C, type Screen, type HomeService } from "../types";
import { api } from "../api";

export function ScreenAsistencia({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const [services, setServices] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await api.getHomeServices();
        setServices(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar servicios");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 text-sm mb-6" style={{ color: C.textSecondary }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Inicio</button>
        <span>/</span>
        <span style={{ color: C.text }}>Servicios a domicilio</span>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
        Servicios a domicilio
      </h1>
      <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: C.textSecondary }}>
        Servicios medicos disponibles en tu zona
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: C.border, borderTopColor: C.brand }} />
            <span className="text-sm font-medium" style={{ color: C.textSecondary }}>Cargando servicios...</span>
          </div>
        </div>
      ) : error ? (
        <div
          className="flex items-start gap-3 rounded-xl px-5 py-4"
          style={{ background: C.errorLight, border: `1px solid rgba(220,38,38,0.15)` }}
        >
          <AlertCircle size={18} color={C.error} className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: C.error }}>{error}</p>
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ background: C.surface, borderColor: C.border }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: C.brandLight }}>
            <Home size={28} color={C.brand} />
          </div>
          <p className="text-lg font-semibold mb-1" style={{ color: C.text }}>Sin servicios activos</p>
          <p className="text-sm" style={{ color: C.textSecondary }}>No tienes servicios a domicilio agendados actualmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {services.map((svc) => {
            const statusColor = svc.status === "completado" ? C.success : svc.status === "pendiente" ? C.warning : C.brand;
            const statusBg = svc.status === "completado" ? C.successLight : svc.status === "pendiente" ? C.warningLight : C.brandLight;
            return (
              <div
                key={svc.id}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200"
                style={{ background: C.surface, borderColor: C.border, boxShadow: C.shadow }}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: statusBg }}>
                  <Ambulance size={18} color={statusColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{svc.service_type}</p>
                    <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full" style={{ background: statusBg, color: statusColor }}>
                      {svc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={12} color={C.textMuted} />
                    <p className="text-xs sm:text-sm" style={{ color: C.textSecondary }}>{svc.address}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// no local C - uses imported C from types
