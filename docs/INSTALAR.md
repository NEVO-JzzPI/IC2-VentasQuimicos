# Cómo instalar el proyecto en tu computadora

¡Hola! Esta guía te va a ayudar a dejar el proyecto funcionando en tu PC, paso a paso. No necesitas saber nada de antemano, solo ir siguiendo los pasos en orden.

## 1. Instalar Node.js

Este proyecto está hecho con React, y para poder correrlo necesitas tener instalado un programa llamado **Node.js** (así es como tu computadora entiende y ejecuta el código).

1. Entra a la página oficial: https://nodejs.org
2. Descarga la versión que dice **LTS** (es la más estable, la recomendada).
3. Abre el instalador y dale "Siguiente" a todo (las opciones que vienen por defecto están bien).
4. Cuando termine, reinicia tu computadora (por si acaso).

### Verificar que se instaló bien

Abre una terminal (en Windows puede ser **PowerShell** o **Git Bash**) la cmd bianca teclas win + r y escribe:

```
node -v
```

Y también:

```
npm --version
```

Si en ambos casos te aparece un número de versión (por ejemplo `v20.11.0`), ¡ya está instalado correctamente! `npm` es un programa que viene incluido con Node y sirve para instalar todas las librerías que el proyecto necesita.

## 2. Instalar Git (si no lo tienes)

Para poder bajar el proyecto necesitas **Git**.

1. Entra a https://git-scm.com/downloads
2. Descarga la versión para tu sistema operativo e instálala (opciones por defecto están bien).
3. Verifica que quedó instalado escribiendo en la terminal:

```
git --version
```

## 3. Descargar el proyecto

Con Git ya instalado, en la terminal ve a la carpeta donde quieras guardar el proyecto y escribe:

```
git clone <URL-del-repositorio>
```

Esto va a crear una carpeta con todo el código del proyecto. Luego entra a esa carpeta:

```
cd nombre-de-la-carpeta
```

> Si ya te pasaron el proyecto en una carpeta (por ejemplo por USB o descarga directa), solo abre la terminal dentro de esa carpeta y sáltate este paso.

## 4. Instalar las dependencias del proyecto

Las "dependencias" son todas las librerías extra que el proyecto usa (React, Tailwind, etc.). Ya están definidas en un archivo llamado `package.json`, así que no tienes que instalarlas una por una: con un solo comando se instalan todas.

Dentro de la carpeta del proyecto, escribe:

```
npm install
```

Espera a que termine (puede tardar uno o dos minutos). Vas a ver que se crea una carpeta llamada `node_modules` — ahí es donde quedan guardadas todas las librerías. Esa carpeta no se toca ni se sube a Git, es normal que sea pesada.

### ¿Qué librerías son estas exactamente?

No necesitas instalarlas a mano, `npm install` las trae todas automáticamente. Solo para que sepas qué es cada una:

- **react** y **react-dom**: la base para construir la interfaz de la aplicación.
- **react-router-dom**: permite tener varias "páginas" dentro de la app (Login, Dashboard, etc.) sin recargar el navegador.
- **tailwindcss** y **@tailwindcss/vite**: para darle estilos (colores, espacios, tamaños) sin escribir CSS a mano.
- **@headlessui/react**: componentes de interfaz (como ventanas emergentes) ya armados y accesibles.
- **recharts**: para dibujar los gráficos que se ven en el Dashboard.
- **@fontsource/montserrat**, **@fontsource/oswald**, **@fontsource/jetbrains-mono**: son las fuentes (tipos de letra) que usa el diseño.

Y para el desarrollo (no afectan la app final, pero ayudan mientras programamos):

- **vite**: el programa que levanta el servidor local y hace que los cambios se vean al instante.
- **eslint**: revisa que el código esté bien escrito y avisa de errores comunes.

## 5. Correr el proyecto

Una vez instalado todo, para ver el proyecto funcionando en tu navegador escribe:

```
npm run dev
```

En la terminal va a aparecer una dirección, algo como:

```
Local:   http://localhost:5173/
```

Copia esa dirección (o dale Ctrl+clic) y ábrela en tu navegador. ¡Listo, ya deberías ver la aplicación corriendo!

Para detenerla, vuelve a la terminal y presiona `Ctrl + C`.

## 6. Otros comandos que vas a usar

- `npm run dev` → levanta el proyecto para trabajar en él día a día (con recarga automática al guardar cambios).
- `npm run build` → genera la versión final lista para publicar (no la vas a necesitar mientras programas).
- `npm run preview` → te deja ver cómo quedaría esa versión final.
- `npm run lint` → revisa que no haya errores de estilo o código en el proyecto.

## 7. Problemas comunes

**"npm no se reconoce como un comando"**
Node.js no quedó bien instalado o falta reiniciar la terminal (ciérrala y ábrela de nuevo). Si sigue sin funcionar, reinicia la computadora.

**Error raro al hacer `npm install`**
Prueba borrar la carpeta `node_modules` y el archivo `package-lock.json` (si existe), y vuelve a correr `npm install`.

**La página no carga o se ve en blanco**
Revisa la terminal donde corriste `npm run dev`: si hay un error en rojo, cópialo y pregúntale a alguien del equipo, seguramente sea fácil de resolver.

---

Con estos pasos ya deberías tener el proyecto corriendo. ¡Bienvenida al equipo! 🎉
