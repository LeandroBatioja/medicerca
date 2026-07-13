# Guia de Instalacion - MediCerca

## Prerrequisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Cuenta en Render** (render.com) — para backend + PostgreSQL
- **Cuenta en Vercel** (vercel.com) — para frontend
- **Git** — para push a GitHub

## 1. Estructura del proyecto

```
medicerca/
├── frontend/    # React + Vite + Tailwind (desplegado en Vercel)
├── backend/     # Express + PostgreSQL (desplegado en Render)
└── docs/        # Documentacion
```

## 2. Desplegar el Backend en Render

### Crear PostgreSQL en Render

1. Ir a render.com > New > PostgreSQL
2. Nombre: `medicerca-db`
3. Plan: **Free**
4. Copiar el **Internal Database URL** (o External si necesitas acceso externo)

### Crear Web Service en Render

1. Ir a render.com > New > Web Service
2. Conectar repositorio GitHub
3. Configuracion:
   - **Name**: `medicerca-backend`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. Variables de entorno:
   ```
   DATABASE_URL=postgresql://usuario:password@xxx.render.com:5432/medicerca
   JWT_SECRET=tu-clave-secreta-larga-y-aleatoria
   NODE_ENV=production
   ```

5. Crear el servicio

### Crear usuario demo

Una vez desplegado el backend, crear un usuario via la API:

```bash
curl -X POST https://medicerca-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@medicerca.com","password":"demo123","fullName":"Usuario Demo"}'
```

## 3. Desplegar el Frontend en Vercel

### Configurar variable de entorno

1. Ir a vercel.com > New Project > Importar repositorio
2. En Environment Variables agregar:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://medicerca-backend.onrender.com`
3. Deploy

## 4. Desarrollo Local

### Backend

```bash
cd backend
npm install

# Crear archivo .env
echo 'DATABASE_URL=postgresql://localhost:5432/medicerca
JWT_SECRET=dev-secret' > .env

npm run dev
```

El backend arranca en `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install

# Crear archivo .env
echo 'VITE_API_URL=http://localhost:3000' > .env

npm run dev
```

La app abre en `http://localhost:5173`. El proxy de Vite redirige `/api/*` al backend.

## 5. Troubleshooting

| Problema | Solucion |
|---|---|
| `ECONNREFUSED` | Verificar que el backend esta corriendo |
| `JWT verification failed` | Verificar JWT_SECRET en Render |
| `Database connection failed` | Verificar DATABASE_URL en Render |
| Build falla | Ejecutar `npm install` en la carpeta correspondiente |
| CORS error | Verificar CORS_ORIGIN o que el frontend apunta al backend correcto |
| Render free tier sleeping | El primer request puede tardar ~30s en despertar |
