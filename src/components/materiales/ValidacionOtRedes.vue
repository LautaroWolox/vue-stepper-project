<template>
  <div class="validacion-redes-page">
    <section class="fm-panel">
      <div class="fm-panel-header" @click="openFilters = !openFilters">
        <span>FILTROS DE BÚSQUEDA</span>
        <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
      </div>
      <div v-show="openFilters" class="fm-panel-content filters-content">
        <div class="filters-row top-row">
          <MultiSelectBox label="Región" :items="regionOptions" v-model="filters.regiones" allow-select-all placeholder="None selected" />
          <MultiSelectBox label="Sub Región" :items="subRegionOptions" v-model="filters.subRegiones" allow-select-all placeholder="None selected" />
          <MultiSelectBox label="Centro Logístico" :items="centroOptions" v-model="filters.centros" allow-select-all placeholder="None selected" />
          <MultiSelectBox label="Almacen" :items="almacenOptions" v-model="filters.almacenes" :allow-select-all="false" placeholder="None selected" />
        </div>
        <div class="filters-row bottom-row">
          <div class="fm-field"><label>Nro. Ot</label><input class="form-control" :class="{ disabled: isNroOtDisabled }" v-model.trim="filters.nroOt" :disabled="isNroOtDisabled" /></div>
          <DateTimePicker label="Fecha Ult. Modif. Desde" v-model="filters.fechaDesde" :disabled="false" />
          <DateTimePicker label="Fecha Ult. Modif. Hasta" v-model="filters.fechaHasta" :disabled="isFechaHastaDisabled" />
          <div class="empty-cell"></div>
        </div>
        <div class="filters-actions"><button class="btn-cyan" type="button" @click="buscar" :disabled="loading">{{ loading ? 'BUSCANDO...' : 'BUSCAR' }}</button><button class="btn-cyan-outline" type="button" @click="limpiar">LIMPIAR</button></div>
      </div>
    </section>
    <FmTypingLoader v-if="loading" title="Validando OT de Redes" message="Buscando registros y preparando la grilla..." />
    <section class="fm-panel results-panel">
      <div class="fm-panel-header" @click="openResults = !openResults"><span>VALIDACION DE OT</span><span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span></div>
      <div v-show="openResults" class="fm-panel-content grid-content">
        <div class="table-scroll"><table class="fm-grid"><thead><tr><th v-for="column in columns" :key="column.field" :style="{ width: column.width + 'px', minWidth: column.width + 'px' }">{{ column.label }}</th></tr><tr class="filter-row"><th v-for="column in columns" :key="`f-${column.field}`" :style="{ width: column.width + 'px', minWidth: column.width + 'px' }"><span class="filter-prefix">~</span><input v-model="columnFilters[column.field]" @input="currentPage = 1" /><button type="button" @click="clearColumnFilter(column.field)">x</button></th></tr></thead><tbody><tr v-for="row in paginatedRows" :key="row.nro_ot"><td v-for="column in columns" :key="`${row.nro_ot}-${column.field}`">{{ row[column.field] }}</td></tr><tr v-if="paginatedRows.length === 0"><td class="empty-row" :colspan="columns.length">No hay resultados</td></tr></tbody></table></div>
        <div class="grid-footer"><div class="footer-icons"><button title="Exportar Excel" @click="exportar"><span class="material-icons">file_download</span></button><button title="Limpiar filtros" @click="clearGridFilters"><span class="material-icons">filter_alt_off</span></button></div><div class="pager"><button @click="goFirst" :disabled="currentPage === 1">|&lt;</button><button @click="goPrev" :disabled="currentPage === 1">&lt;</button><span>Página</span><input v-model.number="currentPage" type="number" min="1" :max="totalPages" /><span>de {{ totalPages }}</span><button @click="goNext" :disabled="currentPage === totalPages">&gt;</button><button @click="goLast" :disabled="currentPage === totalPages">&gt;|</button><select v-model.number="itemsPerPage" @change="currentPage = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option></select></div><div class="showing">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</div></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onBeforeUnmount, reactive, ref, watch } from 'vue'
import FmTypingLoader from '../shared/FmTypingLoader.vue'
import { downloadExcel } from '../../utils/excelExport.js'

