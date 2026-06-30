<template>
  <div class="notas-grid-wrapper">
    <div class="notas-table-wrap">
      <table class="notas-grid">
        <colgroup>
          <col v-for="column in columns" :key="`col-${column.field}`" :style="columnStyle(column.field)">
        </colgroup>
        <thead>
          <tr class="header-row">
            <th v-for="column in columns" :key="column.field" :style="columnStyle(column.field)">
              <button class="sort-button" type="button" @click="toggleSort(column.field)">
                <span>{{ column.label }}</span>
                <span class="sort-icons"><span :class="{ active: sortState.field === column.field && sortState.direction === 'asc' }">▲</span><span :class="{ active: sortState.field === column.field && sortState.direction === 'desc' }">▼</span></span>
              </button>
              <span class="resize-handle" title="Arrastrar para achicar o agrandar columna. Doble clic para restaurar." @mousedown.stop.prevent="startColumnResize($event, column.field)" @dblclick.stop.prevent="resetColumnWidth(column.field)"></span>
            </th>
          </tr>
          <tr class="filter-row">
            <th v-for="column in columns" :key="`filter-${column.field}`" :style="columnStyle(column.field)">
              <div class="col-filter"><span>~</span><input type="text" class="col-filter-input" v-model="filters[column.field]" @input="currentPage = 1" /><button type="button" @click="clearFilter(column.field)">x</button></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id" @click="selectedRow = selectedRow?.id === row.id ? null : row" :class="{ selected: selectedRow?.id === row.id }">
            <td v-for="column in columns" :key="`${row.id}-${column.field}`" :title="row[column.field]" :style="columnStyle(column.field)">
              <span v-if="column.field === 'nro_nota'" class="note-link" @click.stop="$emit('open-nota', row)">{{ row[column.field] }}</span>
              <span v-else-if="column.field === 'acta'" class="acta-link">{{ row[column.field] }}</span>
              <span v-else-if="column.field === 'estado'" class="estado-badge" :class="estadoClass(row[column.field])">{{ row[column.field] }}</span>
              <span v-else>{{ row[column.field] }}</span>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0"><td :colspan="columns.length" class="empty-cell">No hay resultados.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="notas-grid-footer">
      <div class="footer-icons"><button class="plain-icon" title="Exportar todo completo a Excel" @click="exportFullExcel" :disabled="props.data.length === 0"><span class="material-icons">file_download</span></button></div>
      <div class="footer-pagination">
        <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage = 1"><span class="material-icons">first_page</span></button>
        <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--"><span class="material-icons">chevron_left</span></button>
        <span>Página</span><input class="page-input" type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage" /><span>de {{ totalPages || 1 }}</span>
        <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++"><span class="material-icons">chevron_right</span></button>
        <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages || 1"><span class="material-icons">last_page</span></button>
        <select class="page-size" v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option><option :value="500">500</option></select>
      </div>
      <div class="footer-count"><span v-if="filteredData.length">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredData.length }}</span><span v-else>No hay resultados</span></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { downloadExcel } from '../../../utils/excelExport.js'
