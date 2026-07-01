import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { contratistasFallidasMock, motivosRecuperoFallidasMock } from '../../../mocks/registroOtFallidasMock.js'
import { excludeRegistroOtFallidas, includeRegistroOtFallida, processRegistroOtFallidas, searchRegistroOtFallidas } from '../../../services/registroOtFallidasService.js'
import { downloadExcel } from '../../../utils/excelExport.js'

export function useRegistroOtFallidasScreen() {
  const openFilters = ref(true)
  const openGrid = ref(true)
  const loading = ref(false)
  const rows = ref([])
  const page = ref(1)
  const perPage = ref(10)
  const filters = reactive({ nroOt: '', fechaDesde: '', fechaHasta: '', contratista: '', descripcionError: '', excluida: '', pais: '' })
  const alert = reactive({ show: false, title: 'Alerta', message: '', type: 'warning' })
  const notaPopup = reactive({ show: false, row: null, x: 420, y: 120 })
  const includePopup = reactive({ show: false, row: null, motivo: '', nota: '', x: 430, y: 120 })
  const excludePopup = reactive({ show: false, rows: [], motivo: '', nota: '', x: 430, y: 120 })
  const excludeConfirmPopup = reactive({ show: false, x: 460, y: 145 })
  const sortState = reactive({ field: '', direction: '' })

  const contratistaOptions = [{ value: '', label: '' }, ...contratistasFallidasMock.map((item) => ({ value: item, label: item }))]
  const excluidaOptions = [{ value: '', label: '' }, { value: 'S', label: 'Si' }, { value: 'N', label: 'No' }]
  const paisOptions = [{ value: '', label: '' }, { value: 'ARG', label: 'ARG' }, { value: 'UY', label: 'UY' }, { value: 'PY', label: 'PY' }]
  const motivoOptions = [{ value: '', label: '' }, ...motivosRecuperoFallidasMock.map((item) => ({ value: item, label: item }))]

  const columns = [
    { field: 'nroOt', label: 'NRO. OT', width: 120 },
    { field: 'fechaCierre', label: 'FECHA CIERRE', width: 135 },
    { field: 'codTarea', label: 'COD TAREA', width: 110 },
    { field: 'direccion', label: 'DIRECCION', width: 150 },
    { field: 'ciudad', label: 'CIUDAD', width: 130 },
    { field: 'provincia', label: 'PROVINCIA', width: 130 },
    { field: 'region', label: 'REGION', width: 110 },
    { field: 'pais', label: 'PAIS', width: 90 },
    { field: 'contratista', label: 'CONTRATISTA', width: 155 },
    { field: 'tecnicoCierre', label: 'TECNICO CIERRE', width: 130 },
    { field: 'actividades', label: 'ACTIVIDADES', width: 160 },
    { field: 'sistemaOrigen', label: 'SISTEMA ORIGEN', width: 130 },
    { field: 'descripcionError', label: 'DESCRIPCION ERROR', width: 180 },
    { field: 'excluida', label: 'EXCLUIDA', width: 105 },
    { field: 'motivoExclusion', label: 'MOTIVO_EXCLUSION', width: 170 },
    { field: 'nota', label: 'NOTA', width: 90 },
    { field: 'incluir', label: 'INCLUIR', width: 90 }
  ]
  const initialColumnWidths = Object.fromEntries(columns.map((col) => [col.field, col.width]))
  const columnWidths = reactive({ ...initialColumnWidths })
  const columnFilters = reactive(Object.fromEntries(columns.map((col) => [col.field, ''])))
  const norm = (value) => String(value || '').toLowerCase()
  const filteredRows = computed(() => rows.value.filter((row) => columns.every((col) => !norm(columnFilters[col.field]) || norm(row[col.field]).includes(norm(columnFilters[col.field])))))
  const sortedRows = computed(() => {
    const data = [...filteredRows.value]
    if (!sortState.field || !sortState.direction) return data
    return data.sort((a, b) => {
      const result = String(a[sortState.field] ?? '').localeCompare(String(b[sortState.field] ?? ''), 'es', { numeric: true, sensitivity: 'base' })
      return sortState.direction === 'asc' ? result : -result
    })
  })
  const totalPages = computed(() => Math.ceil(sortedRows.value.length / perPage.value) || 1)
  const pageRows = computed(() => sortedRows.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))
  const fromRow = computed(() => sortedRows.value.length ? ((page.value - 1) * perPage.value) + 1 : 0)
  const toRow = computed(() => Math.min(page.value * perPage.value, sortedRows.value.length))
  const selectableVisibleRows = computed(() => filteredRows.value.filter((row) => row.excluida !== 'S'))
  const allVisibleSelected = computed(() => selectableVisibleRows.value.length > 0 && selectableVisibleRows.value.every((row) => row.selected))

  const showAlert = (title, message, type = 'warning') => { alert.title = title; alert.message = message; alert.type = type; alert.show = true }
  const colStyle = (field) => ({ width: `${columnWidths[field] || 120}px`, minWidth: `${columnWidths[field] || 120}px`, maxWidth: `${columnWidths[field] || 120}px` })
  const clearColumnFilter = (field) => { columnFilters[field] = ''; page.value = 1 }
  const normalizePage = () => { if (!page.value || page.value < 1) page.value = 1; if (page.value > totalPages.value) page.value = totalPages.value }
  const toggleAllVisible = (event) => selectableVisibleRows.value.forEach((row) => { row.selected = event.target.checked })
  const toggleRowSelection = (row) => { if (!row || row.excluida === 'S') return; row.selected = !row.selected }
  const toggleSort = (field) => { if (sortState.field !== field) { sortState.field = field; sortState.direction = 'asc' } else if (sortState.direction === 'asc') { sortState.direction = 'desc' } else { sortState.field = ''; sortState.direction = '' } page.value = 1 }
  const limpiar = () => { Object.assign(filters, { nroOt: '', fechaDesde: '', fechaHasta: '', contratista: '', descripcionError: '', excluida: '', pais: '' }) }
  const buscar = async () => { loading.value = true; openGrid.value = true; try { rows.value = await searchRegistroOtFallidas({ ...filters }); page.value = 1; if (!rows.value.length) showAlert('Alerta', 'No hay datos para la consulta efectuada', 'warning') } finally { loading.value = false } }
  const exportarIncluidas = () => { const incluidas = filteredRows.value.filter((row) => row.excluida !== 'S'); if (!incluidas.length) return showAlert('Alerta', 'No hay OTs incluidas para exportar.', 'warning'); downloadExcel({ filename: 'ots_fallidas_incluidas.xls', title: 'OTs Fallidas Incluidas', columns, rows: incluidas }) }
  const reprocesar = async () => { const seleccionadas = rows.value.filter((row) => row.selected && row.excluida !== 'S'); if (!seleccionadas.length) return showAlert('Alerta', 'No hay datos para la consulta efectuada', 'warning'); loading.value = true; try { await processRegistroOtFallidas(seleccionadas); seleccionadas.forEach((row) => { row.selected = false }); showAlert('Reproceso finalizado', 'Las OTs seleccionadas fueron reprocesadas correctamente.', 'success') } finally { loading.value = false } }
  const openNota = (row) => { notaPopup.row = row; notaPopup.x = Math.max(window.innerWidth / 2 - 270, 20); notaPopup.y = 120; notaPopup.show = true }
  const openIncluir = (row) => { includePopup.row = row; includePopup.motivo = ''; includePopup.nota = ''; includePopup.x = Math.max(window.innerWidth / 2 - 285, 20); includePopup.y = 120; includePopup.show = true }
  const confirmarIncluir = async () => { if (!includePopup.motivo) return showAlert('Alerta', 'Debe seleccionar un motivo.', 'warning'); await includeRegistroOtFallida({ nroOt: includePopup.row.nroOt, motivo: includePopup.motivo, nota: includePopup.nota }); includePopup.row.excluida = 'N'; includePopup.row.motivoExclusion = ''; includePopup.row.recovered = true; includePopup.row.selected = false; includePopup.row.incluir = '-'; includePopup.row.nota = includePopup.nota || includePopup.row.nota; includePopup.show = false }
  const openExcluirSeleccionadas = () => { const seleccionadas = rows.value.filter((row) => row.selected && row.excluida !== 'S'); if (!seleccionadas.length) return showAlert('Alerta', 'Debe seleccionar al menos una OT para excluir.', 'warning'); excludePopup.rows = seleccionadas; excludePopup.motivo = ''; excludePopup.nota = ''; excludePopup.x = Math.max(window.innerWidth / 2 - 285, 20); excludePopup.y = 120; excludeConfirmPopup.show = false; excludePopup.show = true }
  const pedirConfirmacionExcluir = () => { if (!excludePopup.motivo) return showAlert('Alerta', 'Debe seleccionar un motivo.', 'warning'); excludeConfirmPopup.x = Math.max(window.innerWidth / 2 - 285, 20); excludeConfirmPopup.y = 145; excludeConfirmPopup.show = true }
  const cancelarConfirmacionExcluir = () => { excludeConfirmPopup.show = false }
  const confirmarExcluir = async () => { if (!excludePopup.motivo) return showAlert('Alerta', 'Debe seleccionar un motivo.', 'warning'); loading.value = true; try { await excludeRegistroOtFallidas({ ots: excludePopup.rows.map((row) => row.nroOt), motivo: excludePopup.motivo, nota: excludePopup.nota }); excludePopup.rows.forEach((row) => { row.excluida = 'S'; row.selected = false; row.recovered = false; row.motivoExclusion = excludePopup.motivo; row.incluir = 'RECUPERAR'; row.nota = excludePopup.nota || row.nota }); excludeConfirmPopup.show = false; excludePopup.show = false } finally { loading.value = false } }

  let resizingField = null, resizeStartX = 0, resizeStartWidth = 0
  const startColumnResize = (event, field) => { resizingField = field; resizeStartX = event.clientX; resizeStartWidth = columnWidths[field] || initialColumnWidths[field] || 120; document.body.classList.add('column-resizing'); document.addEventListener('mousemove', resizeColumn); document.addEventListener('mouseup', stopColumnResize) }
  const resizeColumn = (event) => { if (!resizingField) return; columnWidths[resizingField] = Math.max(38, resizeStartWidth + event.clientX - resizeStartX) }
  const stopColumnResize = () => { resizingField = null; document.body.classList.remove('column-resizing'); document.removeEventListener('mousemove', resizeColumn); document.removeEventListener('mouseup', stopColumnResize) }
  const resetColumnWidth = (field) => { columnWidths[field] = initialColumnWidths[field] || 120 }
  onBeforeUnmount(stopColumnResize)

  return { openFilters, openGrid, loading, rows, page, perPage, filters, alert, notaPopup, includePopup, excludePopup, excludeConfirmPopup, sortState, contratistaOptions, excluidaOptions, paisOptions, motivoOptions, columns, columnFilters, filteredRows, totalPages, pageRows, fromRow, toRow, selectableVisibleRows, allVisibleSelected, colStyle, clearColumnFilter, normalizePage, toggleAllVisible, toggleRowSelection, toggleSort, limpiar, buscar, exportarIncluidas, reprocesar, openNota, openIncluir, confirmarIncluir, openExcluirSeleccionadas, pedirConfirmacionExcluir, cancelarConfirmacionExcluir, confirmarExcluir, showAlert, startColumnResize, resetColumnWidth }
}
