import React, { useMemo, useState } from 'react'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import { expedientes as rawExpedientes, enriquecerExpediente } from '../data/expedientes'

// Etiquetas visibles para los campos al arrastrar.
// react-pivottable usa las llaves tal cual, asi que renombramos en el objeto.
const FIELD_LABELS = {
  id: 'ID',
  empresa: 'Empresa',
  estado: 'Estado',
  fecha: 'Fecha',
  mes: 'Mes',
  area: 'Area',
  responsable: 'Responsable',
  descripcion: 'Descripcion'
}

function toPivotRow(exp) {
  const out = {}
  for (const key of Object.keys(exp)) {
    out[FIELD_LABELS[key] || key] = exp[key]
  }
  return out
}

// Modulo 2 — react-pivottable. UI drag & drop lista para usar, estilo tabla
// dinamica de Excel. Todo el estado de configuracion del pivot (filas,
// columnas, agregador, renderer) vive en un unico objeto controlado.
//
// Todo el modulo vive en src/react-pivottable/ para que sea replicable de
// forma aislada — basta copiar esta carpeta + src/data/ a tu proyecto.
export default function PivotTablePage() {
  const pivotData = useMemo(
    () => rawExpedientes.map(enriquecerExpediente).map(toPivotRow),
    []
  )

  // Estado inicial util para el dataset: Area en filas, Estado en columnas.
  const [pivotState, setPivotState] = useState({
    rows: ['Area'],
    cols: ['Estado'],
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
          Arrastra campos entre Filas, Columnas y Valores sobre {pivotData.length} expedientes.
          La UI y los agregadores vienen de la libreria.
        </div>
      </div>

      <div className="hint" style={{ marginBottom: 12 }}>
        Tip: arrastra un campo desde la barra superior a la zona de filas o columnas.
        Cambia el agregador (Count, Count Unique Values, etc.) y el renderer (Table,
        Table Heatmap, Row/Col Heatmap) desde los selectores.
      </div>

      <div className="pivottable-wrap">
        <PivotTableUI
          data={pivotData}
          onChange={s => setPivotState(s)}
          {...pivotState}
        />
      </div>
    </div>
  )
}