const MultiSelectBox = defineComponent({
  props: { label: String, items: { type: Array, default: () => [] }, modelValue: { type: Array, default: () => [] }, allowSelectAll: { type: Boolean, default: true }, placeholder: { type: String, default: 'None selected' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false)
    const search = ref('')
    const root = ref(null)
    const filteredItems = computed(() => {
      const term = search.value.trim().toLowerCase()
      if (!term) return props.items
      if (term.length < 3) return []
      return props.items.filter(item => item.toLowerCase().includes(term))
    })
    const allSelected = computed(() => props.items.length > 0 && props.modelValue.length === props.items.length)
    const buttonText = computed(() => props.modelValue.length === 0 ? props.placeholder : allSelected.value ? `All selected (${props.modelValue.length})` : `${props.modelValue.length} selected`)
    const isChecked = item => props.modelValue.includes(item)
    const toggle = item => {
      const selected = [...props.modelValue]
      const index = selected.indexOf(item)
      if (index >= 0) selected.splice(index, 1)
      else selected.push(item)
      emit('update:modelValue', selected)
    }
    const toggleAll = () => emit('update:modelValue', allSelected.value ? [] : [...props.items])
    const clear = () => { search.value = ''; emit('update:modelValue', []) }
    const onDocClick = event => { if (root.value && !root.value.contains(event.target)) open.value = false }
    document.addEventListener('mousedown', onDocClick)
    onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))
    return () => h('div', { class: 'fm-field multiselect-field', ref: root }, [
      h('label', props.label),
      h('button', { type: 'button', class: ['multi-trigger', props.modelValue.length ? 'has-value' : ''], onClick: () => { open.value = !open.value } }, [h('span', buttonText.value), h('span', { class: 'material-icons' }, 'arrow_drop_down')]),
      open.value ? h('div', { class: 'multi-panel' }, [
        h('div', { class: 'multi-search' }, [h('span', { class: 'material-icons' }, 'search'), h('input', { value: search.value, placeholder: 'Search', onInput: e => { search.value = e.target.value } }), h('button', { type: 'button', onClick: clear }, '⊗')]),
        props.allowSelectAll ? h('label', { class: ['multi-option select-all', allSelected.value ? 'selected' : ''] }, [h('input', { type: 'checkbox', checked: allSelected.value, onChange: toggleAll }), h('span', 'Select all')]) : null,
        h('div', { class: 'multi-list' }, filteredItems.value.map(item => h('label', { class: ['multi-option', isChecked(item) ? 'selected' : ''], key: item }, [h('input', { type: 'checkbox', checked: isChecked(item), onChange: () => toggle(item) }), h('span', item)]))),
        filteredItems.value.length === 0 ? h('div', { class: 'multi-empty' }, search.value.trim().length < 3 ? 'Escribí al menos 3 letras' : 'Sin resultados') : null
      ]) : null
    ])
  }
})

