<template>
  <div class="errores-gestion-page">
    <section class="fm-panel">
      <div class="fm-panel-header" @click="filtersOpen = !filtersOpen">
        <span>FILTROS DE BÚSQUEDA</span>
        <span class="material-icons">{{ filtersOpen ? 'remove' : 'add' }}</span>
      </div>

      <div v-show="filtersOpen" class="fm-panel-content filters-content">
        <div class="filters-row">
          <div class="fm-field">
            <label>Region</label>
            <select v-model="filters.region" class="form-control">
              <option value="">None selected</option>
              <option value="AMBA">AMBA</option>
              <option value="CAPITAL">CAPITAL</option>
              <option value="INTERIOR">INTERIOR</option>
            </select>
          </div>

          <div class="fm-field">
            <label>Sub Region</label>
            <select v-model="filters.subRegion" class="form-control">
              <option value="">None selected</option>
              <option value="CABA">CABA</option>
              <option value="GBA NORTE">GBA NORTE</option>
              <option value="GBA SUR">GBA SUR</option>
              <option value="LA PLATA">LA PLATA</option>
            </select>
          </div>

          <div class="fm-field">
            <label>Centro Logístico</label>
            <select v-model="filters.centro" class="form-control">
              <option value="">None selected</option>
              <option value="PNT1">PNT1</option>
              <option value="PNL1">PNL1</option>
              <option value="OC15">OC15</option>
            </select>
          </div>

          <div class="fm-field">
            <label>Almacen</label>
            <select v-model="filters.almacen" class="form-control">
              <option value="">None selected</option>
              <option value="OC15">OC15</option>
              <option value="OC01">OC01</option>
              <option value="A-0">A-0</option>
            </select>
          </div>
        </div>

        <div class="filters-row second-row">
          <div class="fm-field">
            <label>Nro. Ot</label>
            <input v-model.trim="filters.nroOt" class="form-control" />
          </div>

          <div class="fm-field">
            <label>Código Material</label>
            <input v-model.trim="filters.codigoMaterial" class="form-control" />
          </div>

          <div class="fm-field">
            <label>Nro Serie</label>
            <input v-model.trim="filters.nroSerie" class="form-control" />
          </div>

          <div class="fm-field">
            <label>Fecha Ult Mod Desde</label>
            <input v-model="filters.fechaDesde" type="text" class="form-control" />
          </div>
        </div>

        <div class="filters-row third-row">
          <div class="fm-field">
            <label>Fecha Ult Mod Hasta</label>
            <input v-model="filters.fechaHasta" type="text" class="form-control" :disabled="!filters.fechaDesde" />
          </div>
        </div>

        <div class="filters-actions">
          <button type="button" class="btn-cyan" @click="handleSearch" :disabled="isLoading">{{ isLoading ? 'BUSCANDO...' : 'BUSCAR' }}</button>
          <button type="button" class="btn-cyan-outline" @click="clearFilters">LIMPIAR</button>
        </div>
      </div>
    </section>

    <section class="fm-panel results-panel">
      <div class="fm-panel-header" @click="resultsOpen = !resultsOpen">
        <span>GESTIONES CON ERROR</span>
        <span class="material-icons">{{ resultsOpen ? 'remove' : 'add' }}</span>
      </div>

      <div v-show="resultsOpen" class="fm-panel-content grid-content">
        <div v-if="showColumnConfig" class="column-config-menu">
          <label v-for="column in columns" :key="column.field">
            <input type="checkbox" class="custom-checkbox" v-model="column.visible" />
            {{ column.label }}
          </label>
        </div>

        <div class="error-table-wrap">
          <table class="error-grid">
            <thead>
              <tr>
                <th
                  v-for="column in visibleColumns"
                  :key="column.field"
                  class="resizable-th"
                  :style="{ width: column.width, minWidth: column.minWidth }"
                >
                  <div class="resize-header">{{ column.label }}</div>
                </th>
              </tr>
              <tr class="filter-row">
                <th
                  v-for="column in visibleColumns"
                  :key="`filter-${column.field}`"
                  :style="{ width: column.width, minWidth: column.minWidth }"
                >
                  <div class="col-filter">
                    <span class="filter-symbol">{{ column.field === 'materialValidado' ? '^' : '~' }}</span>
                    <input
                      v-model="columnFilters[column.field]"
                      class="col-filter-input"
                      @input="currentPage = 1"
                    />
                    <button type="button" class="clear-filter-btn" @click="clearColumnFilter(column.field)">x</button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="row.id">
                <td
                  v-for="column in visibleColumns"
                  :key="`${row.id}-${column.field}`"
                  :title="row[column.field]"
                >
                  <span v-if="column.field === 'nroOt'" class="ot-link">{{ row[column.field] }}</span>
                  <span v-else-if="column.field === 'estadoFm'" class="estado-badge" :class="estadoClass(row[column.field])">
                    {{ row[column.field] }}
                  </span>
                  <span v-else>{{ row[column.field] }}</span>
                </td>
              </tr>
              <tr v-if="paginatedRows.length === 0">
                <td :colspan="visibleColumns.length" class="empty-cell"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="error-grid-footer">
          <div class="footer-icons">
            <button class="plain-icon" type="button" title="Descargar" :disabled="filteredRows.length === 0" @click="exportRows">
              <span class="material-icons">file_download</span>
            </button>
            <button class="plain-icon" type="button" title="Gestionar" :disabled="filteredRows.length === 0" @click="showNoResultsAlert">
              <span class="material-icons">build</span>
            </button>
            <button class="plain-icon" type="button" title="Reprocesar" :disabled="filteredRows.length === 0" @click="showNoResultsAlert">
              <span class="material-icons">assignment_return</span>
            </button>
            <button class="plain-icon" type="button" title="Actualizar" @click="handleSearch">
              <span class="material-icons">refresh</span>
            </button>
            <button class="plain-icon" type="button" title="Configurar columnas" @click="showColumnConfig = !showColumnConfig">
              <span class="material-icons">visibility</span>
            </button>
          </div>

          <div class="footer-pagination">
            <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage = 1">
              <span class="material-icons">first_page</span>
            </button>
            <button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--">
              <span class="material-icons">chevron_left</span>
            </button>
            <span>Página</span>
            <input class="page-input" v-model.number="currentPage" type="number" min="1" :max="totalPages || 1" @change="normalizePage" />
            <span>de {{ totalPages || 0 }}</span>
            <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++">
              <span class="material-icons">chevron_right</span>
            </button>
            <button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages || 1">
              <span class="material-icons">last_page</span>
            </button>
            <select class="page-size" v-model.number="itemsPerPage" @change="currentPage = 1">
              <option :value="10">10</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <div class="footer-count">
            <span v-if="filteredRows.length">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</span>
            <span v-else>No hay resultados</span>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showAlert" class="pretty-modal-backdrop">
      <div class="pretty-alert">
        <div class="pretty-alert-header">
          <div class="pretty-alert-title"><span class="material-icons">info</span> Alerta</div>
          <button type="button" class="pretty-close" @click="showAlert = false">×</button>
        </div>
        <div class="pretty-alert-body">
          <div class="pretty-alert-icon"><span class="material-icons">search_off</span></div>
          <div>
            <h3>No se encontraron resultados</h3>
            <p>No existen gestiones con error para los filtros ingresados.</p>
          </div>
        </div>
        <div class="pretty-alert-actions">
          <button type="button" class="btn-cyan-outline" @click="showAlert = false">CERRAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'
