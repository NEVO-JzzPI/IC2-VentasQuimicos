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

**Falta / próximos pasos:**
1. Crear la ruta `/empleados` (placeholder inicial) y su página `src/pages/Empleados.jsx` con el CRUD de empleados (listar/crear/editar/eliminar) — decidir si va protegida con `RequireAdmin` igual que `/dashboard`.
2. Crear las 3 páginas/rutas de "Reportes" (R. atrasos, R. Inasistencia, R. Salidas ant.) o al menos placeholders, y decidir si `CollapsibleMenu` debe recibir items como `{label, to}` en vez de strings planos para poder navegar con `NavLink` (hoy son solo texto sin link).
3. Pantalla de historial/registro de asistencia (si es distinta a los reportes anteriores).
4. Persistir sesión en `localStorage` si el usuario marcó "Recordar mi sesión" (hoy el checkbox existe en la UI pero no tiene lógica asociada).
5. Decidir y documentar si `checking()`/`stopChecking()` deberían dejar de ser `async` (no tienen ningún `await` adentro, es innecesario tal como están).
6. Cuando el backend Django esté disponible, reemplazar el mock de `services/auth.js` por la llamada real (fetch/axios a la API), sin modificar `Login.jsx` ni `AuthContext.jsx`. Mismo criterio aplicará a `services/asistencia.js` (incluyendo el array mock de empleados de `Dashboard.jsx`) y `services/empleados.js` cuando se creen para el CRUD y el marcado de asistencia.
7. Evaluar librería de gráficos liviana (ej. `recharts`) para reemplazar los placeholders de "GRAFICO DE BARRAS" / "GRAFICO DE LINEAS" en `Dashboard.jsx`.
8. Limpiar el `<div>` wrapper innecesario alrededor de la `<table>` en `Dashboard.jsx` (no aporta nada, la tabla podría ir directo dentro de `<main>`).
