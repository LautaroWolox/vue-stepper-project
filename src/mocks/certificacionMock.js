export const getActasMock = (listas) => {
  const rows = []

  for (let i = 1; i <= 60; i++) {
    rows.push({
      id: i,
      nro_acta: `A${2700 + i}`,
      nd: 'NO',
      nc: 'NO',
      estado: 'En Curso',
      periodo: 'Del 16/06 al 15/07',
      anio: '2026',
      fecha_crea: '2026-06-26 15:12:00',
      fecha_cierre: '',
      contratista: listas.contratistas[i % 5],
      pais: 'ARGENTINA',
      provincia: 'BUENOS AIRES',
      region: 'AMBA',
      tipo_contrato: listas.tipos_contrato[i % 3],
      sociedad: 'Telecom Argentina',
      usuario: '',
      valoracion: ''
    })
  }

  return rows
}

export const getNotasCreditoMock = () => [
  { id: 1, nro_nota: 'NC1046', acta: 'A2732', estado: 'En Curso', periodo: 'Del 16/05 al 15/06', anio: '2026', f_crea: '2026-06-25 16:30', f_cierre: '', contra: 'NET AND WORK S.A.', pais: 'ARGENTINA', prov: 'BUENOS AIRES', reg: 'AMBA', tipo: 'Eventos', soc: 'Telecom Argentina S.A.', usu: '', val: '2' },
  { id: 2, nro_nota: 'NC1043', acta: 'A2711', estado: 'Cerrado', periodo: 'Del 16/03 al 15/04', anio: '2026', f_crea: '2026-04-17 11:46', f_cierre: '2026-04-17 11:47', contra: 'GREENIN S.A.S.', pais: 'ARGENTINA', prov: 'CAPITAL FEDERAL', reg: 'AMBA', tipo: 'Eventos', soc: 'Telecom Argentina S.A.', usu: 'z002456', val: '1' },
  { id: 3, nro_nota: 'NCP011', acta: 'P0125', estado: 'En Curso', periodo: 'Del 16/01 al 15/02', anio: '2026', f_crea: '2026-03-06 13:40', f_cierre: '', contra: 'BULLS', pais: 'PARAGUAY', prov: 'PARAGUAY', reg: 'PARAGUAY', tipo: 'WIRELESS', soc: 'Núcleo S.A.', usu: '', val: '4' },
  { id: 4, nro_nota: 'NCP007', acta: 'P0119', estado: 'Cerrado', periodo: 'Del 16/01 al 15/02', anio: '2026', f_crea: '2026-03-05 10:18', f_cierre: '2026-03-05 17:19', contra: 'DUNKEL', pais: 'PARAGUAY', prov: 'PARAGUAY', reg: 'PARAGUAY', tipo: 'DTH', soc: 'Núcleo S.A.', usu: 'z002525', val: '3' }
]

export const getNotasDebitoMock = () => [
  { id: 1, nro_nota: 'ND1046', acta: 'A2732', estado: 'En Curso', periodo: 'Del 16/05 al 15/06', anio: '2026', f_crea: '2026-06-25 16:30', f_cierre: '', contra: 'NET AND WORK S.A.', pais: 'ARGENTINA', prov: 'BUENOS AIRES', reg: 'AMBA', tipo: 'Eventos', soc: 'Telecom Argentina S.A.', usu: '', val: '2' },
  { id: 2, nro_nota: 'ND1043', acta: 'A2711', estado: 'Cerrado', periodo: 'Del 16/03 al 15/04', anio: '2026', f_crea: '2026-04-17 11:46', f_cierre: '2026-04-17 11:47', contra: 'GREENIN S.A.S.', pais: 'ARGENTINA', prov: 'CAPITAL FEDERAL', reg: 'AMBA', tipo: 'Eventos', soc: 'Telecom Argentina S.A.', usu: 'z002456', val: '1' },
  { id: 3, nro_nota: 'NDP011', acta: 'P0125', estado: 'En Curso', periodo: 'Del 16/01 al 15/02', anio: '2026', f_crea: '2026-03-06 13:40', f_cierre: '', contra: 'BULLS', pais: 'PARAGUAY', prov: 'PARAGUAY', reg: 'PARAGUAY', tipo: 'WIRELESS', soc: 'Núcleo S.A.', usu: '', val: '4' },
  { id: 4, nro_nota: 'NDP007', acta: 'P0119', estado: 'Cerrado', periodo: 'Del 16/01 al 15/02', anio: '2026', f_crea: '2026-03-05 10:18', f_cierre: '2026-03-05 17:19', contra: 'DUNKEL', pais: 'PARAGUAY', prov: 'PARAGUAY', reg: 'PARAGUAY', tipo: 'DTH', soc: 'Núcleo S.A.', usu: 'z002525', val: '3' }
]
