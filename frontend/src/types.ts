export type Screen =
  | "login"
  | "registro"
  | "inicio"
  | "form-step1"
  | "form-step2"
  | "form-step3"
  | "confirmacion"
  | "recetas"
  | "asistencia"
  | "soporte";

export interface Booking {
  type: string | null;
  slot: string | null;
}

export interface Appointment {
  id: number;
  type: string;
  slot_id: string;
  doctor: string;
  clinic: string;
  confirmed_at: string;
}

export interface Prescription {
  id: number;
  medication: string;
  frequency: string;
  refills: number;
  date: string;
}

export interface HomeService {
  id: number;
  service_type: string;
  address: string;
  status: string;
  created_at: string;
}

export const COLORS = {
  accentBg: "#E6F1FB",
  accentText: "#185FA5",
  successBg: "#EAF3DE",
  successText: "#3B6D11",
  secondary: "#5F5E5A",
  fg: "#1A1C20",
  surface: "#ffffff",
  bg: "#F4F7FB",
  border: "rgba(24,95,165,0.12)",
};
