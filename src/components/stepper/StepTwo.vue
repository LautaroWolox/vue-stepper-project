<template>
  <div class="step-two">
    <h3><span class="material-icons">checklist</span> Registros Seleccionados para Exportar</h3>
    <div class="grid-container" v-if="selectedData.length > 0">
      <table>
        <thead><tr><th v-for="col in columns" :key="col">{{ col }}</th></tr></thead>
        <tbody>
          <tr v-for="row in selectedData" :key="row.ID">
            <td v-for="col in columns" :key="col">{{ row[col] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else style="padding: 20px; text-align: center; color: #90a4ae; border: 2px dashed #cfd8dc; border-radius: 8px;">
      <span class="material-icons" style="font-size: 40px;">inbox</span><p>No hay datos seleccionados en el Paso 1.</p>
    </div>

    <div class="export-container">
      <button class="btn" :disabled="selectedData.length === 0" @click="exportCSV"><span class="material-icons btn-icon">file_download</span> Exportar Seleccionados a CSV</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['selectedData', 'columns'])

const exportCSV = () => {
  if (!props.selectedData.length) return
  const headers = props.columns.join(',') + '\n'
  const rows = props.selectedData.map(obj => props.columns.map(col => obj[col]).join(',')).join('\n')
  const csvContent = "data:text/csv;charset=utf-8," + headers + rows
  const link = document.createElement("a")
  link.setAttribute("href", encodeURI(csvContent))
  link.setAttribute("download", "exportacion_grilla.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>