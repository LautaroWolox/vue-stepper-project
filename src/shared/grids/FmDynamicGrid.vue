<template>
  <div class="fm-dynamic-grid">
    <div class="fm-grid-scroll">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.field" :style="columnStyle(column)">
              <div class="th-content">
                <span>{{ column.label }}</span>
                <span class="sort-icon">↕</span>
                <span class="resize-handle" @mousedown.prevent="startResize(column, $event)"></span>
              </div>
            </th>
          </tr>
          <tr v-if="filterable" class="filter-row">
            <th v-for="column in columns" :key="`filter-${column.field}`" :style="columnStyle(column)">
              <span>~</span>
              <input v-model="filters[column.field]" />
              <button type="button" @click="filters[column.field] = ''">x</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in visibleRows" :key="row[idField] || rowIndex">
            <td v-for="column in columns" :key="`${rowIndex}-${column.field}`" :style="columnStyle(column)">{{ row[column.field] }}</td>
          </tr>
          <tr v-if="visibleRows.length === 0" class="empty-row-wrap">
            <td class="empty-row" :colspan="columns.length">No hay resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useColumnResize } from '../composables/useColumnResize.js'

const props = defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  filterable: { type: Boolean, default: true },
  idField: { type: String, default: 'id' }
})

const filters = reactive({})
const { startResize } = useColumnResize()

const normalize = value => String(value || '').toLowerCase()
const visibleRows = computed(() => props.rows.filter(row => props.columns.every(column => !normalize(filters[column.field]) || normalize(row[column.field]).includes(normalize(filters[column.field])))))
const columnStyle = column => ({ width: `${column.width || 180}px`, minWidth: `${column.width || 180}px`, maxWidth: `${column.width || 180}px` })
</script>

<style scoped>
.fm-dynamic-grid{width:100%;border-left:4px solid #00bcd4;background:#fff}.fm-grid-scroll{overflow:auto;border:1px solid #cfcfcf}.fm-dynamic-grid table{width:max-content;min-width:100%;border-collapse:collapse;table-layout:fixed}.fm-dynamic-grid th,.fm-dynamic-grid td{border-right:1px solid #b7c7cf;border-bottom:1px solid #b7c7cf;padding:8px;white-space:nowrap;text-align:left;overflow:hidden;text-overflow:ellipsis}.fm-dynamic-grid th{background:#f7f7f7;color:#263f4d}.th-content{position:relative;display:flex;align-items:center;justify-content:space-between;gap:6px;padding-right:8px}.sort-icon{font-size:12px;color:#90a4ae}.resize-handle{position:absolute;right:-8px;top:-8px;width:10px;height:36px;cursor:col-resize}.resize-handle:hover{border-right:2px solid #00a9bd}.filter-row th{background:#fff}.filter-row input{width:calc(100% - 35px);height:28px;border:1px solid #c5c5c5;border-radius:4px;padding:4px}.filter-row button{border:0;background:transparent;font-weight:700;cursor:pointer}.empty-row-wrap{height:240px}.empty-row{text-align:right!important;vertical-align:bottom;padding:0 14px 18px 0!important;color:#111}
</style>
