<template>
  <div class="local-notas-table">
    <div class="table-scroll" :class="{ expanded: data.length }">
      <table>
        <thead>
          <tr>
            <th class="check"><input type="checkbox" :checked="allSelected" :disabled="!pageRows.length" @change="toggleAll" /></th>
            <th v-for="col in columns" :key="col.field" :style="styleCol(col)"><button class="head" @click="sortBy(col.field)">{{ col.label }} <span>▲▼</span></button></th>
          </tr>
          <tr class="filters"><th></th><th v-for="col in columns" :key="`f-${col.field}`" :style="styleCol(col)">~ <input v-model="filters[col.field]" @input="page = 1" /><button @click="filters[col.field] = ''">x</button></th></tr>
        </thead>
        <tbody>
          <tr v-if="!pageRows.length" class="empty"><td :colspan="columns.length + 1">No hay resultados</td></tr>
          <tr v-for="row in pageRows" :key="row.id" :class="{ selected: selected.has(row.id) }" @click="toggleRow(row)">
            <td class="check"><input type="checkbox" :checked="selected.has(row.id)" @change.stop="toggleRow(row)" /></td>
            <td v-for="col in columns" :key="`${row.id}-${col.field}`" :style="styleCol(col)" :title="row[col.field]">
              <button v-if="col.field === 'nro_nota'" class="link" @click.stop="$emit('open-nota', row)">{{ row[col.field] }}</button>
              <span v-else-if="col.field === 'estado'" class="badge" :class="estadoClase(row[col.field])">{{ row[col.field] }}</span>
              <strong v-else-if="col.field === 'acta'" class="acta">{{ row[col.field] }}</strong>
              <span v-else>{{ row[col.field] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <button class="icon" :disabled="!data.length" @click="exportar">⇩</button>
      <div class="pager"><button :disabled="page === 1" @click="page = 1">|&lt;</button><button :disabled="page === 1" @click="page--">&lt;</button><span>Pagina</span><input v-model.number="page" min="1" :max="pages" type="number" @change="fixPage" /><span>de {{ pages }}</span><button :disabled="page >= pages" @click="page++">&gt;</button><button :disabled="page >= pages" @click="page = pages">&gt;|</button><select v-model.number="perPage" @change="page = 1"><option :value="10">10</option><option :value="50">50</option><option :value="100">100</option></select></div>
      <span class="count">Mostrando {{ from }} - {{ to }} de {{ filtered.length }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { downloadExcel } from '../../../utils/excelExport.js'
const props = defineProps({ data: { type: Array, default: () => [] }, fileName: { type: String, default: 'notas_debito.xls' } })
defineEmits(['open-nota'])
const columns = reactive([{ field: 'nro_nota', label: 'NRO_NOTA', width: 130 }, { field: 'acta', label: 'NUMERO DE ACTA', width: 140 }, { field: 'estado', label: 'ESTADO_NOTA', width: 125 }, { field: 'periodo', label: 'PERIODO', width: 150 }, { field: 'anio', label: 'AÑO', width: 90 }, { field: 'f_crea', label: 'FECHA_CREACION', width: 155 }, { field: 'f_cierre', label: 'FECHA_CIERRE_NC', width: 155 }, { field: 'contra', label: 'CONTRATISTA', width: 170 }, { field: 'pais', label: 'PAIS', width: 120 }, { field: 'prov', label: 'PROVINCIA', width: 140 }, { field: 'reg', label: 'REGION', width: 125 }, { field: 'tipo', label: 'TIPO_CONTRATO', width: 140 }, { field: 'soc', label: 'SOCIEDAD', width: 160 }, { field: 'usu', label: 'USUARIO_CIERRE', width: 140 }, { field: 'val', label: 'VALORACION_ACTA', width: 140 }])
const filters = reactive(Object.fromEntries(columns.map(c => [c.field, ''])))
const page = ref(1)
const perPage = ref(10)
const selectedIds = ref([])
const order = reactive({ field: '', dir: 'asc' })
const selected = computed(() => new Set(selectedIds.value))
const norm = v => String(v || '').toLowerCase()
const filtered = computed(() => props.data.filter(r => columns.every(c => !norm(filters[c.field]) || norm(r[c.field]).includes(norm(filters[c.field])))))
const sorted = computed(() => { const rows = [...filtered.value]; if (!order.field) return rows; return rows.sort((a, b) => String(a[order.field] ?? '').localeCompare(String(b[order.field] ?? ''), 'es', { numeric: true }) * (order.dir === 'desc' ? -1 : 1)) })
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage.value)))
const pageRows = computed(() => sorted.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))
const from = computed(() => filtered.value.length ? ((page.value - 1) * perPage.value) + 1 : 0)
const to = computed(() => Math.min(page.value * perPage.value, filtered.value.length))
const allSelected = computed(() => pageRows.value.length && pageRows.value.every(r => selected.value.has(r.id)))
const styleCol = c => ({ width: `${c.width}px`, minWidth: `${c.width}px`, maxWidth: `${c.width}px` })
const sortBy = f => { order.dir = order.field === f && order.dir === 'asc' ? 'desc' : 'asc'; order.field = f; page.value = 1 }
const toggleRow = r => { const i = selectedIds.value.indexOf(r.id); i >= 0 ? selectedIds.value.splice(i, 1) : selectedIds.value.push(r.id) }
const toggleAll = e => pageRows.value.forEach(r => { const i = selectedIds.value.indexOf(r.id); if (e.target.checked && i < 0) selectedIds.value.push(r.id); if (!e.target.checked && i >= 0) selectedIds.value.splice(i, 1) })
const estadoClase = v => norm(v).includes('cerrado') ? 'cerrado' : 'curso'
const fixPage = () => { if (page.value < 1) page.value = 1; if (page.value > pages.value) page.value = pages.value }
const exportar = () => downloadExcel({ filename: props.fileName, title: 'Consulta Notas', columns, rows: props.data, mode: 'allColumns' })
</script>

