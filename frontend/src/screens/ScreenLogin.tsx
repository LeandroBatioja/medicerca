import { useState } from "react";
import { Activity, Eye, EyeOff, ArrowRight, AlertCircle, ChevronLeft } from "lucide-react";
import type { Screen } from "../types";
import { api } from "../api";

export function ScreenLogin({
  onLogin,
  onNavigate,
}: {
  onLogin: (name: string) => void;
  onNavigate: (s: Screen) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.login(email, password);
      onLogin(data.user.fullName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

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
            Tu salud,
            <br />
            siempre
            <br />
            accessible.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm">
            Agenda citas, consulta recetas y accede a servicios medicos desde cualquier dispositivo.
          </p>
        </div>

        <div className="flex items-center gap-3 text-white/40 text-sm">
          <div className="flex -space-x-2">
            {["M", "J", "L", "A"].map((l, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.1)", borderColor: "#134E4A" }}
              >
                {l}
              </div>
            ))}
          </div>
          <span>+2,400 pacientes activos</span>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
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
            {/* Back to register */}
            <button
              onClick={() => onNavigate("registro")}
              className="flex items-center gap-1.5 text-sm font-medium mb-8 cursor-pointer transition-colors"
              style={{ color: COLORS.brand }}
            >
              <ChevronLeft size={16} />
              Crear cuenta nueva
            </button>

            <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.text, fontFamily: "'Lora', serif" }}>
              Bienvenido de vuelta
            </h2>
            <p className="text-base mb-8" style={{ color: COLORS.textSecondary }}>
              Inicia sesion para acceder a tu cuenta
            </p>

            {/* Form fields */}
            <div className="space-y-4 mb-6">
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
                  style={{
                    background: COLORS.surface,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.brandLight}`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
                  Contrasena
                </label>
                <div
                  className="w-full h-12 px-4 flex items-center gap-2 rounded-xl border transition-all duration-200"
                  style={{ background: COLORS.surface, borderColor: COLORS.border }}
                >
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Minimo 6 caracteres"
                    className="flex-1 text-[15px] bg-transparent outline-none"
                    style={{ color: COLORS.text }}
                    onFocus={(e) => { e.currentTarget.parentElement!.style.borderColor = COLORS.brand; e.currentTarget.parentElement!.style.boxShadow = `0 0 0 3px ${COLORS.brandLight}`; }}
                    onBlur={(e) => { e.currentTarget.parentElement!.style.borderColor = COLORS.border; e.currentTarget.parentElement!.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="p-1 cursor-pointer">
                    {showPass ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{ background: COLORS.errorLight, color: COLORS.error, border: `1px solid rgba(220,38,38,0.15)` }}
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={!email || !password || loading}
              className="w-full h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              style={{
                background: email && password ? COLORS.brand : COLORS.disabled,
                color: email && password ? "#fff" : COLORS.textSecondary,
                cursor: email && password ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Entrando..." : "Iniciar sesion"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-sm mt-6" style={{ color: COLORS.textSecondary }}>
              No tienes cuenta?{" "}
              <button onClick={() => onNavigate("registro")} className="font-semibold cursor-pointer" style={{ color: COLORS.brand }}>
                Registrate aqui
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
  surface: "#FFFFFF",
  border: "#E2E8F0",
  disabled: "#D5DFE8",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  accentBg: "#CCFBF1",
  accentText: "#0F766E",
} as const;
