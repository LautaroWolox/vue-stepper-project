<template>
  <div v-if="show" class="floating-popup ot-note-popup" :class="{ expanded: isExpanded }" :style="!isExpanded ? { top: pos.y + 'px', left: pos.x + 'px' } : {}">
    <div class="popup-header ot-header" @mousedown="startDrag">
      <div class="popup-title">{{ otNumber }}</div>
      <div class="popup-controls">
        <span class="material-icons" @click.stop="toggleExpand">{{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}</span>
        <span class="material-icons" @click="$emit('close')">close</span>
      </div>
    </div>

    <div class="popup-body ot-body">
      <div class="ot-info">
        <div><label>Tarea</label><input value="DOM - ALTAS HFC" disabled /></div>
        <div><label>Domicilio</label><input value="DE LUJAN NTRA SRA 1525" disabled /></div>
        <div><label>Clase Ot</label><input value="New Connect" disabled /></div>
        <div><label>Tecnico Cierre</label><input value="23TID240" disabled /></div>
        <div><label>Nro Cliente</label><input value="8.10081755121E15" disabled /></div>
      </div>

      <div class="ot-tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ tab.label }}</button>
      </div>

      <section class="tab-box">
        <div v-show="activeTab === 'actividades'">
          <h4>Actividades Originales</h4>
          <PopupGrid :columns="actividadesCols" :rows="actividades" empty="No hay actividades originales." />
        </div>

        <div v-show="activeTab === 'base'">
          <h4>Base Instalada</h4>
          <PopupGrid :columns="baseCols" :rows="baseInstalada" empty="No hay base instalada para mostrar." />
        </div>

        <div v-show="activeTab === 'historial'">
          <div class="section-title">
            <h4>Historial del domicilio</h4>
            <button class="btn-cyan" @click="exportHistorial">EXPORTAR HISTORIAL COMPLETO</button>
          </div>

          <div class="table-wrap historial-wrap">
            <table class="fm-grid popup-grid">
              <thead>
                <tr>
                  <th class="arrow-col"></th>
                  <th v-for="column in historialCols" :key="column.field">
                    <button class="grid-sort-header" type="button" @click="toggleHistSort(column.field)">
                      <span>{{ column.label }}</span>
                      <span class="sort-arrows" :class="{ active: histSort.field === column.field }">
                        <span :class="{ on: histSort.field === column.field && histSort.direction === 'asc' }">▲</span>
                        <span :class="{ on: histSort.field === column.field && histSort.direction === 'desc' }">▼</span>
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hist in sortedHistorial" :key="hist.ot">
                  <td class="arrow-col"><button class="arrow-btn" @click="openHistorial(hist)"><span class="material-icons">arrow_right</span></button></td>
                  <td class="ot-link">{{ hist.ot }}</td>
                  <td>{{ hist.creacion }}</td>
                  <td>{{ hist.cierre }}</td>
                  <td>{{ hist.acta }}</td>
                  <td>{{ hist.estado }}</td>
                  <td>{{ hist.contra }}</td>
                  <td>{{ hist.red }}</td>
                </tr>
                <tr v-if="sortedHistorial.length === 0"><td class="empty-row" :colspan="historialCols.length + 1">No hay resultados</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'materiales'">
          <div class="section-title">
            <h4>Materiales</h4>
            <button class="btn-cyan" @click="consultarMateriales">CONSULTAR MATERIALES</button>
          </div>
          <PopupGrid :columns="materialCols" :rows="materiales" empty="No se encontraron materiales." />
        </div>

        <div v-show="activeTab === 'siniestros'" class="siniestros-box">
          <div><label>Nro EHS</label><input v-model="siniestro.nroEhs" /></div>
          <div><label>Nro OI</label><input v-model="siniestro.nroOi" /></div>
          <div class="siniestros-actions"><button class="btn-cyan-outline" @click="limpiarSiniestro">CANCELAR</button><button class="btn-cyan" @click="guardarSiniestro">ACEPTAR</button></div>
        </div>
      </section>

      <section class="resultantes">
        <h4>Actividades Resultantes</h4>
        <PopupGrid :columns="resultCols" :rows="resultantes" selectable empty="No hay actividades resultantes." />
      </section>
    </div>

    <div class="popup-actions">
      <button class="btn-cyan" @click="showValidateConfirm = true">VALIDAR ACTIVIDADES</button>
      <button class="btn-cyan" @click="showSaveAlert = true">GUARDAR CAMBIOS</button>
    </div>

    <SubgrillaHistorialPopup :show="showSubgrilla" :data="selectedHistorial" @close="showSubgrilla = false" />
    <FmConfirmDialog :show="showValidateConfirm" message="¿Confirma que desea validar las actividades?" @cancel="showValidateConfirm = false" @confirm="confirmValidate" />
    <FmAlertDialog :show="showMaterialsAlert" message="No se encontraron materiales." @close="showMaterialsAlert = false" />
    <FmAlertDialog :show="showSaveAlert" title="Cambios guardados" message="Los cambios fueron guardados correctamente." @close="showSaveAlert = false" />
  </div>
</template>

<script setup>
import { computed, defineComponent, h, ref, watch } from 'vue'
import SubgrillaHistorialPopup from '../../popup/SubgrillaHistorialPopup.vue'
import FmConfirmDialog from '../../shared/FmConfirmDialog.vue'
import FmAlertDialog from '../../shared/FmAlertDialog.vue'
import { downloadExcel } from '../../../utils/excelExport.js'
import { otHistorialDomicilioMock, otOriginalActivitiesMock, otResultantesMock } from '../../../mocks/otNotePopupMock.js'

const PopupGrid = defineComponent({
  props: {
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    empty: { type: String, default: 'No hay resultados' },
    selectable: { type: Boolean, default: false }
  },
  setup(props) {
    const sortField = ref('')
    const sortDirection = ref('')

    const toggleSort = (field) => {
      if (sortField.value !== field) {
        sortField.value = field
        sortDirection.value = 'asc'
      } else if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc'
      } else {
        sortField.value = ''
        sortDirection.value = ''
      }
    }

    const sortedRows = computed(() => {
      const data = [...props.rows]
      if (!sortField.value || !sortDirection.value) return data
      return data.sort((a, b) => {
        const left = String(a[sortField.value] ?? '')
        const right = String(b[sortField.value] ?? '')
        const result = left.localeCompare(right, 'es', { numeric: true, sensitivity: 'base' })
        return sortDirection.value === 'asc' ? result : -result
      })
    })

    const allSelected = computed(() => props.rows.length > 0 && props.rows.every((row) => row.selected))
    const toggleAll = (event) => props.rows.forEach((row) => { row.selected = event.target.checked })
    const toggleRow = (row, event) => { row.selected = event.target.checked }

    const renderSortHeader = (column) => h('button', { class: 'grid-sort-header', type: 'button', onClick: () => toggleSort(column.field) }, [
      h('span', column.label),
      h('span', { class: ['sort-arrows', { active: sortField.value === column.field }] }, [
        h('span', { class: { on: sortField.value === column.field && sortDirection.value === 'asc' } }, '▲'),
        h('span', { class: { on: sortField.value === column.field && sortDirection.value === 'desc' } }, '▼')
      ])
    ])

    return () => h('div', { class: 'table-wrap' }, [
      h('table', { class: 'fm-grid popup-grid' }, [
        h('thead', [
          h('tr', [
            props.selectable ? h('th', { class: 'check-col' }, [h('input', { type: 'checkbox', checked: allSelected.value, onChange: toggleAll })]) : null,
            ...props.columns.map((column) => h('th', { key: column.field }, [renderSortHeader(column)]))
          ])
        ]),
        h('tbody', sortedRows.value.length ? sortedRows.value.map((row, index) => h('tr', { key: index, class: { selected: row.selected } }, [
          props.selectable ? h('td', { class: 'check-col' }, [h('input', { type: 'checkbox', checked: !!row.selected, onChange: (event) => toggleRow(row, event) })]) : null,
          ...props.columns.map((column) => h('td', { key: column.field }, row[column.field] ?? ''))
        ])) : [h('tr', [h('td', { class: 'empty-row', colspan: props.columns.length + (props.selectable ? 1 : 0) }, props.empty)])])
      ])
    ])
  }
})

