<template>
  <div class="busqueda-ots-page">
    <div class="ots-accordion">
      <button class="ots-accordion-header" type="button" @click="openSearch = !openSearch">
        <span>LISTA DE ORDENES DE TRABAJO A BUSCAR</span>
        <span class="ots-toggle">{{ openSearch ? '−' : '+' }}</span>
      </button>

      <div v-show="openSearch" class="ots-accordion-content ots-search-content">
        <textarea
          v-model="otInput"
          class="ots-textarea"
          placeholder="ESCRIBA LAS OTs SEPARADAS POR COMA"
          @keydown.ctrl.enter.prevent="handleSearch"
        ></textarea>

        <div class="ots-actions">
          <button class="fm-btn fm-btn-primary" type="button" @click="handleSearch">BUSCAR</button>
          <button class="fm-btn fm-btn-outline" type="button" @click="handleClear">LIMPIAR</button>
        </div>
      </div>
    </div>

    <div class="ots-accordion ots-results-accordion">
      <button class="ots-accordion-header" type="button" @click="openResults = !openResults">
        <span>DATOS DE LAS ORDENES DE TRABAJO</span>
        <span class="ots-toggle">{{ openResults ? '−' : '+' }}</span>
      </button>

      <div v-show="openResults" class="ots-accordion-content ots-grid-content">
        <div class="ots-grid-scroll">
          <table class="ots-grid">
            <colgroup>
              <col v-for="column in columns" :key="`col-${column.field}`" :style="columnStyle(column.field)">
            </colgroup>
            <thead>
              <tr class="ots-header-row">
                <th v-for="column in columns" :key="column.field" :style="columnStyle(column.field)">
                  <button class="ots-sort-button" type="button" @click="toggleSort(column.field)">
                    <span>{{ column.label }}</span>
                    <span class="ots-sort-icons">
                      <span :class="{ active: sortState.field === column.field && sortState.direction === 'asc' }">▲</span>
                      <span :class="{ active: sortState.field === column.field && sortState.direction === 'desc' }">▼</span>
                    </span>
                  </button>
                  <span
                    class="ots-resize-handle"
                    title="Arrastrar para achicar o agrandar columna"
                    @mousedown.stop.prevent="startColumnResize($event, column.field)"
                    @dblclick.stop.prevent="resetColumnWidth(column.field)"
                  ></span>
                </th>
              </tr>
              <tr v-show="showFilters" class="ots-filter-row">
                <th v-for="column in columns" :key="`filter-${column.field}`" :style="columnStyle(column.field)">
                  <span class="filter-prefix">~</span>
                  <input type="text" v-model="filters[column.field]" @input="currentPage = 1" @click.stop>
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
                <td :colspan="columns.length" class="ots-empty-cell">
                  <div class="ots-empty-space"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="ots-footer">
          <div class="ots-footer-left">
            <button class="ots-icon-btn" type="button" title="Exportar Excel" :disabled="filteredData.length === 0" @click="exportExcel">
              <span class="material-icons">file_download</span>
            </button>
            <button class="ots-icon-btn" type="button" title="Mostrar/Ocultar filtros" @click="showFilters = !showFilters">
              <span class="material-icons">filter_alt</span>
            </button>
            <button class="ots-icon-btn" type="button" title="Limpiar filtros" @click="clearAllFilters">
              <span class="material-icons">close</span>
            </button>
            <button class="ots-icon-btn" type="button" title="Buscar" @click="handleSearch">
              <span class="material-icons">search</span>
            </button>
          </div>

          <div class="ots-pagination">
            <button class="page-nav" type="button" :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button>
            <button class="page-nav" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--">&lt;</button>
            <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage"> de {{ totalPages || 1 }}</span>
            <button class="page-nav" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++">&gt;</button>
            <button class="page-nav" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages">&gt;|</button>
            <FmTurquoiseSelect v-model="itemsPerPage" :options="itemsPerPageOptions" class="ots-page-size" @change="currentPage = 1" />
          </div>

          <div class="ots-count">
            <template v-if="filteredData.length > 0">
              Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} de {{ filteredData.length }}
            </template>
            <template v-else>No hay resultados</template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import FmTurquoiseSelect from '../shared/FmTurquoiseSelect.vue'
