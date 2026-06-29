export const contratistasFallidasMock = [
  '0.1 DIGITAL S.R.L.', '300NET SRL', 'A22 S.R.L.', 'ABSING S.A.', 'ADOBE CONSTRUCCIONES S.R.L.', 'AGB SRL', 'AGIEDEREL S.R.L (EX ARICOR)', 'AINTECH', 'ALADEL MARKETING & SERVICES SAS', 'ALL VISION S.A.', 'ALMEFIN S.A.', 'ARES SOLEDAD', 'ARY COMUNICACIONES S.A.', 'ASOC.COOP.ELEC.Y SERV.A.C.E.R.O. L.T.D.', 'AYKO S.A.', 'AYMURAY SAS', 'BANTEL SRL', 'BAPIRAM S.A.', 'BRARTEL S.R.L.', 'CONSTRUCCIONES DEL SUR', 'MOVITEL SERVICIOS', 'OBRA CIVIL INTEGRAL', 'TECNOQUIL S.R.L.'
]

export const motivosRecuperoFallidasMock = [
  'PAGO DUPLICADO', 'DESVIO DE PARAMETRIZACION', 'SERIALIZABLES', 'CRITERIO MANO DE OBRA', 'TRASPASO DE ACTAS', 'RECLAMOS', 'DESVIO DE LEGALIZACION', 'GARANTIA', 'FALLAS AUDITORIA TECNICA', 'DUPLICIDAD DE TAREAS', 'MULTAS DERIVADAS DE LA OPERACION REGIONAL', 'SOLICITUD DESCUENTO SUPERVISOR REGIONAL', 'CORRECCION DE REGLAS', 'EXCLUIDA POR ERROR', 'PROYECTO', 'AUTORIZACIONES', 'FALTA DE SOPORTE', 'CAPEX'
]

const baseRows = [
  ['ICD12482236', '18/10/2022 15:24', 'RCD13', 'SOLIS 329', 'ROSARIO', 'SANTA FE', 'Litoral', 'ARG', 'MOVITEL SERVICIOS', '51ROR123', 'RED - COBRE - PN', 'ICD', 'Falta parametrizacion', 'S', 'DESVIO DE PARAMETRIZACION'],
  ['ICD12273196', '11/10/2022 12:50', 'RCD13', 'MAGALLANES 283', 'ROSARIO', 'SANTA FE', 'Litoral', 'ARG', 'MOVITEL SERVICIOS', '51ROR123', 'RED - COBRE - PN', 'ICD', 'Falta parametrizacion', 'S', 'DESVIO DE LEGALIZACION'],
  ['J00000000000128', '18/10/2022 11:01', '9CDS0', 'AV ALTE BROWN 1020', 'CARCARAÑA', 'SANTA FE', 'Litoral', 'ARG', 'CONSTRUCCIONES DEL SUR', 'u595116', 'Probar Instalacion', 'ICD', 'org.springframework error', 'S', 'DESVIO DE LEGALIZACION'],
  ['ICD12252822', '08/10/2022 09:24', 'RCD13', 'BERMUDEZ AV 63', 'ROSARIO', 'SANTA FE', 'Litoral', 'ARG', 'MOVITEL SERVICIOS', '51ROR118', 'RED - COBRE - PN', 'ICD', 'Falta parametrizacion', 'S', ''],
  ['707405355', '13/09/2022 10:04', 'GIACN', 'PERON JUAN DOMINGO', 'RESISTENCIA', '', 'Litoral', 'ARG', 'BAPIRAM S.A.', 'U917881', 'Instalar Acometida', 'OPEN', 'No se obtuvo provisión', 'N', ''],
  ['LMA0004849002', '08/08/2022 11:24', '9AM01', 'RICARDO GUTIERREZ', 'ING MASCHWITZ', 'BUENOS AIRES', 'AMBA', 'ARG', 'OBRA CIVIL INTEGRAL', '23SRR107', 'Service tecnico dist', 'LMA', 'Falta parametrizacion', 'S', 'DESVIO DE PARAMETRIZACION'],
  ['711397914', '03/10/2022 14:18', '9DS02', 'CHARACATO 5413', 'CORDOBA', 'CORDOBA', 'Mediterranea', 'ARG', 'CARRANZA HECT', '43CSD342', '595 - Reparar Falla', 'OPEN', 'Error al intentar instalar', 'S', ''],
  ['706020499', '13/09/2022 15:15', '9DSCP', 'CHILE 1326', 'TIGRE', 'BUENOS AIRES', 'AMBA', 'ARG', 'BRARTEL S.R.L.', '23SRD210', 'CONTROL DE CLA', 'OPEN', 'Falta parametrizacion', 'N', ''],
  ['710079515', '11/10/2022 15:46', '9DSCP', 'BILLOCH JOSE M', 'TIGRE', 'BUENOS AIRES', 'AMBA', 'ARG', 'BRARTEL S.R.L.', '23SRD210', 'CONTROL DE CLA', 'OPEN', 'Falta parametrizacion', 'S', 'DESVIO DE PARAMETRIZACION'],
  ['ICD11798207', '13/09/2022 10:06', 'RCD13', 'ISOLA BIS 141', 'ROSARIO', 'SANTA FE', 'Litoral', 'ARG', 'MOVITEL SERVICIOS', '51ROR122', 'RED - COBRE - PN', 'ICD', 'Falta parametrizacion', 'N', ''],
  ['706020506', '13/09/2022 15:16', '9DSCP', 'CHILE 1951', 'TIGRE', 'BUENOS AIRES', 'AMBA', 'ARG', 'BRARTEL S.R.L.', '23SRD210', 'CONTROL DE CLA', 'OPEN', 'Falta parametrizacion', 'N', ''],
  ['706020510', '13/09/2022 15:16', '9DSCP', 'DON SEGUNDO S', 'TIGRE', 'BUENOS AIRES', 'AMBA', 'ARG', 'BRARTEL S.R.L.', '23SRD210', 'CONTROL DE CLA', 'OPEN', 'Falta parametrizacion', 'N', '']
]

export const getRegistroOtFallidasMock = () => Array.from({ length: 72 }, (_, index) => {
  const row = baseRows[index % baseRows.length]
  const suffix = String(index + 1).padStart(3, '0')
  return {
    id: `fallida-${suffix}`,
    selected: false,
    nroOt: index < baseRows.length ? row[0] : `${row[0]}-${suffix}`,
    fechaCierre: row[1],
    codTarea: row[2],
    direccion: row[3],
    ciudad: row[4],
    provincia: row[5],
    region: row[6],
    pais: row[7],
    contratista: row[8],
    tecnicoCierre: row[9],
    actividades: row[10],
    sistemaOrigen: row[11],
    descripcionError: row[12],
    excluida: row[13],
    motivoExclusion: row[14],
    nota: index % 4 === 0 ? 'Revisar regla asociada' : '',
    incluir: row[13] === 'S' ? 'RECUPERAR' : '-',
    disabled: row[13] === 'S'
  }
})
