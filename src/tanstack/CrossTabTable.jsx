import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table'
import { buildCrossTab } from './pivot'
import { formatMonto } from '../data/expedientes'
import { tableToCsv, downloadCsv } from './exportCsv'

const FIELD_LABELS = {
  empresa: 'Empresa',
  estado: 'Estado',
  area: 'Area',
  responsable: 'Responsable',
  mes: 'Mes'
}

// Catalogo de metricas. Se factoriza aqui arriba para que agregar una nueva
// sea una sola linea. `format` define como se muestra el numero en celdas y
// totales: enteros para conteos, moneda peruana para metricas sobre monto.
const METRICS = [
  { key: 'count',                      label: 'Conteo de expedientes',    format: formatInt,   isNumeric: false },
  { key: 'countDistinct:empresa',      label: 'Empresas distintas',       format: formatInt,   isNumeric: false },
  { key: 'countDistinct:responsable',  label: 'Responsables distintos',   format: formatInt,   isNumeric: false },
  { key: 'sum:monto',                  label: 'Suma de monto (S/)',       format: formatMonto, isNumeric: true  },
  { key: 'avg:monto',                  label: 'Promedio de monto (S/)',   format: formatMonto, isNumeric: true  }
]

function formatInt(v) {
  return v === 0 ? '-' : String(v)
}

// Vista pivot cruzada — tabla tipo Excel con Filas x Columnas x Metrica.
// Se preprocesan los datos con buildCrossTab y luego se renderizan con
// TanStack Table usando columnas dinamicas generadas a partir de los
// valores unicos del campo columna. Incluye totales por fila y columna.
export default function CrossTabTable({ data }) {
  const [rowField, setRowField] = useState('area')
  const [colField, setColField] = useState('estado')
  const [metric, setMetric] = useState('count')

  const metricMeta = METRICS.find(m => m.key === metric) || METRICS[0]
  const fmt = metricMeta.format

  const pivot = useMemo(
    () => buildCrossTab(data, rowField, colField, metric),
    [data, rowField, colField, metric]
  )

  const tableData = useMemo(() => {
    return pivot.rows.map(r => {
      const row = { _rowLabel: r, _total: pivot.rowTotals[r] }
      for (const c of pivot.columns) row[c] = pivot.matrix[r][c]
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
          if (v === 0 && !metricMeta.isNumeric) return <span className="zero">-</span>
          return fmt(v)
        }
      })),
      {
        accessorKey: '_total',
        header: 'Total',
        cell: info => <strong className="total-cell">{fmt(info.getValue())}</strong>
      }
    ]
  }, [pivot, rowField, fmt, metricMeta.isNumeric])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const handleExport = () => downloadCsv(tableToCsv(table), `pivot-${rowField}-x-${colField}.csv`)

  const rowOptions = ['empresa', 'estado', 'area', 'responsable', 'mes'].filter(f => f !== colField)
  const colOptions = ['empresa', 'estado', 'area', 'responsable', 'mes'].filter(f => f !== rowField)

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
                {METRICS.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="hint">
            Pregunta actual: <em>{buildQuestion(metric, rowField, colField)}</em>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="count">
            {pivot.rows.length} filas × {pivot.columns.length} columnas
          </div>
          <button onClick={handleExport} className="btn-export">Exportar CSV</button>
        </div>

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
                  <td key={c}><strong>{fmt(pivot.colTotals[c])}</strong></td>
                ))}
                <td className="total-col grand-total"><strong>{fmt(pivot.grandTotal)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

function buildQuestion(metric, rowField, colField) {
  const rl = FIELD_LABELS[rowField]
  const cl = FIELD_LABELS[colField]
  if (metric === 'count')                return `cuantos expedientes hay por ${rl} y ${cl}?`
  if (metric === 'sum:monto')            return `cuanto suma el monto de expedientes por ${rl} y ${cl}?`
  if (metric === 'avg:monto')            return `cual es el monto promedio de expedientes por ${rl} y ${cl}?`
  if (metric.startsWith('countDistinct')) return `cuantos ${metric.split(':')[1]}s distintos hay por ${rl} y ${cl}?`
  return ''
}
