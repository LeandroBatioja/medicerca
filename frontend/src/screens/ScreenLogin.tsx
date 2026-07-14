import { useState } from "react";
import { Activity, Eye, EyeOff, ArrowRight, AlertCircle, Shield } from "lucide-react";
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

  const inputBase = "w-full px-4 rounded-xl border text-sm transition-all duration-200 outline-none";
  const inputStyle = { height: 48, background: "#F8FAFC", borderColor: "#E2E8F0", color: "#1E293B" };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #E0F2FE 50%, #F1F5F9 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#0369A1" }}>
          <Activity size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ color: "#1E293B", fontFamily: "'Lora', serif" }}>
          MediCerca
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full p-7 sm:p-8"
        style={{
          maxWidth: 400,
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div className="text-center mb-7">
          <h1
            className="mb-1.5"
            style={{ color: "#1E293B", fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700 }}
          >
            Bienvenido
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Inicia sesion para acceder a tu cuenta
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#64748B" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="tu@email.com"
              className={inputBase}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0EA5E9"; e.currentTarget.style.boxShadow = "0 0 0 3px #E0F2FE"; e.currentTarget.style.background = "#fff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#F8FAFC"; }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#64748B" }}>
              Contrasena
            </label>
            <div
              className="w-full px-4 flex items-center gap-2 rounded-xl border transition-all duration-200"
              style={{ height: 48, background: "#F8FAFC", borderColor: "#E2E8F0" }}
            >
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Minimo 6 caracteres"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: "#1E293B" }}
                onFocus={(e) => { e.currentTarget.parentElement!.style.borderColor = "#0EA5E9"; e.currentTarget.parentElement!.style.boxShadow = "0 0 0 3px #E0F2FE"; e.currentTarget.parentElement!.style.background = "#fff"; }}
                onBlur={(e) => { e.currentTarget.parentElement!.style.borderColor = "#E2E8F0"; e.currentTarget.parentElement!.style.boxShadow = "none"; e.currentTarget.parentElement!.style.background = "#F8FAFC"; }}
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="p-1 cursor-pointer">
                {showPass ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="flex items-start gap-2 rounded-lg px-3.5 py-2.5 mb-5 text-xs font-medium"
            style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          className="w-full rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          style={{
            height: 48,
            background: email && password ? "#0369A1" : "#CBD5E1",
            color: email && password ? "#fff" : "#64748B",
            cursor: email && password ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Entrando..." : "Iniciar sesion"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm mt-6" style={{ color: "#64748B" }}>
        No tienes cuenta?{" "}
        <button onClick={() => onNavigate("registro")} className="font-semibold cursor-pointer hover:underline" style={{ color: "#0369A1" }}>
          Registrate aqui
        </button>
      </p>

      {/* Trust signal */}
      <div className="flex items-center gap-1.5 mt-4" style={{ color: "#94A3B8" }}>
        <Shield size={12} />
        <span className="text-[11px] font-medium">Conexion segura y encriptada</span>
      </div>
    </div>
  );
}
