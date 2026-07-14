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
  accentHover: "#145088",
  successBg: "#EAF3DE",
  successText: "#3B6D11",
  warningBg: "#FFF8E6",
  warningText: "#7A5400",
  warningIcon: "#B07A00",
  errorBg: "#FFF0F0",
  errorBorder: "#FFCDD2",
  errorText: "#C62828",
  secondary: "#5F5E5A",
  disabled: "#D5DFE8",
  fg: "#1A1C20",
  surface: "#ffffff",
  bg: "#F4F7FB",
  border: "rgba(24,95,165,0.12)",
  borderHover: "rgba(24,95,165,0.25)",
  shadow: "0 2px 12px rgba(24,95,165,0.08)",
  shadowMd: "0 4px 20px rgba(24,95,165,0.12)",
  shadowLg: "0 8px 32px rgba(24,95,165,0.16)",
};
