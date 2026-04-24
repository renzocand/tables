// Construye un pivot cruzado: matriz rows x columns con la metrica aplicada.
//
// metric acepta:
//   'count'                     cuenta filas
//   'countDistinct:<campo>'     cuenta valores distintos del campo
//   'sum:<campo>'               suma del campo numerico
//   'avg:<campo>'               promedio del campo numerico
//
// Para avg no se puede promediar promedios al calcular totales: se
// acumula sum y count por separado y se divide al final.

export function buildCrossTab(data, rowField, colField, metric) {
  const [kind, field] = metric.split(':')

  // Valores unicos de filas y columnas
  const rowSet = new Set()
  const colSet = new Set()
  for (const item of data) {
    rowSet.add(item[rowField])
    colSet.add(item[colField])
  }
  const rows = [...rowSet].sort()
  const columns = [...colSet].sort()

  // Acumuladores por celda
  const sum = makeMatrix(rows, columns, 0)
  const count = makeMatrix(rows, columns, 0)
  const distinct = kind === 'countDistinct' ? makeSetMatrix(rows, columns) : null

  for (const item of data) {
    const r = item[rowField]
    const c = item[colField]

    count[r][c] += 1

    if (kind === 'sum' || kind === 'avg') {
      const n = Number(item[field]) || 0
      sum[r][c] += n
    }

    if (kind === 'countDistinct') {
      distinct[r][c].add(item[field])
    }
  }

  // Valor final de cada celda
  const matrix = {}
  for (const r of rows) {
    matrix[r] = {}
    for (const c of columns) {
      if (kind === 'countDistinct') {
        matrix[r][c] = distinct[r][c].size
      } else if (kind === 'sum') {
        matrix[r][c] = sum[r][c]
      } else if (kind === 'avg') {
        matrix[r][c] = count[r][c] === 0 ? 0 : sum[r][c] / count[r][c]
      } else {
        matrix[r][c] = count[r][c]
      }
    }
  }

  // Totales
  const rowTotals = {}
  const colTotals = {}
  let grandTotal = 0

  if (kind === 'avg') {
    // Para promedios: recalcular con sum/count agregados
    for (const r of rows) {
      let s = 0
      let n = 0
      for (const c of columns) {
        s += sum[r][c]
        n += count[r][c]
      }
      rowTotals[r] = n === 0 ? 0 : s / n
    }

    for (const c of columns) {
      let s = 0
      let n = 0
      for (const r of rows) {
        s += sum[r][c]
        n += count[r][c]
      }
      colTotals[c] = n === 0 ? 0 : s / n
    }

    let totalSum = 0
    let totalCount = 0
    for (const r of rows) {
      for (const c of columns) {
        totalSum += sum[r][c]
        totalCount += count[r][c]
      }
    }
    grandTotal = totalCount === 0 ? 0 : totalSum / totalCount
  } else {
    // count, countDistinct, sum: basta con sumar las celdas
    for (const r of rows) {
      let total = 0
      for (const c of columns) total += matrix[r][c]
      rowTotals[r] = total
    }

    for (const c of columns) {
      let total = 0
      for (const r of rows) total += matrix[r][c]
      colTotals[c] = total
    }

    for (const r of rows) grandTotal += rowTotals[r]
  }

  return { rows, columns, matrix, rowTotals, colTotals, grandTotal }
}

function makeMatrix(rows, columns, initialValue) {
  const m = {}
  for (const r of rows) {
    m[r] = {}
    for (const c of columns) m[r][c] = initialValue
  }
  return m
}

function makeSetMatrix(rows, columns) {
  const m = {}
  for (const r of rows) {
    m[r] = {}
    for (const c of columns) m[r][c] = new Set()
  }
  return m
}