const props = defineProps({ data: { type: Array, default: () => [] }, fileName: { type: String, default: 'Consulta_Notas.xls' } })
defineEmits(['open-nota'])
const columns = [
  { field: 'nro_nota', label: 'NRO_NOTA', width: 130, minWidth: 70 }, { field: 'acta', label: 'NUMERO DE ACTA', width: 135, minWidth: 75 }, { field: 'estado', label: 'ESTADO_NOTA', width: 125, minWidth: 70 }, { field: 'periodo', label: 'PERIODO', width: 145, minWidth: 80 }, { field: 'anio', label: 'AÑO', width: 90, minWidth: 55 },
  { field: 'f_crea', label: 'FECHA_CREACION', width: 150, minWidth: 80 }, { field: 'f_cierre', label: 'FECHA_CIERRE_NC', width: 150, minWidth: 80 }, { field: 'contra', label: 'CONTRATISTA', width: 165, minWidth: 90 }, { field: 'pais', label: 'PAIS', width: 120, minWidth: 60 }, { field: 'prov', label: 'PROVINCIA', width: 135, minWidth: 75 },
  { field: 'reg', label: 'REGION', width: 125, minWidth: 70 }, { field: 'tipo', label: 'TIPO_CONTRATO', width: 135, minWidth: 80 }, { field: 'soc', label: 'SOCIEDAD', width: 155, minWidth: 80 }, { field: 'usu', label: 'USUARIO_CIERRE', width: 135, minWidth: 80 }, { field: 'val', label: 'VALORACION_ACTA', width: 135, minWidth: 75 }
]
const filters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const widths = reactive(Object.fromEntries(columns.map((column) => [column.field, column.width])))
const mins = Object.fromEntries(columns.map((column) => [column.field, column.minWidth]))
const currentPage = ref(1), itemsPerPage = ref(10), selectedRow = ref(null)
const sortState = reactive({ field: '', direction: '' })
const columnStyle = (field) => ({ width: `${widths[field]}px`, minWidth: `${widths[field]}px`, maxWidth: `${widths[field]}px` })
const normalize = (value) => String(value || '').toLowerCase()
const filteredData = computed(() => props.data.filter((row) => columns.every((column) => !normalize(filters[column.field]) || normalize(row[column.field]).includes(normalize(filters[column.field])))))
const sortedData = computed(() => {
  const rows = [...filteredData.value]
  if (!sortState.field || !sortState.direction) return rows
  return rows.sort((a, b) => { const result = String(a[sortState.field] ?? '').localeCompare(String(b[sortState.field] ?? ''), 'es', { numeric: true, sensitivity: 'base' }); return sortState.direction === 'asc' ? result : -result })
})
const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value) || 1)
const paginatedData = computed(() => sortedData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredData.value.length > 0 ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length))
const clearFilter = (field) => { filters[field] = ''; currentPage.value = 1 }
const normalizePage = () => { if (!currentPage.value || currentPage.value < 1) currentPage.value = 1; if (currentPage.value > totalPages.value) currentPage.value = totalPages.value }
const estadoClass = (estado) => normalize(estado).includes('cerrado') ? 'estado-cerrado' : 'estado-curso'
const exportFullExcel = () => { if (!props.data.length) return; downloadExcel({ filename: props.fileName, title: 'Consulta Notas', columns, rows: props.data, mode: 'allColumns' }) }
const toggleSort = (field) => { if (sortState.field !== field) { sortState.field = field; sortState.direction = 'asc' } else if (sortState.direction === 'asc') sortState.direction = 'desc'; else { sortState.field = ''; sortState.direction = '' }; currentPage.value = 1 }
let resizingField = null, startX = 0, startWidth = 0
const startColumnResize = (event, field) => { resizingField = field; startX = event.clientX; startWidth = widths[field]; document.body.classList.add('notas-column-resizing'); document.addEventListener('mousemove', resizeColumn); document.addEventListener('mouseup', stopColumnResize) }
const resizeColumn = (event) => { if (resizingField) widths[resizingField] = Math.max(mins[resizingField] || 48, startWidth + event.clientX - startX) }
const stopColumnResize = () => { resizingField = null; document.body.classList.remove('notas-column-resizing'); document.removeEventListener('mousemove', resizeColumn); document.removeEventListener('mouseup', stopColumnResize) }
const resetColumnWidth = (field) => { const original = columns.find((column) => column.field === field); widths[field] = original?.width || 120 }
watch(filters, () => { currentPage.value = 1 })
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages || 1 })
onBeforeUnmount(() => stopColumnResize())
</script>

