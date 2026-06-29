export const registroOtFallidasColumns = [
  { field: 'nroOt', label: 'Nro. OT', width: '120px' },
  { field: 'fechaCierre', label: 'FECHA CIERRE', width: '135px' },
  { field: 'codTarea', label: 'COD TAREA', width: '110px' },
  { field: 'direccion', label: 'DIRECCION', width: '150px' },
  { field: 'ciudad', label: 'CIUDAD', width: '130px' },
  { field: 'provincia', label: 'PROVINCIA', width: '130px' },
  { field: 'region', label: 'REGION', width: '110px' },
  { field: 'pais', label: 'PAIS', width: '90px' },
  { field: 'contratista', label: 'CONTRATISTA', width: '155px' },
  { field: 'tecnicoCierre', label: 'TECNICO CIERRE', width: '130px' },
  { field: 'actividades', label: 'ACTIVIDADES', width: '160px' },
  { field: 'sistemaOrigen', label: 'SISTEMA ORIGEN', width: '130px' },
  { field: 'descripcionError', label: 'DESCRIPCION ERROR', width: '180px' },
  { field: 'excluida', label: 'EXCLUIDA', width: '105px' },
  { field: 'motivoExclusion', label: 'MOTIVO_EXCLUSION', width: '170px' },
  { field: 'nota', label: 'NOTA', width: '90px' },
  { field: 'incluir', label: 'INCLUIR', width: '90px' }
]

export const emptyRegistroOtFallidasFilters = () => ({
  nroOt: '',
  fechaDesde: '',
  fechaHasta: '',
  contratista: '',
  descripcionError: '',
  excluida: '',
  pais: ''
})
