<template>
  <div class="errores-sucursal">
    <section class="fm-panel">
      <div class="fm-panel-header" @click="filtersOpen = !filtersOpen">
        <span>FILTROS DE BÚSQUEDA</span>
        <span class="material-icons">{{ filtersOpen ? 'remove' : 'add' }}</span>
      </div>

      <div v-show="filtersOpen" class="fm-panel-content filtros-content">
        <div class="filtros-grid">
          <div class="fm-field pais-field">
            <label>Pais</label>
            <select class="form-control" v-model="filters.pais">
              <option value=""></option>
              <option value="ARG">ARG</option>
              <option value="PY">PY</option>
              <option value="UY">UY</option>
            </select>
          </div>

          <div class="fm-field">
            <label>Nro. Sistema</label>
            <input class="form-control" v-model.trim="filters.nroSistema" />
          </div>

          <div class="fm-field">
            <label>Nro. Serie</label>
            <input class="form-control" v-model.trim="filters.nroSerie" />
          </div>

          <div class="fm-field">
            <label>Fecha Ult Mod Desde</label>
            <input class="form-control" type="text" v-model.trim="filters.fechaDesde" />
          </div>

          <div class="fm-field">
            <label>Fecha Ult Mod Hasta</label>
            <input class="form-control" type="text" v-model.trim="filters.fechaHasta" :disabled="!filters.fechaDesde" />
          </div>
        </div>

        <div class="filtros-actions">
          <button class="btn-cyan" type="button" @click="searchRows">BUSCAR</button>
          <button class="btn-cyan-outline" type="button" @click="clearFilters">LIMPIAR</button>
        </div>
      </div>
    </section>

    <section class="fm-panel grilla-panel">
      <div class="fm-panel-header" @click="gridOpen = !gridOpen">
        <span>GESTIONES CON ERROR</span>
        <span class="material-icons">{{ gridOpen ? 'remove' : 'add' }}</span>
      </div>

      <div v-show="gridOpen" class="fm-panel-content grilla-content">
        <div class="error-table-wrap">
          <table class="error-grid">
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.field" class="resizable-th" :style="{ width: column.width, minWidth: column.minWidth }">
                  <div class="resize-header">{{ column.label }}</div>
                </th>
              </tr>
              <tr class="filter-row">
                <th v-for="column in columns" :key="`filter-${column.field}`" :style="{ width: column.width, minWidth: column.minWidth }">
                  <div class="col-filter">
                    <span>~</span>
                    <input class="col-filter-input" v-model="columnFilters[column.field]" @input="currentPage = 1" />
                    <button type="button" @click="clearColumnFilter(column.field)">x</button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in paginatedRows"
                :key="row.id"
                @click="selectedRow = row"
                @dblclick="openGestionPopup"
              >
                <td :title="row.nroSistema">{{ row.nroSistema }}</td>
                <td :title="row.nroSerie">{{ row.nroSerie }}</td>
                <td :title="row.fechaDescarga">{{ row.fechaDescarga }}</td>
                <td :title="row.operadorDescarga">{{ row.operadorDescarga }}</td>
                <td :title="row.operadorUltMod">{{ row.operadorUltMod }}</td>
                <td :title="row.fechaUltMod">{{ row.fechaUltMod }}</td>
                <td :title="row.pais">{{ row.pais }}</td>
                <td :title="row.codigoPostal">{{ row.codigoPostal }}</td>
                <td :title="row.centro">{{ row.centro }}</td>
                <td :title="row.almacen">{{ row.almacen }}</td>
                <td :title="row.descripcionError">{{ row.descripcionError }}</td>
              </tr>

              <tr v-if="paginatedRows.length === 0">
                <td :colspan="columns.length" class="empty-cell">No hay resultados</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="error-grid-footer">
          <div class="footer-icons">
            <button class="plain-icon" type="button" title="Descargar" @click="exportRows" :disabled="filteredRows.length === 0">
              <span class="material-icons">file_download</span>
            </button>
            <button class="plain-icon" type="button" title="Gestionar" @click="openGestionPopup" :disabled="filteredRows.length === 0">
              <span class="material-icons">build</span>
            </button>
          </div>

          <div class="footer-pagination">
            <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage = 1">
              <span class="material-icons">first_page</span>
            </button>
            <button class="page-icon" type="button" :disabled="currentPage === 1" @click="prevPage">
              <span class="material-icons">chevron_left</span>
            </button>
            <span>Página</span>
            <input class="page-input" type="number" min="1" :max="totalPages || 1" v-model.number="currentPage" @change="normalizePage" />
            <span>de {{ totalPages || 1 }}</span>
            <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="nextPage">
              <span class="material-icons">chevron_right</span>
            </button>
            <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages || 1">
              <span class="material-icons">last_page</span>
            </button>
            <select class="page-size" v-model.number="itemsPerPage" @change="currentPage = 1">
              <option :value="10">10 v</option>
              <option :value="50">50 v</option>
              <option :value="100">100 v</option>
              <option :value="500">500 v</option>
            </select>
          </div>

          <div class="footer-count">
            <span v-if="filteredRows.length > 0">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</span>
            <span v-else>No hay resultados</span>
          </div>
        </div>
      </div>
    </section>

    <GestionErrorSucursalPopup
      :show="showGestionPopup"
      :row="selectedRow"
      :position="popupPosition"
      @close="showGestionPopup = false"
      @reprocess="handleReprocess"
      @replace="handleReplace"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import GestionErrorSucursalPopup from './GestionErrorSucursalPopup.vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const filtersOpen = ref(true)
