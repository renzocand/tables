// Export CSV de una instancia de TanStack Table. Exporta los rows filtrados
// (no el dataset completo) para que respete lo que el usuario esta viendo.

export function tableToCsv(table) {
  const columns = table.getVisibleLeafColumns()
  const rows = table.getRowModel().rows

  const headers = columns.map(col => {
    const h = col.columnDef.header
    return typeof h === 'string' ? h : col.id
  })

  const body = rows.map(row =>
    columns.map(col => row.getValue(col.id) ?? '')
  )

  const lines = [headers, ...body]
  return lines.map(toCsvLine).join('\r\n')
}

export function downloadCsv(csv, filename) {
  // BOM UTF-8 para que Excel en Windows detecte tildes y el simbolo S/
  const bom = '﻿'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

function toCsvLine(cells) {
  return cells.map(escapeCell).join(',')
}

function escapeCell(value) {
  const s = String(value).replace(/"/g, '""')
  return `"${s}"`
}
