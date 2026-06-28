<template>
  <div>
    <!-- Acordeón 1: Formulario de Búsqueda -->
    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openFilters = !openFilters">
        <span><span class="material-icons" style="vertical-align: middle;">filter_alt</span> FILTROS DE BÚSQUEDA - {{ title }}</span>
        <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
      </div>
      
      <div class="soft-accordion-content" v-show="openFilters">
        <div class="form-grid">
          <div class="form-group">
            <label>Región *</label>
            <select class="form-control" :class="{'input-error': errorRegion}" v-model="form.region">
              <option value="">None selected</option>
              <option value="AMBA">AMBA</option>
              <option value="CEN">Centro</option>
              <option value="NOR">Norte</option>
            </select>
            <span class="error-text" v-if="errorRegion">Este campo es obligatorio.</span>
          </div>
          
          <div class="form-group">
            <label>Sub Región</label>
            <select class="form-control" v-model="form.subRegion">
              <option value="">None selected</option>
              <option value="CABA">CABA</option>
              <option value="GBA">GBA</option>
            </select>
          </div>

          <div class="form-group">
            <label>Centro Logístico</label>
            <select class="form-control" v-model="form.centro">
              <option value="">None selected</option>
              <option value="CL1">Logística Norte</option>
            </select>
          </div>

          <div class="form-group">
            <label>Almacén</label>
            <select class="form-control" v-model="form.almacen">
              <option value="">None selected</option>
              <option value="A1">Almacén Principal</option>
            </select>
          </div>

          <div class="form-group">
            <label>Técnico</label>
            <input type="text" class="form-control" v-model="form.tecnico" placeholder="Buscar técnico...">
          </div>

          <div class="form-group">
            <label>Nro. OT</label>
            <input type="text" class="form-control" v-model="form.ot" placeholder="Ej: 12345">
          </div>

          <div class="form-group">
            <label>Fecha Ult. Modif. Desde</label>
            <input type="date" class="form-control" v-model="form.fechaDesde" :disabled="!canUseDates">
          </div>

          <div class="form-group">
            <label>Fecha Ult. Modif. Hasta</label>
            <input type="date" class="form-control" v-model="form.fechaHasta" :disabled="!canUseDates">
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 10px;">
          <button class="btn" @click="handleSearch" style="margin-right: 10px;">BUSCAR</button>
          <button class="btn btn-danger" @click="resetForm">LIMPIAR</button>
        </div>
      </div>
    </div>

    <!-- Acordeón 2: Stepper Completo -->
    <div class="soft-accordion" v-if="hasSearched">
      <div class="soft-accordion-header" @click="openResults = !openResults">
        <span style="text-transform: uppercase;"><span class="material-icons" style="vertical-align: middle;">list_alt</span> RESULTADOS Y GESTIÓN - {{ title }}</span>
        <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
      </div>
      
      <div class="soft-accordion-content" v-show="openResults">
        <!-- HEADER DE LOS 3 PASOS -->
        <div class="stepper-header" style="margin-bottom: 15px;">
          <div :class="['step-indicator', { active: currentStep === 1 }]"><span class="material-icons">touch_app</span> 1. Selección</div>
          <div :class="['step-indicator', { active: currentStep === 2 }]"><span class="material-icons">import_export</span> 2. Exportación</div>
          <div :class="['step-indicator', { active: currentStep === 3 }]"><span class="material-icons">fact_check</span> 3. Revisión</div>
        </div>

        <!-- PASO 1: Selección y Filtro -->
        <div v-show="currentStep === 1">
          <AdvancedGrid 
            :data="mockData" 
            :columns="gridColumns" 
            v-model="selectedRows"
            @update:visibleCols="updateVisibleColumns"
            @cell-click="handleCellClick"
            @add-material="triggerRominaError"
          />
          <div style="text-align: right; margin-top: 20px;">
            <button class="btn" @click="currentStep = 2" :disabled="selectedRows.length === 0">
              Siguiente <span class="material-icons btn-icon">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- PASO 2: Exportación -->
        <div v-if="currentStep === 2">
          <h3 style="color: #00838f;">Registros listos para exportar</h3>
          <p>Se exportarán <strong>{{ selectedRows.length }}</strong> registros seleccionados.</p>
          <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: space-between;">
            <button class="btn" @click="currentStep = 1"><span class="material-icons btn-icon">arrow_back</span> Atrás</button>
            <div>
              <button class="btn" style="background: linear-gradient(135deg, #4caf50, #2e7d32); margin-right: 10px;" @click="exportExcel">
                <span class="material-icons btn-icon">table_view</span> Descargar Excel
              </button>
              <button class="btn" @click="currentStep = 3">Siguiente <span class="material-icons btn-icon">arrow_forward</span></button>
            </div>
          </div>
        </div>

        <!-- PASO 3: Revisión Final (Grilla Solo Lectura) -->
        <div v-if="currentStep === 3">
          <h3 style="color: #00838f;"><span class="material-icons">preview</span> Revisión Final</h3>
          <p style="color: #546e7a;">Haz clic en cualquier celda para cargar sus datos en el sistema central.</p>
          
          <div class="table-responsive">
            <table class="advanced-grid">
              <thead>
                <tr><th v-for="col in currentVisibleCols" :key="col.field">{{ col.label }}</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in selectedRows" :key="row.id">
                  <td 
                    v-for="col in currentVisibleCols" 
                    :key="col.field" 
                    class="clickable-cell"
                    style="cursor: pointer;"
                    @click="handleCellClick($event, row[col.field])"
                  >
                    {{ row[col.field] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button class="btn" @click="currentStep = 2"><span class="material-icons btn-icon">arrow_back</span> Atrás</button>
            <button class="btn" style="background: linear-gradient(135deg, #00acc1, #00838f);" @click="resetForm">
              <span class="material-icons btn-icon">done_all</span> Finalizar Stepper
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Componente del Popup (Tipito Tipeando) -->
    <FloatingPopup :show="popup.show" :position="popup.pos" :fieldData="popup.data" @accept="popup.show = false" @cancel="popup.show = false" />
    
    <!-- Modal de Error (Romina Castro) -->
    <ErrorModal :show="showError" @close="showError = false" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AdvancedGrid from './AdvancedGrid.vue'
import FloatingPopup from '../popup/FloatingPopup.vue'
import ErrorModal from '../modal/ErrorModal.vue'

const props = defineProps(['title', 'type'])

const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const currentStep = ref(1)

const form = reactive({ region: '', subRegion: '', centro: '', almacen: '', tecnico: '', ot: '', fechaDesde: '', fechaHasta: '' })
const errorRegion = ref(false)
const selectedRows = ref([])
const currentVisibleCols = ref([])

// Estados de Popups y Errores
const popup = reactive({ show: false, pos: { x: 0, y: 0 }, data: null })
const showError = ref(false)

// Lógica para bloquear fechas
const canUseDates = computed(() => { return form.region && form.subRegion && form.centro && form.almacen && form.ot })

const handleSearch = () => {
  errorRegion.value = false
  if (!form.region) { errorRegion.value = true; return }
  hasSearched.value = true
  openFilters.value = false
  currentStep.value = 1
}

const resetForm = () => {
  Object.keys(form).forEach(k => form[k] = '')
  errorRegion.value = false
  hasSearched.value = false
  selectedRows.value = []
}

// Abrir el Popup del Tipito Tipeando
const handleCellClick = (event, value) => {
  let x = event.clientX + 15
  let y = event.clientY + 15
  if (x + 300 > window.innerWidth) x = window.innerWidth - 320
  if (y + 200 > window.innerHeight) y = window.innerHeight - 220
  popup.pos.x = x
  popup.pos.y = y
  popup.data = value
  popup.show = true
}

// Abrir Modal de Error Romina Castro
const triggerRominaError = () => {
  showError.value = true
}

const updateVisibleColumns = (cols) => { currentVisibleCols.value = cols }

const exportExcel = () => {
  if (!selectedRows.value.length || !currentVisibleCols.value.length) return
  const headers = currentVisibleCols.value.map(c => c.label).join(',') + '\n'
  const rows = selectedRows.value.map(row => currentVisibleCols.value.map(col => row[col.field]).join(',')).join('\n')
  const csvContent = "data:text/csv;charset=utf-8," + headers + rows
  const link = document.createElement("a")
  link.setAttribute("href", encodeURI(csvContent))
  link.setAttribute("download", `Export_${props.type}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const gridColumns = ref(
  props.type === 'OT' 
  ? [ { field: 'nroot', label: 'NRO. OT', visible: true }, { field: 'estadoOt', label: 'ESTADO OT', visible: true }, { field: 'fechaMod', label: 'FECHA ULT. MOD', visible: true }, { field: 'tecnico', label: 'TÉCNICO', visible: true }, { field: 'almacen', label: 'ALMACÉN', visible: true }, { field: 'direccion', label: 'DIRECCIÓN', visible: true }, { field: 'codTarea', label: 'COD TAREA', visible: true } ]
  : [ { field: 'nroot', label: 'NRO OT', visible: true }, { field: 'estadoFm', label: 'ESTADO FM', visible: true }, { field: 'codMaterial', label: 'COD MATER', visible: true }, { field: 'nombreMat', label: 'NOMBRE M.', visible: true }, { field: 'cantidad', label: 'CANTIDAD', visible: true }, { field: 'almacen', label: 'ALMACÉN', visible: true }, { field: 'fechaDesc', label: 'FECHA DES', visible: true } ]
)

const mockData = ref(Array.from({ length: 45 }).map((_, i) => ({
  id: i, nroot: `OT-${1000 + i}`, estadoOt: i % 2 === 0 ? 'PENDIENTE' : 'CERRADO', estadoFm: 'ACTIVO', fechaMod: `2026-06-${(i%28)+1}`.padStart(2, '0'), tecnico: `Técnico ${i%5}`, almacen: `A-${i%3}`, direccion: `Calle ${i} Nro ${i*10}`, codTarea: `TSK-${i}`, codMaterial: `MAT-00${i}`, nombreMat: `Cable Coaxial RG${i}`, cantidad: i * 5, fechaDesc: `2026-06-15`
})))
</script>