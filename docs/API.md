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
  "fullName": "Jose Ramirez"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "jose@ramirez.com",
    "fullName": "Jose Ramirez"
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
    "fullName": "Jose Ramirez"
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
  "slotId": "1",
  "doctor": "Dra. Adriana Solis",
  "clinic": "Centro Medico Norte, Sala 3"
}
```

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
    "slot_id": "1",
    "doctor": "Dra. Adriana Solis",
    "clinic": "Centro Medico Norte, Sala 3",
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

Listar recetas del usuario.

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

### POST /api/prescriptions

Crear una receta.

**Request:**
```json
{
  "medication": "Ibuprofeno 400mg",
  "frequency": "Cada 8 horas",
  "refills": 3
}
```

**Response 201:**
```json
{ "id": 4 }
```

---

## Home Services [AUTH]

### POST /api/home-services

Solicitar servicio a domicilio.

**Request:**
```json
{
  "serviceType": "Consulta domiciliaria",
  "address": "Av. Insurgentes 1234"
}
```

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
    "service_type": "Consulta domiciliaria",
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
# Registrar
curl -X POST https://medicerca-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@medicerca.com","password":"demo123","fullName":"Demo"}'

# Login
curl -X POST https://medicerca-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@medicerca.com","password":"demo123"}'

# Agendar cita (usar token del login)
curl -X POST https://medicerca-backend.onrender.com/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"general","slotId":"1","doctor":"Dra. Solis","clinic":"Centro Norte"}'
```
