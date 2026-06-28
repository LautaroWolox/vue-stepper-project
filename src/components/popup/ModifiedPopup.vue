<template>
  <div class="floating-popup" style="width: 450px;" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" v-if="show">
    <div class="popup-header" @mousedown="startDrag"><div class="popup-title"><span class="material-icons">history</span> Historial de Cambios: {{ data?.ot.nroot }}</div></div>
    <div class="popup-body">
      <p style="color: #455a64; margin-top: 0;">Materiales registrados en la última modificación:</p>
      <table class="popup-grid">
        <thead><tr><th>Material Modificado/Agregado</th><th>Cant. Final</th></tr></thead>
        <tbody><tr v-for="(mat, i) in data?.materials" :key="i"><td>{{ mat.material }}</td><td style="font-weight: bold; color: #00838f;">{{ mat.cantidad }}</td></tr></tbody>
      </table>
    </div>
    <div class="popup-actions"><button class="btn" @click="$emit('close')"><span class="material-icons btn-icon">check</span> Entendido</button></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['show', 'position', 'data']); const emit = defineEmits(['close'])
const pos = ref({ x: 0, y: 0 }); const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0
watch(() => props.show, (newVal) => { if (newVal) { pos.value = { ...props.position } } })
const startDrag = (e) => { isDragging.value = true; startX = e.clientX; startY = e.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (e) => { if (!isDragging.value) return; pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY) }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }
</script>