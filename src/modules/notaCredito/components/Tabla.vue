<template>
  <div class="local-notas-table">
    <div class="table-scroll" :class="{ expanded: data.length }">
      <table>
        <colgroup><col class="check-col" /><col v-for="col in columns" :key="col.field" :style="colStyle(col)" /></colgroup>
        <thead>
          <tr>
            <th class="check-cell"><input type="checkbox" :checked="allPageSelected" :disabled="!pageRows.length" @change="toggleAllPage" /></th>
            <th v-for="col in columns" :key="col.field" :style="colStyle(col)">
              <button class="head-btn" type="button" @click="sort(col.field)"><span>{{ col.label }}</span><span class="arrows">▲▼</span></button>
              <i class="resize" @mousedown.prevent="startResize($event, col)"></i>
            </th>
          </tr>
          <tr class="filter-row">
            <th class="check-cell"></th>
            <th v-for="col in columns" :key="`f-${col.field}`" :style="colStyle(col)"><span>~</span><input v-model="filters[col.field]" @input="page = 1" /><button @click="filters[col.field] = ''">x</button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!pageRows.length" class="empty-row"><td :colspan="columns.length + 1">No hay resultados</td></tr>
          <tr v-for="row in pageRows" :key="row.id" :class="{ selected: selected.has(row.id) }" @click="toggleRow(row)">
            <td class="check-cell" @click.stop><input type="checkbox" :checked="selected.has(row.id)" @change="toggleRow(row)" /></td>
            <td v-for="col in columns" :key="`${row.id}-${col.field}`" :style="colStyle(col)" :title="row[col.field]">
              <button v-if="col.field === 'nro_nota'" class="link-btn" @click.stop="$emit('open-nota', row)">{{ row[col.field] }}</button>
              <span v-else-if="col.field === 'estado'" class="badge" :class="badgeClass(row[col.field])">{{ row[col.field] }}</span>
              <strong v-else-if="col.field === 'acta'" class="acta-link">{{ row[col.field] }}</strong>
              <span v-else>{{ row[col.field] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-footer">
      <button class="icon-btn" :disabled="!data.length" @click="exportExcel" title="Exportar Excel">⇩</button>
      <div class="pager"><button :disabled="page === 1" @click="page = 1">|&lt;</button><button :disabled="page === 1" @click="page--">&lt;</button><span>Pagina</span><input v-model.number="page" type="number" min="1" :max="totalPages" @change="fixPage" /><span>de {{ totalPages }}</span><button :disabled="page >= totalPages" @click="page++">&gt;</button><button :disabled="page >= totalPages" @click="page = totalPages">&gt;|</button><select v-model.number="perPage" @change="page = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option><option :value="500">500</option></select></div>
      <span class="count">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredRows.length }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { downloadExcel } from '../../../utils/excelExport.js'

const props = defineProps({ data: { type: Array, default: () => [] }, fileName: { type: String, default: 'Consulta_Notas.xls' } })
defineEmits(['open-nota'])

const columns = reactive([
  { field: 'nro_nota', label: 'NRO_NOTA', width: 130 }, { field: 'acta', label: 'NUMERO DE ACTA', width: 140 }, { field: 'estado', label: 'ESTADO_NOTA', width: 125 },
  { field: 'periodo', label: 'PERIODO', width: 150 }, { field: 'anio', label: 'AÑO', width: 90 }, { field: 'f_crea', label: 'FECHA_CREACION', width: 155 },
  { field: 'f_cierre', label: 'FECHA_CIERRE_NC', width: 155 }, { field: 'contra', label: 'CONTRATISTA', width: 170 }, { field: 'pais', label: 'PAIS', width: 120 },
  { field: 'prov', label: 'PROVINCIA', width: 140 }, { field: 'reg', label: 'REGION', width: 125 }, { field: 'tipo', label: 'TIPO_CONTRATO', width: 140 },
  { field: 'soc', label: 'SOCIEDAD', width: 160 }, { field: 'usu', label: 'USUARIO_CIERRE', width: 140 }, { field: 'val', label: 'VALORACION_ACTA', width: 140 }
])
const filters = reactive(Object.fromEntries(columns.map(col => [col.field, ''])))
const page = ref(1)
const perPage = ref(10)
const selectedIds = ref([])
const sortState = reactive({ field: '', dir: '' })
const selected = computed(() => new Set(selectedIds.value))
const text = value => String(value || '').toLowerCase()
const filteredRows = computed(() => props.data.filter(row => columns.every(col => !text(filters[col.field]) || text(row[col.field]).includes(text(filters[col.field])))))
const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  if (!sortState.field) return rows
  return rows.sort((a, b) => String(a[sortState.field] ?? '').localeCompare(String(b[sortState.field] ?? ''), 'es', { numeric: true }) * (sortState.dir === 'desc' ? -1 : 1))
})
const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / perPage.value)))
const pageRows = computed(() => sortedRows.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))
const fromRow = computed(() => filteredRows.value.length ? ((page.value - 1) * perPage.value) + 1 : 0)
const toRow = computed(() => Math.min(page.value * perPage.value, filteredRows.value.length))
const allPageSelected = computed(() => pageRows.value.length && pageRows.value.every(row => selected.value.has(row.id)))
const colStyle = col => ({ width: `${col.width}px`, minWidth: `${col.width}px`, maxWidth: `${col.width}px` })
const sort = field => { sortState.dir = sortState.field === field && sortState.dir === 'asc' ? 'desc' : 'asc'; sortState.field = field; page.value = 1 }
const toggleRow = row => { const i = selectedIds.value.indexOf(row.id); i >= 0 ? selectedIds.value.splice(i, 1) : selectedIds.value.push(row.id) }
const toggleAllPage = e => pageRows.value.forEach(row => { const i = selectedIds.value.indexOf(row.id); if (e.target.checked && i < 0) selectedIds.value.push(row.id); if (!e.target.checked && i >= 0) selectedIds.value.splice(i, 1) })
const badgeClass = value => text(value).includes('cerrado') ? 'cerrado' : 'curso'
const fixPage = () => { if (page.value < 1) page.value = 1; if (page.value > totalPages.value) page.value = totalPages.value }
const exportExcel = () => downloadExcel({ filename: props.fileName, title: 'Consulta Notas', columns, rows: props.data, mode: 'allColumns' })
const startResize = (event, col) => { const x = event.clientX; const w = col.width; const move = ev => { col.width = Math.max(60, w + ev.clientX - x) }; const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', move); document.addEventListener('mouseup', up) }
</script>

<style scoped>
.local-notas-table{border-left:4px solid #00bcd4;background:#fff}.table-scroll{overflow:auto;border:1px solid #d1d1d1;min-height:190px;max-height:62vh}.table-scroll.expanded{min-height:430px}table{border-collapse:collapse;table-layout:fixed;width:max-content;min-width:100%;font-size:12px}th,td{border-right:1px solid #c9d3da;border-bottom:1px solid #dce3e8;padding:7px 8px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#fff}thead th{position:sticky;background:#f4f7f9;color:#2c4050;font-size:11px;font-weight:600;z-index:5}.notas-head-row th{top:0;height:36px}.filter-row th{top:36px;background:#fff;height:34px;z-index:4;padding:4px 5px}.filter-row input{width:calc(100% - 32px);height:24px;border:1px solid #c7d1d8;border-radius:3px}.filter-row input:focus{outline:none;border-color:#00bcd4;box-shadow:0 0 0 2px rgba(0,188,212,.14)}.filter-row button{border:0;background:transparent;font-weight:700;cursor:pointer}.check-cell{width:38px!important;min-width:38px!important;max-width:38px!important;text-align:center!important;padding:0!important}.check-cell input{width:14px;height:14px;accent-color:#00a9bd}.head-btn{width:100%;border:0;background:transparent;color:inherit;font:inherit;display:flex;justify-content:space-between;cursor:pointer}.arrows{font-size:8px;color:#aab8c0}.resizable-th{position:relative}.resize{position:absolute;top:0;right:-3px;width:8px;height:100%;cursor:col-resize}tbody tr{cursor:pointer}tbody tr:hover td{background:#edfafd}tbody tr.selected td{background:#9eeff7;color:#003f47}.empty-row td{height:118px;text-align:center;color:#607d8b}.link-btn{border:0;background:transparent;color:#00a9bd;font-weight:700;cursor:pointer}.link-btn:hover{text-decoration:underline}.acta-link{color:#00a9bd}.badge{display:inline-flex;min-width:82px;justify-content:center;border-radius:12px;padding:3px 9px;font-size:11px;font-weight:700}.badge.curso{color:#01579b;background:#e1f5fe;border:1px solid #81d4fa}.badge.cerrado{color:#1b5e20;background:#e8f5e9;border:1px solid #a5d6a7}.table-footer{min-height:38px;border:1px solid #d1d1d1;border-top:0;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:6px 10px;background:#fff;font-size:12px}.icon-btn,.pager button{border:0;background:transparent;cursor:pointer}.icon-btn:hover,.pager button:hover:not(:disabled){color:#00a9bd}.pager{display:flex;align-items:center;gap:8px}.pager input{width:40px;height:24px;text-align:center;border:1px solid #cfd8dc;border-radius:3px}.pager select{height:28px;border:1px solid #cfd8dc;border-radius:3px;background:#fff}.count{justify-self:end;white-space:nowrap}.fm-svg-icon{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
</style>
