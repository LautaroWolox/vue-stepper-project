<template>
  <div class="reporte-sas-page">
    <div class="sas-accordion">
      <button class="sas-accordion-header" type="button" @click="openReport = !openReport">
        <span>REPORTE SAS</span>
        <span class="sas-toggle">{{ openReport ? '−' : '+' }}</span>
      </button>

      <div v-show="openReport" class="sas-accordion-content">
        <div class="sas-grid-toolbar">
          <div class="sas-column-selector" ref="columnSelectorRef">
            <button class="sas-toolbar-btn" type="button" @click="showColumnPanel = !showColumnPanel">
              <span class="material-icons">view_column</span>
              Columnas visibles
            </button>

            <div v-if="showColumnPanel" class="sas-column-panel">
              <div class="sas-column-panel-header">
                <strong>Seleccionar columnas</strong>
                <button type="button" @click="showFirstFive">Primeras 5</button>
              </div>
              <div class="sas-column-list">
                <label v-for="column in allColumns" :key="column.field" class="sas-column-option">
                  <input
                    type="checkbox"
                    :checked="visibleColumnFields.includes(column.field)"
                    @change="toggleColumn(column.field)"
                  >
                  <span>{{ column.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="sas-grid-scroll">
          <table class="sas-grid">
            <colgroup>
              <col v-for="column in visibleColumns" :key="`col-${column.field}`" :style="columnStyle(column.field)">
            </colgroup>
            <thead>
              <tr class="sas-header-row">
                <th v-for="column in visibleColumns" :key="column.field" :style="columnStyle(column.field)">
                  <button class="sas-sort-button" type="button" @click="toggleSort(column.field)">
                    <span>{{ column.label }}</span>
                    <span class="sas-sort-icons">
                      <span :class="{ active: sortState.field === column.field && sortState.direction === 'asc' }">▲</span>
                      <span :class="{ active: sortState.field === column.field && sortState.direction === 'desc' }">▼</span>
                    </span>
                  </button>
                  <span
                    class="sas-resize-handle"
                    title="Arrastrar para achicar o agrandar columna"
                    @mousedown.stop.prevent="startColumnResize($event, column.field)"
                    @dblclick.stop.prevent="resetColumnWidth(column.field)"
                  ></span>
                </th>
              </tr>
              <tr class="sas-filter-row">
                <th v-for="column in visibleColumns" :key="`filter-${column.field}`" :style="columnStyle(column.field)">
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
                <td v-for="column in visibleColumns" :key="`${row.id}-${column.field}`" :style="columnStyle(column.field)">
                  {{ row[column.field] }}
                </td>
              </tr>
              <tr v-if="paginatedData.length === 0">
                <td :colspan="visibleColumns.length" class="sas-empty">No hay resultados con estos filtros.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sas-footer">
          <div class="sas-footer-left">
            <button class="icon-btn sas-icon-btn" title="Exportar Excel completo" type="button" @click="exportExcel">
              <span class="material-icons">file_download</span>
            </button>
          </div>

          <div class="modern-pagination sas-pagination">
            <button class="page-nav" type="button" :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button>
            <button class="page-nav" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--">&lt;</button>
            <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1" @change="normalizePage"> de {{ totalPages || 1 }}</span>
            <button class="page-nav" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++">&gt;</button>
            <button class="page-nav" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages">&gt;|</button>
            <FmTurquoiseSelect v-model="itemsPerPage" :options="itemsPerPageOptions" class="sas-page-size" @change="currentPage = 1" />
          </div>

          <div class="sas-count">
            Mostrando {{ filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} de {{ filteredData.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import FmTurquoiseSelect from '../shared/FmTurquoiseSelect.vue'
import { downloadExcel } from '../../utils/excelExport.js'

const openReport = ref(true)
const showColumnPanel = ref(false)
const selectedRow = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const columnSelectorRef = ref(null)
const itemsPerPageOptions = [{ value: 10, label: '10' }, { value: 50, label: '50' }, { value: 100, label: '100' }]

const allColumns = [
  { field: 'nro_ot', label: 'NRO_OT', width: 120, minWidth: 52 },
  { field: 'estado_ot', label: 'ESTADO_OT', width: 135, minWidth: 52 },
  { field: 'gestionada', label: 'GESTIONADA', width: 135, minWidth: 52 },
  { field: 'codigo_tarea', label: 'CODIGO_TAREA', width: 160, minWidth: 58 },
  { field: 'localidad', label: 'LOCALIDAD', width: 145, minWidth: 58 },
  { field: 'codigo_postal', label: 'CODIGO_POSTAL', width: 150, minWidth: 58 },
  { field: 'legajo_operador_descarga', label: 'LEGAJO_OPERADOR_DESCARGA', width: 235, minWidth: 80 },
  { field: 'nombre_apellido_operador_descarga', label: 'NOMBRE_APELLIDO_OPERADOR_DESCARGA', width: 300, minWidth: 100 },
  { field: 'fecha_descarga', label: 'FECHA_DESCARGA', width: 190, minWidth: 70 },
  { field: 'legajo_cierre_ot', label: 'LEGAJO_CIERRE_OT', width: 190, minWidth: 70 },
  { field: 'nombre_apellido_cierre_ot', label: 'NOMBRE_APELLIDO_CIERRE_OT', width: 260, minWidth: 90 },
  { field: 'legajo_noldap', label: 'LEGAJO_NOLDAP', width: 170, minWidth: 65 },
  { field: 'fecha_cierre_ot', label: 'FECHA_CIERRE_OT', width: 190, minWidth: 70 },
  { field: 'centro', label: 'CENTRO', width: 130, minWidth: 52 },
  { field: 'almacen', label: 'ALMACEN', width: 130, minWidth: 52 },
  { field: 'serial_cod_material', label: 'SERIAL_COD_MATERIAL', width: 210, minWidth: 80 },
  { field: 'desc_material', label: 'DESC_MATERIAL', width: 230, minWidth: 80 },
  { field: 'cantidad_material', label: 'CANTIDAD_MATERIAL', width: 180, minWidth: 70 },
  { field: 'tipo_descarga', label: 'TIPO_DESCARGA', width: 180, minWidth: 70 },
  { field: 'mensaje_sap', label: 'MENSAJE_SAP', width: 250, minWidth: 90 },
  { field: 'fecha_notificacion', label: 'FECHA_NOTIFICACION', width: 200, minWidth: 80 }
]

const visibleColumnFields = ref(allColumns.slice(0, 5).map(column => column.field))
const filters = reactive(Object.fromEntries(allColumns.map((column) => [column.field, ''])))
const sortState = reactive({ field: '', direction: '' })
const columnWidths = reactive(Object.fromEntries(allColumns.map((column) => [column.field, column.width])))
const minWidths = Object.fromEntries(allColumns.map((column) => [column.field, column.minWidth]))

const localidades = ['ROSARIO', 'TIGRE', 'RESISTENCIA', 'CORDOBA', 'QUILMES OESTE', 'CARCARAÑÁ', 'VIRREYES', 'BANFIELD', 'GRAL PACHECO', 'LA PLATA']
const provincias = ['SANTA FE', 'BUENOS AIRES', 'CHACO', 'CORDOBA', 'BUENOS AIRES', 'SANTA FE', 'BUENOS AIRES', 'BUENOS AIRES', 'BUENOS AIRES', 'BUENOS AIRES']
const centros = ['PNT1', 'CBA1', 'PNL1', 'MDQ1', 'OC15', 'OC01']
const almacenes = ['ALM-001', 'ALM-004', 'ALM-007', 'ALM-010', 'ALM-013', 'OC15']
const materiales = [
  { serial: '01728308147', desc: 'Cable Coaxial RG6' },
  { serial: '1936ADB10LT09200', desc: 'Conector F' },
  { serial: '319118033316', desc: 'Modem HFC' },
  { serial: '48575443C4B1689F', desc: 'Splitter 2 bocas' },
  { serial: '318016011562', desc: 'Patch Cord UTP' }
]

const reportRows = ref(Array.from({ length: 100 }, (_, index) => {
  const material = materiales[index % materiales.length]
  const gestionada = index % 4 === 0 ? 'N' : 'S'
  return {
    id: index + 1,
    nro_ot: `OT-${String(780000 + index).padStart(7, '0')}`,
    estado_ot: index % 5 === 0 ? 'PENDIENTE' : index % 3 === 0 ? 'CERRADA' : 'DESCARGADA',
    gestionada,
    codigo_tarea: ['9HDA0', 'RCD13', '9DSCP', 'GIACN', '9AM01'][index % 5],
    localidad: localidades[index % localidades.length],
    codigo_postal: `${1000 + (index % 9000)}`,
    legajo_operador_descarga: ['51ROR123', 'u595116', '23SRR107', 'U917881', 'FMUSER'][index % 5],
    nombre_apellido_operador_descarga: ['JOPARA-Nombre JOPARA-Apellido', 'ADMIN-Nombre ADMIN-Apellido', 'FMUSER-Nombre FMUSER-Apellido', 'MBUSON-Nombre MBUSON-Apellido'][index % 4],
    fecha_descarga: `${String(10 + (index % 18)).padStart(2, '0')}/10/2022 ${String(8 + (index % 10)).padStart(2, '0')}:${String(10 + (index % 49)).padStart(2, '0')}`,
    legajo_cierre_ot: ['23TID240', '11CPD201', 'z002456', 'FM910096', 'FM921526'][index % 5],
    nombre_apellido_cierre_ot: ['Lautaro Buson', 'Operador Cierre', 'Supervisor Redes', 'Técnico Materiales'][index % 4],
    legajo_noldap: ['NOLDAP01', 'NOLDAP02', 'NOLDAP03', 'NOLDAP04'][index % 4],
    fecha_cierre_ot: `${String(11 + (index % 17)).padStart(2, '0')}/10/2022 ${String(9 + (index % 9)).padStart(2, '0')}:${String(12 + (index % 43)).padStart(2, '0')}`,
    centro: centros[index % centros.length],
    almacen: almacenes[index % almacenes.length],
    serial_cod_material: material.serial,
    desc_material: material.desc,
    cantidad_material: String((index % 8) + 1),
    tipo_descarga: index % 2 === 0 ? 'AUTOMÁTICA' : 'MANUAL',
    mensaje_sap: index % 4 === 0 ? 'No existen equivalencias de material recupero' : index % 4 === 1 ? 'Posting only possible in periods 2026/05 and 2026/04' : 'Descarga procesada correctamente',
    fecha_notificacion: `${String(12 + (index % 15)).padStart(2, '0')}/10/2022 ${String(10 + (index % 7)).padStart(2, '0')}:${String(11 + (index % 40)).padStart(2, '0')}`,
    provincia: provincias[index % provincias.length]
  }
}))

const visibleColumns = computed(() => allColumns.filter(column => visibleColumnFields.value.includes(column.field)))
const normalize = (value) => String(value ?? '').toLowerCase()
const columnStyle = (field) => ({ width: `${columnWidths[field]}px`, minWidth: `${columnWidths[field]}px`, maxWidth: `${columnWidths[field]}px` })

const filteredData = computed(() => reportRows.value.filter(row => visibleColumns.value.every((column) => {
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

const toggleColumn = (field) => {
  if (visibleColumnFields.value.includes(field)) {
    if (visibleColumnFields.value.length === 1) return
    visibleColumnFields.value = visibleColumnFields.value.filter(item => item !== field)
  } else {
    visibleColumnFields.value = [...visibleColumnFields.value, field]
  }
  currentPage.value = 1
}

const showFirstFive = () => {
  visibleColumnFields.value = allColumns.slice(0, 5).map(column => column.field)
  currentPage.value = 1
}

const exportExcel = () => {
  downloadExcel({
    filename: 'Reporte_SAS_Extraccion_Datos_GM.xls',
    title: 'Reporte SAS',
    columns: allColumns,
    rows: reportRows.value
  })
}

let resizingField = null
let resizeStartX = 0
let resizeStartWidth = 0

const startColumnResize = (event, field) => {
  resizingField = field
  resizeStartX = event.clientX
  resizeStartWidth = columnWidths[field]
  document.body.classList.add('sas-column-resizing')
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
  document.body.classList.remove('sas-column-resizing')
  document.removeEventListener('mousemove', resizeColumn)
  document.removeEventListener('mouseup', stopColumnResize)
}

const resetColumnWidth = (field) => {
  const original = allColumns.find(column => column.field === field)
  columnWidths[field] = original?.width || 120
}

const closeColumnPanel = (event) => {
  if (!columnSelectorRef.value || columnSelectorRef.value.contains(event.target)) return
  showColumnPanel.value = false
}

onMounted(() => document.addEventListener('mousedown', closeColumnPanel))
onBeforeUnmount(() => {
  stopColumnResize()
  document.removeEventListener('mousedown', closeColumnPanel)
})
</script>

<style scoped>
.reporte-sas-page {
  width: 100%;
}

.sas-accordion {
  border: 1px solid #d8d8d8;
  background: #ffffff;
}

.sas-accordion-header {
  width: 100%;
  min-height: 30px;
  border: 0;
  border-bottom: 1px solid #d8d8d8;
  background: #f7f7f7;
  color: #263238;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.sas-toggle {
  font-size: 22px;
  line-height: 1;
  font-weight: 400;
}

.sas-accordion-content {
  border-left: 4px solid #00bcd4;
  background: #ffffff;
}

.sas-grid-toolbar {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 7px 10px;
  border-bottom: 1px solid #d8d8d8;
  background: #fbfdfe;
}

.sas-column-selector {
  position: relative;
  z-index: 25;
}

.sas-toolbar-btn {
  min-height: 30px;
  border: 1px solid #00a9bd;
  border-radius: 18px;
  background: #ffffff;
  color: #008fa1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color .18s ease, color .18s ease, box-shadow .18s ease;
}

.sas-toolbar-btn:hover {
  background: #008fa1;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 143, 161, .22);
}

.sas-toolbar-btn .material-icons {
  font-size: 17px;
}

.sas-column-panel {
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  width: 330px;
  max-width: calc(100vw - 35px);
  max-height: 360px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #00a9bd;
  border-radius: 6px;
  box-shadow: 0 14px 32px rgba(38, 50, 56, .24);
  z-index: 40;
}

.sas-column-panel-header {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-bottom: 1px solid #e1e8ec;
  color: #263238;
}

.sas-column-panel-header strong {
  font-size: 13px;
  font-weight: 600;
}

.sas-column-panel-header button {
  border: 1px solid #00a9bd;
  border-radius: 14px;
  background: #ffffff;
  color: #008fa1;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
}

.sas-column-panel-header button:hover {
  background: #008fa1;
  color: #ffffff;
}

.sas-column-list {
  max-height: 315px;
  overflow-y: auto;
  padding: 7px 0;
}

.sas-column-option {
  min-height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  color: #263238;
  cursor: pointer;
  font-size: 13px;
}

.sas-column-option:hover {
  background: #e0f7fa;
}

.sas-column-option input {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1px solid #9fb0ba;
  border-radius: 2px;
  background: #ffffff;
  cursor: pointer;
  position: relative;
}

.sas-column-option input:checked {
  background: #00a9bd;
  border-color: #00a9bd;
}

.sas-column-option input:checked::after {
  content: '✓';
  position: absolute;
  top: -4px;
  left: 2px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.sas-grid-scroll {
  width: 100%;
  height: calc(100vh - 230px);
  min-height: 430px;
  overflow: auto;
  border-bottom: 1px solid #d0d7de;
}

.sas-grid {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  color: #263238;
  font-size: 14px;
}

.sas-grid th,
.sas-grid td {
  border-right: 1px solid #c9d3da;
  border-bottom: 1px solid #dce3e8;
  padding: 9px 10px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sas-grid thead th {
  position: sticky;
  z-index: 7;
  background: #f4f7f9;
  color: #2c4050;
  font-weight: 600;
}

.sas-header-row th {
  top: 0;
  height: 38px;
}

.sas-filter-row th {
  top: 38px;
  height: 38px;
  background: #ffffff;
  z-index: 6;
  padding: 5px;
}

.sas-sort-button {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.sas-sort-button:hover {
  color: #008fa1;
}

.sas-sort-icons {
  display: inline-flex;
  flex-direction: column;
  color: #aab8c0;
  font-size: 9px;
  line-height: 8px;
  min-width: 10px;
}

.sas-sort-icons .active {
  color: #00a9bd;
}

.sas-resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  width: 9px;
  height: 100%;
  cursor: col-resize;
  z-index: 12;
  border-right: 2px solid transparent;
}

.sas-resize-handle:hover {
  background: rgba(0, 188, 212, .12);
  border-right-color: #00bcd4;
}

.sas-filter-row .filter-prefix {
  margin-right: 4px;
  color: #263238;
}

.sas-filter-row input {
  width: min(100%, calc(100% - 22px));
  height: 25px;
  min-width: 20px;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  padding: 3px 6px;
  outline: none;
}

.sas-filter-row input:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .14);
}

.sas-filter-row button {
  border: 0;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  padding: 0 0 0 4px;
}

.sas-grid tbody tr {
  cursor: pointer;
  transition: background-color .15s ease;
}

.sas-grid tbody tr:hover td {
  background: #edfafd;
}

.sas-grid tbody tr.active-row td {
  background: #9eeff7;
  color: #003f47;
}

.sas-empty {
  text-align: center;
  padding: 24px !important;
  color: #607d8b;
}

.sas-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  min-height: 44px;
  background: #ffffff;
}

.sas-footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sas-icon-btn .material-icons {
  font-size: 18px;
}

.sas-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sas-pagination input {
  width: 46px;
  height: 26px;
  text-align: center;
  border: 1px solid #c7d1d8;
  border-radius: 4px;
}

.page-nav {
  border: 0;
  background: transparent;
  color: #263238;
  cursor: pointer;
  padding: 2px 4px;
}

.page-nav:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.sas-page-size {
  width: 64px;
}

.sas-count {
  justify-self: end;
}

@media (max-width: 900px) {
  .sas-footer {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .sas-count {
    justify-self: center;
  }

  .sas-grid-scroll {
    height: 520px;
  }
}
</style>

<style>
body.sas-column-resizing,
body.sas-column-resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>
