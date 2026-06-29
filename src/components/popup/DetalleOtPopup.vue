<template>
  <div
    v-if="show"
    class="floating-popup ot-detail-popup"
    :class="{ expanded: isExpanded }"
    :style="!isExpanded ? { top: pos.y + 'px', left: pos.x + 'px' } : {}"
  >
    <div class="floating-popup-frame" @dblclick="toggleExpand">
      <div class="popup-header ot-popup-header" @mousedown="startDrag">
        <div class="popup-title ot-popup-title">{{ displayOtNumber }}</div>
        <div class="popup-controls">
          <span class="material-icons popup-control" @click.stop="toggleExpand">{{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}</span>
          <span class="material-icons popup-control close-control" @click="$emit('close')">close</span>
        </div>
      </div>
    </div>

    <div class="popup-body ot-popup-body">
      <div v-if="isLoading" class="popup-loader ot-loader">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4" />
          <rect x="55" y="95" width="10" height="25" fill="#78909C" />
          <rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2" />
          <rect x="20" y="35" width="80" height="60" fill="#263238" rx="5" />
          <rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2" />
          <g class="code-lines">
            <rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;" />
            <rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;" />
            <rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;" />
            <rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;" />
          </g>
          <rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)" />
          <path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7" />
          <circle cx="150" cy="50" r="18" fill="#FFB74D" />
          <path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round" />
          <rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3" />
          <path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round" />
          <path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round" />
        </svg>
        <span class="loader-text">{{ loadingMsg }}</span>
      </div>

      <section class="ot-info-card">
        <div class="form-group">
          <label>Tarea</label>
          <input type="text" class="form-control" :value="otInfo.tarea" disabled />
        </div>
        <div class="form-group">
          <label>Domicilio</label>
          <input type="text" class="form-control" :value="otInfo.domicilio" disabled />
        </div>
        <div class="form-group">
          <label>Clase Ot</label>
          <input type="text" class="form-control" :value="otInfo.claseOt" disabled />
        </div>
        <div class="form-group">
          <label>Tecnico Cierre</label>
          <input type="text" class="form-control" :value="otInfo.tecnicoCierre" disabled />
        </div>
        <div class="form-group">
          <label>Nro Cliente</label>
          <input type="text" class="form-control" :value="otInfo.nroCliente" disabled />
        </div>
      </section>

      <nav class="ot-tabs">
        <button type="button" :class="['ot-tab', { active: activeTab === 'actividades' }]" @click="activeTab = 'actividades'">Actividades</button>
        <button type="button" :class="['ot-tab', { active: activeTab === 'base' }]" @click="activeTab = 'base'">Base Instalada</button>
        <button type="button" :class="['ot-tab', { active: activeTab === 'historial' }]" @click="activeTab = 'historial'">Historial del domicilio</button>
        <button type="button" :class="['ot-tab', { active: activeTab === 'materiales' }]" @click="activeTab = 'materiales'">Materiales</button>
        <button type="button" :class="['ot-tab', { active: activeTab === 'siniestros' }]" @click="activeTab = 'siniestros'">Siniestros</button>
      </nav>

      <section class="tab-panel">
        <div v-show="activeTab === 'actividades'">
          <h4 class="section-title">Actividades Originales</h4>
          <div class="ot-table-wrap compact-table">
            <table class="ot-detail-grid">
              <thead>
                <tr>
                  <th>COD ACTIVIDAD</th>
                  <th>ACTIVIDAD</th>
                  <th>CANTIDAD</th>
                  <th>COD CMO</th>
                  <th>CMO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="actividad in actividadesOriginales" :key="actividad.cod">
                  <td>{{ actividad.cod }}</td>
                  <td>{{ actividad.actividad }}</td>
                  <td>{{ actividad.cantidad }}</td>
                  <td>{{ actividad.codCmo }}</td>
                  <td>{{ actividad.cmo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GridPagination :page="1" :total-pages="1" />
        </div>

        <div v-show="activeTab === 'base'">
          <div class="section-header">
            <h4 class="section-title">Base Instalada</h4>
            <button type="button" class="btn-cyan" @click="consultarBase">CONSULTAR BASE INSTALADA</button>
          </div>
          <div class="ot-table-wrap compact-table">
            <table class="ot-detail-grid">
              <thead>
                <tr>
                  <th>BASE INSTALADA</th>
                  <th>MODELO</th>
                  <th>NRO SERIE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedBase" :key="item.serie">
                  <td>{{ item.base }}</td>
                  <td>{{ item.modelo }}</td>
                  <td>{{ item.serie }}</td>
                </tr>
                <tr v-if="baseData.length === 0">
                  <td colspan="3" class="empty-message">Presione “CONSULTAR BASE INSTALADA” para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GridPagination v-if="baseData.length > 0" v-model:page="basePage" :total-pages="totalBasePages" />
        </div>

        <div v-show="activeTab === 'historial'">
          <div class="section-header">
            <h4 class="section-title">Historial del domicilio</h4>
            <button type="button" class="btn-cyan-outline export-history-btn" @click="simulateLoad('Exportando historial completo...')">EXPORTAR HISTORIAL COMPLETO</button>
          </div>

          <div class="ot-table-wrap historial-table-wrap">
            <table class="ot-detail-grid historial-grid">
              <thead>
                <tr>
                  <th class="expand-col"></th>
                  <th>NRO OT</th>
                  <th>FECHA CREACION OT</th>
                  <th>FECHA CIERRE</th>
                  <th>NRO ACTA</th>
                  <th>ESTADO ACTA</th>
                  <th>EMPRESA CONTRATISTA</th>
                  <th>OT RED</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="hist in paginatedHistorial" :key="hist.ot">
                  <tr>
                    <td class="expand-col">
                      <button type="button" class="expand-row-btn" @click="toggleHistorialRow(hist.ot)">
                        <span class="material-icons">{{ isHistorialExpanded(hist.ot) ? 'arrow_drop_down' : 'arrow_right' }}</span>
                      </button>
                    </td>
                    <td class="ot-link-cell">{{ hist.ot }}</td>
                    <td>{{ hist.creacion }}</td>
                    <td>{{ hist.cierre }}</td>
                    <td>{{ hist.acta }}</td>
                    <td>{{ hist.estado }}</td>
                    <td>{{ hist.contra }}</td>
                    <td>{{ hist.red }}</td>
                  </tr>
                  <tr v-if="isHistorialExpanded(hist.ot)" class="subgrid-row">
                    <td class="subgrid-toggle-cell">
                      <span class="material-icons subgrid-open-icon">subdirectory_arrow_right</span>
                    </td>
                    <td colspan="7" class="subgrid-cell">
                      <div class="subgrid-scroll">
                        <table class="historial-subgrid">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Actividad</th>
                              <th>Cantidad</th>
                              <th>Nro NC/ND</th>
                              <th>Estado NC/ND</th>
                              <th>Estado Actividad</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="actividad in hist.actividades" :key="`${hist.ot}-${actividad.codigo}`">
                              <td>{{ actividad.codigo }}</td>
                              <td>{{ actividad.actividad }}</td>
                              <td>{{ actividad.cantidad }}</td>
                              <td>{{ actividad.nroNcNd }}</td>
                              <td>{{ actividad.estadoNcNd }}</td>
                              <td>{{ actividad.estadoActividad }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="historialData.length === 0">
                  <td colspan="8" class="empty-message">No hay registros en el historial.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GridPagination v-model:page="histPage" :total-pages="totalHistPages" />
        </div>

        <div v-show="activeTab === 'materiales'">
          <div class="section-header">
            <h4 class="section-title">Materiales</h4>
            <button type="button" class="btn-cyan" @click="consultarMateriales">CONSULTAR MATERIALES</button>
          </div>
          <div class="ot-table-wrap compact-table">
            <table class="ot-detail-grid">
              <thead>
                <tr>
                  <th>COD MATERIAL</th>
                  <th>DESC MATERIAL</th>
                  <th>CANTIDAD</th>
                  <th>ACCION</th>
                  <th>ESTADO</th>
                  <th>MATERIAL VALIDADO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedMateriales" :key="item.cod">
                  <td>{{ item.cod }}</td>
                  <td>{{ item.desc }}</td>
                  <td>{{ item.cant }}</td>
                  <td>{{ item.accion }}</td>
                  <td>{{ item.estado }}</td>
                  <td>{{ item.validado }}</td>
                </tr>
                <tr v-if="materialesData.length === 0">
                  <td colspan="6" class="empty-message">Presione “CONSULTAR MATERIALES” para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GridPagination v-if="materialesData.length > 0" v-model:page="matPage" :total-pages="totalMatPages" />
        </div>

        <div v-show="activeTab === 'siniestros'" class="siniestros-panel">
          <div class="siniestro-fields">
            <div class="form-group inline-field">
              <label>Nro EHS</label>
              <input type="text" class="form-control" v-model="siniestro.nroEhs" />
            </div>
            <div class="form-group inline-field">
              <label>Nro OI</label>
              <input type="text" class="form-control" v-model="siniestro.nroOi" />
            </div>
          </div>
          <div class="siniestro-actions">
            <button type="button" class="btn btn-danger siniestro-btn" @click="limpiarSiniestro">CANCELAR</button>
            <button type="button" class="btn siniestro-btn accept-btn" @click="simulateLoad('Guardando siniestro...')">ACEPTAR</button>
          </div>
        </div>
      </section>

      <section class="resultantes-card">
        <h4 class="section-title">Actividades Resultantes</h4>
        <div class="ot-table-wrap resultantes-table-wrap">
          <table class="ot-detail-grid resultantes-grid">
            <thead>
              <tr>
                <th class="select-col"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
                <th>COD ACTIVIDAD</th>
                <th>ACTIVIDAD</th>
                <th>CANTIDAD</th>
                <th>COD CMO</th>
                <th>CMO</th>
                <th>REGLA TIPO</th>
                <th>REGLA APLICAD.</th>
                <th>COMENTARIO</th>
                <th>MOTIVO</th>
                <th>ESTADO ACTIVO</th>
                <th>VALIDADA</th>
                <th>NRO ND/NC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="act in paginatedActResultantes" :key="act.id" :class="{ 'active-row': act.selected }">
                <td class="select-col"><input type="checkbox" v-model="act.selected" @change="checkSelectAll" /></td>
                <td>{{ act.cod }}</td>
                <td>{{ act.actividad }}</td>
                <td>{{ act.cantidad }}</td>
                <td>{{ act.codCmo }}</td>
                <td>{{ act.cmo }}</td>
                <td>{{ act.regla }}</td>
                <td>{{ act.aplicada }}</td>
                <td>{{ act.comentario }}</td>
                <td>{{ act.motivo }}</td>
                <td>{{ act.estado }}</td>
                <td>{{ act.validada }}</td>
                <td>{{ act.nroNdNc }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="resultantes-footer">
          <div class="grid-footer-left">
            <button class="icon-btn" title="Exportar a Excel" @click="simulateLoad('Exportando actividades resultantes...')">
              <span class="material-icons">file_download</span>
            </button>
            <button class="icon-btn" title="Eliminar Seleccionados" @click="eliminarSeleccionados">
              <span class="material-icons">delete</span>
            </button>
          </div>
          <GridPagination v-model:page="actPage" :total-pages="totalActPages" />
        </div>
      </section>
    </div>

    <div class="popup-actions ot-actions">
      <button class="btn validate-btn" @click="simulateLoad('Validando actividades...')">VALIDAR ACTIVIDADES</button>
      <button class="btn save-btn" @click="simulateLoad('Guardando cambios...')">GUARDAR CAMBIOS</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  otNumber: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const GridPagination = defineComponent({
  name: 'GridPagination',
  props: {
    page: { type: Number, default: 1 },
    totalPages: { type: Number, default: 1 }
  },
  emits: ['update:page'],
  setup(componentProps, { emit: componentEmit }) {
    const setPage = (nextPage) => {
      const lastPage = componentProps.totalPages || 1
      const normalized = Math.min(Math.max(nextPage, 1), lastPage)
      componentEmit('update:page', normalized)
    }

    return () => h('div', { class: 'modern-pagination detail-pagination' }, [
      h('span', { class: ['material-icons', 'icon-nav', { disabled: componentProps.page === 1 }], onClick: () => setPage(1) }, 'first_page'),
      h('span', { class: ['material-icons', 'icon-nav', { disabled: componentProps.page === 1 }], onClick: () => setPage(componentProps.page - 1) }, 'chevron_left'),
      h('span', { class: 'page-text' }, [
        'Página ',
        h('input', {
          value: componentProps.page,
          min: 1,
          max: componentProps.totalPages || 1,
          type: 'number',
          onInput: (event) => setPage(Number(event.target.value || 1))
        }),
        ` de ${componentProps.totalPages || 1}`
      ]),
      h('span', { class: ['material-icons', 'icon-nav', { disabled: componentProps.page >= componentProps.totalPages }], onClick: () => setPage(componentProps.page + 1) }, 'chevron_right'),
      h('span', { class: ['material-icons', 'icon-nav', { disabled: componentProps.page >= componentProps.totalPages }], onClick: () => setPage(componentProps.totalPages || 1) }, 'last_page')
    ])
  }
})

const activeTab = ref('actividades')
const pos = ref({ x: 20, y: 20 })
const isExpanded = ref(false)
const isDragging = ref(false)
const isLoading = ref(false)
const loadingMsg = ref('')
const expandedHistorial = ref([])
const selectAll = ref(false)

let startX = 0
let startY = 0
let initialX = 0
let initialY = 0

const displayOtNumber = computed(() => props.otNumber || 'M00966068')

const otInfo = reactive({
  tarea: 'DOM - ALTAS HFC',
  domicilio: 'DE LUJAN NTRA SRA 1525',
  claseOt: 'New Connect',
  tecnicoCierre: '23TID240',
  nroCliente: '8.10081755121E15'
})

const siniestro = reactive({
  nroEhs: '',
  nroOi: ''
})

const actividadesOriginales = ref([
  { cod: '20050', actividad: 'CPE dañado - Falla fuente / No enciende', cantidad: '1', codCmo: '0000001', cmo: 'NO HAY CMO' },
  { cod: '7982', actividad: 'Validar Niveles en D-Tec', cantidad: '1', codCmo: '0000001', cmo: 'NO HAY CMO' },
  { cod: 'AS0008', actividad: 'Encontrado bien', cantidad: '1', codCmo: '0000001', cmo: 'NO HAY CMO' }
])

const historialData = ref([])
const histPage = ref(1)
const histPerPage = ref(10)
const totalHistPages = computed(() => Math.ceil(historialData.value.length / histPerPage.value) || 1)
const paginatedHistorial = computed(() => {
  const start = (histPage.value - 1) * histPerPage.value
  return historialData.value.slice(start, start + histPerPage.value)
})

const baseData = ref([])
const basePage = ref(1)
const basePerPage = ref(10)
const totalBasePages = computed(() => Math.ceil(baseData.value.length / basePerPage.value) || 1)
const paginatedBase = computed(() => {
  const start = (basePage.value - 1) * basePerPage.value
  return baseData.value.slice(start, start + basePerPage.value)
})

const materialesData = ref([])
const matPage = ref(1)
const matPerPage = ref(10)
const totalMatPages = computed(() => Math.ceil(materialesData.value.length / matPerPage.value) || 1)
const paginatedMateriales = computed(() => {
  const start = (matPage.value - 1) * matPerPage.value
  return materialesData.value.slice(start, start + matPerPage.value)
})

const actResultantes = ref([])
const actPage = ref(1)
const actPerPage = ref(10)
const totalActPages = computed(() => Math.ceil(actResultantes.value.length / actPerPage.value) || 1)
const paginatedActResultantes = computed(() => {
  const start = (actPage.value - 1) * actPerPage.value
  return actResultantes.value.slice(start, start + actPerPage.value)
})

const makeHistorialActividades = (index) => ([
  { codigo: '20050', actividad: 'CPE dañado - Falla fuente / No enciende', cantidad: '1', nroNcNd: index % 2 ? '' : `NC10${index}`, estadoNcNd: index % 2 ? '' : 'En Curso', estadoActividad: 'N' },
  { codigo: '7982', actividad: 'Validar Niveles en D-Tec', cantidad: '1', nroNcNd: '', estadoNcNd: '', estadoActividad: 'N' },
  { codigo: 'AS0008', actividad: 'Encontrado bien', cantidad: '1', nroNcNd: '', estadoNcNd: '', estadoActividad: 'N' }
])

const loadMockData = () => {
  historialData.value = Array.from({ length: 18 }, (_, index) => {
    const id = index + 1
    const baseOt = id === 1 ? displayOtNumber.value : `J0000000000000325${String(290 + id).padStart(3, '0')}`
    return {
      ot: baseOt,
      creacion: id === 1 ? '10/06/2026 17:10:02' : `2024-09-${String(10 + (id % 18)).padStart(2, '0')} 12:15:01.0`,
      cierre: id === 1 ? '13/06/2026 12:04:01' : `2024-09-${String(10 + (id % 18)).padStart(2, '0')} 12:19:21.0`,
      acta: id === 1 ? 'A2732' : `A24${String(10 + id).padStart(2, '0')}`,
      estado: id % 3 === 0 ? 'En Curso' : 'Certificada',
      contra: id === 1 ? 'NET AND WORK S.A.' : 'ARY COMUNICACIONES S.A.',
      red: id % 2 === 0 ? 'S' : 'N',
      actividades: makeHistorialActividades(id)
    }
  })

  actResultantes.value = Array.from({ length: 50 }, (_, index) => {
    const id = index + 1
    return {
      id,
      selected: index === 0,
      cod: `7050${String(id).padStart(2, '0')}`,
      actividad: id === 1 ? 'ACOMETIDA SOLO INT...' : `ACTIVIDAD RESULTANTE ${id}`,
      cantidad: '1',
      codCmo: `50214${String(90 + id)}`,
      cmo: 'INST.D/ACOMETIDA HFC',
      regla: 'E3',
      aplicada: `E3IX00001AR-7050${String(id).padStart(2, '0')}`,
      comentario: '',
      motivo: 'APLICACION DE REGLAS',
      estado: 'S',
      validada: 'N',
      nroNdNc: ''
    }
  })
}

const consultarBase = () => {
  simulateLoad('Consultando Base Instalada...')
  setTimeout(() => {
    baseData.value = Array.from({ length: 25 }, (_, index) => ({
      base: `00:1A:2B:${String(index + 1).padStart(2, '0')} (CM)`,
      modelo: index % 2 ? 'Sagemcom' : 'Technicolor',
      serie: `SA1908${String(index + 1).padStart(4, '0')}`
    }))
  }, 700)
}

const consultarMateriales = () => {
  simulateLoad('Consultando Materiales...')
  setTimeout(() => {
    materialesData.value = Array.from({ length: 35 }, (_, index) => ({
      cod: `MAT-90${String(index + 1).padStart(3, '0')}`,
      desc: index % 2 ? 'Cable Coaxial RG6' : 'Conector F',
      cant: (index % 5) + 1,
      accion: index % 2 ? 'Instalado' : 'Recuperado',
      estado: index % 3 ? 'OK' : 'Pendiente',
      validado: index % 3 ? 'Si' : 'No'
    }))
  }, 700)
}

const toggleHistorialRow = (ot) => {
  if (expandedHistorial.value.includes(ot)) {
    expandedHistorial.value = expandedHistorial.value.filter((item) => item !== ot)
    return
  }
  expandedHistorial.value = [ot]
}

const isHistorialExpanded = (ot) => expandedHistorial.value.includes(ot)

const toggleSelectAll = (event) => {
  const checked = event.target.checked
  selectAll.value = checked
  paginatedActResultantes.value.forEach((row) => { row.selected = checked })
}

const checkSelectAll = () => {
  if (paginatedActResultantes.value.length === 0) {
    selectAll.value = false
    return
  }
  selectAll.value = paginatedActResultantes.value.every((row) => row.selected)
}

const eliminarSeleccionados = () => {
  actResultantes.value = actResultantes.value.filter((row) => !row.selected)
  selectAll.value = false
}

const limpiarSiniestro = () => {
  siniestro.nroEhs = ''
  siniestro.nroOi = ''
}

const centerPopup = () => {
  const width = Math.min(1200, window.innerWidth * 0.95)
  const height = Math.min(760, window.innerHeight * 0.9)
  pos.value = {
    x: Math.max((window.innerWidth - width) / 2, 12),
    y: Math.max((window.innerHeight - height) / 2, 12)
  }
}

const simulateLoad = (message) => {
  isLoading.value = true
  loadingMsg.value = message
  setTimeout(() => { isLoading.value = false }, 850)
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const startDrag = (event) => {
  if (isExpanded.value) return
  if (event.target.closest('.popup-controls')) return
  isDragging.value = true
  startX = event.clientX
  startY = event.clientY
  initialX = pos.value.x
  initialY = pos.value.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value) return
  pos.value.x = initialX + (event.clientX - startX)
  pos.value.y = initialY + (event.clientY - startY)
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

watch(() => props.show, (visible) => {
  if (!visible) return
  centerPopup()
  isExpanded.value = false
  activeTab.value = 'actividades'
  expandedHistorial.value = []
  selectAll.value = false
  histPage.value = 1
  actPage.value = 1
  actResultantes.value.forEach((row) => { row.selected = false })
})

watch(paginatedActResultantes, checkSelectAll, { deep: true })

onMounted(() => {
  loadMockData()
  if (props.show) centerPopup()
})
</script>

<style scoped>
.ot-detail-popup {
  width: 1200px;
  height: 760px;
  max-width: 96vw;
  max-height: 92vh;
}

.ot-popup-header {
  background: #ffffff;
  color: #00bcd4;
  border-bottom: 1px solid #eceff1;
}

.ot-popup-title {
  color: #00bcd4;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.popup-control {
  color: #b0bec5;
  cursor: pointer;
  font-size: 21px;
  margin-left: 10px;
}

.close-control {
  font-size: 19px;
  font-weight: 800;
}

.ot-popup-body {
  background: #fafafa;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px;
  position: relative;
}

.ot-loader {
  position: absolute;
  inset: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ot-loader .svg-coder {
  width: 150px;
}

.loader-text {
  color: #00838f;
  font-weight: 700;
  margin-top: 15px;
}

.ot-info-card {
  background: #ffffff;
  border: 1px solid #eceff1;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1.2fr 1.8fr 1.2fr 1.2fr 1.2fr;
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px;
}

.form-group label {
  color: #263238;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 6px;
}

.form-control:disabled {
  background: #eeeeee;
  color: #777;
}

.ot-tabs {
  background: #f1f3f4;
  border-bottom: 1px solid #dce3e6;
  display: flex;
  overflow-x: auto;
}

.ot-tab {
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 3px solid transparent;
  color: #546e7a;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  min-width: 160px;
  padding: 14px 18px;
  transition: 0.2s ease;
  white-space: nowrap;
}

.ot-tab:hover,
.ot-tab.active {
  background: #ffffff;
  color: #00bcd4;
}

.ot-tab.active {
  border-bottom-color: #00bcd4;
}

.tab-panel,
.resultantes-card {
  background: #ffffff;
  border: 1px solid #eceff1;
  border-top: 0;
  margin-bottom: 15px;
  padding: 16px;
}

.resultantes-card {
  border-top: 1px solid #eceff1;
  flex: 1;
  min-height: 230px;
}

.section-title {
  color: #263238;
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 12px;
}

.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.ot-table-wrap {
  border: 1px solid #d8d8d8;
  overflow: auto;
  width: 100%;
}

.compact-table {
  max-height: 185px;
}

.historial-table-wrap {
  max-height: 260px;
}

.resultantes-table-wrap {
  min-height: 120px;
  max-height: 220px;
}

.ot-detail-grid {
  border-collapse: collapse;
  min-width: 100%;
  table-layout: fixed;
  width: max-content;
}

.ot-detail-grid th,
.ot-detail-grid td {
  border-bottom: 1px solid #d1d1d1;
  border-right: 1px solid #e0e0e0;
  color: #37474f;
  overflow: hidden;
  padding: 8px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ot-detail-grid th {
  background: #f5f5f5;
  color: #37474f;
  font-size: 13px;
  font-weight: 800;
}

.ot-detail-grid td {
  background: #ffffff;
  font-size: 13px;
}

.historial-grid th:nth-child(1),
.historial-grid td:nth-child(1) { width: 34px; min-width: 34px; max-width: 34px; }
.historial-grid th:nth-child(2),
.historial-grid td:nth-child(2) { width: 190px; min-width: 190px; }
.historial-grid th:nth-child(3),
.historial-grid td:nth-child(3) { width: 190px; min-width: 190px; }
.historial-grid th:nth-child(4),
.historial-grid td:nth-child(4) { width: 190px; min-width: 190px; }
.historial-grid th:nth-child(5),
.historial-grid td:nth-child(5) { width: 120px; min-width: 120px; }
.historial-grid th:nth-child(6),
.historial-grid td:nth-child(6) { width: 150px; min-width: 150px; }
.historial-grid th:nth-child(7),
.historial-grid td:nth-child(7) { width: 230px; min-width: 230px; }
.historial-grid th:nth-child(8),
.historial-grid td:nth-child(8) { width: 95px; min-width: 95px; }

.expand-col,
.select-col {
  text-align: center !important;
}

.expand-row-btn {
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.expand-row-btn .material-icons {
  color: #111;
  font-size: 20px;
}

.ot-link-cell {
  color: #00bcd4 !important;
  font-weight: 800;
}

.subgrid-row td {
  background: #ffffff;
}

.subgrid-toggle-cell {
  text-align: center !important;
  vertical-align: top;
  width: 34px;
}

.subgrid-open-icon {
  color: #111;
  font-size: 18px;
  margin-top: 24px;
}

.subgrid-cell {
  padding: 0 !important;
}

.subgrid-scroll {
  overflow: auto;
  max-height: 150px;
}

.historial-subgrid {
  border-collapse: collapse;
  min-width: 780px;
  width: 100%;
}

.historial-subgrid th,
.historial-subgrid td {
  border-bottom: 1px solid #d1d1d1;
  border-right: 1px solid #d1d1d1;
  padding: 9px;
  text-align: left;
  white-space: nowrap;
}

.historial-subgrid th {
  background: #f5f5f5;
  font-weight: 800;
}

.empty-message {
  color: #90a4ae !important;
  padding: 28px !important;
  text-align: center !important;
}

.detail-pagination {
  justify-content: center;
  padding: 8px 5px 0;
}

.detail-pagination :deep(input) {
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  height: 28px;
  text-align: center;
  width: 42px;
}

.export-history-btn {
  background: #00bcd4;
  border: 0;
  color: #ffffff;
  font-weight: 800;
}

.siniestros-panel {
  padding: 20px 0;
  text-align: center;
}

.siniestro-fields {
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto 20px;
  max-width: 620px;
}

.inline-field {
  align-items: center;
  display: grid;
  gap: 10px;
  grid-template-columns: 80px 1fr;
}

.siniestro-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.siniestro-btn {
  border-radius: 20px;
  padding: 7px 28px;
}

.accept-btn {
  background: #00bcd4;
}

.resultantes-grid {
  min-width: 1250px;
}

.resultantes-grid tr.active-row td {
  background: #d9f6fb !important;
  color: #007985;
  font-weight: 800;
}

.resultantes-footer {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-top: 0;
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr auto 1fr;
  min-height: 44px;
  padding: 6px 10px;
}

.resultantes-footer .detail-pagination {
  grid-column: 2;
  padding: 0;
}

.ot-actions {
  background: #ffffff;
  border-top: 1px solid #eceff1;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 15px 20px;
}

.validate-btn,
.save-btn {
  border-radius: 24px;
  font-size: 16px;
  font-weight: 800;
  padding: 11px 28px;
}

.validate-btn {
  background: #00bcd4;
}

.save-btn {
  background: #4dd0e1;
}

@media (max-width: 960px) {
  .ot-info-card {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .section-header,
  .ot-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .resultantes-footer {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .resultantes-footer .detail-pagination {
    grid-column: auto;
  }
}

@media (max-width: 560px) {
  .ot-info-card,
  .siniestro-fields {
    grid-template-columns: 1fr;
  }

  .ot-tab {
    min-width: 145px;
    padding: 12px;
  }

  .inline-field {
    grid-template-columns: 1fr;
  }

  .validate-btn,
  .save-btn,
  .export-history-btn,
  .btn-cyan {
    width: 100%;
  }
}
</style>
