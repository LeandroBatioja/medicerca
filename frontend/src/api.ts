import type { UserRole } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("medicerca_token", token);
    } else {
      localStorage.removeItem("medicerca_token");
    }
  }

  loadToken(): string | null {
    const t = localStorage.getItem("medicerca_token");
    this.token = t;
    return t;
  }

  setUserRole(role: UserRole) {
    localStorage.setItem("medicerca_role", role);
  }

  getUserRole(): UserRole {
    return (localStorage.getItem("medicerca_role") as UserRole) || "patient";
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error desconocido");
    }
    return data as T;
  }

  // Auth
  async register(email: string, password: string, fullName: string, role: UserRole = "patient") {
    const data = await this.request<{ token: string; user: { id: number; email: string; fullName: string; role: UserRole } }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify({ email, password, fullName, role }) }
    );
    this.setToken(data.token);
    this.setUserRole(data.user.role);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: { id: number; email: string; fullName: string; role: UserRole } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    this.setToken(data.token);
    this.setUserRole(data.user.role);
    return data;
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem("medicerca_role");
  }

  // Appointments
  async createAppointment(type: string, slotId: string, doctor: string, clinic: string) {
    return this.request<{ id: number }>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({ type, slotId, doctor, clinic }),
    });
  }

  async getAppointments() {
    return this.request<{ id: number; type: string; slot_id: string; doctor: string; clinic: string; confirmed_at: string }[]>(
      "/api/appointments"
    );
  }

  // Prescriptions (patient)
  async getPrescriptions() {
    return this.request<{ id: number; medication: string; frequency: string; refills: number; date: string; doctor_id?: number }[]>(
      "/api/prescriptions"
    );
  }

  // Prescriptions (doctor)
  async getCreatedPrescriptions() {
    return this.request<{ id: number; medication: string; frequency: string; refills: number; date: string; patient_id: number; patient_name: string }[]>(
      "/api/prescriptions/created"
    );
  }

  async getPatients() {
    return this.request<{ id: number; full_name: string; email: string }[]>("/api/prescriptions/patients");
  }

  async createPrescription(medication: string, frequency: string, refills: number, patientId: number) {
    return this.request<{ id: number }>("/api/prescriptions", {
      method: "POST",
      body: JSON.stringify({ medication, frequency, refills, patientId }),
    });
  }

  // Home services
  async requestHomeService(serviceType: string, address: string) {
    return this.request<{ id: number }>("/api/home-services", {
      method: "POST",
      body: JSON.stringify({ serviceType, address }),
    });
  }

  async getHomeServices() {
    return this.request<{ id: number; service_type: string; address: string; status: string; created_at: string }[]>(
      "/api/home-services"
    );
  }
}

export const api = new ApiClient();
