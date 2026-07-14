# Arquitectura - MediCerca

## Vision general

MediCerca es una aplicacion movil de gestion de servicios medicos con arquitectura cliente-servidor:

```
┌─────────────────┐      HTTPS        ┌─────────────────┐      SQL       ┌──────────────┐
│   Frontend      │  ───────────────► │    Backend      │  ───────────► │  PostgreSQL  │
│   Flutter/Dart  │  ◄─────────────── │   Express.js    │  ◄─────────── │  (Render)    │
│   (APK nativo)  │                   │   TypeScript    │               │              │
└─────────────────┘                   └─────────────────┘               └──────────────┘
        │                                      │
        │ Build                                │ Deploy
        ▼                                      ▼
   ┌──────────┐                         ┌──────────────┐
   │ Android  │                         │    Render    │
   │   APK    │                         │  (Web + DB)  │
   └──────────┘                         └──────────────┘
```

## Stack tecnologico

| Capa | Tecnologia | Funcion |
|---|---|---|
| UI | Flutter 3.41 / Dart 3.11 | Componentes nativos Android |
| State | Provider | Estado reactivo |
| HTTP | http package | Cliente API REST |
| Fonts | google_fonts | Tipografia DM Sans |
| Backend | Express.js + TypeScript | API REST |
| Auth | JWT + bcrypt | Registro + login seguro |
| DB | PostgreSQL (Render) | Datos persistentes |
| Build | Flutter + Gradle | APK release con R8 |
| Deploy BE | Render | Hosting backend + DB |

## Arquitectura de carpetas

```
medicerca_flutter/lib/
├── main.dart                     # Entry point + Provider setup
├── config/
│   ├── api.dart                  # ApiClient (HTTP + JWT + endpoints)
│   ├── models.dart               # User, Appointment, Prescription, Patient, HomeService, Slot, Booking
│   └── constants.dart            # AppColors (corporate blue palette)
├── providers/
│   └── app_state.dart            # AppState: auth, navigation, data loading
├── screens/
│   ├── splash_screen.dart        # Auto-login check
│   ├── login_screen.dart         # Login con gradiente azul
│   ├── registro_screen.dart      # Registro con selector de rol
│   ├── main_shell.dart           # Navegacion: bottom tabs (mobile) + sidebar (desktop)
│   ├── inicio_screen.dart        # Dashboard paciente (datos reales de API)
│   ├── doctor_dashboard_screen.dart  # Dashboard doctor (datos reales de API)
│   ├── citas_screen.dart         # Lista de citas (pull-to-refresh, cancelar)
│   ├── recetas_screen.dart       # Recetas paciente/doctor
│   ├── crear_receta_screen.dart  # Formulario crear receta (doctor)
│   ├── form_step1_screen.dart    # Wizard paso 1: tipo de cita
│   ├── form_step2_screen.dart    # Wizard paso 2: fecha/hora
│   ├── form_step3_screen.dart    # Wizard paso 3: revision
│   ├── confirmacion_screen.dart  # Animacion de exito
│   ├── asistencia_screen.dart    # Servicios a domicilio
│   ├── soporte_screen.dart       # FAQ + contacto
│   └── perfil_screen.dart        # Perfil + cerrar sesion
└── widgets/
    └── mobile_tab_bar.dart       # Barra de tabs inferior (5 tabs)

backend/src/
├── index.ts                      # Entry point (express, cors, routes)
├── db.ts                         # PostgreSQL pool + init schema
├── middleware/
│   └── auth.ts                   # JWT verification
└── routes/
    ├── auth.ts                   # POST /register, POST /login
    ├── appointments.ts           # CRUD citas
    ├── prescriptions.ts          # GET/POST/GET created/GET patients recetas
    └── home-services.ts          # GET/POST servicios domicilio
```

## Sistema de navegacion

La navegacion usa **Provider** para estado global y **Navigator** para stack de pantallas:

```
AppState (Provider)
  ├── user, token, isLoading     → Estado de autenticacion
  ├── currentTab                 → Tab activa (0-4)
  └── switchTab(index)           → Cambiar tab desde cualquier pantalla

Navegacion:
  ├── Mobile: BottomNavigationBar (5 tabs)
  ├── Desktop: Sidebar izquierdo
  └── Wizard: Navigator.push para pasos 1→2→3→Confirmacion
```

## Flujo de autenticacion

```
Registro:
  1. Usuario ingresa email + password + nombre + rol
  2. Flutter POST /api/auth/register
  3. Backend hashea password con bcrypt (10 rounds)
  4. Backend guarda en tabla users (con role)
  5. Backend retorna JWT (expira en 30 dias)
  6. Flutter guarda JWT en SharedPreferences
  7. AppState actualiza user + token

Login:
  1. Usuario ingresa email + password
  2. Flutter POST /api/auth/login
  3. Backend verifica credenciales con bcrypt
  4. Backend retorna JWT + user (con role)
  5. Flutter guarda JWT en SharedPreferences
  6. AppState actualiza user + token
  7. Navega a MainShell (tabs segun rol)

Auto-login:
  1. Splash screen lee token de SharedPreferences
  2. Si token existe, intenta cargar perfil
  3. Si exitoso, navega directo a MainShell
  4. Si falla, muestra login
```

## Base de datos

```
users (id, email, password_hash, full_name, role, created_at)
  │
  ├── appointments (id, user_id, type, slot_id, doctor, clinic, confirmed_at)
  │
  ├── prescriptions (id, doctor_id, patient_id, medication, frequency, refills, date)
  │
  └── home_services (id, user_id, service_type, address, status, created_at)
```

El campo `role` en users tiene valores: `"patient"` (default) o `"doctor"`.

## Dashboards dinamicos

Tanto el dashboard de paciente como el de doctor cargan datos reales de la API:

- **Paciente**: carga appointments, prescriptions y home services → muestra stats y listas
- **Doctor**: carga patients (via prescriptions), created prescriptions y appointments → muestra stats y listas
- Si no hay datos, muestra un empty state amigable

## Flujo principal: Agendar cita

```
Inicio → FormStep1 (tipo) → FormStep2 (fecha/hora) → FormStep3 (revision)
                                                          │
                                                          ▼
                                              POST /api/appointments
                                                          │
                                                          ▼
                                              ConfirmacionScreen (animacion)
```

## Seguridad

- **bcrypt**: Passwords hasheados con 10 rounds de salt
- **JWT**: Tokens firmados con secreto del servidor, expiran en 30 dias
- **CORS**: Solo permite requests del frontend autorizado
- **SQL Injection**: Protegido con parameterized queries ($1, $2, etc.)
- **Auth middleware**: Todas las rutas /api/appointments, /api/prescriptions, /api/home-services requieren token valido
- **Role-based access**: Solo doctores pueden crear recetas (POST /api/prescriptions)
- **APK signing**: Release firmado con keystore propio + R8 minification
- **Proguard**: Reglas Play Core para compatibilidad Android
