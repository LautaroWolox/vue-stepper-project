<template>
  <DetalleOtNotaPopup
    :show="show"
    :ot-number="otNumber"
    @close="$emit('close')"
  />
</template>

<script setup>
import DetalleOtNotaPopup from '../certificacion/notas/DetalleOtNotaPopup.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  otNumber: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>
