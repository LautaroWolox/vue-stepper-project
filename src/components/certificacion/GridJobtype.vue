<template>
  <div class="jobtype-grid-wrapper">
    <div class="jobtype-grid-scroll">
      <table class="jobtype-grid">
        <colgroup>
          <col v-for="column in columns" :key="`col-${column.field}`" :style="columnStyle(column.field)" />
        </colgroup>
        <thead>
          <tr class="jobtype-header-row">
            <th v-for="column in columns" :key="column.field" :style="columnStyle(column.field)">
              <button class="jobtype-sort-button" type="button" @click="toggleSort(column.field)">
                <span>{{ column.label }}</span>
                <span class="jobtype-sort-icons">
                  <span :class="{ active: sortState.field === column.field && sortState.direction === 'asc' }">▲</span>
                  <span :class="{ active: sortState.field === column.field && sortState.direction === 'desc' }">▼</span>
                </span>
              </button>
              <span class="jobtype-resize-handle" title="Arrastrar para achicar o agrandar columna" @mousedown.stop.prevent="startColumnResize($event, column.field)" @dblclick.stop.prevent="resetColumnWidth(column.field)"></span>
            </th>
          </tr>
          <tr class="jobtype-filter-row">
            <th v-for="column in columns" :key="`filter-${column.field}`" :style="columnStyle(column.field)">
              <span class="filter-prefix">~</span>
              <input type="text" v-model="filters[column.field]" @input="currentPage = 1" @click.stop />
              <button type="button" @click.stop="clearFilter(column.field)">x</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in paginatedData"
            :key="row.id"
            :class="{ 'active-row': selectedRow?.id === row.id }"
            @click="selectRow(row)"
          >
            <td v-for="column in columns" :key="`${row.id}-${column.field}`" :style="columnStyle(column.field)">
              {{ row[column.field] }}
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="jobtype-empty">No hay resultados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-footer jobtype-footer">
      <div class="grid-footer-left">
        <button class="icon-btn" title="Exportar Excel" @click="exportExcel">
          <span class="material-icons">file_download</span>
        </button>
        <button class="icon-btn" title="Desactivar" :disabled="!selectedRow" @click="deactivateRow">
          <span class="material-icons">delete</span>
        </button>
        <button class="icon-btn" title="Editar" :disabled="!selectedRow" @click="$emit('edit-row', $event, selectedRow)">
          <span class="material-icons">edit_square</span>
        </button>
        <button class="icon-btn" title="Nueva Relación" @click="$emit('add-row', $event)">
          <span class="material-icons">add</span>
        </button>
      </div>

      <div class="modern-pagination jobtype-pagination">
        <button class="page-nav" type="button" :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button>
        <button class="page-nav" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--">&lt;</button>
        <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage"> de {{ totalPages || 1 }}</span>
        <button class="page-nav" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++">&gt;</button>
        <button class="page-nav" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages">&gt;|</button>
        <FmTurquoiseSelect v-model="itemsPerPage" :options="itemsPerPageOptions" class="jobtype-page-size" @change="currentPage = 1" />
      </div>

      <div class="jobtype-count">
        Mostrando {{ filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} de {{ filteredData.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import FmTurquoiseSelect from '../shared/FmTurquoiseSelect.vue'
import { downloadExcel } from '../../utils/excelExport.js'

const props = defineProps(['data'])
const emit = defineEmits(['edit-row', 'add-row'])

const columns = [
  { field: 'cod', label: 'CODIGO_TAREA', width: 140, minWidth: 48 },
  { field: 'tarea', label: 'TAREA', width: 360, minWidth: 70 },
  { field: 'contrato', label: 'NOMBRE_CONTRATO', width: 190, minWidth: 60 },
  { field: 'usu', label: 'USUARIO_MODIFICACION', width: 190, minWidth: 70 },
  { field: 'fecha', label: 'FECHA_MODIFICACION', width: 190, minWidth: 70 },
  { field: 'activo', label: 'ACTIVO', width: 130, minWidth: 48 },
  { field: 'pais', label: 'PAIS', width: 150, minWidth: 48 }
]

const filters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const selectedRow = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = [{ value: 10, label: '10' }, { value: 50, label: '50' }, { value: 100, label: '100' }]
const sortState = reactive({ field: '', direction: '' })
const columnWidths = reactive(Object.fromEntries(columns.map((column) => [column.field, column.width])))
const minWidths = Object.fromEntries(columns.map((column) => [column.field, column.minWidth]))

const normalize = (value) => String(value ?? '').toLowerCase()
const columnStyle = (field) => ({ width: `${columnWidths[field]}px`, minWidth: `${columnWidths[field]}px`, maxWidth: `${columnWidths[field]}px` })

const filteredData = computed(() => props.data.filter(row => columns.every((column) => {
  const filterVal = normalize(filters[column.field])
  if (!filterVal) return true
  return normalize(row[column.field]).includes(filterVal)
})))

const sortedData = computed(() => {
  const list = [...filteredData.value]
  if (!sortState.field || !sortState.direction) return list

  return list.sort((a, b) => {
    const result = String(a[sortState.field] ?? '').localeCompare(String(b[sortState.field] ?? ''), 'es', { numeric: true, sensitivity: 'base' })
    return sortState.direction === 'asc' ? result : -result
  })
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value) || 1)
const paginatedData = computed(() => sortedData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))

watch(filteredData, () => normalizePage())
watch(itemsPerPage, () => normalizePage())

const normalizePage = () => {
  if (!currentPage.value || currentPage.value < 1) currentPage.value = 1
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
}

const selectRow = (row) => {
  selectedRow.value = selectedRow.value?.id === row.id ? null : row
}

const clearFilter = (field) => {
  filters[field] = ''
  currentPage.value = 1
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

const deactivateRow = () => {
  if (selectedRow.value) {
    selectedRow.value.activo = 'N'
    selectedRow.value.fecha = new Date().toLocaleString('es-AR')
  }
}

const exportExcel = () => {
  if (!filteredData.value.length) return
  downloadExcel({
    filename: 'Relaciones_Jobtype_Contrato.xls',
    title: 'Relaciones Jobtype Contrato',
    columns,
    rows: filteredData.value
  })
}

let resizingField = null
let resizeStartX = 0
let resizeStartWidth = 0

const startColumnResize = (event, field) => {
  resizingField = field
  resizeStartX = event.clientX
  resizeStartWidth = columnWidths[field]
  document.body.classList.add('jobtype-column-resizing')
  document.addEventListener('mousemove', resizeColumn)
  document.addEventListener('mouseup', stopColumnResize)
}

const resizeColumn = (event) => {
  if (!resizingField) return
  const nextWidth = resizeStartWidth + event.clientX - resizeStartX
  columnWidths[resizingField] = Math.max(minWidths[resizingField] || 48, nextWidth)
}

const stopColumnResize = () => {
  resizingField = null
  document.body.classList.remove('jobtype-column-resizing')
  document.removeEventListener('mousemove', resizeColumn)
  document.removeEventListener('mouseup', stopColumnResize)
}

const resetColumnWidth = (field) => {
  const original = columns.find((column) => column.field === field)
  columnWidths[field] = original?.width || 120
}

onBeforeUnmount(() => stopColumnResize())
</script>

<style scoped>
.jobtype-grid-wrapper {
  width: 100%;
  background: #ffffff;
  border-left: 4px solid #00bcd4;
}

.jobtype-grid-scroll {
  width: 100%;
  max-height: 452px;
  overflow: auto;
  border: 1px solid #d1d1d1;
  border-bottom: 0;
  background: #ffffff;
}

.jobtype-grid {
  width: max-content;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  color: #263238;
  font-size: 12px;
  background: #ffffff;
}

.jobtype-grid th,
.jobtype-grid td {
  border-right: 1px solid #c9d3da;
  border-bottom: 1px solid #dce3e8;
  padding: 7px 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #ffffff;
  font-size: 12px;
  line-height: 18px;
}

.jobtype-grid thead th {
  position: sticky;
  z-index: 7;
  background: #f4f7f9;
  color: #2c4050;
  font-weight: 600;
  font-size: 11px;
  resize: none;
}

.jobtype-header-row th {
  top: 0;
  height: 36px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.jobtype-filter-row th {
  top: 36px;
  height: 34px;
  background: #ffffff;
  z-index: 6;
  padding: 4px 5px;
}

.jobtype-sort-button {
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

.jobtype-sort-button:hover {
  color: #008fa1;
}

.jobtype-sort-icons {
  display: inline-flex;
  flex-direction: column;
  color: #aab8c0;
  font-size: 8px;
  line-height: 7px;
  min-width: 9px;
}

.jobtype-sort-icons .active {
  color: #00a9bd;
}

.jobtype-resize-handle {
  position: absolute;
  top: 0;
  right: -3px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 12;
  border-right: 1px solid transparent;
}

.jobtype-resize-handle:hover {
  background: rgba(0, 188, 212, .12);
  border-right-color: #00bcd4;
}

.jobtype-filter-row .filter-prefix {
  display: inline-block;
  width: 14px;
  color: #263238;
}

.jobtype-filter-row input {
  width: calc(100% - 32px);
  height: 24px;
  min-width: 18px;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  padding: 3px 6px;
  outline: none;
  font-size: 11px;
  box-sizing: border-box;
}

.jobtype-filter-row input:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.jobtype-filter-row button {
  border: 0;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  padding: 0 0 0 5px;
  font-size: 12px;
}

.jobtype-grid tbody tr {
  cursor: pointer;
  transition: background-color .15s ease;
}

.jobtype-grid tbody tr:hover td {
  background: #edfafd;
}

.jobtype-grid tbody tr.active-row td {
  background: #d8f7fb;
  color: #003f47;
}

.jobtype-empty {
  text-align: center;
  height: 118px;
  line-height: 118px;
  padding: 0 !important;
  color: #607d8b;
  background: #ffffff;
  font-size: 12px;
}

.jobtype-footer {
  border: 1px solid #d1d1d1;
  border-top: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  min-height: 38px;
  background: #ffffff;
  font-size: 12px;
}

.grid-footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 22px;
  height: 22px;
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000000;
}

.icon-btn .material-icons {
  font-size: 18px;
  line-height: 1;
}

.icon-btn:disabled {
  opacity: .25;
  cursor: not-allowed;
}

.jobtype-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
}

.jobtype-pagination input {
  width: 40px;
  height: 24px;
  text-align: center;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  font-size: 12px;
}

.page-nav {
  border: 0;
  background: transparent;
  color: #263238;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 12px;
}

.page-nav:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.jobtype-page-size {
  width: 64px;
}

.jobtype-count {
  justify-self: end;
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .jobtype-footer {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .jobtype-count {
    justify-self: center;
  }
}
</style>

<style>
body.jobtype-column-resizing,
body.jobtype-column-resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>
