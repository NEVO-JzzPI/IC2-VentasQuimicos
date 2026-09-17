# Cambios de esta sesión

## 1. CRUD de Empleados (`/empleados`)

- **`src/pages/Empleados.jsx`** (nuevo): página completa con tabla de empleados (Nombre, Usuario, Cargo, Dirección, Acciones) y modal de crear/editar construido con `@headlessui/react` (`Dialog`, `DialogPanel`, `DialogTitle`).
  - `editingId` distingue si el modal está en modo crear (`null`) o editar (id del empleado).
  - Al guardar, actualiza el array `empleados` en memoria con el resultado devuelto por el servicio (`CreateEmp`/`UpdateEmp`), sin volver a pedir la lista completa.
  - Eliminar pide confirmación con `confirm()` nativo.
  - Usa `showToast(mensaje, 'info')` para feedback — ver punto 2.
- **`src/App.jsx`**: se agregó la ruta `/empleados`, protegida igual que `/dashboard` con `RequireAuth` → `RequireAdmin` (sin `RequireCheckedIn`, ya que gestionar empleados no depende de haber marcado entrada).

## 2. Corrección de tipos de Toast

`Toast.jsx` solo define estilos para `'info'`, `'entradas'` y `'salidas'` (pensados para el flujo de marcado de asistencia en `Check.jsx`). `Empleados.jsx` usaba `'success'`/`'error'`, tipos inexistentes que rendían sin estilo. Se reemplazaron todos los `showToast(...)` de `Empleados.jsx` por `'info'`.

## 3. Limpieza de lint

- **`ToastContainer.jsx`**: se quitó `removeToast` del destructuring de `useToast()` (no se usaba).
- **`Check.jsx`**: se quitaron `login`/`logout` del destructuring de `useAuth()` (no se usaban en esa página).
- **`App.jsx`**: se quitó el import y uso de `useAuth()` que solo servía para un `console.log` de depuración.

## 4. Extracción de hooks (`useAuth`, `useToast`) a `src/hooks/`

Antes, `AuthContext.jsx` y `ToastContext.jsx` exportaban el Provider y el hook (`useAuth`/`useToast`) desde el mismo archivo, lo que rompe Fast Refresh en desarrollo (ESLint: `react-refresh/only-export-components`).

Se separó en tres capas por contexto:

- **`src/context/auth-context.js`** (nuevo): solo `export const AuthContext = createContext(null)`.
- **`src/context/AuthContext.jsx`**: ahora exporta únicamente el componente `AuthProvider`, que importa `AuthContext` desde `auth-context.js`.
- **`src/hooks/useAuth.js`** (nuevo): el hook `useAuth()`, que importa `AuthContext` desde `auth-context.js`.

Mismo patrón para Toast:

- **`src/context/toast-context.js`** (nuevo)
- **`src/context/ToastContext.jsx`** — solo `ToastProvider`
- **`src/hooks/useToast.js`** (nuevo)

Se actualizaron los imports en todos los consumidores: `Login.jsx`, `Check.jsx`, `Empleados.jsx`, `Guards.jsx`, `SlideBar.jsx`, `Navbar.jsx`, `ToastContainer.jsx` (de `../context/AuthContext` / `../context/ToastContext` a `../hooks/useAuth` / `../hooks/useToast`).

`main.jsx` no cambió: sigue importando `AuthProvider`/`ToastProvider` desde `src/context/`.

## Resultado

- `npm run lint` → 0 errores (antes: 6).
- `npm run build` → build exitoso.

## Hallazgo pendiente (no resuelto en esta sesión)

`src/components/SlideBar.jsx` quedó huérfano: `Dashboard.jsx` usa `Navbar.jsx`, no `SlideBar.jsx`. Nadie más lo importa. Candidato a eliminar.
