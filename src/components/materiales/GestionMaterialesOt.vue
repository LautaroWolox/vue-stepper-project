<template>
  <div class="materiales-ot-page">
    <section class="fm-panel">
      <div class="fm-panel-header" @click="filtersOpen = !filtersOpen"><span>FILTROS DE BÚSQUEDA</span><span class="material-icons">{{ filtersOpen ? 'remove' : 'add' }}</span></div>
      <div v-show="filtersOpen" class="fm-panel-content filters-content">
        <div class="filters-row">
          <div class="fm-field"><label>Región</label><select v-model="filters.region" class="form-control"><option value="">None selected</option><option value="AMBA">AMBA</option><option value="CAPITAL">CAPITAL</option><option value="INTERIOR">INTERIOR</option></select></div>
          <div class="fm-field"><label>Sub Región</label><select v-model="filters.subRegion" class="form-control"><option value="">None selected</option><option value="CABA">CABA</option><option value="GBA NORTE">GBA NORTE</option><option value="GBA SUR">GBA SUR</option><option value="LA PLATA">LA PLATA</option></select></div>
          <div class="fm-field"><label>Centro Logístico</label><select v-model="filters.centro" class="form-control" :class="{ 'input-error': validation.centro }"><option value="">None selected</option><option value="PNT1">PNT1</option><option value="PNL1">PNL1</option><option value="OC15">OC15</option></select><span v-if="validation.centro" class="error-text">Al menos un campo es obligatorio</span></div>
          <div class="fm-field"><label>Almacen</label><select v-model="filters.almacen" class="form-control"><option value="">None selected</option><option value="OC15">OC15</option><option value="OC01">OC01</option><option value="A-0">A-0</option></select></div>
        </div>
        <div class="filters-row second-row">
          <div class="fm-field tecnico-field"><label>Técnico</label><div class="tecnico-wrapper"><input v-model.trim="filters.tecnico" class="form-control" :class="{ 'input-error': validation.tecnico }" :disabled="todosTecnicos" /><button type="button" class="todos-btn" :class="{ active: todosTecnicos }" @click="toggleTodos">TODOS</button></div><span v-if="validation.tecnico" class="error-text">Al menos un campo es obligatorio</span></div>
          <div class="fm-field"><label>Nro. Ot</label><input v-model.trim="filters.ot" class="form-control" :class="{ 'input-error': validation.ot }" :disabled="todosTecnicos" /><span v-if="validation.ot" class="error-text">Al menos un campo es obligatorio</span></div>
          <div class="fm-field"><label>Fecha Ult. Modif. Desde</label><input v-model="filters.fechaDesde" type="text" class="form-control" /></div>
          <div class="fm-field"><label>Fecha Ult. Modif. Hasta</label><input v-model="filters.fechaHasta" type="text" class="form-control" :disabled="!filters.fechaDesde" /></div>
        </div>
        <div class="filters-actions"><button type="button" class="btn-cyan" @click="handleSearch" :disabled="isLoading">{{ isLoading ? 'BUSCANDO...' : 'BUSCAR' }}</button><button type="button" class="btn-cyan-outline" @click="clearFilters">LIMPIAR</button></div>
      </div>
    </section>

    <section class="fm-panel results-panel">
      <div class="fm-panel-header" @click="resultsOpen = !resultsOpen"><span>OTS PENDIENTES DE GESTIÓN DE MATERIALES</span><span class="material-icons">{{ resultsOpen ? 'remove' : 'add' }}</span></div>
      <div v-show="resultsOpen" class="fm-panel-content grid-content">
        <div class="ot-table-wrap">
          <table class="ot-grid">
            <thead>
              <tr><th class="check-col"><input type="checkbox" :disabled="filteredRows.length === 0" /></th><th v-for="column in columns" :key="column.field" class="resizable-th" :style="{ width: column.width, minWidth: column.minWidth }"><div class="resize-header">{{ column.label }}</div></th></tr>
              <tr class="filter-row"><th></th><th v-for="column in columns" :key="`filter-${column.field}`"><div class="col-filter"><span>~</span><input v-model="columnFilters[column.field]" class="col-filter-input" @input="currentPage = 1" /><button type="button" @click="clearColumnFilter(column.field)">x</button></div></th></tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="row.id"><td class="check-col"><input type="checkbox" /></td><td :title="row.nroOt">{{ row.nroOt }}</td><td :title="row.estadoOt">{{ row.estadoOt }}</td><td :title="row.fechaUltMod">{{ row.fechaUltMod }}</td><td :title="row.horaUltMod">{{ row.horaUltMod }}</td><td :title="row.tecnico">{{ row.tecnico }}</td><td :title="row.superior">{{ row.superior }}</td><td :title="row.centro">{{ row.centro }}</td><td :title="row.almacen">{{ row.almacen }}</td><td :title="row.direccion">{{ row.direccion }}</td><td :title="row.codTarea">{{ row.codTarea }}</td></tr>
              <tr v-if="paginatedRows.length === 0"><td :colspan="columns.length + 1" class="empty-cell"></td></tr>
            </tbody>
          </table>
        </div>
        <div class="ot-grid-footer">
          <div class="footer-icons"><button type="button" class="plain-icon" title="Exportar a Excel" :disabled="filteredRows.length === 0" @click="openExportDialog"><span class="material-icons">file_download</span></button><button type="button" class="plain-icon" title="Gestionar" :disabled="filteredRows.length === 0" @click="showNoResultsAlert"><span class="material-icons">build</span></button><button type="button" class="plain-icon" title="Configurar" @click="showNoResultsAlert"><span class="material-icons">settings</span></button></div>
          <div class="footer-pagination"><button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage = 1"><span class="material-icons">first_page</span></button><button class="page-icon" type="button" :disabled="currentPage === 1" @click="currentPage > 1 && currentPage--"><span class="material-icons">chevron_left</span></button><span>Página</span><input class="page-input" v-model.number="currentPage" type="number" min="1" :max="totalPages || 1" @change="normalizePage" /><span>de {{ totalPages || 0 }}</span><button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage < totalPages && currentPage++"><span class="material-icons">chevron_right</span></button><button class="page-icon" type="button" :disabled="currentPage >= totalPages" @click="currentPage = totalPages || 1"><span class="material-icons">last_page</span></button><select class="page-size" v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="100">100</option><option :value="50">50</option><option :value="10">10</option></select></div>
          <div class="footer-count"><span v-if="filteredRows.length">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</span><span v-else>No hay resultados</span></div>
        </div>
      </div>
    </section>

    <div v-if="showAlert" class="pretty-modal-backdrop"><div class="pretty-alert"><div class="pretty-alert-header"><div class="pretty-alert-title"><span class="material-icons">info</span> Alerta</div><button type="button" class="pretty-close" @click="showAlert = false">×</button></div><div class="pretty-alert-body"><div class="pretty-alert-icon"><span class="material-icons">search_off</span></div><div><h3>No se encontraron resultados</h3><p>La búsqueda no devolvió OTs pendientes de gestión de materiales para los filtros ingresados.</p></div></div><div class="pretty-alert-actions"><button type="button" class="btn-cyan-outline" @click="showAlert = false">CERRAR</button></div></div></div>

    <ExportExcelDialog :show="showExportDialog" description="Elegí qué OTs y qué campos querés exportar a Excel." @close="showExportDialog = false" @confirm="confirmExportExcel" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import ExportExcelDialog from '../shared/ExportExcelDialog.vue'
