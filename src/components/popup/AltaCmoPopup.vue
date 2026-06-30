<template>
  <div
    v-if="show"
    class="floating-popup alta-cmo-popup"
    :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
  >
    <div class="alta-cmo-header" @mousedown="startDrag">
      <div class="alta-cmo-title">Alta CMO - Actividad</div>
      <button class="alta-cmo-close" type="button" title="Cerrar" @click="$emit('close')">
        <span class="material-icons">close</span>
      </button>
    </div>

    <div class="alta-cmo-body">
      <div class="alta-form-row">
        <div class="alta-form-group">
          <label>Actividad</label>
          <input v-model.trim="newItem.actividad" type="text" class="alta-form-control">
        </div>
        <div class="alta-form-group">
          <label>CMO</label>
          <input v-model.trim="newItem.cmo" type="text" class="alta-form-control">
        </div>
        <button class="alta-cmo-btn alta-add-btn" type="button" :disabled="!newItem.actividad || !newItem.cmo" @click="addToList">
          AGREGAR
        </button>
      </div>

      <div class="alta-table-wrap">
        <table class="alta-cmo-grid">
          <thead>
            <tr>
              <th>CODIGO_ACTIVIDAD</th>
              <th>DESC_ACTIVIDAD</th>
              <th>CODIGO_S4</th>
              <th>CMO</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in innerList"
              :key="`${item.actividad}-${index}`"
              :class="{ 'active-row': selectedInnerIndex === index }"
              @click="selectedInnerIndex = selectedInnerIndex === index ? null : index"
            >
              <td>{{ item.actividad }}</td>
              <td>{{ item.descripcion }}</td>
              <td>{{ item.cod_s4 }}</td>
              <td>{{ item.cmo }}</td>
            </tr>
            <tr v-if="innerList.length === 0">
              <td colspan="4" class="empty-list-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="popup-inner-footer alta-inner-footer">
        <button class="alta-icon-btn" type="button" :disabled="selectedInnerIndex === null" title="Eliminar relación seleccionada" @click="removeFromList">
          <span class="material-icons">delete</span>
        </button>
        <div class="modern-pagination alta-pagination">
          <span class="material-icons icon-nav">first_page</span>
          <span class="material-icons icon-nav">chevron_left</span>
          <span>Página <input type="number" value="1" disabled> de {{ Math.max(1, Math.ceil(innerList.length / 10)) }}</span>
          <span class="material-icons icon-nav">chevron_right</span>
          <span class="material-icons icon-nav">last_page</span>
        </div>
      </div>
    </div>

    <div class="alta-cmo-actions">
      <button class="alta-cmo-btn alta-relacionar-btn" type="button" :disabled="innerList.length === 0" @click="relacionar">
        RELACIONAR
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'

const props = defineProps(['show', 'position'])
const emit = defineEmits(['close', 'add-relations'])

const pos = ref({ x: 0, y: 0 })
const isDragging = ref(false)
let startX = 0
let startY = 0
let initialX = 0
let initialY = 0

const newItem = reactive({ actividad: '', cmo: '' })
const innerList = ref([])
const selectedInnerIndex = ref(null)

watch(() => props.show, (newVal) => {
  if (!newVal) return
  pos.value = { ...props.position }
  innerList.value = []
  selectedInnerIndex.value = null
  newItem.actividad = ''
  newItem.cmo = ''
})

const addToList = () => {
  innerList.value.push({
    actividad: newItem.actividad,
    descripcion: 'Descripción genérica',
    cod_s4: '0000001',
    cmo: newItem.cmo
  })
  newItem.actividad = ''
  newItem.cmo = ''
}

const removeFromList = () => {
  if (selectedInnerIndex.value === null) return
  innerList.value.splice(selectedInnerIndex.value, 1)
  selectedInnerIndex.value = null
}

const relacionar = () => {
  emit('add-relations', innerList.value)
}

const startDrag = (event) => {
  isDragging.value = true
  startX = event.clientX
  startY = event.clientY
  initialX = pos.value.x
  initialY = pos.value.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value) return
  pos.value.x = initialX + (event.clientX - startX)
  pos.value.y = initialY + (event.clientY - startY)
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onBeforeUnmount(() => stopDrag())
</script>