const props = defineProps({ show: Boolean, otNumber: String })
defineEmits(['close'])

const tabs = [{ id: 'actividades', label: 'Actividades' }, { id: 'base', label: 'Base Instalada' }, { id: 'historial', label: 'Historial del domicilio' }, { id: 'materiales', label: 'Materiales' }, { id: 'siniestros', label: 'Siniestros' }]
const activeTab = ref('actividades')
const isExpanded = ref(false)
const showSubgrilla = ref(false)
const selectedHistorial = ref(null)
const showValidateConfirm = ref(false)
const showMaterialsAlert = ref(false)
const showSaveAlert = ref(false)
const pos = ref({ x: 60, y: 60 })
const isDragging = ref(false)
const histSort = ref({ field: '', direction: '' })
let startX = 0, startY = 0, initialX = 0, initialY = 0

const actividadesCols = [{ field: 'cod', label: 'COD ACTIVIDAD' }, { field: 'actividad', label: 'ACTIVIDAD' }, { field: 'cantidad', label: 'CANTIDAD' }, { field: 'cmo', label: 'COD CMO' }, { field: 'descCmo', label: 'CMO' }]
const baseCols = [{ field: 'base', label: 'BASE INSTALADA' }, { field: 'modelo', label: 'MODELO' }, { field: 'serie', label: 'NRO SERIE' }]
const materialCols = [{ field: 'cod', label: 'COD MATERIAL' }, { field: 'desc', label: 'DESC MATERIAL' }, { field: 'cantidad', label: 'CANTIDAD' }, { field: 'accion', label: 'ACCION' }, { field: 'estado', label: 'ESTADO' }, { field: 'validado', label: 'MATERIAL VALIDADO' }]
const resultCols = [{ field: 'cod', label: 'COD ACTIVIDAD' }, { field: 'actividad', label: 'ACTIVIDAD' }, { field: 'cantidad', label: 'CANTIDAD' }, { field: 'cmo', label: 'COD CMO' }, { field: 'descCmo', label: 'CMO' }, { field: 'regla', label: 'REGLA TIPO' }, { field: 'aplicada', label: 'REGLA APLICADA' }, { field: 'motivo', label: 'MOTIVO' }, { field: 'estado', label: 'ESTADO ACTIVO' }, { field: 'validada', label: 'VALIDADA' }, { field: 'accion', label: 'ACCION' }]
const historialCols = [{ field: 'ot', label: 'NRO OT' }, { field: 'creacion', label: 'FECHA CREACION OT' }, { field: 'cierre', label: 'FECHA CIERRE' }, { field: 'acta', label: 'NRO ACTA' }, { field: 'estado', label: 'ESTADO ACTA' }, { field: 'contra', label: 'EMPRESA CONTRATISTA' }, { field: 'red', label: 'OT RED' }]

