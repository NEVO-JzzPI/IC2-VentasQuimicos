# Cambios de diseño — rama `MejorasDiseño`

Pase **puramente estético** sobre la app (sin tocar lógica, estado, rutas ni servicios).
Objetivo: darle una identidad visual propia en vez de dejarla en el look genérico de
componentes "de tutorial" (cards `shadow-lg`/`rounded-2xl` blancas, navbar de color sólido,
tablas sin jerarquía tipográfica).

## Dirección de diseño elegida

**"Ficha técnica industrial"** — la empresa vende productos químicos y este MVP es un
reloj de marcaje/control de personal, así que se tomó como referencia el mundo de las
fichas de seguridad, hojas de datos técnicos y relojes de marcaje industriales: papel
cálido, tipografía condensada tipo rótulo/stencil para títulos y encabezados, monoespaciada
para datos (horas, usuarios, fechas), paneles oscuros con marcas de esquina tipo "panel de
calibración" para el elemento más importante (marcar asistencia).

Se mantuvo la paleta de colores original completa (nada se reemplazó, solo se sumaron 3
tokens nuevos, ver abajo) porque el pedido explícito fue "mantener la paleta pero puede
cambiarse un poco".

### Paleta

Sin cambios en los tokens existentes:
- `--color-letra: #1C1C1C`
- `--color-letra-secundario: #6B6B6B`
- `--color-bg: #F5EEE6`
- `--color-secundario: #FFFFFF`
- `--color-botonprincipal: #D25D7F`
- `--color-botonhover: #C14A6E`
- `--color-checkboxtrueorinpt: #7A8450`

Tokens nuevos (aditivos, en `src/App.css`):
- `--color-panel-oscuro: #201F1C` — fondo del panel oscuro de "Marcar Asistencia".
- `--color-panel-oscuro-borde: #35332D` — borde/hairline sobre el panel oscuro.
- `--color-acento-hazard: #C99A2E` — ámbar mostaza, usado con moderación como acento
  "de advertencia industrial" (eyebrow de Check, flecha de CollapsibleMenu, marcas de
  esquina del panel de reloj). No se usa en superficies grandes, solo en detalles.

### Tipografía

Se sumaron 2 familias nuevas vía `@fontsource` (mismo mecanismo que ya usaba Montserrat,
sin CDN externo), pensadas como roles distintos, no reemplazos:

- `--font-principal: 'Montserrat'` — sin cambios, texto de cuerpo, párrafos, inputs.
- `--font-rotulo: 'Oswald'` (nuevo) — condensada, estilo rótulo/stencil. Se usa en
  títulos de página, encabezados de tabla, labels de navegación y botones (uppercase +
  tracking), evocando señalética industrial/etiquetas de seguridad.
- `--font-dato: 'JetBrains Mono'` (nuevo) — monoespaciada. Se usa para datos "de
  lectura técnica": el reloj de Check, usuarios de la tabla de Empleados, columnas de
  hora/fecha de los reportes.

Paquetes agregados a `package.json`: `@fontsource/oswald`, `@fontsource/jetbrains-mono`
(importados en `src/main.jsx` junto a los de Montserrat que ya existían).

---

## Cambios por archivo

### `src/App.css`
- Se agregaron los 3 tokens de color nuevos y las 2 fuentes nuevas dentro del mismo
  bloque `@theme`. No se tocó nada de lo existente.

### `src/main.jsx`
- Se agregaron los imports de `@fontsource/oswald` (500/600) y
  `@fontsource/jetbrains-mono` (400/600), igual que ya se hacía con Montserrat.

### `src/components/Button.jsx`
- El botón base pasó de `rounded-lg` + texto normal a `rounded-md` + `font-rotulo
  uppercase tracking-wider` (todo botón de la app ahora se lee como una etiqueta/switch
  industrial: "INICIAR SESIÓN", "ENTRADA", "GUARDAR", etc.).
- Se agregó `active:translate-y-px` para dar sensación de "botón físico" al presionar
  (se anula en disabled).
