<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <span class="material-icons modal-icon-success">check_circle</span>
      <h2>Resumen de Operación</h2>
      <p>El flujo del Stepper ha finalizado correctamente.</p>
      
      <div class="modal-details">
        <ul>
          <li><strong>Total Registros Base:</strong> <span>{{ summaryData.total }}</span></li>
          <li><strong>Total Seleccionados:</strong> <span style="color:#00bcd4; font-weight:bold;">{{ summaryData.selected }}</span></li>
        </ul>
      </div>
      
      <button class="btn" style="width: 100%;" @click="$emit('close')">
        <span class="material-icons btn-icon">done_all</span> Finalizar y Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['show', 'summaryData'])
defineEmits(['close'])
</script>