const actividades = ref(otOriginalActivitiesMock.map((item) => ({ ...item })))
const baseInstalada = ref([])
const materiales = ref([])
const historial = ref(otHistorialDomicilioMock.map((item) => ({ ...item, actividades: item.actividades.map((activity) => ({ ...activity })) })))
const resultantes = ref(otResultantesMock.map((item) => ({ ...item })))
const siniestro = ref({ nroEhs: '', nroOi: '' })

const sortedHistorial = computed(() => {
  const data = [...historial.value]
  if (!histSort.value.field || !histSort.value.direction) return data
  return data.sort((a, b) => {
    const left = String(a[histSort.value.field] ?? '')
    const right = String(b[histSort.value.field] ?? '')
    const result = left.localeCompare(right, 'es', { numeric: true, sensitivity: 'base' })
    return histSort.value.direction === 'asc' ? result : -result
  })
})

const toggleHistSort = (field) => {
  if (histSort.value.field !== field) histSort.value = { field, direction: 'asc' }
  else if (histSort.value.direction === 'asc') histSort.value = { field, direction: 'desc' }
  else histSort.value = { field: '', direction: '' }
}

const consultarMateriales = () => { materiales.value = []; showMaterialsAlert.value = true }
const limpiarSiniestro = () => { siniestro.value = { nroEhs: '', nroOi: '' } }
const guardarSiniestro = () => { showSaveAlert.value = true }
const openHistorial = (hist) => { selectedHistorial.value = hist; showSubgrilla.value = true }
const exportHistorial = () => downloadExcel({ filename: 'historial_domicilio.xls', title: 'Historial domicilio', columns: historialCols, rows: historial.value })
const confirmValidate = () => { showValidateConfirm.value = false; showSaveAlert.value = true }
const center = () => { pos.value = { x: Math.max((window.innerWidth - 1100) / 2, 12), y: Math.max((window.innerHeight - 650) / 2, 12) } }
const toggleExpand = () => { isExpanded.value = !isExpanded.value }
const startDrag = (event) => { if (isExpanded.value) return; isDragging.value = true; startX = event.clientX; startY = event.clientY; initialX = pos.value.x; initialY = pos.value.y; document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag) }
const onDrag = (event) => { if (!isDragging.value) return; pos.value.x = initialX + event.clientX - startX; pos.value.y = initialY + event.clientY - startY }
const stopDrag = () => { isDragging.value = false; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag) }

watch(() => props.show, (value) => { if (value) { center(); activeTab.value = 'actividades'; isExpanded.value = false } })
</script>