<style scoped>
.notas-grid-wrapper { width: 100%; }.notas-table-wrap { overflow: auto; min-height: 500px; max-height: 620px; border: 1px solid #d1d1d1; border-bottom: 0; }.notas-grid { width: max-content; min-width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; }.notas-grid th,.notas-grid td { border-right: 1px solid #c9d3da; border-bottom: 1px solid #dce3e8; padding: 7px 8px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }.notas-grid thead th { position: sticky; background: #f4f7f9; color: #2c4050; font-weight: 600; font-size: 11px; z-index: 5; }.header-row th { top: 0; height: 36px; }.filter-row th { top: 36px; height: 34px; background: #fff; padding: 4px 5px; }.sort-button { width: 100%; height: 100%; border: 0; background: transparent; color: inherit; display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 0; text-align: left; font: inherit; cursor: pointer; }.sort-button:hover { color: #008fa1; }.sort-icons { display: inline-flex; flex-direction: column; color: #aab8c0; font-size: 8px; line-height: 7px; min-width: 9px; }.sort-icons .active { color: #00a9bd; }.resize-handle { position: absolute; top: 0; right: -4px; width: 10px; height: 100%; cursor: col-resize; z-index: 10; border-right: 2px solid transparent; }.resize-handle:hover { background: rgba(0,188,212,.16); border-right-color: #00bcd4; }.col-filter { display: grid; grid-template-columns: 14px minmax(36px,1fr) 13px; align-items: center; gap: 5px; }.col-filter-input { width: 100%; height: 24px; border: 1px solid #c7d1d8; border-radius: 3px; padding: 3px 6px; font-size: 11px; }.col-filter-input:focus { outline: none; border-color: #00bcd4; box-shadow: 0 0 0 2px rgba(0,188,212,.14); }.col-filter button { appearance: none; border: 0; background: transparent; cursor: pointer; font-weight: 700; padding: 0; color: #000; }.notas-grid tbody tr { cursor: pointer; }.notas-grid tbody tr:hover td { background: #edfafd; }.notas-grid tbody tr.selected td { background: #9eeff7; color: #003f47; }.empty-cell { text-align: center !important; padding: 34px !important; color: #607d8b; }.note-link,.acta-link { color: #00a9bd; font-weight: 700; cursor: pointer; }.note-link:hover { color: #008fa1; text-decoration: underline; }.estado-badge { display: inline-flex; min-width: 82px; justify-content: center; border-radius: 12px; padding: 3px 9px; font-size: 11px; font-weight: 700; }.estado-curso { color: #01579b; background: #e1f5fe; border: 1px solid #81d4fa; }.estado-cerrado { color: #1b5e20; background: #e8f5e9; border: 1px solid #a5d6a7; }.notas-grid-footer { min-height: 38px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 6px 10px; border: 1px solid #d1d1d1; background: #fff; }.footer-icons { display: flex; align-items: center; gap: 10px; }.plain-icon,.page-icon { appearance: none; border: 0; background: transparent; color: #000; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; }.plain-icon .material-icons,.page-icon .material-icons { font-size: 17px; }.plain-icon:hover:not(:disabled),.page-icon:hover:not(:disabled) { color: #00a9bd; }.plain-icon:disabled,.page-icon:disabled { opacity: .35; cursor: not-allowed; }.footer-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; white-space: nowrap; }.page-input { width: 40px; height: 24px; border: 1px solid #d8d8d8; border-radius: 3px; text-align: center; font-weight: 400; }.page-size { height: 26px; border: 1px solid #d8d8d8; border-radius: 3px; font-size: 12px; }.footer-count { justify-self: end; font-size: 12px; white-space: nowrap; }@media(max-width:900px){.notas-grid-footer{grid-template-columns:1fr;justify-items:center}.footer-count{justify-self:center}}@media(max-width:560px){.footer-pagination{flex-wrap:wrap}}
</style>
<style>body.notas-column-resizing,body.notas-column-resizing *{cursor:col-resize!important;user-select:none!important}</style>
