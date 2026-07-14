import { useState, useEffect } from "react";
import { C, type Screen, type Booking } from "./types";
import { api } from "./api";
import { Sidebar } from "./components/Sidebar";

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

  const handleConfirm = async () => {
    await api.createAppointment(booking.type || "", booking.slot || "", "Sin asignar", "Sin asignar");
    push("confirmacion");
  };

  const isAuth = current !== "login" && current !== "registro";

  const renderScreen = () => {
    switch (current) {
      case "login":
        return <ScreenLogin onLogin={handleLogin} onNavigate={push} />;
      case "registro":
        return <ScreenRegistro onNavigate={push} onBack={pop} />;
      case "inicio":
        return <ScreenInicio onNavigate={push} userName={userName} />;
      case "form-step1":
        return <FormStep1 booking={booking} setBooking={setBooking} onNavigate={push} />;
      case "form-step2":
        return <FormStep2 booking={booking} setBooking={setBooking} onNavigate={push} />;
      case "form-step3":
        return <FormStep3 booking={booking} onNavigate={push} onConfirm={handleConfirm} />;
      case "confirmacion":
        return <ScreenConfirmacion onNavigate={push} userName={userName} />;
      case "recetas":
        return <ScreenRecetas onNavigate={push} />;
      case "asistencia":
        return <ScreenAsistencia onNavigate={push} />;
      case "soporte":
        return <ScreenSoporte onNavigate={push} />;
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        {renderScreen()}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: C.bg }}>
      <Sidebar current={current} onNavigate={push} onLogout={handleLogout} userName={userName} />
      <main className="flex-1 min-w-0">
        {renderScreen()}
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
