<template>
  <div class="nota-credito-page">
    <div v-if="currentView === 'search'">
      <section class="fm-panel">
        <div class="fm-panel-header" @click="openFilters = !openFilters">
          <span>FILTROS DE BÚSQUEDA</span>
          <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
        </div>

        <div class="fm-panel-content filters-content" v-show="openFilters">
          <div class="filters-grid">
            <div class="fm-field span-3">
              <label>Provincia</label>
              <FmTurquoiseSelect v-model="form.provincia" :options="provinciaOptions" class="nc-select" />
            </div>

            <div class="fm-field span-3">
              <label>Contratista Acta</label>
              <FmTurquoiseSelect v-model="form.contratista" :options="contratistaOptions" class="nc-select" />
            </div>

            <div class="fm-field span-3">
              <label>Sociedad Acta</label>
              <FmTurquoiseSelect v-model="form.sociedad" :options="sociedadOptions" class="nc-select" />
            </div>

            <div class="fm-field span-3">
              <label>Tipo de Contrato</label>
              <FmTurquoiseSelect v-model="form.tipo_contrato" :options="tipoContratoOptions" class="nc-select" />
            </div>

            <div class="fm-field span-2 anio-field">
              <label>Año</label>
              <FmTurquoiseSelect v-model="form.anio" :options="anioOptions" class="nc-select" />
            </div>

            <div class="fm-field span-2 periodo-field">
              <label>Periodo</label>
              <FmTurquoiseSelect
                v-model="form.periodo"
                :options="periodoOptions"
                :disabled="!form.anio"
                class="nc-select"
              />
            </div>

            <div class="fm-field span-2 estado-field">
              <label>Estado</label>
              <FmTurquoiseSelect v-model="form.estado" :options="estadoOptions" class="nc-select" />
            </div>

            <div class="fm-field span-2">
              <label>Nota de Credito</label>
              <input type="text" class="form-control" v-model.trim="form.nota_credito" />
            </div>

            <div class="fm-field span-2">
              <label>N° de OT</label>
              <input type="text" class="form-control" v-model.trim="form.nro_ot" />
            </div>

            <div class="fm-field span-2">
              <label>Nro Acta Asociada</label>
              <input type="text" class="form-control" v-model.trim="form.acta_asociada" />
            </div>
          </div>

          <div class="filters-actions">
            <button class="nc-btn nc-btn-primary" type="button" @click="handleSearch" :disabled="isLoading">
              <span class="material-icons">search</span>
              <span>{{ isLoading ? 'BUSCANDO...' : 'BUSCAR' }}</span>
            </button>
            <button class="nc-btn nc-btn-outline" type="button" @click="resetForm">
              <span class="material-icons">sort</span>
              <span>LIMPIAR</span>
            </button>
          </div>
        </div>
      </section>

      <FmTypingLoader v-if="isLoading" title="Recuperando Notas de Crédito" message="Consultando datos y preparando la grilla..." />

      <section class="fm-panel" v-if="hasSearched && !isLoading">
        <div class="fm-panel-header" @click="openResults = !openResults">
          <span>NOTAS DE CREDITO</span>
          <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
        </div>
        <div class="fm-panel-content results-content" v-show="openResults">
          <NotasGrid :data="gridData" file-name="notas_credito.xls" @open-nota="openDetalleNota" />
        </div>
      </section>
    </div>

    <DetalleNotaCreditoView v-if="currentView === 'detail'" :nota="selectedNota" tipo-nota="credito" @volver="volverDesdeDetalle" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import FmTypingLoader from '../shared/FmTypingLoader.vue'
import FmTurquoiseSelect from '../shared/FmTurquoiseSelect.vue'
import NotasGrid from './notas/NotasGrid.vue'
import DetalleNotaCreditoView from './notas/DetalleNotaCreditoView.vue'
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

const toOptions = (items) => items.map((item) => ({ value: item, label: item }))
const provinciaOptions = toOptions(provincias)
const contratistaOptions = toOptions(contratistas)
const sociedadOptions = toOptions(sociedades)
const tipoContratoOptions = toOptions(tiposContrato)
const anioOptions = toOptions(['2026', '2025', '2024', '2023'])
const periodoOptions = toOptions(['Del 16/05 al 15/06', 'Del 16/03 al 15/04', 'Del 16/01 al 15/02', 'Del 16/11 al 15/12'])
const estadoOptions = toOptions(['En Curso', 'Cerrado'])

const emptyForm = () => ({
  provincia: '',
  contratista: '',
  sociedad: '',
  tipo_contrato: '',
  anio: '',
  periodo: '',
  estado: '',
  nota_credito: '',
  nro_ot: '',
  acta_asociada: ''
})

const form = reactive(emptyForm())

watch(() => form.anio, (anio) => {
  if (!anio) form.periodo = ''
})

const resetForm = () => {
  Object.assign(form, emptyForm())
  openFilters.value = true
}

const handleSearch = async () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true

  try {
    gridData.value = await searchNotasCredito({ ...form })
    openResults.value = true
  } finally {
    isLoading.value = false
  }
}

