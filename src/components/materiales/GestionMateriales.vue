<template>
  <div>
    <MaterialesFilters :title="title" @search="handleSearch" @reset="resetState" />

    <div v-if="isLoading" class="main-loader-container">
      <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/>
        <rect x="55" y="95" width="10" height="25" fill="#78909C"/>
        <rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/>
        <rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/>
        <rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/>
        <g class="code-lines">
          <rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/>
          <rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/>
          <rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/>
          <rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/>
        </g>
        <rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/>
        <path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/>
        <circle cx="150" cy="50" r="18" fill="#FFB74D"/>
        <path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/>
        <rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/>
        <path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
      </svg>
      <span style="margin-top: 15px;">Buscando materiales...</span>
    </div>

    <div v-if="operationError" style="margin: 15px 0; padding: 12px; border-radius: 6px; background: #ffebee; color: #c62828; border: 1px solid #ffcdd2;">
      {{ operationError }}
    </div>

    <div class="soft-accordion" v-if="hasSearched && !isLoading">
      <div class="soft-accordion-header" @click="openResults = !openResults">
        <span style="text-transform: uppercase;"><span class="material-icons" style="vertical-align: middle;">list_alt</span> GESTIÓN EN LOTE - {{ title }}</span>
        <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
      </div>

      <div class="soft-accordion-content" v-show="openResults">
        <MaterialesStepperHeader :current-step="currentStep" />

        <div v-show="currentStep === 1">
          <AdvancedGrid
            :data="gridData"
            :columns="gridColumns"
            v-model="selectedRows"
            @update:visibleCols="updateVisibleCols"
            @edit-ot="openEditPopup"
            @add-material="triggerRominaError"
          />
          <div style="text-align: right; margin-top: 20px;">
            <button class="btn" @click="currentStep = 2" :disabled="selectedRows.length === 0">
              Siguiente a Revisión <span class="material-icons btn-icon">arrow_forward</span>
            </button>
          </div>
        </div>

        <MaterialesReview
          v-if="currentStep === 2"
          :selected-rows="selectedRows"
          :modified-ots="modifiedOts"
          @back="currentStep = 1"
          @next="currentStep = 3"
          @view-export-detail="openExportDetailPopup"
          @view-mod-detail="openModPopup"
        />

        <MaterialesExport
          v-if="currentStep === 3"
          :selected-rows="selectedRows"
          :current-visible-cols="currentVisibleCols"
          @back="currentStep = 2"
          @export="exportCsv"
        />
      </div>
    </div>

    <FloatingPopup :show="popup.show" :position="popup.pos" :otData="popup.data" @accept="handleSaveOt" @cancel="popup.show = false" />
    <ModifiedPopup :show="modPopup.show" :position="modPopup.pos" :data="modPopup.data" @close="modPopup.show = false" />
    <ExportDetailPopup :show="exportPopup.show" :position="exportPopup.pos" :data="exportPopup.data" @close="exportPopup.show = false" />
    <ErrorModal :show="showError" @close="showError = false" />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import AdvancedGrid from './AdvancedGrid.vue'
import MaterialesFilters from './MaterialesFilters.vue'
import MaterialesStepperHeader from './MaterialesStepperHeader.vue'
import MaterialesReview from './MaterialesReview.vue'
import MaterialesExport from './MaterialesExport.vue'
import FloatingPopup from '../popup/FloatingPopup.vue'
import ModifiedPopup from '../popup/ModifiedPopup.vue'
import ExportDetailPopup from '../popup/ExportDetailPopup.vue'
import ErrorModal from '../modal/ErrorModal.vue'
import { getMaterialesColumns, searchMateriales } from '../../services/materialesService.js'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'OT'
  }
})

const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)
const operationError = ref('')
const currentStep = ref(1)
const selectedRows = ref([])
const currentVisibleCols = ref([])
const modifiedOts = ref([])
const gridData = ref([])
const gridColumns = ref(getMaterialesColumns(props.type))
const showError = ref(false)

const popup = reactive({ show: false, pos: { x: 0, y: 0 }, data: null })
const modPopup = reactive({ show: false, pos: { x: 0, y: 0 }, data: null })
const exportPopup = reactive({ show: false, pos: { x: 0, y: 0 }, data: [] })

const resetState = () => {
  openResults.value = true
  hasSearched.value = false
  isLoading.value = false
  operationError.value = ''
  currentStep.value = 1
  selectedRows.value = []
  currentVisibleCols.value = []
  modifiedOts.value = []
  gridData.value = []
  gridColumns.value = getMaterialesColumns(props.type)
}

const handleSearch = async (filters) => {
  isLoading.value = true
  operationError.value = ''
  selectedRows.value = []
  modifiedOts.value = []
  currentStep.value = 1
  gridColumns.value = getMaterialesColumns(props.type)

  try {
    gridData.value = await searchMateriales(props.type, filters)
    hasSearched.value = true
    openResults.value = true
  } catch (error) {
    hasSearched.value = false
    operationError.value = error.message || 'No se pudo realizar la búsqueda.'
  } finally {
    isLoading.value = false
  }
}

const triggerRominaError = () => {
  showError.value = true
}

const openEditPopup = (event, row) => {
  popup.pos.x = event.clientX + 10
  popup.pos.y = event.clientY + 10

  if (popup.pos.x + 550 > window.innerWidth) popup.pos.x = window.innerWidth - 560
  if (popup.pos.y + 400 > window.innerHeight) popup.pos.y = window.innerHeight - 420

  popup.data = row
  popup.show = true
}

const handleSaveOt = (modifiedData) => {
  const existingIndex = modifiedOts.value.findIndex((item) => item.ot?.id === modifiedData.ot?.id)

  if (existingIndex >= 0) {
    modifiedOts.value.splice(existingIndex, 1, modifiedData)
  } else {
    modifiedOts.value.push(modifiedData)
  }

  popup.show = false
}

const openModPopup = (event, modData) => {
  modPopup.pos.x = event.clientX + 10
  modPopup.pos.y = event.clientY + 10

  if (modPopup.pos.x + 450 > window.innerWidth) modPopup.pos.x = window.innerWidth - 460
  if (modPopup.pos.y + 300 > window.innerHeight) modPopup.pos.y = window.innerHeight - 320

  modPopup.data = modData
  modPopup.show = true
}

const openExportDetailPopup = (event) => {
  exportPopup.pos.x = event.clientX + 10
  exportPopup.pos.y = event.clientY + 10

  if (exportPopup.pos.x + 500 > window.innerWidth) exportPopup.pos.x = window.innerWidth - 510
  if (exportPopup.pos.y + 400 > window.innerHeight) exportPopup.pos.y = window.innerHeight - 420

  exportPopup.data = selectedRows.value
  exportPopup.show = true
}

const updateVisibleCols = (cols) => {
  currentVisibleCols.value = cols
}

const exportCsv = () => {
  if (!selectedRows.value.length || !currentVisibleCols.value.length) return

  const headers = currentVisibleCols.value.map((column) => column.label)
  const rows = selectedRows.value.map((row) => currentVisibleCols.value.map((column) => row[column.field]))
  const csvContent = buildCsv(headers, rows)

  downloadCsv(`Export_${props.type}.csv`, csvContent)
}

watch(() => props.type, resetState)
</script>
