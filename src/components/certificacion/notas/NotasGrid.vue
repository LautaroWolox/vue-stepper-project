<template>
  <div class="notas-grid-wrapper">
    <div class="notas-table-wrap">
      <table class="notas-grid">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.field" class="resizable-th" :style="{ width: column.width, minWidth: column.minWidth }">
              <div class="resize-header">{{ column.label }}</div>
            </th>
          </tr>
          <tr class="filter-row">
            <th v-for="column in columns" :key="`filter-${column.field}`">
              <div class="col-filter">
                <span>~</span>
                <input type="text" class="col-filter-input" v-model="filters[column.field]" @input="currentPage = 1" />
                <button type="button" @click="clearFilter(column.field)">x</button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td v-for="column in columns" :key="`${row.id}-${column.field}`" :title="row[column.field]">
              <span v-if="column.field === 'nro_nota'" class="note-link" @click="$emit('open-nota', row)">{{ row[column.field] }}</span>
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
      <div class="footer-icons">
        <button class="plain-icon" title="Exportar a Excel" @click="openExportDialog" :disabled="filteredData.length === 0"><span class="material-icons">file_download</span></button>
      </div>
      <div class="footer-pagination">
        <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage = 1"><span class="material-icons">first_page</span></button>
        <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--"><span class="material-icons">chevron_left</span></button>
        <span>Página</span>
        <input class="page-input" type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage" />
        <span>de {{ totalPages || 1 }}</span>
        <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++"><span class="material-icons">chevron_right</span></button>
        <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages || 1"><span class="material-icons">last_page</span></button>
        <select class="page-size" v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option><option :value="500">500</option></select>
      </div>
      <div class="footer-count"><span v-if="filteredData.length">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredData.length }}</span><span v-else>No hay resultados</span></div>
    </div>

    <ExportExcelDialog :show="showExportDialog" description="Elegí si querés exportar toda la grilla de notas o solo lo visible, y todos los campos o solo los campos llenos." @close="showExportDialog = false" @confirm="confirmExportExcel" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import ExportExcelDialog from '../../shared/ExportExcelDialog.vue'
import { downloadExcel } from '../../../utils/excelExport.js'

const props = defineProps({
  data: { type: Array, default: () => [] },
  fileName: { type: String, default: 'Consulta_Notas.xls' }
})

defineEmits(['open-nota'])

const columns = [
  { field: 'nro_nota', label: 'NRO_NOTA', width: '130px', minWidth: '115px' },
  { field: 'acta', label: 'NUMERO DE ACTA', width: '135px', minWidth: '120px' },
  { field: 'estado', label: 'ESTADO_NOTA', width: '125px', minWidth: '110px' },
  { field: 'periodo', label: 'PERIODO', width: '145px', minWidth: '130px' },
  { field: 'anio', label: 'AÑO', width: '90px', minWidth: '80px' },
  { field: 'f_crea', label: 'FECHA_CREACION', width: '150px', minWidth: '135px' },
  { field: 'f_cierre', label: 'FECHA_CIERRE_NC', width: '150px', minWidth: '135px' },
  { field: 'contra', label: 'CONTRATISTA', width: '165px', minWidth: '145px' },
  { field: 'pais', label: 'PAIS', width: '120px', minWidth: '105px' },
  { field: 'prov', label: 'PROVINCIA', width: '135px', minWidth: '120px' },
  { field: 'reg', label: 'REGION', width: '125px', minWidth: '110px' },
  { field: 'tipo', label: 'TIPO_CONTRATO', width: '135px', minWidth: '120px' },
  { field: 'soc', label: 'SOCIEDAD', width: '155px', minWidth: '135px' },
  { field: 'usu', label: 'USUARIO_CIERRE', width: '135px', minWidth: '120px' },
  { field: 'val', label: 'VALORACION_ACTA', width: '135px', minWidth: '120px' }
]

const filters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showExportDialog = ref(false)

