<template>
  <div class="step-three">
    <h3><span class="material-icons">preview</span> Revisión Final (Haz clic en una celda)</h3>
    <div class="grid-container step-three-grid">
      <table>
        <thead>
          <tr><th v-for="col in columns" :key="col">{{ col }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.id">
            <td v-for="col in columns" :key="col" @click="openPopup($event, row[col])" title="Clic para ver detalle">
              {{ row[col] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <FloatingPopup 
      :show="popup.show" 
      :position="popup.pos" 
      :fieldData="popup.data"
      @accept="popup.show = false" 
      @cancel="popup.show = false" 
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import FloatingPopup from '../popup/FloatingPopup.vue'

const props = defineProps(['data', 'columns'])
const popup = reactive({ show: false, pos: { x: 0, y: 0 }, data: null })

const openPopup = (event, value) => {
  // Ajuste de coordenadas para que no se salga de la pantalla
  let x = event.clientX + 15
  let y = event.clientY + 15
  if (x + 280 > window.innerWidth) x = window.innerWidth - 300
  if (y + 150 > window.innerHeight) y = window.innerHeight - 180

  popup.pos.x = x
  popup.pos.y = y
  popup.data = value
  popup.show = true
}
</script>