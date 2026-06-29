<template>
  <div>
    <h3 style="color: #00838f;"><span class="material-icons">file_download</span> Finalizar y Exportar</h3>
    <p>
      Se exportarán las <strong>{{ currentVisibleCols.length }}</strong> columnas visibles de los
      <strong>{{ selectedRows.length }}</strong> registros.
    </p>

    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: space-between;">
      <button class="btn" @click="$emit('back')">
        <span class="material-icons btn-icon">arrow_back</span> Atrás
      </button>
      <button class="btn" style="background: linear-gradient(135deg, #4caf50, #2e7d32);" :disabled="!canExport" @click="$emit('export')">
        <span class="material-icons btn-icon">table_view</span> Descargar CSV
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedRows: {
    type: Array,
    default: () => []
  },
  currentVisibleCols: {
    type: Array,
    default: () => []
  }
})

defineEmits(['back', 'export'])

const canExport = computed(() => props.selectedRows.length > 0 && props.currentVisibleCols.length > 0)
</script>
