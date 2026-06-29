<template>
  <div v-if="show" class="gestion-error-popup" :style="popupStyle">
    <div class="gestion-error-popup-header" @mousedown="startDrag">
      <span>Gestionar Error</span>
      <button class="gestion-error-close" type="button" @click="$emit('close')">×</button>
    </div>

    <div class="gestion-error-popup-body">
      <div class="gestion-error-column disabled-column">
        <div class="gestion-error-row">
          <label>NRO SERIE</label>
          <input class="form-control" :value="row?.nroSerie || ''" disabled />
        </div>

        <div class="gestion-error-row">
          <label>RECUPERO</label>
          <select class="form-control" v-model="reprocessType" disabled>
            <option value="RECUPERO">RECUPERO</option>
          </select>
        </div>

        <div class="gestion-error-actions">
          <button class="btn-cyan-outline" type="button" @click="handleReprocess">REPROCESAR</button>
        </div>
      </div>

      <div class="gestion-error-column">
        <div class="gestion-error-row">
          <label>NRO SERIE</label>
          <div class="gestion-error-field">
            <input class="form-control" v-model.trim="replaceSerial" :class="{ 'input-error': serialError }" />
            <span v-if="serialError" class="error-text">El Nro de Serie es obligatorio</span>
          </div>
        </div>

        <div class="gestion-error-row">
          <label>RECUPERO</label>
          <select class="form-control" v-model="replaceType">
            <option value="RECUPERO">RECUPERO</option>
          </select>
        </div>

        <div class="gestion-error-actions">
          <button class="btn-cyan-outline" type="button" @click="handleReplace">REEMPLAZAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: null
  },
  position: {
    type: Object,
    default: () => ({ x: 120, y: 120 })
  }
})

const emit = defineEmits(['close', 'reprocess', 'replace'])

const pos = reactive({ x: 120, y: 120 })
const isDragging = ref(false)
const reprocessType = ref('RECUPERO')
const replaceType = ref('RECUPERO')
const replaceSerial = ref('')
const serialError = ref(false)

let startX = 0
let startY = 0
let initialX = 0
let initialY = 0

const popupStyle = computed(() => ({
  left: `${pos.x}px`,
  top: `${pos.y}px`
}))

watch(() => props.show, (newValue) => {
  if (!newValue) return

  pos.x = props.position?.x ?? 120
  pos.y = props.position?.y ?? 120
  replaceSerial.value = ''
  replaceType.value = 'RECUPERO'
  reprocessType.value = 'RECUPERO'
  serialError.value = false
})

const handleReprocess = () => {
  emit('reprocess', {
    row: props.row,
    recupero: reprocessType.value
  })
}

const handleReplace = () => {
  serialError.value = !replaceSerial.value

  if (serialError.value) return

  emit('replace', {
    row: props.row,
    nroSerie: replaceSerial.value,
    recupero: replaceType.value
  })
}

const startDrag = (event) => {
  if (event.target.closest('button')) return

  isDragging.value = true
  startX = event.clientX
  startY = event.clientY
  initialX = pos.x
  initialY = pos.y

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value) return

  const nextX = initialX + event.clientX - startX
  const nextY = initialY + event.clientY - startY

  pos.x = Math.max(8, Math.min(nextX, window.innerWidth - 220))
  pos.y = Math.max(8, Math.min(nextY, window.innerHeight - 120))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
.gestion-error-popup {
  position: fixed;
  z-index: 6500;
  width: min(920px, calc(100vw - 32px));
  background: #fff;
  border: 1px solid #d8d8d8;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
  border-radius: 2px;
}

.gestion-error-popup-header {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-size: 18px;
  cursor: move;
  user-select: none;
}

.gestion-error-close {
  appearance: none;
  border: 0;
  background: transparent;
  color: #c5c5c5;
  cursor: pointer;
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
}

.gestion-error-close:hover {
  color: #777;
}

.gestion-error-popup-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 58px;
  padding: 34px 36px 28px;
}

.gestion-error-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gestion-error-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: start;
  gap: 16px;
}

.gestion-error-row label {
  padding-top: 9px;
  font-size: 14px;
  font-weight: 700;
  color: #111;
}

.disabled-column label {
  color: #8e8e8e;
}

.gestion-error-field {
  min-height: 56px;
}

.gestion-error-field .form-control,
.gestion-error-row .form-control {
  height: 34px;
  border-radius: 3px;
}

.gestion-error-row .form-control:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 8px rgba(0, 188, 212, 0.35);
}

.gestion-error-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
}

.btn-cyan-outline {
  background: white;
  color: #00a9bd;
  border: 1px solid #00a9bd;
  border-radius: 18px;
  padding: 8px 18px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-cyan-outline:hover {
  background: #e0f7fa;
}

.input-error {
  border-color: #e91e63 !important;
}

.error-text {
  display: block;
  margin-top: 4px;
  color: #e91e63;
  font-size: 13px;
}

@media (max-width: 900px) {
  .gestion-error-popup {
    left: 12px !important;
    right: 12px;
    top: 72px !important;
    width: auto;
  }

  .gestion-error-popup-body {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 18px;
  }
}

@media (max-width: 560px) {
  .gestion-error-popup-header {
    height: 48px;
    font-size: 16px;
  }

  .gestion-error-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .gestion-error-row label {
    padding-top: 0;
  }

  .gestion-error-actions,
  .btn-cyan-outline {
    width: 100%;
  }
}
</style>
