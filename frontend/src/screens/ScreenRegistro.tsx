import { useState } from "react";
import { Activity, ArrowRight, AlertCircle, ChevronLeft, Check } from "lucide-react";
import type { Screen } from "../types";
import { api } from "../api";

export function ScreenRegistro({
  onNavigate,
  onBack,
}: {
  onNavigate: (s: Screen) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await api.register(email, password, name);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const isValid = name.trim() && email.trim() && password.length >= 6;

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ background: COLORS.bg }}>
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: COLORS.successLight }}
          >
            <Check size={36} strokeWidth={3} color={COLORS.success} />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: COLORS.text, fontFamily: "'Lora', serif" }}>
            Cuenta creada
          </h2>
          <p className="text-base mb-8" style={{ color: COLORS.textSecondary }}>
            Ya puedes iniciar sesion con tu email y contrasena.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="h-12 px-8 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 mx-auto transition-all duration-200 cursor-pointer"
            style={{ background: COLORS.brand, color: "#fff" }}
          >
            <ChevronLeft size={18} />
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Hero */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[480px] shrink-0"
        style={{
          background: "linear-gradient(160deg, #0F766E 0%, #115E59 40%, #134E4A 100%)",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Activity size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
              MediCerca
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Crea tu cuenta
            <br />
            en segundos.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm">
            Unete a miles de pacientes que ya gestionan su salud de forma digital con MediCerca.
          </p>
        </div>

        <div className="space-y-4">
          {["Agenda citas en linea", "Consulta tus recetas digitales", "Servicios a domicilio"].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                <Check size={14} color="#fff" />
              </div>
              <span className="text-white/80 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: COLORS.accentBg }}>
            <Activity size={18} color={COLORS.accentText} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: COLORS.text, fontFamily: "'Lora', serif" }}>
            MediCerca
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium mb-8 cursor-pointer transition-colors"
              style={{ color: COLORS.brand }}
            >
              <ChevronLeft size={16} />
              Volver al login
            </button>

            <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.text, fontFamily: "'Lora', serif" }}>
              Crear cuenta
            </h2>
            <p className="text-base mb-8" style={{ color: COLORS.textSecondary }}>
              Completa tus datos para registrarte
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Ej. Jose Ramirez"
                  className="w-full h-12 px-4 rounded-xl border text-[15px] transition-all duration-200"
                  style={{ background: COLORS.surface, borderColor: COLORS.border, color: COLORS.text }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.brandLight}`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="tu@email.com"
                  className="w-full h-12 px-4 rounded-xl border text-[15px] transition-all duration-200"
                  style={{ background: COLORS.surface, borderColor: COLORS.border, color: COLORS.text }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.brandLight}`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
                  Contrasena <span className="font-normal" style={{ color: COLORS.textMuted }}>(minimo 6 caracteres)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Tu contrasena"
                  className="w-full h-12 px-4 rounded-xl border text-[15px] transition-all duration-200"
                  style={{ background: COLORS.surface, borderColor: COLORS.border, color: COLORS.text }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.brandLight}`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{ background: COLORS.errorLight, color: COLORS.error, border: `1px solid rgba(220,38,38,0.15)` }}
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={!isValid || loading}
              className="w-full h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              style={{
                background: isValid ? COLORS.brand : COLORS.disabled,
                color: isValid ? "#fff" : COLORS.textSecondary,
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-sm mt-6" style={{ color: COLORS.textSecondary }}>
              Ya tienes cuenta?{" "}
              <button onClick={onBack} className="font-semibold cursor-pointer" style={{ color: COLORS.brand }}>
                Inicia sesion
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS = {
  brand: "#0F766E",
  brandLight: "#CCFBF1",
  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  disabled: "#D5DFE8",
  bg: "#F8FAFC",
  success: "#059669",
  successLight: "#D1FAE5",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  accentBg: "#CCFBF1",
  accentText: "#0F766E",
} as const;
