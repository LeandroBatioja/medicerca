# Guia de Instalacion - MediCerca

## Prerrequisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Flutter** >= 3.41.x + **Dart** >= 3.11.x
- **Android SDK** (para construir APK)
- **Java 21** (OpenJDK)
- **Cuenta en Render** (render.com) — para backend + PostgreSQL
- **Git** — para push a GitHub

## 1. Estructura del proyecto

```
medicerca/
├── medicerca_flutter/   # Flutter/Dart (APK nativo Android)
├── backend/             # Express + PostgreSQL (desplegado en Render)
└── docs/                # Documentacion
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

### Crear usuarios de prueba

Una vez desplegado el backend, crear usuarios via la API:

```bash
# Registrar doctor
curl -X POST https://medicerca-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor.garcia@medicerca.com","password":"medicerca123","fullName":"Carlos Garcia","role":"doctor"}'

# Registrar paciente
curl -X POST https://medicerca-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"medicerca123","fullName":"Maria Lopez","role":"patient"}'
```

## 3. Construir el APK de Android

### Configurar entorno

```bash
# Java 21 (necesario para Android build)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Flutter
export PATH="/home/leandro/development/flutter/bin:$PATH"
```

### Build release

```bash
cd medicerca_flutter

# Build APK release con R8 minification
flutter build apk --release
```

El APK se genera en:
```
build/app/outputs/flutter-apk/app-release.apk
```

Copiar a la raiz del proyecto:
```bash
cp build/app/outputs/flutter-apk/app-release.apk ../MediCerca-Release.apk
```

### Firma del APK

El APK esta firmado con un keystore propio. La configuracion esta en:
- `android/app/release-key.jks` (keystore)
- `android/key.properties` (credenciales)
- `android/app/build.gradle.kts` (configuracion de firma)

`key.properties` NO se sube a git (esta en `.gitignore`).

### Instalar en celular

1. Copiar `MediCerca-Release.apk` al celular
2. Abrir el archivo APK
3. Permitir instalacion desde fuentes desconocidas
4. Pulsa Instalar

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

### Flutter (emulador o dispositivo)

```bash
cd medicerca_flutter

# Verificar entorno
flutter doctor

# Ejecutar en modo desarrollo
flutter run
```

## 5. Cuentas de prueba

| Usuario | Email | Password | Rol |
|---|---|---|---|
| Dr. Carlos Garcia | `doctor.garcia@medicerca.com` | `medicerca123` | Doctor |
| Dr. Ana Martinez | `doctor.martinez@medicerca.com` | `medicerca123` | Doctor |
| Maria Lopez | `maria@test.com` | `medicerca123` | Paciente |
| Juan Perez | `juan@test.com` | `medicerca123` | Paciente |
| Test | `testflutter@test.com` | `123456` | Paciente |

## 6. Git

El APK (`*.apk`) esta en `.gitignore` y no se sube al repositorio.

Para subir cambios:
```bash
git add -A
git commit -m "descripcion del cambio"
git push origin main
```

Si el historial tiene APKs que quieres eliminar:
```bash
git filter-repo --path-glob '*.apk' --invert-paths
git push origin main --force
```

## 7. Troubleshooting

| Problema | Solucion |
|---|---|
| `ECONNREFUSED` | Verificar que el backend esta corriendo |
| `JWT verification failed` | Verificar JWT_SECRET en Render |
| `Database connection failed` | Verificar DATABASE_URL en Render |
| Build falla (backend) | Ejecutar `npm install` en la carpeta backend |
| CORS error | Verificar CORS_ORIGIN o que el frontend apunta al backend correcto |
| Render free tier sleeping | El primer request puede tardar ~30s en despertar |
| Flutter build falla | Verificar `flutter doctor` y Java 21 |
| `INTERNET` permission error | Verificar `android/app/src/main/AndroidManifest.xml` tiene `<uses-permission android:name="android.permission.INTERNET"/>` |
| APK muy grande (~50MB) | Normal para Flutter release con R8 minification |
