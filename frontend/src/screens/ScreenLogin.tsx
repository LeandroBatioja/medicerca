import { useState } from "react";
import {
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  Activity,
  AlertCircle,
} from "lucide-react";
import { ActionButton } from "../components/ActionButton";
import { COLORS, type Screen } from "../types";
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

  const inputStyle = (focused: boolean) => ({
    height: 54,
    background: COLORS.surface,
    borderColor: focused ? COLORS.accentText : COLORS.border,
    color: COLORS.fg,
    boxShadow: focused ? COLORS.shadow : "none",
  });

  return (
    <div
      className="flex flex-col items-center px-4 pt-14 pb-10 min-h-screen max-w-md mx-auto w-full"
      style={{
        background: "linear-gradient(180deg, #EAF2FC 0%, #F4F7FB 50%, #F4F7FB 100%)",
      }}
    >
      {/* Logo */}
      <div className="mb-6 mt-4">
        <div
          className="w-18 h-18 rounded-3xl flex items-center justify-center shadow-md"
          style={{ background: COLORS.accentBg, width: 72, height: 72 }}
        >
          <Activity size={34} color={COLORS.accentText} strokeWidth={2.5} />
        </div>
      </div>

      {/* Heading */}
      <h1
        className="text-[26px] font-bold text-center leading-tight mb-1"
        style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
      >
        Bienvenido a MediCerca
      </h1>
      <p className="text-[15px] text-center mb-8" style={{ color: COLORS.accentText }}>
        Inicia sesion para continuar
      </p>

      {/* Form */}
      <div className="w-full flex flex-col gap-4 mb-5">
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
            Contrasena
          </label>
          <div
            className="w-full flex items-center gap-2 rounded-2xl px-4 border transition-all duration-200"
            style={inputStyle(!!password)}
          >
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Minimo 6 caracteres"
              className="flex-1 text-[16px] bg-transparent outline-none"
              style={{ color: COLORS.fg }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="shrink-0 p-1 rounded-lg transition-opacity hover:opacity-70"
            >
              {showPass ? <EyeOff size={18} color={COLORS.secondary} /> : <Eye size={18} color={COLORS.secondary} />}
            </button>
          </div>
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

      {/* Primary CTA */}
      <ActionButton
        icon={<Lock size={20} />}
        label={loading ? "Entrando..." : "Entrar"}
        variant="primary"
        height={56}
        onClick={handleLogin}
        disabled={!email || !password || loading}
      />

      <div className="h-3" />

      {/* Secondary CTA */}
      <ActionButton
        icon={<UserPlus size={20} />}
        label="Crear cuenta nueva"
        variant="default"
        height={56}
        onClick={() => onNavigate("registro")}
      />

      {/* Info */}
      <div className="flex flex-col items-center gap-1 mt-8">
        <p className="text-[12px]" style={{ color: COLORS.secondary }}>
          Usa tu email y contrasena para iniciar sesion
        </p>
      </div>
    </div>
  );
}
