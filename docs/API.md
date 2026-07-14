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

## Doctors [AUTH]

### GET /api/doctors

Listar todos los doctores registrados. Usado para el selector de doctor al agendar citas.

**Response 200:**
```json
[
  {
    "id": 3,
    "fullName": "Carlos Garcia",
    "email": "doctor.garcia@medicerca.com"
  },
  {
    "id": 4,
    "fullName": "Ana Martinez",
    "email": "doctor.martinez@medicerca.com"
  }
]
```

---

## Appointments [AUTH]

### POST /api/appointments

Agendar una cita.

**Request:**
```json
{
  "type": "general",
  "slotId": 1,
  "doctor": "Carlos Garcia",
  "clinic": "Centro Medico MediCerca",
  "doctorId": 3,
  "date": "2026-07-14",
  "time": "10:00"
}
```

Campos requeridos: `type`, `slotId`, `doctor`, `clinic`.
Campos opcionales: `doctorId` (id del doctor), `date`, `time`.

Valores validos para `type`: `"general"`, `"followup"`, `"emergency"`.

**Response 201:**
```json
{ "id": 1 }
```

---

### GET /api/appointments

Listar todas las citas del usuario autenticado (paciente).

**Response 200:**
```json
[
  {
    "id": 1,
    "type": "general",
    "slot_id": 1,
    "doctor": "Carlos Garcia",
    "clinic": "Centro Medico MediCerca",
    "date": "2026-07-14",
    "time": "10:00",
    "confirmed_at": "2026-07-13T10:30:00Z",
    "doctor_id": 3
  }
]
```

---

### GET /api/appointments/doctor

Listar todas las citas asignadas al doctor autenticado. Solo doctores.

Para citas creadas antes de agregar la columna `doctor_id`, el backend tambien busca por nombre del doctor en el campo `doctor` (texto).

**Response 200:**
```json
[
  {
    "id": 1,
    "type": "general",
    "slot_id": 1,
    "doctor": "Carlos Garcia",
    "clinic": "Centro Medico MediCerca",
    "date": "2026-07-14",
    "time": "10:00",
    "confirmed_at": "2026-07-13T10:30:00Z",
    "user_id": 5,
    "doctor_id": 3,
    "patient_name": "Maria Lopez",
    "patient_email": "maria@test.com"
  }
]
```

---

### DELETE /api/appointments/:id

Eliminar una cita. Puede ser eliminada tanto por el paciente (owner) como por el doctor asignado.

**Response 200:**
```json
{ "ok": true }
```

**Errores:**
- `404` — Cita no encontrada o sin permisos

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
    "date": "2026-06-10",
    "doctor_name": "Carlos Garcia"
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
    "user_id": 5,
    "patient_name": "Maria Lopez"
  }
]
```

---

### GET /api/prescriptions/patients

Listar pacientes unicos del doctor autenticado. Solo doctores.

Primero busca pacientes que tengan al menos una cita con el doctor. Si no hay ninguno, muestra todos los pacientes registrados.

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

# Listar doctores
curl https://medicerca-backend.onrender.com/api/doctors \
  -H "Authorization: Bearer <token>"

# Agendar cita con doctor especifico
curl -X POST https://medicerca-backend.onrender.com/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"general","slotId":1,"doctor":"Dr. Demo","clinic":"Centro Medico","doctorId":3,"date":"2026-07-14","time":"10:00"}'

# Ver citas del doctor
curl https://medicerca-backend.onrender.com/api/appointments/doctor \
  -H "Authorization: Bearer <token>"

# Eliminar una cita (paciente o doctor)
curl -X DELETE https://medicerca-backend.onrender.com/api/appointments/1 \
  -H "Authorization: Bearer <token>"

# Crear receta (doctor)
curl -X POST https://medicerca-backend.onrender.com/api/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"patientId":5,"medication":"Ibuprofeno 400mg","frequency":"Cada 8 horas","refills":3}'

# Ver pacientes del doctor (filtrados por citas)
curl https://medicerca-backend.onrender.com/api/prescriptions/patients \
  -H "Authorization: Bearer <token>"
```
