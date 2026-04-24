// Datos de ejemplo - 60 expedientes de un sistema tipo workflow documental
// Campos: id, empresa, estado, fecha, area, responsable, descripcion, monto
// El campo "monto" (en soles) es el campo NUMERICO que permite demostrar
// agregadores como sum, avg, min y max en ambos modulos.

export const EMPRESAS = [
  'Importadora del Pacifico SAC',
  'Minera Andina SA',
  'Textil Lima SRL',
  'Agroexportadora Norte SAC',
  'Constructora Central SAC',
  'Pesquera del Sur SA'
]

export const ESTADOS = ['Pendiente', 'En Revision', 'Aprobado', 'Observado', 'Archivado']

export const AREAS = ['Legal', 'Contable', 'Operaciones', 'Logistica', 'Comercial']

export const RESPONSABLES = [
  'Maria Garcia',
  'Carlos Mendoza',
  'Ana Torres',
  'Luis Perez',
  'Sofia Ramirez',
  'Jorge Castillo'
]

export const expedientes = [
  { id: 'EXP-2025-001', empresa: 'Importadora del Pacifico SAC', estado: 'Pendiente',   fecha: '2025-01-08', area: 'Legal',       responsable: 'Maria Garcia',    descripcion: 'Revision contrato importacion textiles',    monto:  28500 },
  { id: 'EXP-2025-002', empresa: 'Minera Andina SA',              estado: 'En Revision', fecha: '2025-01-12', area: 'Contable',    responsable: 'Carlos Mendoza',  descripcion: 'Conciliacion bancaria Enero',               monto:  18750 },
  { id: 'EXP-2025-003', empresa: 'Textil Lima SRL',               estado: 'Aprobado',    fecha: '2025-01-15', area: 'Operaciones', responsable: 'Ana Torres',      descripcion: 'Orden de produccion lote 2025-01',          monto:  95200 },
  { id: 'EXP-2025-004', empresa: 'Agroexportadora Norte SAC',     estado: 'Pendiente',   fecha: '2025-01-18', area: 'Logistica',   responsable: 'Luis Perez',      descripcion: 'Programacion despacho contenedor',          monto:  62400 },
  { id: 'EXP-2025-005', empresa: 'Constructora Central SAC',      estado: 'Observado',   fecha: '2025-01-22', area: 'Legal',       responsable: 'Sofia Ramirez',   descripcion: 'Levantamiento observaciones municipales',   monto:  15800 },
  { id: 'EXP-2025-006', empresa: 'Pesquera del Sur SA',           estado: 'Aprobado',    fecha: '2025-01-25', area: 'Comercial',   responsable: 'Jorge Castillo',  descripcion: 'Cotizacion exportacion harina pescado',     monto: 142000 },
  { id: 'EXP-2025-007', empresa: 'Importadora del Pacifico SAC', estado: 'En Revision', fecha: '2025-02-03', area: 'Contable',    responsable: 'Carlos Mendoza',  descripcion: 'Declaracion aduanera DUA 2025',             monto:  24600 },
  { id: 'EXP-2025-008', empresa: 'Minera Andina SA',              estado: 'Aprobado',    fecha: '2025-02-05', area: 'Legal',       responsable: 'Maria Garcia',    descripcion: 'Renovacion concesion minera',               monto:  42300 },
  { id: 'EXP-2025-009', empresa: 'Textil Lima SRL',               estado: 'Pendiente',   fecha: '2025-02-10', area: 'Comercial',   responsable: 'Ana Torres',      descripcion: 'Propuesta comercial cliente Chile',         monto:  87500 },
  { id: 'EXP-2025-010', empresa: 'Agroexportadora Norte SAC',     estado: 'En Revision', fecha: '2025-02-14', area: 'Operaciones', responsable: 'Luis Perez',      descripcion: 'Certificacion fitosanitaria paltas',        monto:  78900 },
  { id: 'EXP-2025-011', empresa: 'Constructora Central SAC',      estado: 'Aprobado',    fecha: '2025-02-18', area: 'Logistica',   responsable: 'Sofia Ramirez',   descripcion: 'Recepcion materiales obra Los Olivos',      monto:  54200 },
  { id: 'EXP-2025-012', empresa: 'Pesquera del Sur SA',           estado: 'Archivado',   fecha: '2025-02-22', area: 'Contable',    responsable: 'Jorge Castillo',  descripcion: 'Cierre contable Febrero',                   monto:   9800 },
  { id: 'EXP-2025-013', empresa: 'Importadora del Pacifico SAC', estado: 'Pendiente',   fecha: '2025-03-02', area: 'Legal',       responsable: 'Maria Garcia',    descripcion: 'Revision poder representacion',             monto:  12300 },
  { id: 'EXP-2025-014', empresa: 'Minera Andina SA',              estado: 'Observado',   fecha: '2025-03-06', area: 'Operaciones', responsable: 'Carlos Mendoza',  descripcion: 'Auditoria seguridad planta Cerro Verde',    monto: 185400 },
  { id: 'EXP-2025-015', empresa: 'Textil Lima SRL',               estado: 'Aprobado',    fecha: '2025-03-10', area: 'Contable',    responsable: 'Ana Torres',      descripcion: 'Facturacion electronica Q1',                monto:  31200 },
  { id: 'EXP-2025-016', empresa: 'Agroexportadora Norte SAC',     estado: 'Pendiente',   fecha: '2025-03-13', area: 'Legal',       responsable: 'Luis Perez',      descripcion: 'Contrato exportacion mango UE',             monto:  68500 },
  { id: 'EXP-2025-017', empresa: 'Constructora Central SAC',      estado: 'En Revision', fecha: '2025-03-17', area: 'Comercial',   responsable: 'Sofia Ramirez',   descripcion: 'Licitacion obra vial Callao',               monto: 220000 },
  { id: 'EXP-2025-018', empresa: 'Pesquera del Sur SA',           estado: 'Aprobado',    fecha: '2025-03-20', area: 'Logistica',   responsable: 'Jorge Castillo',  descripcion: 'Consolidacion carga refrigerada',           monto:  91300 },
  { id: 'EXP-2025-019', empresa: 'Importadora del Pacifico SAC', estado: 'Observado',   fecha: '2025-03-24', area: 'Operaciones', responsable: 'Maria Garcia',    descripcion: 'Inspeccion SUNAT almacen',                  monto:  45700 },
  { id: 'EXP-2025-020', empresa: 'Minera Andina SA',              estado: 'Pendiente',   fecha: '2025-03-28', area: 'Contable',    responsable: 'Carlos Mendoza',  descripcion: 'Liquidacion impuesto minero trimestral',    monto:  58900 },
  { id: 'EXP-2025-021', empresa: 'Textil Lima SRL',               estado: 'En Revision', fecha: '2025-04-01', area: 'Legal',       responsable: 'Ana Torres',      descripcion: 'Registro marca producto nuevo',             monto:   8400 },
  { id: 'EXP-2025-022', empresa: 'Agroexportadora Norte SAC',     estado: 'Aprobado',    fecha: '2025-04-04', area: 'Comercial',   responsable: 'Luis Perez',      descripcion: 'Acuerdo distribucion Ecuador',              monto: 168000 },
  { id: 'EXP-2025-023', empresa: 'Constructora Central SAC',      estado: 'Pendiente',   fecha: '2025-04-08', area: 'Contable',    responsable: 'Sofia Ramirez',   descripcion: 'Valorizacion avance obra mes 3',            monto:  76500 },
  { id: 'EXP-2025-024', empresa: 'Pesquera del Sur SA',           estado: 'Observado',   fecha: '2025-04-12', area: 'Legal',       responsable: 'Jorge Castillo',  descripcion: 'Respuesta carta OEFA',                      monto:  22100 },
  { id: 'EXP-2025-025', empresa: 'Importadora del Pacifico SAC', estado: 'Aprobado',    fecha: '2025-04-16', area: 'Logistica',   responsable: 'Maria Garcia',    descripcion: 'Autorizacion retiro mercancia Callao',      monto:  39800 },
  { id: 'EXP-2025-026', empresa: 'Minera Andina SA',              estado: 'En Revision', fecha: '2025-04-20', area: 'Operaciones', responsable: 'Carlos Mendoza',  descripcion: 'Plan de cierre mina unidad Arequipa',       monto: 145000 },
  { id: 'EXP-2025-027', empresa: 'Textil Lima SRL',               estado: 'Pendiente',   fecha: '2025-04-23', area: 'Logistica',   responsable: 'Ana Torres',      descripcion: 'Traslado inventario almacen 2',             monto:  28700 },
  { id: 'EXP-2025-028', empresa: 'Agroexportadora Norte SAC',     estado: 'Archivado',   fecha: '2025-04-27', area: 'Contable',    responsable: 'Luis Perez',      descripcion: 'Devolucion IGV exportador',                 monto:  14200 },
  { id: 'EXP-2025-029', empresa: 'Constructora Central SAC',      estado: 'Aprobado',    fecha: '2025-05-02', area: 'Operaciones', responsable: 'Sofia Ramirez',   descripcion: 'Informe avance obra Los Olivos',            monto: 112000 },
  { id: 'EXP-2025-030', empresa: 'Pesquera del Sur SA',           estado: 'Pendiente',   fecha: '2025-05-06', area: 'Comercial',   responsable: 'Jorge Castillo',  descripcion: 'Renegociacion precio contrato Japon',       monto: 198000 },
  { id: 'EXP-2025-031', empresa: 'Importadora del Pacifico SAC', estado: 'En Revision', fecha: '2025-05-10', area: 'Legal',       responsable: 'Maria Garcia',    descripcion: 'Revision terminos Incoterms 2020',          monto:  35600 },
  { id: 'EXP-2025-032', empresa: 'Minera Andina SA',              estado: 'Aprobado',    fecha: '2025-05-14', area: 'Logistica',   responsable: 'Carlos Mendoza',  descripcion: 'Programacion transporte concentrado',       monto:  83400 },
  { id: 'EXP-2025-033', empresa: 'Textil Lima SRL',               estado: 'Observado',   fecha: '2025-05-18', area: 'Contable',    responsable: 'Ana Torres',      descripcion: 'Ajuste inventario fisico-sistema',          monto:  16800 },
  { id: 'EXP-2025-034', empresa: 'Agroexportadora Norte SAC',     estado: 'Pendiente',   fecha: '2025-05-22', area: 'Operaciones', responsable: 'Luis Perez',      descripcion: 'Programacion cosecha campo El Carmen',      monto:  92500 },
  { id: 'EXP-2025-035', empresa: 'Constructora Central SAC',      estado: 'En Revision', fecha: '2025-05-26', area: 'Legal',       responsable: 'Sofia Ramirez',   descripcion: 'Adenda contrato subcontratista',            monto:  47200 },
  { id: 'EXP-2025-036', empresa: 'Pesquera del Sur SA',           estado: 'Aprobado',    fecha: '2025-05-30', area: 'Operaciones', responsable: 'Jorge Castillo',  descripcion: 'Cambio temporada pesca anchoveta',          monto: 125000 },
  { id: 'EXP-2025-037', empresa: 'Importadora del Pacifico SAC', estado: 'Pendiente',   fecha: '2025-06-03', area: 'Comercial',   responsable: 'Maria Garcia',    descripcion: 'Proyeccion ventas Q3',                      monto: 156000 },
  { id: 'EXP-2025-038', empresa: 'Minera Andina SA',              estado: 'Observado',   fecha: '2025-06-07', area: 'Legal',       responsable: 'Carlos Mendoza',  descripcion: 'Contencioso servidumbre tierras',           monto:  89500 },
  { id: 'EXP-2025-039', empresa: 'Textil Lima SRL',               estado: 'Aprobado',    fecha: '2025-06-11', area: 'Comercial',   responsable: 'Ana Torres',      descripcion: 'Feria internacional Lima Moda 2025',        monto: 215000 },
  { id: 'EXP-2025-040', empresa: 'Agroexportadora Norte SAC',     estado: 'En Revision', fecha: '2025-06-15', area: 'Contable',    responsable: 'Luis Perez',      descripcion: 'Revision costos produccion palta',          monto:  42800 },
  { id: 'EXP-2025-041', empresa: 'Constructora Central SAC',      estado: 'Pendiente',   fecha: '2025-06-19', area: 'Logistica',   responsable: 'Sofia Ramirez',   descripcion: 'Compra cemento proveedor alterno',          monto: 118000 },
  { id: 'EXP-2025-042', empresa: 'Pesquera del Sur SA',           estado: 'Aprobado',    fecha: '2025-06-23', area: 'Contable',    responsable: 'Jorge Castillo',  descripcion: 'Declaracion mensual PDT 621',               monto:  11500 },
  { id: 'EXP-2025-043', empresa: 'Importadora del Pacifico SAC', estado: 'Archivado',   fecha: '2025-06-27', area: 'Legal',       responsable: 'Maria Garcia',    descripcion: 'Archivo caso aduanero concluido',           monto:   5800 },
  { id: 'EXP-2025-044', empresa: 'Minera Andina SA',              estado: 'Pendiente',   fecha: '2025-07-01', area: 'Comercial',   responsable: 'Carlos Mendoza',  descripcion: 'Propuesta venta cobre spot',                monto: 245000 },
  { id: 'EXP-2025-045', empresa: 'Textil Lima SRL',               estado: 'En Revision', fecha: '2025-07-05', area: 'Operaciones', responsable: 'Ana Torres',      descripcion: 'Mantenimiento maquinaria telar',            monto:  67300 },
  { id: 'EXP-2025-046', empresa: 'Agroexportadora Norte SAC',     estado: 'Aprobado',    fecha: '2025-07-09', area: 'Logistica',   responsable: 'Luis Perez',      descripcion: 'Embarque frutas Rotterdam',                 monto: 102000 },
  { id: 'EXP-2025-047', empresa: 'Constructora Central SAC',      estado: 'Observado',   fecha: '2025-07-13', area: 'Contable',    responsable: 'Sofia Ramirez',   descripcion: 'Reparo observaciones auditoria',            monto:  29400 },
  { id: 'EXP-2025-048', empresa: 'Pesquera del Sur SA',           estado: 'Pendiente',   fecha: '2025-07-17', area: 'Legal',       responsable: 'Jorge Castillo',  descripcion: 'Defensa ante PRODUCE',                      monto:  38700 },
  { id: 'EXP-2025-049', empresa: 'Importadora del Pacifico SAC', estado: 'Aprobado',    fecha: '2025-07-21', area: 'Operaciones', responsable: 'Maria Garcia',    descripcion: 'Inventario almacenes cierre mes',           monto:  54800 },
  { id: 'EXP-2025-050', empresa: 'Minera Andina SA',              estado: 'En Revision', fecha: '2025-07-25', area: 'Contable',    responsable: 'Carlos Mendoza',  descripcion: 'Reclasificacion activos fijos',             monto:  72100 },
  { id: 'EXP-2025-051', empresa: 'Textil Lima SRL',               estado: 'Pendiente',   fecha: '2025-08-01', area: 'Legal',       responsable: 'Ana Torres',      descripcion: 'Proceso laboral ex-trabajador',             monto:  19600 },
  { id: 'EXP-2025-052', empresa: 'Agroexportadora Norte SAC',     estado: 'Aprobado',    fecha: '2025-08-05', area: 'Comercial',   responsable: 'Luis Perez',      descripcion: 'Contrato anual supermercado EEUU',          monto: 230000 },
  { id: 'EXP-2025-053', empresa: 'Constructora Central SAC',      estado: 'En Revision', fecha: '2025-08-09', area: 'Operaciones', responsable: 'Sofia Ramirez',   descripcion: 'Inspeccion de seguridad semanal',           monto:  43500 },
  { id: 'EXP-2025-054', empresa: 'Pesquera del Sur SA',           estado: 'Observado',   fecha: '2025-08-13', area: 'Logistica',   responsable: 'Jorge Castillo',  descripcion: 'Retraso flota costera sur',                 monto:  71800 },
  { id: 'EXP-2025-055', empresa: 'Importadora del Pacifico SAC', estado: 'Pendiente',   fecha: '2025-08-17', area: 'Contable',    responsable: 'Maria Garcia',    descripcion: 'Analisis margen ventas Julio',              monto:  26400 },
  { id: 'EXP-2025-056', empresa: 'Minera Andina SA',              estado: 'Aprobado',    fecha: '2025-08-21', area: 'Logistica',   responsable: 'Carlos Mendoza',  descripcion: 'Despacho concentrado a puerto',             monto:  96500 },
  { id: 'EXP-2025-057', empresa: 'Textil Lima SRL',               estado: 'Archivado',   fecha: '2025-08-25', area: 'Comercial',   responsable: 'Ana Torres',      descripcion: 'Cierre campana escolar 2025',               monto: 178000 },
  { id: 'EXP-2025-058', empresa: 'Agroexportadora Norte SAC',     estado: 'En Revision', fecha: '2025-09-02', area: 'Legal',       responsable: 'Luis Perez',      descripcion: 'Revision norma fitosanitaria UE',           monto:  21300 },
  { id: 'EXP-2025-059', empresa: 'Constructora Central SAC',      estado: 'Pendiente',   fecha: '2025-09-06', area: 'Comercial',   responsable: 'Sofia Ramirez',   descripcion: 'Postulacion licitacion regional',           monto: 192000 },
  { id: 'EXP-2025-060', empresa: 'Pesquera del Sur SA',           estado: 'Aprobado',    fecha: '2025-09-10', area: 'Operaciones', responsable: 'Jorge Castillo',  descripcion: 'Certificacion HACCP planta',                monto: 134000 }
]

// Extrae el mes (YYYY-MM) a partir de una fecha YYYY-MM-DD
export function getMes(fechaStr) {
  return fechaStr.slice(0, 7)
}

// Enriquece un expediente con un campo "mes" derivado de "fecha".
// Ambos modulos (tanstack y react-pivottable) usan este helper para que
// el campo "mes" este disponible como dimension del pivot.
export function enriquecerExpediente(exp) {
  return { ...exp, mes: getMes(exp.fecha) }
}

// Formatea un numero como moneda peruana. Se usa para mostrar "monto"
// en ambos modulos.
const MONEY_FMT = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0
})
export function formatMonto(v) {
  if (v == null || Number.isNaN(v)) return ''
  return MONEY_FMT.format(v)
}
