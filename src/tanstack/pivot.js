// Helper especifico del modulo TanStack: construye una matriz pivot cruzada
// a partir de un arreglo plano. Solo lo usa CrossTabTable.jsx (TanStack no
// trae pivot cruzado nativo). El modulo react-pivottable NO necesita esto
// porque la libreria lo hace internamente.

/**
 * Construye un pivot cruzado: rows x columns con una metrica.
 *
 * Formato de la metrica (string):
 *   - 'count'                  → conteo de registros
 *   - 'countDistinct:<campo>'  → conteo de valores distintos del campo
 *   - 'sum:<campo>'            → suma del campo numerico
 *   - 'avg:<campo>'            → promedio del campo numerico
 *
 * @param {Array}  data      arreglo de objetos planos
 * @param {string} rowField  campo que va en filas
 * @param {string} colField  campo que va en columnas
 * @param {string} metric    ver formato arriba
 * @returns {{ rows, columns, matrix, rowTotals, colTotals, grandTotal }}
 */
export function buildCrossTab(data, rowField, colField, metric) {
  const [metricType, metricField] = metric.split(':')

  // 1) Descubrir los valores unicos que van a ir en filas y en columnas.
  const rowSet = new Set()
  const colSet = new Set()
  for (const item of data) {
    rowSet.add(item[rowField])
    colSet.add(item[colField])
  }
  const rows = [...rowSet].sort()
  const columns = [...colSet].sort()

  // 2) Para sum y avg acumulamos dos matrices (suma y cuenta) porque el
  //    promedio se calcula al final como suma/cuenta. Para countDistinct
  //    usamos Sets temporales. Para count basta con un acumulador entero.
  const matrix = {}      // valor final que se devuelve
  const sumMatrix = {}   // solo para sum / avg
  const cntMatrix = {}   // solo para avg (y reutilizable como count)
  const setMatrix = {}   // solo para countDistinct

  for (const r of rows) {
    matrix[r] = {}; sumMatrix[r] = {}; cntMatrix[r] = {}; setMatrix[r] = {}
    for (const c of columns) {
      matrix[r][c] = 0
      sumMatrix[r][c] = 0
      cntMatrix[r][c] = 0
      setMatrix[r][c] = new Set()
    }
  }

  // 3) Poblar la matriz recorriendo el dataset una vez.
  for (const item of data) {
    const r = item[rowField]
    const c = item[colField]
    const v = item[metricField]

    if (metricType === 'countDistinct') {
      setMatrix[r][c].add(v)
    } else if (metricType === 'sum' || metricType === 'avg') {
      sumMatrix[r][c] += Number(v) || 0
      cntMatrix[r][c] += 1
    } else {
      // default: count
      matrix[r][c] += 1
    }
  }

  // 4) Consolidar la matriz final segun el tipo de metrica.
  if (metricType === 'countDistinct') {
    for (const r of rows) for (const c of columns) matrix[r][c] = setMatrix[r][c].size
  } else if (metricType === 'sum') {
    for (const r of rows) for (const c of columns) matrix[r][c] = sumMatrix[r][c]
  } else if (metricType === 'avg') {
    for (const r of rows) for (const c of columns) {
      matrix[r][c] = cntMatrix[r][c] === 0 ? 0 : sumMatrix[r][c] / cntMatrix[r][c]
    }
  }

  // 5) Totales por fila, columna y gran total.
  //    Para avg reconstruimos el promedio global como sum/count para evitar
  //    el error comun de "promediar promedios".
  const rowTotals = {}
  const colTotals = {}

  if (metricType === 'avg') {
    for (const r of rows) {
      const s = columns.reduce((a, c) => a + sumMatrix[r][c], 0)
      const n = columns.reduce((a, c) => a + cntMatrix[r][c], 0)
      rowTotals[r] = n === 0 ? 0 : s / n
    }
    for (const c of columns) {
      const s = rows.reduce((a, r) => a + sumMatrix[r][c], 0)
      const n = rows.reduce((a, r) => a + cntMatrix[r][c], 0)
      colTotals[c] = n === 0 ? 0 : s / n
    }
    const sAll = rows.reduce((a, r) => a + columns.reduce((b, c) => b + sumMatrix[r][c], 0), 0)
    const nAll = rows.reduce((a, r) => a + columns.reduce((b, c) => b + cntMatrix[r][c], 0), 0)
    const grandTotal = nAll === 0 ? 0 : sAll / nAll
    return { rows, columns, matrix, rowTotals, colTotals, grandTotal }
  }

  for (const r of rows) {
    rowTotals[r] = columns.reduce((sum, c) => sum + matrix[r][c], 0)
  }
  for (const c of columns) {
    colTotals[c] = rows.reduce((sum, r) => sum + matrix[r][c], 0)
  }
  const grandTotal = rows.reduce((sum, r) => sum + rowTotals[r], 0)

  return { rows, columns, matrix, rowTotals, colTotals, grandTotal }
}
