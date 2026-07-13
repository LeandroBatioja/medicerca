# Arquitectura - MediCerca

## Vision general

MediCerca es una aplicacion web de gestion de servicios medicos con arquitectura cliente-servidor:

```
┌─────────────────┐      HTTPS        ┌─────────────────┐      SQL       ┌──────────────┐
│   Frontend      │  ───────────────► │    Backend      │  ───────────► │  PostgreSQL  │
│   React + Vite  │  ◄─────────────── │   Express.js    │  ◄─────────── │  (Render)    │
│   Tailwind CSS  │                   │   TypeScript    │               │              │
└─────────────────┘                   └─────────────────┘               └──────────────┘
        │                                      │
        │ Deploy                               │ Deploy
        ▼                                      ▼
   ┌──────────┐                         ┌──────────────┐
   │  Vercel  │                         │    Render    │
   │  (CDN)   │                         │  (Web + DB)  │
   └──────────┘                         └──────────────┘
```

## Stack tecnologico

| Capa | Tecnologia | Funcion |
|---|---|---|
| UI | React 19 + TypeScript | Componentes y logica |
| Estilos | Tailwind CSS v4 | Estilos utility-first |
| Build | Vite | Dev server + bundler |
| Backend | Express.js + TypeScript | API REST |
| Auth | JWT + bcrypt | Registro + login seguro |
| DB | PostgreSQL (Render) | Datos persistentes |
| Deploy FE | Vercel | Hosting frontend |
| Deploy BE | Render | Hosting backend + DB |
| Iconos | lucide-react | Iconografia |

## Arquitectura de componentes

```
frontend/src/
├── App.tsx                    # Raiz: routing + estado de auth
├── api.ts                     # Cliente HTTP (fetch + JWT)
├── types.ts                   # Tipos TypeScript + constantes de color
├── components/
│   ├── ActionButton.tsx       # Boton reutilizable (4 variantes)
│   ├── StepDots.tsx           # Indicador de progreso por pasos
│   ├── ScreenHeader.tsx       # Header con boton back
│   └── FooterActions.tsx      # Footer con botones Atras/Continuar
└── screens/
    ├── ScreenLogin.tsx        # Login con email + password
    ├── ScreenRegistro.tsx     # Registro de cuenta nueva
    ├── ScreenInicio.tsx       # Menu principal
    ├── FormStep1.tsx          # Seleccion tipo de cita
    ├── FormStep2.tsx          # Seleccion fecha/hora
    ├── FormStep3.tsx          # Revision y confirmacion
    ├── ScreenConfirmacion.tsx # Exito + resumen
    ├── ScreenRecetas.tsx      # Listado de recetas medicas
    ├── ScreenAsistencia.tsx   # Servicios a domicilio
    └── ScreenSoporte.tsx      # FAQ y contacto
```

```
backend/src/
├── index.ts                   # Entry point (express, cors, routes)
├── db.ts                      # PostgreSQL pool + init schema
├── middleware/
│   └── auth.ts                # JWT verification
└── routes/
    ├── auth.ts                # POST /register, POST /login
    ├── appointments.ts        # CRUD citas
    ├── prescriptions.ts       # GET/POST recetas
    └── home-services.ts       # GET/POST servicios domicilio
```

## Sistema de navegacion

La navegacion usa un **stack simple** (patron iOS/Android):

```typescript
const [stack, setStack] = useState<Screen[]>(["login"]);
const push = (s: Screen) => setStack(prev => [...prev, s]);
const pop = () => setStack(prev => prev.slice(0, -1));
```

## Flujo de autenticacion

```
Registro:
  1. Usuario ingresa email + password + nombre
  2. Frontend POST /api/auth/register
  3. Backend hashea password con bcrypt (10 rounds)
  4. Backend guarda en tabla users
  5. Backend retorna JWT (expira en 30 dias)
  6. Frontend guarda JWT en localStorage

Login:
  1. Usuario ingresa email + password
  2. Frontend POST /api/auth/login
  3. Backend verifica credenciales con bcrypt
  4. Backend retorna JWT
  5. Frontend guarda JWT en localStorage

Requests autenticados:
  1. Frontend envia header Authorization: Bearer <token>
  2. Backend middleware verifica JWT
  3. Backend extrae userId del token
  4. Routes usan userId para filtrar datos del usuario
```

## Base de datos

```
users (id, email, password_hash, full_name, created_at)
  │
  ├── appointments (id, user_id, type, slot_id, doctor, clinic, confirmed_at)
  │
  ├── prescriptions (id, user_id, medication, frequency, refills, date)
  │
  └── home_services (id, user_id, service_type, address, status, created_at)
```

## Flujo principal: Agendar cita

```
Inicio → FormStep1 (tipo) → FormStep2 (fecha/hora) → FormStep3 (revision)
                                                          │
                                                          ▼
                                              POST /api/appointments
                                                          │
                                                          ▼
                                              ScreenConfirmacion
```

## Seguridad

- **bcrypt**: Passwords hasheados con 10 rounds de salt
- **JWT**: Tokens firmados con secreto del servidor, expiran en 30 dias
- **CORS**: Solo permite requests del frontend autorizado
- **SQL Injection**: Protegido con parameterized queries ($1, $2, etc.)
- **Auth middleware**: Todas las rutas /api/appointments, /api/prescriptions, /api/home-services requieren token valido
