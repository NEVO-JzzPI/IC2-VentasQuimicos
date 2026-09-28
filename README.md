# Frontend Ventas Quimicos

## Objetivo

El objetivo de este proyecto es un sistema dedicado a la gestion de la asistencia del equipo de trabajo en una empresa de compra y venta de quimicos.

## Estructura
Utilizando la herramienta Vite junto la libreria React, y submodulos utiles para distintos ambitos como:
- `Tailwind`: Libreria facilitador de estilos CSS en el frontend
- `Recharts`: Una libreria dedicada a los graficos presentados en el dashboard
- `Axios`: Util y necesario para el consumo de APIs que es justamente lo que necesitamos, en nuestro caso es mejor que fetch debido al procesado en JSON que hace de forma automatica.

Cuenta con una estructura comun en los proyectos de React:

- `src/`: Carpeta donde se encuentra el funcionamiento principal del proyecto, ademas de las vistas hacia el usuario.
  - `__test__`: Aqui se encuentran los tests, actualmente en la carpeta de components solamente.
  - `assets`: Objetos que no son texto plano, los cuales comunmente son imagenes o documentos.
  - `components`: Componentes de react para su reutilizacion.
  - `context`: El contexto de react, donde se guardan los estados, principalmente de los tokens del usuario.
  - `hooks`: Herramientas reutilizables, enfocados el manejo de los estados.
  - `pages`: Las paginas que seran desplegadas al usuario
  - `services`: Comunicacion con la API del backend, aqui se encuentran todas las herramientas que consumiran estos datos para ser usados en las paginas.
  - `utils`: Herramienta reutilizable util, que no maneja estados.
  - `App.jsx`: Enrutamiento de las paginas.
- `README.md`: Documento de presentacion.
- `.env`: Archivo de variables de enviroment, no se han incluido en este caso al `.gitignore` debido a que no contiene datos sensibles, solo la url de la API.
- `CLAUDE.md`: El documento utilizado para la ayuda de claude.

El resto de archivos suelen ser necesarios para vite, o de utilizacion general en proyectos web como `index.html`.

## Utilizacion


### 1. Clonar ambos repositorios (frontend y backend
Frontend:
```
git clone https://github.com/NEVO-JzzPI/IC2-VentasQuimicos.git
```
Backend:
```
git clone https://github.com/Alfonsonrx/QuimicosBackend.git
```

### 2. Setup

Para el backend es necesario seguir las instrucciones del repositorio backend, para no redundar asumiremos que se ha instalado y se encuentra ejecutando.
En el caso del frontend es necesario instalar las librerias con `yarn`:
```
yarn install
```

### 3. Ejecutar

Ya con las librerias instaladas solo queda ejecutar el codigo:
```
yarn dev
```

Esto ejecutara el proyecto como modo desarrollo.
Para llevarlo a produccion seria requerido
```
yarn build
```

De esta forma obteniendo una version de produccion que podremos colocar en un servidor con Nginx.
