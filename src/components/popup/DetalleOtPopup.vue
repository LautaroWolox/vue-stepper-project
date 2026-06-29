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
    
    <div class="popup-body" style="background: #fafafa; padding: 15px; display: flex; flex-direction: column; position: relative; overflow-y: auto;">
      
      <div v-if="isLoading" class="popup-loader" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background: rgba(255,255,255,0.9);">
        <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/><rect x="55" y="95" width="10" height="25" fill="#78909C"/><rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/><rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/><rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/><g class="code-lines"><rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/><rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/><rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/><rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/></g><rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/><path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/><circle cx="150" cy="50" r="18" fill="#FFB74D"/><path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/><path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/><path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
        </svg>
        <span style="margin-top: 15px;">{{ loadingMsg }}</span>
      </div>

      <div class="form-grid" style="grid-template-columns: 2fr 3fr 2fr 2fr 2fr; margin-bottom: 10px; background: white; padding: 10px; border-radius: 4px; border: 1px solid #eceff1;">
        <div class="form-group"><label>Tarea</label><input type="text" class="form-control" value="DOM - ALTAS HFC" disabled></div>
        <div class="form-group"><label>Domicilio</label><input type="text" class="form-control" value="SARMIENTO 2688 /PI/ 3 /DE/ E" disabled></div>
        <div class="form-group"><label>Clase Ot</label><input type="text" class="form-control" value="New Connect" disabled></div>
        <div class="form-group"><label>Tecnico Cierre</label><input type="text" class="form-control" value="13MPD233" disabled></div>
        <div class="form-group"><label>Nro Cliente</label><input type="text" class="form-control" value="20594841" disabled></div>
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
                <tr><td>1301</td><td>Instalar Cablemodem WiFi</td><td>1</td><td>5024591</td><td>INSTALACIÓN CABLEMODEM WIFI CON BOCA</td></tr>
                <tr><td>1513</td><td>Asesoramiento Flow</td><td>1</td><td>0000001</td><td>NO HAY CMO</td></tr>
                <tr><td>1275</td><td>Acometida reconectada</td><td>1</td><td>5021974</td><td>RECONEXIÓN DE ACOMETIDA DOMICILIARIA</td></tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; border-bottom: 1px solid #eceff1; margin-bottom: 10px;">
            <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
            <span>Página <input type="text" value="1" disabled style="width: 30px; text-align: center;"> de 1</span>
            <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
          </div>
        </div>

        <div v-show="activeTab === 'base'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #263238; font-size: 14px;">Bases Instaladas</h4>
            <button class="btn-cyan" @click="consultarBase">CONSULTAR BASE INSTALADA</button>
          </div>
          <div class="table-responsive" style="max-height: 150px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead><tr><th>BASE INSTALADA</th><th>MODELO</th><th>NRO SERIE</th></tr></thead>
              <tbody>
                <tr v-for="(item, i) in baseData" :key="i">
                  <td>{{ item.base }}</td><td>{{ item.modelo }}</td><td>{{ item.serie }}</td>
                </tr>
                <tr v-if="baseData.length === 0">
                  <td colspan="3" style="text-align: center; padding: 30px; color: #90a4ae;">Presione 'CONSULTAR BASE INSTALADA' para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; border-bottom: 1px solid #eceff1; margin-bottom: 10px;">
            <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
            <span>Página <input type="text" value="1" disabled style="width: 30px; text-align: center;"> de {{ baseData.length > 0 ? 1 : 0 }}</span>
            <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
          </div>
        </div>

        <div v-show="activeTab === 'historial'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #263238; font-size: 14px;">Historial del domicilio</h4>
            <div style="display: flex; gap: 10px;">
              <button class="btn-cyan" @click="consultarHistorial">BUSCAR HISTORIAL DOMICILIARIO</button>
              <button class="btn-cyan-outline" style="background: #4dd0e1; color: white; border: none;">EXPORTAR HISTORIAL COMPLETO</button>
            </div>
          </div>
          <div class="table-responsive" style="max-height: 150px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead><tr><th>NRO OT</th><th>FECHA DE CREACIÓN</th><th>FECHA CIERRE</th><th>NRO ACTA</th><th>ESTADO ACTA</th><th>EMPRESA CONTRATISTA</th><th>OT_RED</th></tr></thead>
              <tbody>
                <tr v-for="(item, i) in historialData" :key="i">
                  <td style="color: #00bcd4; font-weight: bold;">{{ item.ot }}</td><td>{{ item.creacion }}</td><td>{{ item.cierre }}</td>
                  <td>{{ item.acta }}</td><td>{{ item.estado }}</td><td>{{ item.contra }}</td><td>{{ item.red }}</td>
                </tr>
                <tr v-if="historialData.length === 0">
                  <td colspan="7" style="text-align: center; padding: 30px; color: #90a4ae;">Presione 'BUSCAR HISTORIAL DOMICILIARIO' para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; border-bottom: 1px solid #eceff1; margin-bottom: 10px;">
            <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
            <span>Página <input type="text" value="1" disabled style="width: 30px; text-align: center;"> de {{ historialData.length > 0 ? 1 : 0 }}</span>
            <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
          </div>
        </div>

        <div v-show="activeTab === 'materiales'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #263238; font-size: 14px;">Materiales</h4>
            <button class="btn-cyan" @click="consultarMateriales">CONSULTAR MATERIALES</button>
          </div>
          <div class="table-responsive" style="max-height: 150px; border: 1px solid #e0e0e0;">
            <table class="advanced-grid">
              <thead><tr><th>COD MATERIAL</th><th>DESC MATERIAL</th><th>CANTIDAD</th><th>ACCION</th><th>ESTADO</th><th>MATERIAL VALIDADO</th></tr></thead>
              <tbody>
                <tr v-for="(item, i) in materialesData" :key="i">
                  <td>{{ item.cod }}</td><td>{{ item.desc }}</td><td>{{ item.cant }}</td><td>{{ item.accion }}</td><td>{{ item.estado }}</td><td>{{ item.validado }}</td>
                </tr>
                <tr v-if="materialesData.length === 0">
                  <td colspan="6" style="text-align: center; padding: 30px; color: #90a4ae;">Presione 'CONSULTAR MATERIALES' para cargar los registros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modern-pagination" style="justify-content: center; padding: 5px; border-bottom: 1px solid #eceff1; margin-bottom: 10px;">
            <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
            <span>Página <input type="text" value="1" disabled style="width: 30px; text-align: center;"> de {{ materialesData.length > 0 ? 1 : 0 }}</span>
            <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
          </div>
        </div>

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

      <div style="background: white; border: 1px solid #eceff1; padding: 15px; margin-bottom: 15px; flex: 1; display: flex; flex-direction: column;">
        <h4 style="margin-top: 0; color: #263238; font-size: 14px;">Actividades Resultantes</h4>
        <div class="table-responsive" style="flex: 1; border: 1px solid #e0e0e0;">
          <table class="advanced-grid">
            <thead>
              <tr>
                <th style="width: 30px;"><input type="checkbox"></th>
                <th>COD ACTIVIDAD</th><th>ACTIVIDAD</th><th>CANTIDAD</th><th>COD CMO</th><th>CMO</th>
                <th>REGLA TIPO</th><th>REGLA APLICAD.</th><th>COMENTARIO</th><th>MOTIVO</th>
                <th>ESTADO ACTIVO</th><th>ACCION</th><th>NRO ND/NC</th>
              </tr>
            </thead>
            <tbody>
              <tr class="active-row">
                <td><input type="checkbox" checked></td><td>1275</td><td>Acometida reconectada</td><td>1</td><td>5021974</td>
                <td>RECONEXIÓN DE ACOMETIDA</td><td>A2</td><td>A2IX00001AR-1275</td><td></td><td></td><td>N</td><td></td><td></td>
              </tr>
              <tr>
                <td><input type="checkbox"></td><td>9076</td><td>Activacion SAM</td><td>1</td><td>0000001</td>
                <td>NO HAY CMO</td><td>A1</td><td>A1ST00004AR-SET</td><td></td><td></td><td>N</td><td></td><td></td>
              </tr>
              <tr>
                <td><input type="checkbox"></td><td>1285</td><td>Instalar Acometida</td><td>1</td><td>5021497</td>
                <td>INSTALACION DE ACOMETIDA</td><td>A1</td><td>A1IX00004AR-1275</td><td></td><td></td><td>N</td><td></td><td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-footer" style="margin-top: 0; background: white; border-top: none; padding: 5px 0 0 0;">
          <div class="grid-footer-left">
            <button class="icon-btn" title="Nueva Actividad" @click="openAltaActividad">
              <span class="material-icons" style="font-size: 24px; font-weight: bold;">add</span>
            </button>
            <button class="icon-btn" title="Eliminar"><span class="material-icons">delete</span></button>
          </div>
          <div class="modern-pagination">
            <span class="material-icons icon-nav">first_page</span><span class="material-icons icon-nav">chevron_left</span>
            <span>Página <input type="text" value="1" disabled style="width: 30px; text-align: center;"> de 1</span>
            <span class="material-icons icon-nav">chevron_right</span><span class="material-icons icon-nav">last_page</span>
          </div>
        </div>
      </div>

    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 15px 20px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 10px 25px;" @click="simulateLoad('Validando y Verificando...')">VALIDAR/VERIFICAR</button>
      <button class="btn" style="background: #4dd0e1; font-weight: bold; border-radius: 20px; padding: 10px 25px;" @click="simulateLoad('Guardando cambios...')">GUARDAR CAMBIOS</button>
    </div>

    <AltaActividadPopup :show="showAltaActividad" @close="showAltaActividad = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import AltaActividadPopup from './AltaActividadPopup.vue'

