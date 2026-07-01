<template>
  <div class="notas-grid-wrapper">
    <div class="notas-grid-box" :class="{ expanded: props.data.length > 0 }">
      <div class="notas-grid-scroll">
        <table class="notas-grid notas-fallidas-table">
          <colgroup>
            <col style="width:38px;min-width:38px;max-width:38px" />
            <col v-for="column in columns" :key="`col-${column.field}`" :style="columnStyle(column.field)" />
          </colgroup>

          <thead>
            <tr class="notas-head-row">
              <th class="check-col">
                <input type="checkbox" :checked="allPageSelected" :disabled="paginatedData.length === 0" @change="toggleAllPage" />
              </th>
              <th v-for="column in columns" :key="column.field" class="resizable-th" :style="columnStyle(column.field)">
                <button class="sort-header" type="button" @click="toggleSort(column.field)">
                  <span>{{ column.label }}</span>
                  <span class="sort-icons">
                    <span :class="{ on: sortState.field === column.field && sortState.direction === 'asc' }">▲</span>
                    <span :class="{ on: sortState.field === column.field && sortState.direction === 'desc' }">▼</span>
                  </span>
                </button>
                <span class="resize-handle" title="Arrastrar para achicar o agrandar columna. Doble clic para restaurar." @mousedown.stop.prevent="startColumnResize($event, column.field)" @dblclick.stop.prevent="resetColumnWidth(column.field)"></span>
              </th>
            </tr>

            <tr class="notas-filter-row">
              <th class="check-col"></th>
              <th v-for="column in columns" :key="`filter-${column.field}`" :style="columnStyle(column.field)">
                <span class="prefix">~</span>
                <input type="text" :value="filters[column.field]" @input="setFilter(column.field, $event.target.value)" @click.stop />
                <button type="button" @click.stop="clearFilter(column.field)">x</button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="paginatedData.length === 0" class="empty-tr">
              <td :colspan="columns.length + 1">No hay resultados</td>
            </tr>

            <tr v-for="row in paginatedData" :key="row.id" :class="{ selected: selectedRowSet.has(row.id), selectable: true }" @click="toggleRow(row)">
              <td class="check-col" @click.stop>
                <input type="checkbox" :checked="selectedRowSet.has(row.id)" @change="setRowSelection(row, $event.target.checked)" />
              </td>
              <td v-for="column in columns" :key="`${row.id}-${column.field}`" :title="row[column.field]" :style="columnStyle(column.field)">
                <button v-if="column.field === 'nro_nota'" class="nota-link-button" type="button" @click.stop="$emit('open-nota', row)">{{ row[column.field] }}</button>
                <span v-else-if="column.field === 'acta'" class="acta-link">{{ row[column.field] }}</span>
                <span v-else-if="column.field === 'estado'" class="estado-badge" :class="estadoClass(row[column.field])">{{ row[column.field] }}</span>
                <span v-else>{{ row[column.field] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="notas-footer">
        <div class="footer-left">
          <button class="footer-icon footer-icon-export" title="Exportar todo completo a Excel" aria-label="Exportar todo completo a Excel" @click="exportFullExcel" :disabled="props.data.length === 0">
            <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v10"></path>
              <path d="M8.5 10.8 12 14.3l3.5-3.5"></path>
              <path d="M6 16.5v3h12v-3"></path>
            </svg>
          </button>
        </div>

        <div class="footer-pages">
          <button type="button" :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button>
          <button type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--">&lt;</button>
          <span>Pagina</span>
          <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage" />
          <span>de {{ totalPages || 1 }}</span>
          <button type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++">&gt;</button>
          <button type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages || 1">&gt;|</button>
          <select v-model.number="itemsPerPage" @change="currentPage = 1">
            <option :value="10">10</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="500">500</option>
          </select>
        </div>

        <div class="footer-count">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredData.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { downloadExcel } from '../../../utils/excelExport.js'

const props = defineProps({
  data: { type: Array, default: () => [] },
  fileName: { type: String, default: 'Consulta_Notas.xls' }
})

defineEmits(['open-nota'])

const columns = [
  { field: 'nro_nota', label: 'NRO_NOTA', width: 130, minWidth: 70 },
  { field: 'acta', label: 'NUMERO DE ACTA', width: 135, minWidth: 75 },
  { field: 'estado', label: 'ESTADO_NOTA', width: 125, minWidth: 70 },
  { field: 'periodo', label: 'PERIODO', width: 145, minWidth: 80 },
  { field: 'anio', label: 'AÑO', width: 90, minWidth: 55 },
  { field: 'f_crea', label: 'FECHA_CREACION', width: 150, minWidth: 80 },
  { field: 'f_cierre', label: 'FECHA_CIERRE_NC', width: 150, minWidth: 80 },
  { field: 'contra', label: 'CONTRATISTA', width: 165, minWidth: 90 },
  { field: 'pais', label: 'PAIS', width: 120, minWidth: 60 },
  { field: 'prov', label: 'PROVINCIA', width: 135, minWidth: 75 },
  { field: 'reg', label: 'REGION', width: 125, minWidth: 70 },
  { field: 'tipo', label: 'TIPO_CONTRATO', width: 135, minWidth: 80 },
  { field: 'soc', label: 'SOCIEDAD', width: 155, minWidth: 80 },
  { field: 'usu', label: 'USUARIO_CIERRE', width: 135, minWidth: 80 },
  { field: 'val', label: 'VALORACION_ACTA', width: 135, minWidth: 75 }
]

const filters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const widths = reactive(Object.fromEntries(columns.map((column) => [column.field, column.width])))
const mins = Object.fromEntries(columns.map((column) => [column.field, column.minWidth]))
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedRows = ref([])
const sortState = reactive({ field: '', direction: '' })

const columnStyle = (field) => ({
  width: `${widths[field]}px`,
  minWidth: `${widths[field]}px`,
  maxWidth: `${widths[field]}px`
})
const normalize = (value) => String(value || '').toLowerCase()
const filteredData = computed(() => props.data.filter((row) => columns.every((column) => !normalize(filters[column.field]) || normalize(row[column.field]).includes(normalize(filters[column.field])))))
const sortedData = computed(() => {
  const rows = [...filteredData.value]
  if (!sortState.field || !sortState.direction) return rows
  return rows.sort((a, b) => {
    const result = String(a[sortState.field] ?? '').localeCompare(String(b[sortState.field] ?? ''), 'es', { numeric: true, sensitivity: 'base' })
    return sortState.direction === 'asc' ? result : -result
  })
})
const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value) || 1)
const paginatedData = computed(() => sortedData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredData.value.length > 0 ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length))
const selectedRowSet = computed(() => new Set(selectedRows.value))
const allPageSelected = computed(() => paginatedData.value.length > 0 && paginatedData.value.every((row) => selectedRowSet.value.has(row.id)))

