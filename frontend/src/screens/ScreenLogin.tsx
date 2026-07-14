import { useState } from "react";
import { Activity, Eye, EyeOff, ArrowRight, AlertCircle, ChevronLeft, Shield, Clock, CalendarCheck } from "lucide-react";
import type { Screen, UserRole } from "../types";
import { api } from "../api";

export function ScreenLogin({
  onLogin,
  onNavigate,
}: {
  onLogin: (name: string, role: UserRole) => void;
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
      onLogin(data.user.fullName, data.user.role);
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
        className="hidden lg:flex flex-col justify-between shrink-0"
        style={{
          width: 540,
          background: "linear-gradient(160deg, #0F766E 0%, #115E59 40%, #134E4A 100%)",
          padding: "56px 52px",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-20">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Activity size={22} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
              MediCerca
            </span>
          </div>

          <h1
            className="text-white leading-tight mb-6"
            style={{ fontFamily: "'Lora', serif", fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}
          >
            Tu salud,
            <br />
            siempre
            <br />
            accessible.
          </h1>
          <p className="text-white/65 leading-relaxed" style={{ fontSize: 17, maxWidth: 380 }}>
            Agenda citas, consulta recetas y accede a servicios medicos desde cualquier dispositivo.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-5">
          {[
            { icon: CalendarCheck, text: "Agenda citas en linea 24/7" },
            { icon: Shield, text: "Tus datos medicos seguros y encriptados" },
            { icon: Clock, text: "Acceso inmediato desde cualquier dispositivo" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <f.icon size={16} color="rgba(255,255,255,0.7)" />
              </div>
              <span className="text-white/70 text-sm">{f.text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-white/30 text-sm mt-8">
          <div className="flex -space-x-2">
            {["M", "J", "L", "A"].map((l, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.08)", borderColor: "#134E4A" }}
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
        <div className="lg:hidden flex items-center gap-3 px-8 pt-8 pb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#CCFBF1" }}>
            <Activity size={20} color="#0F766E" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: "#0F172A", fontFamily: "'Lora', serif" }}>
            MediCerca
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full" style={{ maxWidth: 480 }}>
            {/* Back link */}
            <button
              onClick={() => onNavigate("registro")}
              className="flex items-center gap-1.5 text-sm font-medium mb-10 cursor-pointer transition-colors hover:opacity-80"
              style={{ color: "#0F766E" }}
            >
              <ChevronLeft size={16} />
              Crear cuenta nueva
            </button>

            <h2
              className="mb-3"
              style={{ color: "#0F172A", fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 700 }}
            >
              Bienvenido de vuelta
            </h2>
            <p className="mb-10" style={{ color: "#64748B", fontSize: 16 }}>
              Inicia sesion para acceder a tu cuenta
            </p>

            {/* Form card */}
            <div
              className="p-7 rounded-2xl"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="space-y-5 mb-7">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="tu@email.com"
                    className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200"
                    style={{ height: 52, background: "#F8FAFC", borderColor: "#E2E8F0", color: "#0F172A" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#14B8A6"; e.currentTarget.style.boxShadow = "0 0 0 3px #CCFBF1"; e.currentTarget.style.background = "#fff"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#F8FAFC"; }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>
                    Contrasena
                  </label>
                  <div
                    className="w-full px-4 flex items-center gap-2 rounded-xl border transition-all duration-200"
                    style={{ height: 52, background: "#F8FAFC", borderColor: "#E2E8F0" }}
                  >
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Minimo 6 caracteres"
                      className="flex-1 text-[15px] bg-transparent outline-none"
                      style={{ color: "#0F172A" }}
                      onFocus={(e) => { e.currentTarget.parentElement!.style.borderColor = "#14B8A6"; e.currentTarget.parentElement!.style.boxShadow = "0 0 0 3px #CCFBF1"; e.currentTarget.parentElement!.style.background = "#fff"; }}
                      onBlur={(e) => { e.currentTarget.parentElement!.style.borderColor = "#E2E8F0"; e.currentTarget.parentElement!.style.boxShadow = "none"; e.currentTarget.parentElement!.style.background = "#F8FAFC"; }}
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
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm"
                  style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid rgba(220,38,38,0.12)" }}
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={!email || !password || loading}
                className="w-full rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                style={{
                  height: 52,
                  background: email && password ? "#0F766E" : "#CBD5E1",
                  color: email && password ? "#fff" : "#64748B",
                  cursor: email && password ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Entrando..." : "Iniciar sesion"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>

            <p className="text-center text-sm mt-8" style={{ color: "#64748B" }}>
              No tienes cuenta?{" "}
              <button onClick={() => onNavigate("registro")} className="font-semibold cursor-pointer hover:underline" style={{ color: "#0F766E" }}>
                Registrate aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
