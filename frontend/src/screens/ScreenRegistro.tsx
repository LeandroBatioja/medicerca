import { useState } from "react";
import { Activity, AlertCircle, ArrowLeft, Check } from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { COLORS, type Screen } from "../types";
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

  const inputStyle = (focused: boolean) => ({
    height: 54,
    background: COLORS.surface,
    borderColor: focused ? COLORS.accentText : COLORS.border,
    color: COLORS.fg,
    boxShadow: focused ? COLORS.shadow : "none",
  });

  if (success) {
    return (
      <div
        className="flex flex-col items-center px-4 pt-14 pb-10 min-h-screen max-w-md mx-auto w-full"
        style={{
          background: "linear-gradient(180deg, #EAF3DE 0%, #F4F7FB 50%, #F4F7FB 100%)",
        }}
      >
        <div className="mb-6 mt-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
            style={{ background: COLORS.successBg }}
          >
            <Check size={40} strokeWidth={3} color={COLORS.successText} />
          </div>
        </div>
        <h2
          className="text-[26px] font-bold text-center mb-2"
          style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
        >
          Cuenta creada!
        </h2>
        <p className="text-[15px] text-center mb-8" style={{ color: COLORS.secondary }}>
          Ya puedes iniciar sesion con tu email y contrasena.
        </p>
        <div className="w-full">
          <ActionButton
            icon={<ArrowLeft size={20} />}
            label="Volver al login"
            variant="primary"
            height={56}
            onClick={() => onNavigate("login")}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center px-4 pt-14 pb-10 min-h-screen max-w-md mx-auto w-full"
      style={{
        background: "linear-gradient(180deg, #EAF2FC 0%, #F4F7FB 50%, #F4F7FB 100%)",
      }}
    >
      {/* Back button */}
      <div className="w-full flex items-center gap-3 mb-6 mt-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 hover:bg-[#E6F1FB] active:scale-95 border"
          style={{ borderColor: COLORS.border }}
        >
          <ArrowLeft size={18} color={COLORS.accentText} />
        </button>
        <h2
          className="text-[19px] font-semibold"
          style={{ color: COLORS.fg, fontFamily: "'Lora', serif" }}
        >
          Crear cuenta
        </h2>
      </div>

      {/* Logo */}
      <div className="mb-6">
        <div
          className="w-18 h-18 rounded-3xl flex items-center justify-center shadow-md"
          style={{ background: COLORS.accentBg, width: 72, height: 72 }}
        >
          <Activity size={34} color={COLORS.accentText} strokeWidth={2.5} />
        </div>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold" style={{ color: COLORS.fg }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Ej. Jose Ramirez"
            className="w-full rounded-2xl px-4 text-[16px] outline-none border transition-all duration-200"
            style={inputStyle(!!name)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold" style={{ color: COLORS.fg }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="tu@email.com"
            className="w-full rounded-2xl px-4 text-[16px] outline-none border transition-all duration-200"
            style={inputStyle(!!email)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold" style={{ color: COLORS.fg }}>
            Contrasena{" "}
            <span style={{ color: COLORS.secondary, fontWeight: 400 }}>
              (minimo 6 caracteres)
            </span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Tu contrasena"
            className="w-full rounded-2xl px-4 text-[16px] outline-none border transition-all duration-200"
            style={inputStyle(password.length >= 6)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="w-full flex items-start gap-2.5 rounded-2xl px-4 py-3 mb-4"
          style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}` }}
        >
          <AlertCircle size={16} color={COLORS.errorText} className="mt-0.5 shrink-0" />
          <p className="text-[13px]" style={{ color: COLORS.errorText }}>{error}</p>
        </div>
      )}

      <ActionButton
        icon={<Activity size={20} />}
        label={loading ? "Creando cuenta..." : "Crear cuenta"}
        variant="primary"
        height={56}
        onClick={handleRegister}
        disabled={!isValid || loading}
      />
    </div>
  );
}
