<template>
  <div>
    <div class="table-responsive" style="border: none;">
      <table class="advanced-grid" style="border-top: none;">
        <thead>
          <tr>
            <th><div class="resizable-header">CODIGO_ACTIVIDAD</div></th>
            <th><div class="resizable-header">DESC_ACTIVIDAD</div></th>
            <th><div class="resizable-header">CODIGO_S4</div></th>
            <th><div class="resizable-header">CMO</div></th>
            <th><div class="resizable-header">USUARIO_MODIFICACION</div></th>
            <th><div class="resizable-header">FECHA_MODIFICACION</div></th>
            <th><div class="resizable-header">ACTIVO</div></th>
          </tr>
          <tr class="filter-row">
            <th><input type="text" class="col-filter-input" v-model="filters.cod_act" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.desc_act" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.cod_s4" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.cmo" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.usu" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.fecha" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.activo" placeholder="~"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in paginatedData" 
            :key="row.id" 
            :class="{ 'active-row': selectedRow?.id === row.id, 'disabled-row': row.disabled }"
            @click="selectRow(row)"
          >
            <td>{{ row.cod_act }}</td>
            <td>{{ row.desc_act }}</td>
            <td>{{ row.cod_s4 }}</td>
            <td>{{ row.cmo }}</td>
            <td>{{ row.usu }}</td>
            <td>{{ row.fecha }}</td>
            <td>{{ row.activo }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td colspan="7" style="text-align: center; padding: 20px;">No hay resultados con estos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid-footer">
      <div class="grid-footer-left">
        <button class="icon-btn" title="Exportar a CSV" @click="exportCSV">
          <span class="material-icons">file_download</span>
        </button>
        <button class="icon-btn" title="Desactivar" :disabled="!selectedRow" @click="deactivateRow">
          <span class="material-icons">delete</span>
        </button>
        <button class="icon-btn" title="Editar" :disabled="!selectedRow" @click="$emit('edit-row', $event, selectedRow)">
          <span class="material-icons">edit_square</span>
        </button>
        <button class="icon-btn" title="Nueva Relación" @click="$emit('add-row', $event)">
          <span class="material-icons">add</span>
        </button>
      </div>

      <div class="modern-pagination">
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage = 1">first_page</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage > 1 && currentPage--">chevron_left</span>
        
        <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1"> de {{ totalPages || 1 }}</span>
        
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage < totalPages && currentPage++">chevron_right</span>
        <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage = totalPages">last_page</span>
        
        <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;" v-model="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10 v</option>
          <option :value="50">50 v</option>
          <option :value="100">100 v</option>
        </select>

        <div style="margin-left: 10px;">
          Mostrando {{ filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} de {{ filteredData.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps(['data'])
const emit = defineEmits(['edit-row', 'add-row'])

const filters = reactive({ cod_act: '', desc_act: '', cod_s4: '', cmo: '', usu: '', fecha: '', activo: '' })
const selectedRow = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const selectRow = (row) => {
  if (row.disabled) return // No permite seleccionar filas inactivas
  selectedRow.value = selectedRow.value?.id === row.id ? null : row
}

const deactivateRow = () => {
  if (selectedRow.value) {
    selectedRow.value.activo = 'N'
    selectedRow.value.disabled = true
    selectedRow.value.fecha = new Date().toLocaleString('es-AR')
    selectedRow.value = null // Deseleccionar al desactivar
  }
}

const filteredData = computed(() => {
  return props.data.filter(row => {
    return Object.keys(filters).every(key => {
      const filterVal = filters[key].toLowerCase()
      if (!filterVal) return true
      return String(row[key]).toLowerCase().includes(filterVal)
    })
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const paginatedData = computed(() => {
  return filteredData.value.slice((currentPage.value - 1) * itemsPerPage.value, (currentPage.value - 1) * itemsPerPage.value + itemsPerPage.value)
})

const exportCSV = () => {
  const dataToExport = filteredData.value.length ? filteredData.value : props.data
  const headers = "CODIGO_ACTIVIDAD,DESC_ACTIVIDAD,CODIGO_S4,CMO,USUARIO MODIFICACION,FECHA_MODIFICACION,ACTIVO\n"
  const rows = dataToExport.map(row => `${row.cod_act},${row.desc_act},${row.cod_s4},${row.cmo},${row.usu},${row.fecha},${row.activo}`).join('\n')
  const link = document.createElement("a")
  link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + headers + rows))
  link.setAttribute("download", "Configuracion_CMO_Actividad.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.disabled-row {
  background-color: #f5f5f5 !important;
  color: #9e9e9e !important;
  cursor: not-allowed !important;
}
.disabled-row td {
  color: #9e9e9e !important;
}
</style>