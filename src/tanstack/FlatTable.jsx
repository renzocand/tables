import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table'
import { formatMonto } from '../data/expedientes'
import { tableToCsv, downloadCsv } from './exportCsv'

// Vista plana — tabla simple con ordenamiento y filtrado global.
// Representa el caso basico: solo listado, sin analisis.
export default function FlatTable({ data }) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(() => [
    { accessorKey: 'id',          header: 'ID',          size: 110 },
    { accessorKey: 'empresa',     header: 'Empresa',     size: 220 },
    { accessorKey: 'estado',      header: 'Estado',      size: 120 },
    { accessorKey: 'fecha',       header: 'Fecha',       size: 110 },
    { accessorKey: 'area',        header: 'Area',        size: 120 },
    { accessorKey: 'responsable', header: 'Responsable', size: 160 },
    {
      accessorKey: 'monto',
      header: 'Monto (S/)',
      size: 130,
      cell: info => <span style={{ textAlign: 'right', display: 'block' }}>{formatMonto(info.getValue())}</span>
    },
    { accessorKey: 'descripcion', header: 'Descripcion', size: 320 }
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  const handleExport = () => {
    downloadCsv(tableToCsv(table), 'expedientes.csv')
  }

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="Filtrar en todos los campos..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="filter-input"
        />
        <div className="count">{table.getFilteredRowModel().rows.length} expedientes</div>
        <button onClick={handleExport} className="btn-export">Exportar CSV</button>
      </div>

      <div className="table-scroll">
        <table className="tt-table">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    style={{ width: h.column.getSize() }}
                    onClick={h.column.getToggleSortingHandler()}
                    className={h.column.getCanSort() ? 'sortable' : ''}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ▲', desc: ' ▼' }[h.column.getIsSorted()] || ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