const props = defineProps(['show', 'position', 'otNumber'])
const emit = defineEmits(['close'])

const activeTab = ref('actividades')
const showAltaActividad = ref(false)

// Estados para almacenar la información cuando se consulta
const baseData = ref([])
const historialData = ref([])
const materialesData = ref([])

const pos = ref({ x: 0, y: 0 })
const isExpanded = ref(false)
const isDragging = ref(false)
let startX = 0, startY = 0, initialX = 0, initialY = 0

const isLoading = ref(false)
const loadingMsg = ref('')

const centerPopup = () => {
  pos.value = {
    x: (window.innerWidth - 1100) / 2 > 0 ? (window.innerWidth - 1100) / 2 : 20,
    y: (window.innerHeight - 650) / 2 > 0 ? (window.innerHeight - 650) / 2 : 20
  }
}

watch(() => props.show, (newVal) => { 
  if (newVal) { 
    centerPopup()
    isExpanded.value = false
    activeTab.value = 'actividades'
    baseData.value = []
    historialData.value = []
    materialesData.value = []
  } 
})

onMounted(() => {
  if(props.show) centerPopup()
})

const simulateLoad = (msg) => {
  isLoading.value = true; loadingMsg.value = msg
  setTimeout(() => { isLoading.value = false }, 1200)
}