- Sigue usando los mismos colores (`bg-botonprincipal`, `hover:bg-botonhover`) — ningún
  color cambió, solo tipografía/forma.

### `src/components/Card.jsx`
- Cambió de `rounded-2xl` + `shadow-lg` (look "SaaS blando") a `rounded-lg` + borde
  `border-letra/10` + sombra mucho más sutil (`0 1px 3px`), más cercano a una ficha/hoja
  técnica que a una tarjeta flotante.

### `src/pages/Login.jsx`
- Se agregó un "eyebrow" (`ACCESO DE PERSONAL`) en `font-rotulo` uppercase con el acento
  olivo, sobre el título.
- Título `Iniciar Sesión` pasó a `font-rotulo uppercase tracking-wide`.
- La `Card` del login ahora tiene una franja superior de 4px en el color olivo
  (`before:...bg-checkboxtrueorinpt`) — referencia visual a las carpetas/fichas con
  pestaña de color.
- Inputs: borde `border-black` duro → `border-letra/25` (más suave, coherente con el
  resto de la paleta) y `rounded-lg` → `rounded-md`. El focus ring (verde oliva) no cambió.
- No se tocó ninguna validación, estado ni el checkbox "Recordar mi sesión".

### `src/pages/Check.jsx` (elemento firma / signature element)
- Es la pantalla que más cambia: pasó de una `Card` blanca genérica a un **panel oscuro
  tipo reloj de marcaje industrial** (`bg-panel-oscuro`, texto claro), con 4 marcas de
  esquina en ámbar (`border-l-2 border-t-2 border-acento-hazard/70`, etc.) que simulan
  las marcas de calibración de un instrumento.
- Eyebrow `REGISTRO DE ASISTENCIA` en ámbar + `MARCAR ASISTENCIA` en `font-rotulo`
  uppercase.
- El reloj (antes `text-7xl font-bold` en la tipografía de cuerpo) ahora vive dentro de
  un panel interior (`bg-black/20`, borde sutil) en `font-dato` (JetBrains Mono) color
  ámbar, como un display LED de datasheet.
- Los botones Entrada/Salida ganaron un punto `●` como indicador de estado antes del
  texto; siguen usando exactamente los mismos colores/condiciones `disabled` de antes
  (ningún cambio de lógica).

### `src/components/Navbar.jsx`
- Pasó de una barra sólida `bg-checkboxtrueorinpt/80` con texto blanco a una barra clara
  `bg-secundario` con `border-b border-letra/10` (hairline), más cercana a una barra de
  herramientas técnica que a un bloque de color.
- Los links (`Inicio`, `Gestion de Empleados`) pasaron a `font-rotulo uppercase
  tracking-wide`, con `text-letra-secundario` en reposo y `text-botonprincipal` activos
  (antes era blanco/rosa sobre fondo verde).
- El botón "Cerrar Sesión" no cambió de color, solo hereda el nuevo estilo de `Button`.

### `src/components/CollapsibleMenu.jsx`
- El botón "Reportes" pasó a `font-rotulo uppercase tracking-wide`, coherente con el
  resto del navbar nuevo (antes usaba `font-principal` sobre fondo oscuro).
- La flecha `▾`/`▸` ahora usa el acento ámbar.
- El menú desplegable ganó un borde sutil (`border-letra/10`) y sus items pasaron a
  `font-principal text-sm` explícito (antes heredaban estilos por defecto).

### `src/components/AsistenciaBadge.jsx`
- El pill ahora incluye un punto (`●`) antes del texto de estado y el texto pasó de
  `font-principal` a `font-rotulo uppercase tracking-wide` para leerse como una etiqueta
  de estado tipo semáforo/indicador, no como texto de párrafo. Los colores por estado
  (`estilos`) no cambiaron.

### `src/pages/Dashboard.jsx`
- Títulos de los dos gráficos (`Asistencia de hoy`, `Tendencia semanal...`) pasaron a
  `font-rotulo uppercase tracking-wide` (antes `font-bold` normal).
