import { useMemo, useState } from 'react'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import { expedientes, enriquecerExpediente } from '../data/expedientes'

// Las llaves del dataset se muestran tal cual en la UI (en minuscula).
// Si quieres labels bonitos, mapea los objetos antes de pasarlos a data.

export default function PivotTablePage() {
  const data = useMemo(() => expedientes.map(enriquecerExpediente), [])

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
          Drag & drop sobre {data.length} expedientes. La UI y los agregadores los pone la libreria.
        </div>
      </div>

      <div className="hint" style={{ marginBottom: 12 }}>
        Arrastra campos entre Filas, Columnas y Valores. Cambia agregador (Count, Sum, Average…)
        y renderer. Para exportar elige el renderer <strong>Exportable TSV</strong>.
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
