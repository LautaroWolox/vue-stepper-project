<template>
  <div>
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
              <option value=""></option>
              <option value="AMBA">AMBA</option>
              <option value="CEN">Centro</option>
              <option value="NOR">Norte</option>
            </select>
            <span class="error-text" v-if="errorRegion">Debe seleccionar una Región para buscar.</span>
          </div>
          <div class="form-group"><label>Sub Región</label><select class="form-control" v-model="form.subRegion"><option value=""></option><option value="CABA">CABA</option><option value="GBA">GBA</option></select></div>
          <div class="form-group"><label>Centro Logístico</label><select class="form-control" v-model="form.centro"><option value=""></option><option value="CL1">Logística Norte</option></select></div>
          <div class="form-group"><label>Almacén</label><select class="form-control" v-model="form.almacen"><option value=""></option><option value="A1">Almacén Principal</option></select></div>
          <div class="form-group"><label>Técnico</label><input type="text" class="form-control" v-model="form.tecnico" placeholder="Buscar técnico..."></div>
          <div class="form-group"><label>Nro. OT</label><input type="text" class="form-control" v-model="form.ot" placeholder="Ej: 12345"></div>
          <div class="form-group"><label>Fecha Ult. Modif. Desde</label><input type="date" class="form-control" v-model="form.fechaDesde"></div>
          <div class="form-group"><label>Fecha Ult. Modif. Hasta</label><input type="date" class="form-control" v-model="form.fechaHasta" :disabled="!form.fechaDesde"></div>
        </div>
        
        <div style="text-align: center; margin-top: 10px;">
          <button class="btn" @click="handleSearch" style="margin-right: 10px;"><span class="material-icons btn-icon">search</span> BUSCAR</button>
          <button class="btn btn-danger" @click="resetForm"><span class="material-icons btn-icon">clear_all</span> LIMPIAR</button>
        </div>
      </div>
    </div>

    <div class="soft-accordion" v-if="hasSearched">
      <div class="soft-accordion-header" @click="openResults = !openResults">
        <span style="text-transform: uppercase;"><span class="material-icons" style="vertical-align: middle;">list_alt</span> GESTIÓN EN LOTE - {{ title }}</span>
        <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
      </div>
      
      <div class="soft-accordion-content" v-show="openResults">
        <div class="stepper-header" style="margin-bottom: 15px;">
          <div :class="['step-indicator', { active: currentStep === 1 }]"><span class="material-icons">touch_app</span> 1. Selección</div>
          <div :class="['step-indicator', { active: currentStep === 2 }]"><span class="material-icons">fact_check</span> 2. Revisión</div>
          <div :class="['step-indicator', { active: currentStep === 3 }]"><span class="material-icons">import_export</span> 3. Exportación</div>
        </div>

        <div v-show="currentStep === 1">
          <AdvancedGrid :data="mockData" :columns="gridColumns" v-model="selectedRows" @update:visibleCols="updateVisibleCols" @edit-ot="openEditPopup" @add-material="triggerRominaError" />
          <div style="text-align: right; margin-top: 20px;"><button class="btn" @click="currentStep = 2" :disabled="selectedRows.length === 0">Siguiente a Revisión <span class="material-icons btn-icon">arrow_forward</span></button></div>
        </div>

        <div v-if="currentStep === 2">
          <h3 style="color: #00838f;">Revisión de Gestión</h3>
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #cfd8dc;">
              <h4 style="margin-top: 0; color: #455a64;">Para Exportación</h4>
              <p style="font-size: 24px; font-weight: bold; color: #00bcd4; margin: 10px 0;">{{ selectedRows.length }}</p>
              <button class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" @click="openExportDetailPopup($event)">Ver Detalle</button>
            </div>
            <div style="flex: 1; min-width: 300px; background: #f0fbfc; padding: 20px; border-radius: 8px; border: 1px solid #b2ebf2;">
              <h4 style="margin-top: 0; color: #00838f;">OTs Modificadas</h4>
              <p style="font-size: 24px; font-weight: bold; color: #00bcd4; margin: 10px 0;">{{ modifiedOts.length }}</p>
              <ul style="padding-left: 20px; font-size: 13px;">
                <li v-for="(mod, index) in modifiedOts" :key="index" style="margin-bottom: 8px;">OT: <strong>{{ mod.ot.nroot }}</strong> <button class="btn btn-danger" style="padding: 2px 8px; font-size: 11px; margin-left: 10px;" @click="openModPopup($event, mod)">Ver Detalle</button></li>
              </ul>
              <p v-if="modifiedOts.length === 0" style="font-size: 13px; color: #90a4ae;">No se han validado cambios.</p>
            </div>
          </div>
          <div style="margin-top: 25px; display: flex; justify-content: space-between;">
            <button class="btn" @click="currentStep = 1"><span class="material-icons btn-icon">arrow_back</span> Atrás</button>
            <button class="btn" @click="currentStep = 3">Siguiente a Exportación <span class="material-icons btn-icon">arrow_forward</span></button>
          </div>
        </div>

        <div v-if="currentStep === 3">
          <h3 style="color: #00838f;"><span class="material-icons">file_download</span> Finalizar y Exportar</h3>
          <p>Se exportarán las <strong>{{ currentVisibleCols.length }}</strong> columnas visibles de los <strong>{{ selectedRows.length }}</strong> registros.</p>
          <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: space-between;">
            <button class="btn" @click="currentStep = 2"><span class="material-icons btn-icon">arrow_back</span> Atrás</button>
            <button class="btn" style="background: linear-gradient(135deg, #4caf50, #2e7d32);" @click="exportExcel"><span class="material-icons btn-icon">table_view</span> Descargar CSV</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Todos los Popups y Ventanas -->
    <FloatingPopup :show="popup.show" :position="popup.pos" :otData="popup.data" @accept="handleSaveOt" @cancel="popup.show = false" />
    <ModifiedPopup :show="modPopup.show" :position="modPopup.pos" :data="modPopup.data" @close="modPopup.show = false" />
    <ExportDetailPopup :show="exportPopup.show" :position="exportPopup.pos" :data="exportPopup.data" @close="exportPopup.show = false" />
    <ErrorModal :show="showError" @close="showError = false" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AdvancedGrid from './AdvancedGrid.vue'
