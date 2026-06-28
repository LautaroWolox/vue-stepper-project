<template>
  <div class="floating-popup" :style="{ top: position.y + 'px', left: position.x + 'px' }" v-if="show">
    <h4><span class="material-icons">info</span> Detalle del Campo</h4>
    <p>Valor Seleccionado: <strong>{{ fieldData }}</strong></p>
    <table>
      <tr><th>Propiedad</th><th>Detalle</th></tr>
      <tr><td>Estado</td><td><span style="color:green; font-weight:bold;">● Activo</span></td></tr>
      <tr><td>Verificado</td><td>Sí</td></tr>
    </table>
    <div class="popup-actions">
      <button class="btn btn-danger" @click="$emit('cancel')">
        <span class="material-icons btn-icon">close</span> Cancelar
      </button>
      <button class="btn" @click="$emit('accept')">
        <span class="material-icons btn-icon">check</span> Aceptar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['show', 'position', 'fieldData'])
defineEmits(['accept', 'cancel'])
</script>