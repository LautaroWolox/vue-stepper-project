const pick = (list, index) => list[index % list.length]
const pad = (value, size = 2) => String(value).padStart(size, '0')

export const provinciasCertificacion = [
  'BUENOS AIRES', 'CAPITAL FEDERAL', 'CATAMARCA', 'CHACO', 'CHUBUT', 'CORDOBA', 'CORRIENTES',
  'ENTRE RIOS', 'FORMOSA', 'JUJUY', 'LA PAMPA', 'LA RIOJA', 'MENDOZA', 'MISIONES', 'NEUQUEN',
  'RIO NEGRO', 'SALTA', 'SAN JUAN', 'SAN LUIS', 'SANTA CRUZ', 'SANTA FE', 'SANTIAGO DEL ESTERO',
  'TIERRA DEL FUEGO', 'TUCUMAN', 'ARTIGAS', 'CANELONES', 'CERRO LARGO', 'COLONIA', 'DURAZNO',
  'FLORES', 'FLORIDA', 'LAVALLEJA', 'MALDONADO', 'MONTEVIDEO', 'PAYSANDU', 'RIO NEGRO UY',
  'RIVERA', 'ROCHA', 'SALTO', 'SAN JOSE', 'SORIANO', 'TACUAREMBO', 'TREINTA Y TRES', 'PARAGUAY'
]

export const getActasMock = (listas) => {
  const rows = []
  const estados = ['En Curso', 'Certificada', 'Cerrado']
  const periodos = ['Del 16/06 al 15/07', 'Del 16/05 al 15/06', 'Del 16/04 al 15/05', 'Del 16/03 al 15/04']
  const regiones = ['AMBA', 'PARAGUAY', 'INTERIOR', 'CAPITAL']

  for (let i = 1; i <= 120; i++) {
    const day = pad((i % 28) + 1)
    rows.push({
      id: i,
      nro_acta: i % 7 === 0 ? `P${pad(1100 + i, 4)}` : `A${2700 + i}`,
      nd: i % 5 === 0 ? 'SI' : 'NO',
      nc: i % 4 === 0 ? 'SI' : 'NO',
      estado: pick(estados, i),
      periodo: pick(periodos, i),
      anio: String(2024 + (i % 3)),
      fecha_crea: `2026-06-${day} ${pad(8 + (i % 10))}:${pad((i * 3) % 60)}:00`,
      fecha_cierre: i % 3 === 0 ? `2026-06-${day} ${pad(10 + (i % 8))}:${pad((i * 7) % 60)}:00` : '',
      contratista: listas.contratistas[i % listas.contratistas.length],
      pais: i % 6 === 0 ? 'PARAGUAY' : 'ARGENTINA',
      provincia: i % 6 === 0 ? 'PARAGUAY' : listas.provincias[i % listas.provincias.length],
      region: pick(regiones, i),
      tipo_contrato: listas.tipos_contrato[i % listas.tipos_contrato.length],
      sociedad: i % 6 === 0 ? 'Núcleo S.A.' : 'Telecom Argentina',
      usuario: i % 3 === 0 ? `z00${2400 + i}` : '',
      valoracion: String((i % 5) + 1)
    })
  }

  return rows
}

const makeNotaRows = (prefix) => {
  const contratistas = ['NET AND WORK S.A.', 'GREENIN S.A.S.', 'BULLS', 'DUNKEL', 'ALL VISION S.A.', 'INTERCATV S.R.L.', 'ADOBE CONSTRUCCIONES', 'CONECTAR S.R.L.', 'DIGITAL OESTE S.R.L.', 'AYKO S.A.']
  const regiones = ['AMBA', 'PARAGUAY', 'INTERIOR', 'CAPITAL', 'Provincia de Buenos Aires']
  const tipos = ['Eventos', 'WIRELESS', 'DTH', 'Eventos SMB', 'Siniestros']
  const sociedades = ['Telecom Argentina S.A.', 'Núcleo S.A.', 'La Capital Cable S.A.', 'Bersabel S.A.']
  const estados = ['En Curso', 'Cerrado']

  return Array.from({ length: 166 }, (_, index) => {
    const id = index + 1
    const provincia = index === 0 ? 'BUENOS AIRES' : pick(provinciasCertificacion, index)
    const isParaguay = provincia === 'PARAGUAY'
    const day = pad((index % 28) + 1)
    const isClosed = index % 3 !== 0
    const nroNota = index === 0 ? `${prefix}1046` : `${prefix}${pad(1020 + id, 4)}`
    const acta = index === 0 ? 'A2732' : (isParaguay ? `P${pad(1100 + id, 4)}` : `A${2400 + id}`)

    return {
      id,
      nro_nota: nroNota,
      acta,
      estado: isClosed ? 'Cerrado' : 'En Curso',
      periodo: pick(['Del 16/05 al 15/06', 'Del 16/03 al 15/04', 'Del 16/01 al 15/02', 'Del 16/06 al 15/07', 'Del 16/11 al 15/12'], index),
      anio: String(2023 + (index % 4)),
      f_crea: index === 0 ? '2026-06-25 16:30:16.0' : `${2024 + (index % 3)}-${pad((index % 12) + 1)}-${day} ${pad(8 + (index % 10))}:${pad((index * 5) % 60)}:${pad((index * 7) % 60)}.0`,
      f_cierre: isClosed ? `${2024 + (index % 3)}-${pad((index % 12) + 1)}-${day} ${pad(10 + (index % 8))}:${pad((index * 7) % 60)}:${pad((index * 9) % 60)}.0` : '',
      contra: index === 0 ? 'NET AND WORK S.A.' : pick(contratistas, index),
      pais: isParaguay ? 'PARAGUAY' : 'ARGENTINA',
      prov: provincia,
      reg: pick(regiones, index),
      tipo: pick(tipos, index),
      soc: isParaguay ? 'Núcleo S.A.' : pick(sociedades, index),
      usu: isClosed ? `z00${2450 + index}` : '',
      val: String((index % 5) + 1)
    }
  })
}

export const getNotasCreditoMock = () => makeNotaRows('NC')
export const getNotasDebitoMock = () => makeNotaRows('ND')
