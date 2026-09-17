# Qué hace cada carpeta del proyecto

Esta guía explica, de forma simple, para qué sirve cada carpeta dentro de `src/`. Al final hay una sección extra sobre `services/`, porque va a ser la carpeta más importante para ti cuando conectes el backend real (el que está haciendo el compañero en Django).

Todo el código vive dentro de la carpeta `src/`:

```
src/
  pages/
  components/
  features/
  hooks/
  services/   ← la más importante para ti
  context/
  utils/
```

## `pages/`

Aquí está cada **pantalla completa** de la aplicación. Una carpeta o archivo por vista/ruta.

Ejemplos que ya existen: `Login.jsx` (pantalla de inicio de sesión), `Dashboard.jsx` (panel principal con gráficos y tabla), `Check.jsx` (marcar entrada/salida), `Empleados.jsx` (CRUD de empleados), `Reporte.jsx` (reportes de atrasos, inasistencias, etc.).

Piensa en `pages/` como "cada botón del menú lleva a un archivo de aquí".

## `components/`

Piezas de interfaz **reutilizables y genéricas**, que no le pertenecen a una sola pantalla. Por ejemplo: `Button.jsx` (un botón con el estilo de la empresa), `Card.jsx` (una tarjeta contenedora), `Toast.jsx`/`ToastContainer.jsx` (las notificaciones que aparecen y desaparecen), `Navbar.jsx` (la barra de navegación), `Guards.jsx` (controla quién puede entrar a qué pantalla).

Regla simple: si un componente se podría usar en más de una pantalla, va aquí.

## `features/`

Lógica de **negocio específica** de un tema puntual (por ejemplo, todo lo relacionado a "asistencia" o "empleados" que no sea solo una pantalla ni un componente genérico). Hoy está vacía, es para cuando el proyecto crezca y algo no encaje bien ni en `pages/` ni en `components/`.

## `hooks/`

Funciones especiales de React que empiezan con `use` y que puedes reutilizar en distintos componentes. Aquí están `useAuth.js` (para saber quién inició sesión) y `useToast.js` (para mostrar notificaciones). Si mañana necesitas repetir la misma lógica en varias pantallas, probablemente se puede convertir en un hook aquí.

## `context/`

Aquí vive el "estado global" de la app, es decir, información que muchas pantallas necesitan sin tener que pasarla a mano de componente en componente. Por ejemplo, `AuthContext.jsx` sabe en todo momento quién es el usuario logueado y si ya marcó entrada o no.

## `utils/`

Funciones sueltas y simples que no dependen de React ni de la app en sí, solo hacen una tarea puntual (por ejemplo, formatear una fecha, validar un correo). Hoy está vacía, se irá llenando según se necesite.

---

## `services/` — la carpeta que vas a usar para conectar el backend

Esta es **la carpeta clave** para tu trabajo. La idea del proyecto es la siguiente:

> **Ningún componente ni página debe llamar directamente a `fetch` o a una API.** Todo pedido al backend (Django) tiene que pasar por un archivo de `services/`.

¿Por qué se hace así? Porque si mañana cambia algo en el backend (una URL, el nombre de un campo, cómo se manda el token), **solo tienes que tocar el archivo de `services/`**, y ninguna pantalla se rompe ni hay que modificarla.

### Cómo está organizado hoy

Cada archivo de `services/` representa un "tema" y agrupa las funciones relacionadas:

- **`auth.js`** → todo lo de iniciar sesión. Hoy tiene una función `login(email, password)` que **simula** lo que haría el backend: espera medio segundo (como si fuera una petición real) y devuelve un `token` falso más los datos del usuario. Cuando el backend esté listo, esta función se reemplaza por un `fetch`/`axios` real a algo como `POST /api/auth/login/`, pero la función se sigue llamando `login` y devolviendo lo mismo (`{ token, user }`) — así `Login.jsx` no se entera del cambio.

- **`emp.js`** → todo lo de empleados (el CRUD). Tiene `ListEmp()`, `CreateEmp(datos)`, `UpdateEmp(id, datos)` y `DeleteEmp(id)`. Ahora mismo trabajan sobre una lista guardada en memoria (un array), pero cuando conectes el backend, cada una de estas funciones va a hacer una petición HTTP real (GET, POST, PUT/PATCH, DELETE) al endpoint de empleados de Django.

- **`reportes.js`** → trae los datos de los reportes (atrasos, inasistencias, salidas anticipadas) con la función `ListReporte(tipo)`.

### Cómo se ve el patrón (ejemplo simplificado)

```js
// services/auth.js — HOY (mock, sin backend)
export async function login(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500)) // simula espera de red
  // busca el usuario en una lista falsa y devuelve { token, user }
}
```

```js
// services/auth.js — MAÑANA (con el backend Django real)
export async function login(email, password) {
  const respuesta = await fetch('https://tu-api-django.com/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!respuesta.ok) {
    throw new Error('Correo o contraseña incorrectos')
  }

  return respuesta.json() // debe devolver algo como { token, user }
}
```

Lo importante: **el nombre de la función (`login`) y lo que devuelve no cambian**, solo cambia lo que pasa *adentro*. Así, `Login.jsx` (o cualquier otra pantalla) sigue funcionando exactamente igual sin tocar ni una línea.

### Tu checklist para conectar el backend

1. Pídele al compañero de Django la URL base de la API y la lista de endpoints disponibles (por ejemplo `/api/auth/login/`, `/api/empleados/`, `/api/reportes/`).
2. Ve archivo por archivo dentro de `services/` (`auth.js`, `emp.js`, `reportes.js`) y reemplaza el contenido de cada función mock por un `fetch` (o `axios`, si se decide instalar) que llame al endpoint real, manteniendo el mismo nombre de función y la misma forma de la respuesta.
3. Si necesitas mandar el token de sesión en cada petición (para las rutas protegidas), es buena idea centralizar eso en un archivo nuevo, por ejemplo `services/api.js`, con una función base que agregue el header `Authorization` automáticamente, y que los demás archivos de `services/` la usen.
4. Prueba cada pantalla que use ese servicio (por ejemplo, después de cambiar `emp.js`, prueba `Empleados.jsx`) para confirmar que todo se sigue viendo y comportando igual.
5. **No cambies nada en `pages/`, `components/` ni `context/`** solo por conectar el backend — si sientes que necesitas tocar una pantalla, probablemente el servicio no está devolviendo los datos en la forma que la pantalla espera, y ahí es donde hay que ajustar.

---

Con esto ya tienes el mapa completo del proyecto. Cualquier duda sobre una carpeta en particular, revisa el archivo `CLAUDE.md` en la raíz, ahí está el detalle técnico de todo lo que se ha construido.
