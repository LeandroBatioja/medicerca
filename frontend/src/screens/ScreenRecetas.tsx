import { useEffect, useState } from "react";
import { Pill, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { api } from "../api";
import type { Screen, Prescription } from "../types";

export function ScreenRecetas({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const isDoctor = api.getUserRole() === "doctor";
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = isDoctor
          ? await api.getCreatedPrescriptions()
          : await api.getPrescriptions();
        setPrescriptions(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar recetas");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [isDoctor]);

  return (
    <div className="px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      <div className="hidden sm:flex items-center gap-2 text-sm mb-6" style={{ color: "#64748B" }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: "#0369A1" }}>Dashboard</button>
        <span>/</span>
        <span style={{ color: "#1E293B" }}>Recetas</span>
      </div>

      <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{ color: "#1E293B", fontFamily: "'Lora', serif" }}>
            {isDoctor ? "Recetas creadas" : "Mis recetas"}
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#64748B" }}>
            {isDoctor ? "Recetas que has registrado para tus pacientes" : "Consulta tus recetas medicas digitales"}
          </p>
        </div>
        {isDoctor && (
          <button
            onClick={() => onNavigate("crear-receta")}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0 ml-3"
            style={{ background: "#7C3AED", color: "#fff" }}
          >
            <FileText size={14} />
            <span className="hidden sm:inline">Nueva receta</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "#E2E8F0", borderTopColor: "#0369A1" }} />
            <span className="text-sm font-medium" style={{ color: "#64748B" }}>Cargando recetas...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 rounded-xl px-4 sm:px-5 py-3 sm:py-4" style={{ background: "#FEE2E2", border: "1px solid rgba(220,38,38,0.12)" }}>
          <AlertCircle size={18} color="#DC2626" className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: "#DC2626" }}>{error}</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 rounded-2xl border" style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4" style={{ background: "#E0F2FE" }}>
            <FileText size={24} color="#0369A1" />
          </div>
          <p className="text-base sm:text-lg font-semibold mb-1" style={{ color: "#1E293B" }}>
            {isDoctor ? "Sin recetas creadas" : "Sin recetas registradas"}
          </p>
          <p className="text-xs sm:text-sm mb-5 sm:mb-6 text-center px-4" style={{ color: "#64748B" }}>
            {isDoctor ? "Crea tu primera receta para un paciente." : "Aqui apareceran tus recetas cuando tu doctor las registre."}
          </p>
          {isDoctor && (
            <button
              onClick={() => onNavigate("crear-receta")}
              className="h-10 px-5 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer"
              style={{ background: "#7C3AED", color: "#fff" }}
            >
              Crear receta <ArrowRight size={16} />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="flex flex-col gap-3 sm:hidden">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-2xl border"
                style={{ background: "#FFFFFF", borderColor: "#E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                {isDoctor && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "#E0F2FE", color: "#0369A1" }}>
                      {(rx.patient_name || "P").charAt(0)}
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#64748B" }}>{rx.patient_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                    <Pill size={14} color="#7C3AED" />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>{rx.medication}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#64748B" }}>{rx.frequency}</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#E0F2FE", color: "#0369A1" }}>
                      {rx.refills}x
                    </span>
                    <span className="text-[10px]" style={{ color: "#94A3B8" }}>{rx.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden sm:block rounded-2xl border overflow-hidden" style={{ background: "#FFFFFF", borderColor: "#E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div
              className="grid gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{
                gridTemplateColumns: isDoctor ? "2fr 2fr 1fr 1fr 1fr" : "3fr 2fr 1fr 1.5fr",
                background: "#F8FAFC",
                borderColor: "#E2E8F0",
                color: "#94A3B8",
              }}
            >
              <div>{isDoctor ? "Paciente" : "Medicamento"}</div>
              <div>Medicamento</div>
              <div>Frecuencia</div>
              {isDoctor && <div>Repeticiones</div>}
              <div>{isDoctor ? "Fecha" : "Repeticiones"}</div>
            </div>

            {prescriptions.map((rx, i) => (
              <div
                key={rx.id}
                className="grid gap-4 px-5 py-4 items-center transition-colors"
                style={{
                  gridTemplateColumns: isDoctor ? "2fr 2fr 1fr 1fr 1fr" : "3fr 2fr 1fr 1.5fr",
                  borderBottom: i < prescriptions.length - 1 ? "1px solid #E2E8F0" : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {isDoctor && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#E0F2FE", color: "#0369A1" }}>
                      {(rx.patient_name || "P").charAt(0)}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: "#1E293B" }}>{rx.patient_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                    <Pill size={14} color="#7C3AED" />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>{rx.medication}</span>
                </div>
                <div className="text-sm" style={{ color: "#64748B" }}>{rx.frequency}</div>
                <div>
                  <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#E0F2FE", color: "#0369A1" }}>
                    {rx.refills}x
                  </span>
                </div>
                <div className="text-sm" style={{ color: "#64748B" }}>{rx.date}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