<style scoped>
.local-notas-table{border-left:4px solid #00bcd4;background:#fff}.table-scroll{overflow:auto;border:1px solid #d1d1d1;min-height:190px;max-height:62vh}.table-scroll.expanded{min-height:430px}table{border-collapse:collapse;table-layout:fixed;width:max-content;min-width:100%;font-size:12px}th,td{border-right:1px solid #c9d3da;border-bottom:1px solid #dce3e8;padding:7px 8px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#fff}thead th{position:sticky;background:#f4f7f9;color:#2c4050;font-size:11px;font-weight:600;z-index:5}.filters th{top:36px;background:#fff}.filters input{width:calc(100% - 32px);height:24px;border:1px solid #c7d1d8;border-radius:3px}.filters button{border:0;background:transparent;font-weight:700}.check{width:38px!important;text-align:center!important;padding:0!important}.check input{width:14px;height:14px;accent-color:#00a9bd}.head{width:100%;border:0;background:transparent;color:inherit;font:inherit;display:flex;justify-content:space-between;cursor:pointer}.head span{font-size:8px;color:#aab8c0}tbody tr{cursor:pointer}tbody tr:hover td{background:#edfafd}tbody tr.selected td{background:#9eeff7;color:#003f47}.empty td{height:118px;text-align:center;color:#607d8b}.link{border:0;background:transparent;color:#00a9bd;font-weight:700;cursor:pointer}.acta{color:#00a9bd}.badge{display:inline-flex;min-width:82px;justify-content:center;border-radius:12px;padding:3px 9px;font-size:11px;font-weight:700}.badge.curso{color:#01579b;background:#e1f5fe;border:1px solid #81d4fa}.badge.cerrado{color:#1b5e20;background:#e8f5e9;border:1px solid #a5d6a7}.footer{min-height:38px;border:1px solid #d1d1d1;border-top:0;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:6px 10px;background:#fff;font-size:12px}.icon,.pager button{border:0;background:transparent;cursor:pointer}.icon:hover,.pager button:hover:not(:disabled){color:#00a9bd}.pager{display:flex;align-items:center;gap:8px}.pager input{width:40px;height:24px;text-align:center;border:1px solid #cfd8dc;border-radius:3px}.pager select{height:28px;border:1px solid #cfd8dc;border-radius:3px;background:#fff}.count{justify-self:end;white-space:nowrap}
</style>
