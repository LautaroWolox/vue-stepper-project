<template>
  <div>
    <div class="column-selector">
      <button class="btn" @click="showColumnConfig = !showColumnConfig"><span class="material-icons btn-icon">view_column</span> Configurar Columnas</button>
      <div class="column-dropdown" v-if="showColumnConfig"><label v-for="col in cols" :key="col.field"><input type="checkbox" v-model="col.visible"> {{ col.label }}</label></div>
    </div>
    <div class="table-responsive">
      <table class="advanced-grid">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center; vertical-align: middle;"><input type="checkbox" @change="toggleSelectAllPage" :checked="isAllPageSelected"></th>
            <th style="width: 80px; text-align: center;">ACCIÓN</th>
            <th v-for="col in visibleCols" :key="col.field"><div class="resizable-header">{{ col.label }}</div></th>
          </tr>
          <tr class="filter-row">
            <th></th><th></th>
            <th v-for="col in visibleCols" :key="'filter-'+col.field"><input type="text" class="col-filter-input" v-model="filters[col.field]" placeholder="Filtrar..." @input="currentPage = 1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td style="text-align: center;"><input type="checkbox" :value="row" v-model="localSelected" @change="emitSelection"></td>
            <td style="text-align: center;"><button class="btn btn-danger" style="padding: 4px 8px;" @click="$emit('edit-ot', $event, row)" title="Ver Detalle OT"><span class="material-icons" style="font-size: 16px;">edit</span></button></td>
            <td v-for="col in visibleCols" :key="col.field">{{ row[col.field] }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0"><td :colspan="visibleCols.length + 2" style="text-align: center; padding: 20px;">No hay resultados con estos filtros.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="grid-footer">
      <div class="grid-action-bar">
        <button class="icon-btn" title="Descargar Vista" @click="exportVisibleCsv" :disabled="filteredData.length === 0"><span class="material-icons action-icon">get_app</span></button>
        <button class="icon-btn" title="Configurar Grilla" @click="showColumnConfig = !showColumnConfig"><span class="material-icons action-icon">build</span></button>
        <button class="icon-btn" title="Agregar Material" @click="$emit('add-material')"><span class="material-icons action-icon">add_box</span></button>
      </div>
      <div class="pagination" style="padding: 0; border: none; background: transparent;">
        <div style="margin-right: 15px;">Seleccionados: <strong>{{ localSelected.length }}</strong></div>
        <div style="display:flex; gap:10px; align-items:center;"><button class="btn" style="padding: 4px 8px;" @click="currentPage--" :disabled="currentPage === 1"><span class="material-icons">chevron_left</span></button><span>Pág {{ currentPage }} de {{ totalPages || 1 }}</span><button class="btn" style="padding: 4px 8px;" @click="currentPage++" :disabled="currentPage >= totalPages || totalPages === 0"><span class="material-icons">chevron_right</span></button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const props = defineProps(['data', 'columns', 'modelValue'])
const emit = defineEmits(['update:modelValue', 'update:visibleCols', 'edit-ot', 'add-material'])

const cols = reactive(props.columns.map((column) => ({ ...column })))
const filters = reactive({})
const showColumnConfig = ref(false)
const localSelected = ref([...props.modelValue])
const currentPage = ref(1)
const itemsPerPage = 8

const resetFilters = () => {
  Object.keys(filters).forEach((key) => { filters[key] = '' })
  cols.forEach(c => { filters[c.field] = filters[c.field] || '' })
}

resetFilters()

const visibleCols = computed(() => cols.filter(c => c.visible))

watch(visibleCols, (newVal) => { emit('update:visibleCols', newVal) }, { deep: true, immediate: true })

const filteredData = computed(() => {
  return props.data.filter(row => {
    return visibleCols.value.every(col => {
      const filterVal = String(filters[col.field] || '').toLowerCase()
      if (!filterVal) return true
      return String(row[col.field] || '').toLowerCase().includes(filterVal)
    })
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedData = computed(() => {
  return filteredData.value.slice((currentPage.value - 1) * itemsPerPage, (currentPage.value - 1) * itemsPerPage + itemsPerPage)
})

const isAllPageSelected = computed(() => {
  if (paginatedData.value.length === 0) return false
  return paginatedData.value.every(item => localSelected.value.some(sel => sel.id === item.id))
})

const toggleSelectAllPage = (e) => {
  const checked = e.target.checked
  paginatedData.value.forEach(item => {
    const exists = localSelected.value.findIndex(sel => sel.id === item.id)
    if (checked && exists === -1) localSelected.value.push(item)
    else if (!checked && exists !== -1) localSelected.value.splice(exists, 1)
  })
  emitSelection()
}

const emitSelection = () => emit('update:modelValue', localSelected.value)

const exportVisibleCsv = () => {
  if (!filteredData.value.length || !visibleCols.value.length) return

  const headers = visibleCols.value.map((column) => column.label)
  const rows = filteredData.value.map((row) => visibleCols.value.map((column) => row[column.field]))
  downloadCsv('materiales_vista.csv', buildCsv(headers, rows))
}

watch(() => props.modelValue, (newVal) => { localSelected.value = [...newVal] }, { deep: true })
watch(() => props.columns, (newColumns) => {
  cols.splice(0, cols.length, ...newColumns.map((column) => ({ ...column })))
  resetFilters()
  currentPage.value = 1
}, { deep: true })
watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages || 1
})
</script>