import FloatingPopup from '../popup/FloatingPopup.vue'
import ModifiedPopup from '../popup/ModifiedPopup.vue'
import ExportDetailPopup from '../popup/ExportDetailPopup.vue'
import ErrorModal from '../modal/ErrorModal.vue'

const props = defineProps(['title', 'type'])

const openFilters = ref(true); const openResults = ref(true); const hasSearched = ref(false); const currentStep = ref(1)
const form = reactive({ region: '', subRegion: '', centro: '', almacen: '', tecnico: '', ot: '', fechaDesde: '', fechaHasta: '' })
const errorRegion = ref(false); const selectedRows = ref([]); const currentVisibleCols = ref([]); const modifiedOts = ref([]) 
const popup = reactive({ show: false, pos: { x: 0, y: 0 }, data: null })
const modPopup = reactive({ show: false, pos: { x: 0, y: 0 }, data: null })
const exportPopup = reactive({ show: false, pos: { x: 0, y: 0 }, data: [] })
const showError = ref(false)

const triggerRominaError = () => { showError.value = true }

const handleSearch = () => { errorRegion.value = false; if (!form.region) { errorRegion.value = true; return }; hasSearched.value = true; openFilters.value = false; currentStep.value = 1 }
const resetForm = () => { Object.keys(form).forEach(k => form[k] = ''); errorRegion.value = false; hasSearched.value = false; selectedRows.value = []; modifiedOts.value = [] }
const openEditPopup = (event, row) => { popup.pos.x = event.clientX + 10; popup.pos.y = event.clientY + 10; if (popup.pos.x + 550 > window.innerWidth) popup.pos.x = window.innerWidth - 560; if (popup.pos.y + 400 > window.innerHeight) popup.pos.y = window.innerHeight - 420; popup.data = row; popup.show = true }
const handleSaveOt = (modifiedData) => { modifiedOts.value.push(modifiedData); popup.show = false }
const openModPopup = (event, modData) => { modPopup.pos.x = event.clientX + 10; modPopup.pos.y = event.clientY + 10; if (modPopup.pos.x + 450 > window.innerWidth) modPopup.pos.x = window.innerWidth - 460; if (modPopup.pos.y + 300 > window.innerHeight) modPopup.pos.y = window.innerHeight - 320; modPopup.data = modData; modPopup.show = true }
const openExportDetailPopup = (event) => { exportPopup.pos.x = event.clientX + 10; exportPopup.pos.y = event.clientY + 10; if (exportPopup.pos.x + 500 > window.innerWidth) exportPopup.pos.x = window.innerWidth - 510; if (exportPopup.pos.y + 400 > window.innerHeight) exportPopup.pos.y = window.innerHeight - 420; exportPopup.data = selectedRows.value; exportPopup.show = true }
const updateVisibleCols = (cols) => { currentVisibleCols.value = cols }

const exportExcel = () => {
  if (!selectedRows.value.length || !currentVisibleCols.value.length) return
  const headers = currentVisibleCols.value.map(c => c.label).join(',') + '\n'
  const rows = selectedRows.value.map(row => currentVisibleCols.value.map(col => row[col.field]).join(',')).join('\n')
  const csvContent = "data:text/csv;charset=utf-8," + headers + rows
  const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", `Export_${props.type}.csv`)
  document.body.appendChild(link); link.click(); document.body.removeChild(link)
}

const gridColumns = ref(props.type === 'OT' ? [ { field: 'nroot', label: 'NRO. OT', visible: true }, { field: 'estadoOt', label: 'ESTADO OT', visible: true }, { field: 'fechaMod', label: 'FECHA ULT. MOD', visible: true }, { field: 'tecnico', label: 'TÉCNICO', visible: true }, { field: 'almacen', label: 'ALMACÉN', visible: true }, { field: 'direccion', label: 'DIRECCIÓN', visible: true }, { field: 'codTarea', label: 'COD TAREA', visible: true } ] : [ { field: 'nroot', label: 'NRO OT', visible: true }, { field: 'estadoFm', label: 'ESTADO FM', visible: true }, { field: 'codMaterial', label: 'COD MATER', visible: true }, { field: 'nombreMat', label: 'NOMBRE M.', visible: true }, { field: 'cantidad', label: 'CANTIDAD', visible: true }, { field: 'almacen', label: 'ALMACÉN', visible: true }, { field: 'fechaDesc', label: 'FECHA DES', visible: true } ])
const mockData = ref(Array.from({ length: 45 }).map((_, i) => ({ id: i, nroot: `OT-${1000 + i}`, estadoOt: i % 2 === 0 ? 'PENDIENTE' : 'CERRADO', estadoFm: 'ACTIVO', fechaMod: `2026-06-${(i%28)+1}`.padStart(2, '0'), tecnico: `Técnico ${i%5}`, almacen: `A-${i%3}`, direccion: `Calle ${i} Nro ${i*10}`, codTarea: `TSK-${i}`, codMaterial: `MAT-00${i}`, nombreMat: `Cable Coaxial RG${i}`, cantidad: i * 5, fechaDesc: `2026-06-15` })))
</script>