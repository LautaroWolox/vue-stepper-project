<template>
  <div class="floating-popup" style="width: 480px;" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" v-if="show">
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1;" @mousedown="startDrag">
      <div class="popup-title" style="font-weight: normal; font-size: 16px;">Edición CMO-Actividad</div>
      <div class="popup-controls">
        <span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold;" @click="$emit('close')">close</span>
      </div>
    </div>
    
    <div class="popup-body" style="background: white; padding: 25px;">
      <div style="display: flex; gap: 20px;">
        <div class="form-group" style="flex: 1;">
          <label style="color: #000; font-size: 13px;">Código S4</label>
          <input type="text" class="form-control" value="0000001" disabled style="background: #fff; color: #9e9e9e; border: 1px solid #e0e0e0;">
        </div>

        <div class="form-group" style="flex: 1;">
          <label style="color: #000; font-size: 13px;">CMO</label>
          <input type="text" class="form-control" :value="data?.cmo" disabled style="background: #fff; color: #9e9e9e; border: 1px solid #e0e0e0; margin-bottom: 10px;">
          <input type="text" class="form-control" v-model="editData.cmo" style="border-radius: 4px; border-color: #00bcd4;">
        </div>
      </div>
    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 0 25px 25px 25px;">
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 10px 25px;" @click="save">ACTUALIZAR</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps(['show', 'position', 'data'])
const emit = defineEmits(['close', 'update'])

const pos = ref({ x: 0, y: 0 })
const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

const editData = reactive({ cmo: '' })

watch(() => props.show, (newVal) => { 
  if (newVal) { pos.value = { ...props.position }; editData.cmo = '' } 
})

const save = () => {
  if(editData.cmo.trim() !== '') {
    emit('update', { id: props.data.id, cmo: editData.cmo })
  } else {
    emit('update', { id: props.data.id, cmo: props.data.cmo })
  }
}

const startDrag = (e) => { isDragging.value = true; startX = e.clientX; startY = e.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (e) => { if (!isDragging.value) return; pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY) }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }
</script>