<template>
  <div class="stepper-header" style="margin-bottom: 15px;">
    <div :class="['step-indicator', { active: currentStep === 1 }]">
      <span class="material-icons">touch_app</span> 1. Selección
    </div>
    <div :class="['step-indicator', { active: currentStep === 2 }]">
      <span class="material-icons">fact_check</span> 2. Revisión
    </div>
    <div :class="['step-indicator', { active: currentStep === 3 }]">
      <span class="material-icons">import_export</span> 3. Exportación
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})
</script>
