<template>
  <div>
    <div class="table-responsive" style="border: none;">
      <table class="advanced-grid" style="border-top: none;">
        <thead>
          <tr>
            <th><div class="resizable-header">NRO_ACTA</div></th>
            <th><div class="resizable-header">ND ASOCIADA</div></th>
            <th><div class="resizable-header">NC ASOCIADA</div></th>
            <th><div class="resizable-header">ESTADO_ACTA</div></th>
            <th><div class="resizable-header">PERIODO</div></th>
            <th><div class="resizable-header">AÑO</div></th>
            <th><div class="resizable-header">FECHA_CREACION</div></th>
            <th><div class="resizable-header">FECHA_CIERRE</div></th>
            <th><div class="resizable-header">CONTRATISTA</div></th>
            <th><div class="resizable-header">PAIS</div></th>
            <th><div class="resizable-header">PROVINCIA</div></th>
            <th><div class="resizable-header">REGION</div></th>
            <th><div class="resizable-header">TIPO_CONTRATO</div></th>
            <th><div class="resizable-header">SOCIEDAD</div></th>
            <th><div class="resizable-header">USUARIO_CIERRE</div></th>
            <th><div class="resizable-header">VALORACION</div></th>
          </tr>
          <tr class="filter-row">
            <th><input type="text" class="col-filter-input" v-model="filters.nro_acta" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.nd" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.nc" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.estado" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.periodo" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.anio" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.fecha_crea" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.fecha_cierre" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.contratista" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.pais" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.provincia" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.region" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.tipo_contrato" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.sociedad" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.usuario" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.valoracion" placeholder="~"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <!-- Columna Clickeable -->
            <td>
              <span class="clickable-link" @click="$emit('open-acta', row)">{{ row.nro_acta }}</span>
            </td>
            <td>{{ row.nd }}</td><td>{{ row.nc }}</td>
            <td><span :style="{ color: row.estado === 'ABIERTA' ? '#4caf50' : '#d32f2f', fontWeight: 'bold' }">{{ row.estado }}</span></td>
            <td>{{ row.periodo }}</td><td>{{ row.anio }}</td><td>{{ row.fecha_crea }}</td><td>{{ row.fecha_cierre }}</td>
            <td>{{ row.contratista }}</td><td>{{ row.pais }}</td><td>{{ row.provincia }}</td><td>{{ row.region }}</td>
            <td>{{ row.tipo_contrato }}</td><td>{{ row.sociedad }}</td><td>{{ row.usuario }}</td><td>{{ row.valoracion }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0"><td colspan="16" style="text-align: center; padding: 30px;">No hay resultados con estos filtros.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="grid-footer">
      <div class="grid-footer-left">
        <button class="icon-btn" title="Exportar a CSV" @click="exportCSV"><span class="material-icons">file_download</span></button>
      </div>
      <div class="modern-pagination">
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage = 1">first_page</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage > 1 && currentPage--">chevron_left</span>
        <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1"> de {{ totalPages || 1 }}</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage < totalPages && currentPage++">chevron_right</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage = totalPages">last_page</span>
        <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;" v-model="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10 v</option><option :value="50">50 v</option><option :value="100">100 v</option><option :value="500">500 v</option>
        </select>
        <div style="margin-left: 10px;">Mostrando {{ filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} de {{ filteredData.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps(['data'])
const emit = defineEmits(['open-acta'])

const filters = reactive({ nro_acta: '', nd: '', nc: '', estado: '', periodo: '', anio: '', fecha_crea: '', fecha_cierre: '', contratista: '', pais: '', provincia: '', region: '', tipo_contrato: '', sociedad: '', usuario: '', valoracion: '' })
const currentPage = ref(1); const itemsPerPage = ref(10)

const filteredData = computed(() => { return props.data.filter(row => { return Object.keys(filters).every(key => { const filterVal = filters[key].toLowerCase(); if (!filterVal) return true; return String(row[key]).toLowerCase().includes(filterVal) }) }) })
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const paginatedData = computed(() => { return filteredData.value.slice((currentPage.value - 1) * itemsPerPage.value, (currentPage.value - 1) * itemsPerPage.value + itemsPerPage.value) })

const exportCSV = () => {
  const dataToExport = filteredData.value.length ? filteredData.value : props.data
  const headers = "NRO_ACTA,ND_ASOCIADA,NC_ASOCIADA,ESTADO_ACTA,PERIODO,AÑO,FECHA_CREACION,FECHA_CIERRE,CONTRATISTA,PAIS,PROVINCIA,REGION,TIPO_CONTRATO,SOCIEDAD,USUARIO_CIERRE,VALORACION\n"
  const rows = dataToExport.map(row => `${row.nro_acta},${row.nd},${row.nc},${row.estado},${row.periodo},${row.anio},${row.fecha_crea},${row.fecha_cierre},${row.contratista},${row.pais},${row.provincia},${row.region},${row.tipo_contrato},${row.sociedad},${row.usuario},${row.valoracion}`).join('\n')
  const link = document.createElement("a"); link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + headers + rows)); link.setAttribute("download", "Consulta_Actas.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link)
}
</script>