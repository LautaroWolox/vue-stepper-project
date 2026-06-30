<template>
  <div class="cmo-page">
    <div class="soft-accordion cmo-accordion">
      <button class="soft-accordion-header cmo-accordion-header" type="button" @click="openFilters = !openFilters">
        <span>FILTROS DE BÚSQUEDA</span>
        <span class="cmo-toggle">{{ openFilters ? '−' : '+' }}</span>
      </button>
      <div class="soft-accordion-content cmo-filter-content" v-show="openFilters">
        <button class="cmo-search-btn" type="button" @click="handleSearch">
          BUSCAR
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="main-loader-container">
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
      <span class="cmo-loading-text">{{ loadingMsg }}</span>
    </div>

    <div class="soft-accordion cmo-accordion" v-if="hasSearched && !isLoading">
      <button class="soft-accordion-header cmo-accordion-header" type="button" @click="openResults = !openResults">
        <span>RELACIONES CMO-ACTIVIDAD</span>
        <span class="cmo-toggle">{{ openResults ? '−' : '+' }}</span>
      </button>
      <div class="soft-accordion-content cmo-grid-content" v-show="openResults">
        <GridCmoActividad
          :data="gridData"
          @edit-row="openEdit"
          @add-row="openAlta"
        />
      </div>
    </div>

    <EditCmoPopup
      :show="showEditPopup"
      :data="selectedForEdit"
      :position="popupPos"
      @close="showEditPopup = false"
      @update="handleUpdate"
    />

    <AltaCmoPopup
      :show="showAltaPopup"
      :position="popupPos"
      @close="showAltaPopup = false"
      @add-relations="handleNewRelations"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GridCmoActividad from './GridCmoActividad.vue'
import EditCmoPopup from '../popup/EditCmoPopup.vue'
import AltaCmoPopup from '../popup/AltaCmoPopup.vue'

const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)
const loadingMsg = ref('')

const showEditPopup = ref(false)
const showAltaPopup = ref(false)
const selectedForEdit = ref(null)
const popupPos = ref({ x: 0, y: 0 })
const gridData = ref([])

