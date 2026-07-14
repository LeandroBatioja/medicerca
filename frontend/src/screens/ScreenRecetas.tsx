import { useEffect, useState } from "react";
import { Pill, AlertCircle, FileText } from "lucide-react";
import { C, type Screen, type Prescription } from "../types";
import { api } from "../api";

export function ScreenRecetas({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await api.getPrescriptions();
        setPrescriptions(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar recetas");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: C.textSecondary }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: C.brand }}>Inicio</button>
        <span>/</span>
        <span style={{ color: C.text }}>Mis recetas</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: C.text, fontFamily: "'Lora', serif" }}>
        Mis recetas
      </h1>
      <p className="text-base mb-8" style={{ color: C.textSecondary }}>
        Consulta tus recetas medicas digitales
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: C.border, borderTopColor: C.brand }} />
            <span className="text-sm font-medium" style={{ color: C.textSecondary }}>Cargando recetas...</span>
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
      ) : prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ background: C.surface, borderColor: C.border }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: C.brandLight }}>
            <FileText size={28} color={C.brand} />
          </div>
          <p className="text-lg font-semibold mb-1" style={{ color: C.text }}>Sin recetas registradas</p>
          <p className="text-sm" style={{ color: C.textSecondary }}>Aqui apareceran tus recetas cuando tu doctor las registre.</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, borderColor: C.border, boxShadow: C.shadow }}>
          {/* Table header */}
          <div
            className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b"
            style={{ background: C.bg, borderColor: C.border, color: C.textMuted }}
          >
            <div className="col-span-4">Medicamento</div>
            <div className="col-span-3">Frecuencia</div>
            <div className="col-span-2">Repeticiones</div>
            <div className="col-span-3">Fecha</div>
          </div>

          {prescriptions.map((rx, i) => (
            <div
              key={rx.id}
              className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors"
              style={{
                borderBottom: i < prescriptions.length - 1 ? `1px solid ${C.border}` : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.surfaceHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                  <Pill size={16} color="#7C3AED" />
                </div>
                <span className="text-sm font-semibold" style={{ color: C.text }}>{rx.medication}</span>
              </div>
              <div className="col-span-3 text-sm" style={{ color: C.textSecondary }}>{rx.frequency}</div>
              <div className="col-span-2">
                <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: C.brandLight, color: C.brand }}>
                  {rx.refills}x
                </span>
              </div>
              <div className="col-span-3 text-sm" style={{ color: C.textSecondary }}>{rx.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// no local C - uses imported C from types
