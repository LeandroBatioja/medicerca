export type Screen =
  | "login"
  | "registro"
  | "inicio"
  | "form-step1"
  | "form-step2"
  | "form-step3"
  | "confirmacion"
  | "recetas"
  | "crear-receta"
  | "asistencia"
  | "soporte";

export type UserRole = "patient" | "doctor";

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
  doctor_id?: number;
  patient_id?: number;
  patient_name?: string;
}

export interface Patient {
  id: number;
  full_name: string;
  email: string;
}

export interface HomeService {
  id: number;
  service_type: string;
  address: string;
  status: string;
  created_at: string;
}

export const C = {
  brand: "#0369A1",
  brandLight: "#E0F2FE",
  brandDark: "#075985",
  brandAccent: "#0EA5E9",

  bg: "#F1F5F9",
  surface: "#FFFFFF",
  surfaceHover: "#F8FAFC",

  text: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  borderFocus: "#0EA5E9",

  success: "#059669",
  successLight: "#D1FAE5",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  info: "#0284C7",
  infoLight: "#E0F2FE",

  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
  shadowLg: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
  shadowXl: "0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",

  disabled: "#CBD5E1",
  radius: "12px",
  radiusLg: "16px",
  radiusXl: "24px",
} as const;