const baseCmoRows = [
  { cod_act: 'WS9035', desc_act: 'Instalar DECO secundario Flow en cte activo', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WS8035', desc_act: 'Se instaló DECO secundario Flow en cte activo', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '07/05/2025 10:27', activo: 'N', disabled: true },
  { cod_act: 'WS8035', desc_act: 'Se instaló DECO secundario Flow en cte activo', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '02/07/2025 22:27', activo: 'S', disabled: false },
  { cod_act: 'WS800122', desc_act: 'Se instaló DECO secundario Full IP', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '18/10/2024 12:08', activo: 'S', disabled: false },
  { cod_act: 'WS800018', desc_act: 'Se instaló DECO Full IP', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '18/10/2024 12:08', activo: 'S', disabled: false },
  { cod_act: 'WS7995', desc_act: 'Se instaló DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '07/05/2025 10:27', activo: 'N', disabled: true },
  { cod_act: 'WS7995', desc_act: 'Se instaló DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '02/07/2025 22:27', activo: 'S', disabled: false },
  { cod_act: 'WS7835', desc_act: 'Instalar DECO Flow en cte activo', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WS7795', desc_act: 'Instalar DECO Flow - Venta sin int', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WR9035', desc_act: 'Retirar DECO secundario Flow con baja de Cte', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WR8035', desc_act: 'Se retiró DECO secundario Flow con baja de cte', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '07/05/2025 10:27', activo: 'N', disabled: true },
  { cod_act: 'WR8035', desc_act: 'Se retiró DECO secundario Flow con baja de cte', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '02/07/2025 22:27', activo: 'S', disabled: false },
  { cod_act: 'WR800122', desc_act: 'Se retiró DECO secundario Full IP', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '18/10/2024 12:08', activo: 'S', disabled: false },
  { cod_act: 'WR800018', desc_act: 'Se retiró DECO Full IP', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '18/10/2024 12:08', activo: 'S', disabled: false },
  { cod_act: 'WR7995', desc_act: 'Se retiró DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '07/05/2025 10:27', activo: 'N', disabled: true },
  { cod_act: 'WR7995', desc_act: 'Se retiró DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '02/07/2025 22:27', activo: 'S', disabled: false },
  { cod_act: 'WR7835', desc_act: 'Retirar DECO Flow con baja de Cte', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WM9035', desc_act: 'Modificar a DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WM8035', desc_act: 'Se modificó a DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '07/05/2025 10:27', activo: 'N', disabled: true },
  { cod_act: 'WM8035', desc_act: 'Se modificó a DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '02/07/2025 22:27', activo: 'S', disabled: false },
  { cod_act: 'WM800122', desc_act: 'Se modificó a DECO secundario Full IP', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '18/10/2024 12:08', activo: 'S', disabled: false },
  { cod_act: 'WM800018', desc_act: 'Se modificó a DECO Full IP', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '18/10/2024 12:08', activo: 'S', disabled: false },
  { cod_act: 'WC9035', desc_act: 'Cambiar DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '22/07/2025 11:09', activo: 'S', disabled: false },
  { cod_act: 'WC8035', desc_act: 'Se cambió DECO secundario Flow', cod_s4: '0000001', cmo: 'NO HAY CMO', usu: 'FieldManager', fecha: '07/05/2025 10:27', activo: 'N', disabled: true },
  { cod_act: 'WCLTE', desc_act: 'Instalar Cablemodem LTE', cod_s4: '0000002', cmo: 'INST.D/CABLEMODEM LTE', usu: 'z002456', fecha: '19/06/2026 17:30', activo: 'S', disabled: false }
]

const buildCmoRows = () => Array.from({ length: 100 }, (_, index) => {
  const base = baseCmoRows[index % baseCmoRows.length]
  const generated = index >= baseCmoRows.length
  return {
    id: index + 1,
    cod_act: generated ? `${base.cod_act}${String(index + 1).padStart(2, '0')}`.slice(0, 9) : base.cod_act,
    desc_act: base.desc_act,
    cod_s4: index % 11 === 0 ? '5021497' : base.cod_s4,
    cmo: index % 11 === 0 ? 'INST.D/ACOMETIDA HFC' : base.cmo,
    usu: index % 7 === 0 ? 'z002456' : base.usu,
    fecha: base.fecha,
    activo: index % 9 === 1 ? 'N' : base.activo,
    disabled: index % 9 === 1 ? true : base.disabled
  }
})

const handleSearch = () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true
  loadingMsg.value = 'Buscando configuraciones CMO-Actividad en el servidor...'

  setTimeout(() => {
    gridData.value = buildCmoRows()
    isLoading.value = false
  }, 900)
}

const openEdit = (event, row) => {
  selectedForEdit.value = row
  popupPos.value = {
    x: event.clientX > window.innerWidth - 450 ? window.innerWidth - 450 : event.clientX,
    y: event.clientY > window.innerHeight - 300 ? window.innerHeight - 300 : event.clientY
  }
  showEditPopup.value = true
}

const openAlta = (event) => {
  popupPos.value = {
    x: event.clientX > window.innerWidth - 800 ? window.innerWidth - 850 : event.clientX + 20,
    y: event.clientY > window.innerHeight - 500 ? window.innerHeight - 550 : event.clientY + 20
  }
  showAltaPopup.value = true
}

const handleUpdate = (updatedRow) => {
  isLoading.value = true
  loadingMsg.value = 'Actualizando relación CMO-Actividad...'

  setTimeout(() => {
    const index = gridData.value.findIndex(item => item.id === updatedRow.id)
    if (index !== -1) {
      gridData.value[index].cmo = updatedRow.cmo
      gridData.value[index].fecha = new Date().toLocaleString('es-AR')
      gridData.value[index].usu = 'admin_user'
    }
    showEditPopup.value = false
    isLoading.value = false
  }, 900)
}

const handleNewRelations = (newItems) => {
  isLoading.value = true
  loadingMsg.value = 'Guardando nuevas relaciones CMO-Actividad...'

  setTimeout(() => {
    newItems.forEach((item, index) => {
      gridData.value.unshift({
        id: Date.now() + index,
        cod_act: item.actividad,
        desc_act: item.descripcion || 'Descripción genérica',
        cod_s4: item.cod_s4 || '0000001',
        cmo: item.cmo,
        usu: 'admin_user',
        fecha: new Date().toLocaleString('es-AR'),
        activo: 'S',
        disabled: false
      })
    })
    showAltaPopup.value = false
    isLoading.value = false
  }, 900)
}
</script>

<style scoped>
.cmo-page {
  width: 100%;
}

.cmo-accordion {
  border: 1px solid #d8d8d8;
  background: #ffffff;
  margin-bottom: 8px;
}

.cmo-accordion-header {
  width: 100%;
  min-height: 30px;
  border: 0;
  border-bottom: 1px solid #d8d8d8;
  background: #f7f7f7;
  color: #263238;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.cmo-toggle {
  font-size: 22px;
  line-height: 1;
  font-weight: 400;
}

.cmo-filter-content {
  text-align: center;
  padding: 26px 12px;
  border-left: 4px solid #00bcd4;
}

.cmo-grid-content {
  padding: 0;
  border-left: 4px solid #00bcd4;
}

.cmo-search-btn {
  min-width: 120px;
  border: 1px solid #00a9bd;
  border-radius: 20px;
  background: #00a9bd;
  color: #ffffff;
  padding: 9px 34px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease;
}

.cmo-search-btn:hover {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 4px 10px rgba(0, 143, 161, .22);
}

.cmo-loading-text {
  margin-top: 15px;
}
</style>
