import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table'
import { buildCrossTab } from './pivot'

const FIELD_LABELS = {
  empresa: 'Empresa',
  estado: 'Estado',
  area: 'Area',
  responsable: 'Responsable',
  mes: 'Mes'
}

// Vista pivot cruzada — tabla tipo Excel con Filas x Columnas x Metrica.
// Se preprocesan los datos con buildCrossTab y luego se renderizan con
// TanStack Table usando columnas dinamicas generadas a partir de los
// valores unicos del campo columna. Incluye totales por fila y columna.
export default function CrossTabTable({ data }) {
  const [rowField, setRowField] = useState('area')
  const [colField, setColField] = useState('estado')
  const [metric, setMetric] = useState('count')

  const pivot = useMemo(
    () => buildCrossTab(data, rowField, colField, metric),
    [data, rowField, colField, metric]
  )

  const tableData = useMemo(() => {
    return pivot.rows.map(r => {
      const row = { _rowLabel: r, _total: pivot.rowTotals[r] }
      for (const c of pivot.columns) {
        row[c] = pivot.matrix[r][c]
      }
      return row
    })
  }, [pivot])

  const columns = useMemo(() => {
    return [
      {
        accessorKey: '_rowLabel',
        header: FIELD_LABELS[rowField] || rowField,
        cell: info => <strong>{info.getValue()}</strong>,
        size: 180
      },
      ...pivot.columns.map(colVal => ({
        accessorKey: colVal,
        header: colVal,
        cell: info => {
          const v = info.getValue()
          return v === 0 ? <span className="zero">-</span> : v
        }
      })),
      {
        accessorKey: '_total',
        header: 'Total',
        cell: info => <strong className="total-cell">{info.getValue()}</strong>
      }
    ]
  }, [pivot, rowField])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const rowOptions = ['empresa', 'estado', 'area', 'responsable', 'mes']
    .filter(f => f !== colField)

  const colOptions = ['empresa', 'estado', 'area', 'responsable', 'mes']
    .filter(f => f !== rowField)

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Configuracion del pivot</div>
        <div className="panel-body">
          <div className="pivot-controls">
            <div className="control">
              <label>Filas</label>
              <select value={rowField} onChange={e => setRowField(e.target.value)}>
                {rowOptions.map(f => (
                  <option key={f} value={f}>{FIELD_LABELS[f]}</option>
                ))}
              </select>
            </div>
            <div className="control">
              <label>Columnas</label>
              <select value={colField} onChange={e => setColField(e.target.value)}>
                {colOptions.map(f => (
                  <option key={f} value={f}>{FIELD_LABELS[f]}</option>
                ))}
              </select>
            </div>
            <div className="control">
              <label>Metrica</label>
              <select value={metric} onChange={e => setMetric(e.target.value)}>
                <option value="count">Conteo de expedientes</option>
                <option value="countDistinct:empresa">Empresas distintas</option>
                <option value="countDistinct:responsable">Responsables distintos</option>
              </select>
            </div>
          </div>
          <div className="hint">
            Preguntas tipo: <em>
              {metric === 'count' && `cuantos expedientes hay por ${FIELD_LABELS[rowField]} y ${FIELD_LABELS[colField]}?`}
              {metric.startsWith('countDistinct') && `cuantos ${metric.split(':')[1]}s distintos hay por ${FIELD_LABELS[rowField]} y ${FIELD_LABELS[colField]}?`}
            </em>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="tt-table pivot-table">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th
                      key={h.id}
                      className={h.column.id === '_total' ? 'total-col' : ''}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={
                        cell.column.id === '_rowLabel' ? 'row-label' :
                        cell.column.id === '_total' ? 'total-col' : ''
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td className="row-label"><strong>Total</strong></td>
                {pivot.columns.map(c => (
                  <td key={c}><strong>{pivot.colTotals[c]}</strong></td>
                ))}
                <td className="total-col grand-total"><strong>{pivot.grandTotal}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
