const OT_COLUMNS = [
  { field: 'nroot', label: 'NRO. OT', visible: true },
  { field: 'estadoOt', label: 'ESTADO OT', visible: true },
  { field: 'fechaMod', label: 'FECHA ULT. MOD', visible: true },
  { field: 'tecnico', label: 'TÉCNICO', visible: true },
  { field: 'almacen', label: 'ALMACÉN', visible: true },
  { field: 'direccion', label: 'DIRECCIÓN', visible: true },
  { field: 'codTarea', label: 'COD TAREA', visible: true }
]

const DESCARGADOS_COLUMNS = [
  { field: 'nroot', label: 'NRO OT', visible: true },
  { field: 'estadoFm', label: 'ESTADO FM', visible: true },
  { field: 'codMaterial', label: 'COD MATER', visible: true },
  { field: 'nombreMat', label: 'NOMBRE M.', visible: true },
  { field: 'cantidad', label: 'CANTIDAD', visible: true },
  { field: 'almacen', label: 'ALMACÉN', visible: true },
  { field: 'fechaDesc', label: 'FECHA DES', visible: true }
]

const pick = (list, index) => list[index % list.length]
const pad = (value, size = 2) => String(value).padStart(size, '0')

export const getMaterialesColumns = (type) => {
  const source = type === 'OT' ? OT_COLUMNS : DESCARGADOS_COLUMNS
  return source.map((column) => ({ ...column }))
}

export const getMaterialesMockData = () => {
  return Array.from({ length: 150 }).map((_, index) => {
    const day = String((index % 28) + 1).padStart(2, '0')

    return {
      id: index,
      nroot: `OT-${1000 + index}`,
      estadoOt: pick(['PENDIENTE', 'CERRADO', 'EN GESTIÓN', 'VALIDADO'], index),
      estadoFm: pick(['ACTIVO', 'PENDIENTE', 'ERROR', 'PROCESADO'], index),
      fechaMod: `2026-06-${day}`,
      tecnico: `Técnico ${index % 8}`,
      almacen: `A-${index % 5}`,
      direccion: `Calle ${index} Nro ${index * 10}`,
      codTarea: `TSK-${pad(index, 4)}`,
      codMaterial: `MAT-${pad(index, 5)}`,
      nombreMat: pick(['Cable Coaxial RG6', 'ONT Fibra', 'Splitter Óptico', 'Conector F', 'Módem HFC', 'Fuente 12V'], index),
      cantidad: (index % 12) + 1,
      fechaDesc: `2026-06-${day}`
    }
  })
}

const includesInsensitive = (value, filter) => {
  if (!filter) return true
  return String(value || '').toLowerCase().includes(String(filter).toLowerCase())
}

export const searchMaterialesMock = (type, filters = {}) => {
  return getMaterialesMockData().filter((row) => {
    return (
      includesInsensitive(row.nroot, filters.ot) &&
      includesInsensitive(row.tecnico, filters.tecnico) &&
      includesInsensitive(row.almacen, filters.almacen)
    )
  })
}
