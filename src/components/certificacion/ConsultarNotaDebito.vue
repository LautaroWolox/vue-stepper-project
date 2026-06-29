<template>
  <div>
    <div v-if="currentView === 'search'">
      <div class="soft-accordion">
        <div class="soft-accordion-header" @click="openFilters = !openFilters">
          <span><span class="material-icons">filter_alt</span> FILTROS DE BÚSQUEDA</span>
          <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
        </div>
        <div class="soft-accordion-content" v-show="openFilters">
          <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="form-group"><label>Provincia</label><select class="form-control" v-model="form.provincia"><option value=""></option><option value="BUENOS AIRES">BUENOS AIRES</option><option value="CAPITAL FEDERAL">CAPITAL FEDERAL</option><option value="PARAGUAY">PARAGUAY</option></select></div>
            <div class="form-group"><label>Contratista Acta</label><select class="form-control" v-model="form.contratista"><option value=""></option><option value="NET AND WORK S.A.">NET AND WORK S.A.</option><option value="BULLS">BULLS</option></select></div>
            <div class="form-group"><label>Sociedad Acta</label><select class="form-control" v-model="form.sociedad"><option value=""></option><option value="Telecom Argentina S.A.">Telecom Argentina S.A.</option><option value="Nucleo S.A.">Nucleo S.A.</option></select></div>
            <div class="form-group"><label>Tipo de Contrato</label><select class="form-control" v-model="form.tipo_contrato"><option value=""></option><option value="Eventos">Eventos</option><option value="WIRELESS">WIRELESS</option></select></div>
          </div>
          <div class="form-grid" style="grid-template-columns: 1fr 1fr 2fr;">
            <div class="form-group"><label>Año</label><select class="form-control" v-model="form.anio"><option value="2026">2026</option></select></div>
            <div class="form-group"><label>Periodo</label><select class="form-control" v-model="form.periodo"><option value=""></option><option value="1">Del 16/05 al 15/06</option><option value="2">Del 16/03 al 15/04</option></select></div>
            <div class="form-group"><label>Estado</label><select class="form-control" v-model="form.estado"><option value=""></option><option value="En Curso">En Curso</option><option value="Cerrado">Cerrado</option></select></div>
          </div>
          <div class="form-grid" style="grid-template-columns: 1fr 1fr 2fr;">
            <div class="form-group"><label>Nota de Debito</label><input type="text" class="form-control" v-model="form.nota_debito"></div>
            <div class="form-group"><label>N° de OT</label><input type="text" class="form-control" v-model="form.nro_ot"></div>
            <div class="form-group"><label>Nro Acta Asociada</label><input type="text" class="form-control" v-model="form.acta_asociada"></div>
          </div>
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eceff1;">
            <button class="btn" style="border-radius: 20px; padding: 10px 30px; background: #00bcd4; margin-right: 15px;" @click="handleSearch"><span class="material-icons btn-icon">search</span> BUSCAR</button>
            <button class="btn btn-danger" style="border-radius: 20px; padding: 10px 30px;" @click="resetForm"><span class="material-icons btn-icon">clear</span> LIMPIAR</button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="main-loader-container">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/><rect x="55" y="95" width="10" height="25" fill="#78909C"/><rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/><rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/><rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/>
        </svg>
        <span style="margin-top: 15px;">Recuperando Notas de Debito...</span>
      </div>

      <div class="soft-accordion" v-if="hasSearched && !isLoading">
        <div class="soft-accordion-header" @click="openResults = !openResults">
          <span><span class="material-icons">list</span> NOTAS DE DEBITO</span>
          <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
        </div>
        <div class="soft-accordion-content" v-show="openResults" style="padding: 0;">
          <GridNotasCredito :data="gridData" file-name="Consulta_Notas_Debito.csv" @open-nota="openDetalleNota" />
        </div>
      </div>
    </div>
    <DetalleActaCredito v-if="currentView === 'detail'" :nota="selectedNota" tipo-nota="debito" @volver="currentView = 'search'" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GridNotasCredito from './GridNotasCredito.vue'
import DetalleActaCredito from './DetalleActaCredito.vue'

const currentView = ref('search')
const selectedNota = ref(null)
const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)
const form = reactive({ provincia: '', contratista: '', sociedad: '', tipo_contrato: '', anio: '', periodo: '', estado: '', nota_debito: '', nro_ot: '', acta_asociada: '' })
const gridData = ref([])

const resetForm = () => {
  Object.keys(form).forEach((key) => { form[key] = '' })
  hasSearched.value = false
  isLoading.value = false
  gridData.value = []
  currentView.value = 'search'
  selectedNota.value = null
  openFilters.value = true
  openResults.value = true
}

const handleSearch = () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true
  setTimeout(() => {
    generateMockData()
    isLoading.value = false
  }, 1200)
}

const generateMockData = () => {
  gridData.value = [
    { id: 1, nro_nota: 'ND1046', acta: 'A2732', estado: 'En Curso', periodo: 'Del 16/05 al 15/06', anio: '2026', f_crea: '2026-06-25 16:30', f_cierre: '', contra: 'NET AND WORK S.A.', pais: 'ARGENTINA', prov: 'BUENOS AIRES', reg: 'AMBA', tipo: 'Eventos', soc: 'Telecom Argentina S.A.', usu: '', val: '2' },
    { id: 2, nro_nota: 'ND1043', acta: 'A2711', estado: 'Cerrado', periodo: 'Del 16/03 al 15/04', anio: '2026', f_crea: '2026-04-17 11:46', f_cierre: '2026-04-17 11:47', contra: 'GREENIN S.A.S.', pais: 'ARGENTINA', prov: 'CAPITAL FEDERAL', reg: 'AMBA', tipo: 'Eventos', soc: 'Telecom Argentina S.A.', usu: 'z002456', val: '1' },
    { id: 3, nro_nota: 'NDP011', acta: 'P0125', estado: 'En Curso', periodo: 'Del 16/01 al 15/02', anio: '2026', f_crea: '2026-03-06 13:40', f_cierre: '', contra: 'BULLS', pais: 'PARAGUAY', prov: 'PARAGUAY', reg: 'PARAGUAY', tipo: 'WIRELESS', soc: 'Nucleo S.A.', usu: '', val: '4' }
  ].filter((row) => {
    return (!form.nota_debito || row.nro_nota.toLowerCase().includes(form.nota_debito.toLowerCase())) &&
      (!form.acta_asociada || row.acta.toLowerCase().includes(form.acta_asociada.toLowerCase())) &&
      (!form.estado || row.estado === form.estado) &&
      (!form.provincia || row.prov === form.provincia)
  })
}

const openDetalleNota = (notaRow) => {
  selectedNota.value = notaRow
  currentView.value = 'detail'
}
</script>
