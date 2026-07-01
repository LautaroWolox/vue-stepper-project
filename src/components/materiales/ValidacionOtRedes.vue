<template>
  <div class="validacion-redes-page">
    <section class="fm-panel filters-panel">
      <div class="fm-panel-header" @click="openFilters = !openFilters">
        <span>FILTROS DE BÚSQUEDA</span>
        <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
      </div>

      <div v-show="openFilters" class="fm-panel-body filters-body">
        <div class="filters-row filters-row-4">
          <div v-for="combo in combos" :key="combo.key" class="fm-field multi-field">
            <label>{{ combo.label }}</label>
            <button
              class="multi-button"
              type="button"
              :class="{ error: combo.key === 'centros' && centroError, 'has-selection': filters[combo.key].length > 0 }"
              @click.stop="openCombo = openCombo === combo.key ? null : combo.key"
            >
              <span class="multi-button-main">
                <span class="multi-button-value">{{ comboText(combo) }}</span>
                <span v-if="filters[combo.key].length" class="multi-button-count">{{ filters[combo.key].length }}</span>
              </span>
              <span class="material-icons">arrow_drop_down</span>
            </button>
            <div v-if="combo.key === 'centros' && centroError" class="field-error">{{ centroError }}</div>

            <div v-if="openCombo === combo.key" class="multi-menu" @click.stop>
              <div class="multi-search">
                <span class="material-icons">search</span>
                <input v-model.trim="comboSearch[combo.key]" placeholder="Buscar" autocomplete="off" />
                <button type="button" title="Limpiar búsqueda" @click="comboSearch[combo.key] = ''">⊗</button>
              </div>

              <label v-if="combo.allowAll" class="multi-option multi-option-all" :class="{ selected: allSelected(combo) }">
                <input type="checkbox" :checked="allSelected(combo)" @change="toggleAll(combo)" />
                <span>Seleccionar todo</span>
                <small>{{ filters[combo.key].length }} / {{ combo.items.length }}</small>
              </label>

              <div class="multi-options-list">
                <label v-for="item in filteredComboItems(combo)" :key="item" class="multi-option" :class="{ selected: filters[combo.key].includes(item) }">
                  <input type="checkbox" :checked="filters[combo.key].includes(item)" @change="toggleItem(combo.key, item)" />
                  <span>{{ item }}</span>
                </label>
              </div>

              <div v-if="filteredComboItems(combo).length === 0" class="multi-empty">Sin resultados</div>
            </div>
          </div>
        </div>

        <div class="filters-row filters-row-4">
          <div class="fm-field autocomplete-field">
            <label>Nro. Ot</label>
            <input
              class="fm-input"
              :class="{ disabled: isNroOtDisabled }"
              v-model.trim="filters.nroOt"
              :disabled="isNroOtDisabled"
              autocomplete="off"
              @focus="showOtAutocomplete"
              @input="showOtAutocomplete"
              @blur="hideOtAutocomplete"
              @keydown.down.prevent="moveSuggestion(1)"
              @keydown.up.prevent="moveSuggestion(-1)"
              @keydown.enter.prevent="confirmSuggestion"
              @keydown.esc.prevent="showSuggestions = false"
            />
            <div v-if="showSuggestions && otSuggestions.length" class="ot-suggestions">
              <button v-for="(ot, index) in otSuggestions" :key="ot" type="button" :class="{ active: index === activeSuggestion }" @mousedown.prevent="selectOt(ot)">{{ ot }}</button>
            </div>
          </div>

          <div class="fm-field">
            <label>Fecha Ult. Modif. Desde</label>
            <ValidacionDatePicker v-model="filters.fechaDesde" placeholder="Seleccionar fecha" />
          </div>

          <div class="fm-field">
            <label>Fecha Ult. Modif. Hasta</label>
            <ValidacionDatePicker v-model="filters.fechaHasta" placeholder="Seleccionar fecha" :disabled="isFechaHastaDisabled" />
          </div>

          <div></div>
        </div>

        <div v-if="generalError" class="validation-banner"><span class="material-icons">warning</span>{{ generalError }}</div>

        <div class="actions-row">
          <button class="btn-cyan" type="button" :disabled="loading" @click="buscar">
            <span class="material-icons">search</span>
            <span>{{ loading ? 'BUSCANDO...' : 'BUSCAR' }}</span>
          </button>
          <button class="btn-outline" type="button" @click="limpiar">
            <span class="material-icons">sort</span>
            <span>LIMPIAR</span>
          </button>
        </div>
      </div>
    </section>

    <FmTypingLoader v-if="loading" title="Validando OT de Redes" message="Buscando registros y preparando la grilla..." />

    <section class="fm-panel results-panel">
      <div class="fm-panel-header" @click="openResults = !openResults">
        <span>VALIDACION DE OT</span>
        <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
      </div>

      <div v-show="openResults" class="fm-panel-body grid-body">
        <div class="table-wrap">
          <table class="fm-grid">
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.field" :style="colStyle(column)">
                  <div class="th-content">
                    <span>{{ column.label }}</span>
                    <span class="sort-icon">↕</span>
                    <span class="resize-handle" @mousedown.prevent="startResize(column, $event)"></span>
                  </div>
                </th>
              </tr>
              <tr class="filter-row">
                <th v-for="column in columns" :key="`filter-${column.field}`" :style="colStyle(column)">
                  <span>~</span>
                  <input v-model="columnFilters[column.field]" @input="currentPage = 1" />
                  <button type="button" @click="columnFilters[column.field] = ''">x</button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pageRows" :key="row.nro_ot">
                <td v-for="column in columns" :key="`${row.nro_ot}-${column.field}`" :style="colStyle(column)">{{ row[column.field] }}</td>
              </tr>
              <tr v-if="pageRows.length === 0" class="empty-row-wrap">
                <td class="empty-row" :colspan="columns.length">No hay resultados</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-footer">
          <div class="footer-icons">
            <button title="Exportar Excel" @click="exportar"><span class="material-icons">file_download</span></button>
            <button title="Limpiar filtros" @click="limpiarFiltrosGrilla"><span class="material-icons">filter_alt_off</span></button>
          </div>
          <div class="pager">
            <button :disabled="currentPage === 1" @click="currentPage = 1">|&lt;</button>
            <button :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
            <span>Página</span>
            <input type="number" min="1" :max="totalPages" v-model.number="currentPage" />
            <span>de {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="currentPage++">&gt;</button>
            <button :disabled="currentPage === totalPages" @click="currentPage = totalPages">&gt;|</button>
            <select v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option></select>
          </div>
          <div class="showing">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import FmTypingLoader from '../shared/FmTypingLoader.vue'
import ValidacionDatePicker from './ValidacionDatePicker.vue'
import { downloadExcel } from '../../utils/excelExport.js'

const openFilters = ref(true)
const openResults = ref(true)
const openCombo = ref(null)
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const centroError = ref('')
const generalError = ref('')
const showSuggestions = ref(false)
const activeSuggestion = ref(0)

const filters = reactive({ regiones: [], subRegiones: [], centros: [], almacenes: [], nroOt: '', fechaDesde: '', fechaHasta: '' })
const comboSearch = reactive({ regiones: '', subRegiones: '', centros: '', almacenes: '' })

const regionOptions = ['014-Prueba1','032-Pedro1','111-REGION SIN PROV','A00-AMBA','B00-B2B','B00-FIBERCORP','C00-Litoral','D00-Mediterranea','METRO','NORTE','SUR','OESTE','PATAGONIA','NOA','NEA','CENTRO','BUENOS AIRES','CAPITAL FEDERAL','PARAGUAY','URUGUAY','CORDOBA','SANTA FE','MENDOZA','ROSARIO','TIGRE','LA PLATA','QUILMES','SAN MARTIN','VICENTE LOPEZ','SAN ISIDRO','BERISSO','ENSENADA']
const subRegionOptions = [...regionOptions]
const centroOptions = Array.from({ length: 294 }, (_, i) => ['12M0-FOPTIK','12M0-NYSAA','13B0-NYS 2 - Necochea','3210-Cablevisión - MSO Administ.','3X00-AVC Cordoba','4810-Bersabel'][i] || `${String(5000 + i).padStart(4, '0')}-Centro Logístico ${i + 1}`)
const almacenOptions = ['alma cen - alma cen','FUISTE- FUISTE','1234-Sarlanga Pepe Almacen','32MO-UM-FibercorpMart3','A001-OLIMPO','A2202-alm2202','AL00-PRUEBA-ALMACEN','OC15','OC01','A-1','A-2','ALM-001','ALM-004','ALM-007']
const otOptions = ['014000001','014000002','014000003','014-RED-9000','014-RED-9001','014-RED-9002','OT-014-0001','OT-014-0002','OT-RED-09000','OT-RED-09001','M00966068','M00981724','J000000000000325296','JOP68807891','JOP68807890','JOP101450834','ICD12482236','ICD12273196','707405355','706020499']

const combos = [
  { key: 'regiones', label: 'Región', items: regionOptions, allowAll: true },
  { key: 'subRegiones', label: 'Sub Región', items: subRegionOptions, allowAll: true },
  { key: 'centros', label: 'Centro Logístico', items: centroOptions, allowAll: true },
  { key: 'almacenes', label: 'Almacen', items: almacenOptions, allowAll: false }
]

const hasAnyLocation = computed(() => filters.regiones.length || filters.subRegiones.length || filters.centros.length || filters.almacenes.length)
const hasOt = computed(() => filters.nroOt.trim().length > 0)
const isNroOtDisabled = computed(() => !!hasAnyLocation.value)
const isFechaHastaDisabled = computed(() => !hasAnyLocation.value && !hasOt.value)

const otSuggestions = computed(() => {
  const term = normalize(filters.nroOt.trim())
  if (!term || isNroOtDisabled.value) return []
  return otOptions.filter(item => normalize(item).includes(term)).slice(0, 10)
})

const columns = reactive([
  { field: 'nro_ot', label: 'NRO OT', width: 220 },
  { field: 'estado_ot', label: 'Estado OT', width: 220 },
  { field: 'cod_centro', label: 'COD CENTRO', width: 220 },
  { field: 'centro', label: 'CENTRO', width: 220 },
  { field: 'cod_almacen', label: 'COD ALMACEN', width: 220 },
  { field: 'almacen', label: 'ALMACEN', width: 220 },
  { field: 'direccion', label: 'DIRECCION', width: 220 },
  { field: 'codigo_tarea', label: 'CODIGO TAREA', width: 220 }
])
const columnFilters = reactive(Object.fromEntries(columns.map(column => [column.field, ''])))
const rows = ref([])

const normalize = value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const norm = value => normalize(value)
const filteredRows = computed(() => rows.value.filter(row => columns.every(column => !norm(columnFilters[column.field]) || norm(row[column.field]).includes(norm(columnFilters[column.field])))))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value)))
const pageRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredRows.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredRows.value.length))

