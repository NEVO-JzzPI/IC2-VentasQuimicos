# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build (output to `dist/`)
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the project

There is no test runner configured in this project.

## Architecture

This is a React 19 + Vite 8 SPA scaffold styled with Tailwind CSS 4 (via `@tailwindcss/vite`, not a PostCSS config). Entry point is `src/main.jsx`, which mounts `App` (`src/App.jsx`) into `#root` in `index.html`.

`src/index.css` is empty; `src/App.css` holds the Tailwind `@theme` color/font tokens (see palette below) plus leftover template styles from `create-vite`. There is no routing library installed yet — see "Progreso actual" below for what's built so far and what's next.

ESLint config (`eslint.config.js`) uses the flat config format with `@eslint/js` recommended rules, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-flavored). It lints `**/*.{js,jsx}` and ignores `dist`.

# Problematica de este proyecto
Una pequeña empresa de 25 trabajadores y trabajadoras dedicada a la compra y venta de productos químicos ha solicitado la creación de un Mínimo Producto Viable (MVP) para un sistema de registro de asistencia de empleados. La empresa necesita una aplicación web que permita gestionar eficientemente la entrada y salida de sus trabajadores y trabajadoras. Esta solicitud es fundamental para mejorar la organización interna y asegurar el cumplimiento de las normativas laborales, además de optimizar la administración del tiempo y los recursos humanos.

Este repositorio contiene **solo el frontend**. El backend (API) lo desarrolla otro integrante del equipo con Django, en un repositorio separado. Toda comunicación con el servidor debe pasar por una capa de servicios (`src/services/`) que encapsule las llamadas HTTP a la API Django, para no acoplar componentes directamente a `fetch`/`axios` ni a la forma de las respuestas del backend.

## Estructura de carpetas

```
src/
  pages/         # una carpeta/archivo por vista o ruta (Login, Dashboard, Asistencia, Empleados...)
  components/    # componentes de UI reutilizables y genéricos
  features/      # lógica de dominio específica (asistencia, empleados, reportes)
  hooks/         # hooks personalizados
  services/      # cliente HTTP y llamadas a la API Django (api.js, auth.js, asistencia.js...)
  context/       # estado global (ej. AuthContext para sesión/token)
  utils/         # helpers puros (formateo de fechas, validaciones, etc.)
```

Al ser consumidor de una API Django separada, conviene mantener `services/` como el único punto de contacto con el backend (URLs, headers de auth, manejo de errores HTTP), para que un cambio en la API no obligue a tocar componentes o páginas.

## Patrones de diseño

Para el tamaño de este MVP no se recomienda introducir patrones pesados (Redux/Zustand, Clean Architecture, Container/Presentational estricto, etc.) — son overkill para un par de pantallas y 25 usuarios. Sí conviene usar:

- **Service/Repository pattern** en `services/`: cada archivo (`auth.js`, `asistencia.js`, etc.) encapsula las llamadas a la API Django; componentes y páginas nunca hacen `fetch`/`axios` directo.
- **Provider pattern (Context API)** en `context/`: para estado global como sesión/usuario autenticado (ej. `AuthContext`), evitando prop-drilling. No se necesita una librería de manejo de estado externa para este MVP.

Si el proyecto crece (roles, reportes, notificaciones), se puede evaluar introducir algo más robusto más adelante.

# Paleta de colores y fuente

Definida como `@theme` de Tailwind en `src/App.css`:

```
--color-letra: #1C1C1C;
--color-letra-secundario: #6B6B6B;
--color-bg: #F5EEE6;
--color-secundario: #FFFFFF;
--color-botonprincipal: #D25D7F;
--color-botonhover: #C14A6E;
--color-checkboxtrueorinpt: #7A8450;

/* Fuentes */
--font-principal: 'Montserrat', sans-serif;
```

## Librerías utilizadas

Dependencias de runtime (`package.json` → `dependencies`):

