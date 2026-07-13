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

  return (
    <div
      className="flex flex-col items-center px-6 pt-12 pb-10 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #EAF2FC 0%, #F4F7FB 60%, #EDF5E6 100%)",
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
        style={{ background: COLORS.accentBg }}
      >
        <Activity size={30} color={COLORS.accentText} strokeWidth={2.5} />
      </div>

      <h1
        className="text-[22px] font-bold text-center leading-tight mb-1"
        style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
      >
        Bienvenido a MediCerca
      </h1>
      <p className="text-[15px] text-center mb-8" style={{ color: COLORS.accentText }}>
        Inicia sesion para continuar
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4 mb-5">
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
            Contrasena
          </label>
          <div
            className="w-full flex items-center gap-2 rounded-2xl px-4 border transition-all"
            style={{
              height: 52,
              background: COLORS.surface,
              borderColor: password ? COLORS.accentText : COLORS.border,
            }}
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
              className="shrink-0 transition-opacity hover:opacity-70"
            >
              {showPass ? <EyeOff size={18} color={COLORS.secondary} /> : <Eye size={18} color={COLORS.secondary} />}
            </button>
          </div>
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
          icon={<Lock size={20} />}
          label={loading ? "Entrando..." : "Entrar"}
          variant="primary"
          height={56}
          onClick={handleLogin}
          disabled={!email || !password || loading}
        />
      </div>

      <div className="h-3" />

      <div className="w-full max-w-sm">
        <ActionButton
          icon={<UserPlus size={20} />}
          label="Crear cuenta nueva"
          variant="default"
          height={56}
          onClick={() => onNavigate("registro")}
        />
      </div>
    </div>
  );
}
