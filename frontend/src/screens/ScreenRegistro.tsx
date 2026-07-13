import { useState } from "react";
import { Activity, AlertCircle, ArrowLeft } from "lucide-react";
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

  if (success) {
    return (
      <div className="flex flex-col items-center px-6 pt-12 pb-10 min-h-screen">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: COLORS.successBg }}
        >
          <Activity size={36} color={COLORS.successText} />
        </div>
        <h2
          className="text-[22px] font-semibold text-center mb-2"
          style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
        >
          Cuenta creada!
        </h2>
        <p className="text-[15px] text-center mb-6" style={{ color: COLORS.secondary }}>
          Ya puedes iniciar sesion con tu email y contrasena.
        </p>
        <div className="w-full max-w-sm">
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
    <div className="flex flex-col items-center px-6 pt-12 pb-10 min-h-screen">
      <div className="flex items-center gap-3 w-full max-w-sm mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:bg-[#E6F1FB] active:scale-95"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          <ArrowLeft size={18} color={COLORS.accentText} />
        </button>
        <h2
          className="text-[18px] font-semibold"
          style={{ color: COLORS.fg, fontFamily: "'Lora', serif" }}
        >
          Crear cuenta
        </h2>
      </div>

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
        style={{ background: COLORS.accentBg }}
      >
        <Activity size={30} color={COLORS.accentText} strokeWidth={2.5} />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium" style={{ color: COLORS.fg }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Ej. Jose Ramirez"
            className="w-full rounded-2xl px-4 text-[16px] outline-none border transition-all"
            style={{
              height: 52,
              background: COLORS.surface,
              borderColor: name ? COLORS.accentText : COLORS.border,
              color: COLORS.fg,
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium" style={{ color: COLORS.fg }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="tu@email.com"
            className="w-full rounded-2xl px-4 text-[16px] outline-none border transition-all"
            style={{
              height: 52,
              background: COLORS.surface,
              borderColor: email ? COLORS.accentText : COLORS.border,
              color: COLORS.fg,
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium" style={{ color: COLORS.fg }}>
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
            className="w-full rounded-2xl px-4 text-[16px] outline-none border transition-all"
            style={{
              height: 52,
              background: COLORS.surface,
              borderColor: password.length >= 6 ? COLORS.accentText : COLORS.border,
              color: COLORS.fg,
            }}
          />
        </div>
      </div>

      {error && (
        <div
          className="w-full max-w-sm flex items-start gap-2 rounded-xl px-3 py-2.5 mb-4"
          style={{ background: "#FFF0F0", border: "1px solid #FFCDD2" }}
        >
          <AlertCircle size={16} color="#C62828" className="mt-0.5 shrink-0" />
          <p className="text-[13px]" style={{ color: "#C62828" }}>{error}</p>
        </div>
      )}

      <div className="w-full max-w-sm">
        <ActionButton
          icon={<Activity size={20} />}
          label={loading ? "Creando cuenta..." : "Crear cuenta"}
          variant="primary"
          height={56}
          onClick={handleRegister}
          disabled={!isValid || loading}
        />
      </div>
    </div>
  );
}
