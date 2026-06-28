<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content" style="border-top: 5px solid #f44336;">
      <span class="material-icons" style="font-size: 60px; color: #f44336; margin-bottom: 15px;">report_problem</span>
      <h2 style="color: #c62828; margin-bottom: 10px;">Error del Sistema</h2>
      <p style="color: #455a64; margin-bottom: 20px;">No se pudo procesar la solicitud para agregar el material.</p>
      
      <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 15px; text-align: left; border-radius: 4px;">
        <p style="margin: 0; color: #b71c1c; font-weight: 500;">
          <span class="material-icons" style="font-size: 16px; vertical-align: middle;">contact_support</span> 
          Por favor, comunicarse con la PO de Field Manager: <strong>Romina Castro</strong>.
        </p>
      </div>
      
      <button class="btn btn-danger" style="width: 100%; margin-top: 25px;" @click="$emit('close')">
        <span class="material-icons btn-icon">close</span> Aceptar y Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['show'])
defineEmits(['close'])
</script>