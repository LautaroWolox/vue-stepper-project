<template>
  <div class="ext-backdrop" @mousedown.self="$emit('close')">
    <div class="ext-modal">
      <div class="ext-head">
        <h3>Órdenes de Trabajo Externas</h3>
        <button type="button" @click="$emit('close')">×</button>
      </div>
      <div class="ext-body">
        <div class="ext-scroll">
          <table class="ext-table">
            <thead>
              <tr>
                <th v-for="c in columns" :key="c.field" :style="{ minWidth: c.width + 'px' }">
                  <button type="button" @click="sort(c.field)">
                    <span>{{ c.label }}</span>
                    <span>{{ arrow(c.field) }}</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in pageRows" :key="r.id" :class="{ selected: selected?.id === r.id }" @click="selected = selected?.id === r.id ? null : r">
                <td v-for="c in columns" :key="c.field" :style="{ minWidth: c.width + 'px' }">{{ r[c.field] }}</td>
              </tr>
              <tr v-if="pageRows.length === 0">
                <td :colspan="columns.length" class="empty"><div></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ext-foot">
          <button class="icon" type="button" title="Exportar Excel" :disabled="rows.length === 0" @click="exportExcel"><span class="material-icons">file_download</span></button>
          <div class="pager">
            <button type="button" :disabled="page === 1" @click="page = 1">|&lt;</button>
            <button type="button" :disabled="page === 1" @click="page--">&lt;</button>
            <span>Página <input v-model.number="page" type="number" min="1" :max="totalPages" @change="normalizePage"> de {{ totalPages }}</span>
            <button type="button" :disabled="page >= totalPages" @click="page++">&gt;</button>
            <button type="button" :disabled="page >= totalPages" @click="page = totalPages">&gt;|</button>
          </div>
          <div class="count">
            <template v-if="rows.length > 0">Mostrando {{ ((page - 1) * perPage) + 1 }} - {{ Math.min(page * perPage, rows.length) }} de {{ rows.length }}</template>
            <template v-else>No hay resultados</template>
          </div>
        </div>
      </div>
      <div class="ext-actions"><button type="button" @click="$emit('close')">CERRAR</button></div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { downloadExcel } from '../../utils/excelExport.js'

const props = defineProps({ rows: { type: Array, default: () => [] } })
defineEmits(['close'])

const columns = [
  { field: 'nroOt', label: 'Nro de OT', width: 88 },
  { field: 'nroOtSfs', label: 'Nro OT SFS', width: 96 },
  { field: 'statusOtWfx', label: 'Status OT WFX', width: 116 },
  { field: 'fechaUltimaModificacionOt', label: 'Fecha Última Modificación de OT', width: 220 },
  { field: 'nroTech', label: 'Nro Tech', width: 116 },
  { field: 'nombreTech', label: 'Nombre del Tech', width: 160 },
  { field: 'codigoSolucion', label: 'Código de Solución', width: 190 },
  { field: 'ubicacionOt', label: 'Ubicación de la OT', width: 150 }
]

const page = ref(1)
const perPage = ref(100)
const selected = ref(null)
const order = reactive({ field: '', direction: '' })

const sortedRows = computed(() => {
  const list = [...props.rows]
  if (!order.field || !order.direction) return list
  return list.sort((a, b) => {
    const result = String(a[order.field] ?? '').localeCompare(String(b[order.field] ?? ''), 'es', { numeric: true, sensitivity: 'base' })
    return order.direction === 'asc' ? result : -result
  })
})

const totalPages = computed(() => Math.ceil(sortedRows.value.length / perPage.value) || 1)
const pageRows = computed(() => sortedRows.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

const normalizePage = () => {
  if (!page.value || page.value < 1) page.value = 1
  if (page.value > totalPages.value) page.value = totalPages.value
}

const sort = (field) => {
  if (order.field !== field) {
    order.field = field
    order.direction = 'asc'
  } else if (order.direction === 'asc') {
    order.direction = 'desc'
  } else {
    order.field = ''
    order.direction = ''
  }
  page.value = 1
}

const arrow = (field) => order.field === field ? (order.direction === 'asc' ? '▲' : '▼') : '↕'

const exportExcel = () => {
  if (!props.rows.length) return
  downloadExcel({ filename: 'Ordenes_Trabajo_Externas.xls', title: 'Órdenes de Trabajo Externas', columns, rows: props.rows })
}
</script>

<style scoped>
.ext-backdrop{position:fixed;inset:0;z-index:2500;background:rgba(38,50,56,.28);display:flex;align-items:center;justify-content:center;padding:18px}.ext-modal{width:min(810px,calc(100vw - 24px));height:min(740px,calc(100vh - 24px));background:#fff;border:1px solid #cfd8dc;border-radius:4px;box-shadow:0 18px 42px rgba(38,50,56,.28);display:flex;flex-direction:column;overflow:hidden}.ext-head{height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-bottom:1px solid #e0e0e0}.ext-head h3{font-size:16px;font-weight:400;margin:0;color:#424242}.ext-head button{border:0;background:transparent;font-size:24px;color:#b0bec5;cursor:pointer}.ext-body{flex:1;min-height:0;display:flex;flex-direction:column;padding:14px 14px 0}.ext-scroll{flex:1;min-height:0;overflow:auto;border:1px solid #d8d8d8;border-bottom:0}.ext-table{width:max-content;min-width:100%;table-layout:auto;border-collapse:collapse;font-size:12px;color:#263238}.ext-table th,.ext-table td{border-right:1px solid #c9d3da;border-bottom:1px solid #dce3e8;padding:7px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ext-table th{position:sticky;top:0;background:#f4f7f9;font-size:11px;color:#424242;height:36px;resize:horizontal}.ext-table th button{width:100%;height:100%;border:0;background:transparent;display:flex;justify-content:space-between;align-items:center;font:inherit;cursor:pointer}.selected td{background:#9eeff7!important}.ext-table tbody tr:hover td{background:#edfafd}.empty{padding:0!important}.empty div{height:510px}.ext-foot{height:38px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px;border:1px solid #d8d8d8;border-top:0;font-size:12px}.icon{width:24px;height:24px;border:0;background:transparent;cursor:pointer}.icon:disabled{color:#cfd8dc;cursor:not-allowed}.icon .material-icons{font-size:17px}.pager{display:flex;align-items:center;gap:6px}.pager button{border:0;background:transparent;cursor:pointer}.pager button:disabled{opacity:.35;cursor:not-allowed}.pager input{width:42px;height:24px;text-align:center;border:1px solid #c7d1d8;border-radius:4px}.count{justify-self:end}.ext-actions{height:64px;border-top:1px solid #e0e0e0;display:flex;align-items:center;justify-content:flex-end;padding:12px 14px}.ext-actions button{min-width:72px;min-height:28px;border:1px solid #00a9bd;border-radius:16px;background:#fff;color:#008fa1;font-size:12px;font-weight:400;cursor:pointer}.ext-actions button:hover{background:#e0f7fa;box-shadow:0 4px 10px rgba(0,143,161,.14)}@media(max-width:900px){.ext-modal{width:calc(100vw - 18px);height:calc(100vh - 18px)}.ext-foot{grid-template-columns:1fr;justify-items:center}.count{justify-self:center}}
</style>
