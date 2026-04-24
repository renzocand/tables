import { useMemo, useState } from 'react'
import FlatTable from './FlatTable'
import GroupedTable from './GroupedTable'
import CrossTabTable from './CrossTabTable'
import { expedientes, enriquecerExpediente } from '../data/expedientes'

const TABS = [
  { id: 'flat',    label: '1. Vista plana',         desc: 'Listado simple tal como luce hoy en el sistema.' },
  { id: 'grouped', label: '2. Vista agrupada',      desc: 'Agrupamiento jerarquico con conteos y suma de monto.' },
  { id: 'pivot',   label: '3. Vista pivot cruzada', desc: 'Pivot estilo Excel: Filas x Columnas x Metrica, con totales.' }
]

export default function TanStackPage() {
  const [activeTab, setActiveTab] = useState('flat')
  const data = useMemo(() => expedientes.map(enriquecerExpediente), [])
  const currentTab = TABS.find(t => t.id === activeTab)

  return (
    <div className="module-page">
      <div className="module-page-head">
        <div className="module-page-title-row">
          <span className="module-page-eyebrow">Modulo 1</span>
          <h2>TanStack Table v8</h2>
        </div>
        <div className="module-page-subtitle">
          {data.length} expedientes · headless, render custom.
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

      <div className="tab-desc">{currentTab?.desc}</div>

      {activeTab === 'flat'    && <FlatTable data={data} />}
      {activeTab === 'grouped' && <GroupedTable data={data} />}
      {activeTab === 'pivot'   && <CrossTabTable data={data} />}
    </div>
  )
}
