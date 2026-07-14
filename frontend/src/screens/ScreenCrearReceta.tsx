import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, FileText, AlertCircle, Check } from "lucide-react";
import { api } from "../api";
import type { Screen, Patient } from "../types";

export function ScreenCrearReceta({
  onNavigate,
}: {
  onNavigate: (s: Screen) => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [medication, setMedication] = useState("");
  const [frequency, setFrequency] = useState("");
  const [refills, setRefills] = useState(0);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await api.getPatients();
        setPatients(data);
      } catch {
        setError("Error al cargar pacientes");
      } finally {
        setPatientsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPatient || !medication || !frequency) return;
    setLoading(true);
    setError("");
    try {
      await api.createPrescription(medication, frequency, refills, selectedPatient);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear receta");
    } finally {
      setLoading(false);
    }
  };

  const isValid = selectedPatient && medication.trim() && frequency.trim();

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: "#D1FAE5", boxShadow: "0 8px 32px rgba(5,150,105,0.15)" }}>
            <Check size={36} strokeWidth={3} color="#059669" />
          </div>
          <h2 className="mb-3" style={{ color: "#0F172A", fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700 }}>
            Receta creada
          </h2>
          <p className="mb-10" style={{ color: "#64748B", fontSize: 16 }}>
            La receta ha sido registrada exitosamente para el paciente.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSuccess(false); setMedication(""); setFrequency(""); setRefills(0); setSelectedPatient(null); }}
              className="px-6 rounded-xl font-semibold text-[15px] flex items-center gap-2 cursor-pointer"
              style={{ height: 48, background: "#0F766E", color: "#fff" }}
            >
              <FileText size={16} />
              Otra receta
            </button>
            <button
              onClick={() => onNavigate("inicio")}
              className="px-6 rounded-xl font-semibold text-[15px] flex items-center gap-2 cursor-pointer"
              style={{ height: 48, background: "#F1F5F9", color: "#0F172A", border: "1px solid #E2E8F0" }}
            >
              Volver al dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = { height: 52, background: "#F8FAFC", borderColor: "#E2E8F0", color: "#0F172A" };
  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#14B8A6";
    e.currentTarget.style.boxShadow = "0 0 0 3px #CCFBF1";
    e.currentTarget.style.background = "#fff";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "#F8FAFC";
  };

  return (
    <div className="px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 text-sm mb-6" style={{ color: "#64748B" }}>
        <button onClick={() => onNavigate("inicio")} className="cursor-pointer hover:underline" style={{ color: "#0F766E" }}>Dashboard</button>
        <span>/</span>
        <span style={{ color: "#0F172A" }}>Crear receta</span>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{ color: "#0F172A", fontFamily: "'Lora', serif" }}>
        Crear receta medica
      </h1>
      <p className="text-sm sm:text-base mb-6 sm:mb-10" style={{ color: "#64748B" }}>
        Completa los datos para crear una nueva receta
      </p>

      <div className="p-5 sm:p-7 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="space-y-5 mb-7">
          {/* Patient select */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Paciente</label>
            {patientsLoading ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8", height: 52 }}>
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#E2E8F0", borderTopColor: "#0F766E" }} />
                Cargando pacientes...
              </div>
            ) : (
              <select
                value={selectedPatient || ""}
                onChange={(e) => setSelectedPatient(Number(e.target.value) || null)}
                className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200 cursor-pointer"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              >
                <option value="">Selecciona un paciente</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                ))}
              </select>
            )}
          </div>

          {/* Medication */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Medicamento</label>
            <input
              type="text"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              placeholder="Ej. Ibuprofeno 400mg"
              className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200"
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Frecuencia</label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Ej. 3 veces al dia"
              className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200"
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          {/* Refills */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Repeticiones</label>
            <input
              type="number"
              min={0}
              max={12}
              value={refills}
              onChange={(e) => setRefills(Number(e.target.value))}
              className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200"
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid rgba(220,38,38,0.12)" }}>
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate("inicio")}
            className="h-12 px-6 rounded-xl border font-medium text-[15px] flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderColor: "#E2E8F0", color: "#64748B", background: "#FFFFFF" }}
          >
            <ArrowLeft size={18} /> Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="h-12 px-8 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer"
            style={{
              background: isValid ? "#7C3AED" : "#CBD5E1",
              color: isValid ? "#fff" : "#64748B",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Creando..." : "Crear receta"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
