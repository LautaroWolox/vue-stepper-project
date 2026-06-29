<template>
  <div class="floating-popup" style="width: 1100px; height: 650px; max-width: 95vw; max-height: 90vh;" :class="{ expanded: isExpanded }" :style="!isExpanded ? { top: pos.y + 'px', left: pos.x + 'px' } : {}" v-if="show">
    
    <div class="floating-popup-frame" @dblclick="toggleExpand">
      <div class="popup-header" style="background: white; color: #00bcd4; border-bottom: 1px solid #eceff1;" @mousedown="startDrag">
        <div class="popup-title" style="font-weight: bold; font-size: 16px;">{{ otNumber }}</div>
        <div class="popup-controls">
          <span class="material-icons" style="color: #b0bec5; margin-right: 10px; cursor: pointer;" @click.stop="toggleExpand">{{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}</span>
          <span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold; cursor: pointer;" @click="$emit('close')">close</span>
        </div>
      </div>
    </div>
    
    <div class="popup-body" style="background: #fafafa; padding: 15px; display: flex; flex-direction: column; overflow-y: auto; position: relative;">
      
      <!-- PANTALLA DE CARGA (TIPITO) -->
      <div v-if="isLoading" class="popup-loader" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background: rgba(255,255,255,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="width: 150px;">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/><rect x="55" y="95" width="10" height="25" fill="#78909C"/><rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/><rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/><rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/><g class="code-lines"><rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/><rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/><rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/><rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/></g><rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/><path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/><circle cx="150" cy="50" r="18" fill="#FFB74D"/><path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/><path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/><path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
        </svg>
        <span style="margin-top: 15px; color: #00838f; font-weight: bold;">{{ loadingMsg }}</span>
      </div>

      <div class="form-grid" style="grid-template-columns: 2fr 3fr 2fr 2fr 2fr; margin-bottom: 10px; background: white; padding: 10px; border-radius: 4px; border: 1px solid #eceff1;">
        <div class="form-group"><label>Tarea</label><input type="text" class="form-control" value="DOM - ALTAS HFC" disabled></div>
        <div class="form-group"><label>Domicilio</label><input type="text" class="form-control" value="DE LUJAN NTRA SRA 1525" disabled></div>
        <div class="form-group"><label>Clase Ot</label><input type="text" class="form-control" value="New Connect" disabled></div>
        <div class="form-group"><label>Tecnico Cierre</label><input type="text" class="form-control" value="23TID240" disabled></div>
        <div class="form-group"><label>Nro Cliente</label><input type="text" class="form-control" value="8.10081755121E15" disabled></div>
      </div>

      <div class="nav-tabs">
        <div class="tab-item" :class="{ active: activeTab === 'actividades' }" @click="activeTab = 'actividades'">Actividades</div>
        <div class="tab-item" :class="{ active: activeTab === 'base' }" @click="activeTab = 'base'">Base Instalada</div>
        <div class="tab-item" :class="{ active: activeTab === 'historial' }" @click="activeTab = 'historial'">Historial del domicilio</div>
        <div class="tab-item" :class="{ active: activeTab === 'materiales' }" @click="activeTab = 'materiales'">Materiales</div>
        <div class="tab-item" :class="{ active: activeTab === 'siniestros' }" @click="activeTab = 'siniestros'">Siniestros</div>
      </div>

      <div style="background: white; border: 1px solid #eceff1; border-top: none; padding: 15px; margin-bottom: 15px;">
        
        <div v-show="activeTab === 'actividades'">
          <h4 style="margin-top: 0; color: #263238; font-size: 14px;">Actividades Originales</h4>
          <div class="table-responsive" style="max-height: 150px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead><tr><th>COD ACTIVIDAD</th><th>ACTIVIDAD</th><th>CANTIDAD</th><th>COD CMO</th><th>CMO</th></tr></thead>
              <tbody>
                <tr><td>1285</td><td>Instalar Acometida HFC</td><td>1</td><td>5021497</td><td>INSTALACION DE ACOMETIDA</td></tr>
                <tr><td>90014</td><td>Se instaló CM Internet y Telefonía</td><td>1</td><td>0000001</td><td>NO HAY CMO</td></tr>
                <tr><td>90000</td><td>Se instaló acometida</td><td>1</td><td>0000001</td><td>NO HAY CMO</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'base'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #263238; font-size: 14px;">Bases Instaladas</h4>
            <button class="btn-cyan" @click="consultarBase">CONSULTAR BASE INSTALADA</button>
          </div>
          <div class="table-responsive" style="max-height: 180px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead><tr><th>BASE INSTALADA</th><th>MODELO</th><th>NRO SERIE</th></tr></thead>
              <tbody>
                <tr v-for="(item, i) in paginatedBase" :key="i">
                  <td>{{ item.base }}</td><td>{{ item.modelo }}</td><td>{{ item.serie }}</td>
                </tr>
                <tr v-if="baseData.length === 0">
                  <td colspan="3" style="text-align: center; padding: 30px; color: #90a4ae;">Presione 'CONSULTAR BASE INSTALADA' para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; margin-top: 10px;" v-if="baseData.length > 0">
            <span class="material-icons icon-nav" :class="{disabled: basePage === 1}" @click="basePage = 1">first_page</span>
            <span class="material-icons icon-nav" :class="{disabled: basePage === 1}" @click="basePage > 1 && basePage--">chevron_left</span>
            <span>Página <input type="number" v-model.number="basePage" min="1" :max="totalBasePages" style="width: 40px; text-align: center;"> de {{ totalBasePages }}</span>
            <span class="material-icons icon-nav" :class="{disabled: basePage >= totalBasePages}" @click="basePage < totalBasePages && basePage++">chevron_right</span>
            <span class="material-icons icon-nav" :class="{disabled: basePage >= totalBasePages}" @click="basePage = totalBasePages">last_page</span>
          </div>
        </div>

        <!-- TAB HISTORIAL REPARADA: SEPARADO DETALLE DE NRO OT -->
        <div v-show="activeTab === 'historial'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #263238; font-size: 14px;">Historial del domicilio</h4>
            <button class="btn-cyan-outline" style="background: white; color: #00bcd4; border: 1px solid #00bcd4; font-weight: bold; border-radius: 20px; padding: 8px 15px;">EXPORTAR HISTORIAL COMPLETO</button>
          </div>
          <div class="table-responsive" style="max-height: 200px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead>
                <tr>
                  <!-- SEPARACIÓN LOGRADA AQUÍ PARA QUE NO QUEDE "DETALLENRO OT" -->
                  <th style="width: 70px; text-align: center; border-right: 1px solid #eceff1;">DETALLE</th>
                  <th style="padding-left: 15px;">NRO OT</th>
                  <th>FECHA DE CREACIÓN</th>
                  <th>FECHA CIERRE</th>
                  <th>NRO ACTA</th>
                  <th>ESTADO ACTA</th>
                  <th>EMPRESA CONTRATISTA</th>
                  <th>OT_RED</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hist, i) in paginatedHistorial" :key="i">
                  <td style="text-align: center; border-right: 1px solid #eceff1;">
                    <span class="material-icons" style="color: #00bcd4; cursor: pointer; font-size: 20px;" @click="openHistorialPopup(hist)">visibility</span>
                  </td>
                  <td style="color: #00bcd4; font-weight: bold; padding-left: 15px;">{{ hist.ot }}</td>
                  <td>{{ hist.creacion }}</td>
                  <td>{{ hist.cierre }}</td>
                  <td>{{ hist.acta }}</td>
                  <td>{{ hist.estado }}</td>
                  <td>{{ hist.contra }}</td>
                  <td>{{ hist.red }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; margin-top: 10px;">
            <span class="material-icons icon-nav" :class="{disabled: histPage === 1}" @click="histPage = 1">first_page</span>
            <span class="material-icons icon-nav" :class="{disabled: histPage === 1}" @click="histPage > 1 && histPage--">chevron_left</span>
            <span>Página <input type="number" v-model.number="histPage" min="1" :max="totalHistPages" style="width: 40px; text-align: center;"> de {{ totalHistPages || 1 }}</span>
            <span class="material-icons icon-nav" :class="{disabled: histPage >= totalHistPages}" @click="histPage < totalHistPages && histPage++">chevron_right</span>
            <span class="material-icons icon-nav" :class="{disabled: histPage >= totalHistPages}" @click="histPage = totalHistPages">last_page</span>
          </div>
        </div>

        <!-- Tab 4: Materiales -->
        <div v-show="activeTab === 'materiales'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #263238; font-size: 14px;">Materiales</h4>
            <button class="btn-cyan" @click="consultarMateriales">CONSULTAR MATERIALES</button>
          </div>
          <div class="table-responsive" style="max-height: 180px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead><tr><th>COD MATERIAL</th><th>DESC MATERIAL</th><th>CANTIDAD</th><th>ACCION</th><th>ESTADO</th><th>MATERIAL VALIDADO</th></tr></thead>
              <tbody>
                <tr v-for="(item, i) in paginatedMateriales" :key="i">
                  <td>{{ item.cod }}</td><td>{{ item.desc }}</td><td>{{ item.cant }}</td><td>{{ item.accion }}</td><td>{{ item.estado }}</td><td>{{ item.validado }}</td>
                </tr>
                <tr v-if="materialesData.length === 0">
                  <td colspan="6" style="text-align: center; padding: 30px; color: #90a4ae;">Presione 'CONSULTAR MATERIALES' para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; margin-top: 10px;" v-if="materialesData.length > 0">
            <span class="material-icons icon-nav" :class="{disabled: matPage === 1}" @click="matPage = 1">first_page</span>
            <span class="material-icons icon-nav" :class="{disabled: matPage === 1}" @click="matPage > 1 && matPage--">chevron_left</span>
            <span>Página <input type="number" v-model.number="matPage" min="1" :max="totalMatPages" style="width: 40px; text-align: center;"> de {{ totalMatPages }}</span>
            <span class="material-icons icon-nav" :class="{disabled: matPage >= totalMatPages}" @click="matPage < totalMatPages && matPage++">chevron_right</span>
            <span class="material-icons icon-nav" :class="{disabled: matPage >= totalMatPages}" @click="matPage = totalMatPages">last_page</span>
          </div>
        </div>

        <!-- Tab 5: Siniestros -->
        <div v-show="activeTab === 'siniestros'">
          <div style="padding: 20px 0; text-align: center;">
            <div class="form-grid" style="grid-template-columns: 1fr 1fr; max-width: 600px; margin: 0 auto 20px auto;">
              <div class="form-group" style="flex-direction: row; align-items: center; justify-content: center;"><label style="margin-right: 10px; width: 60px; text-align: right;">Nro EHS</label><input type="text" class="form-control" style="width: 150px;"></div>
              <div class="form-group" style="flex-direction: row; align-items: center; justify-content: center;"><label style="margin-right: 10px; width: 60px; text-align: right;">Nro OI</label><input type="text" class="form-control" style="width: 150px;"></div>
            </div>
            <button class="btn btn-danger" style="border-radius: 20px; padding: 6px 25px; margin-right: 15px;">CANCELAR</button>
            <button class="btn" style="background: #00bcd4; border-radius: 20px; padding: 6px 25px;">ACEPTAR</button>
          </div>
        </div>

      </div>

      <!-- SECCIÓN FIJA INFERIOR -->
      <div style="background: white; border: 1px solid #eceff1; padding: 15px; margin-bottom: 15px; flex: 1; display: flex; flex-direction: column;">
        <h4 style="margin-top: 0; color: #263238; font-size: 14px;">Actividades Resultantes</h4>
        <div class="table-responsive" style="flex: 1; border: 1px solid #e0e0e0;">
          <table class="advanced-grid">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">
                  <!-- SELECT ALL GLOBAL: Selecciona las 50 en todas las paginas -->
                  <input type="checkbox" :checked="selectAll" @change="toggleSelectAllGlobal">
                </th>
                <th>COD ACTIVIDAD</th><th>ACTIVIDAD</th><th>CANTIDAD</th><th>COD CMO</th><th>CMO</th>
                <th>REGLA TIPO</th><th>REGLA APLICAD.</th><th>COMENTARIO</th><th>MOTIVO</th>
                <th>ESTADO ACTIVO</th><th>VALIDADA</th><th>NRO ND/NC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="act in paginatedActResultantes" :key="act.id" :class="{ 'active-row': act.selected }">
                <td style="text-align: center;">
                  <input type="checkbox" v-model="act.selected" @change="checkSelectAll">
                </td>
                <td>{{ act.cod }}</td><td>{{ act.act }}</td><td>{{ act.cant }}</td><td>{{ act.cod_cmo }}</td>
                <td>{{ act.cmo }}</td><td>{{ act.regla }}</td><td>{{ act.aplicad }}</td><td>{{ act.coment }}</td><td>{{ act.motivo }}</td>
                <td>{{ act.estado }}</td><td>N</td><td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-footer" style="margin-top: 0; background: white; border-top: none; padding: 5px 0 0 0;">
          <!-- ICONOS DE EXPORTAR Y ELIMINAR -->
          <div class="grid-footer-left">
            <button class="icon-btn" title="Exportar Seleccionados a Excel" @click="simulateLoad('Exportando a Excel...')"><span class="material-icons" style="font-size: 24px;">file_download</span></button>
            <button class="icon-btn" title="Eliminar Seleccionados" @click="eliminarSeleccionados"><span class="material-icons" style="font-size: 24px;">delete</span></button>
          </div>
          
          <div class="modern-pagination">
            <span class="material-icons icon-nav" :class="{disabled: actPage === 1}" @click="actPage = 1">first_page</span>
            <span class="material-icons icon-nav" :class="{disabled: actPage === 1}" @click="actPage > 1 && actPage--">chevron_left</span>
            <span>Página <input type="number" v-model.number="actPage" min="1" :max="totalActPages" style="width: 40px; text-align: center;"> de {{ totalActPages }}</span>
            <span class="material-icons icon-nav" :class="{disabled: actPage >= totalActPages}" @click="actPage < totalActPages && actPage++">chevron_right</span>
            <span class="material-icons icon-nav" :class="{disabled: actPage >= totalActPages}" @click="actPage = totalActPages">last_page</span>
          </div>
        </div>
      </div>

    </div>

    <!-- BOTONERA INFERIOR GENERAL -->
    <div class="popup-actions" style="background: white; border-top: none; padding: 15px 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 10px 25px;" @click="simulateLoad('Validando Actividades...')">VALIDAR ACTIVIDADES</button>
      <button class="btn" style="background: #4dd0e1; font-weight: bold; border-radius: 20px; padding: 10px 25px;" @click="simulateLoad('Guardando cambios...')">GUARDAR CAMBIOS</button>
    </div>

    <!-- Popup Subgrilla Historial -->
    <SubgrillaHistorialPopup :show="showSubgrilla" :data="historialSeleccionado" @close="showSubgrilla = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
// Asegúrate de tener este archivo creado según el código de la respuesta anterior:
import SubgrillaHistorialPopup from './SubgrillaHistorialPopup.vue'

const props = defineProps(['show', 'otNumber'])
const emit = defineEmits(['close'])

const activeTab = ref('actividades')
const showSubgrilla = ref(false)
const historialSeleccionado = ref(null)

const pos = ref({ x: 0, y: 0 })
const isExpanded = ref(false)
const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0
const isLoading = ref(false)
const loadingMsg = ref('')

/* =========================================
   HISTORIAL DATA: 10 Registros, 7 Detalles
========================================= */
const historialData = ref([])
onMounted(() => {
  for(let i = 1; i <= 10; i++) {
    // Generar 7 detalles distintos para cada OT
    let acts = []
    for(let j = 1; j <= 7; j++) {
      acts.push({
        codigo: `900${j}`, 
        desc: `Actividad Detalle ${j} de la OT ${i}`, 
        cant: '1', ncnd: `ND104${j}`, est_ncnd: 'En Curso', est_act: j % 2 === 0 ? 'S' : 'N'
      })
    }
    historialData.value.push({
      ot: `M009660${i.toString().padStart(2,'0')}`,
      creacion: `10/06/2026 17:10:02`,
      cierre: `13/06/2026 12:04:01`,
      acta: 'A2732', estado: 'Certificada', contra: 'NET AND WORK S.A.', red: 'N',
      actividades: acts
    })
  }
})
const histPage = ref(1)
const histPerPage = ref(4) // Muestro de a 4 para que se vea el paginado rápido
const totalHistPages = computed(() => Math.ceil(historialData.value.length / histPerPage.value))
const paginatedHistorial = computed(() => {
  const start = (histPage.value - 1) * histPerPage.value
  return historialData.value.slice(start, start + histPerPage.value)
})

/* =========================================
   ACTIVIDADES RESULTANTES: 50 REGISTROS
========================================= */
const actResultantes = ref([])
onMounted(() => {
  for(let i = 1; i <= 50; i++) {
    actResultantes.value.push({
      id: i, selected: false, cod: `7050${i.toString().padStart(2, '0')}`,
      act: `ACOMETIDA SOLO INT ${i}`, cant: '1', cod_cmo: `50214${i}`, cmo: 'INST.D/ACOMETIDA HFC',
      regla: 'E3', aplicad: `E3IX00001AR-7050${i}`, coment: '', motivo: 'APLICACION DE REGLAS', estado: 'S'
    })
  }
})
const actPage = ref(1)
const actPerPage = ref(10)
const totalActPages = computed(() => Math.ceil(actResultantes.value.length / actPerPage.value))
const paginatedActResultantes = computed(() => {
  const start = (actPage.value - 1) * actPerPage.value
  return actResultantes.value.slice(start, start + actPerPage.value)
})

// LOGICA SELECT ALL: "Por todas las páginas"
const selectAll = ref(false)

const toggleSelectAllGlobal = (e) => {
  const isChecked = e.target.checked
  selectAll.value = isChecked
  // Se aplica a los 50 registros, no solo a la página actual
  actResultantes.value.forEach(r => { r.selected = isChecked })
}

const checkSelectAll = () => {
  if (actResultantes.value.length === 0) { selectAll.value = false; return; }
  // Chequea si los 50 están marcados para encender/apagar el master
  selectAll.value = actResultantes.value.every(r => r.selected)
}

const eliminarSeleccionados = () => {
  actResultantes.value = actResultantes.value.filter(r => !r.selected)
  selectAll.value = false
  // Si estoy en una página que quedó vacía, vuelvo a la anterior
  if (actPage.value > totalActPages.value && totalActPages.value > 0) {
    actPage.value = totalActPages.value
  } else if (totalActPages.value === 0) {
    actPage.value = 1
  }
}

/* =========================================
   BASE INSTALADA & MATERIALES (25 Y 35 REGISTROS)
========================================= */
const baseData = ref([])
const basePage = ref(1)
const basePerPage = ref(10)
const totalBasePages = computed(() => Math.ceil(baseData.value.length / basePerPage.value))
const paginatedBase = computed(() => {
  const start = (basePage.value - 1) * basePerPage.value; return baseData.value.slice(start, start + basePerPage.value)
})
const consultarBase = () => {
  simulateLoad('Consultando Base Instalada...')
  setTimeout(() => {
    let arr = []
    for(let i=1; i<=25; i++) arr.push({ base: `00:1A:2B:0${i} (CM)`, modelo: 'Sagemcom', serie: `SA1908${i}` })
    baseData.value = arr
  }, 1200)
}

const materialesData = ref([])
const matPage = ref(1)
const matPerPage = ref(10)
const totalMatPages = computed(() => Math.ceil(materialesData.value.length / matPerPage.value))
const paginatedMateriales = computed(() => {
  const start = (matPage.value - 1) * matPerPage.value; return materialesData.value.slice(start, start + matPerPage.value)
})
const consultarMateriales = () => {
  simulateLoad('Consultando Materiales...')
  setTimeout(() => {
    let arr = []
    for(let i=1; i<=35; i++) arr.push({ cod: `MAT-90${i}`, desc: 'Cable Coaxial', cant: i, accion: 'Instalado', estado: 'OK', validado: 'Si' })
    materialesData.value = arr
  }, 1200)
}

/* =========================================
   UTILITIES Y POPUPS
========================================= */
const centerPopup = () => { pos.value = { x: (window.innerWidth - 1100) / 2 > 0 ? (window.innerWidth - 1100) / 2 : 20, y: (window.innerHeight - 650) / 2 > 0 ? (window.innerHeight - 650) / 2 : 20 } }

watch(() => props.show, (newVal) => { 
  if (newVal) { centerPopup(); isExpanded.value = false; activeTab.value = 'actividades'; selectAll.value = false; actResultantes.value.forEach(r => r.selected = false); } 
})

onMounted(() => { if(props.show) centerPopup() })
const simulateLoad = (msg) => { isLoading.value = true; loadingMsg.value = msg; setTimeout(() => { isLoading.value = false }, 1200) }

const openHistorialPopup = (hist) => {
  historialSeleccionado.value = hist
  showSubgrilla.value = true
}

const toggleExpand = () => { isExpanded.value = !isExpanded.value }
const startDrag = (e) => { if (isExpanded.value) return; isDragging.value = true; startX = e.clientX; startY = e.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (e) => { if (!isDragging.value) return; pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY) }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }
</script>