const DateTimePicker = defineComponent({
  props: { label: String, modelValue: String, disabled: Boolean },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false)
    const root = ref(null)
    const now = new Date()
    const selected = ref(props.modelValue ? new Date(props.modelValue) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0))
    const month = ref(selected.value.getMonth())
    const year = ref(selected.value.getFullYear())
    const hour = ref(String(selected.value.getHours()).padStart(2, '0'))
    const minute = ref(String(selected.value.getMinutes()).padStart(2, '0'))
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    const weekDays = ['Do','Lu','Ma','Mi','Ju','Vi','Sa']
    const valueText = computed(() => props.modelValue || '')
    const days = computed(() => {
      const first = new Date(year.value, month.value, 1).getDay()
      const count = new Date(year.value, month.value + 1, 0).getDate()
      const arr = Array.from({ length: first }, () => null)
      for (let day = 1; day <= count; day++) arr.push(day)
      return arr
    })
    const format = date => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()} ${hour.value}:${minute.value}`
    const chooseDay = day => { if (!day) return; selected.value = new Date(year.value, month.value, day, Number(hour.value), Number(minute.value)); emit('update:modelValue', format(selected.value)) }
    const applyTime = () => { selected.value = new Date(year.value, month.value, selected.value.getDate(), Number(hour.value), Number(minute.value)); emit('update:modelValue', format(selected.value)) }
    const prevMonth = () => { if (month.value === 0) { month.value = 11; year.value-- } else month.value-- }
    const nextMonth = () => { if (month.value === 11) { month.value = 0; year.value++ } else month.value++ }
    const today = () => { const d = new Date(); month.value = d.getMonth(); year.value = d.getFullYear(); selected.value = d; hour.value = String(d.getHours()).padStart(2, '0'); minute.value = String(d.getMinutes()).padStart(2, '0'); emit('update:modelValue', format(d)) }
    const close = () => { applyTime(); open.value = false }
    const onDocClick = event => { if (root.value && !root.value.contains(event.target)) open.value = false }
    document.addEventListener('mousedown', onDocClick)
    onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))
    watch(() => props.modelValue, value => { if (!value) return; const [datePart, timePart] = value.split(' '); if (!datePart) return; const [d, m, y] = datePart.split('/').map(Number); const [hh = '00', mm = '00'] = (timePart || '').split(':'); selected.value = new Date(y, m - 1, d, Number(hh), Number(mm)); month.value = selected.value.getMonth(); year.value = selected.value.getFullYear(); hour.value = hh.padStart(2, '0'); minute.value = mm.padStart(2, '0') })
    return () => h('div', { class: 'fm-field date-field', ref: root }, [h('label', props.label), h('button', { type: 'button', class: ['date-trigger', props.disabled ? 'disabled' : ''], disabled: props.disabled, onClick: () => { open.value = !open.value } }, valueText.value), open.value && !props.disabled ? h('div', { class: 'date-panel' }, [h('div', { class: 'date-head' }, [h('button', { type: 'button', onClick: prevMonth }, '‹'), h('strong', `${monthNames[month.value]} ${year.value}`), h('button', { type: 'button', onClick: nextMonth }, '›')]), h('div', { class: 'week-row' }, weekDays.map(d => h('span', d))), h('div', { class: 'days-grid' }, days.value.map((day, index) => h('button', { type: 'button', disabled: !day, class: day && selected.value.getDate() === day && selected.value.getMonth() === month.value && selected.value.getFullYear() === year.value ? 'active' : '', key: index, onClick: () => chooseDay(day) }, day || ''))), h('div', { class: 'time-box' }, [h('label', 'Hora'), h('input', { type: 'number', min: '0', max: '23', value: hour.value, onInput: e => { hour.value = String(Math.max(0, Math.min(23, Number(e.target.value || 0)))).padStart(2, '0') } }), h('label', 'Minutos'), h('input', { type: 'number', min: '0', max: '59', value: minute.value, onInput: e => { minute.value = String(Math.max(0, Math.min(59, Number(e.target.value || 0)))).padStart(2, '0') } })]), h('div', { class: 'date-actions' }, [h('button', { type: 'button', onClick: today }, 'Hoy'), h('button', { type: 'button', onClick: close }, 'Listo')])]) : null])
  }
})

const openFilters = ref(true)
const openResults = ref(true)
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filters = reactive({ regiones: [], subRegiones: [], centros: [], almacenes: [], nroOt: '', fechaDesde: '', fechaHasta: '' })
const regionOptions = ['014-Prueba1','032-Pedro1','111-REGION SIN PROV','A00-AMBA','B00-B2B','B00-FIBERCORP','C00-Litoral','D00-Mediterranea','D00-MEDITERRANEA','D00-Mediterraneas','D100-RegionInventada','D200-RegionInventada','D300-RegionInventada','D97-RegionInventada0','D98-RegionInventada1','METRO','NORTE','SUR','OESTE','PATAGONIA','NOA','NEA','CENTRO','BUENOS AIRES','CAPITAL FEDERAL','PARAGUAY','URUGUAY','CORDOBA','SANTA FE','MENDOZA','ROSARIO','TIGRE','LA PLATA','QUILMES','SAN MARTIN','VICENTE LOPEZ','SAN ISIDRO','BERISSO','ENSENADA','PILAR','MORENO','ITUZAINGO','LANUS','LOMAS','AVELLANEDA','EZEIZA']
const subRegionOptions = [...regionOptions]
const centroOptions = Array.from({ length: 294 }, (_, i) => ['12M0-FOPTIK','12M0-NYSAA','13B0-NYS 2 - Necochea','3210-Cablevisión - MSO Administ.','3X00-AVC Cordoba','4810-Bersabel'][i] || `${String(5000+i).padStart(4,'0')}-Centro Logístico ${i+1}`)
const almacenOptions = ['alma cen - alma cen','FUISTE- FUISTE','1234-Sarlanga Pepe Almacen','32MO-UM-FibercorpMart3','A001-OLIMPO','A2202-alm2202','AL00-PRUEBA-ALMACEN','AL01-DEPÓSITO NORTE','AL02-DEPÓSITO SUR','AL03-DEPÓSITO AMBA','OC15','OC01','A-1','A-2','ALM-001','ALM-004','ALM-007','ALM-010','ALM-013']
const hasAnyLocationSelection = computed(() => filters.regiones.length || filters.subRegiones.length || filters.centros.length || filters.almacenes.length)
const isNroOtDisabled = computed(() => !!hasAnyLocationSelection.value)
const isFechaHastaDisabled = computed(() => !hasAnyLocationSelection.value)
watch(isNroOtDisabled, disabled => { if (disabled) filters.nroOt = '' })
watch(isFechaHastaDisabled, disabled => { if (disabled) filters.fechaHasta = '' })
const columns = [{ field: 'nro_ot', label: 'NRO OT', width: 230 }, { field: 'estado_ot', label: 'Estado OT', width: 230 }, { field: 'cod_centro', label: 'COD CENTRO', width: 230 }, { field: 'centro', label: 'CENTRO', width: 230 }, { field: 'cod_almacen', label: 'COD ALMACEN', width: 230 }, { field: 'almacen', label: 'ALMACEN', width: 230 }, { field: 'direccion', label: 'DIRECCION', width: 230 }, { field: 'codigo_tarea', label: 'CODIGO TAREA', width: 230 }]
const columnFilters = reactive(Object.fromEntries(columns.map(c => [c.field, ''])))
const rows = ref([])
const normalize = value => String(value || '').toLowerCase()
const filteredRows = computed(() => rows.value.filter(row => columns.every(col => !normalize(columnFilters[col.field]) || normalize(row[col.field]).includes(normalize(columnFilters[col.field])))))
const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value) || 1)
const paginatedRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredRows.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredRows.value.length))
const buscar = () => { loading.value = true; openFilters.value = false; setTimeout(() => { rows.value = Array.from({ length: 45 }, (_, i) => ({ nro_ot: `OT-RED-${String(9000+i).padStart(5,'0')}`, estado_ot: ['PENDIENTE','VALIDADA','ERROR','RECHAZADA'][i % 4], cod_centro: `C-${String(i+1).padStart(3,'0')}`, centro: ['PNT1','PNL1','CBA1','MDQ1'][i % 4], cod_almacen: `ALM-${String((i % 12) + 1).padStart(3,'0')}`, almacen: ['OC15','OC01','A-1','A-2'][i % 4], direccion: ['PERON JUAN DOMINGO','SOLIS 329','AV ALTE BROWN 1020','CHILE 1326'][i % 4], codigo_tarea: ['9HDA0','RCD13','9DSPC','GIACN'][i % 4] })); loading.value = false; currentPage.value = 1 }, 650) }
const limpiar = () => { filters.regiones = []; filters.subRegiones = []; filters.centros = []; filters.almacenes = []; filters.nroOt = ''; filters.fechaDesde = ''; filters.fechaHasta = ''; rows.value = []; clearGridFilters(); openFilters.value = true }
const clearColumnFilter = field => { columnFilters[field] = ''; currentPage.value = 1 }
const clearGridFilters = () => { Object.keys(columnFilters).forEach(key => { columnFilters[key] = '' }); currentPage.value = 1 }
const goFirst = () => { currentPage.value = 1 }
const goPrev = () => { currentPage.value = Math.max(1, currentPage.value - 1) }
const goNext = () => { currentPage.value = Math.min(totalPages.value, currentPage.value + 1) }
const goLast = () => { currentPage.value = totalPages.value }
const exportar = () => downloadExcel({ filename: 'validacion_ot_redes.xls', title: 'Validacion de OT de Redes', columns, rows: filteredRows.value, mode: 'allColumns' })
</script>

<style scoped>
.validacion-redes-page{color:#111;font-size:13px}.fm-panel{border:1px solid #d8d8d8;background:#fff;margin-bottom:7px}.fm-panel-header{height:31px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#f7f7f7;border-bottom:1px solid #d8d8d8;cursor:pointer;font-size:14px;font-weight:400}.fm-panel-header .material-icons{font-size:19px;color:#666}.filters-content{border-left:4px solid #00bcd4}.filters-row{display:grid;gap:20px;padding:12px 20px 14px;border-bottom:1px solid #d8d8d8}.top-row{grid-template-columns:repeat(4,minmax(190px,1fr))}.bottom-row{grid-template-columns:1fr 1fr 1fr 1fr}.fm-field{position:relative}.fm-field label{display:block;font-size:13px;font-weight:700;margin-bottom:6px}.form-control,.date-trigger,.multi-trigger{width:100%;height:27px;border:1px solid #888;border-radius:2px;background:#fff;padding:3px 8px;font-size:13px}.form-control.disabled,.date-trigger.disabled{background:#e9e9e9;color:#777;cursor:not-allowed}.multi-trigger{display:flex;justify-content:center;align-items:center;gap:4px;background:linear-gradient(#fff,#e9e9e9);cursor:pointer}.multi-trigger .material-icons{font-size:16px}.multi-panel{position:absolute;top:49px;left:0;z-index:2000;width:100%;max-height:310px;background:#fff;border:1px solid #bdbdbd;box-shadow:0 8px 24px rgba(0,0,0,.18);overflow:auto}.multi-search{display:grid;grid-template-columns:42px 1fr 42px;height:40px;border-bottom:1px solid #d1d1d1}.multi-search span{display:flex;align-items:center;justify-content:center}.multi-search input{border:0;border-left:1px solid #d1d1d1;padding:0 10px;outline:none}.multi-search button{border:1px solid #00bcd4;background:#fff;color:#00a9bd;border-radius:18px;margin:5px;cursor:pointer}.multi-option{display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 12px;cursor:pointer}.multi-option:hover{background:#eef7f8}.multi-option.selected{background:#00a9bd;color:#fff}.multi-option input{width:14px;height:14px;accent-color:#00a9bd}.select-all{font-weight:700}.multi-empty{padding:14px;color:#607d8b}.date-panel{position:absolute;top:49px;left:0;z-index:2100;width:276px;background:#fff;border:1px solid #bdbdbd;border-radius:8px;box-shadow:0 14px 35px rgba(0,0,0,.22);padding:10px}.date-head{display:flex;align-items:center;justify-content:space-between;background:#eef7f8;border-radius:6px;padding:6px}.date-head button,.date-actions button{border:1px solid #00a9bd;background:#fff;color:#00a9bd;border-radius:16px;padding:4px 10px;cursor:pointer}.week-row,.days-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px}.week-row span{text-align:center;font-weight:700;color:#607d8b}.days-grid button{height:28px;border:1px solid #e0e0e0;background:#fff;border-radius:5px;cursor:pointer}.days-grid button.active{background:#00a9bd;color:#fff;border-color:#00a9bd}.days-grid button:disabled{background:transparent;border-color:transparent;cursor:default}.time-box{display:grid;grid-template-columns:1fr 72px;gap:7px;align-items:center;margin-top:10px}.time-box input{height:28px;border:1px solid #bdbdbd;border-radius:5px;padding:4px 8px}.date-actions{display:flex;justify-content:space-between;margin-top:10px}.filters-actions{display:flex;justify-content:center;gap:8px;padding:18px 0 20px}.btn-cyan,.btn-cyan-outline{border-radius:18px;padding:8px 18px;font-size:13px;font-weight:400;cursor:pointer;transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease}.btn-cyan{background:#00a9bd;border:1px solid #00a9bd;color:#fff}.btn-cyan:hover:not(:disabled){background:#008fa1;border-color:#008fa1;box-shadow:0 4px 10px rgba(0,143,161,.22)}.btn-cyan-outline{background:#fff;border:1px solid #00a9bd;color:#00a9bd}.btn-cyan-outline:hover{background:#e0f7fa;color:#006f7f}.grid-content{padding:8px}.table-scroll{overflow:auto;min-height:350px;border:1px solid #cfcfcf}.fm-grid{width:max-content;min-width:100%;border-collapse:collapse}.fm-grid th,.fm-grid td{border-right:1px solid #c4c4c4;border-bottom:1px solid #c4c4c4;padding:8px;white-space:nowrap;text-align:left}.fm-grid th{background:#f7f7f7;font-weight:600}.filter-row th{background:#fff}.filter-row input{width:calc(100% - 35px);height:28px;border:1px solid #c5c5c5;border-radius:4px;padding:4px}.filter-prefix{margin-right:4px}.filter-row button{border:0;background:transparent;font-weight:700;cursor:pointer}.empty-row{text-align:right;color:#111;height:260px}.grid-footer{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border:1px solid #d1d1d1;border-top:0;padding:6px 10px}.footer-icons{display:flex;gap:8px}.footer-icons button,.pager button{border:0;background:transparent;cursor:pointer}.footer-icons .material-icons{font-size:18px}.pager{display:flex;align-items:center;gap:8px}.pager input{width:42px;height:26px;border:1px solid #c5c5c5;border-radius:4px;text-align:center}.pager select{height:28px}.showing{text-align:right}@media(max-width:1000px){.top-row,.bottom-row{grid-template-columns:repeat(2,minmax(180px,1fr))}}@media(max-width:600px){.top-row,.bottom-row{grid-template-columns:1fr}.grid-footer{grid-template-columns:1fr;gap:8px}.showing{text-align:left}.multi-panel{position:fixed;left:12px;right:12px;top:120px;width:auto}}
</style>