const normalize = (value) => String(value || '').toLowerCase()
const filteredData = computed(() => props.data.filter((row) => columns.every((column) => {
  const filterValue = normalize(filters[column.field])
  return !filterValue || normalize(row[column.field]).includes(filterValue)
})))
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value) || 1)
const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredData.value.length > 0 ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length))
const clearFilter = (field) => { filters[field] = ''; currentPage.value = 1 }
const normalizePage = () => { if (!currentPage.value || currentPage.value < 1) currentPage.value = 1; if (currentPage.value > totalPages.value) currentPage.value = totalPages.value }
const estadoClass = (estado) => normalize(estado).includes('cerrado') ? 'estado-cerrado' : 'estado-curso'
const openExportDialog = () => { if (filteredData.value.length) showExportDialog.value = true }
const confirmExportExcel = ({ scope, columnMode }) => {
  const rows = scope === 'visibleRows' ? paginatedData.value : filteredData.value
  downloadExcel({ filename: props.fileName, title: 'Consulta Notas', columns, rows, mode: columnMode })
  showExportDialog.value = false
}

watch(filters, () => { currentPage.value = 1 })
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages || 1 })
</script>

<style scoped>
.notas-grid-wrapper { width: 100%; }
.notas-table-wrap { overflow: auto; min-height: 500px; max-height: 620px; border: 1px solid #d1d1d1; border-bottom: 0; }
.notas-grid { width: max-content; min-width: 100%; border-collapse: collapse; table-layout: fixed; }
.notas-grid th, .notas-grid td { border-right: 1px solid #c9c9c9; border-bottom: 1px solid #c9c9c9; padding: 8px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notas-grid th { height: 38px; background: #f7f7f7; color: #1e2c35; font-weight: 500; }
.notas-grid td { height: 30px; }
.resizable-th { resize: horizontal; overflow: auto; }
.filter-row th { background: #fff; padding: 6px 8px; }
.col-filter { display: grid; grid-template-columns: 14px minmax(48px, 1fr) 13px; align-items: center; gap: 5px; }
.col-filter-input { width: 100%; height: 28px; border: 1px solid #c7c7c7; border-radius: 3px; padding: 3px 6px; }
.col-filter button { appearance: none; border: 0; background: transparent; cursor: pointer; font-weight: 700; padding: 0; color: #000; }
.empty-cell { text-align: center !important; padding: 34px !important; color: #607d8b; }
.note-link, .acta-link { color: #00a9bd; font-weight: 800; cursor: pointer; }
.note-link:hover { color: #008fa1; text-decoration: underline; }
.estado-badge { display: inline-flex; min-width: 82px; justify-content: center; border-radius: 12px; padding: 3px 9px; font-size: 12px; font-weight: 800; }
.estado-curso { color: #01579b; background: #e1f5fe; border: 1px solid #81d4fa; }
.estado-cerrado { color: #1b5e20; background: #e8f5e9; border: 1px solid #a5d6a7; }
.notas-grid-footer { min-height: 38px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 6px 10px; border: 1px solid #d1d1d1; background: #fff; }
.footer-icons { display: flex; align-items: center; gap: 12px; }
.plain-icon, .page-icon { appearance: none; border: 0; background: transparent; color: #000; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
.plain-icon .material-icons, .page-icon .material-icons { font-size: 20px; }
.plain-icon:hover:not(:disabled), .page-icon:hover:not(:disabled) { color: #00a9bd; }
.plain-icon:disabled, .page-icon:disabled { opacity: 0.35; cursor: not-allowed; }
.footer-pagination { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; white-space: nowrap; }
.page-input { width: 40px; height: 26px; border: 1px solid #d8d8d8; border-radius: 3px; text-align: center; font-weight: 700; }
.page-size { height: 28px; border: 1px solid #d8d8d8; border-radius: 3px; }
.footer-count { justify-self: end; font-size: 13px; white-space: nowrap; }
@media (max-width: 900px) { .notas-grid-footer { grid-template-columns: 1fr; justify-items: center; } .footer-count { justify-self: center; } }
@media (max-width: 560px) { .footer-pagination { flex-wrap: wrap; } }
</style>