const comboText = combo => filters[combo.key].length === 0 ? 'Seleccionar' : filters[combo.key].length === combo.items.length ? `Todos seleccionados (${filters[combo.key].length})` : `${filters[combo.key].length} seleccionados`
const allSelected = combo => combo.items.length > 0 && filters[combo.key].length === combo.items.length
const filteredComboItems = combo => {
  const term = normalize(comboSearch[combo.key].trim())
  if (!term) return combo.items
  return combo.items.filter(item => normalize(item).includes(term))
}
const toggleItem = (key, item) => {
  const selected = filters[key]
  const index = selected.indexOf(item)
  index >= 0 ? selected.splice(index, 1) : selected.push(item)
}
const toggleAll = combo => { filters[combo.key] = allSelected(combo) ? [] : [...combo.items] }
const clearCombo = key => { comboSearch[key] = ''; filters[key] = [] }

const showOtAutocomplete = () => { showSuggestions.value = otSuggestions.value.length > 0; activeSuggestion.value = 0 }
const hideOtAutocomplete = () => setTimeout(() => { showSuggestions.value = false }, 150)
const selectOt = ot => { filters.nroOt = ot; showSuggestions.value = false }
const moveSuggestion = direction => {
  if (!otSuggestions.value.length) return
  showSuggestions.value = true
  activeSuggestion.value = Math.max(0, Math.min(otSuggestions.value.length - 1, activeSuggestion.value + direction))
}
const confirmSuggestion = () => { if (showSuggestions.value && otSuggestions.value.length) selectOt(otSuggestions.value[activeSuggestion.value]) }

