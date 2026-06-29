<template>
  <div class="floating-popup" style="width: 500px; z-index: 6000;" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" v-if="show">
    
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1; cursor: grab;" @mousedown="startDrag">
      <div class="popup-title" style="font-weight: normal; font-size: 16px;">Nueva Actividad</div>
      <div class="popup-controls"><span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold; cursor: pointer;" @click="$emit('close')">close</span></div>
    </div>
    
    <div class="popup-body" style="background: white; padding: 20px;">
      <div style="display: flex; gap: 20px; margin-bottom: 15px;">
        <div class="form-group" style="flex: 1;">
          <label style="color: #000; font-size: 13px;">Código Actividad</label>
          <input type="text" class="form-control" style="border-radius: 4px;">
        </div>
        <div class="form-group" style="flex: 1;">
          <label style="color: #000; font-size: 13px;">Cantidad Actividad</label>
          <input type="text" class="form-control" value="1" disabled style="background: #f5f5f5; color: #9e9e9e;">
          
          <label style="color: #000; font-size: 13px; margin-top: 10px;">Motivo Actividad</label>
          <select class="form-control" style="border-color: #00bcd4;">
            <option value=""></option>
            <option value="1">Ajuste de Stock</option>
            <option value="2">Error de Carga</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label style="color: #000; font-size: 13px;">Comentario</label>
        <textarea class="form-control" rows="3" placeholder="Opcional" style="resize: none; border-radius: 4px;"></textarea>
      </div>
    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 0 20px 20px 20px; justify-content: flex-end;">
      <button class="btn btn-danger" style="border-radius: 20px; padding: 8px 25px; margin-right: 10px;" @click="$emit('close')">CANCELAR</button>
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 8px 25px;" @click="$emit('close')">ACEPTAR</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['show'])
const emit = defineEmits(['close'])

// Lógica de arrastre
const pos = ref({ x: 0, y: 0 })
const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

// Centrar cuando se abre
watch(() => props.show, (newVal) => { 
  if (newVal) { 
    pos.value = {
      x: (window.innerWidth - 500) / 2,
      y: (window.innerHeight - 300) / 2
    }
  } 
})

const startDrag = (e) => {
  isDragging.value = true
  startX = e.clientX; startY = e.clientY
  initialX = pos.value.x; initialY = pos.value.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  pos.value.x = initialX + (e.clientX - startX)
  pos.value.y = initialY + (e.clientY - startY)
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>