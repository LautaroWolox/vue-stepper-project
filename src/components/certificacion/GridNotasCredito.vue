<template>
  <div>
    <div class="table-responsive" style="border: none;">
      <table class="advanced-grid" style="border-top: none;">
        <thead>
          <tr>
            <th><div class="resizable-header">NRO_NOTA</div></th><th><div class="resizable-header">NUMERO DE ACTA</div></th><th><div class="resizable-header">ESTADO_NOTA</div></th><th><div class="resizable-header">PERIODO</div></th><th><div class="resizable-header">AÑO</div></th>
            <th><div class="resizable-header">FECHA_CREACION</div></th><th><div class="resizable-header">FECHA_CIERRE</div></th><th><div class="resizable-header">CONTRATISTA</div></th><th><div class="resizable-header">PAIS</div></th><th><div class="resizable-header">PROVINCIA</div></th>
            <th><div class="resizable-header">REGION</div></th><th><div class="resizable-header">TIPO_CONTRATO</div></th><th><div class="resizable-header">SOCIEDAD</div></th><th><div class="resizable-header">USUARIO_CIERRE</div></th><th><div class="resizable-header">VALORACION_ACTA</div></th>
          </tr>
          <tr class="filter-row">
            <th><input type="text" class="col-filter-input" v-model="filters.nro_nota" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.acta" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.estado" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.periodo" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.anio" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.f_crea" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.f_cierre" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.contra" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.pais" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.prov" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.reg" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.tipo" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.soc" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.usu" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.val" placeholder="~"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td><span class="clickable-link" @click="$emit('open-nota', row)">{{ row.nro_nota }}</span></td>
            <td>{{ row.acta }}</td><td>{{ row.estado }}</td><td>{{ row.periodo }}</td><td>{{ row.anio }}</td>
            <td>{{ row.f_crea }}</td><td>{{ row.f_cierre }}</td><td>{{ row.contra }}</td><td>{{ row.pais }}</td><td>{{ row.prov }}</td>
            <td>{{ row.reg }}</td><td>{{ row.tipo }}</td><td>{{ row.soc }}</td><td>{{ row.usu }}</td><td>{{ row.val }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0"><td colspan="15" style="text-align: center; padding: 30px;">No hay resultados.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="grid-footer" style="justify-content: center;">
      <div class="modern-pagination">
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage = 1">first_page</span><span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage > 1 && currentPage--">chevron_left</span>
        <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1"> de {{ totalPages || 1 }}</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage < totalPages && currentPage++">chevron_right</span><span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage = totalPages || 1">last_page</span>
        <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;" v-model="itemsPerPage" @change="currentPage = 1"><option :value="500">500 v</option><option :value="100">100 v</option><option :value="50">50 v</option><option :value="10">10 v</option></select>
        <button class="icon-btn" title="Exportar a CSV" @click="exportCSV" :disabled="filteredData.length === 0" style="margin-left: 10px;"><span class="material-icons">file_download</span></button>
        <div style="margin-left: 10px;">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredData.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const props = defineProps({
  data: { type: Array, default: () => [] },
  fileName: { type: String, default: 'Consulta_Notas.csv' }
})

defineEmits(['open-nota'])

const columns = [
  { field: 'nro_nota', label: 'NRO_NOTA' },
  { field: 'acta', label: 'NUMERO DE ACTA' },
  { field: 'estado', label: 'ESTADO_NOTA' },
  { field: 'periodo', label: 'PERIODO' },
  { field: 'anio', label: 'AÑO' },
  { field: 'f_crea', label: 'FECHA_CREACION' },
  { field: 'f_cierre', label: 'FECHA_CIERRE' },
  { field: 'contra', label: 'CONTRATISTA' },
  { field: 'pais', label: 'PAIS' },
  { field: 'prov', label: 'PROVINCIA' },
  { field: 'reg', label: 'REGION' },
  { field: 'tipo', label: 'TIPO_CONTRATO' },
  { field: 'soc', label: 'SOCIEDAD' },
  { field: 'usu', label: 'USUARIO_CIERRE' },
  { field: 'val', label: 'VALORACION_ACTA' }
]

const filters = reactive(Object.fromEntries(columns.map((column) => [column.field, ''])))
const currentPage = ref(1)
const itemsPerPage = ref(500)

const filteredData = computed(() => props.data.filter((row) => columns.every((column) => {
  const filterValue = String(filters[column.field] || '').toLowerCase()
  if (!filterValue) return true
  return String(row[column.field] || '').toLowerCase().includes(filterValue)
})))

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
const fromRow = computed(() => filteredData.value.length > 0 ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length))

const exportCSV = () => {
  if (!filteredData.value.length) return
  const headers = columns.map((column) => column.label)
  const rows = filteredData.value.map((row) => columns.map((column) => row[column.field]))
  downloadCsv(props.fileName, buildCsv(headers, rows))
}

watch(filters, () => { currentPage.value = 1 })
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages || 1 })
</script>