watch(isNroOtDisabled, disabled => { if (disabled) filters.nroOt = '' })
watch(isFechaHastaDisabled, disabled => { if (disabled) filters.fechaHasta = '' })
watch(() => filters.centros.length, () => { centroError.value = ''; generalError.value = '' })

const validar = () => {
  if ((filters.regiones.length || filters.subRegiones.length) && filters.centros.length === 0) {
    centroError.value = 'Debe seleccionar al menos un Centro Logístico para realizar la búsqueda.'
    generalError.value = 'No se puede realizar la búsqueda sin Centro Logístico.'
    return false
  }
  return true
}

const buscar = () => {
  if (!validar()) return
  loading.value = true
  openFilters.value = false
  setTimeout(() => {
    rows.value = Array.from({ length: 45 }, (_, i) => ({
      nro_ot: `OT-RED-${String(9000 + i).padStart(5, '0')}`,
      estado_ot: ['PENDIENTE','VALIDADA','ERROR','RECHAZADA'][i % 4],
      cod_centro: `C-${String(i + 1).padStart(3, '0')}`,
      centro: ['PNT1','PNL1','CBA1','MDQ1'][i % 4],
      cod_almacen: `ALM-${String((i % 12) + 1).padStart(3, '0')}`,
      almacen: ['OC15','OC01','A-1','A-2'][i % 4],
      direccion: ['PERON JUAN DOMINGO','SOLIS 329','AV ALTE BROWN 1020','CHILE 1326'][i % 4],
      codigo_tarea: ['9HDA0','RCD13','9DSPC','GIACN'][i % 4]
    }))
    currentPage.value = 1
    loading.value = false
  }, 650)
}