const setFilter = (field, value) => {
  filters[field] = value
  currentPage.value = 1
}
const clearFilter = (field) => {
  filters[field] = ''
  currentPage.value = 1
}
const normalizePage = () => {
  if (!currentPage.value || currentPage.value < 1) currentPage.value = 1
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
}
const estadoClass = (estado) => normalize(estado).includes('cerrado') ? 'estado-cerrado' : 'estado-curso'
const exportFullExcel = () => {
  if (!props.data.length) return
  downloadExcel({ filename: props.fileName, title: 'Consulta Notas', columns, rows: props.data, mode: 'allColumns' })
}
const toggleSort = (field) => {
  if (sortState.field !== field) {
    sortState.field = field
    sortState.direction = 'asc'
  } else if (sortState.direction === 'asc') {
    sortState.direction = 'desc'
  } else {
    sortState.field = ''
    sortState.direction = ''
  }
  currentPage.value = 1
}
const toggleRow = (row) => {
  const index = selectedRows.value.indexOf(row.id)
  index >= 0 ? selectedRows.value.splice(index, 1) : selectedRows.value.push(row.id)
}
const setRowSelection = (row, checked) => {
  const index = selectedRows.value.indexOf(row.id)
  if (checked && index === -1) selectedRows.value.push(row.id)
  if (!checked && index >= 0) selectedRows.value.splice(index, 1)
}
const toggleAllPage = (event) => {
  paginatedData.value.forEach((row) => setRowSelection(row, event.target.checked))
}

let resizingField = null
let startX = 0
let startWidth = 0
const startColumnResize = (event, field) => {
  resizingField = field
  startX = event.clientX
  startWidth = widths[field]
  document.body.classList.add('notas-column-resizing')
  document.addEventListener('mousemove', resizeColumn)
  document.addEventListener('mouseup', stopColumnResize)
}
const resizeColumn = (event) => {
  if (resizingField) widths[resizingField] = Math.max(mins[resizingField] || 48, startWidth + event.clientX - startX)
}
const stopColumnResize = () => {
  resizingField = null
  document.body.classList.remove('notas-column-resizing')
  document.removeEventListener('mousemove', resizeColumn)
  document.removeEventListener('mouseup', stopColumnResize)
}
const resetColumnWidth = (field) => {
  const original = columns.find((column) => column.field === field)
  widths[field] = original?.width || 120
}