const makeStorageKey = row => `fm-detalle-nota-credito-${row?.nro_nota || Date.now()}`
const openDetalleNota = notaRow => {
  const key = makeStorageKey(notaRow)
  localStorage.setItem(key, JSON.stringify(notaRow))
  const url = new URL(window.location.href)
  url.searchParams.set('module', 'consultar-nota-credito')
  url.searchParams.set('detalleNota', '1')
  url.searchParams.set('tipoNota', 'credito')
  url.searchParams.set('notaKey', key)
  url.searchParams.set('nota', notaRow?.nro_nota || '')
  window.open(`${url.pathname}${url.search}${url.hash}`, '_blank', 'noopener,noreferrer')
}
const openDetalleFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('detalleNota') !== '1') return
  const key = params.get('notaKey')
  if (!key) return
  const saved = localStorage.getItem(key)
  if (!saved) return
  selectedNota.value = JSON.parse(saved)
  currentView.value = 'detail'
  openFilters.value = false
  openResults.value = false
  hasSearched.value = false
}
const volverDesdeDetalle = () => {
  if (new URLSearchParams(window.location.search).get('detalleNota') === '1') window.close()
  else currentView.value = 'search'
}

onMounted(openDetalleFromUrl)
</script>

<style scoped>
.nota-credito-page {
  color: #111;
  font-size: 14px;
}

.fm-panel {
  border: 1px solid #d8d8d8;
  background: #fff;
  margin-bottom: 8px;
}

.fm-panel-header {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: #f7f7f7;
  border-bottom: 1px solid #d8d8d8;
  cursor: pointer;
}

.fm-panel-header .material-icons {
  color: #666;
  font-size: 20px;
}

.filters-content {
  border-left: 4px solid #00bcd4;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px 18px;
  padding: 14px 22px 16px;
  border-bottom: 1px solid #d8d8d8;
  align-items: end;
}

.span-2 {
  grid-column: span 2;
}

.span-3 {
  grid-column: span 3;
}

.fm-field {
  min-width: 0;
}

.fm-field label {
  display: block;
  margin-bottom: 7px;
  font-weight: 700;
  font-size: 13px;
}

.form-control {
  width: 100%;
  height: 33px;
  border: 1px solid #bdbdbd;
  border-radius: 3px;
  padding: 4px 8px;
  background: #fff;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0,188,212,.14);
}

.nc-select :deep(.fm-turquoise-select__button) {
  height: 33px;
  min-height: 33px;
  border-color: #bdbdbd;
  font-size: 13px;
}

.nc-select :deep(.fm-turquoise-select__button:hover),
.nc-select.open :deep(.fm-turquoise-select__button) {
  border-color: #00a9bd;
}

.nc-select :deep(.fm-turquoise-select__menu) {
  border-color: #00a9bd;
  box-shadow: 0 8px 18px rgba(38, 50, 56, .18);
}

.nc-select :deep(.fm-turquoise-select__option.selected) {
  background: #00a9bd;
  color: #fff;
}

.nc-select :deep(.fm-turquoise-select__option:hover) {
  background: #e0f7fa;
  color: #006f7f;
}

.periodo-field :deep(.fm-turquoise-select.disabled .fm-turquoise-select__button) {
  background: #e9e9e9;
  color: #777;
  border-color: #c9c9c9;
  cursor: not-allowed;
}

.filters-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 18px 0 22px;
}

.nc-btn {
  height: 32px;
  min-width: 107px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .2px;
  line-height: 32px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,.12);
  transition: background-color .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease;
}

.nc-btn .material-icons {
  font-size: 15px;
  line-height: 1;
}

.nc-btn-primary {
  background: #00a9bd;
  border: 1px solid #00a9bd;
  color: #fff;
}

.nc-btn-primary:hover:not(:disabled) {
  background: #008fa1;
  border-color: #008fa1;
  box-shadow: 0 5px 12px rgba(0,143,161,.28);
  transform: translateY(-1px);
}

.nc-btn-outline {
  background: #fff;
  border: 1px solid #00a9bd;
  color: #00a9bd;
}

.nc-btn-outline:hover:not(:disabled) {
  background: #e0f7fa;
  border-color: #008fa1;
  color: #008fa1;
  box-shadow: 0 5px 12px rgba(0,143,161,.18);
  transform: translateY(-1px);
}

.nc-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0,188,212,.22), 0 4px 10px rgba(0,0,0,.14);
}

.nc-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
  transform: none;
}

.results-content {
  padding: 0;
}

@media(max-width: 1180px) {
  .span-3 {
    grid-column: span 6;
  }

  .span-2 {
    grid-column: span 4;
  }
}

@media(max-width: 760px) {
  .span-3,
  .span-2 {
    grid-column: span 12;
  }

  .filters-grid {
    padding: 12px;
  }
}

@media(max-width: 560px) {
  .filters-actions {
    flex-direction: column;
    padding: 12px;
  }

  .nc-btn {
    width: 100%;
  }
}
</style>
