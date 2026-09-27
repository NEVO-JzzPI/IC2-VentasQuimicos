# Qué hace cada carpeta del proyecto

Esta guía explica, de forma simple, para qué sirve cada carpeta dentro de `src/`. Al final hay una sección extra sobre `services/`

Todo el código vive dentro de la carpeta `src/`:

```
src/
  pages/
  components/
  features/
  hooks/
  services/   
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


> **Ningún componente ni página debe llamar directamente a `fetch` o a una API.** Todo pedido al backend (Django) tiene que pasar por un archivo de `services/`.