import { downloadExcel } from '../../utils/excelExport.js'

const openSearch = ref(true)
const openResults = ref(true)
const showFilters = ref(false)
const otInput = ref('')
const selectedRow = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(100)
const itemsPerPageOptions = [{ value: 10, label: '10' }, { value: 50, label: '50' }, { value: 100, label: '100' }]

const columns = [
  { field: 'nroOt', label: 'Nro de OT', width: 145, minWidth: 60 },
  { field: 'nroOtSfs', label: 'Nro OT SFS', width: 145, minWidth: 60 },
  { field: 'statusOt', label: 'Status de la OT', width: 145, minWidth: 70 },
  { field: 'statusOtWfx', label: 'Status OT WFX', width: 145, minWidth: 70 },
  { field: 'fechaUltimaModificacion', label: 'Fecha Última Modificación', width: 170, minWidth: 80 },
  { field: 'nroTech', label: 'Nro Tech', width: 145, minWidth: 60 },
  { field: 'nombreTech', label: 'Nombre del Tech', width: 170, minWidth: 80 },
  { field: 'codigoSolucion', label: 'Código de Solución', width: 150, minWidth: 75 },
  { field: 'empresaContratista', label: 'Empresa Contratista', width: 170, minWidth: 85 },
  { field: 'baseTecnica', label: 'Base Técnica', width: 145, minWidth: 70 },
  { field: 'pais', label: 'Pais', width: 145, minWidth: 55 },
  { field: 'actividades', label: 'Actividades', width: 145, minWidth: 70 },
  { field: 'ubicacionOt', label: 'Ubicación de la OT', width: 170, minWidth: 80 }
]

const filters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const sortState = reactive({ field: '', direction: '' })
const columnWidths = reactive(Object.fromEntries(columns.map((column) => [column.field, column.width])))
const minWidths = Object.fromEntries(columns.map((column) => [column.field, column.minWidth]))
const gridData = ref([])

const mockStatuses = ['CERRADA', 'EN CURSO', 'PENDIENTE', 'CANCELADA', 'FINALIZADA']
const mockWfxStatuses = ['COMPLETED', 'ASSIGNED', 'PENDING', 'DISPATCHED', 'CLOSED']
const mockBases = ['BOULOGNE', 'PNT1', 'CBA1', 'PNL1', 'MDQ1', 'OC15']
const mockContratistas = ['NET AND WORK S.A.', 'GREENIN S.A.S.', 'BULLS', 'DUNKEL', 'BRARTEL S.R.L.', 'BAPIRAM S.A.']
const mockTechs = ['23TID240', '11CPD201', '51ROR123', 'U917881', 'u595116', 'FMUSER']
const mockNames = ['Juan Pérez', 'María Gómez', 'Lautaro Buson', 'Operador Técnico', 'Supervisor Redes', 'Técnico Materiales']
const mockTareas = ['70501 - ACOMETIDA SOLO INT', '20050 - CPE dañado', '7982 - Validar Niveles', '90014 - Se instaló CM Internet', '1285 - Instalar Acometida HFC']
const mockUbicaciones = ['DE LUJAN NTRA SRA 1525', 'TERRADA 5404', 'SOLIS 329', 'PERON JUAN DOMINGO', 'CHILE 1326', 'MAGALLANES 283']

const normalize = (value) => String(value ?? '').toLowerCase()
const columnStyle = (field) => ({ width: `${columnWidths[field]}px`, minWidth: `${columnWidths[field]}px`, maxWidth: `${columnWidths[field]}px` })

const parsedOtList = computed(() => otInput.value
  .split(',')
  .map(item => item.trim())
  .filter(Boolean)
)

const filteredData = computed(() => gridData.value.filter(row => columns.every((column) => {
  const filterValue = normalize(filters[column.field])
  if (!filterValue) return true
  return normalize(row[column.field]).includes(filterValue)
})))

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

watch([filteredData, itemsPerPage], () => normalizePage())

