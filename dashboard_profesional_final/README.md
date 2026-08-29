# Dashboard Ejecutivo de Ventas 2025

Proyecto web con HTML, CSS, JavaScript y Chart.js.

## Estructura

- `index.html`: página principal.
- `css/styles.css`: diseño del dashboard.
- `js/data.js`: datos usados por el tablero.
- `js/dashboard.js`: KPIs, filtros, gráficas y tabla.
- `data/datos-ventas.csv`: archivo de datos original.

## Cómo abrirlo en Visual Studio Code

1. Abre la carpeta `dashboard_profesional_final` en VS Code.
2. Abre `index.html`.
3. Haz clic derecho y selecciona **Open with Live Server**.
4. También puedes usar **Go Live** si tienes instalada la extensión Live Server.

No uses un `launch.json` que intente abrir `localhost:8080`, porque este proyecto no necesita un servidor Node en ese puerto.

## Importante

El `index.html` intenta cargar Chart.js desde varios CDN de respaldo. Después carga `js/data.js` y `js/dashboard.js` en orden, para evitar que el tablero se quede sin datos o sin gráficas por un fallo de carga de la librería.
