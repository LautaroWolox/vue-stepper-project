<template>
  <div class="nota-credito-page">
    <div v-if="currentView === 'search'">
      <section class="fm-panel">
        <div class="fm-panel-header" @click="openFilters = !openFilters">
          <span>FILTROS DE BÚSQUEDA</span>
          <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
        </div>

        <div class="fm-panel-content filters-content" v-show="openFilters">
          <div class="filters-row first-row">
            <div class="fm-field">
              <label>Provincia</label>
              <select class="form-control" v-model="form.provincia">
                <option value=""></option>
                <option v-for="provincia in provincias" :key="provincia" :value="provincia">{{ provincia }}</option>
              </select>
            </div>
            <div class="fm-field"><label>Contratista Acta</label><select class="form-control" v-model="form.contratista"><option value=""></option><option v-for="item in contratistas" :key="item" :value="item">{{ item }}</option></select></div>
            <div class="fm-field"><label>Sociedad Acta</label><select class="form-control" v-model="form.sociedad"><option value=""></option><option v-for="item in sociedades" :key="item" :value="item">{{ item }}</option></select></div>
            <div class="fm-field"><label>Tipo de Contrato</label><select class="form-control" v-model="form.tipo_contrato"><option value=""></option><option v-for="item in tiposContrato" :key="item" :value="item">{{ item }}</option></select></div>
          </div>

          <div class="filters-row second-row">
            <div class="fm-field small-field"><label>Año</label><select class="form-control" v-model="form.anio"><option value=""></option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option></select></div>
            <div class="fm-field"><label>Periodo</label><select class="form-control" v-model="form.periodo"><option value=""></option><option value="Del 16/05 al 15/06">Del 16/05 al 15/06</option><option value="Del 16/03 al 15/04">Del 16/03 al 15/04</option><option value="Del 16/01 al 15/02">Del 16/01 al 15/02</option><option value="Del 16/11 al 15/12">Del 16/11 al 15/12</option></select></div>
            <div class="fm-field"><label>Estado</label><select class="form-control" v-model="form.estado"><option value=""></option><option value="En Curso">En Curso</option><option value="Cerrado">Cerrado</option></select></div>
          </div>

          <div class="filters-row third-row">
            <div class="fm-field"><label>Nota de Credito</label><input type="text" class="form-control" v-model.trim="form.nota_credito" /></div>
            <div class="fm-field"><label>N° de OT</label><input type="text" class="form-control" v-model.trim="form.nro_ot" /></div>
            <div class="fm-field"><label>Nro Acta Asociada</label><input type="text" class="form-control" v-model.trim="form.acta_asociada" /></div>
          </div>

          <div class="filters-actions">
            <button class="btn-cyan" type="button" @click="handleSearch" :disabled="isLoading">{{ isLoading ? 'BUSCANDO...' : 'BUSCAR' }}</button>
            <button class="btn-cyan-outline" type="button" @click="resetForm">LIMPIAR</button>
          </div>
        </div>
      </section>

      <div v-if="isLoading" class="main-loader-container">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/><rect x="55" y="95" width="10" height="25" fill="#78909C"/><rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/><rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/><rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/>
        </svg>
        <span>Recuperando Notas de Crédito...</span>
      </div>

      <section class="fm-panel" v-if="hasSearched && !isLoading">
        <div class="fm-panel-header" @click="openResults = !openResults">
          <span>NOTAS DE CREDITO</span>
          <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
        </div>
        <div class="fm-panel-content results-content" v-show="openResults">
          <GridNotasCredito :data="gridData" file-name="notas_credito.xls" @open-nota="openDetalleNota" />
        </div>
      </section>
    </div>

    <DetalleActaCredito v-if="currentView === 'detail'" :nota="selectedNota" tipo-nota="credito" @volver="currentView = 'search'" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import GridNotasCredito from './GridNotasCredito.vue'
import DetalleActaCredito from './DetalleActaCredito.vue'
import { searchNotasCredito } from '../../services/certificacionService.js'
import { provinciasCertificacion } from '../../mocks/certificacionMock.js'

const currentView = ref('search')
const selectedNota = ref(null)
const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)
const gridData = ref([])

const provincias = provinciasCertificacion
const contratistas = ['NET AND WORK S.A.', 'GREENIN S.A.S.', 'BULLS', 'DUNKEL', 'ALL VISION S.A.', 'INTERCATV S.R.L.', 'ADOBE CONSTRUCCIONES', 'CONECTAR S.R.L.', 'DIGITAL OESTE S.R.L.', 'AYKO S.A.']
const sociedades = ['Telecom Argentina S.A.', 'Núcleo S.A.', 'La Capital Cable S.A.', 'Bersabel S.A.']
const tiposContrato = ['Eventos', 'WIRELESS', 'DTH', 'Eventos SMB', 'Siniestros']

const emptyForm = () => ({ provincia: 'BUENOS AIRES', contratista: '', sociedad: '', tipo_contrato: '', anio: '', periodo: '', estado: '', nota_credito: '', nro_ot: '', acta_asociada: '' })
const form = reactive(emptyForm())

const resetForm = () => {
  Object.assign(form, emptyForm())
  hasSearched.value = false
  gridData.value = []
  openFilters.value = true
  openResults.value = true
}

const handleSearch = async () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true
  try {
    gridData.value = await searchNotasCredito({ ...form })
  } finally {
    isLoading.value = false
  }
}

const openDetalleNota = (notaRow) => {
  selectedNota.value = notaRow
  currentView.value = 'detail'
}
</script>

<style scoped>
.nota-credito-page { color: #111; font-size: 14px; }
.fm-panel { border: 1px solid #d8d8d8; background: #fff; margin-bottom: 8px; }
.fm-panel-header { height: 32px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; background: #f7f7f7; border-bottom: 1px solid #d8d8d8; cursor: pointer; }
.fm-panel-header .material-icons { color: #666; font-size: 20px; }
.filters-content { border-left: 4px solid #00bcd4; }
.filters-row { display: grid; gap: 18px; padding: 12px 20px 14px; border-bottom: 1px solid #d8d8d8; }
.first-row { grid-template-columns: repeat(4, minmax(190px, 1fr)); }
.second-row { grid-template-columns: 140px minmax(220px, 1fr) minmax(220px, 1fr) 1fr; }
.third-row { grid-template-columns: repeat(3, minmax(220px, 1fr)) 1fr; }
.fm-field label { display: block; margin-bottom: 7px; font-weight: 700; font-size: 13px; }
.form-control { width: 100%; height: 30px; border: 1px solid #bdbdbd; border-radius: 3px; padding: 4px 8px; background: #fff; }
.filters-actions { display: flex; justify-content: center; gap: 8px; padding: 18px 0 22px; }
.btn-cyan, .btn-cyan-outline { border-radius: 18px; padding: 8px 18px; font-size: 13px; cursor: pointer; }
.btn-cyan { background: #00a9bd; border: 1px solid #00a9bd; color: #fff; }
.btn-cyan-outline { background: #fff; border: 1px solid #00a9bd; color: #00a9bd; }
.results-content { padding: 0; }
.main-loader-container { min-height: 180px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #00838f; font-weight: 700; }
.svg-coder { width: 130px; }
@media (max-width: 980px) { .first-row, .second-row, .third-row { grid-template-columns: repeat(2, minmax(180px, 1fr)); } }
@media (max-width: 560px) { .first-row, .second-row, .third-row { grid-template-columns: 1fr; padding: 12px; } .filters-actions { flex-direction: column; padding: 12px; } .btn-cyan, .btn-cyan-outline { width: 100%; } }
</style>