const buildRowsFromInput = () => {
  const requestedOts = parsedOtList.value
  if (requestedOts.length === 0) return []

  return requestedOts.map((ot, index) => ({
    id: `${ot}-${index}`,
    nroOt: ot,
    nroOtSfs: `SFS-${String(880000 + index).padStart(7, '0')}`,
    statusOt: mockStatuses[index % mockStatuses.length],
    statusOtWfx: mockWfxStatuses[index % mockWfxStatuses.length],
    fechaUltimaModificacion: `${String(10 + (index % 18)).padStart(2, '0')}/10/2022 ${String(8 + (index % 10)).padStart(2, '0')}:${String(10 + (index % 49)).padStart(2, '0')}`,
    nroTech: mockTechs[index % mockTechs.length],
    nombreTech: mockNames[index % mockNames.length],
    codigoSolucion: ['SOL-001', 'SOL-004', 'SOL-009', 'SOL-013', 'SOL-021'][index % 5],
    empresaContratista: mockContratistas[index % mockContratistas.length],
    baseTecnica: mockBases[index % mockBases.length],
    pais: index % 3 === 0 ? 'ARG' : index % 3 === 1 ? 'UY' : 'PY',
    actividades: mockTareas[index % mockTareas.length],
    ubicacionOt: mockUbicaciones[index % mockUbicaciones.length]
  }))
}

const handleSearch = () => {
  gridData.value = buildRowsFromInput()
  selectedRow.value = null
  currentPage.value = 1
  openResults.value = true
}

const handleClear = () => {
  otInput.value = ''
  gridData.value = []
  selectedRow.value = null
  currentPage.value = 1
  clearAllFilters()
}

const selectRow = (row) => {
  selectedRow.value = selectedRow.value?.id === row.id ? null : row
}

const clearFilter = (field) => {
  filters[field] = ''
  currentPage.value = 1
}