const gridOpen = ref(true)
const showGestionPopup = ref(false)
const selectedRow = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const popupPosition = reactive({ x: 80, y: 160 })

const filters = reactive({
  pais: '',
  nroSistema: '',
  nroSerie: '',
  fechaDesde: '',
  fechaHasta: ''
})

const columns = [
  { field: 'nroSistema', label: 'NRO. SISTEMA', width: '170px', minWidth: '130px' },
  { field: 'nroSerie', label: 'NRO. SERIE', width: '170px', minWidth: '130px' },
  { field: 'fechaDescarga', label: 'FECHA DESCARGA', width: '170px', minWidth: '140px' },
  { field: 'operadorDescarga', label: 'OPERADOR DESCARGA', width: '280px', minWidth: '180px' },
  { field: 'operadorUltMod', label: 'OPERADOR ULT MOD', width: '280px', minWidth: '180px' },
  { field: 'fechaUltMod', label: 'FECHA ULT MOD', width: '170px', minWidth: '140px' },
  { field: 'pais', label: 'PAIS', width: '90px', minWidth: '70px' },
  { field: 'codigoPostal', label: 'CODIGO POSTAL', width: '130px', minWidth: '110px' },
  { field: 'centro', label: 'CENTRO', width: '110px', minWidth: '90px' },
  { field: 'almacen', label: 'ALMACEN', width: '90px', minWidth: '70px' },
  { field: 'descripcionError', label: 'DESCRIPCION ERROR', width: '360px', minWidth: '260px' }
]

const columnFilters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))

const baseRows = [
  {
    nroSistema: 'JOP68807891',
    nroSerie: '01728308147',
    fechaDescarga: '19/06/2026 17:18:51',
    operadorDescarga: 'JOPARA-Nombre JOPARA-Apellido',
    operadorUltMod: 'JOPARA-Nombre JOPARA-Apellido',
    fechaUltMod: '19/06/2026 17:18:51',
    pais: 'PY',
    codigoPostal: '111',
    centro: 'PNT1',
    almacen: 'OC15',
    descripcionError: 'No existen equivalencia de material recupero para'
  },
  {
    nroSistema: 'JOP68807890',
    nroSerie: '1936ADB10LT09200',
    fechaDescarga: '19/06/2026 17:18:51',
    operadorDescarga: 'JOPARA-Nombre JOPARA-Apellido',
    operadorUltMod: 'JOPARA-Nombre JOPARA-Apellido',
    fechaUltMod: '19/06/2026 17:18:51',
    pais: 'PY',
    codigoPostal: '111',
    centro: 'PNT1',
    almacen: 'OC15',
    descripcionError: 'No existen equivalencia de material recupero para'
  },
  {
    nroSistema: 'JOP101450834',
    nroSerie: '319118033316',
    fechaDescarga: '17/06/2026 15:30:56',
    operadorDescarga: 'JOPARA-Nombre JOPARA-Apellido',
    operadorUltMod: 'JOPARA-Nombre JOPARA-Apellido',
    fechaUltMod: '17/06/2026 15:30:57',
    pais: 'PY',
    codigoPostal: '111',
    centro: 'PNL1',
    almacen: 'OC01',
    descripcionError: 'Posting only possible in periods 2026/05 and 2026/04 in company code P001'
  },
  {
    nroSistema: 'JOP68807858',
    nroSerie: '48575443C4B1689F',
    fechaDescarga: '10/06/2026 14:58:03',
    operadorDescarga: 'JOPARA-Nombre JOPARA-Apellido',
    operadorUltMod: 'JOPARA-Nombre JOPARA-Apellido',
    fechaUltMod: '10/06/2026 14:58:04',
    pais: 'PY',
    codigoPostal: '111',
    centro: 'PNT1',
    almacen: 'OC15',
    descripcionError: 'No existe el material 000000001000102890 en el centro PNT1'
  },
  {
    nroSistema: 'JOP68807850',
    nroSerie: '318016011562',
    fechaDescarga: '10/06/2026 08:28:59',
    operadorDescarga: 'JOPARA-Nombre JOPARA-Apellido',
    operadorUltMod: 'JOPARA-Nombre JOPARA-Apellido',
    fechaUltMod: '10/06/2026 08:29:00',
    pais: 'PY',
    codigoPostal: '111',
    centro: 'PNT1',
    almacen: 'OC15',
    descripcionError: 'No existe el material 00000000110100337 en el centro PNT1'
  }
]