watch(filters, () => { currentPage.value = 1 })
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages || 1 })
watch(() => props.data, () => { selectedRows.value = []; currentPage.value = 1 })
onBeforeUnmount(() => stopColumnResize())
</script>

<style scoped>
.notas-grid-wrapper {
  width: 100%;
  border-left: 4px solid #00bcd4;
  box-sizing: border-box;
}

.notas-grid-box {
  padding: 0;
  background: #fff;
}

.notas-grid-scroll {
  overflow: auto;
  border: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  background: #fff;
  min-height: 190px;
  max-height: 62vh;
}

.notas-grid-box.expanded .notas-grid-scroll {
  min-height: 430px;
  max-height: 62vh;
}

.notas-fallidas-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
  background: #fff;
}

.notas-fallidas-table th,
.notas-fallidas-table td {
  border-right: 1px solid #c9d3da;
  border-bottom: 1px solid #dce3e8;
  padding: 7px 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fff;
}

.notas-fallidas-table thead th {
  position: sticky;
  z-index: 5;
  background: #f4f7f9;
  color: #2c4050;
  font-weight: 600;
  font-size: 11px;
}

.notas-head-row th {
  top: 0;
  height: 36px;
}

.notas-filter-row th {
  top: 36px;
  height: 34px;
  background: #fff;
  padding: 4px 5px;
  z-index: 4;
}

.notas-filter-row .prefix {
  display: inline-block;
  width: 14px;
}

.notas-filter-row input {
  width: calc(100% - 32px);
  height: 24px;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  padding: 3px 6px;
  font-size: 11px;
  box-sizing: border-box;
}

.notas-filter-row input:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.notas-filter-row button {
  border: 0;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  margin-left: 5px;
  padding: 0;
}

.check-col {
  width: 38px;
  min-width: 38px;
  max-width: 38px;
  text-align: center !important;
  padding: 0 !important;
}

.check-col input {
  width: 14px;
  height: 14px;
  accent-color: #00a9bd;
  cursor: pointer;
}

.resizable-th {
  position: relative;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -3px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle:hover {
  background: rgba(0, 188, 212, .16);
}

.sort-header {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 0;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.sort-header:hover {
  color: #008fa1;
}

.sort-icons {
  display: inline-flex;
  flex-direction: column;
  color: #aab8c0;
  font-size: 8px;
  line-height: 7px;
  min-width: 9px;
}

.sort-icons .on {
  color: #00a9bd;
}

.notas-fallidas-table tbody tr.selectable {
  cursor: pointer;
}

.notas-fallidas-table tbody tr:hover td {
  background: #edfafd;
}

.notas-fallidas-table tbody tr.selected td {
  background: #9eeff7;
  color: #003f47;
}

.empty-tr td {
  height: 118px;
  line-height: 118px;
  text-align: center;
  color: #607d8b;
  background: #fff;
  padding: 0;
}

.nota-link-button {
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  color: #00a9bd;
  font-weight: 700;
  cursor: pointer;
  font: inherit;
}

.nota-link-button:hover {
  color: #008fa1;
  text-decoration: underline;
}

.acta-link {
  color: #00a9bd;
  font-weight: 700;
}

.estado-badge {
  display: inline-flex;
  min-width: 82px;
  justify-content: center;
  border-radius: 12px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 700;
}

.estado-curso {
  color: #01579b;
  background: #e1f5fe;
  border: 1px solid #81d4fa;
}

.estado-cerrado {
  color: #1b5e20;
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
}

.notas-footer {
  min-height: 38px;
  border: 1px solid #d1d1d1;
  border-top: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: #fff;
  font-size: 12px;
}

.footer-left,
.footer-pages {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-icon,
.footer-pages button {
  border: 0;
  background: transparent;
  color: #000;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.footer-icon:disabled,
.footer-pages button:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.footer-icon:hover:not(:disabled),
.footer-pages button:hover:not(:disabled) {
  color: #00a9bd;
}

.fm-svg-icon {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.footer-pages input {
  width: 40px;
  height: 24px;
  text-align: center;
  border: 1px solid #cfd8dc;
  border-radius: 3px;
}

.footer-pages input:focus,
.footer-pages select:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.footer-pages select {
  height: 28px;
  border: 1px solid #cfd8dc;
  border-radius: 3px;
  background: #fff;
}

.footer-count {
  justify-self: end;
  white-space: nowrap;
}

@media(max-width: 900px) {
  .notas-footer {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .footer-count {
    justify-self: center;
  }
}

@media(max-width: 560px) {
  .footer-pages {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

<style>
body.notas-column-resizing,
body.notas-column-resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>