- La tabla de empleados ganó borde (`border-letra/10`), encabezados en `font-rotulo`
  uppercase pequeño, y **zebra striping** sutil (`bg-bg/40` en filas impares) para
  facilitar la lectura como un listado largo.
- No se tocaron los datos mock, ni la lógica de los charts (`recharts`), ni sus colores
  (`fill="#D25D7F"`, `stroke="#7A8450"` siguen igual).

### `src/pages/Empleados.jsx`
- Título de página a `font-rotulo uppercase tracking-wide`.
- Tabla: mismo tratamiento de "ledger" que Dashboard (borde, encabezados uppercase,
  zebra striping). La columna `Usuario` pasó a `font-dato` (monoespaciada) para
  diferenciarla visualmente como un identificador técnico, no un nombre propio.
- Acciones "Editar"/"Eliminar" pasaron a `font-rotulo text-xs uppercase tracking-wide`
  en vez de texto de párrafo con subrayado hover (el subrayado al hover se mantuvo).
- Modal (crear/editar empleado): mismo tratamiento que `Card` (`rounded-lg`, borde
  sutil en vez de `rounded-2xl`/`shadow-lg`), título en `font-rotulo uppercase`, e
  inputs con `border-letra/25` + `rounded-md` igual que en Login. Ningún campo, validación
  ni llamada a `services/emp.js` se modificó.

### `src/pages/Reporte.jsx`
- Mismo tratamiento de tabla "ledger" (borde, encabezados uppercase `font-rotulo`,
  zebra striping) aplicado a los 3 reportes (`atrasos`, `inasistencias`,
  `salidas-anticipadas`), ya que esta página es genérica y sirve a los tres.
- Las columnas de datos extra (hora, fecha) pasaron a `font-dato` para diferenciarlas
  de los datos "de persona" (nombre, cargo).
- Título del reporte a `font-rotulo uppercase tracking-wide`.

### `src/components/Toast.jsx`
- Cambió de `border` uniforme + `rounded-lg` a un borde izquierdo grueso de 4px
  (`border-l-4`) + `rounded-md`, como una franja de aviso/notice de ficha técnica en vez
  de una notificación tipo burbuja. Los 3 estados de color (`info`/`entradas`/`salidas`)
  no cambiaron.

---

## Qué NO cambió (a propósito)

- Ninguna ruta, guard (`Guards.jsx`), contexto (`AuthContext`, `ToastContext`), hook o
  service.
- Ningún dato mock (`emp.js`, `reportes.js`, arrays locales de `Dashboard.jsx`).
- Ninguna condición de negocio: quién puede ver qué, qué botones se habilitan/
  deshabilitan, validaciones de formularios, mensajes de error.
- La paleta base: los 7 tokens de color originales quedaron con sus mismos valores hex.

## Verificación hecha

- `npm run lint` → 0 errores.
- `npm run build` → build exitoso (Tailwind v4 resuelve los tokens nuevos sin problemas).
- Recorrido manual con navegador headless (Playwright) del flujo completo: Login →
  Check (marcar Entrada) → Dashboard → Empleados → Reporte de atrasos. Sin errores de
  consola, todas las pantallas renderizan y la navegación/estado funcionan igual que
  antes del cambio visual.

## Ideas para llevar a la rama oficial (si se decide adoptar parcialmente)

Si no se quiere el rediseño completo, estas son las piezas más "portables" por separado:
1. El panel oscuro de `Check.jsx` como elemento distintivo de la pantalla de marcaje
   (es la que más se beneficia de un tratamiento especial, al ser la pantalla que ven
   los 25 empleados todos los días).
2. `font-rotulo` (Oswald) solo en encabezados de tabla/títulos de página — mejora la
   jerarquía sin tocar el resto.
3. El zebra striping + bordes de tabla en Dashboard/Empleados/Reporte — mejora legibilidad
   de listados largos sin cambiar tipografía.
4. Los 3 tokens de color nuevos son opcionales: si solo se lleva el punto 1, se necesita
   `--color-panel-oscuro`, `--color-panel-oscuro-borde` y `--color-acento-hazard`; los
   puntos 2 y 3 no los requieren.
