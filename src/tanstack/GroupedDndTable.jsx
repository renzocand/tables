import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender
} from '@tanstack/react-table'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatMonto, DIMENSIONES } from '../data/expedientes'
import { tableToCsv, downloadCsv } from './exportCsv'

const LABELS = {
  empresa: 'Empresa',
  estado: 'Estado',
  area: 'Area',
  responsable: 'Responsable',
  mes: 'Mes'
}

// Mismo motor de agrupacion que GroupedTable. La unica diferencia es que
// las chips de dimensiones se pueden arrastrar para cambiar la jerarquia.
// Requiere @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities.
export default function GroupedDndTable({ data }) {
  const [grouping, setGrouping] = useState(['area', 'responsable', 'estado'])
  const [expanded, setExpanded] = useState({})

  const columns = useMemo(() => [
    { accessorKey: 'empresa',     header: 'Empresa',     aggregatedCell: () => null },
    { accessorKey: 'estado',      header: 'Estado',      aggregatedCell: () => null },
    { accessorKey: 'area',        header: 'Area',        aggregatedCell: () => null },
    { accessorKey: 'responsable', header: 'Responsable', aggregatedCell: () => null },
    { accessorKey: 'mes',         header: 'Mes',         aggregatedCell: () => null },
    {
      accessorKey: 'id',
      header: '# Expedientes',
      aggregationFn: 'count',
      aggregatedCell: info => <strong>{info.getValue()}</strong>,
      cell: info => info.getValue()
    },
    {
      accessorKey: 'monto',
      header: 'Monto (S/)',
      aggregationFn: 'sum',
      aggregatedCell: info => <strong>{formatMonto(info.getValue())}</strong>,
      cell: info => formatMonto(info.getValue())
    }
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { grouping, expanded },
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })

  const addGrouping = (field) => {
    if (!grouping.includes(field)) setGrouping([...grouping, field])
  }

  const removeGrouping = (field) => {
    setGrouping(grouping.filter(g => g !== field))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = grouping.indexOf(active.id)
    const newIndex = grouping.indexOf(over.id)
    setGrouping(arrayMove(grouping, oldIndex, newIndex))
  }

  const handleExport = () => {
    const csv = tableToCsv(table)
    downloadCsv(csv, 'expedientes-agrupado-dnd.csv')
  }

  const availableFields = DIMENSIONES.filter(f => !grouping.includes(f))

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Dimensiones de agrupamiento (arrastrables)</div>
        <div className="panel-body">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={grouping} strategy={horizontalListSortingStrategy}>
              <div className="group-chips">
                {grouping.map((g, idx) => (
                  <SortableChip
                    key={g}
                    id={g}
                    label={LABELS[g]}
                    order={idx + 1}
                    onRemove={() => removeGrouping(g)}
                  />
                ))}
                {availableFields.length > 0 && (
                  <select
                    value=""
                    onChange={e => { if (e.target.value) addGrouping(e.target.value) }}
                    className="add-select"
                  >
                    <option value="">+ Agregar dimension</option>
                    {availableFields.map(f => (
                      <option key={f} value={f}>{LABELS[f]}</option>
                    ))}
                  </select>
                )}
              </div>
            </SortableContext>
          </DndContext>

          <div className="hint">
            Arrastra las chips para cambiar el orden de la jerarquia. El numero
            indica el nivel actual.
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="count">{data.length} expedientes · {grouping.length} niveles</div>
          <button onClick={handleExport} className="btn-export">Exportar CSV</button>
        </div>

        <div className="table-scroll">
          <table className="tt-table">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={row.getIsGrouped() ? `group-row group-depth-${row.depth}` : ''}
                >
                  {row.getVisibleCells().map(cell => (
                    <GroupedCell key={cell.id} cell={cell} row={row} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Chip arrastrable. dnd-kit expone:
//   attributes / listeners -> eventos y accesibilidad del handle
//   setNodeRef             -> ref del nodo movible
//   transform / transition -> estilos CSS que animan el arrastre
function SortableChip({ id, label, order, onRemove }) {
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
    <span ref={setNodeRef} style={style} className="chip" {...attributes} {...listeners}>
      <span className="chip-order">{order}</span>
      {label}
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={onRemove}
        className="chip-x"
      >
        ×
      </button>
    </span>
  )
}

function GroupedCell({ cell, row }) {
  if (cell.getIsGrouped()) {
    return (
      <td className="group-cell">
        <button onClick={row.getToggleExpandedHandler()} className="expand-btn">
          {row.getIsExpanded() ? '▼' : '▶'}
        </button>
        <span className="group-value">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </span>
        <span className="group-count">({row.subRows.length})</span>
      </td>
    )
  }

  if (cell.getIsAggregated()) {
    const render = cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell
    return (
      <td className="aggregated-cell">
        {flexRender(render, cell.getContext())}
      </td>
    )
  }

  if (cell.getIsPlaceholder()) {
    return <td />
  }

  return (
    <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
  )
}
