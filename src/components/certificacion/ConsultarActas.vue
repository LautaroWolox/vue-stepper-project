<template>
  <div>
    <!-- VISTA PRINCIPAL DE BÚSQUEDA -->
    <div v-if="currentView === 'search'">
      <div class="soft-accordion">
        <div class="soft-accordion-header" @click="openFilters = !openFilters">
          <span><span class="material-icons">filter_alt</span> FILTROS DE BÚSQUEDA</span>
          <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
        </div>
        <div class="soft-accordion-content" v-show="openFilters">
          <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="form-group"><label>Provincia</label><select class="form-control" v-model="form.provincia"><option value=""></option><option v-for="prov in listas.provincias" :key="prov" :value="prov">{{ prov }}</option></select></div>
            <div class="form-group"><label>Contratista</label><select class="form-control" v-model="form.contratista"><option value=""></option><option v-for="cont in listas.contratistas" :key="cont" :value="cont">{{ cont }}</option></select></div>
            <div class="form-group"><label>Sociedad</label><select class="form-control" v-model="form.sociedad"><option value=""></option><option v-for="soc in listas.sociedades" :key="soc" :value="soc">{{ soc }}</option></select></div>
            <div class="form-group"><label>Tipo de Contrato</label><select class="form-control" v-model="form.tipo_contrato"><option value=""></option><option v-for="tipo in listas.tipos_contrato" :key="tipo" :value="tipo">{{ tipo }}</option></select></div>
          </div>
          <div class="form-grid" style="grid-template-columns: 1fr 1fr 2fr;">
            <div class="form-group"><label>Año</label><select class="form-control" v-model="form.anio"><option value=""></option><option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option></select></div>
            <div class="form-group"><label>Periodo</label><select class="form-control" v-model="form.periodo"><option value=""></option><option value="1">Del 16/06 al 15/07</option><option value="2">Del 16/07 al 15/08</option></select></div>
            <div class="form-group"><label>Estado</label><select class="form-control" v-model="form.estado"><option value=""></option><option value="En Curso">En Curso</option><option value="Certificada">Certificada</option></select></div>
          </div>
          <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group"><label>Acta</label><input type="text" class="form-control" v-model="form.acta"></div>
            <div class="form-group"><label>N° de OT</label><input type="text" class="form-control" v-model="form.nro_ot"></div>
          </div>
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eceff1;">
            <button class="btn" style="border-radius: 20px; padding: 10px 30px; background: #00bcd4; margin-right: 15px;" @click="handleSearch">BUSCAR</button>
            <button class="btn btn-danger" style="border-radius: 20px; padding: 10px 30px;" @click="resetForm">LIMPIAR</button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="main-loader-container">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/><rect x="55" y="95" width="10" height="25" fill="#78909C"/><rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/><rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/><rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/><g class="code-lines"><rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/><rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/><rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/><rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/></g><rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/><path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/><circle cx="150" cy="50" r="18" fill="#FFB74D"/><path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/><path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/><path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
        </svg>
        <span style="margin-top: 15px;">Recuperando Actas del sistema...</span>
      </div>

      <div class="soft-accordion" v-if="hasSearched && !isLoading">
        <div class="soft-accordion-header" @click="openResults = !openResults">
          <span><span class="material-icons">list</span> ACTAS</span>
          <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
        </div>
        <div class="soft-accordion-content" v-show="openResults" style="padding: 0;">
          <!-- Se emite la accion open-acta -->
          <GridActas :data="gridData" @open-acta="openDetalleActa" />
        </div>
      </div>
    </div>

    <!-- VISTA DE DETALLE DE ACTA (REEMPLAZA A LA BÚSQUEDA) -->
    <DetalleActa v-if="currentView === 'detail'" :acta="selectedActa" @volver="currentView = 'search'" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GridActas from './GridActas.vue'
import DetalleActa from './DetalleActa.vue'

const currentView = ref('search')
const selectedActa = ref(null)

const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)

const form = reactive({ provincia: '', contratista: '', sociedad: '', tipo_contrato: '', anio: '', periodo: '', estado: '', acta: '', nro_ot: '' })

const listas = {
  provincias: ['BUENOS AIRES', 'CAPITAL FEDERAL', 'CORDOBA', 'MENDOZA', 'SANTA FE'],
  contratistas: ['TELEWORLD ARGENTINA S.A.', 'AGB SRL', 'INTERCATV S.R.L.', 'TECHFAR-TEL S.R.L.', 'ALL VISION S.A.'],
  sociedades: ['Telecom Argentina S.A.', 'La Capital Cable S.A.'],
  tipos_contrato: ['Eventos', 'Eventos SMB', 'Instalación Poste FTTH']
}

const gridData = ref([])

const resetForm = () => { Object.keys(form).forEach(k => form[k] = ''); hasSearched.value = false; gridData.value = [] }

const handleSearch = () => {
  openFilters.value = false; hasSearched.value = true; isLoading.value = true
  setTimeout(() => { generateMockData(); isLoading.value = false }, 1200)
}

const generateMockData = () => {
  gridData.value = []
  for (let i = 1; i <= 60; i++) {
    gridData.value.push({
      id: i,
      nro_acta: `A${2700 + i}`,
      nd: 'NO', nc: 'NO',
      estado: 'En Curso',
      periodo: 'Del 16/06 al 15/07',
      anio: '2026',
      fecha_crea: '2026-06-26 15:12:00',
      fecha_cierre: '',
      contratista: listas.contratistas[i % 5],
      pais: 'ARGENTINA',
      provincia: 'BUENOS AIRES',
      region: 'AMBA',
      tipo_contrato: listas.tipos_contrato[i % 3],
      sociedad: 'Telecom Argentina',
      usuario: '',
      valoracion: ''
    })
  }
}

const openDetalleActa = (actaRow) => {
  selectedActa.value = actaRow
  currentView.value = 'detail'
}
</script>