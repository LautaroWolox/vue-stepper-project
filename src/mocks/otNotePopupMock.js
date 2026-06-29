export const otOriginalActivitiesMock = [
  { cod: '1285', actividad: 'Instalar Acometida HFC', cantidad: '1', cmo: '5021497', descCmo: 'INSTALACION DE ACOMETIDA DOMICILIARIA' },
  { cod: '90014', actividad: 'Se instaló CM Internet y Telefonía', cantidad: '1', cmo: '0000001', descCmo: 'NO HAY CMO' },
  { cod: '90000', actividad: 'Se instaló acometida', cantidad: '1', cmo: '0000001', descCmo: 'NO HAY CMO' },
  { cod: '71010', actividad: 'Validar niveles en D-Tec', cantidad: '1', cmo: '0000001', descCmo: 'NO HAY CMO' },
  { cod: 'AS0008', actividad: 'Encontrado bien', cantidad: '1', cmo: '0000001', descCmo: 'NO HAY CMO' }
]

export const otHistorialDomicilioMock = [
  { ot: 'M00966068', creacion: '2026-06-10 17:10:02.0', cierre: '2026-06-13 12:04:01.0', acta: 'A2732', estado: 'Certificada', contra: 'NET AND WORK S.A.', red: 'N', actividades: [{ codigo: '1285', desc: 'Instalar Acometida HFC', cant: '1', ncnd: 'ND1045', est_ncnd: 'En Curso', est_act: 'S' }] },
  { ot: 'M00981724', creacion: '2026-06-13 12:53:40.0', cierre: '2026-06-13 14:23:58.0', acta: 'A2732', estado: 'Certificada', contra: 'NET AND WORK S.A.', red: 'N', actividades: [{ codigo: '90014', desc: 'Se instaló CM Internet y Telefonía', cant: '1', ncnd: '', est_ncnd: '', est_act: 'N' }] },
  { ot: 'M00981725', creacion: '2026-06-14 09:18:15.0', cierre: '2026-06-14 11:44:20.0', acta: 'A2733', estado: 'Certificada', contra: 'GREENIN S.A.S.', red: 'N', actividades: [{ codigo: '71010', desc: 'Validar niveles en D-Tec', cant: '1', ncnd: 'NC1051', est_ncnd: 'Cerrado', est_act: 'S' }] },
  { ot: 'M00981726', creacion: '2026-06-15 08:05:41.0', cierre: '2026-06-15 10:20:10.0', acta: 'A2734', estado: 'Pendiente', contra: 'BULLS', red: 'S', actividades: [{ codigo: '70502', desc: 'VALIDACION ACOMETIDA', cant: '1', ncnd: 'ND1054', est_ncnd: 'En Curso', est_act: 'N' }] },
  { ot: 'M00981727', creacion: '2026-06-16 13:30:00.0', cierre: '2026-06-16 16:02:37.0', acta: 'A2735', estado: 'Certificada', contra: 'DUNKEL', red: 'N', actividades: [{ codigo: '90000', desc: 'Se instaló acometida', cant: '1', ncnd: '', est_ncnd: '', est_act: 'S' }] },
  { ot: 'M00981728', creacion: '2026-06-17 10:12:19.0', cierre: '2026-06-17 12:35:56.0', acta: 'A2736', estado: 'Rechazada', contra: 'ADOBE CONSTRUCCIONES', red: 'N', actividades: [{ codigo: 'AS0008', desc: 'Encontrado bien', cant: '1', ncnd: 'NC1060', est_ncnd: 'Rechazado', est_act: 'N' }] }
]

export const otResultantesMock = [
  { selected: false, cod: '70501', actividad: 'ACOMETIDA SOLO INT', cantidad: '1', cmo: '5021495', descCmo: 'INST.D/ACOMETIDA HFC', regla: 'E3', aplicada: 'E3IX00001AR-70501', motivo: 'APLICACION DE REGLAS', estado: 'S', validada: 'N', accion: '' },
  { selected: false, cod: '70502', actividad: 'VALIDACION ACOMETIDA', cantidad: '1', cmo: '5021496', descCmo: 'VALIDACION TECNICA HFC', regla: 'E4', aplicada: 'E4IX00001AR-70502', motivo: 'VALIDACION AUTOMATICA', estado: 'S', validada: 'N', accion: '' },
  { selected: false, cod: '70503', actividad: 'AJUSTE DE SEÑAL', cantidad: '1', cmo: '5021498', descCmo: 'AJUSTE DE NIVEL HFC', regla: 'E5', aplicada: 'E5IX00001AR-70503', motivo: 'NIVEL FUERA DE RANGO', estado: 'S', validada: 'N', accion: '' },
  { selected: false, cod: '70504', actividad: 'REEMPLAZO CONECTOR', cantidad: '2', cmo: '5021499', descCmo: 'CAMBIO DE CONECTOR F', regla: 'E6', aplicada: 'E6IX00001AR-70504', motivo: 'MATERIAL VALIDADO', estado: 'S', validada: 'S', accion: '' },
  { selected: false, cod: '70505', actividad: 'NORMALIZACION DOMICILIO', cantidad: '1', cmo: '5021500', descCmo: 'NORMALIZACION TECNICA', regla: 'E7', aplicada: 'E7IX00001AR-70505', motivo: 'REVISION POST CIERRE', estado: 'S', validada: 'N', accion: '' }
]
