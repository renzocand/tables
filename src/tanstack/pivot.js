// Helper especifico del modulo TanStack: construye una matriz pivot cruzada
// a partir de un arreglo plano. Solo lo usa CrossTabTable.jsx (TanStack no
// trae pivot cruzado nativo). El modulo react-pivottable NO necesita esto
// porque la libreria lo hace internamente.

/**
 * Construye un pivot cruzado: rows x columns con una metrica.
 * @param {Array} data - arreglo de objetos planos
 * @param {string} rowField - campo que va en filas
 * @param {string} colField - campo que va en columnas
 * @param {string} metric - 'count' | 'countDistinct:<campo>'
 * @returns {{ rows, columns, matrix, rowTotals, colTotals, grandTotal }}
 */
export function buildCrossTab(data, rowField, colField, metric) {
  const [metricType, metricField] = metric.split(':')

  const rowSet = new Set()
  const colSet = new Set()

  for (const item of data) {
    rowSet.add(item[rowField])
    colSet.add(item[colField])
  }

  const rows = [...rowSet].sort()
  const columns = [...colSet].sort()

  // Inicializar matriz
  const matrix = {}
  for (const r of rows) {
    matrix[r] = {}
    for (const c of columns) {
      matrix[r][c] = metricType === 'countDistinct' ? new Set() : 0
    }
  }

  // Poblar matriz
  for (const item of data) {
    const r = item[rowField]
    const c = item[colField]
    if (metricType === 'countDistinct') {
      matrix[r][c].add(item[metricField])
    } else {
      matrix[r][c] += 1
    }
  }

  // Convertir sets de countDistinct a numero
  if (metricType === 'countDistinct') {
    for (const r of rows) {
      for (const c of columns) {
        matrix[r][c] = matrix[r][c].size
      }
    }
  }

  const rowTotals = {}
  for (const r of rows) {
    rowTotals[r] = columns.reduce((sum, c) => sum + matrix[r][c], 0)
  }

  const colTotals = {}
  for (const c of columns) {
    colTotals[c] = rows.reduce((sum, r) => sum + matrix[r][c], 0)
  }

  const grandTotal = rows.reduce((sum, r) => sum + rowTotals[r], 0)

  return { rows, columns, matrix, rowTotals, colTotals, grandTotal }
}