import { searchErroresGestion } from '../../services/materialesGestionesService.js'

const filtersOpen = ref(true)
const resultsOpen = ref(true)
const showAlert = ref(false)
const showColumnConfig = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const rows = ref([])

const emptyFilters = () => ({
  region: '',
  subRegion: '',
  centro: '',
  almacen: '',
  nroOt: '',
  codigoMaterial: '',
  nroSerie: '',
  fechaDesde: '',
  fechaHasta: ''
})

const filters = reactive(emptyFilters())

const columns = reactive([
  { field: 'nroOt', label: 'NRO OT', width: '115px', minWidth: '95px', visible: true },
  { field: 'estadoFm', label: 'ESTADO FM', width: '130px', minWidth: '110px', visible: true },
  { field: 'codMaterial', label: 'COD MATERIAL', width: '150px', minWidth: '125px', visible: true },
  { field: 'nombreMaterial', label: 'NOMBRE MATERIAL', width: '185px', minWidth: '155px', visible: true },
  { field: 'tipoMaterial', label: 'TIPO MATERIAL', width: '175px', minWidth: '145px', visible: true },
  { field: 'cantidad', label: 'CANTIDAD', width: '100px', minWidth: '85px', visible: true },
  { field: 'tipoDescarga', label: 'TIPO DESCARGA', width: '130px', minWidth: '115px', visible: true },
  { field: 'descripcionError', label: 'DESCRIPCION ERROR', width: '420px', minWidth: '260px', visible: true },
  { field: 'codCentro', label: 'COD CENTRO', width: '155px', minWidth: '125px', visible: true },
  { field: 'centro', label: 'CENTRO', width: '105px', minWidth: '85px', visible: true },
  { field: 'codAlmacen', label: 'COD ALMACEN', width: '170px', minWidth: '135px', visible: true },
  { field: 'almacen', label: 'ALMACEN', width: '105px', minWidth: '85px', visible: true },
  { field: 'operadorDescarga', label: 'OPERADOR DESCARGA', width: '230px', minWidth: '180px', visible: true },
  { field: 'fechaDescarga', label: 'FECHA DESCARGA', width: '175px', minWidth: '145px', visible: true },
  { field: 'operadorUltMod', label: 'OPERADOR ULT MOD', width: '215px', minWidth: '170px', visible: true },
  { field: 'fechaUltMod', label: 'FECHA ULT MOD', width: '165px', minWidth: '135px', visible: true },
  { field: 'codigoPostal', label: 'CODIGO POS', width: '115px', minWidth: '95px', visible: true },
  { field: 'materialValidado', label: 'MATERIAL VALIDADO', width: '200px', minWidth: '160px', visible: true },
  { field: 'codTarea', label: 'COD TAREA', width: '115px', minWidth: '95px', visible: true }
])

