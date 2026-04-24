import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table'
import { buildCrossTab } from './pivot'
import { formatMonto, DIMENSIONES } from '../data/expedientes'
import { tableToCsv, downloadCsv } from './exportCsv'

const LABELS = {
  empresa: 'Empresa',
  estado: 'Estado',
  area: 'Area',
  responsable: 'Responsable',
  mes: 'Mes'
}

function formatInt(v) {
  return v === 0 ? '-' : String(v)
}

// Cada metrica trae: la key que entiende buildCrossTab, la etiqueta para el
// select, el formateador de celdas, si debe mostrar "-" cuando el valor es 0,
// y el texto de la pregunta que responde el pivot.
const METRICS = [
  {
    key: 'count',
    label: 'Conteo de expedientes',
    format: formatInt,
    showZeroDash: true,
    question: (row, col) => `cuantos expedientes hay por ${row} y ${col}?`
  },
  {
    key: 'countDistinct:empresa',
    label: 'Empresas distintas',
    format: formatInt,
    showZeroDash: true,
    question: (row, col) => `cuantas empresas distintas hay por ${row} y ${col}?`
  },
  {
    key: 'countDistinct:responsable',
    label: 'Responsables distintos',
    format: formatInt,
    showZeroDash: true,
    question: (row, col) => `cuantos responsables distintos hay por ${row} y ${col}?`
  },
  {
    key: 'sum:monto',
    label: 'Suma de monto (S/)',
    format: formatMonto,
    showZeroDash: false,
    question: (row, col) => `cuanto suma el monto por ${row} y ${col}?`
  },
  {
    key: 'avg:monto',
    label: 'Promedio de monto (S/)',
    format: formatMonto,
    showZeroDash: false,
    question: (row, col) => `cual es el monto promedio por ${row} y ${col}?`
  }
]

export default function CrossTabTable({ data }) {
  const [rowField, setRowField] = useState('area')
  const [colField, setColField] = useState('estado')
  const [metricKey, setMetricKey] = useState('count')

  const metric = METRICS.find(m => m.key === metricKey)

  const pivot = useMemo(
    () => buildCrossTab(data, rowField, colField, metricKey),
    [data, rowField, colField, metricKey]
  )

  // Arma las filas del table a partir del pivot. Cada fila tiene:
  //   _rowLabel: la etiqueta de la fila
  //   _total:    el total por fila
  //   [colValue]: el valor de cada columna del pivot
  const tableData = useMemo(() => {
    return pivot.rows.map(rowValue => {
      const row = { _rowLabel: rowValue, _total: pivot.rowTotals[rowValue] }
      for (const c of pivot.columns) {
        row[c] = pivot.matrix[rowValue][c]
      }
      return row
    })
  }, [pivot])

  // Columnas dinamicas: una por cada valor unico del campo columna.
  const columns = useMemo(() => {
    const labelColumn = {
      accessorKey: '_rowLabel',
      header: LABELS[rowField] || rowField,
      cell: info => <strong>{info.getValue()}</strong>,
      size: 180
    }

    const dynamicColumns = pivot.columns.map(colValue => ({
      accessorKey: colValue,
      header: colValue,
      cell: info => {
        const v = info.getValue()
        if (v === 0 && metric.showZeroDash) return <span className="zero">-</span>
        return metric.format(v)
      }
    }))

    const totalColumn = {
      accessorKey: '_total',
      header: 'Total',
      cell: info => <strong className="total-cell">{metric.format(info.getValue())}</strong>
    }

    return [labelColumn, ...dynamicColumns, totalColumn]
  }, [pivot, rowField, metric])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const handleExport = () => {
    const csv = tableToCsv(table)
    downloadCsv(csv, `pivot-${rowField}-x-${colField}.csv`)
  }

  const rowOptions = DIMENSIONES.filter(f => f !== colField)
  const colOptions = DIMENSIONES.filter(f => f !== rowField)

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
                  <option key={f} value={f}>{LABELS[f]}</option>
                ))}
              </select>
            </div>
            <div className="control">
              <label>Columnas</label>
              <select value={colField} onChange={e => setColField(e.target.value)}>
                {colOptions.map(f => (
                  <option key={f} value={f}>{LABELS[f]}</option>
                ))}
              </select>
            </div>
            <div className="control">
              <label>Metrica</label>
              <select value={metricKey} onChange={e => setMetricKey(e.target.value)}>
                {METRICS.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="hint">
            Pregunta actual: <em>{metric.question(LABELS[rowField], LABELS[colField])}</em>
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
                  <td key={c}><strong>{metric.format(pivot.colTotals[c])}</strong></td>
                ))}
                <td className="total-col grand-total">
                  <strong>{metric.format(pivot.grandTotal)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
