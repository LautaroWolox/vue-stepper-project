<template>
  <div>
    <div class="stepper-header">
      <div :class="['step-indicator', { active: currentStep === 1 }]">
        <span class="material-icons">touch_app</span> 1. Selección
      </div>
      <div :class="['step-indicator', { active: currentStep === 2 }]">
        <span class="material-icons">import_export</span> 2. Exportación
      </div>
      <div :class="['step-indicator', { active: currentStep === 3 }]">
        <span class="material-icons">fact_check</span> 3. Revisión
      </div>
    </div>

    <div class="stepper-content">
      <DataGrid v-show="currentStep === 1" :data="gridData" :columns="gridColumns" v-model="selectedItems" />
      <StepTwo v-if="currentStep === 2" :selectedData="selectedItems" :columns="gridColumns" />
      <StepThree v-if="currentStep === 3" :data="selectedItems" :columns="gridColumns" />
    </div>

    <div class="stepper-actions">
      <button class="btn" :disabled="currentStep === 1" @click="currentStep--">
        <span class="material-icons btn-icon">arrow_back</span> Atrás
      </button>
      <button class="btn" v-if="currentStep < 3" @click="currentStep++">
        Siguiente <span class="material-icons btn-icon">arrow_forward</span>
      </button>
      <button class="btn" style="background: linear-gradient(135deg, #4caf50, #2e7d32);" v-if="currentStep === 3" @click="finishStepper">
        <span class="material-icons btn-icon">done</span> Finalizar Stepper
      </button>
    </div>

    <SummaryModal 
      :show="showSummary" 
      :summaryData="{ total: gridData.length, selected: selectedItems.length }" 
      @close="showSummary = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataGrid from '../grid/DataGrid.vue'
import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'
import SummaryModal from '../modal/SummaryModal.vue'

const currentStep = ref(1)
const showSummary = ref(false)
const selectedItems = ref([])

const gridColumns = ['ID', 'Campo1', 'Campo2', 'Campo3', 'Campo4', 'Campo5', 'Campo6', 'Campo7', 'Campo8', 'Campo9', 'Campo10', 'Campo11']
const gridData = ref(Array.from({ length: 35 }).map((_, i) => ({
  ID: i + 1,
  disabled: i % 5 === 0, 
  ...Object.fromEntries(gridColumns.slice(1).map(c => [c, `Data ${i+1}-${c.slice(-1)}`]))
})))

const finishStepper = () => {
  showSummary.value = true
}
</script>