const columnFilters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const visibleColumns = computed(() => columns.filter((column) => column.visible))
const normalize = (value) => String(value || '').toLowerCase()

const estadoClass = (estado) => {
  const value = normalize(estado)
  if (value.includes('error')) return 'estado-error'
  if (value.includes('rechazado')) return 'estado-rechazado'
  if (value.includes('validado')) return 'estado-validado'
  if (value.includes('pendiente')) return 'estado-pendiente'
  return 'estado-default'
}

const handleSearch = async () => {
  filtersOpen.value = false
  resultsOpen.value = true
  currentPage.value = 1
  isLoading.value = true

  try {
    rows.value = await searchErroresGestion({ ...filters })
    showAlert.value = rows.value.length === 0
  } finally {
    isLoading.value = false
  }
}

const clearFilters = () => {
  Object.assign(filters, emptyFilters())
  Object.keys(columnFilters).forEach((field) => { columnFilters[field] = '' })
  rows.value = []
  currentPage.value = 1
  filtersOpen.value = true
  resultsOpen.value = true
  showColumnConfig.value = false
}

const showNoResultsAlert = () => {
  if (!filteredRows.value.length) showAlert.value = true
}

const clearColumnFilter = (field) => {
  columnFilters[field] = ''
  currentPage.value = 1
}

const filteredRows = computed(() => rows.value.filter((row) => visibleColumns.value.every((column) => {
  const filter = normalize(columnFilters[column.field])
  return !filter || normalize(row[column.field]).includes(filter)
})))

