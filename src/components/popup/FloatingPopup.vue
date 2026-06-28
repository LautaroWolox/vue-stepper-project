<template>
  <div 
    class="floating-popup" 
    :class="{ expanded: isExpanded }"
    :style="!isExpanded ? { top: pos.y + 'px', left: pos.x + 'px' } : {}" 
    v-if="show"
  >
    <div class="floating-popup-frame" @dblclick="toggleExpand">
      <div class="popup-header" @mousedown="startDrag">
        <div class="popup-title">
          <span class="material-icons">build</span> Edición Detalle: {{ otData?.nroot }}
        </div>
        <div class="popup-controls">
          <span class="material-icons" @click.stop="toggleExpand" :title="isExpanded ? 'Restaurar' : 'Maximizar'">
            {{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}
          </span>
        </div>
      </div>
    </div>

    <div class="popup-body">
      <div v-if="isLoading" class="popup-loader">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/>
          <rect x="55" y="95" width="10" height="25" fill="#78909C"/>
          <rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/>
          <rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/>
          <rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/>
          <g class="code-lines">
            <rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/>
            <rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/>
            <rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/>
            <rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/>
          </g>
          <rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/>
          <path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/>
          <circle cx="150" cy="50" r="18" fill="#FFB74D"/>
          <path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/>
          <path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
        </svg>
        <span>{{ loadingText }}</span>
      </div>

      <div v-show="!isLoading" style="flex: 1;">
        <p style="color: #546e7a; margin-top: 0;">Gestionar materiales vinculados a esta OT. Complete los campos y haga clic en 'Agregar'.</p>

        <div class="popup-form-row">
          <div class="form-group" style="flex: 2;">
            <label>Nuevo Material</label>
            <select class="form-control" v-model="newItem.material">
              <option value="">Seleccione...</option>
              <option value="Cable RG6">Cable RG6</option>
              <option value="Modem FTTX">Modem FTTX</option>
              <option value="Conector RJ45">Conector RJ45</option>
            </select>
          </div>
          <div class="form-group" style="flex: 1;">
            <label>Cantidad</label>
            <input type="number" class="form-control" v-model="newItem.cantidad" min="1">
          </div>
          <button class="btn" style="height: 35px;" @click="addMaterial" :disabled="!newItem.material || !newItem.cantidad">
            <span class="material-icons btn-icon">add</span>
          </button>
        </div>

        <table class="popup-grid">
          <thead>
            <tr>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in innerItems" :key="index">
              <td>{{ item.material }}</td>
              <td>{{ item.cantidad }}</td>
              <td style="text-align: center;">
                <button class="btn btn-danger" style="padding: 2px 6px;" @click="removeItem(index)">
                  <span class="material-icons" style="font-size: 16px;">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="innerItems.length === 0">
              <td colspan="3" style="text-align: center;">No hay materiales cargados.</td>
            </tr>
          </tbody>
        </table>

        <div v-if="isValidated" style="margin-top: 15px; padding: 10px; background: #e8f5e9; color: #2e7d32; border-radius: 4px; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons">check_circle</span> Materiales validados correctamente.
        </div>
      </div>
    </div>

    <div class="popup-actions" v-show="!isLoading">
      <button class="btn btn-danger" @click="$emit('cancel')">
        <span class="material-icons btn-icon">close</span> Cerrar
      </button>
      <button class="btn" style="background: #fb8c00;" @click="validateData" :disabled="innerItems.length === 0">
        <span class="material-icons btn-icon">fact_check</span> Validar
      </button>
      <button class="btn" style="background: #4caf50;" @click="handleAccept" :disabled="!isValidated">
        <span class="material-icons btn-icon">save</span> Aceptar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps(['show', 'position', 'otData'])
const emit = defineEmits(['accept', 'cancel'])

const pos = ref({ x: 0, y: 0 })
const isExpanded = ref(false)
const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

const isLoading = ref(true)
const loadingText = ref('Procesando datos...')

const innerItems = ref([])
const newItem = reactive({ material: '', cantidad: '' })
const isValidated = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    pos.value = { ...props.position }
    isExpanded.value = false
    isValidated.value = false
    isLoading.value = true
    loadingText.value = 'Extrayendo datos de la OT...'
    
    setTimeout(() => {
      innerItems.value = [
        { material: 'Cable UTP', cantidad: 5 },
        { material: 'Roseta Óptica', cantidad: 1 }
      ]
      isLoading.value = false
    }, 1500)
  }
})

const addMaterial = () => {
  innerItems.value.push({ ...newItem })
  newItem.material = ''
  newItem.cantidad = ''
  isValidated.value = false 
}

const removeItem = (index) => {
  innerItems.value.splice(index, 1)
  isValidated.value = false 
}

const validateData = () => {
  isLoading.value = true
  loadingText.value = 'Validando componentes ingresados...'
  setTimeout(() => {
    isLoading.value = false
    isValidated.value = true
  }, 1200)
}

const handleAccept = () => {
  isLoading.value = true
  loadingText.value = 'Guardando modificaciones...'
  setTimeout(() => {
    isLoading.value = false
    emit('accept', { ot: props.otData, materials: innerItems.value })
  }, 1200)
}

const toggleExpand = () => { isExpanded.value = !isExpanded.value }

const startDrag = (e) => {
  if (isExpanded.value) return 
  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  initialX = pos.value.x
  initialY = pos.value.y
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