const limpiar = () => {
  filters.regiones = []
  filters.subRegiones = []
  filters.centros = []
  filters.almacenes = []
  filters.nroOt = ''
  filters.fechaDesde = ''
  filters.fechaHasta = ''
  Object.keys(comboSearch).forEach(key => { comboSearch[key] = '' })
  centroError.value = ''
  generalError.value = ''
  showSuggestions.value = false
  openCombo.value = null
  openFilters.value = true
}
const limpiarFiltrosGrilla = () => { Object.keys(columnFilters).forEach(key => { columnFilters[key] = '' }); currentPage.value = 1 }
const colStyle = column => ({ width: `${column.width}px`, minWidth: `${column.width}px`, maxWidth: `${column.width}px` })
const startResize = (column, event) => {
  const startX = event.clientX
  const startWidth = column.width
  const onMove = moveEvent => { column.width = Math.max(80, startWidth + moveEvent.clientX - startX) }
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
const exportar = () => downloadExcel({ filename: 'validacion_ot_redes.xls', title: 'Validacion de OT de Redes', columns, rows: filteredRows.value, mode: 'allColumns' })
const closeMenus = event => { if (!event.target.closest('.multi-field')) openCombo.value = null }
onMounted(() => document.addEventListener('mousedown', closeMenus))
onBeforeUnmount(() => document.removeEventListener('mousedown', closeMenus))
</script>

<style scoped>
.validacion-redes-page { font-size: 13px; color: #111; }
.fm-panel { background: #fff; border: 1px solid #d8d8d8; margin-bottom: 7px; }
.fm-panel-header { height: 31px; background: #f7f7f7; border-bottom: 1px solid #d8d8d8; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; cursor: pointer; }
.fm-panel-header .material-icons { font-size: 18px; color: #666; }
.filters-body { border-left: 4px solid #00bcd4; }
.results-panel { border-left: 4px solid #00bcd4; }
.filters-row { display: grid; gap: 20px; padding: 12px 20px 14px; border-bottom: 1px solid #d8d8d8; }
.filters-row-4 { grid-template-columns: repeat(4, minmax(180px, 1fr)); }
.fm-field { position: relative; min-width: 0; }
.fm-field label { display: block; margin-bottom: 6px; font-weight: 400; }
.fm-input, .multi-button { width: 100%; height: 31px; border: 1px solid #9e9e9e; border-radius: 3px; background: #fff; padding: 4px 8px; font-size: 13px; font-weight: 400; box-sizing: border-box; }
.fm-input:focus, .multi-button:focus { outline: none; border-color: #00bcd4; box-shadow: 0 0 0 2px rgba(0,188,212,.20); }
.fm-input.disabled { background: #e9e9e9; color: #777; cursor: not-allowed; }
.multi-button { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: linear-gradient(180deg, #fff 0%, #f7fbfc 100%); cursor: pointer; color: #263238; padding: 0 11px; border-color: #b7c7cf; box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 1px 2px rgba(0,0,0,.06); transition: border-color .16s ease, box-shadow .16s ease, background-color .16s ease, color .16s ease; }
.multi-button:hover { border-color: #00a9bd; background: #f2fbfc; box-shadow: 0 0 0 2px rgba(0,188,212,.10), 0 2px 5px rgba(0,0,0,.08); }
.multi-button.has-selection { border-color: #00a9bd; background: #effcfe; }
.multi-button.error { border-color: #e91e63; }
.multi-button .material-icons { font-size: 16px; color: #263238; }
.multi-button-main { min-width: 0; display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex: 1; }
.multi-button-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.multi-button-count { min-width: 22px; height: 18px; padding: 0 6px; border-radius: 10px; background: #00a9bd; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; line-height: 18px; }
.field-error { color: #e91e63; font-size: 12px; margin-top: 5px; }
.multi-menu, .ot-suggestions { position: absolute; top: 52px; left: 0; right: 0; z-index: 30; background: #fff; border: 1px solid #bdbdbd; box-shadow: 0 10px 28px rgba(0,0,0,.2); max-height: 315px; overflow: auto; }
.multi-menu { border-color: #00bcd4; border-radius: 4px; overflow: hidden; }
.multi-search { display: grid; grid-template-columns: 40px 1fr 40px; height: 40px; border-bottom: 1px solid #dce8ec; background: #fff; position: sticky; top: 0; z-index: 2; }
.multi-search span { display: flex; align-items: center; justify-content: center; color: #263238; }
.multi-search input { border: 0; border-left: 1px solid #dce8ec; padding: 0 10px; outline: none; font-size: 13px; }
.multi-search input:focus { box-shadow: inset 0 -2px 0 #00bcd4; }
.multi-search button { border: 1px solid #00bcd4; background: #fff; color: #00a9bd; border-radius: 16px; margin: 5px; cursor: pointer; }
.multi-search button:hover { background: #e0f7fa; color: #008fa1; }
.multi-options-list { max-height: 232px; overflow: auto; padding: 4px 0; }
.multi-option { display: grid; grid-template-columns: 20px 1fr auto; align-items: center; gap: 6px; min-height: 34px; padding: 7px 10px; cursor: pointer; font-weight: 400; color: #111; border-left: 3px solid transparent; transition: background-color .14s ease, border-color .14s ease, color .14s ease; }
.multi-option:hover { background: #eefbfc; }
.multi-option.selected { background: #f5fdff; color: #111; border-left-color: #00bcd4; }
.multi-option-all { position: sticky; top: 40px; z-index: 1; border-bottom: 1px solid #dce8ec; background: #f8fcfd; font-weight: 500; }
.multi-option-all.selected { background: #e0f7fa; color: #004d57; }
.multi-option small { color: #607d8b; font-size: 11px; }
.multi-option input { width: 14px; height: 14px; accent-color: #00a9bd; }
.multi-empty { padding: 14px; color: #607d8b; text-align: center; }
.ot-suggestions { max-height: 235px; }
.ot-suggestions button { display: block; width: 100%; border: 0; background: #fff; text-align: left; padding: 8px 11px; cursor: pointer; }
.ot-suggestions button:hover, .ot-suggestions button.active { background: #e0f7fa; color: #006f7f; }
.validation-banner { margin: 10px 20px 0; padding: 9px 12px; border: 1px solid rgba(233,30,99,.25); background: #fff3f7; color: #c2185b; border-radius: 4px; display: flex; gap: 8px; align-items: center; }
.validation-banner .material-icons { font-size: 18px; }
.actions-row { display: flex; justify-content: center; gap: 8px; padding: 18px 0 20px; }
.btn-cyan, .btn-outline { height: 32px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; border-radius: 4px; padding: 0 16px; font-size: 12px; font-weight: 500; letter-spacing: .2px; cursor: pointer; transition: background-color .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease; box-shadow: 0 3px 8px rgba(0,0,0,.12); }
.btn-cyan .material-icons, .btn-outline .material-icons { font-size: 15px; line-height: 1; }
.btn-cyan { background: #00a9bd; border: 1px solid #00a9bd; color: #fff; }
.btn-cyan:hover:not(:disabled) { background: #008fa1; border-color: #008fa1; box-shadow: 0 5px 12px rgba(0,143,161,.28); transform: translateY(-1px); }
.btn-outline { background: #fff; border: 1px solid #00a9bd; color: #00a9bd; }
.btn-outline:hover { background: #e0f7fa; border-color: #008fa1; color: #008fa1; box-shadow: 0 5px 12px rgba(0,143,161,.18); transform: translateY(-1px); }
.grid-body { padding: 8px; }
.table-wrap { overflow: auto; min-height: 350px; border: 1px solid #cfcfcf; }
.fm-grid { border-collapse: collapse; table-layout: fixed; width: max-content; min-width: 100%; }
.fm-grid th, .fm-grid td { border-right: 1px solid #b7c7cf; border-bottom: 1px solid #b7c7cf; padding: 8px; white-space: nowrap; text-align: left; overflow: hidden; text-overflow: ellipsis; }
.fm-grid th { background: #f7f7f7; color: #263f4d; }
.th-content { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 6px; height: 18px; padding-right: 8px; }
.sort-icon { font-size: 12px; color: #90a4ae; }
.resize-handle { position: absolute; right: -8px; top: -8px; width: 10px; height: 36px; cursor: col-resize; }
.resize-handle:hover { border-right: 2px solid #00a9bd; }
.filter-row th { background: #fff; }
.filter-row input { width: calc(100% - 35px); height: 28px; border: 1px solid #c5c5c5; border-radius: 4px; padding: 4px; }
.filter-row input:focus { outline: none; border-color: #00bcd4; box-shadow: 0 0 0 2px rgba(0,188,212,.14); }
.filter-row button { border: 0; background: transparent; font-weight: 700; cursor: pointer; }
.empty-row-wrap { height: 255px; }
.empty-row { text-align: center !important; vertical-align: middle !important; padding: 0 !important; color: #607d8b; }
.grid-footer { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border: 1px solid #d1d1d1; border-top: 0; padding: 6px 10px; }
.footer-icons { display: flex; gap: 8px; }
.footer-icons button, .pager button { border: 0; background: transparent; cursor: pointer; }
.footer-icons .material-icons { font-size: 18px; color: #455a64; }
.footer-icons button:hover .material-icons { color: #00a9bd; }
.pager { display: flex; align-items: center; gap: 8px; }
.pager input { width: 42px; height: 26px; border: 1px solid #c5c5c5; border-radius: 4px; text-align: center; }
.pager select { height: 28px; accent-color: #00bcd4; }
.showing { text-align: right; }
@media(max-width:1000px) { .filters-row-4 { grid-template-columns: repeat(2, minmax(180px, 1fr)); } }
@media(max-width:600px) { .filters-row-4 { grid-template-columns: 1fr; } .grid-footer { grid-template-columns: 1fr; gap: 8px; } .showing { text-align: left; } }
</style>
