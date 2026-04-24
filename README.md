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
    │   └── pivot.js               buildCrossTab (solo aqui)
    └── react-pivottable/          Modulo 2 (auto-contenido)
        └── PivotTablePage.jsx     PivotTableUI con estado controlado
```

## Que aporta cada modulo

### Modulo 1 — TanStack Table v8

TanStack es **headless**: entrega el modelo de datos (ordenado, filtrado,
agrupado) y tu escribes el render. Mas codigo, maximo control.

- **Vista plana** — listado simple con ordenamiento por columna y filtro
  global.
- **Vista agrupada** — usa `getGroupedRowModel` + `aggregationFn: 'count'`.
  Agrupamiento multi-nivel encadenado (hasta 5 dimensiones) con grupos
  expandibles.
- **Vista pivot cruzada** — TanStack no trae pivot cruzado nativo, asi que
  se preprocesa con `buildCrossTab` (en `src/tanstack/pivot.js`) y se
  renderiza con columnas dinamicas. Incluye totales por fila, por columna y
  total general.

Agregadores nativos disponibles: `sum`, `min`, `max`, `extent`, `mean`,
`median`, `unique`, `uniqueCount`, `count`.

### Modulo 2 — react-pivottable

React port de la tabla dinamica de [PivotTable.js](https://pivottable.js.org/).
Entrega **la UI completa** — tu pasas `data` y un estado inicial opcional.

- Barra de campos arrastrables arriba.
- Zonas drop para filas y columnas.
- Selector de agregador (Count, Count Unique Values, Sum, Average, Min, Max…).
- Selector de renderer (Table, Table Heatmap, Row Heatmap, Col Heatmap). Si
  instalas ademas `react-plotly.js` + `plotly.js` desbloqueas graficos.

Menos codigo, menos control fino del render. Ideal para tableros donde el
usuario final debe explorar la data sin intervencion de desarrollo.

## Dataset

60 expedientes tipo workflow documental en `src/data/expedientes.js`, con los
campos:

- `id` — identificador (`EXP-2025-###`)
- `empresa`, `estado`, `area`, `responsable`
- `fecha` (`YYYY-MM-DD`) y `mes` (`YYYY-MM`) derivado por `enriquecerExpediente`
- `descripcion`

## Licencia

MIT. Ambas librerias son MIT tambien.