- **react** / **react-dom** (19) — librería de UI base.
- **react-router-dom** (7) — enrutamiento SPA (`BrowserRouter`, `Routes`, `NavLink`, guards en `Guards.jsx`).
- **tailwindcss** (4) + **@tailwindcss/vite** — utility CSS, integrado como plugin de Vite (no hay `postcss.config.js`).
- **@headlessui/react** — primitivos de UI accesibles sin estilos propios; usado para el modal `Dialog`/`DialogPanel`/`DialogTitle` de crear/editar en `Empleados.jsx`.
- **recharts** — gráficos del Dashboard (`BarChart`/`LineChart` en `Dashboard.jsx`).
- **@fontsource/montserrat** — fuente Montserrat self-hosted (pesos 400/600/700), importada en `main.jsx`; antes de esto la fuente nunca se cargaba realmente y todo el texto caía al sans-serif del sistema pese a que `App.css` ya definía `--font-principal`.

Herramientas de desarrollo (`devDependencies`): **vite** (8) + `@vitejs/plugin-react` como bundler/dev server, **eslint** (10) + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` para lint, y `@types/react`/`@types/react-dom` solo para autocompletado (el proyecto es JS, no TS).

## Progreso actual

**Hecho:**
- `src/components/Button.jsx` — botón reutilizable (soporta `disabled`, `className` extra, `children`; ya trae `bg-botonprincipal` por defecto).
- `src/components/Card.jsx`, `Toast.jsx`, `ToastContainer.jsx` — UI genérica de soporte (tarjeta contenedora y sistema de notificaciones toast); `ToastContext.jsx` provee `useToast()`.
- `src/pages/Login.jsx` — formulario de login (usuario/contraseña, checkbox "recordar", validación básica de campos requeridos, labels asociados correctamente con `htmlFor`/`id`, estados de `loading`/`error` con feedback visual). Usa `useAuth().login(...)`.
- `src/services/auth.js` — mock de `login(username, password)` que simula la API Django (delay de 500ms, usuarios de prueba `admin`/`1234` y `empleado`/`1234` con campo `rol`, lanza error si las credenciales no coinciden). Reemplazar por la llamada real cuando el backend esté listo, sin tocar componentes.
- `src/context/AuthContext.jsx` — `AuthProvider` + hook `useAuth()`. Expone `user`, `login()`, `logout()`, y estado de asistencia: `isChecking` (bool), `checking()` (marca entrada), `stopChecking()` (marca salida). `logout()` resetea `isChecking` a `false` para que la siguiente sesión deba volver a marcar.
- `react-router-dom` instalado y en uso. `BrowserRouter` envuelve `<AuthProvider><App /></AuthProvider>` en `src/main.jsx`.
- `src/App.jsx` — define las rutas con `<Routes>`/`<Route>`: `/` (Login), `/check` (Check, protegida con `RequireAuth`), `/dashboard` (Dashboard, protegida con `RequireAuth` → `RequireAdmin` → `RequireCheckedIn` anidados).
- `src/components/Guards.jsx` — guardianes de ruta: `RequireAuth` (redirige a `/` si no hay `user`), `RequireAdmin` (redirige a `/check` si `user?.rol !== 'admin'`), `RequireCheckedIn` (redirige a `/check` si `!isChecking`). Todos usan `<Navigate replace />`.
- `src/pages/Check.jsx` — pantalla de marcar asistencia (reloj en vivo, botones Entrada/Salida que llaman `checking()`/`stopChecking()` del context + toasts). Al marcar Entrada, si `user.rol === 'admin'`, navega automáticamente a `/dashboard` vía `useNavigate()`.
- `src/components/CollapsibleMenu.jsx` — sección colapsable reutilizable (`title` + `items: string[]`), usada para "Reportes".
- `src/components/SlideBar.jsx` — sidebar del dashboard: `CollapsibleMenu` para "Reportes" (R. atrasos / R. Inasistencia / R. Salidas ant.), link `NavLink` a `/empleados` para "Gestion de Empleados" (decisión tomada: el CRUD de empleados vive en la página `/empleados`, no como sub-items en el sidebar), y botón "Cerrar Sesión" (`logout()` + `navigate('/')`). Import de `NavLink`/`useNavigate` ya corregido.
- `src/components/AsistenciaBadge.jsx` — pill de estado de asistencia (Presente/Ausente/S. Anticipada) con colores de la paleta vía diccionario `estilos` + fallback; recibe `estado` como prop. Reusable en Dashboard y en reportes futuros.
- `src/pages/Dashboard.jsx` — layout armado: `SlideBar` a la izquierda + `<main>` a la derecha (contenedor padre con `flex`). Contenido: zona "Datos" con placeholders de gráficos (`Card` en grid de 2 columnas, aún sin librería de gráficos real) y tabla de empleados (Nombre/Cargo/Asistencia) con datos mock locales (array `empleados`) usando `AsistenciaBadge` en la columna de asistencia. Pendiente mover el mock a `services/asistencia.js` cuando el backend esté listo.
- Centrado de layout: `App.jsx` ya **no** centra globalmente (antes tenía `flex items-center justify-center` en el div que envuelve `<Routes>`, lo que empujaba el Dashboard hacia el centro); ahora solo tiene `bg-bg w-full min-h-screen`. `Login.jsx` y `Check.jsx` cada uno envuelve su `<Card>` en su propio `<div className="flex min-h-screen items-center justify-center">` para mantenerse centrados. Cualquier página nueva de ancho completo (como `/empleados`) no necesita este wrapper; cualquier página tipo formulario/pantalla única sí debería agregarlo.
- `src/components/Navbar.jsx` — navbar horizontal que **reemplazó a `SlideBar` en `Dashboard.jsx`** (mismo contenido: `CollapsibleMenu` de "Reportes", link a `/empleados`, botón "Cerrar Sesión"). `SlideBar.jsx` sigue existiendo en el repo pero ya no lo importa nadie — se deja intacto a propósito (decisión: no borrar) por si se retoma el layout de sidebar más adelante.
- `src/pages/Empleados.jsx` (nuevo) + ruta `/empleados` en `App.jsx` — CRUD completo de empleados sobre `src/services/emp.js` (mock con `ListEmp`/`CreateEmp`/`UpdateEmp`/`DeleteEmp`, delay 500ms simulando la API Django). Tabla (Nombre/Usuario/Cargo/Dirección/Acciones) + modal de crear/editar con `@headlessui/react` (`Dialog`/`DialogPanel`/`DialogTitle`). Actualiza el estado local con el resultado del servicio en vez de re-pedir la lista completa. Ruta protegida con `RequireAuth` → `RequireAdmin` (sin `RequireCheckedIn`, a diferencia de `/dashboard`). Usa `showToast(mensaje, 'info')` — `Toast.jsx` solo define estilos para `'info'`/`'entradas'`/`'salidas'`, no hay tipos `'success'`/`'error'` todavía.
- **Hooks extraídos a `src/hooks/`**: `useAuth()` y `useToast()` vivían en los mismos archivos que sus Providers (`AuthContext.jsx`/`ToastContext.jsx`), lo que disparaba el warning de ESLint `react-refresh/only-export-components`. Ahora:
  - `src/context/auth-context.js` y `src/context/toast-context.js` — solo el `createContext(null)` de cada uno.
  - `src/context/AuthContext.jsx` / `ToastContext.jsx` — solo exportan el Provider (`AuthProvider`/`ToastProvider`), importando el contexto desde los archivos de arriba.
  - `src/hooks/useAuth.js` / `src/hooks/useToast.js` — el hook de acceso, importando el contexto directamente (no desde el Provider).
  - Todos los consumidores (`Login`, `Check`, `Empleados`, `Guards`, `SlideBar`, `Navbar`, `ToastContainer`) importan `useAuth`/`useToast` desde `../hooks/...`. `main.jsx` no cambió (sigue importando los Providers desde `src/context/`).
- `npm run lint` en 0 errores (se limpiaron variables sin usar en `ToastContainer.jsx`, `Check.jsx` y `App.jsx`, además del refactor de hooks de arriba). Detalle completo de esa sesión en `CAMBIOS.md`.
- `src/services/reportes.js` (nuevo) — mock `ListReporte(tipo)` (delay 500ms) con datos de `atrasos` / `inasistencias` / `salidas-anticipadas`, cada uno con su `titulo`, `columnaExtra` y `campo` a mostrar.
- `src/pages/Reporte.jsx` (nuevo) + ruta `/reportes/:tipo` en `App.jsx` (protegida `RequireAuth` → `RequireAdmin` → `RequireCheckedIn`, igual que `/dashboard`) — página genérica que lee `tipo` con `useParams`, pide el reporte a `ListReporte` y renderiza título + tabla.
- `CollapsibleMenu.jsx` — `items` pasó de `string[]` a `{label, to}[]`; ahora renderiza `NavLink` (cierra el menú al navegar) en vez de texto plano sin link. Cualquier otro uso futuro de este componente debe pasar objetos con esa forma.
- `Navbar.jsx` — pasa a `CollapsibleMenu` los 3 links reales de Reportes (`/reportes/atrasos`, `/reportes/inasistencias`, `/reportes/salidas-anticipadas`); y agrega un `NavLink` **"Inicio"** → `/dashboard` (antes no había forma de volver al Dashboard desde `/reportes/:tipo` o `/empleados`).
- `AuthContext.jsx` — sesión persistida en `localStorage` (clave `auth_user`) cuando `login(username, password, remember)` recibe `remember: true`; se lee con un lazy initializer en `useState` al montar `AuthProvider`, y se limpia en `logout()`. Solo persiste `user`, no `isChecking` (recargar la página mantiene la sesión pero exige volver a marcar entrada en `/check`, a propósito). `Login.jsx` ahora pasa su estado `remember` como tercer argumento de `login(...)`.
- `AuthContext.jsx` — `checking()`/`stopChecking()` dejaron de ser `async` (no tenían ningún `await` adentro).
- `Dashboard.jsx` — se sacó el `<div>` wrapper vacío alrededor de la `<table>`; los dos placeholders "GRAFICO DE BARRAS"/"GRAFICO DE LINEAS" fueron reemplazados por gráficos reales de `recharts`: un `BarChart` "Asistencia de hoy" (cuenta `empleados` por estado) y un `LineChart` "Tendencia semanal de asistencia" (mock local `tendenciaSemanal`, aún sin service). Ambos `<Card>` llevan `className="max-w-none!"` para anular el `max-w-md` que trae `Card.jsx` por defecto (pensado para tarjetas de login), y así ocupar todo el ancho de su columna en el grid.
- Fuente: `@fontsource/montserrat` instalado e importado en `main.jsx` (400/600/700); `App.css` agrega `body { font-family: var(--font-principal); }` para que toda la app la herede por defecto sin depender de poner `font-principal` en cada elemento.

**Falta / próximos pasos:**
1. Pantalla de historial/registro de asistencia, si se necesita algo distinto a los reportes de `/reportes/:tipo`.
2. Cuando el backend Django esté disponible: reemplazar `services/auth.js`, `services/emp.js` y `services/reportes.js` por llamadas reales, y crear `services/asistencia.js` para el mock de `empleados`/`asistenciaHoy`/`tendenciaSemanal` que hoy vive local en `Dashboard.jsx` — todo esto sin modificar componentes/páginas.
3. Si se agregan estados de éxito/error distintos a los toasts, sumar esos tipos (`success`/`error`) al diccionario `typeStyles` de `Toast.jsx` — hoy `Empleados.jsx` usa `'info'` para todo a falta de esos tipos.