const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value))
const paginatedRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredRows.value.length ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredRows.value.length))

const normalizePage = () => {
  if (!currentPage.value || currentPage.value < 1) currentPage.value = 1
  if (totalPages.value && currentPage.value > totalPages.value) currentPage.value = totalPages.value
}

const exportRows = () => {
  if (!filteredRows.value.length) return
  const headers = visibleColumns.value.map((column) => column.label)
  const csvRows = filteredRows.value.map((row) => visibleColumns.value.map((column) => row[column.field]))
  downloadCsv('errores_gestion.csv', buildCsv(headers, csvRows))
}

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages || 1
})
</script>

<style scoped>
.errores-gestion-page { color: #111; font-size: 14px; }
.fm-panel { border: 1px solid #d8d8d8; background: #fff; margin-bottom: 6px; }
.fm-panel-header { height: 32px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; background: #f7f7f7; border-bottom: 1px solid #d8d8d8; font-size: 14px; cursor: pointer; }
.fm-panel-header .material-icons { font-size: 20px; color: #666; }
.filters-content { border-left: 4px solid #00bcd4; }
.filters-row { display: grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: 20px; padding: 12px 20px 16px; border-bottom: 1px solid #d8d8d8; }
.third-row { grid-template-columns: minmax(180px, 1fr) repeat(3, minmax(180px, 1fr)); }
.fm-field label { display: block; margin-bottom: 7px; font-weight: 700; font-size: 13px; }
.form-control { width: 100%; height: 34px; border: 1px solid #bdbdbd; border-radius: 3px; padding: 5px 8px; background: #fff; }
.form-control:disabled { background: #e9e9e9; color: #555; }
.filters-actions { display: flex; justify-content: center; gap: 8px; padding: 20px 0 24px; }
.btn-cyan, .btn-cyan-outline { border-radius: 18px; padding: 8px 18px; font-size: 14px; cursor: pointer; }
.btn-cyan { background: #00a9bd; border: 1px solid #00a9bd; color: #fff; }
.btn-cyan-outline { background: #fff; border: 1px solid #00a9bd; color: #00a9bd; }
.btn-cyan:disabled { opacity: 0.65; cursor: not-allowed; }
.grid-content { position: relative; padding: 10px 10px 0; }
.column-config-menu { position: absolute; left: 18px; bottom: 52px; z-index: 20; width: min(520px, calc(100vw - 60px)); max-height: 330px; overflow: auto; background: #fff; border: 1px solid #cfd8dc; box-shadow: 0 8px 22px rgba(0,0,0,0.18); border-radius: 4px; padding: 14px; display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 9px; }
.column-config-menu label { display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; color: #37474f; }
.custom-checkbox { accent-color: #00bcd4; }
.error-table-wrap { overflow: auto; min-height: 465px; border: 1px solid #d1d1d1; border-bottom: 0; }
.error-grid { width: max-content; min-width: 100%; border-collapse: collapse; table-layout: fixed; }
.error-grid th, .error-grid td { border-right: 1px solid #c9c9c9; border-bottom: 1px solid #c9c9c9; padding: 8px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.error-grid th { height: 38px; background: #f7f7f7; color: #1e2c35; font-weight: 500; }
.error-grid td { height: 30px; }
.resizable-th { resize: horizontal; overflow: auto; }
.resize-header { overflow: hidden; text-overflow: ellipsis; }
.filter-row th { background: #fff; padding: 6px 8px; }
.col-filter { display: grid; grid-template-columns: 14px minmax(44px, 1fr) 13px; align-items: center; gap: 5px; }
.filter-symbol { font-weight: 700; color: #111; line-height: 1; }
.col-filter-input { width: 100%; min-width: 0; height: 28px; border: 1px solid #c7c7c7; border-radius: 3px; padding: 3px 6px; }
.clear-filter-btn { appearance: none; border: 0; background: transparent; cursor: pointer; font-weight: 700; padding: 0; color: #000; line-height: 1; }
.empty-cell { height: 380px; }
.ot-link { color: #00bcd4; font-weight: 700; cursor: pointer; }
.ot-link:hover { color: #008fa1; text-decoration: underline; }
.estado-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 90px; border-radius: 12px; padding: 3px 10px; font-size: 12px; font-weight: 700; line-height: 1.2; text-transform: uppercase; }
.estado-error { color: #b71c1c; background: #ffebee; border: 1px solid #ffcdd2; }
.estado-rechazado { color: #e65100; background: #fff3e0; border: 1px solid #ffcc80; }
.estado-validado { color: #1b5e20; background: #e8f5e9; border: 1px solid #a5d6a7; }
.estado-pendiente { color: #01579b; background: #e1f5fe; border: 1px solid #81d4fa; }
.estado-default { color: #37474f; background: #eceff1; border: 1px solid #cfd8dc; }
.error-grid-footer { min-height: 38px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 6px 10px; border: 1px solid #d1d1d1; background: #fff; }
.footer-icons { display: flex; align-items: center; gap: 12px; }
.plain-icon, .page-icon { appearance: none; border: 0; background: transparent; color: #000; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
.plain-icon .material-icons { font-size: 20px; font-weight: 700; }
.page-icon .material-icons { font-size: 20px; }
.plain-icon:hover:not(:disabled), .page-icon:hover:not(:disabled) { color: #00a9bd; }
.plain-icon:disabled, .page-icon:disabled { opacity: 0.35; cursor: not-allowed; }
.footer-pagination { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; white-space: nowrap; }
.page-input { width: 40px; height: 26px; border: 1px solid #d8d8d8; border-radius: 3px; text-align: center; font-weight: 700; }
.page-size { height: 28px; border: 1px solid #d8d8d8; border-radius: 3px; }
.footer-count { justify-self: end; font-size: 13px; white-space: nowrap; }
.pretty-modal-backdrop { position: fixed; inset: 0; z-index: 7000; display: flex; align-items: center; justify-content: center; background: rgba(38, 50, 56, 0.18); }
.pretty-alert { width: min(620px, calc(100vw - 32px)); background: #fff; border-radius: 8px; box-shadow: 0 18px 55px rgba(0, 0, 0, 0.28); overflow: hidden; }
.pretty-alert-header { height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-bottom: 1px solid #eceff1; }
.pretty-alert-title { display: flex; align-items: center; gap: 8px; font-size: 18px; color: #37474f; }
.pretty-alert-title .material-icons { color: #00a9bd; }
.pretty-close { border: 0; background: transparent; color: #b0bec5; font-size: 26px; font-weight: 700; cursor: pointer; }
.pretty-alert-body { display: grid; grid-template-columns: 70px 1fr; gap: 18px; align-items: center; padding: 24px; }
.pretty-alert-icon { width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #e0f7fa; color: #00a9bd; }
.pretty-alert-icon .material-icons { font-size: 34px; }
.pretty-alert-body h3 { margin: 0 0 8px; color: #263238; font-size: 18px; }
.pretty-alert-body p { margin: 0; color: #546e7a; line-height: 1.45; }
.pretty-alert-actions { display: flex; justify-content: flex-end; padding: 16px 18px 18px; border-top: 1px solid #eceff1; }
@media (max-width: 900px) {
  .filters-row, .third-row { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
  .error-grid-footer { grid-template-columns: 1fr; justify-items: center; }
  .footer-count { justify-self: center; }
  .column-config-menu { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .filters-row, .third-row { grid-template-columns: 1fr; padding: 12px; }
  .filters-actions { flex-direction: column; padding: 12px; }
  .btn-cyan, .btn-cyan-outline { width: 100%; }
  .footer-pagination { flex-wrap: wrap; }
  .pretty-alert-body { grid-template-columns: 1fr; text-align: center; }
  .pretty-alert-icon { margin: 0 auto; }
  .pretty-alert-actions { justify-content: center; }
}
</style>
