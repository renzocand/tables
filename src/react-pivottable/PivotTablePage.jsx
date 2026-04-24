import React, { useMemo, useState } from 'react'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import { expedientes as rawExpedientes, enriquecerExpediente } from '../data/expedientes'

// Modulo 2 — react-pivottable. UI drag & drop lista para usar, estilo tabla
// dinamica de Excel. Todo el estado de configuracion del pivot (filas,
// columnas, agregador, renderer) vive en un unico objeto controlado.
//
// Todo el modulo vive en src/react-pivottable/ para que sea replicable de
// forma aislada — basta copiar esta carpeta + src/data/ a tu proyecto.
//
// Decision de diseno para el tutorial:
//   Pasamos los objetos tal cual vienen del dataset (llaves en minuscula:
//   `area`, `estado`, `monto`, etc.). react-pivottable usa esas llaves
//   como etiquetas en la UI, por eso aparecen en minuscula. Si quisieras
//   labels bonitos (mayusculas, tildes, "Monto (S/)") basta con mapear los
//   objetos antes de pasarlos — pero se omite aqui para no ocultar lo
//   esencial de la libreria: `<PivotTableUI data={data} {...state} />`.
export default function PivotTablePage() {
  const data = useMemo(
    () => rawExpedientes.map(enriquecerExpediente),
    []
  )

  // Estado inicial: area en filas, estado en columnas, agregador por default.
  // Las llaves coinciden con los nombres de campo del dataset.
  const [pivotState, setPivotState] = useState({
    rows: ['area'],
    cols: ['estado'],
    vals: ['monto'],
    aggregatorName: 'Count',
    rendererName: 'Table'
  })

  return (
    <div className="module-page">
      <div className="module-page-head">
        <div className="module-page-title-row">
          <span className="module-page-eyebrow module-page-eyebrow--purple">Modulo 2</span>
          <h2>react-pivottable</h2>
        </div>
        <div className="module-page-subtitle">
          Arrastra campos entre Filas, Columnas y Valores sobre {data.length} expedientes.
          La UI y los agregadores vienen de la libreria.
        </div>
      </div>

      <div className="hint" style={{ marginBottom: 12 }}>
        <strong>Como usarlo:</strong> arrastra un campo desde la barra superior a las zonas
        de filas o columnas. Cambia el agregador (Count, Sum, Average, Min, Max…) y el
        renderer desde los selectores. Para <em>exportar</em> la tabla actual como TSV/CSV,
        selecciona el renderer "Exportable TSV" — se mostrara un textarea con los datos listos
        para copiar y pegar en Excel.
      </div>

      <div className="pivottable-wrap">
        <PivotTableUI
          data={data}
          onChange={setPivotState}
          {...pivotState}
        />
      </div>
    </div>
  )
}
