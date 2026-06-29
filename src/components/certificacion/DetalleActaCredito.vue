<template>
  <DetalleNotaCreditoView
    :nota="nota"
    :tipo-nota="tipoNota"
    @volver="$emit('volver')"
  />
</template>

<script setup>
import DetalleNotaCreditoView from './notas/DetalleNotaCreditoView.vue'

defineProps({
  nota: {
    type: Object,
    required: true
  },
  tipoNota: {
    type: String,
    default: 'credito'
  }
})

defineEmits(['volver'])
</script>
