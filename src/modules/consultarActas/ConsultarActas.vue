<template>
  <div class="consulta-actas-page">
    <div v-if="currentView === 'search'">
      <section class="fm-panel">
        <div class="fm-panel-header" @click="openFilters = !openFilters"><span>FILTROS DE BÚSQUEDA</span><span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span></div>
        <div class="fm-panel-content filters-content" v-show="openFilters">
          <div class="filters-row first-row">
            <div class="fm-field"><label>Provincia</label><select class="form-control" v-model="form.provincia"><option value=""></option><option v-for="prov in listas.provincias" :key="prov" :value="prov">{{ prov }}</option></select></div>
            <div class="fm-field"><label>Contratista Acta</label><select class="form-control" v-model="form.contratista"><option value=""></option><option v-for="cont in listas.contratistas" :key="cont" :value="cont">{{ cont }}</option></select></div>
            <div class="fm-field"><label>Sociedad Acta</label><select class="form-control" v-model="form.sociedad"><option value=""></option><option v-for="soc in listas.sociedades" :key="soc" :value="soc">{{ soc }}</option></select></div>
            <div class="fm-field"><label>Tipo de Contrato</label><select class="form-control" v-model="form.tipo_contrato"><option value=""></option><option v-for="tipo in listas.tipos_contrato" :key="tipo" :value="tipo">{{ tipo }}</option></select></div>
          </div>
          <div class="filters-row second-row">
            <div class="fm-field small-field"><label>Año</label><select class="form-control" v-model="form.anio"><option value=""></option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option></select></div>
            <div class="fm-field"><label>Periodo</label><select class="form-control" v-model="form.periodo"><option value=""></option><option value="1">Del 16/06 al 15/07</option><option value="2">Del 16/07 al 15/08</option><option value="3">Del 16/05 al 15/06</option><option value="4">Del 16/03 al 15/04</option></select></div>
            <div class="fm-field"><label>Estado</label><select class="form-control" v-model="form.estado"><option value=""></option><option value="En Curso">En Curso</option><option value="Certificada">Certificada</option><option value="Cerrado">Cerrado</option></select></div>
          </div>
          <div class="filters-row third-row"><div class="fm-field"><label>Acta</label><input type="text" class="form-control" v-model.trim="form.acta"></div><div class="fm-field"><label>N° de OT</label><input type="text" class="form-control" v-model.trim="form.nro_ot"></div></div>
          <div class="filters-actions"><button class="btn-cyan" type="button" @click="handleSearch" :disabled="isLoading"><span class="material-icons">search</span>{{ isLoading ? 'BUSCANDO...' : 'BUSCAR' }}</button><button class="btn-cyan-outline" type="button" @click="resetForm"><span class="material-icons">sort</span>LIMPIAR</button></div>
        </div>
      </section>
      <FmTypingLoader v-if="isLoading" title="Recuperando Actas" message="Consultando datos y preparando la grilla..." />
      <section class="fm-panel" v-if="hasSearched && !isLoading"><div class="fm-panel-header" @click="openResults = !openResults"><span>ACTAS</span><span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span></div><div class="fm-panel-content results-content" v-show="openResults"><Tabla :data="gridData" @open-acta="openDetalleActa" /></div></section>
    </div>
    <DetalleActa v-if="currentView === 'detail'" :acta="selectedActa" @volver="currentView = 'search'" />
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import FmTypingLoader from '../../components/shared/FmTypingLoader.vue'
import Tabla from './components/Tabla.vue'
import DetalleActa from './components/DetalleActa.vue'
import { searchActas } from '../../services/certificacionService.js'
import { provinciasCertificacion } from '../../mocks/certificacionMock.js'
const currentView = ref('search')
const selectedActa = ref(null)
const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)
const gridData = ref([])
const listas = { provincias: provinciasCertificacion, contratistas: ['TELEWORLD ARGENTINA S.A.', 'AGB SRL', 'INTERCATV S.R.L.', 'TECHFAR-TEL S.R.L.', 'ALL VISION S.A.', 'NET AND WORK S.A.', 'GREENIN S.A.S.', 'BULLS', 'DUNKEL'], sociedades: ['Telecom Argentina S.A.', 'La Capital Cable S.A.', 'Núcleo S.A.', 'Bersabel S.A.'], tipos_contrato: ['Eventos', 'Eventos SMB', 'Instalación Poste FTTH', 'WIRELESS', 'DTH', 'Siniestros'] }
const emptyForm = () => ({ provincia: 'BUENOS AIRES', contratista: '', sociedad: '', tipo_contrato: '', anio: '', periodo: '', estado: '', acta: '', nro_ot: '' })
const form = reactive(emptyForm())
const resetForm = () => { Object.assign(form, emptyForm()); hasSearched.value = false; gridData.value = []; selectedActa.value = null; currentView.value = 'search'; openFilters.value = true; openResults.value = true }
const handleSearch = async () => { openFilters.value = false; hasSearched.value = true; isLoading.value = true; try { gridData.value = await searchActas({ ...form }, listas) } finally { isLoading.value = false } }
const openDetalleActa = actaRow => { selectedActa.value = actaRow; currentView.value = 'detail' }
</script>
<style scoped>
.consulta-actas-page{color:#111;font-size:14px}.fm-panel{border:1px solid #d8d8d8;background:#fff;margin-bottom:8px}.fm-panel-header{height:32px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#f7f7f7;border-bottom:1px solid #d8d8d8;cursor:pointer;font-size:14px;font-weight:400}.fm-panel-header .material-icons{color:#666;font-size:20px}.filters-content{border-left:4px solid #00bcd4}.filters-row{display:grid;gap:18px;padding:12px 20px 14px;border-bottom:1px solid #d8d8d8}.first-row{grid-template-columns:repeat(4,minmax(190px,1fr))}.second-row{grid-template-columns:140px minmax(220px,1fr) minmax(220px,1fr) 1fr}.third-row{grid-template-columns:repeat(2,minmax(220px,1fr)) 2fr}.fm-field label{display:block;margin-bottom:7px;font-weight:700;font-size:13px}.form-control{width:100%;height:30px;border:1px solid #bdbdbd;border-radius:3px;padding:4px 8px;background:#fff;font-size:13px}.form-control:focus{outline:none;border-color:#00bcd4;box-shadow:0 0 0 2px rgba(0,188,212,.14)}.filters-actions{display:flex;justify-content:center;gap:8px;padding:18px 0 22px}.btn-cyan,.btn-cyan-outline{height:32px;min-width:107px;display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:4px;padding:0 16px;font-size:12px;font-weight:500;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.12)}.btn-cyan{background:#00a9bd;border:1px solid #00a9bd;color:#fff}.btn-cyan-outline{background:#fff;border:1px solid #00a9bd;color:#00a9bd}.results-content{padding:0}@media(max-width:980px){.first-row,.second-row,.third-row{grid-template-columns:repeat(2,minmax(180px,1fr))}}@media(max-width:560px){.first-row,.second-row,.third-row{grid-template-columns:1fr;padding:12px}.filters-actions{flex-direction:column;padding:12px}.btn-cyan,.btn-cyan-outline{width:100%}}
</style>