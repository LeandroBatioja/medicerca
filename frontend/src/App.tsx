import { useState, useEffect } from "react";
import { COLORS, type Screen, type Booking } from "./types";
import { api } from "./api";

import { ScreenLogin } from "./screens/ScreenLogin";
import { ScreenRegistro } from "./screens/ScreenRegistro";
import { ScreenInicio } from "./screens/ScreenInicio";
import { FormStep1 } from "./screens/FormStep1";
import { FormStep2 } from "./screens/FormStep2";
import { FormStep3 } from "./screens/FormStep3";
import { ScreenConfirmacion } from "./screens/ScreenConfirmacion";
import { ScreenRecetas } from "./screens/ScreenRecetas";
import { ScreenAsistencia } from "./screens/ScreenAsistencia";
import { ScreenSoporte } from "./screens/ScreenSoporte";

function AppContent() {
  const [stack, setStack] = useState<Screen[]>(["login"]);
  const [booking, setBooking] = useState<Booking>({ type: null, slot: null });
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const token = api.loadToken();
    if (token) {
      setStack(["inicio"]);
    }
  }, []);

  const current = stack[stack.length - 1];
  const push = (s: Screen) => setStack((prev) => [...prev, s]);
  const pop = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const handleLogin = (name: string) => {
    setUserName(name);
    push("inicio");
  };

  const handleLogout = () => {
    api.logout();
    setStack(["login"]);
    setUserName("Usuario");
    setBooking({ type: null, slot: null });
  };

  const goHome = () => {
    setStack(["inicio"]);
    setBooking({ type: null, slot: null });
  };

  const renderScreen = () => {
    switch (current) {
      case "login":
        return <ScreenLogin onLogin={handleLogin} onNavigate={(s) => push(s)} />;
      case "registro":
        return <ScreenRegistro onNavigate={(s) => push(s)} onBack={pop} />;
      case "inicio":
        return <ScreenInicio push={push} userName={userName} onLogout={handleLogout} />;
      case "form-step1":
        return <FormStep1 push={push} pop={pop} booking={booking} setBooking={setBooking} />;
      case "form-step2":
        return <FormStep2 push={push} pop={pop} booking={booking} setBooking={setBooking} />;
      case "form-step3":
        return <FormStep3 push={push} pop={pop} booking={booking} />;
      case "confirmacion":
        return <ScreenConfirmacion booking={booking} goHome={goHome} />;
      case "recetas":
        return <ScreenRecetas pop={pop} />;
      case "asistencia":
        return <ScreenAsistencia pop={pop} />;
      case "soporte":
        return <ScreenSoporte pop={pop} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      {renderScreen()}
    </div>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(145deg, #E8F1FA 0%, #F4F7FB 50%, #EDF5E6 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="hidden lg:flex items-center justify-center py-8">
        <h1
          className="text-[28px] font-semibold"
          style={{ fontFamily: "'Lora', serif", color: COLORS.fg }}
        >
          MediCerca
        </h1>
      </div>
      <AppContent />
    </div>
  );
}