const clearAllFilters = () => {
  columns.forEach(column => { filters[column.field] = '' })
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

const normalizePage = () => {
  if (!currentPage.value || currentPage.value < 1) currentPage.value = 1
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
}

const exportExcel = () => {
  if (!filteredData.value.length) return
  downloadExcel({
    filename: 'Busqueda_OTs.xls',
    title: 'Datos de las Órdenes de Trabajo',
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
  document.body.classList.add('ots-column-resizing')
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
  document.body.classList.remove('ots-column-resizing')
  document.removeEventListener('mousemove', resizeColumn)
  document.removeEventListener('mouseup', stopColumnResize)
}

const resetColumnWidth = (field) => {
  const original = columns.find(column => column.field === field)
  columnWidths[field] = original?.width || 120
}

onBeforeUnmount(() => stopColumnResize())
</script>

<style scoped>
.busqueda-ots-page {
  width: 100%;
}

.ots-accordion {
  border: 1px solid #d8d8d8;
  background: #ffffff;
  margin-bottom: 6px;
}

.ots-accordion-header {
  width: 100%;
  min-height: 28px;
  border: 0;
  border-bottom: 1px solid #d8d8d8;
  background: #f7f7f7;
  color: #263238;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 9px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.ots-toggle {
  font-size: 20px;
  line-height: 1;
  font-weight: 400;
}

.ots-accordion-content {
  border-left: 4px solid #00bcd4;
  background: #ffffff;
}

.ots-search-content {
  padding: 12px 18px 18px;
}

.ots-textarea {
  width: 100%;
  min-height: 178px;
  resize: vertical;
  border: 1px solid #c7c7c7;
  border-radius: 3px;
  padding: 10px 12px;
  font-size: 12px;
  color: #263238;
  outline: none;
  font-family: Arial, Helvetica, sans-serif;
}

.ots-textarea:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.ots-textarea::placeholder {
  color: #607d8b;
  text-transform: uppercase;
}

.ots-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}

.fm-btn {
  min-width: 68px;
  min-height: 28px;
  border-radius: 16px;
  padding: 6px 15px;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease, color .18s ease;
}

.fm-btn-primary {
  border: 1px solid #00a9bd;
  background: #00a9bd;
  color: #ffffff;
}

.fm-btn-primary:hover {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 4px 10px rgba(0, 143, 161, .22);
}

.fm-btn-outline {
  border: 1px solid #00a9bd;
  background: #ffffff;
  color: #008fa1;
}

.fm-btn-outline:hover {
  background: #e0f7fa;
  color: #006f7f;
  box-shadow: 0 4px 10px rgba(0, 143, 161, .14);
}

.ots-grid-content {
  padding: 0;
}

.ots-grid-scroll {
  width: 100%;
  height: calc(100vh - 360px);
  min-height: 355px;
  overflow: auto;
  border-bottom: 1px solid #d0d7de;
}

.ots-grid {
  width: max-content;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  color: #263238;
  font-size: 12px;
}

.ots-grid th,
.ots-grid td {
  border-right: 1px solid #c9d3da;
  border-bottom: 1px solid #dce3e8;
  padding: 7px 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.ots-grid thead th {
  position: sticky;
  z-index: 7;
  background: #f4f7f9;
  color: #2c4050;
  font-weight: 600;
  font-size: 11px;
}

.ots-header-row th {
  top: 0;
  height: 36px;
}

.ots-filter-row th {
  top: 36px;
  height: 34px;
  background: #ffffff;
  z-index: 6;
  padding: 4px 5px;
}

.ots-sort-button {
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

.ots-sort-button:hover {
  color: #008fa1;
}

.ots-sort-icons {
  display: inline-flex;
  flex-direction: column;
  color: #aab8c0;
  font-size: 8px;
  line-height: 7px;
  min-width: 9px;
}

.ots-sort-icons .active {
  color: #00a9bd;
}

.ots-resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  width: 9px;
  height: 100%;
  cursor: col-resize;
  z-index: 12;
  border-right: 2px solid transparent;
}

.ots-resize-handle:hover {
  background: rgba(0, 188, 212, .12);
  border-right-color: #00bcd4;
}

.ots-filter-row .filter-prefix {
  margin-right: 3px;
  color: #263238;
  font-size: 11px;
}

.ots-filter-row input {
  width: min(100%, calc(100% - 20px));
  height: 22px;
  min-width: 18px;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  padding: 2px 5px;
  outline: none;
  font-size: 11px;
}

.ots-filter-row input:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.ots-filter-row button {
  border: 0;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  padding: 0 0 0 3px;
  font-size: 11px;
}

.ots-grid tbody tr {
  cursor: pointer;
  transition: background-color .15s ease;
}

.ots-grid tbody tr:hover td {
  background: #edfafd;
}

.ots-grid tbody tr.active-row td {
  background: #9eeff7;
  color: #003f47;
}

.ots-empty-cell {
  padding: 0 !important;
  border-right: 0 !important;
}

.ots-empty-space {
  min-height: 315px;
  background: #ffffff;
}

.ots-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  min-height: 38px;
  background: #ffffff;
  font-size: 12px;
}

.ots-footer-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ots-icon-btn {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #263238;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color .18s ease, color .18s ease;
}

.ots-icon-btn:hover:not(:disabled) {
  background: #e0f7fa;
  color: #008fa1;
}

.ots-icon-btn:disabled {
  color: #cfd8dc;
  cursor: not-allowed;
}

.ots-icon-btn .material-icons {
  font-size: 17px;
  font-weight: 400;
}

.ots-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
}

.ots-pagination input {
  width: 42px;
  height: 24px;
  text-align: center;
  border: 1px solid #c7d1d8;
  border-radius: 4px;
  font-size: 12px;
}

.page-nav {
  border: 0;
  background: transparent;
  color: #263238;
  cursor: pointer;
  padding: 1px 3px;
  font-size: 12px;
}

.page-nav:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.ots-page-size {
  width: 60px;
  font-size: 12px;
}

.ots-count {
  justify-self: end;
  font-size: 12px;
  font-weight: 400;
  color: #263238;
}

@media (max-width: 900px) {
  .ots-search-content {
    padding: 10px;
  }

  .ots-textarea {
    min-height: 145px;
  }

  .ots-footer {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .ots-count {
    justify-self: center;
  }

  .ots-grid-scroll {
    height: 470px;
  }
}
</style>

<style>
body.ots-column-resizing,
body.ots-column-resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>