// Funciones de carga de las grillas (Mock Data)
const consultarBase = () => {
  simulateLoad('Consultando Base Instalada...')
  setTimeout(() => {
    baseData.value = [
      { base: '00:1A:2B:3C:4D:5E (Cablemodem)', modelo: 'Sagemcom F@ST 3686', serie: 'SA1908A12345' },
      { base: '00:1F:33:4A:2B:11 (Decodificador)', modelo: 'Arris DCX3620', serie: 'AR99283741' }
    ]
  }, 1200)
}

const consultarHistorial = () => {
  simulateLoad('Buscando historial domiciliario...')
  setTimeout(() => {
    historialData.value = [
      { ot: 'J00000000001827364', creacion: '10/01/2026', cierre: '12/01/2026', acta: 'A2540', estado: 'CERRADA', contra: 'TELEWORLD ARGENTINA', red: 'RED-10' },
      { ot: 'J00000000002138475', creacion: '05/03/2026', cierre: '06/03/2026', acta: 'A2610', estado: 'CERRADA', contra: 'AGB SRL', red: 'RED-12' }
    ]
  }, 1200)
}

const consultarMateriales = () => {
  simulateLoad('Recuperando materiales...')
  setTimeout(() => {
    materialesData.value = [
      { cod: 'MAT-992', desc: 'Cable Coaxial RG6 (Metros)', cant: 25, accion: 'Instalado', estado: 'OK', validado: 'Si' },
      { cod: 'MAT-105', desc: 'Conector F de compresión', cant: 4, accion: 'Instalado', estado: 'OK', validado: 'Si' }
    ]
  }, 1200)
}

const openAltaActividad = () => { showAltaActividad.value = true }

const toggleExpand = () => { isExpanded.value = !isExpanded.value }

const startDrag = (e) => {
  if (isExpanded.value) return
  isDragging.value = true
  startX = e.clientX; startY = e.clientY
  initialX = pos.value.x; initialY = pos.value.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}
const onDrag = (e) => {
  if (!isDragging.value) return
  pos.value.x = initialX + (e.clientX - startX); pos.value.y = initialY + (e.clientY - startY)
}
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag)
}
</script>