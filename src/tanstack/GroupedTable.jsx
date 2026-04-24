import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender
} from '@tanstack/react-table'

const FIELD_LABELS = {
  empresa: 'Empresa',
  estado: 'Estado',
  area: 'Area',
  responsable: 'Responsable',
  mes: 'Mes'
}

// Vista agrupada — usa el motor de agrupamiento y agregacion NATIVO de
// TanStack Table v8. El usuario elige un orden de agrupamiento (hasta 5
// niveles) y la tabla muestra grupos expandibles con conteos.
export default function GroupedTable({ data }) {
  const [grouping, setGrouping] = useState(['area', 'responsable'])
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
    if (!grouping.includes(field)) {
      setGrouping([...grouping, field])
    }
  }

  const removeGrouping = (field) => {
    setGrouping(grouping.filter(g => g !== field))
  }

  const availableFields = ['area', 'responsable', 'estado', 'empresa', 'mes']
    .filter(f => !grouping.includes(f))

  const totalExpedientes = data.length

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Dimensiones de agrupamiento</div>
        <div className="panel-body">
          <div className="group-chips">
            {grouping.map((g, idx) => (
              <span key={g} className="chip">
                <span className="chip-order">{idx + 1}</span>
                {FIELD_LABELS[g]}
                <button onClick={() => removeGrouping(g)} className="chip-x">×</button>
              </span>
            ))}
            {availableFields.length > 0 && (
              <select
                value=""
                onChange={e => { if (e.target.value) addGrouping(e.target.value) }}
                className="add-select"
              >
                <option value="">+ Agregar dimension</option>
                {availableFields.map(f => (
                  <option key={f} value={f}>{FIELD_LABELS[f]}</option>
                ))}
              </select>
            )}
          </div>
          <div className="hint">
            Los grupos se jerarquizan en el orden mostrado. Clic en el chip "×" para quitar.
            <br />
            Total general: <strong>{totalExpedientes} expedientes</strong>
          </div>
        </div>
      </div>

      <div className="table-wrap">
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
                  {row.getVisibleCells().map(cell => {
                    if (cell.getIsGrouped()) {
                      return (
                        <td key={cell.id} className="group-cell">
                          <button
                            onClick={row.getToggleExpandedHandler()}
                            className="expand-btn"
                          >
                            {row.getIsExpanded() ? '▼' : '▶'}
                          </button>
                          <span className="group-value">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                          <span className="group-count">
                            ({row.subRows.length})
                          </span>
                        </td>
                      )
                    }
                    if (cell.getIsAggregated()) {
                      return (
                        <td key={cell.id} className="aggregated-cell">
                          {flexRender(
                            cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    }
                    if (cell.getIsPlaceholder()) {
                      return <td key={cell.id}></td>
                    }
                    return (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
