import { useEffect, useState } from "react";
import { Pill, AlertCircle } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { COLORS, type Screen, type Prescription } from "../types";
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
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full" style={{ background: COLORS.bg }}>
      <ScreenHeader title="Mis recetas" onBack={() => onNavigate("inicio")} />

      {/* Info banner */}
      <div
        className="mx-4 mb-5 rounded-2xl p-4"
        style={{ background: COLORS.warningBg, border: `1px solid rgba(176,122,0,0.15)` }}
      >
        <p className="text-[13px] font-semibold" style={{ color: COLORS.warningText }}>
          Estas son tus recetas medicas registradas en tu cuenta.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[15px]" style={{ color: COLORS.secondary }}>Cargando...</p>
        </div>
      ) : error ? (
        <div className="mx-4 flex items-start gap-2.5 rounded-2xl px-4 py-3"
          style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}` }}
        >
          <AlertCircle size={16} color={COLORS.errorText} className="mt-0.5 shrink-0" />
          <p className="text-[13px]" style={{ color: COLORS.errorText }}>{error}</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: COLORS.accentBg }}
          >
            <Pill size={32} color={COLORS.accentText} />
          </div>
          <p
            className="text-[18px] font-semibold text-center mb-2"
            style={{ color: COLORS.fg, fontFamily: "'Lora', serif" }}
          >
            Sin recetas registradas
          </p>
          <p className="text-[14px] text-center" style={{ color: COLORS.secondary }}>
            Aqui apareceran tus recetas cuando tu doctor las registre.
          </p>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="rounded-3xl p-5"
              style={{ background: COLORS.surface, boxShadow: COLORS.shadow, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: COLORS.accentBg }}
                >
                  <Pill size={20} color={COLORS.accentText} />
                </div>
                <div className="flex-1">
                  <p className="text-[17px] font-semibold mb-1" style={{ color: COLORS.fg }}>
                    {rx.medication}
                  </p>
                  <p className="text-[13px]" style={{ color: COLORS.secondary }}>
                    Frecuencia: {rx.frequency}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span
                      className="text-[12px] font-semibold px-2.5 py-1 rounded-xl"
                      style={{ background: COLORS.successBg, color: COLORS.successText }}
                    >
                      {rx.refills} repeticiones
                    </span>
                    <span className="text-[12px]" style={{ color: COLORS.secondary }}>
                      {rx.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
