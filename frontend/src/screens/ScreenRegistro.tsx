import { useState } from "react";
import { Activity, ArrowRight, AlertCircle, ChevronLeft, Check, User, Stethoscope, Shield } from "lucide-react";
import type { Screen, UserRole } from "../types";
import { api } from "../api";

export function ScreenRegistro({
  onNavigate,
  onBack,
}: {
  onNavigate: (s: Screen) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<UserRole | null>(null);
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
      await api.register(email, password, name, role || "patient");
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
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #E0F2FE 50%, #F1F5F9 100%)" }}
      >
        <div className="text-center" style={{ maxWidth: 360 }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#D1FAE5", boxShadow: "0 6px 24px rgba(5,150,105,0.15)" }}
          >
            <Check size={32} strokeWidth={3} color="#059669" />
          </div>
          <h2
            className="mb-2"
            style={{ color: "#1E293B", fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700 }}
          >
            Cuenta creada
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#64748B", lineHeight: 1.6 }}>
            Ya puedes iniciar sesion con tu email y contrasena.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="w-full rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            style={{ height: 48, background: "#0369A1", color: "#fff" }}
          >
            <ChevronLeft size={16} />
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  const inputBase = "w-full px-4 rounded-xl border text-sm transition-all duration-200 outline-none";
  const inputStyle = { height: 48, background: "#F8FAFC", borderColor: "#E2E8F0", color: "#1E293B" };
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#0EA5E9";
    e.currentTarget.style.boxShadow = "0 0 0 3px #E0F2FE";
    e.currentTarget.style.background = "#fff";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "#F8FAFC";
  };

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
        {step === "role" ? (
          <>
            <div className="text-center mb-6">
              <h1
                className="mb-1.5"
                style={{ color: "#1E293B", fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700 }}
              >
                Crear cuenta
              </h1>
              <p className="text-sm" style={{ color: "#64748B" }}>
                Selecciona tu tipo de cuenta
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { setRole("patient"); setStep("form"); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer"
                style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0369A1"; e.currentTarget.style.background = "#E0F2FE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#F8FAFC"; }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E0F2FE" }}>
                  <User size={20} color="#0369A1" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#1E293B" }}>Soy paciente</p>
                  <p className="text-xs" style={{ color: "#64748B" }}>Agenda citas y consulta recetas</p>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </button>

              <button
                onClick={() => { setRole("doctor"); setStep("form"); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer"
                style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.background = "#EDE9FE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#F8FAFC"; }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                  <Stethoscope size={20} color="#7C3AED" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#1E293B" }}>Soy medico</p>
                  <p className="text-xs" style={{ color: "#64748B" }}>Gestiona pacientes y recetas</p>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep("role")}
              className="flex items-center gap-1 text-xs font-semibold mb-5 cursor-pointer"
              style={{ color: "#0369A1" }}
            >
              <ChevronLeft size={14} />
              Cambiar tipo
            </button>

            <div className="text-center mb-6">
              <h1
                className="mb-1.5"
                style={{ color: "#1E293B", fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700 }}
              >
                {role === "doctor" ? "Cuenta medico" : "Cuenta paciente"}
              </h1>
              <p className="text-sm" style={{ color: "#64748B" }}>
                Completa tus datos para registrarte
              </p>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#64748B" }}>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder={role === "doctor" ? "Dr. Juan Perez" : "Tu nombre completo"}
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#64748B" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="tu@email.com"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#64748B" }}>
                  Contrasena <span className="font-normal normal-case">(min. 6 caracteres)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Tu contrasena"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
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
              onClick={handleRegister}
              disabled={!isValid || loading}
              className="w-full rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              style={{
                height: 48,
                background: isValid ? "#0369A1" : "#CBD5E1",
                color: isValid ? "#fff" : "#64748B",
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="text-sm mt-6" style={{ color: "#64748B" }}>
        {step === "form" ? (
          <>Ya tienes cuenta?{" "}
            <button onClick={onBack} className="font-semibold cursor-pointer hover:underline" style={{ color: "#0369A1" }}>
              Inicia sesion
            </button>
          </>
        ) : (
          <>Ya tienes cuenta?{" "}
            <button onClick={onBack} className="font-semibold cursor-pointer hover:underline" style={{ color: "#0369A1" }}>
              Inicia sesion
            </button>
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5 mt-4" style={{ color: "#94A3B8" }}>
        <Shield size={12} />
        <span className="text-[11px] font-medium">Conexion segura y encriptada</span>
      </div>
    </div>
  );
}
