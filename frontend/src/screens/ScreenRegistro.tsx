import { useState } from "react";
import { Activity, ArrowRight, AlertCircle, ChevronLeft, Check, CalendarCheck, Shield, Clock, Stethoscope, User } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center px-8" style={{ background: "#F8FAFC" }}>
        <div className="text-center" style={{ maxWidth: 420 }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: "#D1FAE5", boxShadow: "0 8px 32px rgba(5,150,105,0.15)" }}
          >
            <Check size={36} strokeWidth={3} color="#059669" />
          </div>
          <h2
            className="mb-3"
            style={{ color: "#0F172A", fontFamily: "'Lora', serif", fontSize: 32, fontWeight: 700 }}
          >
            Cuenta creada
          </h2>
          <p className="mb-10" style={{ color: "#64748B", fontSize: 16, lineHeight: 1.6 }}>
            Ya puedes iniciar sesion con tu email y contrasena.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="px-10 rounded-xl font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            style={{ height: 52, background: "#0F766E", color: "#fff" }}
          >
            <ChevronLeft size={18} />
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    height: 52,
    background: "#F8FAFC",
    borderColor: "#E2E8F0",
    color: "#0F172A",
  };

  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#14B8A6";
    e.currentTarget.style.boxShadow = "0 0 0 3px #CCFBF1";
    e.currentTarget.style.background = "#fff";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "#F8FAFC";
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
            Crea tu cuenta
            <br />
            en segundos.
          </h1>
          <p className="text-white/65 leading-relaxed" style={{ fontSize: 17, maxWidth: 380 }}>
            Unete a miles de pacientes y doctores que ya gestionan la salud de forma digital.
          </p>
        </div>

        <div className="space-y-5">
          {[
            { icon: CalendarCheck, text: "Agenda citas en linea" },
            { icon: Shield, text: "Consulta tus recetas digitales" },
            { icon: Clock, text: "Servicios a domicilio" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <f.icon size={16} color="rgba(255,255,255,0.7)" />
              </div>
              <span className="text-white/70 text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col">
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
            {step === "role" ? (
              <>
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-sm font-medium mb-10 cursor-pointer transition-colors hover:opacity-80"
                  style={{ color: "#0F766E" }}
                >
                  <ChevronLeft size={16} />
                  Volver al login
                </button>

                <h2
                  className="mb-3"
                  style={{ color: "#0F172A", fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 700 }}
                >
                  Crear cuenta
                </h2>
                <p className="mb-10" style={{ color: "#64748B", fontSize: 16 }}>
                  Selecciona tu tipo de cuenta
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => { setRole("patient"); setStep("form"); }}
                    className="w-full flex items-center gap-5 p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer group"
                    style={{ background: "#FFFFFF", borderColor: "#E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0F766E"; e.currentTarget.style.boxShadow = "0 0 0 1px #0F766E, 0 4px 12px rgba(15,118,110,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#CCFBF1" }}>
                      <User size={24} color="#0F766E" />
                    </div>
                    <div>
                      <p className="text-lg font-bold mb-1" style={{ color: "#0F172A" }}>Soy paciente</p>
                      <p className="text-sm" style={{ color: "#64748B" }}>Agenda citas, consulta recetas y accede a servicios medicos</p>
                    </div>
                    <ArrowRight size={20} color="#94A3B8" className="shrink-0 ml-auto transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => { setRole("doctor"); setStep("form"); }}
                    className="w-full flex items-center gap-5 p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer group"
                    style={{ background: "#FFFFFF", borderColor: "#E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.boxShadow = "0 0 0 1px #7C3AED, 0 4px 12px rgba(124,58,237,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                      <Stethoscope size={24} color="#7C3AED" />
                    </div>
                    <div>
                      <p className="text-lg font-bold mb-1" style={{ color: "#0F172A" }}>Soy medico</p>
                      <p className="text-sm" style={{ color: "#64748B" }}>Gestiona pacientes, crea recetas y gestiona consultas</p>
                    </div>
                    <ArrowRight size={20} color="#94A3B8" className="shrink-0 ml-auto transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep("role")}
                  className="flex items-center gap-1.5 text-sm font-medium mb-10 cursor-pointer transition-colors hover:opacity-80"
                  style={{ color: "#0F766E" }}
                >
                  <ChevronLeft size={16} />
                  Cambiar tipo de cuenta
                </button>

                <h2
                  className="mb-3"
                  style={{ color: "#0F172A", fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 700 }}
                >
                  {role === "doctor" ? "Cuenta de medico" : "Cuenta de paciente"}
                </h2>
                <p className="mb-10" style={{ color: "#64748B", fontSize: 16 }}>
                  Completa tus datos para registrarte
                </p>

                <div
                  className="p-7 rounded-2xl"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div className="space-y-5 mb-7">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        placeholder={role === "doctor" ? "Dr. Juan Perez" : "Ej. Jose Ramirez"}
                        className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200"
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>

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
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>
                        Contrasena <span className="font-normal" style={{ color: "#94A3B8" }}>(minimo 6 caracteres)</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="Tu contrasena"
                        className="w-full px-4 rounded-xl border text-[15px] transition-all duration-200"
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                  </div>

                  {error && (
                    <div
                      className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm"
                      style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid rgba(220,38,38,0.12)" }}
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleRegister}
                    disabled={!isValid || loading}
                    className="w-full rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                    style={{
                      height: 52,
                      background: isValid ? "#0F766E" : "#CBD5E1",
                      color: isValid ? "#fff" : "#64748B",
                      cursor: isValid ? "pointer" : "not-allowed",
                    }}
                  >
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>

                <p className="text-center text-sm mt-8" style={{ color: "#64748B" }}>
                  Ya tienes cuenta?{" "}
                  <button onClick={onBack} className="font-semibold cursor-pointer hover:underline" style={{ color: "#0F766E" }}>
                    Inicia sesion
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
