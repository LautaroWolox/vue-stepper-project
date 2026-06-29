<template>
  <div class="floating-popup" style="width: 850px; max-width: 95vw; z-index: 7000;" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" v-if="show">
    
    <div class="popup-header" style="background: white; color: #00bcd4; border-bottom: 1px solid #eceff1; cursor: grab;" @mousedown="startDrag">
      <div class="popup-title" style="font-weight: bold; font-size: 15px;">
        Detalle Actividades - OT: {{ data?.ot }}
      </div>
      <div class="popup-controls">
        <span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold; cursor: pointer;" @click="$emit('close')">close</span>
      </div>
    </div>
    
    <div class="popup-body" style="background: #fafafa; padding: 20px;">
      <div class="table-responsive" style="border: 1px solid #e0e0e0; background: white; max-height: 350px;">
        <table class="advanced-grid">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>ACTIVIDAD</th>
              <th>CANTIDAD</th>
              <th>NRO NC/ND</th>
              <th>ESTADO NC/ND</th>
              <th>ESTADO ACTIVIDAD</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(act, index) in data?.actividades" :key="index">
              <td style="font-weight: bold; color: #455a64;">{{ act.codigo }}</td>
              <td>{{ act.desc }}</td>
              <td style="text-align: center; font-weight: bold;">{{ act.cant }}</td>
              <td style="color: #00838f;">{{ act.ncnd || '-' }}</td>
              <td>{{ act.est_ncnd || '-' }}</td>
              <td>
                <span :style="{ color: act.est_act === 'S' ? '#4caf50' : '#d32f2f', fontWeight: 'bold' }">
                  {{ act.est_act === 'S' ? 'S' : 'N' }}
                </span>
              </td>
            </tr>
            <tr v-if="!data?.actividades || data.actividades.length === 0">
              <td colspan="6" style="text-align: center; padding: 30px; color: #90a4ae;">
                No hay actividades registradas para esta OT.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 0 20px 20px 20px; display: flex; justify-content: flex-end;">
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 8px 30px;" @click="$emit('close')">CERRAR DETALLE</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['show', 'data'])
const emit = defineEmits(['close'])

const pos = ref({ x: 0, y: 0 })
const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

// Centrar el popup cuando se abre
watch(() => props.show, (newVal) => { 
  if (newVal) { 
    pos.value = { 
      x: (window.innerWidth - 850) / 2 > 0 ? (window.innerWidth - 850) / 2 : 20, 
      y: (window.innerHeight - 400) / 2 > 0 ? (window.innerHeight - 400) / 2 : 20 
    }
  } 
})

const startDrag = (e) => { 
  isDragging.value = true; 
  startX = e.clientX; 
  startY = e.clientY; 
  initialX = pos.value.x; 
  initialY = pos.value.y; 
  document.addEventListener('mousemove', onDrag); 
  document.addEventListener('mouseup', stopDrag);
}

const onDrag = (e) => { 
  if (!isDragging.value) return; 
  pos.value.x = initialX + (e.clientX - startX); 
  pos.value.y = initialY + (e.clientY - startY);
}

const stopDrag = () => { 
  isDragging.value = false; 
  document.removeEventListener('mousemove', onDrag); 
  document.removeEventListener('mouseup', stopDrag);
}
</script>