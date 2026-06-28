<template>
  <div 
    class="floating-popup" 
    :class="{ expanded: isExpanded }"
    :style="!isExpanded ? { top: pos.y + 'px', left: pos.x + 'px' } : {}" 
    v-if="show"
  >
    <div class="popup-header" @mousedown="startDrag">
      <div class="popup-title">
        <span class="material-icons">info</span> 
        Detalle del Campo: {{ fieldData }}
      </div>
      <div class="popup-controls">
        <span class="material-icons" @click.stop="toggleExpand" :title="isExpanded ? 'Restaurar' : 'Maximizar'">
          {{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}
        </span>
      </div>
    </div>

    <div class="popup-body">
      <div v-if="isLoading" class="popup-loader">
        <div class="spinner"></div>
        <span>Cargando datos extendidos...</span>
      </div>

      <div v-else>
        <p>Mostrando datos vinculados al valor <strong>{{ fieldData }}</strong>:</p>
        
        <table class="popup-grid">
          <thead>
            <tr>
              <th>ID Interno</th>
              <th>Propiedad</th>
              <th>Valor</th>
              <th>Código Ref.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in mockInnerData" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.prop }}</td>
              <td>
                <span v-if="item.prop === 'Estado'" style="color:green; font-weight:bold;">● {{ item.val }}</span>
                <span v-else>{{ item.val }}</span>
              </td>
              <td style="color: #90a4ae; font-family: monospace;">{{ item.ref }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="popup-actions">
      <button class="btn btn-danger" @click="$emit('cancel')">
        <span class="material-icons btn-icon">close</span> Cerrar
      </button>
      <button class="btn" @click="$emit('accept')">
        <span class="material-icons btn-icon">check</span> Procesar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps(['show', 'position', 'fieldData'])
const emit = defineEmits(['accept', 'cancel'])

// Estados
const pos = ref({ x: 0, y: 0 })
const isExpanded = ref(false)
const isLoading = ref(true)
const isDragging = ref(false)

// Variables para el arrastre
let startX = 0, startY = 0, initialX = 0, initialY = 0

// Datos inventados para la grilla interna
const mockInnerData = ref([
  { id: 1045, prop: 'Estado', val: 'Activo', ref: 'STS-01' },
  { id: 1046, prop: 'Tipo Registro', val: 'Principal', ref: 'TYP-99' },
  { id: 1047, prop: 'Verificado', val: 'Sí (Validado)', ref: 'CHK-00' },
  { id: 1048, prop: 'Prioridad', val: 'Alta', ref: 'PR-A1' },
  { id: 1049, prop: 'Lote Asignado', val: 'L-4421-B', ref: 'LOT-44' },
])

// Cuando se abre el popup, setea la posición, quita el expandido y lanza el loader
watch(() => props.show, (newVal) => {
  if (newVal) {
    pos.value = { ...props.position }
    isExpanded.value = false
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 1200) // Simula 1.2 segundos de carga
  }
})

// Lógica de maximizar
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// Lógica de arrastrar (Drag & Drop)
const startDrag = (e) => {
  if (isExpanded.value) return // Si está en pantalla completa no se arrastra
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
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  pos.value.x = initialX + dx
  pos.value.y = initialY + dy
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>