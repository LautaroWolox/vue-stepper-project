<template>
  <div class="nota-debito-page">
    <div v-if="currentView === 'search'">
      <section class="fm-panel">
        <div class="fm-panel-header" @click="openFilters = !openFilters"><span>FILTROS DE BÚSQUEDA</span><span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span></div>
        <div v-show="openFilters" class="filters-content">
          <div class="filters-grid">
            <div class="field span-3"><label>Provincia</label><FmTurquoiseSelect v-model="form.provincia" :options="provinciaOptions" /></div>
            <div class="field span-3"><label>Contratista Acta</label><FmTurquoiseSelect v-model="form.contratista" :options="contratistaOptions" /></div>
            <div class="field span-3"><label>Sociedad Acta</label><FmTurquoiseSelect v-model="form.sociedad" :options="sociedadOptions" /></div>
            <div class="field span-3"><label>Tipo de Contrato</label><FmTurquoiseSelect v-model="form.tipo_contrato" :options="tipoContratoOptions" /></div>
            <div class="field span-2"><label>Año</label><FmTurquoiseSelect v-model="form.anio" :options="anioOptions" /></div>
            <div class="field span-2"><label>Periodo</label><FmTurquoiseSelect v-model="form.periodo" :options="periodoOptions" :disabled="!form.anio" /></div>
            <div class="field span-2"><label>Estado</label><FmTurquoiseSelect v-model="form.estado" :options="estadoOptions" /></div>
            <div class="field span-2"><label>Nota de Debito</label><input v-model.trim="form.nota_debito" /></div>
            <div class="field span-2"><label>N° de OT</label><input v-model.trim="form.nro_ot" /></div>
            <div class="field span-2"><label>Nro Acta Asociada</label><input v-model.trim="form.acta_asociada" /></div>
          </div>
          <div class="actions"><button class="primary" @click="buscar"><span class="material-icons">search</span>BUSCAR</button><button class="outline" @click="limpiar"><span class="material-icons">sort</span>LIMPIAR</button></div>
        </div>
      </section>
      <FmTypingLoader v-if="loading" title="Recuperando Notas de Débito" message="Consultando datos y preparando la grilla..." />
      <section v-if="searched && !loading" class="fm-panel"><div class="fm-panel-header"><span>NOTAS DE DEBITO</span><span>-</span></div><Tabla :data="rows" file-name="notas_debito.xls" @open-nota="abrirNota" /></section>
    </div>
    <DetalleNotaCreditoView v-if="currentView === 'detail'" :nota="selectedNota" tipo-nota="debito" @volver="volverDesdeDetalle" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import FmTypingLoader from '../../components/shared/FmTypingLoader.vue'
import FmTurquoiseSelect from '../../components/shared/FmTurquoiseSelect.vue'
import DetalleNotaCreditoView from '../../components/certificacion/notas/DetalleNotaCreditoView.vue'
import Tabla from './components/Tabla.vue'
import { searchNotasDebito } from '../../services/certificacionService.js'
import { provinciasCertificacion } from '../../mocks/certificacionMock.js'
const currentView = ref('search')
const selectedNota = ref(null)
const openFilters = ref(true)
const searched = ref(false)
const loading = ref(false)
const rows = ref([])
const empty = () => ({ provincia: '', contratista: '', sociedad: '', tipo_contrato: '', anio: '', periodo: '', estado: '', nota_debito: '', nro_ot: '', acta_asociada: '' })
const form = reactive(empty())
const opt = a => a.map(x => ({ value: x, label: x }))
const provinciaOptions = opt(provinciasCertificacion)
const contratistaOptions = opt(['NET AND WORK S.A.', 'GREENIN S.A.S.', 'BULLS', 'DUNKEL', 'ALL VISION S.A.', 'INTERCATV S.R.L.', 'ADOBE CONSTRUCCIONES', 'CONECTAR S.R.L.', 'DIGITAL OESTE S.R.L.', 'AYKO S.A.'])
const sociedadOptions = opt(['Telecom Argentina S.A.', 'Núcleo S.A.', 'La Capital Cable S.A.', 'Bersabel S.A.'])
const tipoContratoOptions = opt(['Eventos', 'WIRELESS', 'DTH', 'Eventos SMB', 'Siniestros'])
const anioOptions = opt(['2026', '2025', '2024', '2023'])
const periodoOptions = opt(['Del 16/05 al 15/06', 'Del 16/03 al 15/04', 'Del 16/01 al 15/02', 'Del 16/11 al 15/12'])
const estadoOptions = opt(['En Curso', 'Cerrado'])
watch(() => form.anio, v => { if (!v) form.periodo = '' })
const limpiar = () => Object.assign(form, empty())
const buscar = async () => { openFilters.value = false; searched.value = true; loading.value = true; try { rows.value = await searchNotasDebito({ ...form }) } finally { loading.value = false } }
const abrirNota = row => { const key = `fm-detalle-nota-debito-${row?.nro_nota || Date.now()}`; localStorage.setItem(key, JSON.stringify(row)); const url = new URL(window.location.href); url.searchParams.set('module', 'consultar-nota-debito'); url.searchParams.set('detalleNota', '1'); url.searchParams.set('tipoNota', 'debito'); url.searchParams.set('notaKey', key); window.open(url.toString(), '_blank', 'noopener,noreferrer') }
const openDetalleFromUrl = () => { const params = new URLSearchParams(window.location.search); if (params.get('detalleNota') !== '1') return; const key = params.get('notaKey'); if (!key) return; const saved = localStorage.getItem(key); if (!saved) return; selectedNota.value = JSON.parse(saved); currentView.value = 'detail' }
const volverDesdeDetalle = () => { if (new URLSearchParams(window.location.search).get('detalleNota') === '1') window.close(); else currentView.value = 'search' }
onMounted(openDetalleFromUrl)
</script>

<style scoped>
.nota-debito-page{font-size:14px}.fm-panel{border:1px solid #d8d8d8;background:#fff;margin-bottom:8px}.fm-panel-header{height:32px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#f7f7f7;border-bottom:1px solid #d8d8d8;cursor:pointer}.filters-content{border-left:4px solid #00bcd4}.filters-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px 18px;padding:14px 22px 16px;border-bottom:1px solid #d8d8d8}.span-2{grid-column:span 2}.span-3{grid-column:span 3}.field label{display:block;margin-bottom:7px;font-weight:700;font-size:13px}.field input{width:100%;height:33px;border:1px solid #bdbdbd;border-radius:3px;padding:4px 8px}.actions{display:flex;justify-content:center;gap:8px;padding:18px 0 22px}.primary,.outline{height:32px;min-width:107px;display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:4px;padding:0 16px;font-size:12px;font-weight:500;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.12)}.primary{background:#00a9bd;border:1px solid #00a9bd;color:#fff}.outline{background:#fff;border:1px solid #00a9bd;color:#00a9bd}@media(max-width:1180px){.span-3{grid-column:span 6}.span-2{grid-column:span 4}}@media(max-width:760px){.span-2,.span-3{grid-column:span 12}}
</style>