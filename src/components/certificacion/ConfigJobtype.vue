<template>
  <div>
    <!-- Acordeón 1: Filtro -->
    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openFilters = !openFilters">
        <span><span class="material-icons">filter_alt</span> FILTROS DE BÚSQUEDA</span>
        <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openFilters" style="text-align: center; padding: 30px;">
        <button class="btn" style="border-radius: 20px; padding: 10px 40px; background: #00bcd4; font-size: 14px;" @click="handleSearch">
          BUSCAR
        </button>
      </div>
    </div>

    <!-- PANTALLA DE CARGA (TIPITO TIPEANDO EN EL MEDIO) -->
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
      <span style="margin-top: 15px;">{{ loadingMsg }}</span>
    </div>

    <!-- Acordeón 2: Grilla -->
    <div class="soft-accordion" v-if="hasSearched && !isLoading">
      <div class="soft-accordion-header" @click="openResults = !openResults">
        <span><span class="material-icons">list</span> RELACIONES JOBTYPE-CONTRATO</span>
        <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openResults" style="padding: 0;">
        <GridJobtype 
          :data="gridData" 
          @edit-row="openEdit"
          @add-row="openAlta"
        />
      </div>
    </div>

    <!-- Popups -->
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

const handleSearch = () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true
  loadingMsg.value = 'Buscando relaciones Jobtype-Contrato en el servidor...'

  setTimeout(() => {
    // 100 REGISTROS REALES DEL EXCEL
    gridData.value = [{"id": 1, "cod": "SHDA0", "tarea": "SMB - ALTAS HFC", "contrato": "Eventos SMB", "usu": "z002456", "fecha": "19/06/2026 17:30", "activo": "S", "pais": "ARG/UY"}, {"id": 2, "cod": "SAMAW", "tarea": "DOM - TRIAL SAM AMAZON WEB SERVICE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 3, "cod": "RTMPI", "tarea": "RED - MPI - Tarea General de MPI", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 4, "cod": "RTHFC", "tarea": "RED - HFC - Tarea General de Redes", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 5, "cod": "RSRUN", "tarea": "DRC - SRE REPARAR DEGRADACION POR ENCIMA DEL UMBRAL", "contrato": "Materiales", "usu": "FMM573795", "fecha": "13/12/2024 13:04", "activo": "S", "pais": "ARG/UY"}, {"id": 6, "cod": "RSRRN", "tarea": "RED - SERVICE REVERSA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 7, "cod": "RSRNN", "tarea": "DRC - SRE REPARAR PROBLEMA DE NIVELES", "contrato": "BBI Siniestros", "usu": "z002456", "fecha": "15/12/2025 14:31", "activo": "S", "pais": "ARG/UY"}, {"id": 8, "cod": "RSRIN", "tarea": "DRC - SRE REPARAR DEGRADACION DE SENAL INTERMITENTE", "contrato": "BBI Siniestros", "usu": "z002456", "fecha": "15/12/2025 14:31", "activo": "S", "pais": "ARG/UY"}, {"id": 9, "cod": "RSRCN", "tarea": "RED - SERVICE DE RED CLIENTE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 10, "cod": "RSDRN", "tarea": "RED - SRC DEGRADACION REITERADA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 11, "cod": "RSDFN", "tarea": "RED - SRC DEGRADACION FTTH", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 12, "cod": "RSDDN", "tarea": "DRC - SRE REPARAR DEGRADACION EN DOWNSTREAM", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 13, "cod": "RSCSN", "tarea": "DRC - SRC TAP SIN SENAL", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 14, "cod": "RSCRN", "tarea": "RED - SRC CAIDA REITERADA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 15, "cod": "RSCPN", "tarea": "DRC - SRC TAP CON PROBLEMAS DE SENAL", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 16, "cod": "RRVUN", "tarea": "RED - REL RELEVAMIENTO / VERIFICACION (URGENTE)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 17, "cod": "RRVSN", "tarea": "RED - REL VERIFICAR SERVIDUMBRE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 18, "cod": "RRVCN", "tarea": "RED - REL VERIFICAR RECLAMO COMPANIA ELECTRICA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 19, "cod": "RRRVN", "tarea": "RED - REL RELEVAMIENTO / VERIFICACION", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 20, "cod": "RRRRN", "tarea": "RED - RELEVAMIENTO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 21, "cod": "RRRMN", "tarea": "RED - REL VERIFICAR RECLAMO MUNICIPAL", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 22, "cod": "RRMPN", "tarea": "RED - REL RELEVAMIENTO / VERIFICACION (Mecanico Programado)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 23, "cod": "RRFUN", "tarea": "RED - REL RELEVAMIENTO FUGA URGENTE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 24, "cod": "RRFNN", "tarea": "RED - REL RELEVAMIENTO FUGA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 25, "cod": "RPVTN", "tarea": "RED - MPR VARIACION DE TX", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 26, "cod": "RPSRN", "tarea": "RED - MPR SALUD DE RED", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 27, "cod": "RPSCN", "tarea": "RED - MPR SECTOR OPERATIVO CM FUERA DE RANGO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 28, "cod": "RPPPN", "tarea": "RED - MANTENIMIENTO PROACTIVO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 29, "cod": "RPPEN", "tarea": "RED - MPR PRE-ECUALIZACION", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 30, "cod": "RPINN", "tarea": "RED - MPR INDISPONIBILIDAD", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 31, "cod": "RPFVN", "tarea": "DRC - VERIFICAR CORTE DE RED ELECTRICA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 32, "cod": "RPFUN", "tarea": "RED - MPR FUGA DE RED URGENTE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 33, "cod": "RPFNB", "tarea": "DRC - PDF ALARMA FUENTE NO BATTERIES", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 34, "cod": "RPFBN", "tarea": "RED - MPR FULLBAND", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 35, "cod": "RPDFN", "tarea": "RED - PREDICTIVO DE FALLA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 36, "cod": "RPCNN", "tarea": "RED - MPR CERTIFICACION DE NODOS", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 37, "cod": "RPCFN", "tarea": "RED - MPR CERTIFICACION DE FUENTES", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 38, "cod": "RPCCN", "tarea": "RED - MPR CUADRA CM FUERA DE RANGO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 39, "cod": "RPACN", "tarea": "RED - MPR ACTIVO RED CM FUERA DE RANGO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 40, "cod": "RPABN", "tarea": "RED - MPR AUTONOMIA DE BATERIAS", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 41, "cod": "RMS03", "tarea": "RED - MX - MFS Falla en Sonda", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 42, "cod": "RMS02", "tarea": "RED - MX - Mant. Proactivo Altura", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 43, "cod": "RMS01", "tarea": "RED - MX - Relevamiento", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 44, "cod": "RMPNN", "tarea": "RED - MPI MANTENIMIENTO PREVENTIVO DE NODOS", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 45, "cod": "RMPIN", "tarea": "RED - MPI", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 46, "cod": "RMPFR", "tarea": "RED - MPR FUGA EN RED", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 47, "cod": "RMPFN", "tarea": "RED - MPI MANTENIMIENTO PREVENTIVO DE FUENTES", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 48, "cod": "RMPEN", "tarea": "RED - MPI MANTENIMIENTO PREVENTIVO DE EDIFICIOS", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 49, "cod": "RMPBN", "tarea": "RED - MPI MANTENIMIENTO PREVENTIVO DE BACKBONE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 50, "cod": "RMPAN", "tarea": "RED - MPI MANTENIMIENTO PREVENTIVO DE AMPLIFICADORES", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 51, "cod": "RMMPN", "tarea": "RED - MME MODIFICACION / REPARACION DE RED (PASIVO)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 52, "cod": "RMMON", "tarea": "RED - MME MODIFICACION / REPARACION DE RED (POSTACION)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 53, "cod": "RMMMN", "tarea": "RED - MANTENIMIENTO MECANICO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 54, "cod": "RMMHN", "tarea": "RED - MME MODIFICACION / REPARACION DE RED (HERRAJE)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 55, "cod": "RMMCN", "tarea": "RED - MME MODIFICACION / REPARACION DE RED (CABLEADO)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 56, "cod": "RMMAN", "tarea": "RED - MME MODIFICACION / REPARACION DE RED (ACTIVO)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 57, "cod": "RMM02", "tarea": "RED - MX - MPE - GE MovilT", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 58, "cod": "RMM01", "tarea": "RED - MX - MPI", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 59, "cod": "RMI05", "tarea": "RED - MX - MFC Indisponibilidad de Nodo (2G/3G/4G)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 60, "cod": "RMI04", "tarea": "RED - MX - Mant. Correctivo Multiples Sitios", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 61, "cod": "RMI03", "tarea": "RED - MX - Mant. Correctivo Sitio", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 62, "cod": "RMI02", "tarea": "RED - MX - Mant. Correctivo Ex", "contrato": "Desarraigos Redes", "usu": "u908938", "fecha": "26/06/2025 08:45", "activo": "S", "pais": "ARG/UY"}, {"id": 63, "cod": "RMI01", "tarea": "RED - MX - Mant. Correctivo Celdas", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 64, "cod": "RMEEN", "tarea": "RED - MANTENIMIENTO ELECTRICO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 65, "cod": "RMD04", "tarea": "RED - MX - Mant. Correctivo Altura", "contrato": "Mantenimiento Correctivo", "usu": "FMM573795", "fecha": "09/01/2025 14:11", "activo": "S", "pais": "ARG/UY"}, {"id": 66, "cod": "RMD03", "tarea": "RED - MX - MDS Degradacion de Servicio por ROE", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 67, "cod": "RMD02", "tarea": "RED - MX - MME Ajuste de Sistema Irradiante (en Torre)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 68, "cod": "RMD01", "tarea": "RED - MX - MDS Degradacion de Servicio", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 69, "cod": "RMA20", "tarea": "RED - MX - MME Modificacion / Reparacion (Tablero)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 70, "cod": "RMA19", "tarea": "RED - MX - MME Modificacion / Reparacion (G.E.)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 71, "cod": "RMA18", "tarea": "RED - MX - MME Modificacion / Reparacion (Bateria)", "contrato": "Eventos", "usu": "u606550", "fecha": "07/07/2025 16:02", "activo": "S", "pais": "ARG/UY"}, {"id": 72, "cod": "RMA17", "tarea": "RED - MX - Mant. Proactivo", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 73, "cod": "RMA16", "tarea": "RED - MX - AGM Afectacion Potencial - G.E. en Marcha", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 74, "cod": "RMA15", "tarea": "RED - MX - MME Modificacion / Reparacion (A.A. / RECT)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 75, "cod": "RMA14", "tarea": "RED - MX - DTB Degradacion Tension de Bateria - UPS", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 76, "cod": "RMA13", "tarea": "RED - MX - DEC Degradacion Equipo - Climatizacion", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 77, "cod": "RMA12", "tarea": "RED - MX - Banco de Bateria en Falla (Ausente/Desconectado)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 78, "cod": "RMA11", "tarea": "RED - MX - VAS Verificar Alarma de Seguridad", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 79, "cod": "RMA10", "tarea": "RED - MX - RME Colocar / Cambiar Baterias", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 80, "cod": "RMA09", "tarea": "RED - MX - MVE Verificar Corte de Energia Electrica", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 81, "cod": "RMA08", "tarea": "RED - MX - MME Realizar Tareas de Desmonte", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 82, "cod": "RMA07", "tarea": "RED - MX - MME Modificacion / Reparacion (Postacion)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 83, "cod": "RMA06", "tarea": "RED - MX - MME Modificacion / Reparacion (Pasivo)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 84, "cod": "RMA05", "tarea": "RED - MX - MME Modificacion / Reparacion (Herraje)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 85, "cod": "RMA04", "tarea": "RED - MX - MME Modificacion / Reparacion (en Torre)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 86, "cod": "RMA03", "tarea": "RED - MX - MME Modificacion / Reparacion (Cableado)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 87, "cod": "RMA02", "tarea": "RED - MX - Mant. Mecanico", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 88, "cod": "RMA01", "tarea": "RED - MX - SINIESTRO", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 89, "cod": "RIMFN", "tarea": "RED - INTERFERENCIA MASIVA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 90, "cod": "RIMDN", "tarea": "DRC - IMA REPARAR IMAGEN DEFECTUOSA", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 91, "cod": "RHS04", "tarea": "RED - HFC - REL Verificar Servidumbre", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 92, "cod": "RHS03", "tarea": "RED - HFC - REL Verificar Reclamo Municipal", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 93, "cod": "RHS02", "tarea": "RED - HFC - REL Verificar Reclamo Compañia Electrica", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 94, "cod": "RHS01", "tarea": "RED - Relevamiento", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 95, "cod": "RHS00", "tarea": "RED - HFC - Sin Afectacion", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 96, "cod": "RHM06", "tarea": "RED - HFC - Mant. Mecanico Programado", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 97, "cod": "RHM05", "tarea": "RED - HFC - MPI Corte de Servicio por Mantenimiento", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 98, "cod": "RHM04", "tarea": "RED - HFC - REL RXO Relevamiento/Verificación (Mec.Prog RXO)", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 99, "cod": "RHM03", "tarea": "RED - HFC - MPI Fuentes", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}, {"id": 100, "cod": "RHM02", "tarea": "RED - HFC - MPI Mantenimiento Preventivo de Amplificadores", "contrato": "Eventos", "usu": "u573795", "fecha": "22/07/2025 11:09", "activo": "S", "pais": "ARG/UY"}]
    
    isLoading.value = false
  }, 1500)
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
  }, 1200)
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
  }, 1200)
}
</script>