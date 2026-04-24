import { useMemo, useState } from 'react'
import { DndContext, useDroppable, closestCorners } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { buildCrossTab } from './pivot'
import { formatMonto } from '../data/expedientes'

const LABELS = {
  area: 'Area',
  responsable: 'Responsable',
  estado: 'Estado',
  empresa: 'Empresa',
  mes: 'Mes',
  monto: 'Monto'
}

const PANEL_IDS = ['available', 'rows', 'cols', 'vals']

const PANEL_TITLES = {
  available: 'Disponibles',
  rows: 'Filas',
  cols: 'Columnas',
  vals: 'Valores'
}

// Replica la UX de react-pivottable sobre TanStack + dnd-kit: 4 zonas
// arrastrables donde el usuario suelta los campos y el pivot se arma
// automaticamente. Para mantenerlo simple:
//   - Solo se usa el primer campo de Filas y el primer campo de Columnas.
//   - Si "monto" esta en Valores, la metrica pasa a sum:monto; si no, count.
export default function PivotDndTable({ data }) {
  const [panels, setPanels] = useState({
    available: ['responsable', 'empresa', 'mes'],
    rows: ['area'],
    cols: ['estado'],
    vals: ['monto']
  })

  const rowField = panels.rows[0]
  const colField = panels.cols[0]
  const metric = panels.vals.includes('monto') ? 'sum:monto' : 'count'
  const readyToPivot = Boolean(rowField && colField)

  const pivot = useMemo(() => {
    if (!readyToPivot) return null
    return buildCrossTab(data, rowField, colField, metric)
  }, [data, rowField, colField, metric, readyToPivot])

  const findPanelOf = (fieldId) => {
    for (const panel of PANEL_IDS) {
      if (panels[panel].includes(fieldId)) return panel
    }
    return null
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // over.id puede ser el id de otro campo o el id de una zona (cuando
    // se suelta sobre el espacio vacio del panel).
    const from = findPanelOf(activeId)
    const to = PANEL_IDS.includes(overId) ? overId : findPanelOf(overId)
    if (!from || !to) return

    if (from === to) {
      // Soltar sobre el mismo panel: solo reordenar si hay un item como destino.
      if (PANEL_IDS.includes(overId)) return
      const oldIndex = panels[from].indexOf(activeId)
      const newIndex = panels[from].indexOf(overId)
      if (oldIndex === newIndex) return
      setPanels({ ...panels, [from]: arrayMove(panels[from], oldIndex, newIndex) })
      return
    }

    // Mover entre paneles
    const newFrom = panels[from].filter(id => id !== activeId)
    const newTo = [...panels[to], activeId]
    setPanels({ ...panels, [from]: newFrom, [to]: newTo })
  }

  return (
    <div>
      <div className="hint" style={{ marginBottom: 12 }}>
        Arrastra campos entre las 4 zonas. Filas y Columnas usan el primer campo
        que sueltes. Si <code>monto</code> esta en Valores, la metrica pasa a
        <strong> suma</strong>; si no, es <strong>conteo</strong>.
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="dnd-grid">
          {PANEL_IDS.map(id => (
            <DropZone key={id} id={id} title={PANEL_TITLES[id]} items={panels[id]} />
          ))}
        </div>
      </DndContext>

      <div className="hint" style={{ marginTop: 12 }}>
        Metrica actual:{' '}
        <strong>{metric === 'sum:monto' ? 'Suma de monto (S/)' : 'Conteo de expedientes'}</strong>
      </div>

      {readyToPivot ? (
        <PivotView pivot={pivot} metric={metric} rowLabel={LABELS[rowField]} />
      ) : (
        <div className="hint" style={{ marginTop: 12 }}>
          Falta al menos un campo en <strong>Filas</strong> y en <strong>Columnas</strong> para ver el pivot.
        </div>
      )}
    </div>
  )
}

// Cada panel es una zona droppable (useDroppable) que ademas contiene una
// lista ordenable (SortableContext).
function DropZone({ id, title, items }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`dnd-panel ${isOver ? 'dnd-panel--over' : ''}`}
    >
      <div className="dnd-panel-title">{title}</div>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="dnd-panel-list">
          {items.length === 0 ? (
            <div className="dnd-empty">(vacio — suelta un campo aqui)</div>
          ) : (
            items.map(itemId => <DraggableField key={itemId} id={itemId} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function DraggableField({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <span
      ref={setNodeRef}
      style={style}
      className="chip"
      {...attributes}
      {...listeners}
    >
      {LABELS[id] ?? id}
    </span>
  )
}

// Render simple del pivot (plain HTML table) — no usa TanStack porque la
// complejidad interesante de este tab vive en las 4 zonas, no en la tabla.
function PivotView({ pivot, metric, rowLabel }) {
  const format = metric === 'sum:monto'
    ? formatMonto
    : (v) => (v === 0 ? '-' : String(v))

  return (
    <div className="table-wrap" style={{ marginTop: 12 }}>
      <div className="table-scroll">
        <table className="tt-table pivot-table">
          <thead>
            <tr>
              <th>{rowLabel}</th>
              {pivot.columns.map(c => <th key={c}>{c}</th>)}
              <th className="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            {pivot.rows.map(r => (
              <tr key={r}>
                <td className="row-label"><strong>{r}</strong></td>
                {pivot.columns.map(c => (
                  <td key={c}>{format(pivot.matrix[r][c])}</td>
                ))}
                <td className="total-col">
                  <strong>{format(pivot.rowTotals[r])}</strong>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td className="row-label"><strong>Total</strong></td>
              {pivot.columns.map(c => (
                <td key={c}><strong>{format(pivot.colTotals[c])}</strong></td>
              ))}
              <td className="total-col grand-total">
                <strong>{format(pivot.grandTotal)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
