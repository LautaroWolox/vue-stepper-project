const pad = (value, size = 2) => String(value).padStart(size, '0')

const pick = (list, index) => list[index % list.length]
const includesInsensitive = (value, filter) => {
  if (!filter) return true
  return String(value || '').toLowerCase().includes(String(filter).toLowerCase())
}

const regiones = ['AMBA', 'CAPITAL', 'INTERIOR']
const subRegiones = ['CABA', 'GBA NORTE', 'GBA SUR', 'LA PLATA', 'MAR DEL PLATA']
const centros = ['PNT1', 'PNL1', 'OC15', 'CBA1', 'MDQ1']
const almacenes = ['OC15', 'OC01', 'A-0', 'A-1', 'A-2']
const tecnicos = ['Técnico 0', 'Técnico 1', 'Técnico 2', 'Técnico 3', 'Técnico 4', 'Técnico 5']
const operadores = ['JOPARA-Nombre JOPARA-Apellido', 'MBUSON-Nombre MBUSON-Apellido', 'FMUSER-Nombre FMUSER-Apellido', 'ADMIN-Nombre ADMIN-Apellido']
const errores = [
  'No existen equivalencia de material recupero para',
  'No existe el material 000000001000102890 en el centro PNT1',
  'No existe el material 00000000110100337 en el centro PNT1',
  'Posting only possible in periods 2026/05 and 2026/04 in company code P001',
  'Material sin validación para el almacén informado',
  'Centro logístico no habilitado para descarga'
]

export const getOtsPendientesGestionMock = () => {
  return Array.from({ length: 120 }, (_, index) => {
    const id = index + 1
    const day = pad((index % 28) + 1)
    return {
      id,
      nroOt: `OT-${100000 + id}`,
      estadoOt: pick(['PENDIENTE', 'EN GESTIÓN', 'CERRADO'], index),
      fechaUltMod: `2026-06-${day}`,
      horaUltMod: `${pad(8 + (index % 10))}:${pad((index * 7) % 60)}:00`,
      tecnico: pick(tecnicos, index),
      superior: pick(['Supervisor Norte', 'Supervisor Sur', 'Supervisor AMBA'], index),
      centro: pick(centros, index),
      almacen: pick(almacenes, index),
      direccion: `Calle ${100 + id} Nro ${id * 12}`,
      codTarea: `TSK-${pad(id, 4)}`,
      region: pick(regiones, index),
      subRegion: pick(subRegiones, index)
    }
  })
}

export const searchOtsPendientesGestionMock = (filters = {}) => {
  return getOtsPendientesGestionMock().filter((row) => {
    return (
      includesInsensitive(row.region, filters.region) &&
      includesInsensitive(row.subRegion, filters.subRegion) &&
      includesInsensitive(row.centro, filters.centro) &&
      includesInsensitive(row.almacen, filters.almacen) &&
      includesInsensitive(row.tecnico, filters.tecnico) &&
      includesInsensitive(row.nroOt, filters.ot || filters.nroOt)
    )
  })
}

export const getErroresGestionSucursalMock = () => {
  return Array.from({ length: 90 }, (_, index) => {
    const id = index + 1
    const day = pad((index % 28) + 1)
    return {
      id,
      nroSistema: `JOP${68800000 + id}`,
      nroSerie: index % 2 === 0 ? `0172830${pad(id, 4)}` : `1936ADB10LT${pad(id, 5)}`,
      fechaDescarga: `${day}/06/2026 ${pad(8 + (index % 10))}:${pad((index * 5) % 60)}:51`,
      operadorDescarga: pick(operadores, index),
      operadorUltMod: pick(operadores, index + 1),
      fechaUltMod: `${day}/06/2026 ${pad(8 + (index % 10))}:${pad((index * 5 + 1) % 60)}:51`,
      pais: pick(['PY', 'ARG', 'UY'], index),
      codigoPostal: pick(['111', '1425', '1900', '5000'], index),
      centro: pick(centros, index),
      almacen: pick(almacenes, index),
      descripcionError: pick(errores, index)
    }
  })
}

export const searchErroresGestionSucursalMock = (filters = {}) => {
  return getErroresGestionSucursalMock().filter((row) => {
    return (
      includesInsensitive(row.pais, filters.pais) &&
      includesInsensitive(row.nroSistema, filters.nroSistema) &&
      includesInsensitive(row.nroSerie, filters.nroSerie)
    )
  })
}

export const getErroresGestionMock = () => {
  return Array.from({ length: 140 }, (_, index) => {
    const id = index + 1
    const day = pad((index % 28) + 1)
    return {
      id,
      nroOt: `OT-${200000 + id}`,
      estadoFm: pick(['ERROR', 'PENDIENTE', 'VALIDADO', 'RECHAZADO'], index),
      codMaterial: `MAT-${pad(id, 6)}`,
      nombreMaterial: pick(['Cable Coaxial RG6', 'ONT Fibra', 'Splitter Óptico', 'Conector F', 'Fuente 12V', 'Módem HFC'], index),
      tipoMaterial: pick(['RECUPERO', 'INSTALACIÓN', 'CAMBIO', 'DESCARGA'], index),
      cantidad: String((index % 8) + 1),
      tipoDescarga: pick(['AUTOMÁTICA', 'MANUAL', 'MASIVA'], index),
      descripcionError: pick(errores, index),
      codCentro: `C-${pad((index % 20) + 1, 3)}`,
      centro: pick(centros, index),
      codAlmacen: `ALM-${pad((index % 15) + 1, 3)}`,
      almacen: pick(almacenes, index),
      operadorDescarga: pick(operadores, index),
      fechaDescarga: `${day}/06/2026 ${pad(8 + (index % 10))}:${pad((index * 3) % 60)}:00`,
      operadorUltMod: pick(operadores, index + 1),
      fechaUltMod: `${day}/06/2026 ${pad(9 + (index % 9))}:${pad((index * 4) % 60)}:00`,
      codigoPostal: pick(['111', '1425', '1900', '5000', '7600'], index),
      materialValidado: pick(['SI', 'NO', 'PENDIENTE'], index),
      codTarea: `TSK-${pad(id, 4)}`,
      region: pick(regiones, index),
      subRegion: pick(subRegiones, index),
      nroSerie: `SER-${pad(id, 6)}`
    }
  })
}

export const searchErroresGestionMock = (filters = {}) => {
  return getErroresGestionMock().filter((row) => {
    return (
      includesInsensitive(row.region, filters.region) &&
      includesInsensitive(row.subRegion, filters.subRegion) &&
      includesInsensitive(row.centro, filters.centro) &&
      includesInsensitive(row.almacen, filters.almacen) &&
      includesInsensitive(row.nroOt, filters.nroOt) &&
      includesInsensitive(row.codMaterial, filters.codigoMaterial) &&
      includesInsensitive(row.nroSerie, filters.nroSerie)
    )
  })
}
