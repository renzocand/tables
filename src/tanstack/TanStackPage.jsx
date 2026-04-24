import React, { useMemo, useState } from 'react'
import FlatTable from './FlatTable'
import GroupedTable from './GroupedTable'
import CrossTabTable from './CrossTabTable'
import { expedientes as rawExpedientes, enriquecerExpediente } from '../data/expedientes'

const TABS = [
  { id: 'flat',    label: '1. Vista plana',         desc: 'Listado simple tal como luce hoy en el sistema.' },
  { id: 'grouped', label: '2. Vista agrupada',      desc: 'Agrupamiento jerarquico con conteos — nativo de TanStack.' },
  { id: 'pivot',   label: '3. Vista pivot cruzada', desc: 'Pivot estilo Excel: Filas x Columnas x Metrica, con totales.' }
]

// Modulo 1 — TanStack Table v8. Tres vistas sobre el mismo dataset para
// mostrar el rango: plana, agrupada y pivot cruzada construido a mano.
// El render es 100% custom: TanStack es headless, nosotros dibujamos el DOM.
//
// Todo el modulo vive en src/tanstack/ para que sea replicable de forma
// aislada — basta copiar esta carpeta + src/data/ a tu proyecto.
export default function TanStackPage() {
  const [activeTab, setActiveTab] = useState('flat')

  const data = useMemo(
    () => rawExpedientes.map(enriquecerExpediente),
    []
  )

  const activeTabMeta = TABS.find(t => t.id === activeTab)

  return (
    <div className="module-page">
      <div className="module-page-head">
        <div className="module-page-title-row">
          <span className="module-page-eyebrow">Modulo 1</span>
          <h2>TanStack Table v8</h2>
        </div>
        <div className="module-page-subtitle">
          Tres vistas sobre {data.length} expedientes de ejemplo · headless, render custom.
        </div>
      </div>

      <nav className="tabs">
        <div className="tabs-inner">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="tab-desc">{activeTabMeta?.desc}</div>

      {activeTab === 'flat'    && <FlatTable data={data} />}
      {activeTab === 'grouped' && <GroupedTable data={data} />}
      {activeTab === 'pivot'   && <CrossTabTable data={data} />}
    </div>
  )
}