import { downloadExcel } from '../../utils/excelExport.js'
import { searchOtsPendientesGestion } from '../../services/materialesGestionesService.js'

const filtersOpen = ref(true)
const resultsOpen = ref(true)
const showAlert = ref(false)
const showExportDialog = ref(false)
const todosTecnicos = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(100)
const rows = ref([])

const emptyFilters = () => ({ region: '', subRegion: '', centro: '', almacen: '', tecnico: '', ot: '', fechaDesde: '', fechaHasta: '' })
const filters = reactive(emptyFilters())
const validation = reactive({ centro: false, tecnico: false, ot: false })
const columns = [
  { field: 'nroOt', label: 'NRO. OT', width: '180px', minWidth: '140px' }, { field: 'estadoOt', label: 'ESTADO OT', width: '180px', minWidth: '140px' }, { field: 'fechaUltMod', label: 'FECHA ULT. MODIFICACIÓN', width: '180px', minWidth: '150px' }, { field: 'horaUltMod', label: 'HORA ULT. MODIFICACIÓN', width: '180px', minWidth: '150px' }, { field: 'tecnico', label: 'TÉCNICO', width: '180px', minWidth: '140px' }, { field: 'superior', label: 'SUPERIOR', width: '180px', minWidth: '140px' }, { field: 'centro', label: 'CENTRO', width: '180px', minWidth: '130px' }, { field: 'almacen', label: 'ALMACÉN', width: '180px', minWidth: '130px' }, { field: 'direccion', label: 'DIRECCIÓN', width: '180px', minWidth: '150px' }, { field: 'codTarea', label: 'COD TAREA', width: '180px', minWidth: '130px' }
]
const columnFilters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const normalize = (value) => String(value || '').toLowerCase()
const hasSearchCriteria = () => Boolean(filters.region || filters.subRegion || filters.centro || filters.almacen || filters.tecnico || filters.ot || filters.fechaDesde || filters.fechaHasta || todosTecnicos.value)
const clearValidation = () => { validation.centro = false; validation.tecnico = false; validation.ot = false }
const toggleTodos = () => { todosTecnicos.value = !todosTecnicos.value; if (todosTecnicos.value) { filters.tecnico = ''; filters.ot = '' }; clearValidation() }

