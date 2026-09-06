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
- `src/components/Button.jsx` — botón reutilizable (soporta `disabled`, `className` extra).
- `src/pages/Login.jsx` — formulario de login (usuario/contraseña, checkbox "recordar", validación básica de campos requeridos, labels asociados correctamente con `htmlFor`/`id`, estados de `loading`/`error` con feedback visual).
- `src/services/auth.js` — mock de `login(username, password)` que simula la API Django (delay de 500ms, usuarios de prueba `admin`/`1234` y `empleado`/`1234`, lanza error si las credenciales no coinciden). Reemplazar por la llamada real cuando el backend esté listo, sin tocar componentes.
- `src/context/AuthContext.jsx` — `AuthProvider` + hook `useAuth()`. Guarda `user` en estado, expone `login()` (llama al servicio y guarda el usuario) y `logout()`.
- `AuthProvider` ya envuelve `<App />` en `src/main.jsx`.
- `Login.jsx` ya usa `useAuth().login(...)` en vez de llamar al servicio directo.

**Falta / próximos pasos:**
1. Probar el flujo completo login → `user` guardado en el Context (ej. mostrar `user` en `App.jsx` temporalmente o vía React DevTools).
2. Agregar `logout()` a la UI (botón en algún lugar) para poder probar el ciclo completo.
3. Instalar `react-router-dom` y armar rutas (Login, Dashboard, etc.) — hoy `App.jsx` renderiza `Login` fijo, sin router.
4. Redirigir a Dashboard tras un login exitoso (una vez exista el router).
5. Construir pantalla de Dashboard / marcar asistencia (entrada-salida) — el núcleo del MVP.
6. Pantalla de listado de empleados.
7. Pantalla de historial/registro de asistencia.
8. Persistir sesión en `localStorage` si el usuario marcó "Recordar mi sesión" (hoy el checkbox existe en la UI pero no tiene lógica asociada).
9. Cuando el backend Django esté disponible, reemplazar el mock de `services/auth.js` por la llamada real (fetch/axios a la API), sin modificar `Login.jsx` ni `AuthContext.jsx`.
