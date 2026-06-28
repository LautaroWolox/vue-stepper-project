<template>
  <div>
    <div class="table-responsive" style="border: none;">
      <table class="advanced-grid" style="border-top: none;">
        <thead>
          <tr>
            <th><div class="resizable-header">CODIGO_TAREA</div></th>
            <th><div class="resizable-header">TAREA</div></th>
            <th><div class="resizable-header">NOMBRE_CONTRATO</div></th>
            <th><div class="resizable-header">USUARIO_MODIFICACION</div></th>
            <th><div class="resizable-header">FECHA_MODIFICACION</div></th>
            <th><div class="resizable-header">ACTIVO</div></th>
            <th><div class="resizable-header">PAIS</div></th>
          </tr>
          <tr class="filter-row">
            <th><input type="text" class="col-filter-input" v-model="filters.cod" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.tarea" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.contrato" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.usu" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.fecha" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.activo" placeholder="~"></th>
            <th><input type="text" class="col-filter-input" v-model="filters.pais" placeholder="~"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in paginatedData" 
            :key="row.id" 
            :class="{ 'active-row': selectedRow?.id === row.id }"
            @click="selectRow(row)"
            style="cursor: pointer;"
          >
            <td>{{ row.cod }}</td>
            <td>{{ row.tarea }}</td>
            <td>{{ row.contrato }}</td>
            <td>{{ row.usu }}</td>
            <td>{{ row.fecha }}</td>
            <td>{{ row.activo }}</td>
            <td>{{ row.pais }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td colspan="7" style="text-align: center; padding: 20px;">No hay resultados con estos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Barra Inferior (Iconos Modernos y Paginado Manual) -->
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
        
        <!-- Paginador inicia en 10 por defecto -->
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

const filters = reactive({ cod: '', tarea: '', contrato: '', usu: '', fecha: '', activo: '', pais: '' })
const selectedRow = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10) // <-- Modificado para mostrar solo 10 por defecto

const selectRow = (row) => {
  selectedRow.value = selectedRow.value?.id === row.id ? null : row
}

const deactivateRow = () => {
  if (selectedRow.value) {
    selectedRow.value.activo = 'N'
    selectedRow.value.fecha = new Date().toLocaleString('es-AR')
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
  if (!filteredData.value.length) return
  const headers = "CODIGO_TAREA,TAREA,NOMBRE_CONTRATO,USUARIO_MODIFICACION,FECHA_MODIFICACION,ACTIVO,PAIS\n"
  const rows = filteredData.value.map(row => `${row.cod},${row.tarea},${row.contrato},${row.usu},${row.fecha},${row.activo},${row.pais}`).join('\n')
  const link = document.createElement("a")
  link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + headers + rows))
  link.setAttribute("download", "Relaciones_Jobtype_Contrato.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>