const sourceRows = Array.from({ length: 60 }, (_, index) => {
  const base = baseRows[index % baseRows.length]
  const suffix = String(index + 1).padStart(2, '0')

  return {
    ...base,
    id: index + 1,
    nroSistema: `${base.nroSistema.slice(0, -2)}${suffix}`,
    nroSerie: index < baseRows.length ? base.nroSerie : `${base.nroSerie}${suffix}`
  }
})

const gridRows = ref([])

const normalize = (value) => String(value || '').toLowerCase()

const searchRows = () => {
  const pais = filters.pais || 'PY'

  gridRows.value = sourceRows.filter((row) => {
    return (
      (!pais || row.pais === pais) &&
      (!filters.nroSistema || normalize(row.nroSistema).includes(normalize(filters.nroSistema))) &&
      (!filters.nroSerie || normalize(row.nroSerie).includes(normalize(filters.nroSerie)))
    )
  })

  selectedRow.value = null
  currentPage.value = 1
  filtersOpen.value = false
}

const clearFilters = () => {
  Object.keys(filters).forEach((key) => { filters[key] = '' })
  clearAllColumnFilters()
  gridRows.value = []
  selectedRow.value = null
  currentPage.value = 1
  filtersOpen.value = true
}

const clearColumnFilter = (field) => {
  columnFilters[field] = ''
  currentPage.value = 1
}

const clearAllColumnFilters = () => {
  Object.keys(columnFilters).forEach((field) => { columnFilters[field] = '' })
}

const filteredRows = computed(() => {
  return gridRows.value.filter((row) => {
    return columns.every((column) => {
      const value = normalize(row[column.field])
      const filter = normalize(columnFilters[column.field])
      return !filter || value.includes(filter)
    })
  })
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredRows.value.slice(start, start + itemsPerPage.value)
})

const fromRow = computed(() => filteredRows.value.length ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredRows.value.length))

const normalizePage = () => {
  if (!currentPage.value || currentPage.value < 1) currentPage.value = 1
  if (totalPages.value && currentPage.value > totalPages.value) currentPage.value = totalPages.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const exportRows = () => {
  if (!filteredRows.value.length) return

  const headers = columns.map((column) => column.label)
  const rows = filteredRows.value.map((row) => columns.map((column) => row[column.field]))

  downloadCsv('errores_gestion_sucursal.csv', buildCsv(headers, rows))
}

const openGestionPopup = () => {
  const rowToManage = selectedRow.value || paginatedRows.value[0]

  if (!rowToManage) {
    alert('No hay gestiones con error para gestionar.')
    return
  }

  selectedRow.value = rowToManage
  popupPosition.x = 80
  popupPosition.y = 160
  showGestionPopup.value = true
}

const handleReprocess = ({ row }) => {
  alert(`Se envió a reprocesar el Nro. Serie ${row?.nroSerie || ''}.`)
  showGestionPopup.value = false
}

const handleReplace = ({ row, nroSerie }) => {
  alert(`Se reemplazó el Nro. Serie ${row?.nroSerie || ''} por ${nroSerie}.`)
  showGestionPopup.value = false
}

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages || 1
})
</script>

<style scoped>
.errores-sucursal {
  color: #111;
  font-size: 14px;
}

