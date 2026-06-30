<template>
  <div v-if="show" class="floating-popup historial-activities-popup" :style="{ top: pos.y + 'px', left: pos.x + 'px' }">
    <div class="popup-header historial-header">
      <div class="popup-title">Detalle Actividades - OT: {{ titleOt }}</div>
      <div class="popup-controls"><span class="material-icons" @click="$emit('close')">close</span></div>
    </div>
    <div class="popup-body historial-body">
      <div class="historial-table-wrap">
        <table class="historial-table">
          <thead><tr><th v-for="column in columns" :key="column.field"><button type="button" class="historial-sort" @click="toggleSort(column.field)"><span>{{ column.label }}</span><span class="sort-arrows"><span :class="{ on: sortField === column.field && sortDirection === 'asc' }">▲</span><span :class="{ on: sortField === column.field && sortDirection === 'desc' }">▼</span></span></button></th></tr></thead>
          <tbody><tr v-for="(item, index) in sortedRows" :key="index"><td>{{ item.codigo }}</td><td>{{ item.desc }}</td><td>{{ item.cant }}</td><td>{{ item.ncnd || '-' }}</td><td>{{ item.est_ncnd || '-' }}</td><td>{{ item.est_act === 'S' ? 'S' : 'N' }}</td></tr><tr v-if="sortedRows.length === 0"><td :colspan="columns.length" class="empty-row">No hay actividades registradas para esta OT.</td></tr></tbody>
        </table>
      </div>
    </div>
    <div class="popup-actions"><button class="btn" @click="$emit('close')">CERRAR DETALLE</button></div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({ show: Boolean, data: Object })
defineEmits(['close'])
const pos = ref({ x: 20, y: 20 })
const sortField = ref('')
const sortDirection = ref('')
const columns = [{ field: 'codigo', label: 'CÓDIGO' }, { field: 'desc', label: 'ACTIVIDAD' }, { field: 'cant', label: 'CANTIDAD' }, { field: 'ncnd', label: 'NRO NC/ND' }, { field: 'est_ncnd', label: 'ESTADO NC/ND' }, { field: 'est_act', label: 'ESTADO ACTIVIDAD' }]
const titleOt = computed(() => props.data && props.data.ot ? props.data.ot : '')
const rows = computed(() => props.data && Array.isArray(props.data.actividades) ? props.data.actividades : [])
const sortedRows = computed(() => { const values = [...rows.value]; if (!sortField.value || !sortDirection.value) return values; return values.sort((a, b) => { const left = String(a[sortField.value] || ''); const right = String(b[sortField.value] || ''); const result = left.localeCompare(right, 'es', { numeric: true, sensitivity: 'base' }); return sortDirection.value === 'asc' ? result : -result }) })
const toggleSort = field => { if (sortField.value !== field) { sortField.value = field; sortDirection.value = 'asc' } else if (sortDirection.value === 'asc') sortDirection.value = 'desc'; else { sortField.value = ''; sortDirection.value = '' } }
watch(() => props.show, value => { if (!value) return; pos.value = { x: Math.max((window.innerWidth - 850) / 2, 20), y: Math.max((window.innerHeight - 420) / 2, 20) }; sortField.value = ''; sortDirection.value = '' })
</script>

<style scoped>
.historial-activities-popup{width:850px;max-width:95vw;z-index:7200;box-shadow:0 18px 48px rgba(20,34,44,.26),0 6px 16px rgba(20,34,44,.16)}.historial-header{background:#fff;color:#00a9bd;border-bottom:1px solid #eceff1}.popup-title{font-weight:500;font-size:15px}.popup-controls .material-icons{font-size:18px;color:#b0bec5;cursor:pointer}.historial-body{background:#fafafa;padding:20px}.historial-table-wrap{border:1px solid #aebdc7;background:#fff;max-height:350px;overflow:auto}.historial-table{width:max-content;min-width:100%;border-collapse:separate;border-spacing:0}.historial-table th,.historial-table td{border-right:1px solid #aebdc7;border-bottom:1px solid #aebdc7;padding:8px;white-space:nowrap;text-align:left}.historial-table th{position:sticky;top:0;z-index:2;background:linear-gradient(180deg,#f7fafb 0%,#eaf0f3 100%);border-top:1px solid #8fa2ae;border-bottom:1px solid #8fa2ae}.historial-sort{width:100%;border:0;background:transparent;color:#263f4d;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;font:inherit;font-weight:700;cursor:pointer;padding:0}.historial-sort:hover{color:#008fa1}.sort-arrows{display:inline-flex;flex-direction:column;font-size:9px;line-height:8px;color:#aab5bc;min-width:10px}.sort-arrows .on{color:#00a9bd}.empty-row{text-align:center!important;padding:30px!important;color:#90a4ae}.popup-actions{background:#fff;padding:0 20px 20px;display:flex;justify-content:flex-end}.btn{background:#00a9bd;border-radius:20px;padding:8px 30px;font-weight:500}.btn:hover{background:#008fa1}
</style>
