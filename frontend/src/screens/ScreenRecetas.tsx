import { useEffect, useState } from "react";
import { Pill, FileText } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { COLORS, type Prescription } from "../types";
import { api } from "../api";

export function ScreenRecetas({ pop }: { pop: () => void }) {
  const [recetas, setRecetas] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPrescriptions()
      .then(setRecetas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-full max-w-md mx-auto w-full">
      <ScreenHeader title="Mis recetas" onBack={pop} />
      <div className="flex flex-col gap-3 px-4 pt-4 pb-8">
        {loading && (
          <p className="text-center text-[14px] py-8" style={{ color: COLORS.secondary }}>
            Cargando recetas...
          </p>
        )}
        {!loading && recetas.length === 0 && (
          <p className="text-center text-[14px] py-8" style={{ color: COLORS.secondary }}>
            No tienes recetas registradas.
          </p>
        )}
        {recetas.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border p-4 flex gap-3"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: COLORS.accentBg }}
            >
              <Pill size={18} color={COLORS.accentText} />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-semibold" style={{ color: COLORS.fg }}>
                {r.medication}
              </p>
              <p className="text-[13px] mt-0.5" style={{ color: COLORS.secondary }}>
                {r.frequency}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: COLORS.accentBg, color: COLORS.accentText }}
                >
                  {r.refills} recargas
                </span>
                <span className="text-[12px]" style={{ color: COLORS.secondary }}>
                  {r.date}
                </span>
              </div>
            </div>
          </div>
        ))}
        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl font-medium text-[16px] mt-2 active:scale-[0.98] transition-all"
          style={{
            minHeight: 56,
            background: COLORS.accentText,
            color: "#fff",
            boxShadow: "0 4px 16px rgba(24,95,165,0.2)",
          }}
        >
          <FileText size={18} /> Solicitar renovacion
        </button>
      </div>
    </div>
  );
}