<style scoped>
.ot-note-popup{width:1100px;height:650px;max-width:96vw;max-height:92vh}.ot-note-popup.expanded{position:fixed!important;inset:14px!important;width:auto!important;height:auto!important;max-width:none!important;max-height:none!important}.ot-header{background:#fff;color:#00a9bd;border-bottom:1px solid #eceff1;cursor:grab}.popup-controls{display:flex;gap:12px;color:#b0bec5;cursor:pointer}.ot-body{background:#fafafa;padding:15px;overflow:auto;max-height:calc(100% - 112px)}.ot-info{display:grid;grid-template-columns:1.2fr 1.6fr 1.2fr 1.2fr 1.2fr;gap:14px;background:#fff;padding:10px;border:1px solid #eceff1}.ot-info label{display:block;font-weight:700;margin-bottom:5px}.ot-info input,.siniestros-box input{width:100%;height:30px;border:1px solid #bdbdbd;border-radius:3px;padding:4px 8px;background:#e9e9e9}.ot-tabs{display:flex;background:#f1f3f4;margin-top:10px;overflow-x:auto;border-bottom:1px solid #d8d8d8}.ot-tabs button{min-width:150px;border:0;border-right:1px solid #e0e0e0;background:transparent;padding:12px;color:#00a9bd;cursor:pointer;font-weight:700}.ot-tabs button.active{background:#fff;color:#455a64;border-top:3px solid #00bcd4}.tab-box,.resultantes{background:#fff;border:1px solid #eceff1;padding:12px}.tab-box{border-top:0}.resultantes{margin-top:10px}.section-title{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px}.section-title h4,.resultantes h4,.tab-box h4{margin:0 0 10px}.section-title h4{margin-bottom:0}.section-title .btn-cyan{margin-right:8px}.table-wrap{overflow:auto;border:1px solid #aebdc7;min-height:125px;max-height:210px;background:#fff}.historial-wrap{max-height:230px}.fm-grid{width:max-content;min-width:100%;border-collapse:separate;border-spacing:0;table-layout:auto}.fm-grid th,.fm-grid td{border-right:1px solid #aebdc7;border-bottom:1px solid #aebdc7;padding:8px;white-space:nowrap;text-align:left}.fm-grid th:first-child,.fm-grid td:first-child{border-left:1px solid #aebdc7}.fm-grid thead th{position:sticky;top:0;z-index:3;background:linear-gradient(180deg,#f7fafb 0%,#eaf0f3 100%);color:#263f4d;border-top:1px solid #8fa2ae;border-bottom:1px solid #8fa2ae}.grid-sort-header{width:100%;border:0;background:transparent;color:#263f4d;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;font:inherit;font-weight:700;cursor:pointer;padding:0}.grid-sort-header:hover{color:#008fa1}.sort-arrows{display:inline-flex;flex-direction:column;gap:0;font-size:9px;line-height:8px;color:#aab5bc;min-width:10px}.sort-arrows .on{color:#00a9bd}.fm-grid tbody tr:nth-child(even) td{background:#fbfcfd}.fm-grid tr.selected td{background:#c8f5fb;color:#004b55}.empty-row{text-align:center!important;color:#607d8b;padding:25px!important}.arrow-col{width:42px;min-width:42px;text-align:center!important}.arrow-btn{border:0;background:transparent;cursor:pointer;color:#111;display:inline-flex;align-items:center;justify-content:center}.arrow-btn .material-icons{font-size:18px}.ot-link{color:#00a9bd;font-weight:800}.check-col{width:38px;min-width:38px;text-align:center!important}.check-col input{width:14px;height:14px;accent-color:#00a9bd}.siniestros-box{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:780px;margin:30px auto}.siniestros-actions{grid-column:1 / -1;display:flex;justify-content:center;gap:14px}.popup-actions{display:flex;justify-content:flex-end;gap:10px;padding:12px 18px;background:#fff}.btn-cyan,.btn-cyan-outline{border-radius:18px;padding:8px 18px;font-weight:500;cursor:pointer;transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease,color .18s ease}.btn-cyan{background:#00a9bd;border:1px solid #00a9bd;color:#fff}.btn-cyan:hover{background:#008fa1;border-color:#008fa1;box-shadow:0 4px 10px rgba(0,143,161,.22)}.btn-cyan-outline{background:#fff;border:1px solid #00a9bd;color:#00a9bd}.btn-cyan-outline:hover{background:#e0f7fa;color:#006f7f;box-shadow:0 4px 10px rgba(0,143,161,.14)}@media(max-width:900px){.ot-info,.siniestros-box{grid-template-columns:repeat(2,minmax(180px,1fr))}.popup-actions,.section-title{flex-direction:column;align-items:stretch}}@media(max-width:560px){.ot-info,.siniestros-box{grid-template-columns:1fr}.btn-cyan,.btn-cyan-outline{width:100%}}
</style>