const handleSearch = async () => {
  clearValidation()
  if (!hasSearchCriteria()) { validation.centro = true; validation.tecnico = true; validation.ot = true; return }
  filtersOpen.value = false
  resultsOpen.value = true
  currentPage.value = 1
  isLoading.value = true
  try { rows.value = await searchOtsPendientesGestion({ ...filters, tecnico: todosTecnicos.value ? '' : filters.tecnico }); showAlert.value = rows.value.length === 0 } finally { isLoading.value = false }
}

const clearFilters = () => { Object.assign(filters, emptyFilters()); todosTecnicos.value = false; clearValidation(); rows.value = []; currentPage.value = 1; filtersOpen.value = true; resultsOpen.value = true; Object.keys(columnFilters).forEach((field) => { columnFilters[field] = '' }) }
const showNoResultsAlert = () => { if (!filteredRows.value.length) showAlert.value = true }
const clearColumnFilter = (field) => { columnFilters[field] = ''; currentPage.value = 1 }
const filteredRows = computed(() => rows.value.filter((row) => columns.every((column) => { const filter = normalize(columnFilters[column.field]); return !filter || normalize(row[column.field]).includes(filter) })))
const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value))
const paginatedRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredRows.value.length ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredRows.value.length))
const normalizePage = () => { if (!currentPage.value || currentPage.value < 1) currentPage.value = 1; if (totalPages.value && currentPage.value > totalPages.value) currentPage.value = totalPages.value }
const openExportDialog = () => { if (filteredRows.value.length) showExportDialog.value = true }
const confirmExportExcel = ({ scope, columnMode }) => { const exportRows = scope === 'visibleRows' ? paginatedRows.value : filteredRows.value; downloadExcel({ filename: 'ots_pendientes_gestion_materiales.xls', title: 'OTs Pendientes Gestion Materiales', columns, rows: exportRows, mode: columnMode }); showExportDialog.value = false }
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages || 1 })
</script>

