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
      <div class="grid-action-bar"><span class="material-icons action-icon" title="Descargar Vista">get_app</span><span class="material-icons action-icon" title="Configurar Grilla">build</span><span class="material-icons action-icon" title="Agregar Material" @click="$emit('add-material')">add_box</span></div>
      <div class="pagination" style="padding: 0; border: none; background: transparent;">
        <div style="margin-right: 15px;">Seleccionados: <strong>{{ localSelected.length }}</strong></div>
        <div style="display:flex; gap:10px; align-items:center;"><button class="btn" style="padding: 4px 8px;" @click="currentPage--" :disabled="currentPage === 1"><span class="material-icons">chevron_left</span></button><span>Pág {{ currentPage }} de {{ totalPages || 1 }}</span><button class="btn" style="padding: 4px 8px;" @click="currentPage++" :disabled="currentPage >= totalPages || totalPages === 0"><span class="material-icons">chevron_right</span></button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
const props = defineProps(['data', 'columns', 'modelValue']); const emit = defineEmits(['update:modelValue', 'update:visibleCols', 'edit-ot', 'add-material'])
const cols = reactive([...props.columns]); const filters = reactive({}); const showColumnConfig = ref(false)
const localSelected = ref([...props.modelValue]); const currentPage = ref(1); const itemsPerPage = 8
cols.forEach(c => filters[c.field] = '')
const visibleCols = computed(() => cols.filter(c => c.visible))
watch(visibleCols, (newVal) => { emit('update:visibleCols', newVal) }, { deep: true, immediate: true })
const filteredData = computed(() => { return props.data.filter(row => { return visibleCols.value.every(col => { const filterVal = filters[col.field].toLowerCase(); if (!filterVal) return true; return String(row[col.field]).toLowerCase().includes(filterVal) }) }) })
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedData = computed(() => { return filteredData.value.slice((currentPage.value - 1) * itemsPerPage, (currentPage.value - 1) * itemsPerPage + itemsPerPage) })
const isAllPageSelected = computed(() => { if (paginatedData.value.length === 0) return false; return paginatedData.value.every(item => localSelected.value.some(sel => sel.id === item.id)) })
const toggleSelectAllPage = (e) => { const checked = e.target.checked; paginatedData.value.forEach(item => { const exists = localSelected.value.findIndex(sel => sel.id === item.id); if (checked && exists === -1) localSelected.value.push(item); else if (!checked && exists !== -1) localSelected.value.splice(exists, 1) }); emitSelection() }
const emitSelection = () => emit('update:modelValue', localSelected.value)
watch(() => props.modelValue, (newVal) => { localSelected.value = [...newVal] }, { deep: true })
</script>