.fm-panel {
  border: 1px solid #d8d8d8;
  margin-bottom: 6px;
  background: #fff;
}

.fm-panel-header {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: #f7f7f7;
  border-bottom: 1px solid #d8d8d8;
  color: #1e2c35;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}

.fm-panel-header .material-icons {
  font-size: 20px;
  color: #666;
}

.fm-panel-content {
  background: #fff;
}

.filtros-content {
  border-left: 4px solid #00bcd4;
}

.filtros-grid {
  display: grid;
  grid-template-columns: 140px minmax(180px, 290px) minmax(180px, 290px) minmax(180px, 290px) minmax(180px, 290px);
  gap: 20px;
  padding: 12px 22px 14px;
  align-items: end;
}

.fm-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
}

.fm-field .form-control {
  width: 100%;
  height: 34px;
  border-radius: 3px;
  border: 1px solid #c7c7c7;
}

.fm-field .form-control:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 5px rgba(0, 188, 212, 0.3);
  outline: none;
}

.fm-field .form-control:disabled {
  background: #e9e9e9;
}

.filtros-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 18px 0 24px;
  border-top: 1px solid #d8d8d8;
}

.btn-cyan,
.btn-cyan-outline {
  border-radius: 18px;
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cyan {
  background: #00a9bd;
  border: 1px solid #00a9bd;
  color: #fff;
}

.btn-cyan-outline {
  background: #fff;
  border: 1px solid #00a9bd;
  color: #00a9bd;
}

.btn-cyan:hover,
.btn-cyan-outline:hover {
  filter: brightness(0.96);
}

.grilla-content {
  padding: 10px 10px 0;
}

.error-table-wrap {
  overflow: auto;
  min-height: 490px;
  border: 1px solid #d1d1d1;
  border-bottom: 0;
}

.error-grid {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.error-grid th,
.error-grid td {
  border-right: 1px solid #c9c9c9;
  border-bottom: 1px solid #c9c9c9;
  padding: 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-grid th {
  height: 38px;
  background: #f7f7f7;
  color: #1e2c35;
  font-weight: 500;
}

.resizable-th {
  resize: horizontal;
  overflow: auto;
}

.resize-header {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-grid tbody tr {
  cursor: pointer;
}

.error-grid tbody tr:nth-child(even) {
  background: #f8f8f8;
}

.error-grid tbody tr:hover {
  background: #e9f8fb;
}

.filter-row th {
  background: #fff;
  padding: 6px 8px;
}

.col-filter {
  display: flex;
  align-items: center;
  gap: 5px;
}

.col-filter span {
  font-size: 13px;
}

.col-filter-input {
  flex: 1;
  min-width: 28px;
  height: 32px;
  border: 1px solid #c7c7c7;
  border-radius: 3px;
}

.col-filter button {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 700;
  color: #000;
  padding: 0;
}

.empty-cell {
  height: 390px;
  text-align: center !important;
  color: #111;
}

.error-grid-footer {
  min-height: 38px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border: 1px solid #d1d1d1;
  background: #fff;
}

.footer-icons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.plain-icon,
.page-icon {
  appearance: none;
  border: 0;
  background: transparent;
  color: #000;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.plain-icon .material-icons {
  font-size: 20px;
  font-weight: 700;
}

.page-icon .material-icons {
  font-size: 20px;
}

.plain-icon:hover:not(:disabled),
.page-icon:hover:not(:disabled) {
  color: #00a9bd;
}

.plain-icon:disabled,
.page-icon:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.footer-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  white-space: nowrap;
}

.page-input {
  width: 40px;
  height: 26px;
  border: 1px solid #d8d8d8;
  border-radius: 3px;
  text-align: center;
  font-weight: 700;
}

.page-size {
  height: 28px;
  border: 1px solid #d8d8d8;
  border-radius: 3px;
}

.footer-count {
  justify-self: end;
  font-size: 13px;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .filtros-grid {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }

  .error-table-wrap {
    min-height: 430px;
  }
}

@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  .filtros-actions {
    flex-direction: column;
    padding: 12px;
  }

  .btn-cyan,
  .btn-cyan-outline {
    width: 100%;
  }

  .error-grid-footer {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .footer-icons,
  .footer-pagination {
    justify-content: center;
    flex-wrap: wrap;
  }

  .footer-count {
    justify-self: center;
  }

  .error-table-wrap {
    min-height: 360px;
  }
}
</style>
