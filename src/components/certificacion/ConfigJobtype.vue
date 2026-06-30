<template>
  <div class="jobtype-page">
    <div class="soft-accordion jobtype-accordion">
      <button class="soft-accordion-header jobtype-accordion-header" type="button" @click="openFilters = !openFilters">
        <span>FILTROS DE BÚSQUEDA</span>
        <span class="jobtype-toggle">{{ openFilters ? '−' : '+' }}</span>
      </button>
      <div class="soft-accordion-content jobtype-filter-content" v-show="openFilters">
        <button class="jobtype-search-btn" type="button" @click="handleSearch">
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
      <span class="jobtype-loading-text">{{ loadingMsg }}</span>
    </div>

    <div class="soft-accordion jobtype-accordion" v-if="hasSearched && !isLoading">
      <button class="soft-accordion-header jobtype-accordion-header" type="button" @click="openResults = !openResults">
        <span>RELACIONES JOBTYPE-CONTRATO</span>
        <span class="jobtype-toggle">{{ openResults ? '−' : '+' }}</span>
      </button>
      <div class="soft-accordion-content jobtype-grid-content" v-show="openResults">
        <GridJobtype
          :data="gridData"
          @edit-row="openEdit"
          @add-row="openAlta"
        />
      </div>
    </div>

    <EditJobtypePopup
      :show="showEditPopup"
      :data="selectedForEdit"
      :position="popupPos"
      @close="showEditPopup = false"
      @update="handleUpdate"
    />

    <AltaJobtypePopup
      :show="showAltaPopup"
      :position="popupPos"
      @close="showAltaPopup = false"
      @add-relations="handleNewRelations"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GridJobtype from './GridJobtype.vue'
import EditJobtypePopup from '../popup/EditJobtypePopup.vue'
import AltaJobtypePopup from '../popup/AltaJobtypePopup.vue'

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

const baseJobtypeRows = [
  { cod: 'SHDA0', tarea: 'SMB - ALTAS HFC', contrato: 'Eventos SMB', usu: 'z002456', fecha: '19/06/2026 17:30', activo: 'S', pais: 'ARG/UY' },
  { cod: 'SAMAW', tarea: 'DOM - TRIAL SAM AMAZON WEB SERVICE', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RTMPI', tarea: 'RED - MPI - Tarea General de MPI', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RTHFC', tarea: 'RED - HFC - Tarea General de Redes', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSRUN', tarea: 'DRC - SRE REPARAR DEGRADACION POR ENCIMA DEL UMBRAL', contrato: 'Materiales', usu: 'FMM573795', fecha: '13/12/2024 13:04', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSRRN', tarea: 'RED - SERVICE REVERSA', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSRNN', tarea: 'DRC - SRE REPARAR PROBLEMA DE NIVELES', contrato: 'BBI Siniestros', usu: 'z002456', fecha: '15/12/2025 14:31', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSRIN', tarea: 'DRC - SRE REPARAR DEGRADACION DE SENAL INTERMITENTE', contrato: 'BBI Siniestros', usu: 'z002456', fecha: '15/12/2025 14:31', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSRCN', tarea: 'RED - SERVICE DE RED CLIENTE', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSDRN', tarea: 'RED - SRC DEGRADACION REITERADA', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSDFN', tarea: 'RED - SRC DEGRADACION FTTH', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSDDN', tarea: 'DRC - SRE REPARAR DEGRADACION EN DOWNSTREAM', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSCSN', tarea: 'DRC - SRC TAP SIN SENAL', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSCRN', tarea: 'RED - SRC CAIDA REITERADA', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RSCPN', tarea: 'DRC - SRC TAP CON PROBLEMAS DE SENAL', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRVUN', tarea: 'RED - REL RELEVAMIENTO / VERIFICACION (URGENTE)', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRVSN', tarea: 'RED - REL VERIFICAR SERVIDUMBRE', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRVCN', tarea: 'RED - REL VERIFICAR RECLAMO COMPANIA ELECTRICA', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRRVN', tarea: 'RED - REL RELEVAMIENTO / VERIFICACION', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRRRN', tarea: 'RED - RELEVAMIENTO', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRRMN', tarea: 'RED - REL VERIFICAR RECLAMO MUNICIPAL', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRMPN', tarea: 'RED - REL RELEVAMIENTO / VERIFICACION (Mecanico Programado)', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRFUN', tarea: 'RED - REL RELEVAMIENTO FUGA URGENTE', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RRFNN', tarea: 'RED - REL RELEVAMIENTO FUGA', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { cod: 'RPVTN', tarea: 'RED - MPR VARIACION DE TX', contrato: 'Eventos', usu: 'u573795', fecha: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' }
]

const buildJobtypeRows = () => Array.from({ length: 100 }, (_, index) => {
  const base = baseJobtypeRows[index % baseJobtypeRows.length]
  const suffix = index < baseJobtypeRows.length ? '' : String(index + 1).padStart(2, '0')
  return {
    id: index + 1,
    cod: suffix ? `${base.cod}${suffix}`.slice(0, 8) : base.cod,
    tarea: base.tarea,
    contrato: index % 9 === 0 ? 'Materiales' : base.contrato,
    usu: index % 4 === 0 ? 'z002456' : base.usu,
    fecha: base.fecha,
    activo: index % 17 === 0 ? 'N' : base.activo,
    pais: index % 12 === 0 ? 'ARG' : base.pais
  }
})

const handleSearch = () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true
  loadingMsg.value = 'Buscando relaciones Jobtype-Contrato en el servidor...'

  setTimeout(() => {
    gridData.value = buildJobtypeRows()
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
  loadingMsg.value = 'Actualizando contrato...'

  setTimeout(() => {
    const index = gridData.value.findIndex(item => item.id === updatedRow.id)
    if (index !== -1) {
      gridData.value[index].contrato = updatedRow.contrato
      gridData.value[index].fecha = new Date().toLocaleString('es-AR')
    }
    showEditPopup.value = false
    isLoading.value = false
  }, 900)
}

const handleNewRelations = (newItems) => {
  isLoading.value = true
  loadingMsg.value = 'Guardando nuevas relaciones...'

  setTimeout(() => {
    newItems.forEach((item, index) => {
      gridData.value.unshift({
        id: Date.now() + index,
        cod: item.cod,
        tarea: item.tarea,
        contrato: item.contrato,
        usu: 'admin_user',
        fecha: new Date().toLocaleString('es-AR'),
        activo: 'S',
        pais: item.pais
      })
    })
    showAltaPopup.value = false
    isLoading.value = false
  }, 900)
}
</script>

<style scoped>
.jobtype-page {
  width: 100%;
}

.jobtype-accordion {
  border: 1px solid #d8d8d8;
  background: #ffffff;
  margin-bottom: 8px;
}

.jobtype-accordion-header {
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

.jobtype-toggle {
  font-size: 22px;
  line-height: 1;
  font-weight: 400;
}

.jobtype-filter-content {
  text-align: center;
  padding: 26px 12px;
  border-left: 4px solid #00bcd4;
}

.jobtype-grid-content {
  padding: 0;
  border-left: 4px solid #00bcd4;
}

.jobtype-search-btn {
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

.jobtype-search-btn:hover {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 4px 10px rgba(0, 143, 161, .22);
}

.jobtype-loading-text {
  margin-top: 15px;
}
</style>
