# Tests del frontend

## Librerías usadas

- **vitest** — corre los tests (equivalente a Jest, pero integrado con Vite).
- **jsdom** — simula un navegador para que los componentes se puedan renderizar sin abrir uno real.
- **@testing-library/react** — permite montar componentes y buscar cosas en pantalla (`render`, `screen`).
- **@testing-library/jest-dom** — agrega comprobaciones extra fáciles de leer (`toBeInTheDocument`, `toBeDisabled`, etc).
- **@testing-library/user-event** — simula clicks y escritura como lo haría una persona real.

## Qué prueba cada archivo

### `components/AsistenciaBadge.test.jsx`
Comprueba que el "pill" de estado (Presente, Ausente, etc.) muestre el texto correcto según lo que se le pasa.

### `components/Button.test.jsx`
Comprueba que el botón reutilizable:
- Muestra el texto que se le pasa.
- Ejecuta la función `onClick` cuando se hace click.
- Se ve y se comporta como deshabilitado cuando corresponde (no deja hacer click).

### `components/Guards.test.jsx`
Comprueba que las rutas protegidas manden a la persona al lugar correcto según su sesión:
- `RequireAuth`: si no hay sesión, manda al login.
- `RequireAdmin`: si el usuario no es administrador, lo manda a `/check`.
- `RequireCheckedIn`: si todavía no marcó entrada, lo manda a `/check`; mientras se está confirmando el estado, no muestra nada.

### `context/AuthContext.test.jsx`
Comprueba el manejo de sesión y asistencia:
- Al iniciar sesión, guarda los datos del usuario.
- Al marcar entrada, el estado cambia a "presente".
- Al marcar salida, el estado cambia a "no presente".
- Al cerrar sesión, se borra el usuario y los datos guardados en el navegador.
