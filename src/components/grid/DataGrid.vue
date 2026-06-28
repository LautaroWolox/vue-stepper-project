<template>
  <div>
    <div class="fullscreen-controls">
      <button v-if="columns.length >= 10" class="btn" @click="toggleFullscreen">
        <span class="material-icons btn-icon">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
        {{ isFullscreen ? 'Salir Pantalla Completa' : 'Expandir Pantalla Completa' }}
      </button>
    </div>

    <div :class="['grid-container', { fullscreen: isFullscreen }]">
      <div v-if="isFullscreen" style="margin-bottom: 20px; text-align: right;">
        <button class="btn btn-danger" @click="toggleFullscreen">
          <span class="material-icons btn-icon">close</span> Cerrar Vista
        </button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">
              <input type="checkbox" @change="toggleSelectAllPage" :checked="isAllPageSelected" title="Seleccionar página actual" />
            </th>
            <th v-for="col in columns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id" :class="{ disabled: row.disabled }">
            <td style="text-align: center;">
              <input type="checkbox" :value="row" v-model="localSelected" :disabled="row.disabled" @change="emitSelection" />
            </td>
            <td v-for="col in columns" :key="col">
              <span v-if="row.disabled && col === columns[0]" class="material-icons" style="font-size:14px; color:#b0bec5; margin-right:5px;">block</span>
              {{ row[col] }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <div>
          Seleccionados en total: <strong>{{ localSelected.length }}</strong>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="btn" @click="prevPage" :disabled="currentPage === 1">
            <span class="material-icons btn-icon">chevron_left</span> Anterior
          </button>
          <span style="font-weight:500;">Página {{ currentPage }} de {{ totalPages }}</span>
          <button class="btn" @click="nextPage" :disabled="currentPage === totalPages">
            Siguiente <span class="material-icons btn-icon">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
    
    <FullScreenLoader :show="isLoadingFullscreen" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FullScreenLoader from '../loading/FullScreenLoader.vue'

const props = defineProps({
  data: Array,
  columns: Array,
  modelValue: Array
})
const emit = defineEmits(['update:modelValue'])

const localSelected = ref([...props.modelValue])
const itemsPerPage = 8
const currentPage = ref(1)
const isFullscreen = ref(false)
const isLoadingFullscreen = ref(false)

const totalPages = computed(() => Math.ceil(props.data.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.data.slice(start, start + itemsPerPage)
})

const validPageItems = computed(() => paginatedData.value.filter(i => !i.disabled))
const isAllPageSelected = computed(() => {
  if (validPageItems.value.length === 0) return false
  return validPageItems.value.every(item => localSelected.value.some(sel => sel.id === item.id))
})

const toggleSelectAllPage = (e) => {
  const checked = e.target.checked
  validPageItems.value.forEach(item => {
    const exists = localSelected.value.findIndex(sel => sel.id === item.id)
    if (checked && exists === -1) {
      localSelected.value.push(item)
    } else if (!checked && exists !== -1) {
      localSelected.value.splice(exists, 1)
    }
  })
  emitSelection()
}

const emitSelection = () => emit('update:modelValue', localSelected.value)

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    isLoadingFullscreen.value = true
    setTimeout(() => {
      isLoadingFullscreen.value = false
      isFullscreen.value = true
    }, 2000) 
  } else {
    isFullscreen.value = false
  }
}

watch(() => props.modelValue, (newVal) => { localSelected.value = [...newVal] }, { deep: true })
</script>