<style scoped>
.materiales-ot-page { color: #111; font-size: 14px; }
.fm-panel { border: 1px solid #d8d8d8; background: #fff; margin-bottom: 6px; }
.fm-panel-header { height: 32px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; background: #f7f7f7; border-bottom: 1px solid #d8d8d8; font-size: 14px; cursor: pointer; }
.fm-panel-header .material-icons { font-size: 20px; color: #666; }
.filters-content { border-left: 4px solid #00bcd4; }
.filters-row { display: grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: 20px; padding: 12px 20px 16px; border-bottom: 1px solid #d8d8d8; }
.fm-field label { display: block; margin-bottom: 7px; font-weight: 700; font-size: 13px; }
.form-control { width: 100%; height: 34px; border: 1px solid #bdbdbd; border-radius: 3px; padding: 5px 8px; background: #fff; }
.form-control:disabled { background: #e9e9e9; color: #555; }
.input-error { border-color: #e91e63 !important; }
.error-text { display: block; color: #e91e63; margin-top: 5px; font-size: 13px; }
.tecnico-wrapper { display: flex; align-items: center; }
.tecnico-wrapper .form-control { border-radius: 3px 0 0 3px; }
.todos-btn { height: 34px; padding: 0 15px; border: 1px solid #bdbdbd; border-left: 0; border-radius: 0 3px 3px 0; background: #fff; cursor: pointer; }
.todos-btn.active { background: #00bcd4; color: #fff; border-color: #00bcd4; }
.filters-actions { display: flex; justify-content: center; gap: 8px; padding: 20px 0 24px; }
.btn-cyan, .btn-cyan-outline { border-radius: 18px; padding: 8px 18px; font-size: 14px; cursor: pointer; }
.btn-cyan { background: #00a9bd; border: 1px solid #00a9bd; color: #fff; }
.btn-cyan-outline { background: #fff; border: 1px solid #00a9bd; color: #00a9bd; }
.btn-cyan:disabled { opacity: 0.65; cursor: not-allowed; }
.grid-content { padding: 10px 10px 0; }
.ot-table-wrap { overflow: auto; min-height: 465px; border: 1px solid #d1d1d1; border-bottom: 0; }
.ot-grid { width: max-content; min-width: 100%; border-collapse: collapse; table-layout: fixed; }
.ot-grid th, .ot-grid td { border-right: 1px solid #c9c9c9; border-bottom: 1px solid #c9c9c9; padding: 8px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ot-grid th { height: 38px; background: #f7f7f7; color: #1e2c35; font-weight: 500; }
.check-col { width: 42px !important; min-width: 42px !important; text-align: center !important; }
.resizable-th { resize: horizontal; overflow: auto; }
.resize-header { overflow: hidden; text-overflow: ellipsis; }
.filter-row th { background: #fff; padding: 6px 8px; }
.col-filter { display: flex; align-items: center; gap: 5px; }
.col-filter-input { flex: 1; min-width: 32px; height: 32px; border: 1px solid #c7c7c7; border-radius: 3px; }
.col-filter button { appearance: none; border: 0; background: transparent; cursor: pointer; font-weight: 700; padding: 0; }
.empty-cell { height: 380px; }
.ot-grid-footer { min-height: 38px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 6px 10px; border: 1px solid #d1d1d1; background: #fff; }
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
@media (max-width: 900px) { .filters-row { grid-template-columns: repeat(2, minmax(180px, 1fr)); } .ot-grid-footer { grid-template-columns: 1fr; justify-items: center; } .footer-count { justify-self: center; } }
@media (max-width: 560px) { .filters-row { grid-template-columns: 1fr; padding: 12px; } .filters-actions { flex-direction: column; padding: 12px; } .btn-cyan, .btn-cyan-outline { width: 100%; } .footer-pagination { flex-wrap: wrap; } .pretty-alert-body { grid-template-columns: 1fr; text-align: center; } .pretty-alert-icon { margin: 0 auto; } .pretty-alert-actions { justify-content: center; } }
</style>