<style scoped>
.alta-cmo-popup {
  width: 800px;
  max-width: 95vw;
  background: #ffffff;
  border-radius: 8px;
  overflow: visible;
  box-shadow: 0 22px 55px rgba(38, 50, 56, 0.28), 0 7px 18px rgba(38, 50, 56, 0.18);
  border: 1px solid rgba(207, 216, 220, 0.95);
}

.alta-cmo-header {
  min-height: 48px;
  background: #ffffff;
  color: #546e7a;
  border-bottom: 1px solid #eceff1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  cursor: move;
  border-radius: 8px 8px 0 0;
}

.alta-cmo-title {
  font-weight: 400;
  font-size: 16px;
}

.alta-cmo-close {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #b0bec5;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color .18s ease, color .18s ease;
}

.alta-cmo-close:hover {
  background: #eef3f5;
  color: #78909c;
}

.alta-cmo-close .material-icons {
  font-size: 18px;
  font-weight: 400;
}

.alta-cmo-body {
  background: #ffffff;
  padding: 20px;
}

.alta-form-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eceff1;
}

.alta-form-group {
  flex: 2;
  min-width: 170px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alta-form-group label {
  color: #000000;
  font-size: 13px;
  font-weight: 600;
}

.alta-form-control {
  width: 100%;
  height: 36px;
  border: 1px solid #c9d3da;
  border-radius: 4px;
  background: #ffffff;
  color: #263238;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}

.alta-form-control:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, .16);
}

.alta-cmo-btn {
  min-height: 36px;
  border: 1px solid #00a9bd;
  border-radius: 20px;
  background: #00a9bd;
  color: #ffffff;
  padding: 8px 22px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .2px;
  cursor: pointer;
  transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}

.alta-cmo-btn:hover:not(:disabled) {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 5px 12px rgba(0, 143, 161, .26);
  transform: translateY(-1px);
}

.alta-cmo-btn:disabled {
  background: #b0bec5;
  border-color: #b0bec5;
  color: #eceff1;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.alta-add-btn {
  min-width: 110px;
}

.alta-table-wrap {
  max-height: 250px;
  overflow: auto;
  border: 1px solid #d8d8d8;
  border-top: 0;
  margin-top: 18px;
  background: #ffffff;
}

.alta-cmo-grid {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
  color: #263238;
}

.alta-cmo-grid th,
.alta-cmo-grid td {
  border-right: 1px solid #d8d8d8;
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 12px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alta-cmo-grid th {
  background: #ffffff;
  color: #546e7a;
  font-weight: 600;
}

.alta-cmo-grid tbody tr {
  cursor: pointer;
  transition: background-color .16s ease;
}

.alta-cmo-grid tbody tr:hover td {
  background: #edfafd;
}

.alta-cmo-grid tbody tr.active-row td {
  background: #9eeff7;
  color: #003f47;
}

.empty-list-cell {
  height: 150px;
  background: #ffffff;
}

.alta-inner-footer {
  min-height: 56px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 8px 4px 4px;
}

.alta-icon-btn {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #607d8b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color .18s ease, color .18s ease;
}

.alta-icon-btn:hover:not(:disabled) {
  background: #e0f7fa;
  color: #008fa1;
}

.alta-icon-btn:disabled {
  color: #cfd8dc;
  cursor: not-allowed;
}

.alta-icon-btn .material-icons {
  font-size: 19px;
  font-weight: 400;
}

.alta-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #546e7a;
  font-size: 14px;
}

.alta-pagination input {
  width: 34px;
  height: 26px;
  text-align: center;
  border: 1px solid #c9d3da;
  border-radius: 4px;
  background: #f9fbfc;
  color: #607d8b;
}

.alta-pagination .material-icons {
  font-size: 18px;
  color: #78909c;
}

.alta-cmo-actions {
  background: #ffffff;
  border-top: 0;
  padding: 0 25px 25px 25px;
  display: flex;
  justify-content: flex-end;
  border-radius: 0 0 8px 8px;
}

.alta-relacionar-btn {
  min-width: 150px;
}

@media (max-width: 820px) {
  .alta-cmo-popup {
    width: calc(100vw - 24px);
    left: 12px !important;
  }

  .alta-form-row {
    align-items: stretch;
    flex-direction: column;
  }

  .alta-add-btn,
  .alta-relacionar-btn {
    width: 100%;
  }

  .alta-inner-footer {
    grid-template-columns: 1fr;
    gap: 8px;
    justify-items: center;
  }

  .alta-cmo-actions {
    padding: 0 20px 20px;
  }
}
</style>
