# API REST - MediCerca

Base URL: `https://medicerca-backend.onrender.com`

En desarrollo: `http://localhost:3000`

Todas las respuestas son JSON. Los endpoints marcados con [AUTH] requieren el header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST /api/auth/register

Crear una cuenta nueva.

**Request:**
```json
{
  "email": "jose@ramirez.com",
  "password": "mi password",
  "fullName": "Jose Ramirez",
  "role": "patient"
}
```

El campo `role` es opcional. Valores validos: `"patient"` (default) o `"doctor"`.

**Response 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "jose@ramirez.com",
    "fullName": "Jose Ramirez",
    "role": "patient"
  }
}
```

**Errores:**
- `400` — Faltan campos o password < 6 caracteres
- `409` — El email ya esta registrado

---

### POST /api/auth/login

Iniciar sesion.

**Request:**
```json
{
  "email": "jose@ramirez.com",
  "password": "mi password"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "jose@ramirez.com",
    "fullName": "Jose Ramirez",
    "role": "patient"
  }
}
```

**Errores:**
- `400` — Faltan campos
- `401` — Email o password incorrectos

---

## Appointments [AUTH]

### POST /api/appointments

Agendar una cita.

**Request:**
```json
{
  "type": "general",
  "slotId": 1
}
```

Valores validos para `type`: `"general"`, `"followup"`, `"emergency"`.

**Response 201:**
```json
{ "id": 1 }
```

---

### GET /api/appointments

Listar todas las citas del usuario autenticado.

**Response 200:**
```json
[
  {
    "id": 1,
    "type": "general",
    "slot_id": 1,
    "doctor": "Dra. Adriana Solis",
    "clinic": "Centro Medico Norte, Sala 3",
    "date": "2026-07-14",
    "time": "10:00",
    "confirmed_at": "2026-07-13T10:30:00Z"
  }
]
```

---

### DELETE /api/appointments/:id

Eliminar una cita.

**Response 200:**
```json
{ "ok": true }
```

**Errores:**
- `404` — Cita no encontrada

---

## Prescriptions [AUTH]

### GET /api/prescriptions

Listar recetas del usuario autenticado.

**Response 200:**
```json
[
  {
    "id": 1,
    "medication": "Losartan 50 mg",
    "frequency": "1 vez al dia",
    "refills": 2,
    "date": "2026-06-10"
  }
]
```

---

### GET /api/prescriptions/created

Listar recetas creadas por el doctor autenticado. Solo doctores.

**Response 200:**
```json
[
  {
    "id": 1,
    "medication": "Ibuprofeno 400mg",
    "frequency": "Cada 8 horas",
    "refills": 3,
    "date": "2026-07-13",
    "patientName": "Maria Lopez"
  }
]
```

---

### GET /api/prescriptions/patients

Listar pacientes unicos del doctor autenticado (derivado de sus recetas). Solo doctores.

**Response 200:**
```json
[
  {
    "id": 5,
    "fullName": "Maria Lopez",
    "email": "maria@test.com"
  }
]
```

---

### POST /api/prescriptions

Crear una receta. Solo doctores.

**Request:**
```json
{
  "patientId": 5,
  "medication": "Ibuprofeno 400mg",
  "frequency": "Cada 8 horas",
  "refills": 3
}
```

**Response 201:**
```json
{
  "prescription": {
    "id": 4,
    "medication": "Ibuprofeno 400mg",
    "frequency": "Cada 8 horas",
    "refills": 3,
    "date": "2026-07-13"
  }
}
```

**Errores:**
- `403` — Solo doctores pueden crear recetas

---

## Home Services [AUTH]

### POST /api/home-services

Solicitar servicio a domicilio.

**Request:**
```json
{
  "serviceType": "nursing",
  "address": "Av. Insurgentes 1234"
}
```

Valores validos para `serviceType`: `"nursing"`, `"lab"`, `"physiotherapy"`, `"medication"`.

**Response 201:**
```json
{ "id": 1 }
```

---

### GET /api/home-services

Listar servicios del usuario.

**Response 200:**
```json
[
  {
    "id": 1,
    "service_type": "nursing",
    "address": "Av. Insurgentes 1234",
    "status": "pending",
    "created_at": "2026-07-13T11:00:00Z"
  }
]
```

---

## Health Check

### GET /api/health

**Response 200:**
```json
{ "status": "ok", "timestamp": "2026-07-13T12:00:00Z" }
```

---

## Ejemplos con curl

```bash
# Registrar paciente
curl -X POST https://medicerca-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@medicerca.com","password":"demo123","fullName":"Demo User","role":"patient"}'

# Registrar doctor
curl -X POST https://medicerca-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@medicerca.com","password":"demo123","fullName":"Dr. Demo","role":"doctor"}'

# Login
curl -X POST https://medicerca-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@medicerca.com","password":"demo123"}'

# Agendar cita (usar token del login)
curl -X POST https://medicerca-backend.onrender.com/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"general","slotId":1}'

# Crear receta (doctor)
curl -X POST https://medicerca-backend.onrender.com/api/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"patientId":5,"medication":"Ibuprofeno 400mg","frequency":"Cada 8 horas","refills":3}'

# Ver pacientes del doctor
curl https://medicerca-backend.onrender.com/api/prescriptions/patients \
  -H "Authorization: Bearer <token>"
```
