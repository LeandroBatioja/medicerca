# Manual de Usuario - MediCerca

## Descripcion general

MediCerca es una aplicacion movil que te permite gestionar tus servicios medicos desde tu celular: agendar citas, ver recetas, solicitar asistencia en domicilio y obtener soporte.

Diseñada siguiendo las heuristicas de Nielsen para adultos mayores: tipografia grande (minimo 16sp), alto contraste (WCAG AA 4.5:1), botones amplios (minimo 48dp), feedback claro en cada accion y navegacion simple.

---

## Instalar la app

1. Descarga el archivo `MediCerca-Release.apk`
2. En tu celular, abre el archivo APK
3. Si tu celular pide permiso, permite la instalacion desde fuentes desconocidas
4. Pulsa **Instalar**

---

## Iniciar sesion

1. Abre la app MediCerca
2. Ingresa tu **email** y **contrasena**
3. Pulsa **Iniciar sesion** (con icono de login)

Si no tienes cuenta, pulsa **Registrate** y completa:
- Nombre completo
- Email
- Contrasena (minimo 6 caracteres)
- Selecciona tu rol: **Paciente** o **Doctor**

---

## Navegacion principal

Despues de iniciar sesion, ves 5 pestañas en la barra inferior:

### Pacientes

| Tab | Icono | Funcion |
|---|---|---|
| Inicio | Casa | Dashboard con resumen de citas, recetas y servicios |
| Citas | Calendario | Ver, crear y eliminar citas |
| Recetas | Recibo | Ver recetas medicas activas |
| Servicios | Medicos | Solicitar servicios a domicilio |
| Perfil | Persona | Ver perfil y cerrar sesion |

### Doctores

| Tab | Icono | Funcion |
|---|---|---|
| Inicio | Casa | Dashboard con pacientes, recetas y citas |
| Citas | Calendario | Ver citas asignadas por pacientes |
| Recetas | Recibo | Ver recetas creadas |
| Pacientes | Personas | Ver lista de pacientes con citas |
| Perfil | Persona | Ver perfil y cerrar sesion |

Los doctores tambien tienen acceso rapido desde el dashboard a:
- **Mis pacientes** — Lista de pacientes
- **Nueva receta** — Crear receta para un paciente

---

## Agendar Cita (Paciente)

El flujo tiene 3 pasos (indicado con texto "Paso 1 de 3", "Paso 2 de 3", "Paso 3 de 3"):

### Paso 1: Tipo de cita y doctor

Selecciona el tipo de consulta:
- **Consulta general** — Revision medica general
- **Seguimiento** — Consulta de seguimiento
- **Urgencia** — Atencion de urgencia

Luego selecciona el **doctor** al que quieres asistir del dropdown.

### Paso 2: Fecha y hora

Selecciona uno de los horarios disponibles en la cuadricula.

### Paso 3: Revision

Revisa los datos de tu cita:
- Tipo de cita
- Fecha y hora seleccionada
- Doctor asignado
- Clinica

Pulsa **Confirmar cita** para finalizar.

### Confirmacion

Se muestra un mensaje de exito con el resumen. Tu cita se guarda automaticamente en el sistema.

---

## Gestionar Citas

### Ver detalle de una cita

Toca cualquier tarjeta de cita para ver sus detalles completos:
- Tipo de consulta
- Doctor asignado
- Clinica
- Dia y hora
- Estado (Confirmada o Pendiente)
- Nombre del paciente (solo doctores)

### Eliminar una cita

Desde el detalle de la cita, pulsa el boton rojo **Eliminar** (con icono de basura). Se te pedira confirmacion antes de eliminar.

Tanto el paciente como el doctor pueden eliminar una cita.

---

## Ver Recetas

### Pacientes

Muestra la lista de recetas medicas activas. Cada receta incluye:
- Nombre del medicamento
- Frecuencia de consumo
- Numero de recargas disponibles
- Fecha de la receta
- Nombre del doctor que la creo

### Doctores

Muestra las recetas que has creado. Puedes crear nuevas recetas desde el dashboard pulsando **Nueva receta**.

Al crear una receta, solo aparecen los pacientes que tienen al menos una cita contigo.

---

## Asistencia en Casa

Permite solicitar servicios medicos a domicilio.

### Solicitar un servicio

1. En el tab Servicios, pulsa **Solicitar servicio**
2. Selecciona el tipo de servicio:
   - **Enfermeria** — Cuidado post-operatorio y curacion
   - **Laboratorio** — Toma de muestras a domicilio
   - **Fisioterapia** — Rehabilitacion fisica
   - **Medicamentos** — Entrega de medicamentos
3. Escribe tu direccion
4. Pulsa **Enviar solicitud**

Toca una tarjeta de servicio existente para ver sus detalles.

---

## Soporte

### Contacto directo

- **Llamar** — Linea 800 123 4567 (pulsa el boton para marcar directamente)

### Preguntas frecuentes

Toca una pregunta para ver su respuesta.

---

## Perfil y cerrar sesion

En el tab **Perfil**:
- Ve tu nombre, email y rol
- Pulsa **Cerrar sesion** para salir de la app (con confirmacion)

---

## Dispositivos

La app funciona en:
- Celulares Android (APK nativo)
- Computadoras de escritorio (diseno responsive)
- Tablets

El diseno se adapta automaticamente al tamano de pantalla.

---

## Accesibilidad (Nielsen para adultos mayores)

La app sigue las heuristicas de Nielsen y directrices WCAG para usuarios mayores de 65:

| Aspecto | Estandar aplicado |
|---|---|
| Tipografia minima | 16sp para todo el texto cuerpo |
| Contraste de colores | Minimo 4.5:1 (WCAG AA) |
| Tamano de botones | Minimo 48dp de altura |
| Iconos con etiquetas | Todos los botones criticos tienen texto + icono |
| Feedback de accion | Spinner + texto en cada carga ("Cargando...", "Iniciando sesion...") |
| Mensajes de error | Icono + mensaje claro + boton reintentar |
| Navegacion | Labels de pasos ("Paso 1 de 3"), tooltips en acciones importantes |
| Pull-to-refresh | En dashboards para actualizar datos |
| Dialogos de confirmacion | Antes de acciones destructivas (eliminar cita, cerrar sesion) |

---

## Solucion de problemas

| Problema | Solucion |
|---|---|
| No puedo iniciar sesion | Verifica email y contrasena |
| La app no carga | Verifica tu conexion a internet |
| No se agendo la cita | Verifica que seleccionaste tipo + doctor |
| Error de conexion | El servidor puede tardar ~30s en despertar (Render free tier) |
| La app no se instala | Habilita "Fuentes desconocidas" en ajustes de Android |
| Las citas no se ven | Desliza hacia abajo para actualizar (pull-to-refresh) |
