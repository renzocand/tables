# Tables Lab — TanStack Table v8 vs react-pivottable

Demo comparativa entre dos librerias open-source para construir tablas pivot
en React, usando **exactamente el mismo dataset** para que se pueda decidir
cual conviene adoptar.

- **Modulo 1 — TanStack Table v8** (MIT, headless). Tres vistas sobre la misma
  data: plana, agrupada (grouping nativo) y pivot cruzada construida a mano.
- **Modulo 2 — react-pivottable** (MIT, UI lista). Drag & drop tipo tabla
  dinamica de Excel con agregadores y renderers incluidos.

Stack: **React 18.3 + Vite + React Router**. Sin backend — todo el
procesamiento ocurre en el frontend sobre 60 expedientes hardcodeados.

## Requisitos

- Node.js 18 o superior
- npm (o pnpm/yarn)

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Abrir http://localhost:5173 (Vite abre la pestana automaticamente).

## Rutas

| Ruta           | Modulo                                         |
| -------------- | ---------------------------------------------- |
| `/`            | Home con las dos tarjetas                      |
| `/tanstack`    | Modulo 1 — TanStack Table v8 (3 vistas)        |
| `/pivottable`  | Modulo 2 — react-pivottable (drag & drop)      |

## Estructura del proyecto

Cada libreria vive en su propia carpeta auto-contenida. Si solo te interesa
una, copias **esa carpeta + `src/data/`** a tu proyecto y listo.

```
.
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx                   Entry + BrowserRouter
    ├── App.jsx                    Shell + rutas
    ├── App.css                    Estilos globales (shell + modulos)
    ├── index.css                  Reset base
    ├── HomePage.jsx               Home con las dos tarjetas
    ├── ModuleCard.jsx             Tarjeta reusable del home
    ├── data/
    │   └── expedientes.js         Dataset + enriquecerExpediente (shared)
    ├── tanstack/                  Modulo 1 (auto-contenido)
    │   ├── TanStackPage.jsx       Pagina con 3 tabs
    │   ├── FlatTable.jsx          Vista plana
    │   ├── GroupedTable.jsx       Vista agrupada (grouping nativo)
    │   ├── CrossTabTable.jsx      Vista pivot cruzada (custom)
    │   ├── pivot.js               buildCrossTab (count / countDistinct / sum / avg)
    │   └── exportCsv.js           Utilidad de export a CSV desde una tabla
    └── react-pivottable/          Modulo 2 (auto-contenido)
        └── PivotTablePage.jsx     PivotTableUI con estado controlado
```

## Que aporta cada modulo

### Modulo 1 — TanStack Table v8

TanStack es **headless**: entrega el modelo de datos (ordenado, filtrado,
agrupado) y tu escribes el render. Mas codigo, maximo control.

- **Vista plana** — listado simple con ordenamiento por columna, filtro
  global y **export a CSV**.
- **Vista agrupada** — usa `getGroupedRowModel` + `aggregationFn: 'count'` y
  `'sum'`. Agrupamiento multi-nivel encadenado (hasta 5 dimensiones) con
  grupos expandibles, conteo y **suma de monto** por grupo.
- **Vista pivot cruzada** — TanStack no trae pivot cruzado nativo, asi que
  se preprocesa con `buildCrossTab` (en `src/tanstack/pivot.js`) y se
  renderiza con columnas dinamicas. Soporta metricas `count`,
  `countDistinct`, `sum` y `avg`. Incluye totales por fila, por columna y
  total general, con export a CSV.

Agregadores nativos disponibles en TanStack: `sum`, `min`, `max`, `extent`,
`mean`, `median`, `unique`, `uniqueCount`, `count`.

### Modulo 2 — react-pivottable

React port de la tabla dinamica de [PivotTable.js](https://pivottable.js.org/).
Entrega **la UI completa** — tu pasas `data` y un estado inicial opcional.

- Barra de campos arrastrables arriba.
- Zonas drop para filas y columnas.
- Selector de agregador (Count, Count Unique Values, Sum, Average, Min, Max…)
  — con el campo numerico `monto` puedes probar todos sin cambiar una linea.
- Selector de renderer (Table, Table Heatmap, Row Heatmap, Col Heatmap,
  **Exportable TSV**). Si instalas ademas `react-plotly.js` + `plotly.js`
  desbloqueas graficos.
- **Export**: el renderer "Exportable TSV" muestra la tabla actual como TSV
  listo para pegar en Excel (equivalente al CSV del modulo TanStack).

Menos codigo, menos control fino del render. Ideal para tableros donde el
usuario final debe explorar la data sin intervencion de desarrollo.

## Dataset

60 expedientes tipo workflow documental en `src/data/expedientes.js`, con los
campos:

- `id` — identificador (`EXP-2025-###`)
- `empresa`, `estado`, `area`, `responsable` (dimensiones categoricas)
- `fecha` (`YYYY-MM-DD`) y `mes` (`YYYY-MM`) derivado por `enriquecerExpediente`
- `descripcion`
- `monto` — **campo numerico** (en soles) para probar `sum`, `avg`, `min`,
  `max` en ambos modulos. Helper `formatMonto(v)` devuelve el valor con
  formato de moneda peruana.

## Deploy a GitHub Pages

El repo incluye un workflow en `.github/workflows/deploy.yml` que builda y
publica a GitHub Pages cada push a `main`.

Pasos una vez:

1. **Settings → Pages** del repo → **Source**: `GitHub Actions`.
2. Push a `main`. El workflow corre solo.

Notas de configuracion:

- `vite.config.js` detecta `GITHUB_REPOSITORY` y ajusta `base` a `/<repo>/`
  en Actions. En local sigue en `/`.
- El router es `HashRouter` (rutas tipo `.../#/tanstack`) para evitar
  redirecciones del lado de server — Pages no soporta SPA fallback por
  defecto.

## Licencia

MIT. Ambas librerias son MIT tambien.
