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
│   └── constants.dart            # AppColors (corporate blue palette) + AppFontSize (elderly accessibility)
├── providers/
│   └── app_state.dart            # AppState: auth, navigation, data loading
├── screens/
│   ├── splash_screen.dart        # Auto-login check
│   ├── login_screen.dart         # Login con gradiente azul + spinner con texto
│   ├── registro_screen.dart      # Registro con selector de rol
│   ├── main_shell.dart           # Navegacion: bottom tabs (mobile) + sidebar (desktop)
│   ├── inicio_screen.dart        # Dashboard paciente (datos reales de API, pull-to-refresh)
│   ├── doctor_dashboard_screen.dart  # Dashboard doctor (datos reales de API, pull-to-refresh)
│   ├── citas_screen.dart         # Lista de citas (pull-to-refresh, detalle scrollable, eliminar)
│   ├── recetas_screen.dart       # Recetas paciente/doctor
│   ├── crear_receta_screen.dart  # Formulario crear receta (doctor, selector de paciente)
│   ├── pacientes_screen.dart     # Lista de pacientes del doctor
│   ├── form_step1_screen.dart    # Wizard paso 1: tipo de cita + selector de doctor
│   ├── form_step2_screen.dart    # Wizard paso 2: fecha/hora
│   ├── form_step3_screen.dart    # Wizard paso 3: revision + confirmacion
│   ├── confirmacion_screen.dart  # Animacion de exito
│   ├── asistencia_screen.dart    # Servicios a domicilio
│   ├── solicitar_servicio_screen.dart  # Formulario crear servicio
│   ├── soporte_screen.dart       # FAQ + llamada directa
│   └── perfil_screen.dart        # Perfil + cerrar sesion
└── widgets/
    └── mobile_tab_bar.dart       # Barra de tabs inferior (5 tabs, labels 13sp)

backend/src/
├── index.ts                      # Entry point (express, cors, routes, GET /api/doctors)
├── db.ts                         # PostgreSQL pool + init schema
├── middleware/
│   └── auth.ts                   # JWT verification
└── routes/
    ├── auth.ts                   # POST /register, POST /login
    ├── appointments.ts           # CRUD citas (doctor can delete, matches by name for old records)
    ├── prescriptions.ts          # GET/POST/GET created/GET patients (patients filtered by appointments)
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
  │   ├── Paciente: Inicio, Citas, Recetas, Servicios, Perfil
  │   └── Doctor: Inicio, Citas, Recetas, Pacientes, Perfil
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
  ├── appointments (id, user_id, doctor_id, type, slot_id, doctor, clinic, date, time, confirmed_at)
  │
  ├── prescriptions (id, user_id, doctor_id, medication, frequency, refills, date)
  │
  └── home_services (id, user_id, service_type, address, status, created_at)
```

El campo `role` en users tiene valores: `"patient"` (default) o `"doctor"`.

El campo `doctor_id` en appointments y prescriptions referencia al doctor asignado. Para citas creadas antes de agregar esta columna, el backend busca por nombre del doctor en el campo `doctor` (texto).

## Dashboards dinamicos

Tanto el dashboard de paciente como el de doctor cargan datos reales de la API:

- **Paciente**: carga appointments, prescriptions y home services → muestra stats y listas
- **Doctor**: carga patients (via appointments), created prescriptions y appointments → muestra stats y listas
- Si no hay datos, muestra un empty state amigable
- Ambos dashboards soportan pull-to-refresh y se actualizan al cambiar de pestana

## Flujo principal: Agendar cita

```
Inicio → FormStep1 (tipo + doctor) → FormStep2 (fecha/hora) → FormStep3 (revision)
                                                                      │
                                                                      ▼
                                                          POST /api/appointments
                                                                      │
                                                                      ▼
                                                          ConfirmacionScreen (animacion)
```

El doctor se selecciona via dropdown (GET /api/doctors). El doctor_id se guarda en la cita para que el doctor pueda verla.

## Flujo: Crear receta

```
Dashboard Doctor → CrearRecetaScreen → Seleccionar paciente (dropdown)
                                              │
                                              ▼
                                   POST /api/prescriptions
```

El dropdown de pacientes solo muestra pacientes que tienen al menos una cita con el doctor actual.

## Seguridad

- **bcrypt**: Passwords hasheados con 10 rounds de salt
- **JWT**: Tokens firmados con secreto del servidor, expiran en 30 dias
- **CORS**: Solo permite requests del frontend autorizado
- **SQL Injection**: Protegido con parameterized queries ($1, $2, etc.)
- **Auth middleware**: Todas las rutas /api/appointments, /api/prescriptions, /api/home-services requieren token valido
- **Role-based access**: Solo doctores pueden crear recetas (POST /api/prescriptions)
- **Delete permissions**: Tanto paciente como doctor pueden eliminar citas (user_id OR doctor_id)
- **APK signing**: Release firmado con keystore propio + R8 minification
- **Proguard**: Reglas Play Core para compatibilidad Android

## Accesibilidad (Nielsen para adultos mayores)

La UI sigue las heuristicas de Nielsen y directrices WCAG para usuarios mayores de 65:

- **Tipografia**: Minimo 16sp para texto cuerpo, 20sp para titulos, 24sp para headings (constantes `AppFontSize`)
- **Contraste**: textSecondary #475569 (6.5:1), textTertiary #64748B (4.6:1) — ambos superan WCAG AA 4.5:1
- **Touch targets**: Minimo 48dp para todos los botones, tab bar a 64dp
- **Iconos con etiquetas**: Todos los botones criticos tienen texto + icono
- **Feedback**: Spinner + texto en cada carga ("Cargando...", "Iniciando sesion...", "Confirmando cita...")
- **Errores**: Icono + mensaje claro + boton reintentar (nunca excepciones raw)
- **Navegacion**: Labels de pasos ("Paso 1 de 3"), tooltips en acciones importantes
- **Pull-to-refresh**: En dashboards para actualizar datos manualmente
- **Dialogos de confirmacion**: Antes de acciones destructivas (eliminar cita, cerrar sesion)
