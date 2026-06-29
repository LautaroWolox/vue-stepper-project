<template>
  <div class="floating-popup" style="width: 400px;" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" v-if="show">
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1;" @mousedown="startDrag">
      <div class="popup-title" style="font-weight: normal; font-size: 16px;">Detalle Nota</div>
      <div class="popup-controls"><span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold;" @click="$emit('close')">close</span></div>
    </div>
    
    <div class="popup-body" style="background: white; padding: 20px;">
      <textarea class="form-control" rows="6" style="resize: none; background: #f5f5f5;" placeholder="Ingrese el detalle de la nota aquí..."></textarea>
    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 0 20px 20px 20px;">
      <button class="btn" style="background: white; color: #00bcd4; border: 1px solid #00bcd4; border-radius: 20px; padding: 6px 20px;" @click="$emit('close')">ACEPTAR</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['show', 'position'])
const emit = defineEmits(['close'])

const pos = ref({ x: 0, y: 0 }); const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

watch(() => props.show, (newVal) => { if (newVal) { pos.value = { ...props.position } } })

const startDrag = (e) => { isDragging.value = true; startX = e.clientX; startY = e.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (e) => { if (!isDragging.value) return; pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY) }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }
</script>