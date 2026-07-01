<template>
  <div class="materiales-grid-wrapper">
    <div class="materiales-column-selector">
      <button class="materiales-column-btn" type="button" @click="showColumnConfig = !showColumnConfig">
        <span class="material-icons">view_column</span>
        <span>Configurar Columnas</span>
      </button>
      <div class="materiales-column-dropdown" v-if="showColumnConfig">
        <label v-for="col in cols" :key="col.field"><input type="checkbox" v-model="col.visible"> {{ col.label }}</label>
      </div>
    </div>

    <div class="materiales-grid-scroll">
      <table class="materiales-grid-table">
        <colgroup>
          <col style="width:38px;min-width:38px;max-width:38px" />
          <col style="width:70px;min-width:70px;max-width:70px" />
          <col v-for="col in visibleCols" :key="`col-${col.field}`" :style="columnStyle(col.field)" />
        </colgroup>

        <thead>
          <tr class="materiales-grid-head-row">
            <th class="check-col"><input type="checkbox" :checked="isAllPageSelected" :disabled="paginatedData.length === 0" @change="toggleSelectAllPage"></th>
            <th class="action-col">ACCIÓN</th>
            <th v-for="col in visibleCols" :key="col.field" class="resizable-th" :style="columnStyle(col.field)">
              <button class="materiales-sort-header" type="button" @click="toggleSort(col.field)">
                <span>{{ col.label }}</span>
                <span class="materiales-sort-icons">
                  <span :class="{ on: sortState.field === col.field && sortState.direction === 'asc' }">▲</span>
                  <span :class="{ on: sortState.field === col.field && sortState.direction === 'desc' }">▼</span>
                </span>
              </button>
              <span class="materiales-resize-handle" @mousedown.stop.prevent="startColumnResize($event, col.field)" @dblclick.stop.prevent="resetColumnWidth(col.field)"></span>
            </th>
          </tr>

          <tr class="materiales-filter-row">
            <th class="check-col"></th>
            <th class="action-col"></th>
            <th v-for="col in visibleCols" :key="`filter-${col.field}`" :style="columnStyle(col.field)">
              <span class="filter-prefix">~</span>
              <input type="text" v-model="filters[col.field]" @input="currentPage = 1" @click.stop>
              <button type="button" @click.stop="clearFilter(col.field)">x</button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="paginatedData.length === 0" class="empty-tr">
            <td :colspan="visibleCols.length + 2">No hay resultados</td>
          </tr>
          <tr v-for="row in paginatedData" :key="row.id" :class="{ selected: isSelected(row) }" @click="toggleRow(row)">
            <td class="check-col" @click.stop><input type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)"></td>
            <td class="action-col" @click.stop><button class="materiales-row-action" @click="$emit('edit-ot', $event, row)" title="Ver Detalle OT"><span class="material-icons">edit_note</span></button></td>
            <td v-for="col in visibleCols" :key="`${row.id}-${col.field}`" :style="columnStyle(col.field)">{{ row[col.field] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="materiales-grid-footer">
      <div class="materiales-footer-left">
        <button class="materiales-footer-icon" title="Exportar Vista" @click="exportVisibleCsv" :disabled="filteredData.length === 0">
          <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10"></path><path d="M8.5 10.8 12 14.3l3.5-3.5"></path><path d="M6 16.5v3h12v-3"></path></svg>
        </button>
        <button class="materiales-footer-icon" title="Configurar Grilla" @click="showColumnConfig = !showColumnConfig">
          <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3"></path><path d="M12 18v3"></path><path d="M4.2 7.5l2.6 1.5"></path><path d="M17.2 15l2.6 1.5"></path><path d="M4.2 16.5 6.8 15"></path><path d="M17.2 9l2.6-1.5"></path><circle cx="12" cy="12" r="4"></circle></svg>
        </button>
        <button class="materiales-footer-icon" title="Agregar Material" @click="$emit('add-material')">
          <svg class="fm-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
        </button>
      </div>

      <div class="materiales-footer-pages">
        <button :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button>
        <button :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
        <span>Página</span>
        <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage">
        <span>de {{ totalPages || 1 }}</span>
        <button :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        <button :disabled="currentPage >= totalPages" @click="currentPage = totalPages">&gt;|</button>
        <select v-model.number="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <div class="materiales-footer-count">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredData.length }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onBeforeUnmount } from 'vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const props = defineProps(['data', 'columns', 'modelValue'])
const emit = defineEmits(['update:modelValue', 'update:visibleCols', 'edit-ot', 'add-material'])

const cols = reactive(props.columns.map((column) => ({ ...column })))
const filters = reactive({})
const showColumnConfig = ref(false)
const localSelected = ref([...props.modelValue])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortState = reactive({ field: '', direction: '' })
const columnWidths = reactive({})
const initialColumnWidths = reactive({})

const setupColumns = () => {
  cols.forEach((column) => {
    filters[column.field] = filters[column.field] || ''
    const width = column.width || guessColumnWidth(column)
    if (!columnWidths[column.field]) columnWidths[column.field] = width
    if (!initialColumnWidths[column.field]) initialColumnWidths[column.field] = width
  })
}

const guessColumnWidth = (column) => {
  const labelSize = String(column.label || column.field || '').length * 9 + 50
  return Math.max(110, Math.min(labelSize, 240))
}

setupColumns()

const visibleCols = computed(() => cols.filter(c => c.visible))

watch(visibleCols, (newVal) => { emit('update:visibleCols', newVal) }, { deep: true, immediate: true })

const normalized = (value) => String(value || '').toLowerCase()
const filteredData = computed(() => props.data.filter(row => visibleCols.value.every(col => {
  const filterVal = normalized(filters[col.field])
  if (!filterVal) return true
  return normalized(row[col.field]).includes(filterVal)
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
const fromRow = computed(() => filteredData.value.length ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length))

const selectedIdSet = computed(() => new Set(localSelected.value.map(item => item.id)))
const isSelected = (row) => selectedIdSet.value.has(row.id)
const isAllPageSelected = computed(() => paginatedData.value.length > 0 && paginatedData.value.every(item => isSelected(item)))

const normalizePage = () => {
  if (!currentPage.value || currentPage.value < 1) currentPage.value = 1
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
}

const toggleSelectAllPage = (e) => {
  const checked = e.target.checked
  paginatedData.value.forEach(item => {
    const exists = localSelected.value.findIndex(sel => sel.id === item.id)
    if (checked && exists === -1) localSelected.value.push(item)
    if (!checked && exists !== -1) localSelected.value.splice(exists, 1)
  })
  emitSelection()
}

const toggleRow = (row) => {
  const exists = localSelected.value.findIndex(sel => sel.id === row.id)
  if (exists === -1) localSelected.value.push(row)
  else localSelected.value.splice(exists, 1)
  emitSelection()
}

const emitSelection = () => emit('update:modelValue', localSelected.value)
const clearFilter = (field) => { filters[field] = ''; currentPage.value = 1 }
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

const exportVisibleCsv = () => {
  if (!filteredData.value.length || !visibleCols.value.length) return
  const headers = visibleCols.value.map((column) => column.label)
  const rows = filteredData.value.map((row) => visibleCols.value.map((column) => row[column.field]))
  downloadCsv('materiales_vista.csv', buildCsv(headers, rows))
}

const columnStyle = (field) => ({ width: `${columnWidths[field] || 130}px`, minWidth: `${columnWidths[field] || 130}px`, maxWidth: `${columnWidths[field] || 130}px` })
let resizingField = null
let resizeStartX = 0
let resizeStartWidth = 0
const startColumnResize = (event, field) => {
  resizingField = field
  resizeStartX = event.clientX
  resizeStartWidth = columnWidths[field] || 130
  document.body.classList.add('materiales-column-resizing')
  document.addEventListener('mousemove', resizeColumn)
  document.addEventListener('mouseup', stopColumnResize)
}
const resizeColumn = (event) => {
  if (!resizingField) return
  columnWidths[resizingField] = Math.max(42, resizeStartWidth + event.clientX - resizeStartX)
}
const stopColumnResize = () => {
  resizingField = null
  document.body.classList.remove('materiales-column-resizing')
  document.removeEventListener('mousemove', resizeColumn)
  document.removeEventListener('mouseup', stopColumnResize)
}
const resetColumnWidth = (field) => {
  columnWidths[field] = initialColumnWidths[field] || 130
}

watch(() => props.modelValue, (newVal) => { localSelected.value = [...newVal] }, { deep: true })
watch(() => props.data, () => { currentPage.value = 1; localSelected.value = []; emitSelection() }, { deep: true })
watch(() => props.columns, (newColumns) => {
  cols.splice(0, cols.length, ...newColumns.map((column) => ({ ...column })))
  Object.keys(filters).forEach((key) => { if (!cols.some(c => c.field === key)) delete filters[key] })
  setupColumns()
  currentPage.value = 1
}, { deep: true })
watch(totalPages, normalizePage)
watch(itemsPerPage, () => { currentPage.value = 1; normalizePage() })
onBeforeUnmount(stopColumnResize)
</script>

<style scoped>
.materiales-grid-wrapper {
  width: 100%;
  background: #fff;
  border-left: 4px solid #00bcd4;
}

.materiales-column-selector {
  position: relative;
  padding: 8px 10px;
  border: 1px solid #d1d1d1;
  border-bottom: 0;
  background: #fff;
}

.materiales-column-btn {
  height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #00a9bd;
  border-radius: 16px;
  background: #fff;
  color: #00a9bd;
  padding: 0 12px;
  font-size: 12px;
  cursor: pointer;
}

.materiales-column-btn:hover {
  background: #e0f7fa;
}

.materiales-column-btn .material-icons {
  font-size: 15px;
}

.materiales-column-dropdown {
  position: absolute;
  z-index: 60;
  top: 40px;
  left: 10px;
  width: 260px;
  max-height: 310px;
  overflow: auto;
  border: 1px solid #00bcd4;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(0,0,0,.16);
  padding: 8px;
}

.materiales-column-dropdown label {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px;
  font-size: 12px;
}

.materiales-grid-scroll {
  width: 100%;
  height: 390px;
  overflow: auto;
  border: 1px solid #d1d1d1;
  border-bottom: 0;
  background: #fff;
}

.materiales-grid-table {
  width: max-content;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  color: #263238;
  font-size: 12px;
  background: #fff;
}

.materiales-grid-table th,
.materiales-grid-table td {
  border-right: 1px solid #c9d3da;
  border-bottom: 1px solid #dce3e8;
  padding: 7px 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fff;
  font-size: 12px;
  line-height: 18px;
}

.materiales-grid-table thead th {
  position: sticky;
  z-index: 7;
  background: #f4f7f9;
  color: #2c4050;
  font-weight: 600;
  font-size: 11px;
}

.materiales-grid-head-row th {
  top: 0;
  height: 36px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.materiales-filter-row th {
  top: 36px;
  height: 34px;
  background: #fff;
  z-index: 6;
  padding: 4px 5px;
}

.check-col,
.action-col {
  text-align: center !important;
}

.materiales-grid-table input[type='checkbox'],
.materiales-column-dropdown input[type='checkbox'] {
  width: 14px;
  height: 14px;
  accent-color: #00bcd4;
}

.materiales-sort-header {
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

.materiales-sort-icons {
  display: inline-flex;
  flex-direction: column;
  color: #aab8c0;
  font-size: 8px;
  line-height: 7px;
  min-width: 9px;
}

.materiales-sort-icons .on {
  color: #00a9bd;
}

.materiales-resize-handle {
  position: absolute;
  top: 0;
  right: -3px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 12;
}

.materiales-resize-handle:hover {
  background: rgba(0, 188, 212, .12);
  border-right: 1px solid #00bcd4;
}

.materiales-filter-row .filter-prefix {
  display: inline-block;
  width: 14px;
}

.materiales-filter-row input {
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

.materiales-filter-row input:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.materiales-filter-row button {
  border: 0;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  padding: 0 0 0 5px;
  font-size: 12px;
}

.materiales-grid-table tbody tr {
  cursor: pointer;
}

.materiales-grid-table tbody tr:hover td {
  background: #edfafd;
}

.materiales-grid-table tbody tr.selected td {
  background: #d8f7fb;
  color: #003f47;
}

.empty-tr td {
  height: 220px;
  text-align: center;
  color: #607d8b;
  background: #fff;
  vertical-align: middle;
}

.materiales-row-action {
  border: 0;
  background: transparent;
  color: #455a64;
  cursor: pointer;
  padding: 0;
}

.materiales-row-action:hover {
  color: #00a9bd;
}

.materiales-row-action .material-icons {
  font-size: 18px;
}

.materiales-grid-footer {
  border: 1px solid #d1d1d1;
  border-top: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  min-height: 38px;
  background: #fff;
  font-size: 12px;
}

.materiales-footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.materiales-footer-icon {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #455a64;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color .16s ease, background-color .16s ease, transform .16s ease, box-shadow .16s ease;
}

.materiales-footer-icon .fm-svg-icon {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.materiales-footer-icon:hover:not(:disabled) {
  color: #00a9bd;
  background: #e0f7fa;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,169,189,.18);
}

.materiales-footer-icon:disabled {
  cursor: not-allowed;
  opacity: .35;
}

.materiales-footer-pages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.materiales-footer-pages button {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #263238;
  padding: 2px 4px;
}

.materiales-footer-pages button:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.materiales-footer-pages input {
  width: 40px;
  height: 24px;
  text-align: center;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
}

.materiales-footer-pages input:focus,
.materiales-footer-pages select:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0,188,212,.15);
}

.materiales-footer-pages select {
  height: 26px;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  background: #fff;
  accent-color: #00bcd4;
}

.materiales-footer-count {
  justify-self: end;
  white-space: nowrap;
}
</style>

<style>
body.materiales-column-resizing,
body.materiales-column-resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>
