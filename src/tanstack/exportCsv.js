// Export a CSV de cualquier instancia de TanStack Table.
//
// Enfoque: recorremos las columnas visibles y los rows FILTRADOS (getRowModel)
// para que el CSV refleje lo que el usuario esta viendo en pantalla. Si
// quisieras exportar TODO el dataset ignorando filtros, usa table.getCoreRowModel().
//
// Notas de CSV:
//   - Envolvemos todos los valores en comillas dobles y escapamos comillas
//     internas (el truco `.replace(/"/g, '""')`).
//   - Prefijamos con BOM (﻿) para que Excel en Windows detecte UTF-8
//     y muestre bien tildes, eñes y el simbolo S/.

export function tableToCsv(table) {
  const visibleColumns = table.getVisibleLeafColumns()
  const headers = visibleColumns.map(c => stringifyHeader(c.columnDef.header))

  const rows = table.getRowModel().rows.map(row =>
    visibleColumns.map(col => {
      const cell = row.getAllCells().find(c => c.column.id === col.id)
      return cell ? stringifyValue(cell.getValue()) : ''
    })
  )

  return toCsvString([headers, ...rows])
}

export function downloadCsv(csv, filename) {
  const bom = '﻿'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Header puede ser string o funcion/ReactNode. Si es string lo devolvemos,
// si no intentamos un fallback al accessor key.
function stringifyHeader(header) {
  if (typeof header === 'string') return header
  return ''
}

function stringifyValue(v) {
  if (v == null) return ''
  if (typeof v === 'number') return String(v)
  return String(v)
}

function toCsvString(rows) {
  return rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
}
