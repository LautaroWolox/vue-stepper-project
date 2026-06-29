<template>
  <div style="position: relative;">
    
    <!-- PANTALLA DE CARGA (Para Buscar y Certificar) -->
    <div v-if="isLoading" class="popup-loader" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background: rgba(255,255,255,0.9);">
      <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/><rect x="55" y="95" width="10" height="25" fill="#78909C"/><rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/><rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/><rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/><g class="code-lines"><rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/><rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/><rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/><rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/></g><rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/><path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/><circle cx="150" cy="50" r="18" fill="#FFB74D"/><path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/><path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/><path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
      </svg>
      <span style="margin-top: 15px; color: #00838f; font-weight: bold;">{{ loadingMsg }}</span>
    </div>

    <!-- Botón Volver -->
    <div style="margin-bottom: 15px;">
      <button class="btn btn-danger" style="border-radius: 20px; padding: 8px 25px;" @click="$emit('volver')">
        <span class="material-icons btn-icon">arrow_back</span> VOLVER A BÚSQUEDA
      </button>
    </div>

    <!-- Acordeón 1: Detalle del Acta -->
    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openDetalle = !openDetalle">
        <span><span class="material-icons">info</span> DETALLE DE ACTA</span>
        <span class="material-icons">{{ openDetalle ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openDetalle">
        
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="form-group"><label>Numero de Acta</label><input type="text" class="form-control" :value="acta.nro_acta" disabled></div>
          <div class="form-group"><label>Provincia</label><input type="text" class="form-control" :value="acta.provincia" disabled></div>
          <div class="form-group"><label>Empresa Contratista</label><input type="text" class="form-control" :value="acta.contratista" disabled></div>
          <div class="form-group" style="align-items: center;">
            <label>Calificación</label>
            <div class="star-rating">
              <span class="material-icons" v-for="star in 5" :key="star" :class="{ active: star <= calificacion }" @click="calificacion = star">star</span>
            </div>
          </div>
        </div>
        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr); border-bottom: 2px solid #eceff1; padding-bottom: 15px; margin-bottom: 15px;">
          <div class="form-group"><label>Sociedad</label><input type="text" class="form-control" :value="acta.sociedad" disabled></div>
          <div class="form-group"><label>Tipo de Contrato</label><input type="text" class="form-control" :value="acta.tipo_contrato" disabled></div>
          <div class="form-group"><label>Periodo</label><input type="text" class="form-control" :value="acta.periodo" disabled></div>
          <div class="form-group"><label>Estado</label><input type="text" class="form-control" :value="acta.estado" disabled></div>
        </div>

        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="form-group"><label>N° de OT</label><input type="text" class="form-control" v-model="filtrosOt.nroOt"></div>
          <div class="form-group"><label>CODIGO TAREA</label><input type="text" class="form-control" v-model="filtrosOt.codigoTarea"></div>
          <div class="form-group">
            <label>ESTADO REGLAS</label>
            <select class="form-control" v-model="filtrosOt.estadoReglas">
              <option value=""></option><option value="INICIAL">INICIAL</option><option value="Verificado">Verificado</option>
              <option value="Reglas A Aplicadas">Reglas A Aplicadas</option><option value="Reglas B Aplicadas">Reglas B Aplicadas</option>
              <option value="Reglas A Validadas">Reglas A Validadas</option><option value="Reglas B Validadas">Reglas B Validadas</option>
            </select>
          </div>
          <div class="form-group"><label>TECH-NUM</label><input type="text" class="form-control" v-model="filtrosOt.techNum"></div>
        </div>
        <div class="form-grid" style="grid-template-columns: 1fr 3fr;">
          <div class="form-group">
            <label>EXCLUIDA</label>
            <select class="form-control" v-model="filtrosOt.excluida"><option value=""></option><option value="S">Si</option><option value="N">No</option></select>
          </div>
        </div>

        <div style="text-align: center; margin-top: 10px;">
          <button class="btn" style="border-radius: 20px; padding: 10px 30px; background: #00bcd4; margin-right: 15px;" @click="simularCarga('Aplicando filtros de búsqueda...')">BUSCAR</button>
          <button class="btn btn-danger" style="border-radius: 20px; padding: 10px 30px; margin-right: 15px;" @click="limpiarFiltrosOt">LIMPIAR</button>
          <br><br>
          <button class="btn" style="border-radius: 20px; padding: 10px 30px; background: #4caf50;" @click="simularCarga('Certificando Acta...')">CERTIFICAR</button>
        </div>
      </div>
    </div>

    <!-- Acordeón 2: Grilla OTs del Acta -->
    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openOts = !openOts">
        <span><span class="material-icons" style="font-size: 20px;">manage_accounts</span> ORDENES DE TRABAJO</span>
        <span class="material-icons">{{ openOts ? 'remove' : 'add' }}</span>
      </div>
      
      <div class="soft-accordion-content" v-show="openOts" style="padding: 0;">
        
        <!-- SELECTOR DE COLUMNAS -->
        <div class="column-config-wrapper">
          <button class="btn-columnas" @click="showColConfig = !showColConfig">
            <span class="material-icons" style="font-size: 18px;">view_column</span> SELECCIONAR COLUMNAS
          </button>
          <div class="column-config-menu" v-if="showColConfig">
            <label v-for="col in otColumns" :key="col.field">
              <input type="checkbox" v-model="col.visible" class="custom-checkbox"> {{ col.label }}
            </label>
          </div>
        </div>

        <!-- TABLA DINÁMICA -->
        <div class="table-responsive" style="border: none; border-top: 1px solid #e0e0e0; max-height: 400px;">
          <table class="advanced-grid">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;"><input type="checkbox" class="custom-checkbox" @change="toggleSelectAllPage" :checked="isAllPageSelected"></th>
                <th v-for="col in visibleCols" :key="col.field">
                  <div class="resizable-header">{{ col.label }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedData" :key="row.id" :class="{'active-row': row.selected, 'excluded-row': row.excluida === 'S'}">
                <td style="text-align: center;">
                  <input type="checkbox" class="custom-checkbox" v-model="row.selected" :disabled="row.excluida === 'S'">
                </td>
                <td v-for="col in visibleCols" :key="col.field">
                  <span v-if="col.field === 'nro_ot' && row.excluida === 'N'" class="clickable-link" @click="openOtDetail(row.nro_ot)">{{ row[col.field] }}</span>
                  <span v-else-if="col.field === 'nro_ot' && row.excluida === 'S'">{{ row[col.field] }}</span>
                  <span v-else-if="col.field === 'nota'" style="display: flex; justify-content: center;">
                    <span class="material-icons note-icon" @click="openNotaPopup">edit_note</span>
                  </span>
                  <span v-else>{{ row[col.field] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-footer">
          <div class="grid-footer-left">
            <button class="icon-btn" title="Excluir" @click="openExcluirPopup" :disabled="selectedRowsCount === 0">
              <span class="material-icons" style="font-size: 24px;">delete</span>
            </button>
          </div>
          
          <div class="modern-pagination">
            <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage = 1">first_page</span>
            <span class="material-icons icon-nav" :class="{ disabled: currentPage === 1 }" @click="currentPage > 1 && currentPage--">chevron_left</span>
            <span>Página <input type="number" v-model.number="currentPage" min="1" :max="totalPages || 1"> de {{ totalPages || 1 }}</span>
            <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage < totalPages && currentPage++">chevron_right</span>
            <span class="material-icons icon-nav" :class="{ disabled: currentPage >= totalPages }" @click="currentPage = totalPages">last_page</span>
            <select class="form-control" style="width: auto; padding: 4px; margin-left: 10px;" v-model="itemsPerPage" @change="currentPage = 1">
              <option :value="10">10 v</option><option :value="20">20 v</option><option :value="50">50 v</option>
            </select>
          </div>
        </div>

        <!-- Botones de Acción Globales del Acta -->
        <div style="padding: 15px; border-top: 1px solid #eceff1; display: flex; justify-content: space-between;">
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-danger" style="border-radius: 20px;" @click="openExportarActa"><span class="material-icons btn-icon">file_download</span> EXPORTAR ACTA</button>
            <button class="btn btn-danger" style="border-radius: 20px;" @click="showTraspaso = true"><span class="material-icons btn-icon">swap_horiz</span> GESTIONAR TRASPASO</button>
          </div>
          <div>
            <button class="btn" style="background: #00bcd4; border-radius: 20px;" @click="simularCarga('Validando OTs...')"><span class="material-icons btn-icon">fact_check</span> VALIDAR/VERIFICAR</button>
          </div>
        </div>

      </div>
    </div>

    <!-- Popups -->
    <DetalleNotaPopup :show="showNota" @close="showNota = false" />
    <DetalleOtPopup :show="showOt" :otNumber="selectedOt" @close="showOt = false" />
    <ExcluirOtPopup :show="showExcluir" @close="showExcluir = false" @confirmar="marcarExcluidas" />
    
    <!-- Al popup de exportar le pasamos solo las OTs seleccionadas -->
    <ExportarActaPopup :show="showExportar" :otsParaExportar="otsSeleccionadas" @close="showExportar = false" />
    <GestionarTraspasoPopup :show="showTraspaso" @close="showTraspaso = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import DetalleNotaPopup from '../popup/DetalleNotaPopup.vue'
import DetalleOtPopup from '../popup/DetalleOtPopup.vue'
import ExcluirOtPopup from '../popup/ExcluirOtPopup.vue'
import ExportarActaPopup from '../popup/ExportarActaPopup.vue'
import GestionarTraspasoPopup from '../popup/GestionarTraspasoPopup.vue'

const props = defineProps(['acta'])
const emit = defineEmits(['volver'])

const calificacion = ref(0)
const openDetalle = ref(true)
const openOts = ref(true)
const isLoading = ref(false)
const loadingMsg = ref('')

const showColConfig = ref(false)
const showNota = ref(false)
const showOt = ref(false)
const showExcluir = ref(false)
const showExportar = ref(false)
const showTraspaso = ref(false)
const selectedOt = ref('')

const filtrosOt = reactive({ nroOt: '', codigoTarea: '', estadoReglas: '', techNum: '', excluida: '' })

// 26 Columnas
const otColumns = reactive([
  { field: 'nro_ot', label: 'NRO_OT', visible: true }, { field: 'fecha_cierre', label: 'FECHA_CIERRE', visible: true }, { field: 'codigo_tarea', label: 'CÓDIGO_TAREA', visible: true },
  { field: 'direccion', label: 'DIRECCION', visible: true }, { field: 'ciudad', label: 'CIUDAD', visible: true }, { field: 'sector', label: 'SECTOR', visible: true },
  { field: 'provincia', label: 'PROVINCIA', visible: true }, { field: 'pais', label: 'PAIS', visible: true }, { field: 'base', label: 'BASE', visible: true },
  { field: 'nota', label: 'NOTA', visible: true }, { field: 'region', label: 'REGION', visible: false }, { field: 'contratista', label: 'CONTRATISTA', visible: false },
  { field: 'contrato', label: 'CONTRATO', visible: false }, { field: 'sociedad', label: 'SOCIEDAD', visible: false }, { field: 'area', label: 'AREA', visible: false },
  { field: 'tech_num', label: 'TECH_NUM', visible: false }, { field: 'actividades', label: 'ACTIVIDADES', visible: false }, { field: 'cmos', label: 'CMOS', visible: false },
  { field: 'reglas_validadas', label: 'REGLAS VALIDADAS', visible: false }, { field: 'excluida', label: 'EXCLUIDA', visible: false }, { field: 'motivo_exclusion', label: 'MOTIVO_EXCLUSION', visible: false },
  { field: 'incluir', label: 'INCLUIR', visible: false }, { field: 'origen', label: 'ORIGEN', visible: false }, { field: 'nota_traspaso', label: 'NOTA TRASPASO', visible: false },
  { field: 'destino_traspaso', label: 'DESTINO TRASPASO', visible: false }, { field: 'nota_destino', label: 'NOTA DESTINO TRASPASO', visible: false }
])

const visibleCols = computed(() => otColumns.filter(c => c.visible))

// Generar 50 OTs de prueba para el Paginado
const mockOts = ref([])
onMounted(() => {
  for (let i = 1; i <= 50; i++) {
    mockOts.value.push({
      id: i,
      selected: false,
      nro_ot: `J0000000000257994${i.toString().padStart(2, '0')}`,
      fecha_cierre: '18/06/2026 12:35:45',
      codigo_tarea: '9HDA0 | DOM - ALTAS HFC',
      direccion: `SARMIENTO ${2600 + i}`,
      ciudad: 'GRAL PUEYRREDON',
      sector: 'MPS189',
      provincia: 'BUENOS AIRES',
      pais: 'ARGENTINA',
      base: 'MAR DEL PLATA',
      excluida: i % 15 === 0 ? 'S' : 'N', // Simula algunas ya excluidas
      nota: ''
    })
  }
})

// PAGINADO
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(mockOts.value.length / itemsPerPage.value))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return mockOts.value.slice(start, start + itemsPerPage.value)
})

// SELECT ALL LOGIC
const isAllPageSelected = computed(() => {
  const selectable = paginatedData.value.filter(r => r.excluida === 'N')
  if (selectable.length === 0) return false
  return selectable.every(r => r.selected)
})

const toggleSelectAllPage = (e) => {
  const checked = e.target.checked
  paginatedData.value.forEach(row => {
    if (row.excluida === 'N') row.selected = checked
  })
}

const otsSeleccionadas = computed(() => mockOts.value.filter(ot => ot.selected))
const selectedRowsCount = computed(() => otsSeleccionadas.value.length)

// FUNCIONES
const simularCarga = (msg) => { isLoading.value = true; loadingMsg.value = msg; setTimeout(() => { isLoading.value = false }, 1200) }
const limpiarFiltrosOt = () => { Object.keys(filtrosOt).forEach(k => filtrosOt[k] = '') }
const openNotaPopup = () => { showNota.value = true }
const openOtDetail = (nro) => { selectedOt.value = nro; showOt.value = true }

const openExcluirPopup = () => {
  if (selectedRowsCount.value > 0) showExcluir.value = true
}

const marcarExcluidas = () => {
  mockOts.value.forEach(ot => {
    if (ot.selected) {
      ot.excluida = 'S'
      ot.selected = false // Se deseleccionan al excluir
    }
  })
  showExcluir.value = false
}

const openExportarActa = () => {
  if (otsSeleccionadas.value.length === 0) {
    alert("Por favor, seleccione al menos una OT de la grilla para exportar.")
    return
  }
  showExportar.value = true
}
</script>