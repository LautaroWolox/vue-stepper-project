<template>
  <div>
    <div class="column-selector">
      <button class="btn" @click="showColumnConfig = !showColumnConfig">
        <span class="material-icons btn-icon">view_column</span> Seleccionar Columnas
      </button>
      <div class="column-dropdown" v-if="showColumnConfig">
        <label v-for="col in cols" :key="col.field">
          <input type="checkbox" v-model="col.visible"> {{ col.label }}
        </label>
      </div>
    </div>

    <div class="table-responsive">
      <table class="advanced-grid">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">
              <input type="checkbox" @change="toggleSelectAllPage" :checked="isAllPageSelected" title="Seleccionar página actual">
            </th>
            <th v-for="col in visibleCols" :key="col.field">{{ col.label }}</th>
          </tr>
          <tr class="filter-row">
            <th></th>
            <th v-for="col in visibleCols" :key="'filter-'+col.field">
              <input type="text" class="col-filter-input" v-model="filters[col.field]" placeholder="Filtrar..." @input="currentPage = 1">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td style="text-align: center;">
              <input type="checkbox" :value="row" v-model="localSelected" @change="emitSelection">
            </td>
            <td v-for="col in visibleCols" :key="col.field">{{ row[col.field] }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="visibleCols.length + 1" style="text-align: center; padding: 20px;">No hay resultados con estos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" style="margin-top: 15px;">
      <div>Seleccionados en total: <strong>{{ localSelected.length }}</strong></div>
      <div style="display:flex; gap:10px; align-items:center;">
        <button class="btn" @click="currentPage--" :disabled="currentPage === 1"><span class="material-icons">chevron_left</span></button>
        <span>Página {{ currentPage }} de {{ totalPages || 1 }}</span>
        <button class="btn" @click="currentPage++" :disabled="currentPage >= totalPages || totalPages === 0"><span class="material-icons">chevron_right</span></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'

const props = defineProps(['data', 'columns', 'modelValue'])
const emit = defineEmits(['update:modelValue', 'update:visibleCols'])

const cols = reactive([...props.columns])
const filters = reactive({})
const showColumnConfig = ref(false)

const localSelected = ref([...props.modelValue])
const currentPage = ref(1)
const itemsPerPage = 8

cols.forEach(c => filters[c.field] = '')
const visibleCols = computed(() => cols.filter(c => c.visible))

watch(visibleCols, (newVal) => { emit('update:visibleCols', newVal) }, { deep: true, immediate: true })

const filteredData = computed(() => {
  return props.data.filter(row => {
    return visibleCols.value.every(col => {
      const filterVal = filters[col.field].toLowerCase()
      if (!filterVal) return true
      return String(row[col.field]).toLowerCase().includes(filterVal)
    })
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredData.value.slice(start, start + itemsPerPage)
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
watch(() => props.modelValue, (newVal) => { localSelected.value = [...newVal] }, { deep: true })
</script>