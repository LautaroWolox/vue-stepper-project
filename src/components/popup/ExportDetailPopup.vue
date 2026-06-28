<template>
  <div class="floating-popup" style="width: 500px;" :class="{ expanded: isExpanded }" :style="!isExpanded ? { top: pos.y + 'px', left: pos.x + 'px' } : {}" v-if="show">
    <div class="floating-popup-frame" @dblclick="toggleExpand">
      <div class="popup-header" @mousedown="startDrag">
        <div class="popup-title"><span class="material-icons">list_alt</span> OTs para Exportar</div>
        <div class="popup-controls"><span class="material-icons" @click.stop="toggleExpand">{{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}</span></div>
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
        <span>Recopilando registros...</span>
      </div>
      <div v-show="!isLoading" style="flex: 1;">
        <p style="color: #455a64; margin-top: 0;">Se exportarán las siguientes <strong>{{ data.length }}</strong> OTs:</p>
        <div>
          <table class="popup-grid">
            <thead><tr><th>Nro OT</th><th>Estado</th><th>Técnico / Almacén</th></tr></thead>
            <tbody><tr v-for="row in data" :key="row.id"><td style="font-weight: bold; color: #00838f;">{{ row.nroot }}</td><td>{{ row.estadoOt || row.estadoFm }}</td><td>{{ row.tecnico || row.almacen }}</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="popup-actions" v-show="!isLoading"><button class="btn" @click="$emit('close')"><span class="material-icons btn-icon">check</span> Entendido</button></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['show', 'position', 'data']); const emit = defineEmits(['close'])
const pos = ref({ x: 0, y: 0 }); const isExpanded = ref(false); const isLoading = ref(true); const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0
watch(() => props.show, (newVal) => { if (newVal) { pos.value = { ...props.position }; isExpanded.value = false; isLoading.value = true; setTimeout(() => { isLoading.value = false }, 1500) } })
const toggleExpand = () => { isExpanded.value = !isExpanded.value }
const startDrag = (e) => { if (isExpanded.value) return; isDragging.value = true; startX = e.clientX; startY = e.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (e) => { if (!isDragging.value) return; pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY) }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }
</script>