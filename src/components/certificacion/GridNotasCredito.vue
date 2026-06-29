<template>
  <div>
    <div class="table-responsive" style="border: none;">
      <table class="advanced-grid" style="border-top: none;">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.field">
              <div class="resizable-header">{{ col.label }}</div>
            </th>
          </tr>
          <tr class="filter-row">
            <th v-for="col in columns" :key="`filter-${col.field}`">
              <input type="text" class="col-filter-input" v-model="filters[col.field]" placeholder="~">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td>
              <span class="clickable-link" @click="$emit('open-nota', row)">{{ row.nro_nota }}</span>
            </td>
            <td>{{ row.acta }}</td>
            <td>{{ row.estado }}</td>
            <td>{{ row.periodo }}</td>
            <td>{{ row.anio }}</td>
            <td>{{ row.f_crea }}</td>
            <td>{{ row.f_cierre }}</td>
            <td>{{ row.contra }}</td>
            <td>{{ row.pais }}</td>
            <td>{{ row.prov }}</td>
            <td>{{ row.reg }}</td>
            <td>{{ row.tipo }}</td>
            <td>{{ row.soc }}</td>
            <td>{{ row.usu }}</td>
            <td>{{ row.val }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td colspan="15" style="text-align: center; padding: 30px;">No hay resultados con estos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-footer">
      <div class="grid-footer-left">
        <button class="icon-btn" title="Exportar a CSV" @click="exportCSV" :disabled="filteredData.length === 0">
          <span class="material-icons">file_download</span>
        </button>
      </div>

      <div class="modern-pagination">
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="goToFirstPage">first_page</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="prevPage">chevron_left</span>
        <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1"> de {{ totalPages || 1 }}</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="nextPage">chevron_right</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="goToLastPage">last_page</span>
        <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;" v-model="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10 v</option>
          <option :value="50">50 v</option>
          <option :value="100">100 v</option>
          <option :value="500">500 v</option>
        </select>
        <div style="margin-left: 10px;">Mostrando {{ fromRow }} - {{ toRow }} de {{ filteredData.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { buildCsv, downloadCsv } from '../../utils/csv.js'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  fileName: {
    type: String,
    default: 'Consulta_Notas.csv'
  }
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
const itemsPerPage = ref(10)

const filteredData = computed(() => {
  return props.data.filter((row) => {
    return columns.every((column) => {
      const filterValue = filters[column.field].toLowerCase()
      if (!filterValue) return true
      return String(row[column.field] || '').toLowerCase().includes(filterValue)
    })
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredData.value.slice(start, start + itemsPerPage.value)
})

const fromRow = computed(() => filteredData.value.length > 0 ? ((currentPage.value - 1) * itemsPerPage.value) + 1 : 0)
const toRow = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length))

const goToFirstPage = () => { currentPage.value = 1 }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToLastPage = () => { currentPage.value = totalPages.value || 1 }

const exportCSV = () => {
  if (!filteredData.value.length) return

  const headers = columns.map((column) => column.label)
  const rows = filteredData.value.map((row) => columns.map((column) => row[column.field]))
  downloadCsv(props.fileName, buildCsv(headers, rows))
}

watch(filters, () => { currentPage.value = 1 })
watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages || 1
})
</script>
