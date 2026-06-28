<template>
  <div class="floating-popup" style="width: 800px; max-width: 95vw;" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" v-if="show">
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1;" @mousedown="startDrag">
      <div class="popup-title" style="font-weight: normal; font-size: 16px;">Alta CMO - Actividad</div>
      <div class="popup-controls">
        <span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold;" @click="$emit('close')">close</span>
      </div>
    </div>
    
    <div class="popup-body" style="background: white; padding: 20px;">
      <div class="alta-form-row">
        <div class="form-group" style="flex: 2; min-width: 150px;">
          <label style="color: #000; font-size: 13px;">Actividad</label>
          <input type="text" class="form-control" v-model="newItem.actividad" style="border-radius: 4px;">
        </div>
        <div class="form-group" style="flex: 2; min-width: 150px;">
          <label style="color: #000; font-size: 13px;">CMO</label>
          <input type="text" class="form-control" v-model="newItem.cmo" style="border-radius: 4px;">
        </div>
        <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; height: 35px;" :disabled="!newItem.actividad || !newItem.cmo" @click="addToList">AGREGAR</button>
      </div>

      <div class="table-responsive" style="max-height: 250px; border-radius: 0;">
        <table class="advanced-grid">
          <thead>
            <tr>
              <th style="background: white; color: #546e7a; padding: 10px;">CODIGO_ACTIVIDAD</th>
              <th style="background: white; color: #546e7a; padding: 10px;">DESC_ACTIVIDAD</th>
              <th style="background: white; color: #546e7a; padding: 10px;">CODIGO_S4</th>
              <th style="background: white; color: #546e7a; padding: 10px;">CMO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in innerList" :key="index" :class="{ 'active-row': selectedInnerIndex === index }" @click="selectedInnerIndex = selectedInnerIndex === index ? null : index" style="cursor: pointer;">
              <td>{{ item.actividad }}</td><td>Descripción genérica</td><td>0000001</td><td>{{ item.cmo }}</td>
            </tr>
            <tr v-if="innerList.length === 0"><td colspan="4" style="height: 150px;"></td></tr>
          </tbody>
        </table>
      </div>

      <div class="popup-inner-footer">
        <button class="icon-btn" :disabled="selectedInnerIndex === null" @click="removeFromList">
          <span class="material-icons" style="font-size: 20px; font-weight: bold;">delete</span>
        </button>
        <div class="modern-pagination">
          <span class="material-icons icon-nav">first_page</span>
          <span class="material-icons icon-nav">chevron_left</span>
          <span>Página <input type="number" value="1" disabled style="width: 30px;"> de {{ Math.max(1, Math.ceil(innerList.length / 10)) }}</span>
          <span class="material-icons icon-nav">chevron_right</span>
          <span class="material-icons icon-nav">last_page</span>
        </div>
      </div>
    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 0 25px 25px 25px;">
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 10px 25px;" :disabled="innerList.length === 0" @click="relacionar">RELACIONAR</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
const props = defineProps(['show', 'position'])
const emit = defineEmits(['close', 'add-relations'])

const pos = ref({ x: 0, y: 0 }); const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

const newItem = reactive({ actividad: '', cmo: '' })
const innerList = ref([]); const selectedInnerIndex = ref(null)

watch(() => props.show, (newVal) => { 
  if (newVal) { pos.value = { ...props.position }; innerList.value = []; selectedInnerIndex.value = null; newItem.actividad = ''; newItem.cmo = '' } 
})

const addToList = () => {
  innerList.value.push({ actividad: newItem.actividad, cmo: newItem.cmo })
  newItem.actividad = ''; newItem.cmo = ''
}

const removeFromList = () => {
  if (selectedInnerIndex.value !== null) { innerList.value.splice(selectedInnerIndex.value, 1); selectedInnerIndex.value = null }
}

const relacionar = () => { emit('add-relations', innerList.value) }

const startDrag = (e) => { isDragging.value = true; startX = e.clientX; startY = e.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (e) => { if (!isDragging.value) return; pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY) }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }
</script>